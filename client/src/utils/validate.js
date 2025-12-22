import { toast } from 'react-hot-toast';

/**
 * Validates data against a Zod schema.
 * Safely handles errors without crashing the app.
 * 
 * @param {any} data - The data to validate (usually res.data)
 * @param {import('zod').ZodSchema} schema - The Zod schema
 * @param {string} fallbackMessage - Message to log if validation fails
 * @returns {any} - The validated data (or a safe default if parsing fails)
 */
export const validateResponse = (data, schema, fallbackMessage = "API Validation Failed") => {
    const result = schema.safeParse(data);

    if (!result.success) {
        console.error(`❌ ${fallbackMessage}`, result.error.format());

        // In development, showing a toast helps catch schema drift.
        // In production, might want to be silent or log to Sentry.
        if (import.meta.env.DEV) {
            console.warn("Schema validation failed. Check console for details.");
        }

        // Try to return something usable if possible, or null
        // Zod doesn't auto-fix, so we rely on the caller or default values in schema if passed 'undefined'
        // But here 'data' exists but is wrong.
        return null;
    }

    return result.data;
};
