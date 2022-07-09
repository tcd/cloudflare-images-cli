import { CloudflareClient } from "cloudflare-images"
import inquirer from "inquirer"
import { Config, IConfig } from "./Config"

export const scratch2 = async () => {
    const newConfig: IConfig = {
        accountId: "xxx",
    }
    await Config.write(newConfig)
    const fromRead = await Config.read()
    console.log(fromRead)
    // inquirer
    //     .prompt([
    //         {
    //             name: "faveReptile",
    //             message: "What is your favorite reptile?"
    //         },
    //     ])
    //     .then(answers => {
    //         console.info("Answer:", answers.faveReptile);
    //     })
    //     .catch((error) => {
    //         if (error.isTtyError) {
    //             // Prompt couldn't be rendered in the current environment
    //         } else {
    //             // Something else went wrong
    //         }
    //     });
}
