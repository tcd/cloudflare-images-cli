import { resolve } from "path"
import { readFile } from "fs/promises"
import { ImageUploadRequest } from "cloudflare-images"

import { CLICommand } from "cloudflare-images-cli"
import { newClient, logJson, inquire, isBlank } from "@lib/helpers"

export const uploadImages: CLICommand = async (flags) => {
    try {
        if (isBlank(flags?.configPath)) {
            console.log("config file required")
            process.exit(1)
        }
        try {
            const config = resolve(process.cwd(), "")
        } catch (error) {

        }
        const options = await inquire<ImageUploadRequest>(questions)
        await _uploadImage(options)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
