import meow from "meow"

import { Program } from "./Program"
import { CliArgs } from "./CliArgs"
import { HELP } from "./help"
import { VERSION } from "./version"

export const cli = async (): Promise<void> => {
    const _cli = meow(HELP, {
        // @ts-ignore:next-line
        importMeta: import.meta,
        flags: {
            debug: {
                alias: "d",
                type: "boolean",
                default: false,
            },
        },
        version: VERSION,
    })
    // @ts-ignore:next-line
    await new Program(
        _cli.input,
    _cli.flags as unknown as CliArgs,
    ).main()
}
