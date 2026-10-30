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

export class OrderValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "OrderValidationError";
        this.status = 400;
    }
}

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

    const ids = [...new Set(items.map((item) => item.id))];

    const { rows: products } = await pool.query(
        `
        SELECT id, category, title, price
        FROM products
        WHERE id = ANY($1)
        `,
        [ids],
    );

    const byId = new Map(products.map((product) => [product.id, product]));

    let totalPence = 0;
    const lines = [];
    const lineItems = [];

    for (const item of items) {
        const product = byId.get(item.id);

        if (!product) { 
            throw new OrderValidationError(`Unknown product: ${item.id}`);
        };

        if (product.category !== "membership") {
            if (!item.date || !isValidBookingDate(item.date)) {
                throw new OrderValidationError(
                    `Invalid booking date for ${item.id}`
                );
            }
        

            const day = getBookingDay(item.date);
            const validHours = VALID_HOURS_BY_DAY[day];

            if (!validHours.has(item.hour)) {
                throw new OrderValidationError(
                `Invalid booking time for ${item.id} on ${day}`
                );
            }

            if (BANK_HOLIDAYS.has(item.date)) {
                throw new OrderValidationError(
                    "The fitness centre is closed on bank holidays"
                );
            }
        }

        const unitPence = Math.round(Number(product.price) * 100);

        if (!Number.isSafeInteger(unitPence) || unitPence <= 0) {
            throw new OrderValidationError(
                `Invalid price for product: ${item.id}`
            );
        }



        totalPence += unitPence * item.quantity;

        lines.push({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: (unitPence / 100).toFixed(2),
            date: item.date ?? null,
            hour: item.hour ?? null,
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

    return {
        totalPence,
        lines,
        lineItems,
    };
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

