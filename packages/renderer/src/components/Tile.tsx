import { Component, JSX, onMount, createSignal, Show } from "solid-js"
import Styles from "./Tile.module.css"
import type { Buffer } from 'node:buffer';
import { Album } from "@/types";

export interface TileProps extends JSX.PropAttributes {
    album: Album
    callback: (arg0: Album) => void;
}

const Tile : Component<TileProps> = (props: TileProps) => {
    const [cover, setCover] = createSignal();

    onMount(() => {
        if(typeof props.album === "undefined") return;
        window.manager.getCoverArt(JSON.stringify(props.album)).then((res) => {
            if(typeof res === "undefined") return;
            setCover(res);
        })
    });

    const getCover = () => {
        if(cover() === undefined) return "";
        let image = new Blob([(cover() as Buffer).buffer], {type:'image/jpeg'});
        return URL.createObjectURL(image);
    }

    return (
        <li class={Styles.outer} onClick={()=>{props.callback(props.album)}}>
            <Show when={cover() !== undefined} fallback={
                <>
                    <p class={`${Styles.text} ${Styles.top}`}>{props.album?.album}</p>
                    <p class={`${Styles.text} ${Styles.bottom}`}>{props.album?.album_artist}</p>
                </>
            }>
                <img src={getCover()} class={Styles.image} alt=""/>
            </Show>
        </li>
    )
}

export default Tile;