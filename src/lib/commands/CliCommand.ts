import { CliFlags } from "src/cli/CliFlags"

export type CliCommand = (flags: CliFlags) => Promise<void>
