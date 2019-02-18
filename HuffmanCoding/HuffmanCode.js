const forestRoots = require("./ForestRoots");
const treeNode = require("./TreeNode");
const minHeap = require("./MinHeap");
const symbolInfo = require("./SymbolInfo");
const fs = require('fs');

let alphabetMap = new Map();
let huffmanMap = new Map();
let percentageMap = new Map();
let indexMap = new Map();

//let alphabets = "abcdefghijklmnopqrstuvwxyz123456789";
let treeArray;
let totalCount = 0;
let index = 1;
let totalBits = 0;

function readFromFile(filePath)
{
    let data;

    try
    {
        data = fs.readFileSync("infile.dat" ,{encoding:'utf8'});
    }
    catch(e)
    {
        console.error("Something went wrong in reading from file." + e)
    }

    return data;
}

function createFrequency(string)
{    
    //https://stackoverflow.com/questions/6507056/replace-all-whitespace-characters

    string = string.replace(/\s/g, "");

    for(let char in string)
    {
        if(string[char] === " ")
        {
            continue;
        }

        if(!(/[^a-zA-Z]/.test(string[char])) || !isNaN(string[char]) )
        {
            totalCount++;

            if(alphabetMap.get(string[char]) === undefined)
            {
                let alphabet = symbolInfo.getSymbolInfo(string[char], 1, index);
                alphabetMap.set(string[char], alphabet);
                indexMap.set(index, string[char]);
                index++;
            }
            else
            {
                let alphabet = alphabetMap.get(string[char]);
                alphabet.frequency = alphabet.frequency + 1;
                alphabetMap.set(string[char], alphabet);
            }
        }
    }
}

function createForestNodes()
{
    let heap = minHeap.getMinHeap();

    for(let entries of alphabetMap.entries())
    {
        let key = entries[0];
        let alphabet = entries[1];

        heap.insert(alphabet.frequency, alphabet.leaf);
    }

    return heap;
}

function createHuffmanTree(forestRootMinHeap)
{
    treeArray = new Array(index);

    while(forestRootMinHeap.size() > 1)
    {
        let least = forestRootMinHeap.remove();
        let secondLeast = forestRootMinHeap.remove();

        let newNodeWeight = least.weight + secondLeast.weight;
        let newNodeRoot =  treeArray.length;

        let leastTreeNode;
        let secondLeastTreeNode;
        
        if(treeArray[least.root] === undefined)
        {
            leastTreeNode = treeNode.getTreeNode(least.root);
        }
        else
        {
            leastTreeNode = treeArray[least.root];
        }
        
        leastTreeNode.setParent(newNodeRoot);

        if(treeArray[secondLeast.root] === undefined)
        {
            secondLeastTreeNode = treeNode.getTreeNode(secondLeast.root);
        }
        else
        {
            secondLeastTreeNode = treeArray[secondLeast.root];
        }
        
        secondLeastTreeNode.setParent(newNodeRoot);

        let newTreeNode = treeNode.getTreeNode(newNodeRoot);
        newTreeNode.setLeftChild(least.root);
        newTreeNode.setRightChild(secondLeast.root);

        forestRootMinHeap.insert(newNodeWeight, newNodeRoot);

        treeArray[least.root] = leastTreeNode;
        treeArray[secondLeast.root] = secondLeastTreeNode;
        treeArray[newNodeRoot] = newTreeNode;
    }
}

function getHuffmanCode()
{
    createHuffmanCode(treeArray[treeArray.length - 1], "");
}

function createHuffmanCode(node, code)
{
    let leftChild = code;
    let rightChild = code;

    if(node.leftChild !== 0)
    {
        leftChild = leftChild.concat("0");
        createHuffmanCode(treeArray[node.leftChild], leftChild);
    }
    else
    {
        huffmanMap.set(indexMap.get(node.currentIndex), code);
    }
    
    if(node.rightChild !== 0)
    {
        rightChild = rightChild.concat("1");
        createHuffmanCode(treeArray[node.rightChild], rightChild);
    }
    else
    {
        huffmanMap.set(indexMap.get(node.currentIndex), code);
    }
}

function createFrequencyPercentage()
{
    for(let entries of alphabetMap.entries())
    {
        let key = entries[0];
        let alphabet = entries[1];

        //https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
        let percentage = Math.round(((alphabet.frequency / totalCount) * 100) * 100) / 100;

        totalBits = totalBits + (alphabet.frequency * huffmanMap.get(alphabet.symbol).length);

        percentageMap.set(key, percentage);
    }

    //https://stackoverflow.com/questions/37982476/how-to-sort-a-map-by-value-in-javascript
    percentageMap = new Map([...percentageMap.entries()].sort((a, b) => b[1] - a[1]));
}

function writeStatisticsToFile()
{
    let data = `Symbol Frequency`

    for(let entries of percentageMap.entries())
    {
        let key = entries[0];
        let value = entries[1];

        data = data.concat("\n");
        data = data.concat(`   ${key}     ${value}%`);
    }

    data = data.concat("\n\n");
    data = data.concat(`Symbol Frequency`);

    for(let entries of percentageMap.entries())
    {
        let key = entries[0];
        let huffmanValue = huffmanMap.get(key);

        data = data.concat("\n");
        data = data.concat(`   ${key}     ${huffmanValue}`);
    }

    data = data.concat("\n\n");
    data = data.concat("Total Bits:" + totalBits);
    data = data.concat("\n");

    fs.writeFile("output.dat", data);
}

function main()
{
    let data = readFromFile("input.dat");
    createFrequency(data);
    createHuffmanTree(createForestNodes());
    getHuffmanCode();
    createFrequencyPercentage();
    writeStatisticsToFile();
}

main();