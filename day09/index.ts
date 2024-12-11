const input = await Bun.file("input.txt").text();

function fragment (inputFile: string): string {
    const splitInput = inputFile.split("");
    const diskImage = [];
    let checksum = 0;

    // Create disk map
    let fileid = 0;
    for (let i = 0; i < splitInput.length; i++) {
        if (i % 2 == 0) {
            for (let j = 0; j < Number(splitInput[i]); j++) {
                diskImage.push(fileid);
            }
            fileid++;
        }
        else {
            for (let j = 0; j < Number(splitInput[i]); j++) {
                diskImage.push(null);
            }
        }
    }

    let lastData;

    // 'Fragment' the disk image
    while (true) {
        lastData = diskImage.findLastIndex(x => x != null);
        let fragmentedData = diskImage.slice(0, lastData);
        if (fragmentedData.indexOf(null) >= 0) { // Still empty space
            // Move last digit to first available slot
            let tmp = diskImage[lastData];
            diskImage.splice(lastData, 1, null);
            diskImage.splice(diskImage.indexOf(null), 1, tmp);
        }
        else break;
    }

    // Calculate the checksum
    for (let i = 0; i <= lastData; i++) {
        const value = diskImage[i];
        if (value !== null) {
            checksum += value * i;
        }
    }

    return `${checksum}`;
}

console.log(fragment(input));