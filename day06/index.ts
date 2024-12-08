const input: string = await Bun.file("input.txt").text();


// Put string into a grid
const grid: string[][] = [];
for (let str of input.split("\n")) {
    let row: string[] = [];
    for (let i = 0; i < str.length; i++) {
        row.push(str.charAt(i));
    }
    grid.push(row);
}

function findVisits(aGrid: string[][]): number { // Return number of locations if no infinite loop occurs, otherwise, return -1
    const height = aGrid.length;
    const width = aGrid[0].length;
    // Find initial column and row of the caret
    let row = grid.findIndex(res => res.includes("^"));
    let col = grid[row].indexOf("^");
    let countSet = new Set();
    let coordSet = new Set();
    let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let direction = directions[0];
    let noLoop: boolean;

    // Repeat until out of bounds
    while(true) {
        let locStr = JSON.stringify([col, row]);
        let coordStr = JSON.stringify([col, row, direction]);
        countSet.add(locStr);

        // Check if in ininite loop, by checking if current position and direaction are already in the coordSet
        if (coordSet.has(coordStr)) {
            noLoop = false;
            break;
        }

        // Check directions, both ahead and 90 degrees right
        if (row + direction[0] >= 0 && row + direction[0] < height && col + direction[1] >= 0 && col + direction[1] < width) { // Bounds check
            coordSet.add(coordStr);
            if (grid[row + direction[0]][col + direction[1]] == "#") { // Collision
                direction = directions[(directions.indexOf(direction) + 1) % 4]; // Use modulus operator to loop through directions
            }
            else {
                row += direction[0];
                col += direction[1];
            }
        }
        else {
            noLoop = true;
            break;
        }
    }
    if (noLoop) return countSet.size;
    else return -1;
}

function countLoops(aGrid: string[][]): number { // TODO: Optimise further by testing only visited spaces in initial run.
    let loopCount = 0;       
    for (let i in aGrid) {
        for (let j = 0; j < aGrid.length; j++) {
            if (aGrid[i][j] == ".") {
                aGrid[i].splice(j, 1, "#");
                if (findVisits(aGrid) < 0) loopCount++;
                aGrid[i].splice(j, 1, ".");
            }
        }
    }
    return loopCount;
}

console.log(`Number of spaces visited: ${findVisits(grid)}\nNumber of infinite loop possibilities: ${countLoops(grid)}`);