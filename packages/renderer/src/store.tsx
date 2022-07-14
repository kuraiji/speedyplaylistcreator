import { createStore } from 'solid-js/store'
import { Pages, Track, Album } from "./types"

const [state, setState] = createStore({
    maxSongs: 0,
    page: Pages.Landing,
    albums: new Map<string, Track[]>(),
    newAlbums: new Array<Album>(),
});

export const getMaxSongs = () => {return state.maxSongs};
export const setMaxSong = (n : number) => {setState({maxSongs: n})};
export const getCurrentPage = () => {return state.page};
export const setCurrentPage = (p : Pages) => {setState({page: p})};
export const getNewAlbums = () => {return state.newAlbums;};
export const setNewAlbums = (albums: Array<Album>) => {setState({newAlbums: [...albums]});};