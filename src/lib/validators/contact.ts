import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const csvContactRowSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  tags: z.string().optional(),
  source: z.string().optional(),
});
