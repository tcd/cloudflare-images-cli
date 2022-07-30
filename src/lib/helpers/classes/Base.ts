import { join } from "path"
import { homedir } from "os"

export abstract class Base {
    protected static CONFIG_FOLDER_NAME = ".cf-images"

    protected static configFolderPath(): string {
        return join(homedir(), this.CONFIG_FOLDER_NAME)
    }
}
