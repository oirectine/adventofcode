const input: string = await Bun.file("input.txt").text();

// Put string into a 2D array, with each element containing one single character
let grid: string[][] = [];
for (let str of input.split("\n")) {
    let row: string[] = [];
    for (let i = 0; i < str.length; i++) {
        row.push(str.charAt(i));
    }
    grid.push(row);
}

function countWord(wordGrid: string[][], wordToSearch: string, sharedIndex: number = -1): string { // Check up-right, right, down-right and down, forward and reversed.
    let count = 0;
    let crossoverCount = 0
    let crossoverSet = new Set();
    let width = wordGrid[0].length;
    let height = wordGrid.length;
    let len = wordToSearch.length;

    // For each letter
    for (let i = 0; i < wordGrid.length; i++) { // Y axis
        for (let j = 0; j < wordGrid[i].length; j++) { // X axis
            // Up-Right
            if (i + 1 - len >= 0 && j + len <= width) {
                if (checkWord(wordToSearch, wordGrid, j, i, [-1,1])) {
                    count++;
                    let check = JSON.stringify([i-sharedIndex,j+sharedIndex]);
                    if (sharedIndex >= 0) ((crossoverSet.has(check))? crossoverCount++ :crossoverSet.add(check)); 
                }
            }
            // Right
            if (j + len <= width) {
                if (checkWord(wordToSearch, wordGrid, j, i, [0,1])) count++;
            }
            // Down-Right
            if (i + len <= height && j + len <= width) {
                if (checkWord(wordToSearch, wordGrid, j, i, [1,1])) {
                    count++;
                    let check = JSON.stringify([i+sharedIndex,j+sharedIndex]);
                    if (sharedIndex >= 0) ((crossoverSet.has(check))? crossoverCount++ :crossoverSet.add(check)); 
                }
            }
            // Down
            if (i + len <= height) {
                if (checkWord(wordToSearch, wordGrid, j, i, [1,0])) count++;
            }
        }
    }
    return `Number of matches: ${count}\nNumber of crossovers: ${crossoverCount}`;
}

function checkWord(wordToSearch: string, grid: string[][], xIndex: number, yIndex: number, vector: number[]): boolean{ // Vector: Y,X
    // Check up to word length
    let builtString: string[] = [];
    for (let i = 0; i < wordToSearch.length; i++) {
        builtString.push(grid[yIndex + (i * vector[0])][xIndex + (i * vector[1])]);
    }
    if (builtString.join("") === wordToSearch || builtString.reverse().join("") === wordToSearch) return true; // Compare to reversed form as well as forward.
    else return false;
}

console.log(countWord(grid, "MAS", 1));