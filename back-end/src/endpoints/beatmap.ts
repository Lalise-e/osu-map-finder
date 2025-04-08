import { Hono } from 'hono';
import { beatmaps } from '../db/schema.ts';
import db from '../db.ts';
import { sql } from 'drizzle-orm';

const app = new Hono();
const maxItemsPerPage: number = 30;

app.get('/random', async (c) => {
    let limit: number = Number(c.req.query('limit'));
    if(Number.isNaN(limit))
        limit = 1;
    else if(limit > maxItemsPerPage)
        limit = maxItemsPerPage;
    return c.json({
      beatmaps: await db.select().from(beatmaps).orderBy(sql.raw('RANDOM()')).limit(limit)
    });
  })

app.get('/search', (c) => {
    return c.text('Not Implemented');
})

export default app;