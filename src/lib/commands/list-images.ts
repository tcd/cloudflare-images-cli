import { CloudflareClient } from "cloudflare-images"
import { Config } from "@lib/helpers"

export const listImages = async (): Promise<void> => {
    try {
        const config = await Config.read()
        const client = new CloudflareClient({
            accountId: config.accountId,
            apiKey: config.apiKey,
        })
        const response = await client.listImages({ page: 1, per_page: 100 })
        console.log(response)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
