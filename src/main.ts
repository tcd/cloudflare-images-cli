// import { cli } from "./cli"
import { uploadImage } from "./lib/commands/upload-image"

const main = async (): Promise<any> => {
    // await cli()
    await uploadImage()
}

(async () => {
    main()
        .then((res) => {
            // @ts-ignore:next-line
            // if (res) { console.log(res) }
            process.exit(0)
        })
        .catch((error) => {
            // if (error) { console.error(error) }
            process.exit(1)
        })
})()
