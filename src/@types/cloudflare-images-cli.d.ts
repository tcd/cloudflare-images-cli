declare module "cloudflare-images-cli" {

    export interface Command {
        name: string
        description: string
    }

    export type FlagType = "string" | "boolean" | "number";

    export interface FlagConfig {
        type: "string" | "boolean" | "number"
        name: string
        alias?: string
        default: string | boolean | number
        description: string
        isMultiple?: boolean
    }

    export interface Flag {
        name: string
        alias?: string
        description: string
    }

    export interface CLIFlags {
        help?:    boolean
        version?: boolean
        verbose?: boolean
        config?:  string
        path?:    string
    }

    export interface NameTransformationOptions {
        inputPattern: RegExp | string
        outputPattern: string
    }

    export type CLICommand = (flags: CLIFlags) => Promise<void>

}
