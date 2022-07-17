import { resolve } from "path"
import { readFile } from "fs/promises"
import { ImageUploadRequest } from "cloudflare-images"
import { Pathname } from "pathname-ts"

import { CLICommand } from "cloudflare-images-cli"
import { newClient, logJson, inquire, isBlank } from "@lib/helpers"

interface UploadImagesConfig {

}

export const uploadImages: CLICommand = async (flags) => {
    try {
        if (isBlank(flags?.config)) {
            console.log("config file required")
            process.exit(1)
        }
        console.log(flags.config)
        process.exit(0)
        try {
            const configPath = new Pathname(flags.config)
            const config = await configPath.readJSON<any>()
            logJson(config)
        } catch (error) {

        }
        // const options = await inquire<ImageUploadRequest>(questions)
        // await _uploadImage(options)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
