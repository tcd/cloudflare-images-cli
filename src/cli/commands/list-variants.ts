import { CLICommand } from "cloudflare-images-cli"
import { newClient, logJson } from "@lib/helpers"

export const listVariants: CLICommand = async (flags) => {
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
