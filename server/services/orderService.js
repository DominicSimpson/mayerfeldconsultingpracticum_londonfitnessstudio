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
}