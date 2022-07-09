export const logJson = (input: any): void => {
    const output = JSON.stringify(input, null, 4)
    console.log(output)
}
