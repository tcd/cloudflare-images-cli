import { newClient, logJson } from "@lib/helpers"

export const listImages = async (): Promise<void> => {
    try {
        const client = await newClient()
        const response = await client.listImages({ page: 1, per_page: 100 })
        logJson(response.result)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
