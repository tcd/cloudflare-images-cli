import { ImageUploadRequest } from "cloudflare-images"
import { newClient, logJson } from "@lib/helpers"

export const uploadImage = async (options: ImageUploadRequest): Promise<void> => {
    try {
        const client = await newClient()
        const response = await client.uploadImage(options)
        logJson(response.result)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

