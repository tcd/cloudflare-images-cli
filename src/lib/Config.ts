import { join } from "path"
import { homedir } from "os"
import { access, mkdir, readFile, writeFile } from "fs/promises"
import { constants as fsConstants } from "fs"

const exists = (path: string): Promise<boolean> => {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         const result = existsSync(path)
    //     }, 100)
    // })
    return access(path, fsConstants.F_OK).then(() => true).catch(() => false)
}

export interface IConfig {
    apiKey?: string
    accountId?: string
}
export type IConfigProperty = keyof IConfig

export abstract class Config {

    public static CONFIG_FOLDER_NAME = ".cf-images"
    public static CONFIG_FILE_NAME = "cf-images.config.json"

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
                return null
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

    public static async write(config: IConfig = {}): Promise<any> {
        try {
            const content = JSON.stringify(config)
            const doesExist = await this.configExists()
            if (doesExist) {
                console.log("config already exists")
            } else {
                await mkdir(this.configFolderPath(), { recursive: true })
                await writeFile(this.configFilePath(), content)
            }
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    private static configFolderPath(): string {
        return join(homedir(), this.CONFIG_FOLDER_NAME)
    }

    private static configFilePath(): string {
        return join(this.configFolderPath(), this.CONFIG_FILE_NAME)
    }

    private static async configExists(): Promise<boolean> {
        try {
            const result = await exists(this.configFilePath())
            return result
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}
