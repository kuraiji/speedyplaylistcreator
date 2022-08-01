import * as sqlite from "sqlite"
import envPaths from "env-paths";
import {Album, Track, TrackKeys} from "./types"
import * as sqlite3 from "sqlite3";
import {promises} from "fs";

const TABLE_NAME = "tracks"

class PlaylistDatabase {
    private readonly dbPath: string;

    constructor() {
        const paths = envPaths("SpeedyPlaylistCreator")
        const pathSeparator = process.platform == "win32" ? "\\" : "/";
        this.dbPath = `${paths.data}${pathSeparator}playlistbuilder.db`;

        promises.mkdir(paths.data).catch((err) => {console.log(err)}).finally(() => {
            this.getDatabase().then((db) => {
                db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                             ${TrackKeys.title} text not null, 
                             ${TrackKeys.artist} text not null, 
                             ${TrackKeys.album} text not null, 
                             ${TrackKeys.album_artist} text not null, 
                             ${TrackKeys.track_num} number not null, 
                             ${TrackKeys.disc_num} number not null, 
                             ${TrackKeys.path} text primary key)`).then();
            });
        });
    }

    async getDatabase() : Promise<sqlite.Database> {
        return sqlite.open({filename: this.dbPath, driver: sqlite3.cached.Database});
    }

    quoteSafety(original: string) : string {
        return original.replaceAll('\'', '\'\'');
    }

    async addTrack(track: Track) {
        const db = await this.getDatabase();
        const stmt = await db.prepare(`INSERT INTO ${TABLE_NAME} VALUES (?,?,?,?,?,?,?)`);
        await stmt.run(track[TrackKeys.title], track[TrackKeys.artist], track[TrackKeys.album], track[TrackKeys.album_artist], track[TrackKeys.track_num], track[TrackKeys.disc_num], track[TrackKeys.path]);
        await stmt.finalize();
    }

    async selectAllAlbums() : Promise<Array<Album>> {
        const db = await this.getDatabase();
        return await db.all<Array<Album>>(`SELECT DISTINCT ${TrackKeys.album}, ${TrackKeys.album_artist} from ${TABLE_NAME}`);
    }

    async getAlbumPath(album : Album) : Promise<string> {
        const db = await this.getDatabase();
        const row = (await db.get(
            `SELECT * FROM ${TABLE_NAME} 
                WHERE ${TrackKeys.album} LIKE '${this.quoteSafety(album.album)}' AND
                ${TrackKeys.album_artist} LIKE '${this.quoteSafety(album.album_artist)}'
                ORDER BY ${TrackKeys.album_artist} ASC`)
        ) as Track;
        return row.path;
    }

    async getTracksFromAlbum(album : Album) : Promise<Array<Track>> {
        const db = await this.getDatabase();
        return (await db.all(
                `SELECT * FROM ${TABLE_NAME} 
                WHERE ${TrackKeys.album} LIKE '${this.quoteSafety(album.album)}' AND
                ${TrackKeys.album_artist} LIKE '${this.quoteSafety(album.album_artist)}'
                ORDER BY ${TrackKeys.disc_num}, ${TrackKeys.track_num}`)
        ) as Array<Track>;
    }

    async getTracksFromPaths(paths: Array<string>) : Promise<Array<Track>> {
        const tracks = new Array<Track>();
        const db = await this.getDatabase();
        const stmt = await db.prepare(`SELECT * FROM ${TABLE_NAME} WHERE ${TrackKeys.path} LIKE ?`);
        for (const path of paths) {
            const result = await stmt.get(`%${path}%`) as Track;
            tracks.push(result);
        }
        await stmt.finalize();
        return tracks;
    }
}

export default PlaylistDatabase;