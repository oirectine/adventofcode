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
                coordMap.get(chars[j]).push([+i, +j]);
            }
        }
    }
    
    // Create set for the antinodes
    let antinodeSet = new Set<string>();
    for (let i of coordMap.values()) {
        for (let j = 0; j < i.length; j++) {
            // Funky cyclical loop to calculate vectors of [a,b],[a,c],[b,a] etc.
            for (let k = 1; k < i.length; k++) {
                let result = [i[j][0]-i[(j+k) % i.length][0], i[j][1]-i[(j+k) % i.length][1]] // This abomination calculates the vector of 2 antennas
                let antennaCoords = [i[j][0], i[j][1]]
                let antinodeCoords = [];

                // Add antinodes until out of bounds.
                while (antennaCoords[0] >= 0 && antennaCoords[0] < height && antennaCoords[1] >= 0 && antennaCoords[1] < width) {
                    antinodeCoords.push([...antennaCoords]);
                    antennaCoords.splice(0, 1, antennaCoords[0] += result[0]);
                    antennaCoords.splice(1, 1, antennaCoords[1] += result[1]);
                }
                antinodeCoords.forEach(x => antinodeSet.add(JSON.stringify(x)));
            }
        }
    }
    return `Number of antinodes found: ${antinodeSet.size}`;
}

console.log(findAntinodes(input));