import { access } from "fs/promises"
import { constants } from "fs"

export const existsAsync = async (path: string): Promise<boolean> => {
    return access(path, constants.F_OK).then(() => true).catch(() => false)
}
