const input = await Bun.file("input.txt").text();

const splitInput =  input.split("\n\n");
const code = splitInput[1].split("").filter((n) => n != "\n");
const grid = new Map<string, string>();
const lines = splitInput[0].split("\n");
for (let x in lines) {
    const chars = lines[Number(x)].split("");
    for (let y in chars) {
        grid.set(`[${x}, ${y}]`, chars[y]);
    }
}
const dirMatrix: [string, [number, number]][] = [
    [">", [0, 1]],
    ["v", [1, 0]],
    ["<", [0, -1]],
    ["^", [-1, 0]]
]
const dirs: Map<string, number[]> = new Map(dirMatrix);

// Find the bot
let botLocation: string = "";
for (let i of grid.entries()) {
    if (i[1] === "@") botLocation = i[0];
}

function moveBlock(currentLocation: string, direction: string): boolean { // Moves queue of blocks
    // if there's a block in the direction next to the block, recursively push the next block.
    let safeToPush: boolean = true;
    const location = JSON.parse(currentLocation);
    const nextLocation = `[${location[0] + dirs.get(direction)![0]}, ${location[1] + dirs.get(direction)![1]}]`
    if (grid.get(nextLocation) === "O") safeToPush = moveBlock(nextLocation, direction);
    if (grid.get(nextLocation) === "#") return false;

    if (safeToPush) {
        grid.set(nextLocation, grid.get(currentLocation)!);
        grid.set(currentLocation, ".");
        botLocation = nextLocation;
        return true;
    }
    else {
        botLocation = currentLocation;
        return false;
    }
}

function moveRobot(program: string[], map: Map<string, string>) {
    let total: number = 0;
    // Run program
    for (let i of program) {
        moveBlock(botLocation, i);
    }
    // Calculate result
    const blocks = Array.from(grid.entries()).filter((x) => x[1] === "O").map((x)=> JSON.parse(x[0]));
    for (let i of blocks) {
        total += 100 * i[0] + i[1];
    }
    console.log(total);
}

moveRobot(code, grid);