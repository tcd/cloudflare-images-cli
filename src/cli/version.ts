import * as packageJson from "../../package.json"

const versionNumber = packageJson["version"]

export const VERSION = `cf-images version ${versionNumber}`
