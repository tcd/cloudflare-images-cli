import { promptForFilePath, scratch2 } from "./lib"

// scratch()


const main = async (): Promise<any> => {
    // const answer = await promptForFilePath("give me a file path")
    // return answer
    await scratch2()
}

(async () => {
    main()
        .then((res) => {
            // @ts-ignore:next-line
            if (res) { console.log(res) }
            process.exit(0)
        })
        .catch((error) => {
            if (error) { console.error(error) }
            process.exit(1)
        })
})()
