import { CLICommand, DatabaseData } from "cloudflare-images-cli"
import { newClient, DB } from "@lib/helpers"

export const updateDb: CLICommand = async (_flags) => {
    try {
        const PER_PAGE = 100
        const client = await newClient()
        const statsResponse = await client.getStats()
        const totalImages = statsResponse?.result?.count?.current
        const requestsRequired = Math.ceil(totalImages / PER_PAGE)
        const responses = []
        for (let i = 1; i <= requestsRequired; i++) {
            const response = await client.listImages({ page: i, per_page: PER_PAGE })
            responses.push(...response.result.images)
        }
        const data: DatabaseData = {
            updatedAt: new Date(Date.now()).toISOString(),
            images: responses,
        }

        await DB.write(data, true)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
