import 'inquirer';
import { resolve, sep } from 'path';
import { readdirSync } from 'fs';
import { createInterface } from 'readline';
import { promisify } from 'util';
import { cwd } from 'process';

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

const completer = (line) => {
    let currAddedPath;
    const currAddedDir = (line.indexOf(sep) != -1) ? line.substring(0, line.lastIndexOf(sep) + 1) : "";
    const currAddingDir = line.substring(line.lastIndexOf(sep) + 1);
    cwd() + sep + currAddedDir;
    const completions = readdirSync(line);
    const hits = completions.filter((c) => { return c.indexOf(currAddingDir) === 0; });
    const strike = [];
    if (hits.length === 1) {
        strike.push(currAddedPath + hits[0] + sep);
    }
    return (strike.length) ? [strike, line] : [hits.length ? hits : completions, line];
};
const promptForFilePath = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer,
    });
    const question = promisify(rl.question).bind(rl);
    const answer = yield question(prompt + " : ");
    return resolve(answer);
});

const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield promptForFilePath("give me a file path");
    return answer;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    main()
        .then((res) => {
        if (res) {
            console.log(res);
        }
        process.exit(0);
    })
        .catch((error) => {
        if (error) {
            console.error(error);
        }
        process.exit(1);
    });
}))();
//# sourceMappingURL=main.mjs.map
