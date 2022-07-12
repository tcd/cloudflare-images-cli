#! /usr/bin/env node
import meow from 'meow';
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

const isBlank = (data) => {
    if (data == undefined) {
        return true;
    }
    if (data == null) {
        return true;
    }
    if (data === "") {
        return true;
    }
    if (Array.isArray(data) && data.length === 0) {
        return true;
    }
    if (data.constructor === Object && Object.keys(data).length === 0) {
        return true;
    }
    return false;
};

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

const questions$2 = [
    {
        name: "id",
        type: "input",
        message: "Cloudflare Image Id",
    },
];
const deleteImage = (_) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield inquire(questions$2);
        const client = yield newClient();
        const response = yield client.deleteImage(answers.id);
        logJson(response.result);
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});

const questions$1 = [
    {
        name: "accountId",
        type: "input",
        message: "Cloudflare Account Id",
    },
    {
        name: "apiKey",
        type: "input",
        message: "Cloudflare API Key",
    },
];
const init = (_) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield inquire(questions$1);
        if (isBlank(answers.accountId)) {
            console.log("accountId can't be blank");
            process.exit(1);
        }
        if (isBlank(answers.apiKey)) {
            console.log("accountId can't be blank");
            process.exit(1);
        }
        yield Config.write(answers);
        console.log("setup complete 🥳");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});

const listImages = (flags) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield newClient();
        const response = yield client.listImages({ page: 1, per_page: 100 });
        if (flags === null || flags === void 0 ? void 0 : flags.verbose) {
            logJson(response);
        }
        else {
            logJson(response.result);
        }
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});

const listVariants = (flags) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield newClient();
        const response = yield client.listVariants();
        if (flags === null || flags === void 0 ? void 0 : flags.verbose) {
            logJson(response);
        }
        else {
            logJson(response.result);
        }
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
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
const uploadImage = (_flags) => __awaiter(void 0, void 0, void 0, function* () {
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

const commands = [
    { name: "init", description: "Configure Cloudflare credentials" },
    { name: "list-images", description: "List images" },
    { name: "list-variants", description: "List variants" },
    { name: "upload-image", description: "Upload a local image file to Cloudflare" },
    { name: "delete-image", description: "Delete an image on Cloudflare Images" },
];
const flags = [
    { name: "help", alias: "h", description: "Show usage information" },
    { name: "version", alias: "V", description: "Show version information" },
    { name: "verbose", alias: "v", description: "Verbose output" },
];
const flagLength = (flag) => {
    var _a;
    let dashLength = 2;
    let nameLength = flag.name.length;
    if ((_a = flag === null || flag === void 0 ? void 0 : flag.alias) === null || _a === void 0 ? void 0 : _a.length) {
        dashLength += 2;
        nameLength += flag.alias.length;
    }
    const length = nameLength + dashLength;
    return length;
};
const longestCommandName = Math.max(...(commands.map(command => command.name.length)));
const longestFlagName = Math.max(...(flags.map(flag => flagLength(flag))));
const longestFlagAlias = Math.max(...(flags.map(flag => { var _a, _b; return (_b = (_a = flag === null || flag === void 0 ? void 0 : flag.alias) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0; })));
const INDENT = " ".repeat(6);
const commandHelp = commands.map(({ name, description }) => {
    return INDENT + name.padEnd(longestCommandName + 2, " ") + description;
}).join("\n");
const flagHelp = flags.map((flag) => {
    var _a;
    const nameText = `--${flag.name}`;
    const aliasText = ((_a = flag === null || flag === void 0 ? void 0 : flag.alias) === null || _a === void 0 ? void 0 : _a.length) ? `-${flag.alias} ` : " ".repeat(longestFlagAlias + 2);
    return INDENT + (aliasText + nameText).padEnd(longestFlagName + 2, " ") + flag.description;
}).join("\n");
const HELP = `
    Usage
      $ cf-images <command>

    Commands
${commandHelp}

    Options
${flagHelp}

    Examples
      $ cf-images list-images >> cloudflare-images.json
`;

const COMMANDS = {
    "init": init,
    "list-images": listImages,
    "list-variants": listVariants,
    "upload-image": uploadImage,
    "delete-image": deleteImage,
};
class Program {
    constructor(args, flags) {
        this.args = args;
        this.flags = flags;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandArg = this.args[0];
                const command = COMMANDS[commandArg];
                if (command == null || command == undefined) {
                    console.log(HELP);
                    process.exit(0);
                }
                yield command(this.flags);
                process.exit(0);
            }
            catch (e) {
                if (e.code == "ENOENT") {
                    console.error(`error - unable to find file: `);
                }
                else {
                    console.error("error: " + e.message);
                }
                process.exit(1);
            }
        });
    }
}

var version = "1.1.0";

const versionNumber = version;
const VERSION = `cf-images version ${versionNumber}`;

const cli = () => __awaiter(void 0, void 0, void 0, function* () {
    const _cli = meow(HELP, {
        importMeta: import.meta,
        flags: {
            debug: {
                alias: "d",
                type: "boolean",
                default: false,
            },
            verbose: {
                alias: "v",
                type: "boolean",
                default: false,
            },
            version: {
                alias: "V",
                type: "boolean",
                default: false,
            },
        },
        version: VERSION,
    });
    yield new Program(_cli.input, _cli.flags).main();
});

const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield cli();
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
