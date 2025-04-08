import { Hono } from 'hono';
import 'dotenv/config';
import { beatmapsets, beatmaps } from '../db/schema.ts';
import { sql } from 'drizzle-orm';
import ParseMysqlDate from '../timeConverter.ts';
import maps from '../../Seed/maps.json' with {type: 'json'};
import db from '../db.ts';

const app = new Hono();

app.get('/random', async (c) => {
    return c.json({
      beatmaps: await db.select().from(beatmaps).orderBy(sql.raw('RANDOM()')).limit(2)
    });
  })
  
  app.get('/delete', async (c) => {
    await db.delete(beatmaps);
    await db.delete(beatmapsets);
    return c.text("Table deleted");
  })
  
  app.get('/hello', (c) => {
    return c.text('Hello, World!!!');
  })
  
  app.get('/seed', async (c) => {
    //This function really needs to be made broken out into sub functions
    type mapType = typeof beatmaps.$inferInsert;
    const mapsets: Map<number, number[]> = new Map<number, number[]>();
    for (const m of maps){
      const map: mapType = {
        beatmap_id: Number(m.beatmap_id),
        beatmapset_id: Number(m.beatmapset_id),
        creator_id: Number(m.creator_id),
        favourite_count: Number(m.favourite_count),
        max_combo: Number(m.max_combo),
        playcount: Number(m.playcount),
        passcount: Number(m.passcount),
        count_normal: Number(m.count_normal),
        count_slider: Number(m.count_slider),
        count_spinner: Number(m.count_spinner),
        hit_length: Number(m.hit_length),
  
        bpm: Number(m.bpm),
        difficultyrating: Number(m.difficultyrating),
        diff_aim: Number(m.diff_aim),
        diff_speed: Number(m.diff_speed),
        diff_size: Number(m.diff_size),
        diff_overall: Number(m.diff_overall),
        diff_approach: Number(m.diff_approach),
        diff_drain: Number(m.diff_drain),
        rating: Number(m.rating),
        
        approved: Number(m.approved),
        mode: Number(m.mode),
        genre_id: Number(m.genre_id),
        language_id: Number(m.language_id),
  
        storyboard: !!Number(m.storyboard),
        video: !!Number(m.video),
        download_unavailable: !!Number(m.download_unavailable),
        audio_unavailable: !!Number(m.audio_unavailable),
  
        title: m.title,
        title_unicode: m.title_unicode,
        artist: m.artist,
        artist_unicode: m.artist_unicode,
        version: m.version,
        source: m.source,
        creator: m.creator,
        tags: m.tags,
        file_md5: m.file_md5,
  
        submit_date: ParseMysqlDate(m.submit_date),
        approved_date: ParseMysqlDate(m.approved_date),
        last_update: ParseMysqlDate(m.last_update),
      };
      await db.insert(beatmaps).values(map);
      if(!mapsets.has(map.beatmapset_id)){
        mapsets.set(map.beatmapset_id, [map.beatmap_id]);
        continue;
      }
      mapsets.get(map.beatmapset_id)?.push(map.beatmap_id);
    }
  
    mapsets.forEach(async (beatmaps, set_id) => {
      await db.insert(beatmapsets).values({beatmapset_id: set_id, beatmaps: beatmaps});
    })
    return c.text('Seed completed');
  })

export default app;