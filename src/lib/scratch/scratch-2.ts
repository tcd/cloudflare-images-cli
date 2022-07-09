import { Config, IConfig } from "@lib/helpers"

export const scratch2 = async () => {
    const newConfig: IConfig = {
        accountId: "xxx",
    }
    await Config.write(newConfig)
    const fromRead = await Config.read()
    console.log(fromRead)
}
