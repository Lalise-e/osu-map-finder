import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/test/hello', (c) => {
  return c.text('Hello, World!!!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
