import inquirer from 'inquirer';
import require$$0 from 'ansi-escapes';
import require$$1 from 'figures';
import require$$2 from 'inquirer/lib/prompts/base.js';
import require$$3 from 'inquirer/lib/objects/choices.js';
import require$$4 from 'inquirer/lib/utils/events.js';
import * as require$$5 from 'inquirer/lib/utils/readline.js';
import require$$6 from 'inquirer/lib/utils/paginator.js';
import require$$7 from 'picocolors';
import require$$9 from 'rxjs/operators';
import { readdir } from 'fs/promises';
import path from 'path';
import fuzzy from 'fuzzy';
import 'os';
import 'fs';
import 'cloudflare-images';
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

function __awaiter$1(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var runAsync$2 = {exports: {}};

function isPromise$1(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Return a function that will run a function asynchronously or synchronously
 *
 * example:
 * runAsync(wrappedFunction, callback)(...args);
 *
 * @param   {Function} func  Function to run
 * @param   {Function} cb    Callback function passed the `func` returned value
 * @return  {Function(arguments)} Arguments to pass to `func`. This function will in turn
 *                                return a Promise (Node >= 0.12) or call the callbacks.
 */

var runAsync$1 = runAsync$2.exports = function (func, cb) {
  cb = cb || function () {};

  return function () {

    var args = arguments;

    var promise = new Promise(function (resolve, reject) {
      var resolved = false;
      const wrappedResolve = function (value) {
        if (resolved) {
          console.warn('Run-async promise already resolved.');
        }
        resolved = true;
        resolve(value);
      };

      var rejected = false;
      const wrappedReject = function (value) {
        if (rejected) {
          console.warn('Run-async promise already rejected.');
        }
        rejected = true;
        reject(value);
      };

      var usingCallback = false;
      var callbackConflict = false;
      var contextEnded = false;

      var answer = func.apply({
        async: function () {
          if (contextEnded) {
            console.warn('Run-async async() called outside a valid run-async context, callback will be ignored.');
            return function() {};
          }
          if (callbackConflict) {
            console.warn('Run-async wrapped function (async) returned a promise.\nCalls to async() callback can have unexpected results.');
          }
          usingCallback = true;
          return function (err, value) {
            if (err) {
              wrappedReject(err);
            } else {
              wrappedResolve(value);
            }
          };
        }
      }, Array.prototype.slice.call(args));

      if (usingCallback) {
        if (isPromise$1(answer)) {
          console.warn('Run-async wrapped function (sync) returned a promise but async() callback must be executed to resolve.');
        }
      } else {
        if (isPromise$1(answer)) {
          callbackConflict = true;
          answer.then(wrappedResolve, wrappedReject);
        } else {
          wrappedResolve(answer);
        }
      }
      contextEnded = true;
    });

    promise.then(cb.bind(null, null), cb);

    return promise;
  }
};

runAsync$1.cb = function (func, cb) {
  return runAsync$1(function () {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === func.length - 1) {
      args.push(this.async());
    }
    return func.apply(this, args);
  }, cb);
};

const ansiEscapes = require$$0;
const figures = require$$1;
const Base = require$$2;
const Choices = require$$3;
const observe = require$$4;
const utils = require$$5;
const Paginator = require$$6;
const pc = require$$7;
const runAsync = runAsync$2.exports;
const { takeWhile } = require$$9;

const isSelectable = (choice) =>
  choice.type !== 'separator' && !choice.disabled;

class AutocompletePrompt extends Base {
  constructor(
    questions /*: Array<any> */,
    rl /*: readline$Interface */,
    answers /*: Array<any> */
  ) {
    super(questions, rl, answers);

    if (!this.opt.source) {
      this.throwParamError('source');
    }

    this.currentChoices = new Choices([]);

    this.firstRender = true;
    this.selected = 0;

    // Make sure no default is set (so it won't be printed)
    this.initialValue = this.opt.default;
    if (!this.opt.suggestOnly) {
      this.opt.default = null;
    }

    const shouldLoop = this.opt.loop === undefined ? true : this.opt.loop;
    this.paginator = new Paginator(this.screen, {
      isInfinite: shouldLoop,
    });
  }

  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */
  _run(cb /*: Function */) /*: this*/ {
    this.done = cb;

    if (Array.isArray(this.rl.history)) {
      this.rl.history = [];
    }

    const events = observe(this.rl);

    const dontHaveAnswer = () => this.answer === undefined;

    events.line
      .pipe(takeWhile(dontHaveAnswer)) // $FlowFixMe[method-unbinding]
      .forEach(this.onSubmit.bind(this));
    events.keypress
      .pipe(takeWhile(dontHaveAnswer)) // $FlowFixMe[method-unbinding]
      .forEach(this.onKeypress.bind(this));

    // Call once at init
    this.search(undefined);

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {undefined}
   */
  render(error /*: ?string */) {
    // Render question
    let content = this.getQuestion();
    let bottomContent = '';

    if (this.firstRender) {
      const suggestText = this.opt.suggestOnly ? ', tab to autocomplete' : '';
      content += pc.dim(
        '(Use arrow keys or type to search' + suggestText + ')'
      );
    }

    // Render choices or answer depending on the state
    if (this.status === 'answered') {
      content += pc.cyan(this.shortAnswer || this.answerName || this.answer);
    } else if (this.searching) {
      content += this.rl.line;
      bottomContent += '  ' + pc.dim(this.opt.searchText || 'Searching...');
    } else if (this.nbChoices) {
      const choicesStr = listRender(this.currentChoices, this.selected);
      content += this.rl.line;
      const indexPosition = this.selected;
      let realIndexPosition = 0;
      this.currentChoices.choices.every((choice, index) => {
        if (index > indexPosition) {
          return false;
        }
        const name = choice.name;
        realIndexPosition += name ? name.split('\n').length : 0;
        return true;
      });
      bottomContent += this.paginator.paginate(
        choicesStr,
        realIndexPosition,
        this.opt.pageSize
      );
    } else {
      content += this.rl.line;
      bottomContent += '  ' + pc.yellow(this.opt.emptyText || 'No results...');
    }

    if (error) {
      bottomContent += '\n' + pc.red('>> ') + error;
    }

    this.firstRender = false;

    this.screen.render(content, bottomContent);
  }

  /**
   * When user press `enter` key
   */
  onSubmit(line /* : string */) {
    let lineOrRl = line || this.rl.line;

    // only set default when suggestOnly (behaving as input prompt)
    // list prompt does only set default if matching actual item in list
    if (this.opt.suggestOnly && !lineOrRl) {
      lineOrRl = this.opt.default === null ? '' : this.opt.default;
    }

    if (typeof this.opt.validate === 'function') {
      const checkValidationResult = (validationResult) => {
        if (validationResult !== true) {
          this.render(
            validationResult || 'Enter something, tab to autocomplete!'
          );
        } else {
          this.onSubmitAfterValidation(lineOrRl);
        }
      };

      let validationResult;
      if (this.opt.suggestOnly) {
        validationResult = this.opt.validate(lineOrRl, this.answers);
      } else {
        const choice = this.currentChoices.getChoice(this.selected);
        validationResult = this.opt.validate(choice, this.answers);
      }

      if (isPromise(validationResult)) {
        validationResult.then(checkValidationResult);
      } else {
        checkValidationResult(validationResult);
      }
    } else {
      this.onSubmitAfterValidation(lineOrRl);
    }
  }

  onSubmitAfterValidation(line /* : string */) {
    let choice = {};
    if (this.nbChoices <= this.selected && !this.opt.suggestOnly) {
      this.rl.write(line);
      this.search(line);
      return;
    }

    if (this.opt.suggestOnly) {
      choice.value = line || this.rl.line;
      this.answer = line || this.rl.line;
      this.answerName = line || this.rl.line;
      this.shortAnswer = line || this.rl.line;
      this.rl.line = '';
    } else if (this.nbChoices) {
      choice = this.currentChoices.getChoice(this.selected);
      this.answer = choice.value;
      this.answerName = choice.name;
      this.shortAnswer = choice.short;
    } else {
      this.rl.write(line);
      this.search(line);
      return;
    }

    runAsync(this.opt.filter, (err, value) => {
      choice.value = value;
      this.answer = value;

      if (this.opt.suggestOnly) {
        this.shortAnswer = value;
      }

      this.status = 'answered';
      // Rerender prompt
      this.render();
      this.screen.done();
      this.done(choice.value);
    })(choice.value);
  }

  search(searchTerm /* : ?string */) /*: Promise<any>*/ {
    this.selected = 0;

    // Only render searching state after first time
    if (this.searchedOnce) {
      this.searching = true;
      this.currentChoices = new Choices([]);
      this.render(); // Now render current searching state
    } else {
      this.searchedOnce = true;
    }

    this.lastSearchTerm = searchTerm;

    let thisPromise;
    try {
      const result = this.opt.source(this.answers, searchTerm);
      thisPromise = Promise.resolve(result);
    } catch (error) {
      thisPromise = Promise.reject(error);
    }

    // Store this promise for check in the callback
    const lastPromise = thisPromise;

    return thisPromise.then((choices) => {
      // If another search is triggered before the current search finishes, don't set results
      if (thisPromise !== lastPromise) return;

      this.currentChoices = new Choices(choices);

      const realChoices = choices.filter((choice) => isSelectable(choice));
      this.nbChoices = realChoices.length;

      const selectedIndex = realChoices.findIndex(
        (choice) =>
          choice === this.initialValue || choice.value === this.initialValue
      );

      if (selectedIndex >= 0) {
        this.selected = selectedIndex;
      }

      this.searching = false;
      this.render();
    });
  }

  ensureSelectedInRange() {
    const selectedIndex = Math.min(this.selected, this.nbChoices); // Not above currentChoices length - 1
    this.selected = Math.max(selectedIndex, 0); // Not below 0
  }

  /**
   * When user type
   */

  onKeypress(e /* : {key: { name: string, ctrl: boolean }, value: string } */) {
    let len;
    const keyName = (e.key && e.key.name) || undefined;

    if (keyName === 'tab' && this.opt.suggestOnly) {
      if (this.currentChoices.getChoice(this.selected)) {
        this.rl.write(ansiEscapes.cursorLeft);
        const autoCompleted = this.currentChoices.getChoice(
          this.selected
        ).value;
        this.rl.write(ansiEscapes.cursorForward(autoCompleted.length));
        this.rl.line = autoCompleted;
        this.render();
      }
    } else if (keyName === 'down' || (keyName === 'n' && e.key.ctrl)) {
      len = this.nbChoices;
      this.selected = this.selected < len - 1 ? this.selected + 1 : 0;
      this.ensureSelectedInRange();
      this.render();
      utils.up(this.rl, 2);
    } else if (keyName === 'up' || (keyName === 'p' && e.key.ctrl)) {
      len = this.nbChoices;
      this.selected = this.selected > 0 ? this.selected - 1 : len - 1;
      this.ensureSelectedInRange();
      this.render();
    } else {
      this.render(); // Render input automatically
      // Only search if input have actually changed, not because of other keypresses
      if (this.lastSearchTerm !== this.rl.line) {
        this.search(this.rl.line); // Trigger new search
      }
    }
  }
}

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function listRender(choices, pointer /*: string */) /*: string */ {
  let output = '';
  let separatorOffset = 0;

  choices.forEach((choice, i) => {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += '  ' + choice + '\n';
      return;
    }

    if (choice.disabled) {
      separatorOffset++;
      output += '  - ' + choice.name;
      output +=
        ' (' +
        (typeof choice.disabled === 'string' ? choice.disabled : 'Disabled') +
        ')';
      output += '\n';
      return;
    }

    const isSelected = i - separatorOffset === pointer;
    let line = (isSelected ? figures.pointer + ' ' : '  ') + choice.name;

    if (isSelected) {
      line = pc.cyan(line);
    }

    output += line + ' \n';
  });

  return output.replace(/\n$/, '');
}

function isPromise(value) {
  return typeof value === 'object' && typeof value.then === 'function';
}

var inquirerAutocompletePrompt = AutocompletePrompt;

function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	return string.replace(ansiRegex(), '');
}

const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value: (red, green, blue) => {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16 +
					(36 * Math.round(red / 255 * 5)) +
					(6 * Math.round(green / 255 * 5)) +
					Math.round(blue / 255 * 5);
			},
			enumerable: false
		},
		hexToRgb: {
			value: hex => {
				const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let {colorString} = matches.groups;

				if (colorString.length === 3) {
					colorString = colorString.split('').map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF
				];
			},
			enumerable: false
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false
		},
		ansi256ToAnsi: {
			value: code => {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false
		}
	});

	return styles;
}

const ansiStyles = assembleStyles();

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

const getPaths = (options) => {
    const { rootPath, pattern, excludeFilter, defaultItem, depthLimit, } = options;
    const fuzzOptions = {
        pre: ansiStyles.green.open,
        post: ansiStyles.green.close,
    };
    const nodes = listNodes(rootPath, depthLimit, options);
    const filterPromise = nodes.then((nodeList) => {
        const preFilteredNodes = !excludeFilter
            ? nodeList
            : nodeList.filter(node => !excludeFilter(node));
        const filteredNodes = fuzzy
            .filter(pattern || "", preFilteredNodes, fuzzOptions)
            .map(e => e.string);
        if (!pattern && defaultItem) {
            filteredNodes.unshift(defaultItem);
        }
        return filteredNodes;
    });
    return filterPromise;
};
const listNodes = (nodePath, level, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { excludePath, itemType, depthLimit, } = options;
    try {
        if (excludePath(nodePath)) {
            return [];
        }
        const nodes = yield readdir(nodePath);
        const currentNode = (itemType !== "file" ? [nodePath] : []);
        if (nodes.length > 0 && (depthLimit === undefined || level >= 0)) {
            const nodesWithPath = nodes.map(nodeName => listNodes(path.join(nodePath, nodeName), depthLimit ? level - 1 : undefined, options));
            const subNodes = yield Promise.all(nodesWithPath);
            return subNodes.reduce((acc, val) => acc.concat(val), currentNode);
        }
        return currentNode;
    }
    catch (err) {
        if (err.code === "ENOTDIR") {
            return itemType !== "directory" ? [nodePath] : [];
        }
        return [];
    }
});

class InquirerFuzzyPath extends inquirerAutocompletePrompt {
    constructor(question, rl, answers) {
        const { depthLimit, itemType = "any", rootPath = ".", excludePath = () => false, excludeFilter = false, } = question;
        const questionBase = Object.assign({}, question, {
            source: (_, pattern) => getPaths({
                rootPath,
                pattern,
                excludePath,
                excludeFilter,
                itemType,
                defaultItem: question.default,
                depthLimit,
            }),
        });
        super(questionBase, rl, answers);
    }
    search(searchTerm) {
        return super.search(searchTerm).then(() => {
            this.currentChoices.getChoice = (choiceIndex) => {
                const choice = this.currentChoices.getChoice(choiceIndex);
                return {
                    value: stripAnsi(choice.value),
                    name: stripAnsi(choice.name),
                    short: stripAnsi(choice.name),
                };
            };
        });
    }
    onSubmit(line) {
        super.onSubmit(stripAnsi(line));
    }
}

const questions = [
    {
        type: "fuzzypath",
        name: "path",
        excludePath: (nodePath) => nodePath.startsWith("node_modules"),
        itemType: "file",
        message: "Choose a file to upload: ",
    },
];
const getImageOptions = () => __awaiter$1(void 0, void 0, void 0, function* () {
    try {
        inquirer.registerPrompt("fuzzypath", InquirerFuzzyPath);
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
const uploadImage = () => __awaiter$1(void 0, void 0, void 0, function* () {
    try {
        const answers = yield getImageOptions();
        console.log(answers);
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});

const main = () => __awaiter$1(void 0, void 0, void 0, function* () {
    yield uploadImage();
});
(() => __awaiter$1(void 0, void 0, void 0, function* () {
    main()
        .then((res) => {
        process.exit(0);
    })
        .catch((error) => {
        process.exit(1);
    });
}))();
//# sourceMappingURL=main.mjs.map
