import { Hono } from 'hono';
import { beatmaps, beatmapsets } from '../db/schema.ts';
import db from '../db.ts';
import { eq, sql, asc, desc } from 'drizzle-orm';
import { date } from 'drizzle-orm/mysql-core';

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
    IDs.forEach((ID) => {
        promises.push(db.select().from(beatmaps).where(eq(beatmaps.beatmapset_id, ID.beatmapset_id)).orderBy(asc(beatmaps.diff_overall)));
    })
    await Promise.all(promises).then((values) => values.forEach((value) => {
        result.push(value);
    }));
    return c.json(result, 200);
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
            case typeof '':
                term = parseString(name, c.req.query(name));
                break;
            case typeof new Date():
                term = parseDate(name, lookup);
                break;
        }
        if(term === '')
            continue;
        SqlQuery = (SqlQuery === '') ? term : `${SqlQuery} AND ${term}`;
        console.log(SqlQuery);
    }
    
    const IDs = await db.select().from(db.selectDistinct({beatmapset_id: beatmaps.beatmapset_id}).from(beatmaps).where(sql.raw(SqlQuery)).as('beatmapset_ids')).orderBy(sql.raw('RANDOM()')).limit(limit);
    const promises: Promise<mapType[]>[] = [];
    const result: mapType[][] = [];
    IDs.forEach((id) => {
        promises.push(db.select().from(beatmaps).where(eq(beatmaps.beatmapset_id, id.beatmapset_id)).orderBy(asc(beatmaps.mode), desc(beatmaps.difficultyrating)));
    })
    await Promise.all(promises).then((values) => values.forEach((value) => {
        result.push(value);
    }));
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

function parseString(propertyName: string, propertyInput: string | undefined): string{
    if(propertyInput === undefined)
        return '';
    //I have no idea if this is good or not but I am just gonna go with it because I am lazy.
    return `(POSITION(\'${sanitiseString(propertyInput.toLowerCase())}\' IN LOWER(${propertyName})) > 0)`
}

function parseDate(propertyName: string, lookup: Record<string,string>): string{
    let result: string = parseSingleDate(propertyName, lookup[propertyName], '=');
    if(result !== '')
        return result;
    result = parseSingleDate(`${propertyName}`, lookup[`${propertyName}_max`], ">");
    const term: string = parseSingleDate(`${propertyName}`, lookup[`${propertyName}_min`], "<")
    result += (term === '') ? '' : `${(result === '') ? '' : ' AND '}${term}`;
    return result;
}

function parseSingleDate(propertyName: string, propertyValue: string, booleanOperator: string){
    const dateNumber: number = Date.parse(propertyValue);
    let date: Date = new Date(dateNumber);
    if(Number.isNaN(dateNumber))
        return '';
    return `(TIMESTAMP \'${formatDate(date)}\' ${booleanOperator} ${propertyName})`;
}

function formatDate(date: Date): string{
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`;
}

function sanitiseString(text: string): string{
    return text.replaceAll('\'','\'\'')
}
export default app;