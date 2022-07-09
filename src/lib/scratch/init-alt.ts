import { Config, isBlank, promptForInput } from "@lib/helpers"

export const initAlt = async () => {
    try {
        const accountId = await promptForInput("Cloudflare Account Id")
        const apiKey    = await promptForInput("Cloudflare API Key")
        if (isBlank(accountId)) {
            console.log("accountId can't be blank")
            process.exit(1)
        }
        if (isBlank(apiKey)) {
            console.log("accountId can't be blank")
            process.exit(1)
        }
        await Config.write({ accountId, apiKey })
        console.log("setup complete!")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

