import { beatmap } from '../../../interfaces/beatmap'
import styles from './diff.module.css'

export function DiffSelector({activeMap, mapset, setter}: {activeMap: beatmap, mapset: beatmap[], setter: React.Dispatch<React.SetStateAction<beatmap>>}){
    return (<div className={styles.row}>
        {mapset.map((m, i) => {
            return (<div key={`radio-${m.beatmap_id}`} className={(mapset.indexOf(m, 0) === mapset.indexOf(activeMap)) ? styles.active : styles.passive}>
            <input
            name={`radioset-${m.beatmapset_id}`}
            onChange={() => setter(mapset[i])}
            type='radio'
            checked={mapset.indexOf(m, 0) === mapset.indexOf(activeMap)}
            />
        </div>)})}
    </div>)
}