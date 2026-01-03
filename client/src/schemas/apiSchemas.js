import { z } from 'zod';

// Basic Types
const MongoID = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional();
const DateString = z.string().or(z.date()).transform((val) => new Date(val));

// User Schema (Public Profile view)
export const UserSchema = z.object({
    _id: MongoID,
    name: z.string(),
    email: z.string().email().optional(), // Might be hidden
    role: z.enum(['donor', 'ngo', 'admin']).optional(),
    isVerified: z.boolean().optional()
});

// Donation Schema
export const DonationSchema = z.object({
    _id: MongoID,
    foodName: z.string().default('Unknown Item'),
    quantity: z.string().default(''),
    pickupLocation: z.string().optional(),
    status: z.enum(['available', 'assigned', 'collected', 'delivered', 'expired']).default('available'),
    donationStatus: z.enum(['pending', 'accepted', 'assigned', 'distributed', 'rejected']).optional(),
    createdAt: DateString,
    donor: UserSchema.optional().or(z.string().optional()), // Can be object or ID
    type: z.literal('donation').default('donation'), // Enhanced field for UI
    foodType: z.string().optional(),
    servings: z.number().optional().or(z.string().transform(Number)),
    expiryTime: DateString.optional(),
    contactPhone: z.string().optional(),
    message: z.string().optional(),
    usageProofImages: z.array(z.string()).optional(),
    usageProofDescription: z.string().optional()
});

// Request Schema
export const RequestSchema = z.object({
    _id: MongoID,
    itemsNeeded: z.string().default('Unknown Request'),
    quantityNeeded: z.string().default(''),
    status: z.enum(['active', 'fulfilled', 'cancelled']).default('active'),
    createdAt: DateString,
    requester: UserSchema.optional().or(z.string().optional()),
    type: z.literal('request').default('request')
});

// Money Donation Schema
export const MoneySchema = z.object({
    _id: MongoID,
    amount: z.number().or(z.string().transform(Number)).default(0),
    donor: UserSchema.optional().or(z.string().optional()),
    transactionDate: DateString.optional(),
    usageProofImages: z.array(z.string()).optional(),
    usageProofDescription: z.string().optional(),
    type: z.literal('money').default('money')
});

// Admin Analytics Schema
export const AnalyticsSchema = z.object({
    totalDonations: z.number().default(0),
    totalRequests: z.number().default(0),
    mealsServed: z.number().default(0),
    totalMoney: z.number().default(0),
    ngoCount: z.number().default(0)
});

// API Response Wrappers
export const DonationListResponse = z.object({
    success: z.boolean(),
    data: z.array(DonationSchema).default([])
});

export const RequestListResponse = z.object({
    success: z.boolean(),
    data: z.array(RequestSchema).default([])
});

export const MoneyListResponse = z.object({
    success: z.boolean(),
    data: z.array(MoneySchema).default([])
});
