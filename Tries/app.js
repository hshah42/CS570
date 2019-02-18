const trie = require("./Trie");
const fs = require('fs');
const table = require('table');
const readline = require("readline-sync");

let wordCount = 0;
let companyMap = new Map();
let companyTrie = trie.getTrie();

function readFromFile()
{
    let data;

    try
    {
        data = fs.readFileSync("companies.dat" ,{encoding:'utf8'});
    }
    catch(e)
    {
        console.error("Something went wrong in reading from file." + e)
    }

    return data;
}

function createTries(data)
{
    let companies = data.split("\n");

    for(let i in companies)
    {
        let companyNames = companies[i].split("\t");
        let parentCompany = normaliseNames(companyNames[0]);

        for(let j in companyNames)
        {
            let companyName = normaliseNames(companyNames[j]);
            companyTrie.insert(companyName, parentCompany);
        }
    }
}

function normaliseNames(name)
{
    let finalString = "";

    for(let i = 0; i < name.length ; i++)
    {
        if(name.charAt(i) === " " || !(/[^a-zA-Z]/.test(name.charAt(i))))
        {
            finalString = finalString.concat(name.charAt(i));
        }
    }

    return finalString;
}

function getNewsArticles()
{
    let articleName = readline.question("Enter filen to read news article:");
    //let articleName = "article";
    let article;

    try
    {
        article = fs.readFileSync(articleName ,{encoding:'utf8'});
    }
    catch(e)
    {
        console.error("Something went wrong in reading from file." + e)
        return;
    }

    let lines = article.split("\n");

    for(let i in lines)
    {
        if(lines[i] === "")
        {
            continue;
        }

        let toContinue = computeNewsArticleData(lines[i]);

        if(!toContinue)
        {
            break;
        }
    }

    print();
}

function computeNewsArticleData(article)
{
    //https://stackoverflow.com/questions/41192854/function-that-checks-whether-all-characters-in-a-string-are-equal-javascript-h?rq=1
    if(article.split('').every(char => char === "."))
    {
       return false;
    }

    let words = article.split(" ");
    let isIncomplete = false;
    let incompletePreviousIndex = -1;

    for(let i = 0; i < words.length; i++)
    {
        if(isIncomplete)
        {
            word = word.concat(" ").concat(normaliseNames(words[i]));
        }
        else
        {
            word = normaliseNames(words[i]);
        }

        let isPresent = companyTrie.isPresent(word);

        if(isPresent === "true")
        {
            let companyName = companyTrie.getName(word);

            if(companyMap.get(companyName) === undefined)
            {
                companyMap.set(companyName, 1);
            }
            else
            {
                let count = companyMap.get(companyName);
                companyMap.set(companyName, ++count);
            }

            wordCount++;
            isIncomplete = false;
            incompletePreviousIndex = -1
        }
        else if(isPresent === "incomplete")
        { 
            if(incompletePreviousIndex === -1)
            {
                incompletePreviousIndex = i;
            }
            
            isIncomplete = true;
           // wordCount++;
        }
        else
        {
            if(isIncomplete)
            {
                i = incompletePreviousIndex;
                incompletePreviousIndex = -1;

                if(words[i].toLowerCase() !== "a" && words[i].toLowerCase() !== "an" && words[i].toLowerCase() !== "the" && words[i].toLowerCase() !== "and" && words[i].toLowerCase() !== "or" && words[i].toLowerCase() !== "but")
                {
                    wordCount++;
                }

                isIncomplete = false;
                continue;
            }

            if(word.toLowerCase() !== "a" && word.toLowerCase() !== "an" && word.toLowerCase() !== "the" && word.toLowerCase() !== "and" && word.toLowerCase() !== "or" && word.toLowerCase() !== "but")
            {
                wordCount++;
            }

            isIncomplete = false;
        }
    }

   return true;

}

//https://www.npmjs.com/package/table#table-features
function print()
{
    let config, data, output;

    data = [["Company", "Hit Count", "Relevance"]];
    let totalCompanyCount = 0;

    //https://stackoverflow.com/questions/37982476/how-to-sort-a-map-by-value-in-javascript
    companyMap = new Map([...companyMap.entries()].sort((a, b) => b[1] - a[1]));
    
    for(let entries of companyMap.entries())
    {
        let key = entries[0];
        let value = companyMap.get(key);

        totalCompanyCount += value;

        let hitCount = value;
        let relevance = Math.round(((value / wordCount) * 100) * 10000) / 10000;

        let companyData = [key, hitCount, relevance.toString().concat("%")];

        data.push(companyData);
    }

    let totalRelevance = Math.round(((totalCompanyCount / wordCount) * 100) * 10000) / 10000;
    let totalData = ["Total", totalCompanyCount, totalRelevance.toString().concat("%")];

    data.push(totalData);

    config = {
        border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,
     
            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,
     
            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,
     
            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
        }
    };

    let totalDisplay = ["Total Words", wordCount, ""];
    data.push(totalDisplay);

    output = table.table(data, config);

    console.log(output);
}

function main()
{
    let data = readFromFile();
    createTries(data);
    getNewsArticles();
}

main();