export enum Pages {
    Landing = 0,
    Loading = 1,
    Main = 2
}

export type Track = {
    title: string;
    artist: string;
    album: string;
    album_artist: string;
    track_num: number;
    disc_num: number;
    path: string;
}