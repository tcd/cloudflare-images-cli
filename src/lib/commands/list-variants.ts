import { newClient, logJson } from "@lib/helpers"

export const listVariants = async (): Promise<void> => {
    try {
        const client = await newClient()
        const response = await client.listVariants()
        logJson(response.result)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
