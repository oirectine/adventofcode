const input = await Bun.file("input.txt").text();

function countTrailScores(inputFile: string): string {
    const splitInput = input.split("\n").filter(n => n !== "");

    // Populate map with data
    const topoMap = new Map<string, number>();
    for (let i in splitInput) {
        const chars = splitInput[i].split("");
        for (let j in chars) {
            topoMap.set(JSON.stringify([+i, +j]), Number(chars[j]));
        }
    }

    // Find locations of all trailheads
    const trailheads = new Set<string>();
    topoMap.forEach((v, k) => v===0? trailheads.add(k): false);

    let scoreCount = [0]; // Counts every possible trail (part 2)
    let trailCount = 0;
    // Test each trailhead
    trailheads.forEach((v) => trailCount += testTrail(topoMap, v, scoreCount).size);
    
    return `Sum of trail scores: ${trailCount}\nSum of all ratings: ${scoreCount[0]}`;
}

// Recursive trail test function. Returns set of unique trails
function testTrail(topoMap: Map<string, number>, testCoords: string, counter: number[]): Set<string> {
    const here = (topoMap.get(testCoords));
    const numCoords = JSON.parse(testCoords);
    const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    const trailSet = new Set<string>();
    if (here === 9) { // Base case
        counter[0]++;
        return trailSet.add(testCoords);
    }
    else { // Test 4 directions to see if they're 'steppable'
        for (let i of directions) {
            let nextCoords = JSON.stringify([numCoords[0] + i[0], numCoords[1] + i[1]]);
            if (topoMap.get(nextCoords) === Number(here) + 1) {
                testTrail(topoMap, nextCoords, counter).forEach(trailSet.add, trailSet); // Merge set of recursed test to count unique trails for part 1
            }
        }
        return trailSet;
    }
}

console.log(countTrailScores(input));