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
        config?:  string
        dry?:     boolean
        help?:    boolean
        path?:    string
        verbose?: boolean
        version?: boolean
    }

    export type CaseTransformation =
        | "camel-case"
        | "capital-case"
        | "constant-case"
        | "dot-case"
        | "header-case"
        | "no-case"
        | "param-case"
        | "pascal-case"
        | "path-case"
        | "sentence-case"
        | "snake-case"

    export interface NameTransformationOptions {
        inputPattern: RegExp | string
        outputPattern: string
        inputFolder?: string
        removeFileExtension?: boolean
        caseTransformation?: CaseTransformation
    }

    export type CLICommand = (flags: CLIFlags) => Promise<void>

}
