import inquirer, { QuestionCollection } from "inquirer"

export const inquire = async <T = any>(questions: QuestionCollection): Promise<T> => {
    try {
        const answers = await inquirer.prompt<T>(questions)
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
