class ForestRoots
{
    constructor(weight, root)
    {
        this.weight = weight;
        this.root = root;
    }
}

function getForestRoots(weight, root)
{
    return new ForestRoots(weight, root);
}

module.exports = { getForestRoots };