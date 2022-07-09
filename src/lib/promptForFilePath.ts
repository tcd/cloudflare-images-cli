import { sep, resolve } from "path"
import { readdirSync } from "fs"
import { createInterface } from "readline"
import { promisify } from "util"
import { cwd } from "process"

/**
 * [Node.js file/folder auto completion on user input](https://stackoverflow.com/questions/42197385/node-js-file-folder-auto-completion-on-user-input)
 */
const completer = (line: string) => {
    // const line = resolve(input)
    // console.log("\n", line)
    let currAddedPath: string
    const currAddedDir = (line.indexOf(sep) != - 1) ? line.substring(0, line.lastIndexOf(sep) + 1) : ""
    const currAddingDir = line.substring(line.lastIndexOf(sep) + 1)
    const path = cwd() + sep + currAddedDir
    const completions = readdirSync(line)
    const hits = completions.filter((c) => { return c.indexOf(currAddingDir) === 0 })

    const strike = []
    if (hits.length === 1) {
        strike.push(currAddedPath + hits[0] + sep)
    }

    return (strike.length) ? [strike, line] : [hits.length ? hits : completions, line]
}

export const promptForFilePath = async (prompt: string): Promise<string> => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer,
    })
    const question = promisify(rl.question).bind(rl)
    const answer = await question(prompt + " : ")
    return resolve(answer)
}
