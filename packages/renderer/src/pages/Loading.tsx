import { Component, createSignal, onMount, createEffect} from "solid-js";
import Styles from "./Loading.module.css"
import { getMaxSongs, setCurrentPage, addTrack } from "@/store";
import { Pages } from "@/types";

const Loading : Component = () => {

    const [index, setIndex] = createSignal(0);

    onMount(() => {
        window.manager.updateIndex((_event, value) => {
            setIndex(value);
        });
        window.manager.addTrack((_event, value) => {
            addTrack(...value);
        })
        window.manager.indexSongs();
    });

    createEffect(() => {
        if(index() < getMaxSongs() * 2 - 1) return;
        setCurrentPage(Pages.Main);
    });

    return (
        <div class={Styles.outer}>
            <p class={Styles.text}>Now Loading...</p>
            <progress class={Styles.bar} max={getMaxSongs() * 2 - 1} aria-valuemin={0} value={index()}></progress>
        </div>
    )
}

export default Loading;