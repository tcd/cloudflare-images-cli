import { newClient, logJson } from "@lib/helpers"
import { CliCommand } from "./CliCommand"

export const listVariants: CliCommand = async (flags) => {
    try {
        const client = await newClient()
        const response = await client.listVariants()
        if (flags?.verbose) {
            logJson(response)
        } else {
            logJson(response.result)
        }
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
