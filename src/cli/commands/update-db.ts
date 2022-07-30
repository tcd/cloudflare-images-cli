import cliProgress from "cli-progress"

import { CLICommand, DatabaseData } from "cloudflare-images-cli"
import { newClient, DB } from "@lib/helpers"

export const updateDb: CLICommand = async (_flags) => {
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect)
    try {
        const PER_PAGE = 100
        const client = await newClient()
        const statsResponse = await client.getStats()
        const totalImages = statsResponse?.result?.count?.current
        const requestsRequired = Math.ceil(totalImages / PER_PAGE)
        const responses = []
        progressBar.start(requestsRequired, 0)
        for (let i = 1; i <= requestsRequired; i++) {
            const response = await client.listImages({ page: i, per_page: PER_PAGE })
            responses.push(...response.result.images)
            progressBar.update(i)
        }
        progressBar.stop()
        const data: DatabaseData = {
            updatedAt: new Date(Date.now()).toISOString(),
            images: responses,
        }

        await DB.write(data, true)
        process.exit(0)
    } catch (error) {
        progressBar?.stop()
        console.error(error)
        process.exit(1)
    } finally {
        progressBar?.stop()
    }
}
