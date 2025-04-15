// app/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { SiteHeader } from '../components/header/SiteHeader'
import { SiteFooter } from '../components/footer/SiteFooter'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const router = useRouter()

  return (<><SiteHeader/>
  <SiteFooter/></>
  )
}