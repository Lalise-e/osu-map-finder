export interface beatmap {
    beatmap_id: number
    beatmapset_id: number
    creator_id: number
    favourite_count: number
    max_combo: number
    playcount: number
    passcount: number
    count_normal: number
    count_slider: number
    count_spinner: number
    hit_length: number
    bpm: number
    difficultyrating: number
    diff_aim: number
    diff_speed: number
    diff_size: number
    diff_overall: number
    diff_approach: number
    diff_drain: number
    rating: number
    approved: number
    mode: number
    genre_id: number
    language_id: number
    storyboard: boolean
    video: boolean
    download_unavailable: boolean
    audio_unavailable: boolean
    title: string
    title_unicode: string | null
    artist: string
    artist_unicode: string | null
    version: string
    source: string
    creator: string
    tags: string
    file_md5: string
    submit_date: Date
    approved_date: Date
    last_update: Date
  }
  