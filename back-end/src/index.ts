import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';
import TestEndpoint from './endpoints/test.ts';
import BeatmapEndpoint from './endpoints/beatmap.ts';

const app = new Hono()

app.route('/test', TestEndpoint);
app.route('/beatmap', BeatmapEndpoint)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
})
