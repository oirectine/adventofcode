const input = await Bun.file("input.txt").text();
const output = await Bun.file("output.txt");
const writer = output.writer();

const bots: number[][][] = []; // Default Bot ID, Position, Velocity


for (let i = 0; i < input.split("\n").filter((i) => i !== "").length; i++) {
    const line = input.split("\n")[i];
    const vals = line.match(/-?\d+/g)?.map(Number) as number[];
    const [px, py, vx, vy] = vals;
    bots[i] = [[px, py], [vx, vy]];
}


function moveBots(bots: number[][][], time: number, width: number, height: number): {tl: number, tr: number, bl: number, br: number} {

    const midw = (width - 1) / 2;
    const midh = (height - 1) / 2;

    // Move the bots

    for (let i of bots) {
        i[0][0] = (i[0][0] + (i[1][0] * (time)) % width + width) % width;
        i[0][1] = (i[0][1] + (i[1][1] * (time)) % height + height) % height;
    }

    const tl = bots.filter((bot) => 0 <= bot[0][0] && bot[0][0] < midw && 0 <= bot[0][1] && bot[0][1] < midh).length;
    const tr = bots.filter((bot) => midw < bot[0][0] && bot[0][0] <= width && 0 <= bot[0][1] && bot[0][1] < midh).length;
    const bl = bots.filter((bot) => 0 <= bot[0][0] && bot[0][0] < midw && midh < bot[0][1] && bot[0][1] <= height).length;
    const br = bots.filter((bot) => midw < bot[0][0] && bot[0][0] <= width && midh < bot[0][1] && bot[0][1] <= height).length;

    return {tl, tr, bl, br};
}

function findTree(bots: number[][][], width: number, height: number): string {
    
    const clonedBots = structuredClone(bots);
    const r = moveBots(bots, 100, width, height);
    const safetyFactor = r.bl * r.br * r.tl * r.tr;
    let treeNumber: number = 0;
    const e = 210;

    while (true) {
        treeNumber++;
        const c = moveBots(clonedBots, 1, width, height);
        if (c.tl > e || c.tr > e || c.bl > e || c.br > e) break;
    }

    //Write the image to a file (this isn't really needed for the answer, but I just wanna see the tree :))
    const outputArray: String[][] = [];
    for (let y = 0; y < height; y++) {
        outputArray[y] = []
        for (let x = 0; x < width; x++) {
            outputArray[y][x] = ".";
        } 
    }
    for (let i of clonedBots) {
        outputArray[i[0][1]][i[0][0]] = "#";
    }

    const flatArray = outputArray.map((x)=> x.join(""));
    flatArray.forEach((n) => writer.write(`${n}\n`));
    writer.end();

    return `Safety factor after 100 seconds: ${safetyFactor}\nTree found at iteration ${treeNumber}`;
}

console.log(findTree(bots, 101, 103));