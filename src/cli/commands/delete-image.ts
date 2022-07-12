import { QuestionCollection } from "inquirer"

import { CLICommand } from "cloudflare-images-cli"
import { newClient, logJson, inquire } from "@lib/helpers"

const questions: QuestionCollection = [
    {
        name: "id",
        type: "input",
        message: "Cloudflare Image Id",
    },
]

export const deleteImage: CLICommand = async (_) => {
    try {
        const answers = await inquire(questions)
        const client = await newClient()
        const response = await client.deleteImage(answers.id)
        logJson(response.result)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
