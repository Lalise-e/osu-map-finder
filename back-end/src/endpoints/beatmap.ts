import { Hono } from 'hono';
import { beatmaps, beatmapsets } from '../db/schema.ts';
import db from '../db.ts';
import { eq, sql, asc } from 'drizzle-orm';

const app = new Hono();
const maxItemsPerPage: number = 30;
type mapType = typeof beatmaps.$inferInsert;
type mapsetType = typeof beatmapsets.$inferInsert;
const exampleMap: mapType = (await db.select().from(beatmaps).limit(1))[0];

app.get('/random', async (c) => {
    let limit: number = getLimit(c.req.query('limit'));
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

app.get('/search',async (c) => {
    const limit: number = getLimit(c.req.query('limit'));
    let queryResult: string | undefined;
    let SqlQuery = '';
    const lookup = c.req.query();
    for(const name in exampleMap){
        let term: string = '';
        switch(typeof exampleMap[name as keyof mapType]){
            case typeof Number():
                term = parseNumber(name, lookup);
                break;
            case typeof true:
                term = parseBoolean(name, lookup);
                break;
        }
        if(term === '')
            continue;
        SqlQuery = (SqlQuery === '') ? term : `${SqlQuery} AND ${term}`;
        console.log(SqlQuery);
    }
    const result = await db.select().from(beatmaps).where(sql.raw(SqlQuery)).limit(limit);
    return c.json(result, 501);
})

function getLimit(limitString: string | undefined): number{
    let limit: number = Number(limitString);
    if(Number.isNaN(limit))
        return 1;
    if(limit > maxItemsPerPage)
        return maxItemsPerPage;
    return limit;
}

function parseNumber(propertyName: string, lookup: Record<string, string>): string{
    //Checks if there is an exact value specified and if not checks for a range.
    if(!Number.isNaN(Number(lookup[propertyName])))
        return `(${propertyName} = ${lookup[propertyName]})`;
    let query: string = '';
    if(!Number.isNaN(Number(lookup[`${propertyName}_max`])))
        query = `(${propertyName} <= ${lookup[`${propertyName}_max`]})`;
    query += (Number.isNaN(Number(lookup[`${propertyName}_min`]))) ? ''
    : `${/*Seperates the two boolean terms with an " AND ".*/(query === '' ? '' : ' AND ')}(${propertyName} >= ${lookup[`${propertyName}_min`]})`;
    return query;
}

function parseBoolean(propertyName: string, lookup: Record<string, string>): string{
    if(lookup[propertyName] == undefined)
        return '';
    return `(${propertyName} = ${(lookup[propertyName] === '1') ? 'TRUE' : 'FALSE'})`;
}

export default app;