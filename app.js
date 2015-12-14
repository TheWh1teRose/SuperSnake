//Variablen
var canvas = document.getElementById("myCan");
var gc = canvas.getContext("2d");
var lastDate = new Date();
var timeSinceLastTick = 0;
var TIMETOROT = 10;
var TIMEBETWEENTICKS = 0.1;
var minutes = 0;
var secounds = 0;

//how much food is at the start
var startFood = 8;

//set the liveTime of the food
var liveTime = 15;

//set the score
var score = 0;

//Head position
var x = 0;
var y = 0;

//cell and grid size
var CELLSIZE = 15;
var GRIDWIDTH  = 53;
var GRIDHEIGHT = 53;

//keycodes
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

//look of the snake
var dir = RIGHT;

//food variables
var foodX = 0;
var foodY = 0;
var foodColor = 999999;

//create a random number
function randomNumber(range){
    return Math.floor(Math.random() * range);
}

//create a array for the segments and the food
var segments = [];
var food = [];


//is the gameover
var gameOver = false;

//function for the food
function Food(x, y, foodColor, liveTime){
    food.push(this);
}

//function to place food
function placeFood(index){
    while(true){
        food[index].x = randomNumber(GRIDWIDTH);
        food[index].y = randomNumber(GRIDHEIGHT);
        
        var isOnOtherGameObject = false;
        
        for(var i = 0; i<segments.length; i++){
            if(food[index].x === segments[i].x && food[index].y === segments[i].y){
                isOnOtherGameObject = true;
                continue;
            }
        }
        for(var i = 0;i<food.length;i++){
            if(!food[index] === food[i]){
              if(food[index].x === food[i].x && food[index].y === food[i].y){
                    isOnOtherGameObject = true;
                    continue; 
                }  
            }
        food[index].liveTime = liveTime;
        }
        if(!isOnOtherGameObject){
            break;
        }
    }
    food[index].foodColor = randomNumber(1000000);
}

//function for the segments
function Segment(x, y, foodColor){
    this.x = x;
    this.y = y;
    this.foodColor = foodColor;
    segments.push(this);
}             
//save the controls in a queue
var controlQueue = [];

//place the start segments
for(var i = 0; i<4; i++){
    new Segment(-100, 100, randomNumber(1000000));  
}

//place the start food
for(var i = 0; i<startFood;i++){
    new Food(-100,-100, 000000, liveTime);
    placeFood(i);
}

//the event listener for keys
document.addEventListener("keydown", function(event){
    var kc = event.keyCode;
    if(controlQueue.length < 5 &&kc === LEFT || kc === RIGHT || kc === UP || kc === DOWN){
        controlQueue.push(kc);
    }
});

//the update function
function update(){
    //every thing how deals with delta time must be before the frames are computed
    var thisDate = new Date();
    var deltaTime = (thisDate.getTime() - lastDate.getTime()) / 1000;
    lastDate = thisDate;
    
	secounds += deltaTime;
    
    //let the food rot
        for(var i = 0; i<food.length; i++){
            if(food[i].liveTime > 0){
                food[i].liveTime -= deltaTime;
            }else{
                 food[i].foodColor = "15790E"
            }
        }
	
    timeSinceLastTick += deltaTime;
    
    if(!gameOver && timeSinceLastTick > TIMEBETWEENTICKS){
        timeSinceLastTick -= TIMEBETWEENTICKS;
        gc.fillStyle = "#000000";
        gc.fillRect(0, 0, canvas.width, canvas.height);
        
		if(secounds >= 60){
			secounds = 0;
			minutes++;
		}
		
        //work down the control queue
        if(controlQueue.length > 0){
            //you cant run in your self
            switch(controlQueue[0]){
        case(LEFT):
            if(dir === UP || dir === DOWN){
               dir = LEFT; 
            } 
            break;
        case(UP):
            if(dir === RIGHT || dir === LEFT){
               dir = UP; 
            } 
            break;
        case(RIGHT):
            if(dir === UP || dir === DOWN){
               dir = RIGHT; 
            } 
            break;
        case(DOWN):
            if(dir === RIGHT || dir === LEFT){
               dir = DOWN; 
            }
            break;
    }
            controlQueue.splice(0, 1);       
        }
        
        //input to position
        switch(dir){
        case(LEFT):
                x--;
                break;
        case(RIGHT):
                x++;
                break;
        case(UP):
                y--;
                break;
        case(DOWN):
                y++;
                break;
        }
        
        //mackes the snake faster
        if(score === 20){
            TIMEBETWEENTICKS =  0.07;
        }if(score === 50){
            TIMEBETWEENTICKS = 0.06;
        }if(score === 70){
            TIMEBETWEENTICKS = 0.05;
        }if(score === 100){
            TIMEBETWEENTICKS = 0.04;
        }
        
        //spawn more food if the score higher
        if(score === 20 && food.length === startFood){
            new Food(-100-100,1000000, liveTime);
            placeFood(food.length - 1);
        }if(score === 50 && food.length === (startFood+1)){
            new Food(-100-100,1000000, liveTime);
            placeFood(food.length - 1);
        }if(score === 70 && food.length === (startFood+2)){
            new Food(-100-100,1000000, liveTime);
            placeFood(food.length - 1);
        }if(score === 100 && food.length === (startFood+3)){
            new Food(-100-100,1000000, liveTime);
            placeFood(food.length - 1);
        }
        
        
        
        //if the player hit a roted food he is game over
        for(var i = 0; i<food.length; i++){
            if(food[i].liveTime <= 0){
                if(food[i].x === x && food[i].y === y){
                    gameOver = true;
                }
            }
        }
        
        //if you hit the border you come on the other side out
        if(x < 0){
            x = GRIDWIDTH - 1;
        }
        if(x >= GRIDWIDTH){
            x = 0;
        }
        if(y < 0){
            y = GRIDHEIGHT -1;
        }
        if(y >= GRIDHEIGHT){
            y = 0;
        }
        
        //macke a blick effect
        for(var i = 0;i<food.length;i++){
            if(food[i].liveTime > 0){
                food[i].foodColor = randomNumber(1000000);  
            }
        }
        
        //if you hit a segment is the game over
        for(var i = 0; i<segments.length; i++){
            if(segments[i].x === x && segments[i].y === y){
                gameOver = true;
            }
        }
        
        //set the segment on the position from the segment in the front
        for(var i = segments.length - 1; i>0; i--){
            segments[i].x = segments[i-1].x;
            segments[i].y = segments[i-1].y;
        }
        
        //set a new segment and place a new food
        for(var i = 0; i<food.length; i++){
           if(x === food[i].x && y === food[i].y){
            new Segment(-100, -100, food[i].foodColor);
            placeFood(i);
               score++;
            } 
        }
        
        segments[0].x = x;
        segments[0].y = y;
        
        //draw the segments and the food
        gc.fillStyle = "#00ff00";
        for(var i = 0; i<segments.length; i++){
            gc.fillStyle = "#" + segments[i].foodColor;
            gc.fillRect(segments[i].x * CELLSIZE, segments[i].y * CELLSIZE, CELLSIZE, CELLSIZE);
        }
        for(var i = 0; i<food.length; i++){
            gc.fillStyle = "#" + food[i].foodColor;
            gc.fillRect(food[i].x * CELLSIZE, food[i].y * CELLSIZE, CELLSIZE, CELLSIZE);
        }
        gc.fillStyle = "white";
        gc.font = "20px Arial";
        gc.fillText("Score: " + score, 650, 50);
		
		gc.fillText(Math.round(minutes) + ":" + Math.round(secounds), 650, 80);
    }
}

//set the interval of the update function
window.setInterval(update, 1);