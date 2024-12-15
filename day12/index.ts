const input = await Bun.file("input.txt").text();

// Place initial map into a map
const grid = new Map;
const splitInput = input.split("\n");
for (let x in splitInput){
    const line = splitInput[x];
    for (let y = 0; y < line.length; y++) {
        grid.set(`[${x}, ${y}]`, line[y]);
    }
}

// Flood fill each field, and return a set of coordinates
function getField(x: number, y:number, inputMap: Map<string, string>): {fieldSet: Set<string>, perimeter: number, corners: number} {
    const fields = new Set<string>();
    const edgeMap = new Map<string, Set<string>>(); // Stores a direction, and a set of coords with a fence in that direction 
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const character = inputMap.get(`[${x}, ${y}]`);
    let fenceCount: number = 0;
    let cornerCount: number = 0;

    for (let d of directions) {
        edgeMap.set(`[${d}]`, new Set());
    }

    // Flood fill, and also detect edges and add them to their appropriate sets
    function floodFill(x: number, y: number): void {
        let blockFences = 4;
        fields.add(`[${x}, ${y}]`);
        for (let d of directions) {
            const checkBlock = `[${x + d[0]}, ${y + d[1]}]`;
            if (inputMap.has(checkBlock) && inputMap.get(checkBlock) === character) {
                blockFences--;
                if (!fields.has(checkBlock)) floodFill(x + d[0], y + d[1]);
            }
            else {
                edgeMap.get(`[${d}]`)?.add(`[${x}, ${y}]`);
            }
        }
        fenceCount += blockFences;
    }
    floodFill(x, y);

    // Count all outer corners using set logic
    for (let d = 0; d < directions.length; d++) {
        const set1 = edgeMap.get(`[${directions[d]}]`);
        const set2 = edgeMap.get(`[${directions[(d + 1) % 4]}]`);
        if (set1 && set2) {
            cornerCount += set1.intersection(set2).size;
        }
    }

    // Count the inner corners
    for (let i of fields) {
        const j = JSON.parse(i);
        for (let d = 0; d < directions.length; d++) {
            const check1 = edgeMap.get(`[${directions[(d + 1) % 4]}]`)?.has(`[${j[0] + directions[d][0]}, ${j[1] + directions[d][1]}]`);
            const check2 = edgeMap.get(`[${directions[(d + 0) % 4]}]`)?.has(`[${j[0] + directions[(d + 1) % 4][0]}, ${j[1] + directions[(d + 1) % 4][1]}]`);
            if (check1 && check2) {
                cornerCount++;
            }
        }
    }
    return {fieldSet: fields, perimeter: fenceCount, corners: cornerCount};
}

// Return total cost of fences
function getFenceCost(inputMap: Map<string, string>): string {
    const countSet = new Set();

    let totalCost: number = 0;
    let discountedCost: number = 0;

    // Loop over each map coordinate
    for (let [coords] of inputMap) {
        if (!countSet.has(coords)) {
            let getCoords = JSON.parse(coords);
            let currentField = getField(getCoords[0], getCoords[1], inputMap);
            totalCost += currentField["fieldSet"].size * currentField["perimeter"];
            discountedCost += currentField["fieldSet"].size * currentField["corners"];
            currentField["fieldSet"].forEach((value) => countSet.add(value));
        }
    }
    return `Cost of fences: ${totalCost}\nDiscounted cost: ${discountedCost}`;
}

console.log(getFenceCost(grid));