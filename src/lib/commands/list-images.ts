import { newClient, logJson } from "@lib/helpers"
import { CliCommand } from "./CliCommand"

export const listImages: CliCommand = async (flags) => {
    try {
        const client = await newClient()
        const response = await client.listImages({ page: 1, per_page: 100 })
        if (flags?.debug) {
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
