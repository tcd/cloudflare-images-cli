import { deleteImage, init, listImages, listVariants, uploadImage, CliCommand } from "@lib/commands"
import { CliArgs } from "./CliArgs"
import { HELP } from "./help"

const COMMANDS: Record<string, CliCommand> = {
    "init":          init,
    "list-images":   listImages,
    "list-variants": listVariants,
    "upload-image":  uploadImage,
    "delete-image":  deleteImage,
}

export class Program {

    public args: string[]
    public flags: CliArgs

    constructor(args: any, flags: any) {
        this.args   = args
        this.flags  = flags
    }

    public async main() {
        try {
            const commandArg = this.args[0]
            const command = COMMANDS[commandArg]
            if (command == null || command == undefined) {
                console.log(HELP)
                process.exit(0)
            }
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
