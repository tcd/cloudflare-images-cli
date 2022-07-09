import { join } from 'path';
import { homedir } from 'os';
import { readFile, mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import inquirer from 'inquirer';
import { CloudflareClient } from 'cloudflare-images';
import 'readline';
import 'util';
import 'process';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const exists = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return access(path, constants.F_OK).then(() => true).catch(() => false);
});
class Config {
    static get(property) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.read();
                return (_a = config === null || config === void 0 ? void 0 : config[property]) !== null && _a !== void 0 ? _a : null;
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
    static set(property, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.read();
                config[property] = value;
                yield this.write(config);
                return config;
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
    static read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doesExist = yield this.configExists();
                if (!doesExist) {
                    console.log("please configure credentials by running 'cf-images init'");
                    process.exit(1);
                }
                const fileContent = yield readFile(this.configFilePath());
                const fileContentString = fileContent.toString();
                const result = JSON.parse(fileContentString);
                return result;
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
    static write(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = JSON.stringify(config);
                yield mkdir(this.configFolderPath(), { recursive: true });
                yield writeFile(this.configFilePath(), content);
                return true;
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
    static configFolderPath() {
        return join(homedir(), this.CONFIG_FOLDER_NAME);
    }
    static configFilePath() {
        return join(this.configFolderPath(), this.CONFIG_FILE_NAME);
    }
    static configExists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield exists(this.configFilePath());
                return result;
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }
}
Config.CONFIG_FOLDER_NAME = ".cf-images";
Config.CONFIG_FILE_NAME = "cf-images.config.json";

const inquire = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield inquirer.prompt(questions);
        return answers;
    }
    catch (error) {
        if (error.isTtyError) {
            console.error(error);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
});

const logJson = (input) => {
    const output = JSON.stringify(input, null, 4);
    console.log(output);
};

const newClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield Config.read();
    return new CloudflareClient({
        accountId: config.accountId,
        apiKey: config.apiKey,
    });
});

const _uploadImage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield newClient();
        const response = yield client.uploadImage(options);
        logJson(response.result);
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
const questions = [
    {
        name: "id",
        type: "input",
        message: "Cloudflare Image Id",
    },
    {
        name: "path",
        type: "input",
        message: "Path to image file",
    },
];
const uploadImage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield inquire(questions);
        yield _uploadImage(options);
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});

const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield uploadImage();
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    main()
        .then((res) => {
        process.exit(0);
    })
        .catch((error) => {
        process.exit(1);
    });
}))();
//# sourceMappingURL=main.mjs.map
