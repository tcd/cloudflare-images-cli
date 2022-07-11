import { CliArgs } from "src/cli/CliArgs"

export type CliCommand = (flags: CliArgs) => Promise<void>
