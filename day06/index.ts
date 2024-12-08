const input: string = await Bun.file("input.txt").text();


// Put string into a grid
let grid: string[][] = [];
for (let str of input.split("\n")) {
    let row: string[] = [];
    for (let i = 0; i < str.length; i++) {
        row.push(str.charAt(i));
    }
    grid.push(row);
}

function findVisits(aGrid: string[][]): string {
    const height = aGrid.length;
    const width = aGrid[0].length;
    // Find initial column and row of the caret
    let row = grid.findIndex(res => res.includes("^"));
    let col = grid[row].indexOf("^");
    let countSet = new Set();
    let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let direction = directions[0];

    // Repeat until out of bounds
    while(true) {
        let locStr = JSON.stringify([col, row]);
        countSet.add(locStr);

        // Check directions, both ahead and 90 degrees right
        if (row + direction[0] >= 0 && row + direction[0] < height && col + direction[1] >= 0 && col + direction[1] < width) { // Bounds check
            if (grid[row + direction[0]][col + direction[1]] == "#") { // Collision
                direction = directions[(directions.indexOf(direction) + 1) % 4];
            }
            else {
                row += direction[0];
                col += direction[1];
            }
        }
        else break;
    }
    return countSet.size.toString();
}

console.log(findVisits(grid));