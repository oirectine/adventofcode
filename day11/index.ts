const input = await Bun.file("input.txt").text();

let stones = input.split(" ").map(Number);

function blink(inputData: number[], numBlinks: number): number {

    // Initialise frequency map
    let freqMap = new Map<number, number>();
    for (let i of inputData) {
        freqMap.set(i, 1);
    }

    // Blink initial map recursively
    function blinkMap(map: Map<number, number>, numBlinks: number) : Map<number, number> {
        if (numBlinks === 0) return map;

        let nextMap = new Map<number, number>();
        for (let [num, count] of map.entries()) {
            if (num.toString().length % 2 === 0) {
                const div = 10 ** (num.toString().length / 2);
                const right = num % div;
                const left = Math.floor(num / div);
                nextMap.set(left, (nextMap.get(left) || 0) + count);
                nextMap.set(right, (nextMap.get(right) || 0) + count);
            }
            else if (num !== 0) {
                const result = num * 2024;
                nextMap.set(result, (nextMap.get(result) || 0) + count);
            }
            else {               
                nextMap.set(1, (nextMap.get(1) || 0) + count);
            }
        }
        return blinkMap(nextMap, numBlinks - 1);
    }

    // Add up all the values in the array using the reduce function
    freqMap = blinkMap(freqMap, numBlinks);
    return Array.from(freqMap.values()).reduce((a, b) => a + b, 0);
}

console.log(`Number of stones after 25 blinks: ${blink(stones, 25)}\nNumber of stones after 75 blinks: ${blink(stones, 75)}`);

