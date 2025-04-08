import { drizzle } from 'drizzle-orm/node-postgres';

export default drizzle(`postgresql://postgres:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`);