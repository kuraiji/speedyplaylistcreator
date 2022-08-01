import {Component, JSX, createSignal, createEffect} from "solid-js";
import { getPlaylist } from "@/store";
import Styles from "./Listing.module.css"
import { Track } from "@/types";

export interface ListingProps extends JSX.PropAttributes {
    track: Track;
    callback: (arg0: Track) => void;
}

const Listing : Component<ListingProps> = (props: ListingProps) => {
    const [selected, setSelected] = createSignal(false);

    createEffect(() => {
        setSelected(getPlaylist().some(({path}) => path === props.track.path));
    });

    return (
        <div class={`${Styles.container} ${selected() ? Styles.selected : ""}`} onClick={()=>{props.callback(props.track)}}>
            <p class={`${Styles.text} ${selected() ? Styles.textSelected : ""}`}>{props.track.title}</p>
        </div>
    )
}

export default Listing;