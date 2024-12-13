const input = await Bun.file("input.txt").text();

let stones = input.split(" ").map(Number);

let cache = new Map<string, number[]>();
let blinkCache = new Map<number, number[]>();

function blink(inputData: number[], numBlinks: number) {
    let currentData = inputData;

    for (let i = 0; i < numBlinks; i++) {
        let nextData = [];
        for (let num of currentData) {
            if (blinkCache.has(num)) {
                nextData.push(...blinkCache.get(num)!);
            } else {
                let result;
                if (num.toString().length % 2 === 0) {
                    const div = 10 ** (num.toString().length / 2);
                    const left = Math.floor(num / div);
                    const right = num % div;
                    result = [left, right];
                } else if (num !== 0) {
                    result = [num * 2024];
                } else {
                    result = [1];
                }
                blinkCache.set(num, result);
                nextData.push(...result);
            }
        }
        currentData = nextData;
    }

    return currentData.length;
}

console.log (blink(stones, 45));