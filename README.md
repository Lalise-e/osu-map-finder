# Map Finder

This is a tool to search for beatmaps in the video game [osu!](https://osu.ppy.sh/) prerequisite knowledge of that game will help you to a degree when using this tool.

## How to run

1. Set up a Postgresql server, there's plenty of better resources on how to do this elsewhere on the internet so I won't be doing it here.

2. Clone this repo with `git clone https://github.com/Lalise-e/osu-map-finder`

3. Run the following commands from the repository main folder
```
cd ./back-end
npm install
cd ../front-end
npm install
```
4. Next you wanna create a file in `/back-end` titled `.env` and put this in it and put the relevant information in the variables. Host for me during testing has been `localhost:5432` so yours should probably look similar, it depends on what port your DB is using
```
DATABASE_HOST=
DATABASE_PASSWORD=
DATABASE_NAME=
```

6. Visit `http://localhost:16777/test/seed` to seed the database.

7. Run `npm run dev` from `/back-end` and `/front-end` (you'll need to terminals for this) and go to `http://localhost:3000` and you should now see data load in from the database into the web app.

## Documentation

### Data Structure

There are two tables `beatmaps` and `beatmapsets`. Currently `beatmapsets` is not being used so it will not be described here, but it is essential for some planned functionality.

#### beatmaps

|Column Name|Type|Description|Can be null?|
|-----------|----|-----------|------------|
|beatmap_id|int32|ID of the beatmap, primary key|no|
|beatmapset_id|int32|ID of the set the beatmap belongs to|no|
|creator_id|int32|User ID of the mapper|no|
|favourite_count|int32|How many favourites the mapset has|no|
|max_combo|int32|Highest possible combo|no|
|playcount|int32|Amount of registered plays on the map|no|
|passcount|int32|Amount of registered passes on the map|no|
|count_normal|int32|Amount of hit circles in the map|no|
|count_slider|int32|Amount of sliders in the map|no|
|count_spinner|int32|Drain time of the map i. e. the amount of time in a map that is actually playable|no|
|bpm|single|The bpm of the map|no|
|difficultyrating|single|The star rating(sr) of the map|no|
|diff_aim|single|The aim component of the sr|no|
|diff_speed|single|The speed component of the sr|no|
|diff_size|single|Circle Size(CS)|no|
|diff_overall|single|Overall Difficulty(OD)|no|
|diff_approach|single|Approach Rate (AR)|no|
|diff_drain|single|HP Drain Rate (HP)|no|
|rating|single|A score from 0-10 based on the ratings users have given the map|no|
|approved|int16|Ranked status of the map where 4 = loved, 3 = qualified, 2 = approved, 1 = ranked, 0 = pending, -1 = WIP and -2 = graveyard|no|
|mode|int16|Gamemode of the map where 0 = osu/standard, 1 = taiko, 2 = catch the beat and 3 = mania|no|
|genre_id|int16|Music genre of the song where 0 = any, 1 = unspecified, 2 = video game, 3 = anime, 4 = rock, 5 = pop, 6 = other, 7 = novelty, 9 = hip hop, 10 = electronic, 11 = metal, 12 = classical, 13 = folk and 14 = jazz|no|
|language_id|int16|Language of the song where 0 = any, 1 = unspecified, 2 = english, 3 = japanese, 4 = chinese, 5 = instrumental, 6 = korean, 7 = french, 8 = german, 9 = swedish, 10 = spanish, 11 = italian, 12 = russian, 13 = polish and 14 = other|no|
|storyboard|boolean|If the map has a storyboard|no|
|video|boolean|If the map has a background video|no|
|download_unavailable|boolean|If the map is avaiable to download|no|
|audio_unavailable|boolean|If the map download has audio. If it's missing audio that is most commonly due to DMCA conflicts|no|
|title|string|The romanized title of a song|no|
|title_unicode|string|The original title of a song, is null if the original title was not in need of being romanized|yes|
|artist|string|The romanized name of the artist/group of the song|no|
|artist_unicode|string|The original name of the artist/group, is null if the original title was not in need of being romanized|yes|
|version|string|The name of the map's difficulty, it's decided by the mapper|
|source|string|The name of the media where a song is originally from e. g. a movie or tv-show for original scores. Is left blank if it's not from a piece of media|no|
|creator|string|Name of the mapper at the time of the last map update|no|
|tags|string|Space delimited list of tags manually added by the mapper for the sake of easier word search|no|
|file_md5|string|The MD5 hash of the map file|no|
|submit_date|timestamp|The date the map was originally submitted on, this might not be the same across an entire set|yes|
|approved_date|timestamp|The date where the map was loved/qualified/approved/ranked, this might not be the same across an entire set|yes|
|last_update|timestamp|The date of the last update to the map, this might not be the same across an entire set|yes|
