import { ImageUploadRequest } from "cloudflare-images"
import inquirer, { QuestionCollection } from "inquirer"
import { InquirerFuzzyPath } from "inquirer-fuzzy-path"

import { newClient, logJson } from "@lib/helpers"

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
        type: "fuzzypath",
        name: "path",
        excludePath: (nodePath) => nodePath.startsWith("node_modules"),
        itemType: "file",
        message: "Choose a file to upload: ",
    },
]

const getImageOptions = async (): Promise<any> => {
    try {
        inquirer.registerPrompt("fuzzypath", InquirerFuzzyPath)
        const answers = await inquirer.prompt(questions)
        return answers
    } catch (error) {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.error(error)
        } else {
            // Something else went wrong
            console.error(error)
        }
        process.exit(1)
    }
}

export const uploadImage = async (): Promise<void> => {
    try {
        const answers = await getImageOptions()
        console.log(answers)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
