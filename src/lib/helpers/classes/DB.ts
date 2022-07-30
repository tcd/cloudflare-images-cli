import { join } from "path"
import { mkdir, readFile, writeFile } from "fs/promises"

import { DatabaseData } from "cloudflare-images-cli"
import { Base } from "./Base"
import { existsAsync } from "../exists-async"

export abstract class DB extends Base {

    public static DB_FILE_NAME = "cf-images.db.json"

    public static async read(): Promise<DatabaseData> {
        try {
            const doesExist = await this.exists()
            if (!doesExist) {
                console.log("please configure db by running 'TODO'")
                process.exit(1)
                // return null
            }
            const fileContent = await readFile(this.dbFilePath())
            const fileContentString = fileContent.toString()
            const result = JSON.parse(fileContentString)
            return result
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    public static async write(data: DatabaseData, verbose = false): Promise<boolean> {
        try {
            const content = JSON.stringify(data)
            await mkdir(this.configFolderPath(), { recursive: true })
            await writeFile(this.dbFilePath(), content)
            if (verbose) {
                console.log(`cloudflare images database updated: '${this.dbFilePath()}'`)
            }
            return true
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    private static dbFilePath(): string {
        return join(this.configFolderPath(), this.DB_FILE_NAME)
    }

    private static async exists(): Promise<boolean> {
        try {
            const result = await existsAsync(this.dbFilePath())
            return result
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}
