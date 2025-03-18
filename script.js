let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = 'circle';

function render() {
    let contentDiv = document.getElementById('content');
    let tableHTML = '<table>';
    
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';
            let onClickAttribute = fields[index] ? '' : `onclick="handleCellClick(${index}, this)"`;
            
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            
            tableHTML += `<td ${onClickAttribute}>${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    contentDiv.innerHTML = tableHTML;
}

document.addEventListener('DOMContentLoaded', render);

function handleCellClick(index, cell) {
    if (!fields[index]) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.removeAttribute('onclick');
        
        if (checkWinner()) {
            drawWinningLine();
            return;
        }

        if (isGameFinished()) {
            console.log('Game Over!');
            return;
        }
        
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function resetGame(){
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];
    let container = document.getElementById("container");
    if (container) {
        container.remove();
    }
    render();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination;
        }
    }
    return null;
}

function isGameFinished() {
    return fields.every((field) => field !== null) || checkWinner() !== null;
}

function drawWinningLine() {
    let winningCells = checkWinner();
    if (!winningCells) return;

    let container = document.getElementById("container");
    if (!container) {
        container = document.createElement("div");
        container.id = "container";
        container.style.position = "absolute";
        container.style.width = "100%";
        container.style.height = "100vh";
        container.style.top = "0";
        container.style.left = "0";
        container.style.pointerEvents = "none";
        document.body.appendChild(container);
    }

    let cells = document.querySelectorAll('td');
    let firstCell = cells[winningCells[0]];
    let lastCell = cells[winningCells[2]];

    let firstRect = firstCell.getBoundingClientRect();
    let lastRect = lastCell.getBoundingClientRect();

    let centerX1 = firstRect.left + firstRect.width / 2;
    let centerY1 = firstRect.top + firstRect.height / 2;
    let centerX2 = lastRect.left + lastRect.width / 2;
    let centerY2 = lastRect.top + lastRect.height / 2;

    let line = document.createElement("div");
    line.style.position = "absolute";
    line.style.background = "white";
    line.style.height = "5px";
    line.style.transformOrigin = "left center";

    let distance = Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2));
    let angle = Math.atan2(centerY2 - centerY1, centerX2 - centerX1) * (180 / Math.PI);

    line.style.width = `${distance}px`;
    line.style.left = `${centerX1}px`;
    line.style.top = `${centerY1}px`;
    line.style.transform = `rotate(${angle}deg)`;

    container.appendChild(line);
}


function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none" stroke-dasharray="188" stroke-dashoffset="188">
                <animate attributeName="stroke-dashoffset" from="188" to="0" dur="250ms" fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="60" y2="60" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="70" stroke-dashoffset="70">
                <animate attributeName="stroke-dashoffset" from="70" to="0" dur="250ms" fill="freeze" />
            </line>
            <line x1="60" y1="10" x2="10" y2="60" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="70" stroke-dashoffset="70">
                <animate attributeName="stroke-dashoffset" from="70" to="0" dur="250ms" fill="freeze" />
            </line>
        </svg>
    `;
}