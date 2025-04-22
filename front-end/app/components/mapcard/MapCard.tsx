import styles from './mapCard.module.css';
import { beatmap } from "../../interfaces/beatmap";
import { useState } from 'react';
import { DiffSelector } from './diffSelector/DiffSelector';

export function MapCardList({maps}: {maps: beatmap[][]}){
    return(<section className={styles.list}>
        {maps.map(m => {
            return (<MapCard mapset={m} key={`mapset-${m[0].beatmapset_id}`}/>)
        })}
    </section>);
}

function MapCard({mapset}: {mapset: beatmap[]}){
    const [activeMap, setMap] = useState(mapset[0]);
    return(<article className={styles.card}>
        <figure>
            <img src={`https://assets.ppy.sh/beatmaps/${activeMap.beatmapset_id}/covers/list@2x.jpg`} alt={`${activeMap.title} background`}/>
        </figure>
        <header>
            <h2>{activeMap.title}</h2>
            <h4>{`${activeMap.artist}`}<br/>{`${activeMap.creator}`}</h4>
            <DiffSelector activeMap={activeMap} mapset={mapset} setter={setMap}/>
        </header>
        <section>
            <h3>{activeMap.version}</h3>
            <p>
                {`Approach Rate: ${activeMap.diff_approach}`}<br/>
                {`Circle Size: ${activeMap.diff_size}`}<br/>
                {`HP Drain: ${activeMap.diff_drain}`}<br/>
                {`Overall Difficulty: ${activeMap.diff_overall}`}
            </p>
            </section>
        </article>);
}