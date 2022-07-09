import { QuestionCollection } from "inquirer"
import { Config, IConfig, inquire, isBlank } from "."

const questions: QuestionCollection = [
    {
        name: "accountId",
        type: "input",
        message: "Cloudflare Account Id",
    },
    {
        name: "apiKey",
        type: "input",
        message: "Cloudflare API Key",
    },
]

export const init = async () => {
    try {
        const answers = await inquire<IConfig>(questions)
        if (isBlank(answers.accountId)) {
            console.log("accountId can't be blank")
            process.exit(1)
        }
        if (isBlank(answers.apiKey)) {
            console.log("accountId can't be blank")
            process.exit(1)
        }
        await Config.write(answers)
        console.log("setup complete 🥳")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
