//sets the initial event handlers, when page is ready.
$(document).ready(function () {
    determineSnakeNodeSize();
    $(document).on("click", "#startBTN", initGame);
    $(".dropdown-menu *").on("click", function () {
        debugger;
        SnakeSpeedString = $(this)[0].textContent;
        changeSpeed();
    });
    $(document).on('show.bs.modal', '#modal-leaderboards', refreshLeaderboardTable);
});
function refreshLeaderboardTable() {
    $("#leaderboard-table").html('');
    leaderboards.forEach(function (item) {
        var retRow = "<tr><td>" + item.name + "</td><td>" + item.score + "</td><td>" + item.snakeLength + "</td><td>" + item.time + "</td><td>"+item.speed+"</tr>";
        debugger;
        $("#leaderboard-table").append(retRow);
    })
}

//begins a new game, every time the start button is clicked. Start button disappears after the click. Is only enabled after pressing reset.
//The function which changes the direction, IE listens to the key presses is inside this function.
function initGame() {
    $(document).on("click", "#stopBTN", resetGame);
    $("#startBTN").attr('disabled', 'disabled');
    $("#leaderboardsBTN").attr('disabled', 'disabled');
    resetBoard();
    $("#scoreBoard").removeClass("slideUp");
    $("#speedDropdownBtn").addClass("slideUp");
    Snake = new Snake_List();
    foodBuffer = new Array();
    combo = -1;
    SnakeEatFood();
    $(document).on("keydown", document, moveSnakeHead);
    timer = 0;
    score = 0;
    $("#score").html("0");
    timerInterval = setInterval(incTimer, 1000);
    spawnFood();
    gameInterval = setInterval(reDrawSnake, SnakeSpeed);

    //responds to arrow key presses
    function moveSnakeHead(event) {
        if (key == true) {
            var exception = 1; //the exception variable helps with checking whether the direction is the opposite of the current one, which is an illegal move in snake. you can't move backwards in one move, you need to move left/right and then back.
            for (var i = 0; i < SnakeDirectionsArray.EVENT_KEYNAMES.length; i++) {
                if (SnakeDirectionsArray.EVENT_KEYNAMES[i] == event.key) {
                    if ((i % 2) == 1)
                        exception = -1;
                    if ((SnakeDirectionsArray.LITERAL_DIRECTIONS[i] != currentDir) && (SnakeDirectionsArray.LITERAL_DIRECTIONS[i + exception] != currentDir)) {
                        key = false;
                        currentDir = SnakeDirectionsArray.LITERAL_DIRECTIONS[i];
                    }
                }
            }
        }
    }

    //Resets all variables, intervals and removes all div elements.
    function resetGame() {
        if (Snake != null) {
            clearInterval(gameInterval);
            clearInterval(foodSpawnInterval);
            clearInterval(comboInterval);
            clearInterval(timerInterval);

            for (var i = 0; i < Snake.length ; i++)
                $("#node" + i).remove();
            for (var i = 0; i < foodBuffer.length ; i++)
                $(foodBuffer[i]).remove();
            foodBuffer = null;
            $(document).off("keydown", document, moveSnakeHead);
            Snake = null;
            currentDir = "right";
           
            $("#startBTN").removeAttr("disabled");
            $("#leaderboardsBTN").removeAttr("disabled");
            $("#scoreBoard").addClass("slideUp");
            $("#speedDropdownBtn").removeClass("slideUp");
        }
    }
    function resetBoard() {
        $("#snakeLength").html("0");
        $("#score").html("0");
        $("#combo").html("0");
        $("#timer").html("0");
    }

    //the actual function which is repeated constantly in the interval.
    //calls on the calculation functions, and then redraws the divs based on the new calculations.
    function reDrawSnake() {
        var point = calcDirections();
        Snake.moveSnake(point);
        determineFoodCollision();
        determinePanelEdgeCollision();
        checkIsDead();
        refreshDivs();
        key = true;

        //Step 1: returns point object based on current direction
        function calcDirections() {
            var retPoint;
            debugger;
            var temp = SnakeNodeSize;
            if (currentDir == "right")
                retPoint = new Point(temp, 0);
            else if (currentDir == "left")
                retPoint = new Point((temp*-1), 0);
            else if (currentDir == "up")
                retPoint = new Point(0, (temp * -1));
            else if (currentDir == "down")
                retPoint = new Point(0, temp);
            return retPoint;
        }

        //Step 2: after moving the snake based on the direction calculation, determine if the snake ate a food nibble
        function determineFoodCollision() {
            for (var i = 0; i < foodBuffer.length; i++) {
                if (((Snake.head.top + "px") == $(foodBuffer[i]).css("top")) && (Snake.head.left + "px") == $(foodBuffer[i]).css("left")) {

                    SnakeEatFood();
                    $(foodBuffer[i]).remove();
                    foodBuffer.splice(i, 1);
                    break;
                }
            }
        }

        //Step 3: determine if the snake's position extends the panel's dimension, and adjust it's location accordingly
        function determinePanelEdgeCollision() {
            if (Snake.head.left < (0 - SnakeNodeSize)) //too much to the left
            {
                Snake.head.left = (parseInt($("#snakePanel").css("width"), 10));
                Snake.head.animateFlag = 0;
                debugger;
            }
            else if (Snake.head.left > parseInt($("#snakePanel").css("width"), 10)) //too much to the right
            {
                Snake.head.left = (0 - SnakeNodeSize);
                Snake.head.animateFlag = 0;
            }
            else if (Snake.head.top < (0 - SnakeNodeSize)) //too high
            {
                Snake.head.top = (parseInt($("#snakePanel").css("height"), 10));
                Snake.head.animateFlag = 0;
            }
            else if (Snake.head.top > parseInt($("#snakePanel").css("height"), 10)) //too low
            {
                Snake.head.top = (0 - SnakeNodeSize);
                Snake.head.animateFlag = 0;
            }
        }

        //Step 4: determine if the snake ate himself. End the game if yes.
        function checkIsDead() {
            if (Snake.length > 4) {
                var check = Snake.getKamikazi();
                if (check == true) {
                    var name = prompt("GAME OVER!\n\nEnter your name to be added to the leaderboards:","");
                    leaderboards.push(new Game_Score(name, score, Snake.length, timer, SnakeSpeedString));
                    resetGame();
                }
            }
        }

        //Step 5: redraw the divs after all calculations and adjustments are finished
        function refreshDivs() {
            for (var i = 0; i < Snake.length; i++) {
                //if (Snake.getNodeAt(i).animateFlag == false) {
                //    TweenMax.killChildTweensOf($('#node' + i), false);
                //    $('#node' + i).css({
                //        "top": Snake.getNodeAt(i).top + "px",
                //        "left": Snake.getNodeAt(i).left + "px"
                //    });
                //    debugger;
                //}
                //else {
                TweenLite.to($("#node" + i), ((SnakeSpeed * Snake.getNodeAt(i).animateFlag) / 1000), {
                    top: Snake.getNodeAt(i).top + "px",
                    left: Snake.getNodeAt(i).left + "px",
                    ease: Linear.easeNone
                });
            }

        }
    }
    function SnakeEatFood() {
        Snake.snakeIncrease();
        $("#snakePanel").append($("<div />", {
            id: "node" + (Snake.length - 1),
            class: "snake-node"
        }));
        if (combo == -1)
        {
            $("#node" + (Snake.length - 1)).append($("<div />", {
                class: "snake-cell snake-head"
            }));
        }
        else {
            $("#node" + (Snake.length - 1)).append($("<div />", {
                class: "snake-cell snake-tail"
            }));
        }
        
        debugger;
        var temp = Snake.getTail();
        $("#node" + (Snake.length - 1)).css({
            "left": temp.left + "px",
            "top": temp.top + "px",
        });

        if (combo < 8)
            combo++;
        score += 1*combo;
        clearInterval(comboInterval);
        var tempComboInterval = ((5 - (combo / 2)) * 1000);
        comboInterval = setInterval(decreaseCombo, tempComboInterval);
        updateComboScreen();
        $("#score").html(score);
        $("#snakeLength").html(Snake.length);

    }

    function spawnFood() {
        if (foodBuffer.length != 5) {
            var panelWidth = (parseInt( $(".wrapper").css("width"))/SnakeNodeSize) -1;
            var panelHeight = (parseInt($(".wrapper").css("height")) / SnakeNodeSize) -1;

            var randX = Math.floor(Math.random() * panelWidth + 1) * SnakeNodeSize;
            var randY = Math.floor(Math.random() * panelHeight+ 1) * SnakeNodeSize;
            $("#snakePanel").append($("<div />", {
                id: "food" + foodId,
                class: "snake-food",
            }).css({
                left: (randX + "px"),
                top: (randY + "px")
            }));
            foodBuffer.push("#food" + foodId);
            foodId++;
        }
        var temp = (5-(combo/2))*1000;
        foodSpawnInterval = setTimeout(spawnFood, temp);
    }

    function decreaseCombo(){
        if (combo != 0) {
            combo--;
            updateComboScreen();
        }
    }

    function incTimer() {
        timer++;
        $("#timer").html(timer);
    }
    function updateComboScreen(){
        comboDOM =$("#combo");
        comboDOM.removeClass();
        if(combo <= 2)
            comboDOM.addClass('combo-small');
        else if(combo >= 3 && combo <= 4)
            comboDOM.addClass('combo-medium');
        else if (combo == 8)
            comboDOM.addClass('combo-8');
        else
            comboDOM.addClass('combo-big');
        comboDOM.html(combo);
    }
}


