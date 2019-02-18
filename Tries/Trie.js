class Node
{
    constructor(value, name)
    {
        this.value = value;
        this.nodes = new Array();
        this.companyName = name;
    }
}

class Tries
{
    constructor()
    {
        this.tries = new Node();
    }

    insert(value, name)
    {
        this.tries.nodes = this.insertValue(value, name); 
    }

    insertValue(value, name, nodes)
    {
        if(nodes === undefined)
        {
            nodes = this.tries.nodes;
        }

        if(value.length === 0)
        {
            nodes.push(new Node("*", name));
            return nodes;
        }

        if(nodes.length === 0)
        {
            nodes.push(this.createCompleteNode(value, name)[0]);
        }
        else
        {
            let valueToBePushed = value[0];
            let newValue = value.substring(1, value.length);
            let inserted = false;

            for(let i in nodes)
            {
                let nodeValue = nodes[i].value.toString();
                
                if(nodeValue === valueToBePushed)
                {
                    nodes[i].nodes = this.insertValue(newValue, name, nodes[i].nodes);
                    inserted = true;
                }
            }

            if(!inserted)
            {
                nodes.push(this.createCompleteNode(value, name)[0]);
            }
        }

        return nodes;
    }

    createCompleteNode(value, name, count)
    {
        if(count === undefined)
        {
            count = 1;
        }
        else if(count > value.length)
        {
            let nodes = new Array();
            nodes.push(new Node("*", name));

            return nodes;
        }

        let node = new Node(value[count - 1]);
        node.nodes = this.createCompleteNode(value, name, ++count);

        let nodes = new Array();
        nodes.push(node);

        return nodes;
    }

    getName(value, nodes)
    {
        if(nodes === undefined)
        {
            nodes = this.tries.nodes;
        }

        let node;

        for(let i in value)
        {
            let isPresent = false;

            for(let j in nodes)
            {
                if(nodes[j].value === value[i])
                {
                    node = nodes[j];
                    nodes = nodes[j].nodes;
                    isPresent = true;

                    break;
                }
            }

            if(!isPresent)
            {
                return;
            }
        }

        if(node !== undefined)
        {
            for(let i in node.nodes)
            {
                if(node.nodes[i].value === "*")
                {
                    return node.nodes[i].companyName;
                }
            }
        }
    }

    isPresent(value)
    {
        let nodes = this.tries.nodes;
        let lastNode;

        for(let i in value)
        {
            let isPresent = false;

            for(let j in nodes)
            {
                if(value[i] === nodes[j].value)
                {
                    lastNode = nodes[j];
                    nodes = nodes[j].nodes;
                    isPresent = true;

                    break;
                }
            }

            if(!isPresent)
            {
                return "false";
            }
        }

        if(lastNode !== undefined)
        {
            let isItComplete = false;

            for(let i in lastNode.nodes)
            {
                if(lastNode.nodes[i].value === "*")
                {
                    return "true";
                }
            }

            return "incomplete";
        }
    }
}

function getTrie()
{
    return new Tries();
}

module.exports = { getTrie };

//  let a ="bear beary bell bid bull buy sell stock stop";

// let array = a.split(" ");

// let tries = new Tries();

// for(let i in array)
// {
//     tries.insert(array[i], "microsoft");
// }

// console.log(tries.isPresent("beat"))