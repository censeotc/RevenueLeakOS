import "dotenv/config";
import { defineConfig } from "prisma/config";

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/revenueleak_os?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  },
});
