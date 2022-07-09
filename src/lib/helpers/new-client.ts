import { CloudflareClient } from "cloudflare-images"
import { Config } from "./Config"

export const newClient = async (): Promise<CloudflareClient> => {
    const config = await Config.read()
    return new CloudflareClient({
        accountId: config.accountId,
        apiKey: config.apiKey,
    })
}
