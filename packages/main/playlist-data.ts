import {promises} from "fs";
import envPaths from "env-paths";

interface IJsonData {
    base_dir: string;
}

export module PlaylistData {
    export async function storeJson(data: IJsonData) {
        const paths = envPaths("SpeedyPlaylistCreator")
        const pathSeparator = process.platform == "win32" ? "\\" : "/";

        promises.mkdir(paths.data).catch((err) => {if(typeof err !== null) console.log(err)}).finally(async () => {
            const jsonData = JSON.stringify(data);
            await promises.writeFile(`${paths.data}${pathSeparator}playlistbuilder.data`, jsonData);
        });
    }

    export async function loadJson() : Promise<IJsonData> {
        const paths = envPaths("SpeedyPlaylistCreator")
        const pathSeparator = process.platform == "win32" ? "\\" : "/";
        await promises.mkdir(paths.data).catch((err)=>{if(typeof err !== null) console.log(err)});
        const retrievedData = await promises.readFile(`${paths.data}${pathSeparator}playlistbuilder.data`);
        return JSON.parse(retrievedData.toString())
    }
}