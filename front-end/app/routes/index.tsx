// app/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { SiteHeader } from '../components/header/SiteHeader'
import { SiteFooter } from '../components/footer/SiteFooter'
import styles from './index.module.css'
import { useState } from 'react'
import { beatmap } from '../interfaces/beatmap'
import { MapCardList } from '../components/mapcard/MapCard'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const router = useRouter()
  const [mapsets, setMap] = useState<beatmap[][]>()

  if(mapsets === undefined)
    fetchMaps(setMap);
  return (<>
  <SiteHeader/>
  <main className={styles.mainPage}>
    {(mapsets === undefined) ? <p>No maps found</p> : <MapCardList maps={mapsets}/>}
  </main>
  <SiteFooter/></>
  )
}

async function fetchMaps(setter: React.Dispatch<React.SetStateAction<beatmap[][]>>){
  let q: Response | undefined;
  try{
    q = await fetch('http://localhost:16777/beatmap/search?limit=10&beatmapset_id_min=0&download_unavailable=0');
  }catch{
    return;
  }
  if(q === undefined)
    return;
  if(!q.ok){
    console.log(q.status)
    return;
  }
  setter(await q.json());
}