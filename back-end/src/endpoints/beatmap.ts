import { Hono } from 'hono';
import { beatmaps, beatmapsets } from '../db/schema.ts';
import db from '../db.ts';
import { eq, sql, asc } from 'drizzle-orm';

const app = new Hono();
const maxItemsPerPage: number = 30;
type mapType = typeof beatmaps.$inferInsert;
type mapsetType = typeof beatmapsets.$inferInsert;

app.get('/random', async (c) => {
    let limit: number = Number(c.req.query('limit'));
    if(Number.isNaN(limit))
        limit = 1;
    else if(limit > maxItemsPerPage)
        limit = maxItemsPerPage;
    const IDs: mapsetType[] = await db.select().from(beatmapsets).orderBy(sql.raw('RANDOM()')).limit(limit);
    const result: mapType[][] = [];
    const promises: Promise<mapType[]>[] = [];
    IDs.forEach(async (ID) => {
        promises.push(db.select().from(beatmaps).where(eq(beatmaps.beatmapset_id, ID.beatmapset_id)).orderBy(asc(beatmaps.diff_overall)));
    })
    await Promise.all(promises).then((values) => values.forEach((value) => {
        result.push(value);
    }));
    return c.json({
      result
    }, 200);
})
})

app.get('/search', (c) => {
    return c.text('Not Implemented');
})

export default app;