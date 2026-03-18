import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zip: z.string().max(10).optional(),
  tags: z.array(z.string()).optional(),
  optedInSms: z.boolean().optional(),
  optedInEmail: z.boolean().optional(),
  source: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export const contactUpdateSchema = contactSchema.partial();

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
