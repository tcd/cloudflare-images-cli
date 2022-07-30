import { CLICommand } from "cloudflare-images-cli"
import { newClient, logJson } from "@lib/helpers"

export const getStats: CLICommand = async (flags) => {
    try {
        const client = await newClient()
        const response = await client.getStats()
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
