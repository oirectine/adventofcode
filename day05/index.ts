const input: string = await Bun.file("input.txt").text();

let fullString: string[] = input.split("\n");
let rulesString: string[] = fullString.slice(0,fullString.indexOf(""));
let pagesString: string[] = fullString.slice(fullString.indexOf("")).filter(a => a != "");

// Check each page string
function countPages(rules: string[], pages: string[]): string {
    let total = 0;
    let incorrect = 0;
    for (let i of pages) {
        let checkPage = (i.match(/\d+/g) || []).map(x => Number(x));
        if (JSON.stringify(checkPage) === JSON.stringify(checkPage.sort(sortFunc))) {
            total += checkPage[(checkPage.length-1)/2]
        }
        else incorrect += checkPage[(checkPage.length-1)/2]; 
    }
    return `Correct total: ${total}\nIncorrect total: ${incorrect}`;
}

function sortFunc(a:number, b:number): number {
    // Look at rules table, and compare
    let comparisonRule : number[] = [];
    for (let i of rulesString) {
        let checkRule = (i.match(/\d+/g) || []).map(x => Number(x));
        if (JSON.stringify(checkRule) === (JSON.stringify([a,b]) || JSON.stringify([b,a]))) {
            comparisonRule = checkRule;
            break;
        }
    }
    if (comparisonRule.indexOf(a) < comparisonRule.indexOf(b)) return -1;
    else return 1
}

console.log(countPages(rulesString, pagesString));