import { join } from "path"
import { mkdir, readFile, writeFile } from "fs/promises"

import { IConfig, IConfigProperty } from "cloudflare-images-cli"
import { Base } from "./Base"
import { existsAsync } from "../exists-async"

export abstract class Config extends Base {

    public static CONFIG_FILE_NAME = "cf-images.config.json"
    public static DB_FILE_NAME = "cf-images.db.json"

    public static async get(property: IConfigProperty): Promise<string> {
        try {
            const config = await this.read()
            return config?.[property] ?? null
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    public static async set(property: IConfigProperty, value: string): Promise<IConfig> {
        try {
            const config = await this.read()
            config[property] = value
            await this.write(config)
            return config
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    public static async read(): Promise<IConfig> {
        try {
            const doesExist = await this.configExists()
            if (!doesExist) {
                console.log("please configure credentials by running 'cf-images init'")
                process.exit(1)
                // return null
            }
            const fileContent = await readFile(this.configFilePath())
            const fileContentString = fileContent.toString()
            const result = JSON.parse(fileContentString) as IConfig
            return result
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    public static async write(config: IConfig = {}): Promise<boolean> {
        try {
            const content = JSON.stringify(config)
            await mkdir(this.configFolderPath(), { recursive: true })
            await writeFile(this.configFilePath(), content)
            return true
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    private static configFilePath(): string {
        return join(this.configFolderPath(), this.CONFIG_FILE_NAME)
    }

    private static async configExists(): Promise<boolean> {
        try {
            const result = await existsAsync(this.configFilePath())
            return result
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}
