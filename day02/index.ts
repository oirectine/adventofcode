let input: string = await Bun.file("input.txt").text();

let reports: string[] = input.split("\n");

const enum dir {
    none,
    ascending,
    descending,
}

function countSafe(list: string[]): string {
    let safeCount: number = 0;
    let dampenedSafeCount: number = 0;

    //Take a string, then check if it is safe (asc/desc by >=1 and <=3) AND all ascending / descending
    for (let i = 0; i<list.length; i++) {
        let test: number[] = list[i].split(" ").map(Number);
        if (testArray(test)) safeCount++;
        else {
            //Try again, but with dampened arrays
            for (let j = 0; j<test.length; j++) {
                let splicedArray: number[] = test.slice(0)
                splicedArray.splice(j,1);
                if (testArray(splicedArray)) {
                    dampenedSafeCount++;
                    break;
                }
            }
        }
    }
    return `Safe reports: ${safeCount}\nDampened safe reports: ${dampenedSafeCount}\nTotal: ${safeCount+dampenedSafeCount}`;
}

//Test if an array is 'safe'
function testArray(t: number[]): boolean {
    let direction: dir = dir.none;
    for (let j = 0; j < t.length-1; j++) {
        let diff: number = Math.abs(t[j]-t[j+1])
        if (diff >=1 && diff<=3) { //Test the difference, reject if 0 or >3
            if (t[j]>t[j+1] && (direction == dir.none || direction == dir.descending)) {
                direction = dir.descending;
                continue;
            }
            else if (t[j]<t[j+1] && (direction == dir.none || direction == dir.ascending)) {
                direction = dir.ascending;
                continue;
            }
            else return false;
        }
        else return false;
    }
    return true;
}

console.log(countSafe(reports));