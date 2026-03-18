import { z } from "zod";

export const contactImportRowSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7),
  tags: z.array(z.string()).default([])
});
