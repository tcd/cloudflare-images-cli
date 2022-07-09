import { CloudflareClient } from "cloudflare-images"
import { Config, logJson } from "@lib/helpers"

export const listVariants = async (): Promise<void> => {
    try {
        const config = await Config.read()
        const client = new CloudflareClient({
            accountId: config.accountId,
            apiKey: config.apiKey,
        })
        const response = await client.listVariants()
        logJson(response.result)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
