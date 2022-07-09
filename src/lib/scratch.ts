// import { inquirer } from "./inquirer"
import inquirer from "inquirer"

export const scratch = () => {
    inquirer
        .prompt([
            {
                name: "faveReptile",
                message: "What is your favorite reptile?"
            },
        ])
        .then(answers => {
            console.info("Answer:", answers.faveReptile);
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}
