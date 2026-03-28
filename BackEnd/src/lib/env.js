import dotenv from "dotenv"

dotenv.config({quiet: true}); //removes the warning

export const ENV={
    PORT: process.env.PORT || 5000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV || "development",

    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,

    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,

    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

    // --- eSewa ---
    ESEWA_MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE,
    ESEWA_SECRET_KEY: process.env.ESEWA_SECRET_KEY,
    ESEWA_PAYMENT_URL: process.env.ESEWA_PAYMENT_URL,
    ESEWA_STATUS_URL: process.env.ESEWA_STATUS_URL,

    // --- Khalti ---
    KHALTI_SECRET_KEY: process.env.KHALTI_SECRET_KEY,
    KHALTI_PUBLIC_KEY: process.env.KHALTI_PUBLIC_KEY,
    KHALTI_INITIATE_URL: process.env.KHALTI_INITIATE_URL,
    KHALTI_LOOKUP_URL: process.env.KHALTI_LOOKUP_URL,
}