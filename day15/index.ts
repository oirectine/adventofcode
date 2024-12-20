const input = await Bun.file("input.txt").text();

let botLocation: string;
const splitInput =  input.split("\n\n");
const code = splitInput[1].split("").filter((n) => n != "\n");
const grid = new Map<string, string>();
const wideGrid = new Map<string, string>();
const lines = splitInput[0].split("\n");
for (let x in lines) {
    const chars = lines[Number(x)].split("");
    for (let y in chars) {
        grid.set(`[${x}, ${y}]`, chars[y]);
        if (chars[y] === "O") {
            wideGrid.set(`[${x}, ${(Number(y) * 2).toString()}]`, "[");
            wideGrid.set(`[${x}, ${(Number(y) * 2 + 1).toString()}]`, "]");
        }
        else if (chars[y] === "@") {
            wideGrid.set(`[${x}, ${(Number(y) * 2).toString()}]`, "@");
            wideGrid.set(`[${x}, ${(Number(y) * 2 + 1).toString()}]`, ".");
        }
        else {
            wideGrid.set(`[${x}, ${(Number(y) * 2).toString()}]`, chars[y]);
            wideGrid.set(`[${x}, ${(Number(y) * 2 + 1).toString()}]`, chars[y]);
        }
    }
}
const dirMatrix: [string, [number, number]][] = [
    [">", [0, 1]],
    ["v", [1, 0]],
    ["<", [0, -1]],
    ["^", [-1, 0]]
]
const dirs: Map<string, number[]> = new Map(dirMatrix);

function moveBlock(currentLocation: string, direction: string, grid: Map<string, string>): string { // Moves queue of blocks
    // if there's a block in the direction next to the block, recursively push the next block. The robot is regarded as a 'block'.
    let safeToPush: boolean = true;
    const blocksToPush: Set<string> = new Set<string>();
    const newBlocks: Map<string, string> = new Map<string, string>();
    const location = JSON.parse(currentLocation);
    const nextLocation = `[${location[0] + dirs.get(direction)![0]}, ${location[1] + dirs.get(direction)![1]}]`

    function pushBlock(targetBlock: string): boolean {
        const location = JSON.parse(targetBlock);
        const nextLocation = `[${location[0] + dirs.get(direction)![0]}, ${location[1] + dirs.get(direction)![1]}]`
        const nextLocationLeft = `[${location[0] + dirs.get(direction)![0]}, ${location[1] + dirs.get(direction)![1] - 1}]`
        const nextLocationRight = `[${location[0] + dirs.get(direction)![0]}, ${location[1] + dirs.get(direction)![1] + 1}]`
        let retVal: boolean = true;

        blocksToPush.add(targetBlock);

        if (grid.get(nextLocation) === "#") {
            return false;
        }
        if (grid.get(nextLocation) === "O") {
            retVal =  pushBlock(nextLocation);
        }
        if (grid.get(nextLocation) === "[" && !blocksToPush.has(nextLocationRight)) {
            retVal = pushBlock(nextLocationRight) && pushBlock(nextLocation);
        }
        if (grid.get(nextLocation) === "]" && !blocksToPush.has(nextLocationLeft)) {
            retVal = pushBlock(nextLocationLeft) && pushBlock(nextLocation);
        }
        return retVal;
    }

    safeToPush = pushBlock(currentLocation)

    // Update the grid with new iteration
    if (safeToPush) {
        for (let i of blocksToPush) {
            let coords = JSON.parse(i);
            newBlocks.set(`[${coords[0] + dirs.get(direction)![0]}, ${coords[1] + dirs.get(direction)![1]}]`, grid.get(i)!);
            grid.set(i, ".");
        }
        for (let i of newBlocks.entries()) {
            grid.set(i[0], i[1]);
        }
        grid.set(currentLocation, ".");
        currentLocation = nextLocation;
    }
    return currentLocation;
}

function moveRobot(program: string[], map: Map<string, string>, countChar: string): number {

    // Find the bot
    for (let i of map.entries()) {
        if (i[1] === "@") botLocation = i[0];
    }

    let total: number = 0;
    // Run program
    for (let i of program) {
        botLocation = moveBlock(botLocation, i, map);
    }
    // Calculate result
    const blocks = Array.from(map.entries()).filter((x) => x[1] === countChar).map((x)=> JSON.parse(x[0]));
    for (let i of blocks) {
        total += 100 * i[0] + i[1];
    }
    return total;
}

console.log(`Sum of GPS coordinates for part 1: ${moveRobot(code, grid, "O")}\nSum of GPS coordinates for part 2: ${moveRobot(code, wideGrid, "[")}`);