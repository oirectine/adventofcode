const input: string = await Bun.file("input_3.txt").text();


// Use regex to find valid muls
function findValid(inp: string) {
    const re = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;
    return inp.match(re) || [];
}

// Get array of muls, then multiply the numbers
function multiplyCorruptedInput(i: string): number {
    let canDo = true;
    let total = 0;
    let mulArray = findValid(i);
    for (let mul of mulArray) {
        if (mul === "do()") {
            canDo = true;
            continue;
        }
        else if (mul==="don't()") {
            canDo = false;
            continue;
        }
        else {
            if (!canDo) continue;
            let re = /\d{1,3}/g
            let match = mul.match(re);
            if (match) {
                let expr = [...match];
                if (expr[0] && expr[1] && canDo) {
                    total+=Number(expr[0])*Number(expr[1]);
                }
            }
        }

    }
    return total;
}

console.log(multiplyCorruptedInput(input));