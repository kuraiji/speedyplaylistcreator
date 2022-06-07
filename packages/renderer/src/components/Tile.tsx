import { Component, JSX, onMount, createSignal, Show } from "solid-js"
import Styles from "./Tile.module.css"
import { getFirstTrack } from "@/store";
import type { Buffer } from 'node:buffer';

export interface TileProps extends JSX.PropAttributes {
    album: string;
    callback: (arg0: string) => void;
}

const Tile : Component<TileProps> = (props: TileProps) => {
    const [cover, setCover] = createSignal();
    onMount(() => {
        if(props.album === undefined) return;
        window.manager.coverArt(getFirstTrack(props.album)).then((res) => {
            if(res === undefined) return;
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
                    <p class={`${Styles.text} ${Styles.top}`}>{props.album?.split("|")[0]}</p>
                    <p class={`${Styles.text} ${Styles.bottom}`}>{props.album?.split("|")[1]}</p>
                </>
            }>
                <img src={getCover()} class={Styles.image} alt=""/>
            </Show>
        </li>
    )
}

export default Tile;