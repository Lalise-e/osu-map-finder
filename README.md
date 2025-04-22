# Map Finder

This is a tool to search for beatmaps in the video game [osu!](https://osu.ppy.sh/) prerequisite knowledge of that game will help you to a degree when using this tool.

# How to run

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
