import meow from "meow"

import { CLIFlags } from "cloudflare-images-cli"
import { Program } from "./Program"
import { HELP } from "./help"
import { VERSION } from "./version"

export const cli = async (): Promise<void> => {
    const _cli = meow(HELP, {
        // @ts-ignore:next-line
        importMeta: import.meta,
        flags: {
            path:    { alias: "p", type: "string",  default: ""    },
            config:  { alias: "c", type: "string",  default: ""    },
            debug:   { alias: "d", type: "boolean", default: false },
            verbose: { alias: "v", type: "boolean", default: false },
            version: { alias: "V", type: "boolean", default: false },
        },
        version: VERSION,
    })
    // @ts-ignore:next-line
    await new Program(
        _cli.input,
    _cli.flags as unknown as CLIFlags,
    ).main()
}
