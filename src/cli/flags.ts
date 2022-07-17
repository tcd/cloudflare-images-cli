import { FlagConfig } from "cloudflare-images-cli"

export const FLAG_CONFIGS: FlagConfig[] = [
    { name: "configPath", alias: "p", type: "string",  default: null,  description: "Path to a file or folder" },
    { name: "path",       alias: "p", type: "string",  default: null,  description: "Path to a file or folder" },
    { name: "help",       alias: "h", type: "boolean", default: false, description: "Show usage information"   },
    { name: "version",    alias: "V", type: "boolean", default: false, description: "Show version information" },
    { name: "verbose",    alias: "v", type: "boolean", default: false, description: "Verbose output" },
    { name: "debug",      alias: "d", type: "boolean", default: false, description: "Verbose output" },
]

export const FLAG_OPTIONS = FLAG_CONFIGS.reduce((result, flag) => {
    result[flag.name] = {
        alias:   flag.alias,
        type:    flag.type,
        default: flag.default,
    }
    return result
}, {})
