import { glob } from "glob";
import * as mm from 'music-metadata'
import fs from "fs";
import readline from 'readline';
import { BrowserWindow } from "electron";

export module PlaylistManager {

    export class Manager {
        private tracks: Track[];
        baseDir: string;
        private albums: Map<string, Track[]>;
        private paths: string[];

        constructor(path?: string) {
            this.baseDir = "";
            this.albums = new Map<string, Track[]>();
            this.paths = new Array<string>();
            this.tracks = new Array<Track>();
            if(typeof path === "undefined") return;
            this.baseDir = path;
            this.findSongs(path).then();
        }

        async findSongs(path: string) : Promise<number> {
            if(!fs.existsSync(path)) return 0;
            this.baseDir = path;
            this.paths = glob.sync("/**/*.{mp3,flac,wav}", {root: path});
            return this.paths.length;
        }

        async indexSongs(win: BrowserWindow) : Promise<void> {
            let index = 0;
            for await (const path of this.paths) {
                const metadata = await mm.parseFile(path);
                let title: string = typeof metadata.common.title !== "undefined" ? metadata.common.title : "";
                let artist: string = typeof metadata.common.artist !== "undefined" ? metadata.common.artist : "";
                let album: string = typeof metadata.common.album !== "undefined" ? metadata.common.album : "";
                let album_artist: string = typeof metadata.common.albumartist !== "undefined" ? metadata.common.albumartist : "";
                let track_num: number = typeof metadata.common.track.no === "number" ? metadata.common.track.no : 0;
                let disc_num: number = typeof metadata.common.disk.no === "number" ? metadata.common.disk.no : 0;
                if(artist === "") artist = album_artist;
                if(album_artist === "") album_artist = artist;
                this.tracks.push(new Track(title, artist, album, album_artist, track_num, disc_num, path));
                index++;
                win?.webContents.send('manager:updateIndex', index);
            }
            this.tracks.forEach((track) => {
                const key: string = `${track.album}|${track.album_artist}`;
                if(!this.albums.has(key)) this.albums.set(key, new Array<Track>());
                this.albums.get(key)!.push(track);
                index++;
                win?.webContents.send('manager:updateIndex', index);
                win?.webContents.send('manager:addTrack', [key, this.albums.get(key)!.at(-1)]);
            });
            this.tracks = [];
        }

        async getCoverArt(track: Track): Promise<Buffer|undefined> {
            const metadata = await mm.parseFile(track.path);
            const picture = metadata.common.picture;
            const trackDir = `${track.path.substring(0, track.path.lastIndexOf("/"))}/`;
            const images = glob.sync("/*.{jpg,jpeg,png,bmp}", {root: trackDir});
            if(metadata.common.picture !== undefined && metadata.common.picture.length > 0) {
                return picture?.at(0)!.data;
            }
            else if(images.length > 0) {
                let coverImage: string|undefined = undefined;
                images.forEach((image) => {
                    const filename = image.split('/').at(-1)?.toLowerCase();
                    if(["front", "cover", "folder"].some(substr => filename!.includes(substr))) {
                        coverImage = image;
                    }
                });
                if(coverImage === undefined) coverImage = images.at(0);
                return await fs.promises.readFile(coverImage!);
            }
        }

        async savePlaylist(filePath: string, songPaths: string[]): Promise<void> {
            if(!(filePath.endsWith(".m3u") || filePath.endsWith(".m3u8"))) {
                filePath = filePath.concat(".m3u");
            }
            if(fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
            await fs.promises.writeFile(filePath, "#EXTM3U\n");
            for await (const path of songPaths) {
                const localPath = path.replace(`${this.baseDir}/`, '');
                await fs.promises.appendFile(filePath, `#EXTINF:\n${localPath}\n`);
            }
        }

        async loadPlaylist(filePath: string): Promise<string[]> {
            let songPaths = new Array<string>();
            if(!fs.existsSync(filePath)) return songPaths;
            const fileStream = fs.createReadStream(filePath);
            const readLine = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            for await (const line of readLine) {
                if(line.charAt(0) === '#' || line.charAt(0) === "") continue;
                songPaths.push(`${this.baseDir}/${line}`);
            }
            return songPaths;
        }
    }

    export class Track {
        title: string;
        artist: string;
        album: string;
        album_artist: string;
        track_num: number;
        disc_num: number;
        path: string;

        constructor(title: string, artist: string, album: string, album_artist: string,
                    track_num: number, disc_num: number, path: string) {
            this.album = album;
            this.album_artist = album_artist;
            this.path = path;
            this.track_num = track_num;
            this.disc_num = disc_num;
            this.title = title;
            this.artist = artist;
        }
    }
}