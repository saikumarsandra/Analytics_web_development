function generateBingoCard() {
    const card = document.getElementById("bingoCard");
    card.innerHTML = ""; // Clear any existing card

    const numbers = [];
    while (numbers.length < 25) {
        const num = Math.floor(Math.random() * 75) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    let index = 0;
    for (let i = 0; i < 5; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("td");
            cell.textContent = numbers[index];
            cell.style.border = "1px solid black";
            cell.style.padding = "10px";
            cell.style.textAlign = "center";
            cell.style.cursor = "pointer";
            cell.onclick = function() {
                this.style.backgroundColor = "lightgreen";
                checkWinningPattern();
            };
            row.appendChild(cell);
            index++;
        }
        table.appendChild(row);
    }

    card.appendChild(table);
}

function checkWinningPattern() {
    const cardElement = document.getElementById("bingoCard");
    const cells = cardElement.querySelectorAll("td");

    // Check rows
    for (let i = 0; i < 5; i++) {
        let rowComplete = true;
        for (let j = 0; j < 5; j++) {
            if (cells[i * 5 + j].style.backgroundColor !== "lightgreen") {
                rowComplete = false;
                break;
            }
        }
        if (rowComplete) {
            showMessage("You won horizontally!");
            return;
        }
    }

    // Check columns
    for (let j = 0; j < 5; j++) {
        let colComplete = true;
        for (let i = 0; i < 5; i++) {
            if (cells[i * 5 + j].style.backgroundColor !== "lightgreen") {
                colComplete = false;
                break;
            }
        }
        if (colComplete) {
            showMessage("You won vertically!");
            return;
        }
    }

    // Check diagonals
    let diag1Complete = true;
    let diag2Complete = true;

    for (let i = 0; i < 5; i++) {
        if (cells[i * 5 + i].style.backgroundColor !== "lightgreen") {
            diag1Complete = false;
        }
        if (cells[i * 5 + (4 - i)].style.backgroundColor !== "lightgreen") {
            diag2Complete = false;
        }
    }

    if (diag1Complete || diag2Complete) {
        showMessage("You won diagonally!");
        return;
    }
}

function showMessage(message) {
   const messageElement=document.getElementById("message");
   messageElement.textContent=message;
}