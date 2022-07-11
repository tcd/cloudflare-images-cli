import { ImageUploadRequest } from "cloudflare-images"
import { QuestionCollection } from "inquirer"

import { newClient, logJson, inquire } from "@lib/helpers"
import { CliCommand } from "./CliCommand"


const _uploadImage = async (options: ImageUploadRequest): Promise<void> => {
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

const questions: QuestionCollection = [
    {
        name: "id",
        type: "input",
        message: "Cloudflare Image Id",
    },
    {
        name: "path",
        type: "input",
        message: "Path to image file",
    },
]

export const uploadImage: CliCommand = async (_flags) => {
    try {
        const options = await inquire<ImageUploadRequest>(questions)
        await _uploadImage(options)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
