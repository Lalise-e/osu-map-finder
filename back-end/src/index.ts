import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import 'dotenv/config';
import TestEndpoint from './endpoints/test.ts';
import BeatmapEndpoint from './endpoints/beatmap.ts';

const app = new Hono()

app.use('/test/*', cors());
app.use('/beatmap/*', cors({
  origin: 'http://localhost:3000'
}));

app.route('/test', TestEndpoint);
app.route('/beatmap', BeatmapEndpoint)

serve({
  fetch: app.fetch,
  port: 16777
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
})
