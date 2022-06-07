import { Component, JSX } from "solid-js";
import Styles from "./Listing.module.css"
import { Track } from "@/types";

export interface ListingProps extends JSX.PropAttributes {
    track: Track;
    callback: (arg0: string) => void;
}

const Listing : Component<ListingProps> = (props: ListingProps) => {
    return (
        <div class={Styles.container} onClick={()=>{props.callback(props.track.path)}}>
            <p class={Styles.text}>{props.track.title}</p>
        </div>
    )
}

export default Listing;