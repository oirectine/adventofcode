const input: string = await Bun.file("input.txt").text();

function findAntinodes(inputString: string): string {
    // Create map, and populate it with coords.
    const coordMap = new Map();
    const stringLines = input.split("\n").filter(n => n != "");
    const height = stringLines.length;
    const width = stringLines[0].length;

    for (let i in stringLines) {
        const chars = stringLines[i].split("");
        for (let j in chars) {
            if (chars[j] !== ".") {
                if (!coordMap.has(chars[j])) coordMap.set(chars[j], []);
                coordMap.get(chars[j]).push([i, j]);
            }
        }
    }
    
    // Create set for the antinodes
    let antinodeSet = new Set<string>();
    for (let i of coordMap.values()) {
        for (let j = 0; j < i.length; j++) {
            // Cycically compare 2 coords, and place an antinode in the set.
            for (let k = 1; k < i.length; k++) {
                let result = [i[j][0]-i[(j+k) % i.length][0], i[j][1]-i[(j+k) % i.length][1]] // This abomination calculates the vector of 2 antennas
                let antinodeCoords = [Number(i[j][0]) + result[0], Number(i[j][1]) + result[1]];
                if (antinodeCoords[0] >= 0 && antinodeCoords[0] < height && antinodeCoords[1] >= 0 && antinodeCoords[1] < width) {
                    antinodeSet.add(JSON.stringify(antinodeCoords));
                }
            }
        }
    }
    return `Number of antinodes found: ${antinodeSet.size}`;
}

console.log(findAntinodes(input));