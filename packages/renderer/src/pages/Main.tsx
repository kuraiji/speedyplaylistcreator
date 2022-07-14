import {Component, For, Show, createSignal, onMount} from "solid-js";
import Styles from "./Main.module.css"
import {setNewAlbums, getNewAlbums} from "@/store";
import Tile from "@/components/Tile";
import Listing from "@/components/Listing";
import {Album, Track} from "@/types";

const Main : Component = () => {

    const [songModule, setSongModule] = createSignal(false);
    const [tracks, setTracks] = createSignal(new Array<Track>());
    const [playlist, setPlaylist] = createSignal(new Array<string>());

    onMount(() => {
        window.manager.getAlbums().then((res) => {
            if(typeof res === "undefined") return;
            setNewAlbums(res as Array<Album>);
        });
    });

    const onAlbumClick = (album: Album) => {
        if(typeof album === "undefined") return;
        window.manager.getTracksFromAlbum(JSON.stringify(album))
            .then((res) => {
                setTracks(res as Array<Track>);
                setSongModule(true);
            });
    }

    const onTrackClick = (path: string) => {
       setPlaylist([...playlist(), path]);
       document.getElementById("scroll")!.scrollTop = document.getElementById("scroll")!.scrollHeight;
    }

    const onSaveClick = () => {
        if(playlist().length < 1) return;
        window.electron.saveFile().then((res)=>{
            window.manager.savePlaylist(res, playlist()).then();
        })
    }

    const onLoadClick = () => {
        window.electron.openFile().then((res)=>{
            window.manager.loadPlaylist(res).then((res)=> {
                if(res.length != 0)
                setPlaylist(res);
            })
        })
    }

    const onRemoveTrack = (index: number) => {
        let newList = [...playlist()];
        newList.splice(index, 1);
        setPlaylist(newList);
    }

    return (
        <div class={Styles.outer}>
            <div class={Styles.modules}>
                <Show when={songModule()} fallback={
                    <ul class={Styles.albums}>
                        //<For each={getNewAlbums()}>
                            {(album) => <Tile album={album} callback={onAlbumClick}/>}
                        </For>
                    </ul>
                }>
                    <div class={Styles.return} onClick={()=>{setSongModule(false)}}>
                        <p class={Styles.symbol}>⏎</p>
                    </div>
                    <ul class={Styles.tracks}>
                        <For each={tracks()}>
                            {(track) => <Listing track={track} callback={onTrackClick}/>}
                        </For>
                    </ul>
                </Show>
                <div class={Styles.playlist}>
                    <p class={Styles.header}>Playlist Panel</p>
                    <div class={Styles.viewer} id="scroll">
                        <For each={playlist()}>
                            {(path, i) => <p onClick={()=>{onRemoveTrack(i())}}>{path.split("/").at(-1)}</p>}
                        </For>
                    </div>
                    <div class={Styles.buttonContainer}>
                        <div class={Styles.button} onClick={onSaveClick}>
                            <p class={Styles.buttonText}>Save</p>
                        </div>
                        <div class={Styles.button} onClick={onLoadClick}>
                            <p class={Styles.buttonText}>Load</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;