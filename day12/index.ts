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
function getField(x: number, y:number, inputMap: Map<string, string>): {fieldSet: Set<string>, perimeter: number} {
    const fields = new Set<string>();
    const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    const character = inputMap.get(`[${x}, ${y}]`);
    let fenceCount: number = 0;

    function floodFill(x: number, y: number): void {
        let blockFences = 4;
        fields.add(`[${x}, ${y}]`);
        for (let d of directions) {
            const checkBlock = `[${x + d[0]}, ${y + d[1]}]`
            if (inputMap.has(checkBlock) && inputMap.get(checkBlock) === character) {
                blockFences--;
                if (!fields.has(checkBlock)) floodFill(x + d[0], y + d[1]);
            }
        }
        fenceCount += blockFences;
    }
    floodFill(x, y);
    return {fieldSet: fields, perimeter: fenceCount};
}

// Return total cost of fences
function getFenceCost(inputMap: Map<string, string>): string {
    const countSet = new Set();

    let totalCost: number = 0;

    // Loop over each map coordinate
    for (let [coords] of inputMap) {
        if (!countSet.has(coords)) {
            let getCoords = JSON.parse(coords);
            let currentField = getField(getCoords[0], getCoords[1], inputMap);
            totalCost += currentField["fieldSet"].size * currentField["perimeter"];
            currentField["fieldSet"].forEach((value) => countSet.add(value));
        }
    }
    return `Cost of fences: ${totalCost}`;
}

console.log(getFenceCost(grid));