import {pool} from "../db/pool.js";

const requiredFields = [
    "firstName",
    "surname",
    "firstLineAddress",
    "city",
    "county",
    "postcode",
    "country",
    "email",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const OPENING_HOURS = {
  monday: { open: 8, close: 22 },
  tuesday: { open: 8, close: 22 },
  wednesday: { open: 8, close: 22 },
  thursday: { open: 8, close: 22 },
  friday: { open: 8, close: 22 },
  saturday: { open: 8, close: 21 },
  sunday: { open: 8, close: 18 },
};

const VALID_HOURS_BY_DAY = Object.fromEntries(
  Object.entries(OPENING_HOURS).map(([day, { open, close }]) => [
    day,
    new Set(
      Array.from(
        { length: close - open },
        (_, i) => `${String(open + i).padStart(2, "0")}:00`
      )
    ),
  ])
);

const BANK_HOLIDAYS = new Set([
  // When the fitness centre is closed due to Bank Holiday in England & Wales

  // 2026
  "2026-01-01", // New Year's Day
  "2026-04-03", // Good Friday
  "2026-04-06", // Easter Monday
  "2026-05-04", // Early May bank holiday
  "2026-05-25", // Spring bank holiday
  "2026-08-31", // Summer bank holiday
  "2026-12-25", // Christmas Day
  "2026-12-28", // Boxing Day (substitute day)

  // 2027
  "2027-01-01", // New Year's Day
  "2027-03-26", // Good Friday
  "2027-03-29", // Easter Monday
  "2027-05-03", // Early May bank holiday
  "2027-05-31", // Spring bank holiday
  "2027-08-30", // Summer bank holiday
  "2027-12-27", // Christmas Day (substitute day)
  "2027-12-28", // Boxing Day (substitute day)
]);

// Helper functions

function isValidBookingDate(value) {
    if (typeof value !== "string" || !DATE_RE.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month -1 &&
        date.getUTCDate() === day
    );
}

function isPastBookingSlot(dateString, hourString) {
    const now = new Date();

        const londonDate = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Europe/London",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(now);

        const londonHour = Number(
            new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/London",
            hour: "2-digit",
            hourCycle: "h23",    
        }).format(now)
    );

    if (dateString < londonDate) {
        return true;
    }

    if (dateString > londonDate) {
        return false;
    }

    return Number(hourString.slice(0, 2)) <= londonHour;
}

export class OrderValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "OrderValidationError";
        this.status = 400;
    }
}

function priceToPence(price) {
    const priceString = String(price);

    if (!/^\d+\.\d{2}$/.test(priceString)) {
        throw new OrderValidationError("Invalid product price");
    }

    const [pounds, pence] = priceString.split(".");

    const totalPence = Number(pounds) * 100 + Number(pence);

    if (!Number.isSafeInteger(totalPence) || totalPence <= 0) {
        throw new OrderValidationError("Invalid product price");
    }

    return totalPence;
}

function penceToPounds(pence) {
    const pounds = Math.floor(pence / 100);
    const remainingPence = pence % 100;

    return `${pounds}.${String(remainingPence).padStart(2, "0")}`;
}

// Main function for creating order

export async function createPendingOrder({ userId, customer, items }) {
    if (!userId) {
        throw new OrderValidationError("User ID is required");
    }

    if (!customer || typeof customer !== "object" || Array.isArray(customer)) {
        throw new OrderValidationError("Missing customer details");
    }

    for (const field of requiredFields) {
        if (
            typeof customer[field] !== "string" ||
            customer[field].trim() === ""
        ) {
            throw new OrderValidationError(`Missing field: ${field}`);
        }
    }

    if (!/^\S+@\S+\.\S+$/.test(customer.email.trim())) {
        throw new OrderValidationError("Invalid email address");
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        throw new OrderValidationError("Cart is empty or too large");
    }

    for (const item of items) {
        if (
            !item ||
            typeof item !== "object" || 
            Array.isArray(item) || 
            typeof item.id !== "string" || 
            item.id.trim() === ""    
        ) {
            throw new OrderValidationError("Invalid item");
        }

        if (
            !Number.isInteger(item.quantity) || 
            item.quantity < 1 || 
            item.quantity > 20
        ) {
            throw new OrderValidationError("Invalid quantity");
        }

        if (item.date != null && !isValidBookingDate(item.date)) {
            throw new OrderValidationError("Invalid booking date");
        }
    }

    const seenItems = new Set();

    for (const item of items) {
        const key = JSON.stringify([
            item.id,
            item.date ?? null,
            item.hour ?? null,
        ]);

        if (seenItems.has(key)) {
            throw new OrderValidationError(
                `Duplicate cart item: ${item.id}`
            );
        }

        seenItems.add(key);
    }

    const ids = [...new Set(items.map((item) => item.id))];

    let client;

    try {
        client = await pool.connect();

        const { rows: products } = await client.query(
            `
            SELECT id, category, title, price
            FROM products
            WHERE id = ANY($1)
            `,
            [ids],
        );

        const byId = new Map(
            products.map((product) => [product.id, product]),
        );

        let totalPence = 0;
        const lines = [];
        const lineItems = [];

        for (const item of items) {
            const product = byId.get(item.id);

            if (!product) {
                throw new OrderValidationError(`Unknown product: ${item.id}`);
            }

            if (product.category !== "membership") {
                if (!item.date || !isValidBookingDate(item.date)) {
                    throw new OrderValidationError(
                        `Invalid booking date for ${item.id}`,
                    );
                }

                const day = getBookingDay(item.date);
                const validHours = VALID_HOURS_BY_DAY[day];

                if (!validHours?.has(item.hour)) {
                    throw new OrderValidationError(
                        `Invalid booking time for ${item.id} on ${day}`,
                    );
                }

                if (isPastBookingSlot(item.date, item.hour)) {
                    throw new OrderValidationError(
                        "You cannot book a date or time in the past"
                    );
                }

                if (BANK_HOLIDAYS.has(item.date)) {
                    throw new OrderValidationError(
                        "The fitness centre is closed on bank holidays",

                    );
                }
            }

            const unitPence = priceToPence(product.price);

            totalPence += unitPence * item.quantity;

            if (!Number.isSafeInteger(totalPence)) {
                throw new OrderValidationError(
                    "Invalid order total"
                );
            }

            lines.push({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: penceToPounds(unitPence),
                date: product.category === "membership" ? null : item.date,
                hour: product.category === "membership" ? null : item.hour,
            });

            lineItems.push({
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: unitPence,
                },
                quantity: item.quantity,
            });
        }

       
        // Begin the database transaction
        await client.query("BEGIN");

        const { rows } = await client.query(
            `
            INSERT INTO orders (
                user_id,
                first_name,
                surname,
                first_line_address,
                second_line_address,
                city,
                county,
                postcode,
                country,
                email,
                total_price,
                payment_status
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING id
            `,
            [
                userId,
                customer.firstName.trim(),
                customer.surname.trim(),
                customer.firstLineAddress.trim(),
                typeof customer.secondLineAddress === "string"
                    ? customer.secondLineAddress.trim()
                    : null,
                customer.city.trim(),
                customer.county.trim(),
                customer.postcode.trim(),
                customer.country.trim(),
                customer.email.trim(),
                penceToPounds(totalPence),
                "pending_payment",
            ],
        );

        const orderId = rows[0].id;

        for (const line of lines) {
            await client.query(
                `
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    quantity,
                    unit_price,
                    date,
                    hour
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [
                    orderId,
                    line.productId,
                    line.quantity,
                    line.unitPrice,
                    line.date,
                    line.hour,
                ],
            );
        }

        // Commit only after all inserts succeed
        await client.query("COMMIT");

        return {
            orderId,
            totalPence,
            lineItems,
        };
    } catch (error) {
        if (client) {
            try {
                await client.query("ROLLBACK");
            } catch (rollbackError) {
                console.log("Failed to roll back order:", rollbackError);
            }
        }

        throw error;
    } finally {
        client?.release();
    }
   
}

function getBookingDay(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    return days[date.getUTCDay()];
}

