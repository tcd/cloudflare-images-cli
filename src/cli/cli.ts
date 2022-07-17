import meow from "meow"

import { CLIFlags } from "cloudflare-images-cli"
import { Program } from "./Program"
import { HELP } from "./help"
import { VERSION } from "./version"
import { FLAG_OPTIONS } from "./flags"

export const cli = async (): Promise<void> => {
    const _cli = meow(HELP, {
        // @ts-ignore:next-line
        importMeta: import.meta,
        flags: FLAG_OPTIONS,
        version: VERSION,
    })
    // @ts-ignore:next-line
    await new Program(
        _cli.input,
    _cli.flags as unknown as CLIFlags,
    ).main()
}
