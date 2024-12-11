const input = await Bun.file("input.txt").text();

function defragment (inputFile: string, defragFiles: boolean = false): string {
    const splitInput = inputFile.split("");
    const diskImage: (number | null)[] = [];
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

    // 'Fragment' the disk image (part 1)
    if (!defragFiles) {
        let lastData;
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
    }
    // Defragment files for part 2
    else {
        for (let i = fileid - 1; i>=0; i--) {
            let filePointer = diskImage.indexOf(i);
            let fileSize = diskImage.lastIndexOf(i) - filePointer + 1;

            //Find adequate space
            let desPointer = -1;
            let nullCount = 0;
            for (let i = 0; i < filePointer; i++) {
                if (diskImage[i] === null) nullCount++;
                if (i >= fileSize) {
                    if (diskImage[i - fileSize] === null) nullCount--;
                }
                if (nullCount === fileSize) {
                    desPointer = i - fileSize + 1;
                    break;
                }
            }

            // Replace file with nulls if the space exists
            if (desPointer >= 0) {
                for (let j = 0; j < fileSize; j++) {
                    diskImage.splice(filePointer + j, 1, null);
                    diskImage.splice(desPointer + j, 1, i);
                }
            }
        }
    }

    // Calculate the checksum
    for (let i = 0; i < diskImage.length; i++) {
        const value = diskImage[i];
        if (value !== null) {
            checksum += value * i;
        }
    }

    return `Checksum of disk image: ${checksum}`;
}

console.log(`Part 1 checksum: ${defragment(input)}\nPart 2 checksum: ${defragment(input, true)}`);