import { resolve } from "path"
import { readFile } from "fs/promises"
import { ImageUploadRequest } from "cloudflare-images"
import { Pathname } from "pathname-ts"

import { CLICommand, CLIFlags } from "cloudflare-images-cli"
import { newClient, logJson, inquire, isBlank } from "@lib/helpers"

interface UploadImagesConfig {

}

class UploadImagesCommand {

    private flags: CLIFlags

    constructor(flags: CLIFlags) {
        this.flags = flags
    }

    public async run(): Promise<void> {
        const path = await this.getPath()
        const prefix = await this.getPrefix()

        const files = await path.children("files")
        const args: ImageUploadRequest[] = []
        for (const file of files) {
            const fileName = file.basename(file.extname())
            args.push({
                id: prefix + fileName,
                path: file.realpath,
            })
        }
        logJson(args)
        process.exit(0)
    }

    private async getPrefix(): Promise<string> {
        const answers = await inquire([{
            name: "prefix",
            type: "input",
            message: "Cloudflare Image Id Prefix: ",
        }])
        return answers?.prefix ?? ""
    }

    private async getPath(): Promise<Pathname> {
        if (!isBlank(this?.flags?.path)) {
            return new Pathname(this.flags.path)
            // const answers = await inquire([{
            //     type: "confirm",
            //     name: "confirmed",
            //     message: `upload files in ${this?.flags?.path}`,
            //     default: false,
            // }])
        }
        const answers = await inquire([{
            name: "path",
            type: "input",
            message: "Path to folder with files to upload",
        }])
        if (isBlank(answers?.path)) {
            console.log("a path is required for upload-images")
            process.exit(1)
        } else {
            return new Pathname(answers.path)
        }
    }

}

export const uploadImages: CLICommand = async (flags) => {
    try {
        // if (isBlank(flags?.config)) {
        //     console.log("config file required")
        //     process.exit(1)
        // }
        try {
            // const configPath = new Pathname(flags.config)
            // const config = await configPath.readJSON<any>()
            // logJson(config)
            const runner = new UploadImagesCommand(flags)
            await runner.run()
        } catch (error) {
            console.error(error)
        }
        // const options = await inquire<ImageUploadRequest>(questions)
        // await _uploadImage(options)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
