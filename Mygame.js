var num = localStorage.getItem("playersCount");

if (num == null) {
    window.location.href = "index.html";
}

var totalPlayers = parseInt(num);
var currentPlayer = 1;

var scores = [];
var turns = [];

for (var i = 1; i <= totalPlayers; i++) {
    scores[i] = 0;
    turns[i] = 0;
}

var timeLeft = 10
var timerId;

var container = document.getElementById("playersContainer");

function createPlayers() {
    container.innerHTML = "";

    for (var i = 1; i <= totalPlayers; i++) {

        var box = document.createElement("div");
        box.className = "player-box";
        box.id = "player" + i;

        var title = document.createElement("h3");
        title.innerText = "Player " + i;

        var img = document.createElement("img");
        img.src = "images/dice1.jpeg";
        img.id = "dice" + i;

        var scoreText = document.createElement("p");
        scoreText.innerHTML = "Total Score: <span id='score" + i + "'>0</span>";

        var btn = document.createElement("button");
        btn.innerText = "Roll Dice";
        btn.disabled = true;
        btn.onclick = function () {
            var id = this.parentNode.id;
            var playerNo = id.replace("player", "");
            rollDice(parseInt(playerNo));
        };

        var table = document.createElement("table");
        table.innerHTML =
            "<tr>" +
            "<th>S.No</th>" +
            "<th>Dice Value</th>" +
            "<th>Cumulative Sum</th>" +
            "</tr>" +
            "<tbody id='table" + i + "'></tbody>";

        box.appendChild(title);
        box.appendChild(img);
        box.appendChild(scoreText);
        box.appendChild(btn);
        box.appendChild(table);

        container.appendChild(box);
    }
}

function rollDice(player) {

    if (player != currentPlayer) {
        return;
    }

    clearInterval(timerId);

    var diceValue = Math.floor(Math.random() * 6) + 1;

    document.getElementById("dice" + player).src =
        "images/dice" + diceValue + ".jpeg";

    var newScore = scores[player] + diceValue;

    if (newScore > 100) {
        nextTurn();
        return;
    }

    scores[player] = newScore;
    document.getElementById("score" + player).innerText = newScore;

    turns[player] = turns[player] + 1;

    var row = document.createElement("tr");
    row.innerHTML =
        "<td>" + turns[player] + "</td>" +
        "<td>" + diceValue + "</td>" +
        "<td>" + newScore + "</td>";

    document.getElementById("table" + player).appendChild(row);

    if (newScore == 100) {
        alert("Player " + player + " wins!");
        localStorage.clear();
        window.location.href = "index.html";
        return;
    }

    nextTurn();
}

function nextTurn() {
    currentPlayer = currentPlayer + 1;

    if (currentPlayer > totalPlayers) {
        currentPlayer = 1;
    }

    enableButtons();
    startTimer();
}

function enableButtons() {
    var buttons = document.querySelectorAll(".player-box button");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    document.querySelector("#player" + currentPlayer + " button").disabled = false;
}

function startTimer() {
    timeLeft = 10;
    document.getElementById("timer").innerText =
        "Time Left: " + timeLeft + "s";

    timerId = setInterval(function () {
        timeLeft = timeLeft - 1;

        document.getElementById("timer").innerText =
            "Time Left: " + timeLeft + "s";

        if (timeLeft == 0) {
            skipTurn();
        }
    }, 1000);
}

function skipTurn() {
    clearInterval(timerId);

    turns[currentPlayer] = turns[currentPlayer] + 1;

    var row = document.createElement("tr");
    row.innerHTML =
        "<td>" + turns[currentPlayer] + "</td>" +
        "<td>-</td>" +
        "<td>" + scores[currentPlayer] + "</td>";

    document.getElementById("table" + currentPlayer).appendChild(row);

    nextTurn();
}

createPlayers();
enableButtons();
startTimer();
