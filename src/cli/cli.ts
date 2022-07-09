import meow from "meow"

import { Program } from "./Program"
import { CliArgs } from "./CliArgs"
import { HELP } from "./help"

export const cli = async (): Promise<void> => {
    const _cli = meow(HELP, {
        // @ts-ignore:next-line
        importMeta: import.meta,
        flags: {
        // overwrite: {
        //     type: "boolean",
        //     default: false,
        // },
        },
    })
    // @ts-ignore:next-line
    await new Program(
        _cli.input,
    _cli.flags as unknown as CliArgs,
    ).main()
}
