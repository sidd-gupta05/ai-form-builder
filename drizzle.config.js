import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_VUHkaX6SYp3F@ep-damp-boat-a8km6cjc-pooler.eastus2.azure.neon.tech/ai-form-buider?sslmode=require',
  }
});
