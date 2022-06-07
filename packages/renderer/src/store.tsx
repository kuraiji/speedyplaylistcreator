import { createStore } from 'solid-js/store'
import { Pages } from "./types"
import { Track } from "./types"

const [state, setState] = createStore({
    maxSongs: 0,
    page: Pages.Landing,
    albums: new Map<string, Track[]>(),
});

export const getMaxSongs = () => {return state.maxSongs};
export const setMaxSong = (n : number) => {setState({maxSongs: n})};
export const getCurrentPage = () => {return state.page};
export const setCurrentPage = (p : Pages) => {setState({page: p})};
export const getAlbums = () => {return state.albums};
export const addTrack = (k : string, v : Track) => {
    if(!state.albums.has(k))
        state.albums.set(k, new Array<Track>());
    state.albums.get(k)!.push(v);
};
export const getFirstTrack = (k : string) => {return state.albums.get(k)?.at(0);}
export const getAlbumTracks = (k : string) => {return state.albums.get(k);}