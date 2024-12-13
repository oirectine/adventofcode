const input = await Bun.file("input.txt").text();

let stones = input.split(" ").map(Number);

function blink(inputData: number[], numBlinks: number): number[] {

    // Initialise frequency map
    let freqMap = new Map();
    for (let i of inputData) {
        freqMap.set(i, 1);
    }

    // Transform current data for this blink
    for (let i = 0; i < numBlinks; i++) {

        let nextFreqMap = new Map();
        for (let [num, count] of freqMap.entries()) {
            if (num.toString().length % 2 === 0) {
                const div = 10 ** (num.toString().length / 2);
                const right = num % div;
                const left = Math.floor(num / div);
                nextFreqMap.set(left, (nextFreqMap.get(left) || 0) + count);
                nextFreqMap.set(right, (nextFreqMap.get(right) || 0) + count);
            }
            else if (num !== 0) {
                const result = [num * 2024];
                nextFreqMap.set(result, (nextFreqMap.get(result) || 0) + count);
            }
            else {               
                nextFreqMap.set(1, (nextFreqMap.get(1) || 0) + count);
            }
        }

        freqMap = nextFreqMap;
    }

    // Add up all the values in the array using the reduce function
    return Array.from(freqMap.values()).reduce((a, b) => a + b, 0);
}

console.log(`${blink(stones, 75)}`);

