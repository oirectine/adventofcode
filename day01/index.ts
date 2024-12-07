const inputFile =  Bun.file("input.txt");

let listString: string = await inputFile.text();
let listPair: string[] = listString.split("\n");

let list1: number[] = [];
let list2: number[] = [];

for (let i in listPair) {
    list1.push(Number(listPair[i].split("   ")[0]));
    list2.push(Number(listPair[i].split("   ")[1]));
}

function aoc_1(lista:number[], listb:number[]): string {
    //sort lists
    let sort_a: number[] = lista.sort();
    let sort_b: number[] = listb.sort();

    let totalDiff: number = 0;
    let simScore: number = 0;
    
    //iterate over sorted arrays, then add diff to total, and calculate a 'similarity score'
    for (let i in sort_a) {
        totalDiff += Math.abs(sort_a[i]-sort_b[i]);
        simScore += sort_b.filter(x => x===sort_a[i]).length*sort_a[i];
    }

    return `Total difference: ${totalDiff}\nSimilarity score: ${simScore}`;
};

console.log(aoc_1(list1, list2));