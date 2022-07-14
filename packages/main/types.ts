export interface Track {
    title: string;
    artist: string;
    album: string;
    album_artist: string;
    track_num: number;
    disc_num: number;
    path: string;
}

export enum TrackKeys {
    title = "title",
    artist = "artist",
    album = "album",
    album_artist = "album_artist",
    track_num = "track_num",
    disc_num = "disc_num",
    path = "path"
}

export interface Album {
    album: string;
    album_artist: string;
}