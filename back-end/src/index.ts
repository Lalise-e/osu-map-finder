import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './db/schema.ts';
import { env } from 'process';
import { sql } from 'drizzle-orm';

const db = drizzle(`postgresql://postgres:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`)
// console.log(await db.execute("select 1"))

const app = new Hono()
app.get('/', async (c) => {
  const user: typeof usersTable.$inferInsert = {
    name: "John 51",
    age: 30,
    email: "Jogn@mail.org"
  }
  await db.insert(usersTable).values(user);
  console.log("Welcome John 51");
  const users = await db.select().from(usersTable);
  console.log(users);
  return c.text("Done!");
})

app.get('/test/random', async (c) => {
  return c.json({
    user: await db.select().from(usersTable).orderBy(sql.raw('RANDOM()')).limit(2)
  });
})

app.get('/test/delete', async (c) => {
  await db.delete(usersTable);
  return c.text("Table deleted");
})

app.get('/test/hello', (c) => {
  return c.text('Hello, World!!!');
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
})
