import { CLIFlags, CLICommand } from "cloudflare-images-cli"
import { deleteImage, init, listImages, listVariants, uploadImage, uploadImages } from "./commands"
import { HELP } from "./help"
import { newClient, logJson, inquire } from "@lib/helpers"

const COMMANDS: Record<string, CLICommand> = {
    "delete-image":  deleteImage,
    "init":          init,
    "list-images":   listImages,
    "list-variants": listVariants,
    "upload-image":  uploadImage,
    "upload-images": uploadImages,
}

export class Program {

    public args:  string[]
    public flags: CLIFlags

    constructor(args: any, flags: CLIFlags) {
        this.args  = args
        this.flags = flags
    }

    private command(): string {
        return this?.args?.[0] ?? null
    }

    private logInput(): void {
        if (this?.flags?.verbose) {
            logJson({
                command: this.command(),
                // args: this.args,
                flags: this.flags,
            })
        }
    }

    public async main() {
        try {
            const commandArg = this.command()
            const command = COMMANDS[commandArg]
            if (command == null) {
                if (this?.flags?.verbose) {
                    this.logInput()
                } else {
                    console.log(HELP)
                }
                process.exit(0)
            }
            this.logInput()
            await command(this.flags)
            process.exit(0)
        } catch (e) {
            if (e.code == "ENOENT") {
                console.error(`error - unable to find file: `)
            } else {
                console.error("error: " + e.message)
            }
            process.exit(1)
        }
    }
}
