import type {Component} from "solid-js";
import Styles from "./Landing.module.css"
import {Pages} from "@/types";
import {setCurrentPage, setMaxSong} from "@/store";

const Landing : Component = () => {

    function openFolderDialog() {
        window.electron.openFolder().then((res)=> {
            window.manager.findSongs(res).then((res) => {
                if(res < 1) return;
                setMaxSong(res);
                setCurrentPage(Pages.Loading);
            });
        });
    }

    return(
        <div class={Styles.outer}>
            <div class={Styles.inner}>
                <h1 class={`${Styles.text} ${Styles.mainText}`}>Welcome to the Speedy Playlist Creator!</h1>
                <h3 class={`${Styles.text} ${Styles.subText}`}>Please choose the top most directory of your music folders.</h3>
                <button class={Styles.button} type={"button"} onClick={openFolderDialog}>Open Directory</button>
            </div>
        </div>
    );
};

export default Landing;