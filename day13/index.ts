import { abs, lusolve, round, flatten, matrix, filter, map } from "mathjs";

const input = await Bun.file("input.txt").text();
const data = input.split("\n\n");

const buttonA: number[][] = [];
const buttonB: number[][] = [];
const target: number[][] = [];
const results: number[][] = [];

for (let d in data) {
    const index = Number(d);
    const lines = data[index].split("\n");
    buttonA[index] = [];
    buttonB[index] = [];
    target[index] = [];
    
    buttonA[index].push(Number(lines[0].substring(12, 14)));
    buttonA[index].push(Number(lines[0].substring(18, 20)));
    buttonB[index].push(Number(lines[1].substring(12, 14)));
    buttonB[index].push(Number(lines[1].substring(18, 20)));
    target[index].push(Number(lines[2].substring(lines[2].indexOf("=") + 1, lines[2].indexOf(","))));
    target[index].push(Number(lines[2].substring(lines[2].lastIndexOf("=") + 1)));
}

for (let d in data) {
    const index = Number(d);
    const coefficients = matrix([[buttonA[index][0], buttonB[index][0]], [buttonA[index][1], buttonB[index][1]]]);
    const constants = matrix(target[index]);

    const answers = lusolve(coefficients, constants);
    const filtered = map(filter(flatten(answers), (x) => abs(x - round(x)) < Number.EPSILON * 100), (x) => round(x)).valueOf() as number[];

    if (filtered.length > 0) results.push(filtered);
}

const result = results.reduce((sums, row) => row.map((num, i) => sums[i] + num), [0, 0]);

console.log(`Cost to win all prizes: ${(result[0] * 3) + result[1]}`);