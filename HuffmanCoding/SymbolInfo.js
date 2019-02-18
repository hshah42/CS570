class SymbolInfo
{
    constructor(symbol, frequency, leaf)
    {
        this.symbol = symbol;
        this.frequency = frequency;
        this.leaf = leaf;
    }
}

function getSymbolInfo(symbol, frequency, leaf)
{
    return new SymbolInfo(symbol, frequency, leaf);
}

module.exports = { getSymbolInfo };