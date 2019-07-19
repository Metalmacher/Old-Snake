var Snake;
var gameInterval;
var currentDir = "right";

var SnakeDirectionsArray = {
    EVENT_KEYNAMES: ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"],
    LITERAL_DIRECTIONS: ["down", "up", "left", "right"]
};

var SnakeSpeed = 100;
var SnakeSpeedString = "MEDIUM";
function changeSpeed() {
    switch(SnakeSpeedString)
    {
        case "SLOW":
            SnakeSpeed = 150;
            break;
        case "MEDIUM":
            SnakeSpeed = 100;
            break;
        case "FAST":
            SnakeSpeed = 50;
            break;
    }
}


var SnakeNodeSize;
//the idea for the inspector element came from this stack overflow page: http://stackoverflow.com/questions/10958869/jquery-get-css-properties-values-for-a-not-yet-applied-class
function determineSnakeNodeSize() {
    $("#snakePanel").append($("<div />", {
        display: "none",
        id: "inspector",
        class: "snake-node"
    }));

    SnakeNodeSize = parseInt($("#inspector").css("width"), 10);
    $("#inspector").remove();
}

//*************************
//var SnakeCell = $("<div class='snake-node'><div class='snake-cell'></div></div>");
//-----
//didn't work... need to investigate...
//*************************

var key = true; //used to limit button acceptance

var foodId = 0; //used to help create different id's for each food spawn.

var foodBuffer = new Array();

var foodSpawnInterval;

var combo;
var comboInterval;
var score;
var timer;
var timerInterval;
var leaderboards = [];


