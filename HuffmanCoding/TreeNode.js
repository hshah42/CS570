class TreeNode
{
    constructor(index)
    {
        this.leftChild = 0;
        this.rightChild = 0;
        this.parent = 0;
        this.currentIndex = index;
    }

    setLeftChild(node)
    {
        this.leftChild = node;
    }

    setRightChild(node)
    {
        this.rightChild = node;
    }

    setParent(node)
    {
        this.parent = node;
    }
}

function getTreeNode(index)
{
    return new TreeNode(index);
}

module.exports = { getTreeNode };