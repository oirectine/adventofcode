const input: string = await Bun.file("input.txt").text();

const lines = input.split("\n").filter(x => x !== "");

const results: number[] = [];
const digits: number[][] = [];

for (let i of lines) {
    results.push(Number(i.split(": ")[0]));
    digits.push(i.split(": ")[1].split(" ").map(Number));
}

function countResult(results: number[], digits: number[][]): string {
    let count = 0;
    for (let i in results) {
        if (getCombinations(digits[i]).indexOf(results[i]) >= 0) {
            count += results[i];
        }
    }
    return `Result of valid combinations: ${count}`;
}

function getCombinations(inputArray: number[]): number[] {
    if (inputArray.length == 0) return [0];
    else if (inputArray.length == 1) return [inputArray[0]];
    else {
        let result: number[] = [];
        let last = inputArray[inputArray.length - 1];
        let reducedArray = inputArray.slice(0, inputArray.length - 1);
        result.push(...getCombinations(reducedArray).map(n => n + last));
        result.push(...getCombinations(reducedArray).map(n => n * last));
        result.push(...getCombinations(reducedArray).map(n => n * 10 ** last.toString().length + last)) // Concatenation
        return result;
    }
}

console.log(countResult(results, digits));