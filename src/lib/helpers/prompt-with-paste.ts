import { createInterface } from "readline"
import { promisify } from "util"

export const promptForInput = async (prompt: string): Promise<string> => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    const question = promisify(rl.question).bind(rl)
    const answer = await question(prompt + " : ")
    rl.close()
    return answer
}
