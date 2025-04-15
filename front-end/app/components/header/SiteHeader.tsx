import styles from './header.module.css';

export function SiteHeader({text}: {text?: string | undefined}){
    if(text === undefined)
        text = 'osu!map db'
    return(<header className={styles.header}>
        <h1>{text}</h1>
    </header>)
}