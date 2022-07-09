// import { CloudflareClient } from "cloudflare-images"
// import inquirer from "inquirer"
import { Config, IConfig } from ".."

export const scratch2 = async () => {
    const newConfig: IConfig = {
        accountId: "xxx",
    }
    await Config.write(newConfig)
    const fromRead = await Config.read()
    console.log(fromRead)
}
