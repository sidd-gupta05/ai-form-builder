import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_VtFde1KkGMf8@ep-muddy-tooth-a57hvmdq-pooler.us-east-2.aws.neon.tech/Ai-from-builder?sslmode=require',
  }
});
