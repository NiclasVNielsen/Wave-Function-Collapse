const gridDim = 16; // Ratio = 1

const tiles = [
    {name: "0000",top: "0",right: "0",bottom: "0",left: "0"},
    {name: "0011",top: "0",right: "0",bottom: "1",left: "1"},
    {name: "0110",top: "0",right: "1",bottom: "1",left: "0"},
    {name: "0111",top: "0",right: "1",bottom: "1",left: "1"},
    {name: "1001",top: "1",right: "0",bottom: "0",left: "1"},
    {name: "1011",top: "1",right: "0",bottom: "1",left: "1"},
    {name: "1100",top: "1",right: "1",bottom: "0",left: "0"},
    {name: "1101",top: "1",right: "1",bottom: "0",left: "1"},
    {name: "1110",top: "1",right: "1",bottom: "1",left: "0"}
]


let grid = []
const createGrid = () => {
    grid = []
    for(let x = 0; x < gridDim; x++){
        for(let y = 0; y < gridDim; y++){
            grid.push({
                tiles: tiles
            })
        }
    }
}

const XYtoGridPos = (x, y) => {
    return x + (y * gridDim)
}

const GridPosToXY = (gridPos) => {
    const x = gridPos % gridDim
    const y = (gridPos - x) / gridDim
    return { x: x, y: y }
}


function orderArray(a, b){
    return a.order - b.order    
}

let order = []
const calcOrder = () => {
    order = []
    grid.forEach((tile, index) => {
        if(tile.tiles.length > 1)
            order.push({index: index, order: tile.tiles.length})
    })
    order.sort(orderArray)

    if(order.length > 0){
        const pos = GridPosToXY(order[0].index)
        setTimeout(() => {
            collapse(pos.x, pos.y)
        }, 100);
    }else{
        // printGrid() renders as a chunk
    }
}


const main = document.querySelector("main")
const createTile = (tile, x, y) => {
    const div = document.createElement("div")
    div.classList.add(`x${x}`)
    div.classList.add(`y${y}`)
    const img = document.createElement("img")
    img.src = `Images/${tile}.png`
    div.appendChild(img)
    main.appendChild(div)
}

/* const printGrid = () => { Renders as a chunk
    let pos
    grid.forEach((tile, index) => {
        pos = GridPosToXY(index)
        if(tile.tiles.length == 1){
            createTile(tile.tiles[0].name, pos.x, pos.y)
        }
    })
} */


const randomNumber = (max, min = 0) => {
    let random = Math.random()
    if(random == 1){
        random = 0;
    }
    random = Math.floor(random * (max + 1))
    return random + min
}

const collapse = (x, y) => {
    const gridPos = XYtoGridPos(x, y)
    const availableTiles = grid[gridPos].tiles.length

    if(availableTiles > 1){
        //Pick a random tile of the remaining
        grid[gridPos].tiles = [grid[gridPos].tiles[randomNumber(availableTiles - 1)]]

        createTile(grid[gridPos].tiles[0].name, x, y) /* Remove me if you don't want the animation */

        updateNeighbours(x, y, grid[gridPos].tiles)
    }else if(availableTiles == 1){
        console.error("Already Collapsed")
    }else if(availableTiles == 0){
        console.error("Wave Function Collapse Failed!")
    }

}

const updateNeighbours = (x, y, polarities) => {
    const neighbours = [{x: x, y: y + 1, pos: "yP"}, {x: x + 1, y: y, pos: "xP"}, {x: x, y: y - 1, pos: "yM"}, {x: x - 1, y: y, pos: "xM"}]
    neighbours.forEach(neighbour => {
        if(neighbour.x >= 0 && neighbour.x < gridDim && neighbour.y >= 0 && neighbour.y < gridDim){
            const neighbourTiles = grid[XYtoGridPos(neighbour.x, neighbour.y)].tiles

            if(neighbourTiles.length > 1){
                const newTiles = []
                switch(neighbour.pos){
                    case 'yP':
                        neighbourTiles.forEach(tile => {
                            if(tile.top == polarities[0].bottom)
                                newTiles.push(tile)
                        })
                        break;
                    case 'xP':
                        neighbourTiles.forEach(tile => {
                            if(tile.left == polarities[0].right)
                                newTiles.push(tile)
                        })
                        break;
                    case 'yM':
                        neighbourTiles.forEach(tile => {
                            if(tile.bottom == polarities[0].top)
                                newTiles.push(tile)
                        })
                        break;
                    case 'xM':
                        neighbourTiles.forEach(tile => {
                            if(tile.right == polarities[0].left)
                                newTiles.push(tile)
                        })
                        break;
                }

                grid[XYtoGridPos(neighbour.x, neighbour.y)].tiles = newTiles
            }
        }
    })
    calcOrder()
}


const waveFunctionCollapse = () => {
    createGrid()
    collapse(randomNumber(3), randomNumber(3))
    /* printGrid() */
}
waveFunctionCollapse()