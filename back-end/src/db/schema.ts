import { relations } from 'drizzle-orm';
import { boolean, date, integer, pgTable, real, smallint, timestamp, varchar } from 'drizzle-orm/pg-core';

export const beatmaps = pgTable('beatmaps', {
  beatmap_id: integer().primaryKey().unique().notNull(),
  beatmapset_id: integer().notNull(),
  creator_id: integer().notNull(),
  favourite_count: integer().notNull(),
  max_combo: integer().notNull(),
  playcount: integer().notNull(),
  passcount: integer().notNull(),
  count_normal: integer().notNull(),
  count_slider: integer().notNull(),
  count_spinner: integer().notNull(),
  hit_length: integer().notNull(),

  bpm: real().notNull(),
  difficultyrating: real().notNull(),
  diff_aim: real().notNull(),
  diff_speed: real().notNull(),
  diff_size: real().notNull(),
  diff_overall: real().notNull(),
  diff_approach: real().notNull(),
  diff_drain: real().notNull(),
  rating: real().notNull(),

  approved: smallint().notNull(),
  mode: smallint().notNull(),
  genre_id: smallint().notNull(),
  language_id: smallint().notNull(),

  storyboard: boolean().notNull(),
  video: boolean().notNull(),
  download_unavailable: boolean().notNull(),
  audio_unavailable: boolean().notNull(),

  title: varchar().notNull(),
  title_unicode: varchar(),
  artist: varchar().notNull(),
  artist_unicode: varchar(),
  version: varchar().notNull(),
  source: varchar().notNull(),
  creator: varchar().notNull(),
  tags: varchar().notNull(),
  file_md5: varchar().notNull(),

  //These needs to have their data type changed to Date
  submit_date: timestamp(),
  approved_date: timestamp(),
  last_update: timestamp()
});

export const beatmapsets = pgTable('beatmapsets', {
  beatmapset_id: integer().primaryKey().unique().notNull(),
  beatmaps: integer().array()
})