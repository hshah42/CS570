const forestRoot = require("./ForestRoots");

class MinHeap
{
    constructor()
    {
        this.arr = [];
    }

    insert(weight, root)
    {
        this.arr[this.arr.length] = forestRoot.getForestRoots(weight, root);
        this.repairFromLast();
    }

    remove()
    {
        let root;

        if(this.arr.length > 1)
        {
            root = this.arr[0];
            this.arr[0] = this.arr.pop();
            this.repairFromTop();
        }
        else if(this.arr.length == 0)
        {
            throw "There is nothing in heap"
        }
        else
        {
            root = this.arr.pop();
        }

        return root;
    }

    repairFromTop()
    {
        while(!this.isPartiallyOrderedCompleteTree())
        {
            for(let i = 0; i < this.arr.length ; i++)
            {
                if(this.arr[(i * 2) + 1] !== undefined && this.arr[i].weight > this.arr[(i * 2) + 1].weight)
                {
                    this.swap(i, (i * 2) + 1);
                }
                else if(this.arr[(i * 2) + 2] !== undefined && this.arr[i].weight > this.arr[(i * 2) + 2].weight)
                {
                    this.swap(i, (i * 2) + 2);
                }
            }
        }
    }

    repairFromLast()
    {
        while(!this.isPartiallyOrderedCompleteTree())
        {
            for(let i = this.arr.length - 1 ; i >= 0 ; i--)
            {
                if(i % 2 == 0)
                {
                    if(this.arr[(i/2) - 1] !== undefined && this.arr[i].weight < this.arr[(i/2) - 1].weight)
                    {
                        this.swap(i, (i/2) - 1);
                    }
                }
                else
                {
                    if(this.arr[(i - 1)/2] !== undefined && this.arr[i].weight < this.arr[(i - 1)/2].weight)
                    {
                        this.swap(i, (i-1)/2);
                    }
                }
            }
        }
    }

    swap(index1, index2)
    {
        let temp = this.arr[index1];
        this.arr[index1] =  this.arr[index2];
        this.arr[index2] = temp;
    }

    isPartiallyOrderedCompleteTree()
    {
        for(let i = 0; i < this.arr.length ; i++)
        {
            if(this.arr[(i * 2) + 1] != undefined && this.arr[i].weight > this.arr[(i * 2) + 1].weight)
            {
                return false;
            } 
            else if (this.arr[(i * 2) + 2] != undefined && this.arr[i].weight > this.arr[(i * 2) + 2].weight)
            {
                return false;
            }
        }

        return true;
    }

    display()
    {
        for(let i = 0 ; i < this.arr.length ; i++)
        {
            console.log(this.arr[i].weight);
        }
    }

    size()
    {
        return this.arr.length;
    }
}

function getMinHeap()
{
    return new MinHeap();
}

module.exports = { getMinHeap };