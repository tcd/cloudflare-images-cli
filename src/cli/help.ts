import { Command, FlagConfig } from "cloudflare-images-cli"

import { FLAG_CONFIGS } from "./flags"

const commands: Command[] = [
    { name: "init",          description: "Configure Cloudflare credentials" },
    { name: "list-images",   description: "List images" },
    { name: "list-variants", description: "List variants" },
    { name: "upload-image",  description: "Upload a local image file to Cloudflare" },
    { name: "delete-image",  description: "Delete an image on Cloudflare Images" },
]

const flagLength = (flag: FlagConfig): number => {
    let dashLength = 2 // --<name>
    let nameLength = flag.name.length // <name>
    if (flag?.alias?.length) {
        dashLength += 2 // -<alias>\s
        nameLength += flag.alias.length // <alias>
    }
    const length = nameLength + dashLength
    return length
}

const INDENT = " ".repeat(6)
const longestCommandName = Math.max(...(commands.map(command => command.name.length)))
const longestFlagName    = Math.max(...(FLAG_CONFIGS.map(flag => flagLength(flag))))
const longestFlagAlias   = Math.max(...(FLAG_CONFIGS.map(flag => flag?.alias?.length ?? 0)))

const formatCommandHelp = ({ name, description }: Command): string => {
    const result = [
        INDENT,
        name.padEnd(longestCommandName + 2, " "),
        description,
    ].join("")
    return result
}

const formatFlagHelp = (flag: FlagConfig): string => {
    const nameText = `--${flag.name}`
    const aliasText =
        (flag?.alias?.length)
            ? `-${flag.alias} `
            : " ".repeat(longestFlagAlias + 2)
    const result = [
        INDENT,
        (aliasText + nameText).padEnd(longestFlagName + 2, " "),
        flag.description,
    ].join("")
    return result
}

const commandHelp = commands.map((command) => formatCommandHelp(command)).join("\n")
const flagHelp    = FLAG_CONFIGS.map((flag) => formatFlagHelp(flag)).join("\n")

export const HELP = `
    Usage
      $ cf-images <command>

    Commands
${commandHelp}

    Options
${flagHelp}

    Examples
      $ cf-images list-images >> cloudflare-images.json
`

/*
=============================================================================
Reference
=============================================================================

gcloud GROUP | COMMAND [--account=ACCOUNT] [--configuration=CONFIGURATION] \
    [--flatten=[KEY,...]][--format=FORMAT] [--help] [--project=PROJECT_ID] \
    [--quiet, -q][--verbosity=VERBOSITY; default="warning"] [--version, -v] \
    [-h] [--log-http][--trace-token=TRACE_TOKEN] [--no-user-output-enabled]

*/
