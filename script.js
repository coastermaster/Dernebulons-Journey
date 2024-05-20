//coins
let coins = 0;
let coinNeedsSpawned = true;
let coinDisplay;

//shop
let andersonHeight = 2500;
let scoreMultiplier = 1;
let proteinRate = 10;
let enemyToggle = true;
let helpMenu;
let rocketDisplay;
let noEnemiesDisplay;
let scoreMultiplyDisplay;
let moreProteinDisplay;
let noAndersonDisplay;

//music
var music = new Audio('music.mp3');
music.play();
//modern.play();

//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let activeScoreDisplay;
let left;
let right;

//player
let playerWidth = 34; //width/height ratio = 408/228 = 17/12
let playerHeight = 34;
let playerX = boardWidth/2;
let playerY = boardHeight/2;
let playerImg;

let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//platform
let spawnableArray = [];
let platformWidth = 64; //width/height ratio = 384/3072 = 1/8
let platformHeight = 12;
let platformX = boardWidth;
let platformY = 0;

let trenImg;
let proteinImg;
let creatineImg;
let andersonImg;
let coinImg;

let initial = true;

//physics
let playerVelocityY = 0;
let playerVelocityX = 0;
let gravity = 0.06;

let pauseMenu;
let paused = true;
let gameOver = false;
let scale = 130;
let difficulty = 10;
let platformsSpawned = 0;

//leaderboard
let playerNameList = ["James", "Karter", "Isabella", "Ayden","Silas", "Ryan","Mrs Nashatal","Derrick","Nathan","Lex", "Vernon","Ava","Kendall","Sarai","Luke", "Ken","Sydney","Seth","Kate","Pharrel Williams", "Kayla","Ella","Rylie","Jayden","Max","Brett","The Power of Friendship","The Dwarves","Siraj","Dilyan","Legbron","Fortniteballs","Sleepy Joe", "James Clone","James Clone 2","James Clone 3","James Clone 4","James Clone 5","Fred's Big Toe","James Clone 6","James Clone 7","James Clone 8","James Clone 9","James Clone 10","Wro","E.M","Crying James","Cry","Crystal Man","Drake","Freakybob","D.K. Mook","ToeManJoe","WilliamFeetPLS","FreaKrepps","Meus","Moggos","Mogulese","GoonSquadAlpha","Nate Scab","Nathanial William","Nathanial William Schroobington the Third Jr. Esquire XVII","Ryanuts","Ryanuts the Second","Ryanuts the Second Jr.","Blowwwww","Zulu","Digbar","Drake","Gyatkeeper","Fentywizard Dylan","1m_3dg1ng","Fent Fiend","I love James","Mrs.Anderson", "Mrs.Anderson's Sister","Mrs.Anderson's Brother","Mrs.Anderson's Grandma","Mrs.Anderson's Grandpa","Mrs.Anderson's Grandpa's 'Grandma's Gran","BBL","JPP","RyZe ツ","S C Λ R Ξ D","not tfue","Toxic ツ","NINJA","Shadow ツ","Savage","NinjasHyper","FaZe Mongraal","TSM_Myth","XXXTENTACTION","Panda","Dark","Mystic","xXgrooming_kiddiesXx","FaZe Sway","FaZe_Sway ツ","Splyxツ","Møønłightツ","ZΞUS","TuViejaEnBolas","Tøxicツ","L3gend","GL1ZZY:G0BBl3R","I hate c#","K3lly","6-CoC_Goblin-9","TREENNN!","Liver King","Darglin Gunner","hey guys none of these names are real people i made them all up and they are fake, nobody plays this game","GYATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT","goonin_and_groomin","coal-miner","WR!!!","WR!!!","WR!!!","WR!!!","WR!!!","b00g13B0m6","the james leak","james you got leaked","Promogtheus"];
let gameOverDisplay;
let highScoreDisplay;
let scoreDisplay;
let score = 130;
let highScore = 0;
let player1;
let player2;
let player3;
let randomIndex;
let playerScore = 6289;
let playerBestScore
let playerHighScore;
let updated = true;


window.onload = function() {
    //get all elements
    gameOverDisplay = document.getElementById("gameOver");
    highScoreDisplay = document.getElementById("highscore");
    scoreDisplay = document.getElementById("score");
    player1 = document.getElementById("player1");
    player2 = document.getElementById("player2");
    player3 = document.getElementById("player3");
    board = document.getElementById("board");
    activeScoreDisplay = document.getElementById("scoreDisplay");
    pauseMenu = document.getElementById("pauseMenu");
    coinDisplay = document.getElementById("coinDisplay");
    helpMenu = document.getElementById("helpMenu");
    rocketDisplay = document.getElementById("rocket");
    noEnemiesDisplay = document.getElementById("noEnemies");
    scoreMultiplyDisplay = document.getElementById("scoreMultiply");
    moreProteinDisplay = document.getElementById("moreProtein");
    noAndersonDisplay = document.getElementById("noAnderson");

    //set up board
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    playerImg = new Image();
    playerImg.src = "./Dernebulon.jpg";
    playerImg.onload = function() {
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    creatineImg = new Image();
    creatineImg.src = "./Platform.jpg";

    trenImg = new Image();
    trenImg.src = "./Tren.jpg";

    proteinImg = new Image();
    proteinImg.src = "./Protein.jpg";

    andersonImg = new Image();
    andersonImg.src = "./Anderson.jpg";

    coinImg = new Image();
    coinImg.src = "./Coin.jpg";

    pauseMenu.style.display = "block";
    requestAnimationFrame = (a) => setTimeout(a, 1e3/60);
    //requestAnimationFrame(update);
    setTimeout(function() {
        update();
    }, 16.66667);
}

function update() {
    //requestAnimationFrame(update);
    setTimeout(function() {
        update();
    }, 16.66667);
    if (paused){
        return;
    }
    //do stuff if game is over
    if (gameOver) {
        if (updated) {
            updateLeaderBoard();
            updated = false;
        }
        spawnableArray = [];
        initial = true;
        gameOverDisplay.style.display = "block";
        highScoreDisplay.textContent = highScore;
        scoreDisplay.textContent = score;
        coinNeedsSpawned = true;
        return;
    }
    //clear stuff so frame can be updated
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //map generator
    if (spawnableArray.length < 20){
        if (platformsSpawned != difficulty){
            //spawn platform
            platformsSpawned += 1
            placePlatforms();
        } else {
            //spawn enemy
            platformsSpawned = 0;
            if (enemyToggle){
                placeEnemy();
            }
        }
    }
    //spawn coin
    if (coinNeedsSpawned === true){
        //spawn coin
        coinNeedsSpawned = false;
        placeCoin();
        platformsSpawned -= 1;
    }
    //Spawn coin condition
/*    if (playerScore >= 100){
        coinNeedsSpawned = true;
    }*/

    //udpdate score and difficulty scale
    score -= Math.round(playerVelocityY * scoreMultiplier);
    scale -= Math.round(playerVelocityY * scoreMultiplier);
    if (difficulty > 1){
        if (scale >= 750) {
            //udpate spawn rates
            scale = 0;
            difficulty -= 1
            platformsSpawned -= 1;
        } else if (scale < 0) {
            //update spawn rates
            scale = 750;
            difficulty += 1;
        }
    }

    //update highscore
    if (highScore <= score){
        highScore = score
    }
    //check if player fell
    if (player.y > board.height) {
        gameOver = true;
    }
    //check to loop player to other side
    if (player.x <= 0) {
        player.x = board.width - player.width;
    } else if (player.x >= board.width - player.width){
        player.x = 0;
    }
    //enter platform loop
    for (let i = 0; i < spawnableArray.length; i++) {
        let spawnable = spawnableArray[i];
        context.drawImage(spawnable.img, spawnable.x, spawnable.y, spawnable.width, spawnable.height);
        //move anderson enemy
        if (spawnable.anderson){
            //set direction if none is set
            if (spawnable.direction === 0){
                spawnable.direction = Math.random()*100;
            }
            if (spawnable.direction < 50){
                //move left if below 50 direction
                spawnable.x = spawnable.x - 2;
            } else { 
                //move right if above 50 direction
                spawnable.x = spawnable.x + 2;
            }
            //loop to other side
            if (spawnable.x < 0){ 
                spawnable.x = boardWidth - 34;
            } else if (spawnable.x > boardWidth - 34){
                spawnable.x = 0;
            }
        }
        //check if player is above the height
        if (player.y < (board.height/2) - (board.height/64)) {
            if (playerVelocityY < 0){
                //if going up move platforms and enemies down
                spawnable.y -= playerVelocityY;
            } else {
                //if going down move the player down only when above the height
                player.y += playerVelocityY;
                player.y = Math.max(player.y + playerVelocityY, 0); 
            }
        }
        //check if player collides with platform while falling
        if (playerVelocityY > 0){
            if (detectCollision(player, spawnable)) {
                if (spawnable.protein){
                    //if protein jump high
                    jump(-6);
                } else if (spawnable.creatine){
                    //if creatine jump low
                    jump(-3);
                } else if (spawnable.initial){
                    //if initial jump super high
                    jump(-3);
                }
            }
        }
        //check if player collides with platform even while not falling
        if (detectCollision(player, spawnable)) {
            if (spawnable.anderson){
                //if anderson reset
                reset();
            } else if (spawnable.tren){
                //if tren reset
                reset();
            } else if (spawnable.coin){
                //if coin add to score
                coins = coins + 1;
                spawnable.coin = false;
                //deleteCoin();
                coinNeedsSpawned = true;
                spawnable.y = 999999;
            }
        }
    }
    //apply gravity
    playerVelocityY += gravity;
    //move player left or right
    player.x = Math.max(player.x + playerVelocityX, 0);
    if (player.y >= (board.height/2) - (board.height/64)) {
        //move the player down only when below the height
        player.y += playerVelocityY;
        player.y = Math.max(player.y + playerVelocityY, 0); 
    }

    //clear spawnable if they go below the bottom
    if (spawnableArray[0].y > boardHeight) {
        spawnableArray.shift(); //removes first element from the array
        if (spawnableArray[0].coin){
            coinNeedsSpawned = true;
        }
    }

    //update display text
    activeScoreDisplay.textContent = score;
    coinDisplay.textContent = coins;
}


function placePlatforms() {
    // dont place platform if game is over
    if (gameOver) {
        return;
    }
    //place initial platform
    if (initial){
        let initialPlatform = {
            img : proteinImg,
            x : 0,
            y : boardHeight - boardHeight/16,
            width : boardWidth,
            height : 40,
            enemy : false,
            initial : true
        }
        spawnableArray.push(initialPlatform);
        initial = false;
    }
    let highest = (spawnableArray[spawnableArray.length - 1]);
    if ((Math.random()*100) <= proteinRate){
        //spawn protein at a 10% chance
        let protein = {
            img : proteinImg,
            x : (boardWidth - platformWidth) - Math.random() * (boardWidth - platformWidth),
            y: highest.y - (boardHeight/8) + (Math.random() * boardHeight/8),
            width : platformWidth,
            height : platformHeight,
            enemy : false,
            protein : true
        }
        spawnableArray.push(protein);
    } else {
        //spawn creatine at a 90% chance
        let creatine = {
            img : creatineImg,
            x : (boardWidth - platformWidth) - Math.random() * (boardWidth - platformWidth),
            y: highest.y - (boardHeight/8) + (Math.random() * boardHeight/8),
            width : platformWidth,
            height : platformHeight,
            enemy : false,
            creatine : true
        }
        spawnableArray.push(creatine);
    }
}

function placeEnemy() {
    let highest = (spawnableArray[spawnableArray.length - 1]);
    if (score >= andersonHeight){
        //spawn anderson if above 2500 score
        let anderson = {
            img : andersonImg,
            x : (boardWidth - 34) - Math.random() * (boardWidth - 34),
            y: highest.y - (boardHeight/8) + (Math.random() * boardHeight/8),
            width : 34,
            height : 34,
            enemy : true,
            anderson : true,
            direction : 0
        }
        spawnableArray.push(anderson);
    } else {
        //spawn tren if above 2500 score
        let tren = {
            img : trenImg,
            x : (boardWidth - 34) - Math.random() * (boardWidth - 34),
            y: highest.y - (boardHeight/8) + (Math.random() * boardHeight/8),
            width : 34,
            height : 34,
            enemy : true,
            tren : true,
        }
        spawnableArray.push(tren);
    } 
}

function placeCoin() {
    //spawn coint at a 100% chance
    let highest = (spawnableArray[spawnableArray.length - 1]);
    let coin = {
        img : coinImg,
        x : (boardWidth - 34) - Math.random() * (boardWidth - 34),
        y: highest.y - ((boardHeight/32) + (Math.random() * (boardHeight/32))),
        width : 34,
        height : 34,
        enemy : true,
        coin : true,
        direction : 0
    }
    spawnableArray.push(coin);
}

document.addEventListener("keyup", function(event) {
    //if A or Left Arrow is released stop moving
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
        move(0);
    }
    //if D or Right Arrow is released stop moving
    if (event.code === "KeyD" || event.code === "ArrowRight") {
        move(0);
    }
});
document.addEventListener("keydown", function(event) {
    //if A or Left Arrow is pressed move left
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
        move(-5);
    }
    //if D or Right Arrow is pressed move right
    if (event.code === "KeyD" || event.code === "ArrowRight") {
        move(5);
    }
    //if R is pressed reset
    if (event.code === "KeyR"){
        reset();
    }
    //if Space is pressed restart
    if (event.code === "Space"){
        restart();
        resume(); 
        noHelp();
    }
    if (event.code === "KeyP" || event.code === "Escape"){
        pause();
    }
    if (event.code === "Backquote"){
        playerNameList = ["Ryan"]
    }
});
document.addEventListener('DOMContentLoaded', function() {
    left = document.getElementById("left");
    right = document.getElementById("right");
    left.addEventListener("touchstart", function() {
        move(-5);
    });

    left.addEventListener("touchend", function() {
        move(0);
    });

    right.addEventListener("touchstart", function() {
        move(5);
    });

    right.addEventListener("touchend", function() {
        move(0);
    });
});

function detectCollision(a, b) {
    //check if all of a sides are within b sides
    return a.x + a.width > b.x && // Right side of a is to the right of the left side of b
           a.x < b.x + b.width && // Left side of a is to the left of the right side of b
           a.y + a.height > b.y && // Bottom side of a is below the top side of b
           a.y < b.y + b.height; // Top side of a is above the bottom side of b
}

function jump(a) {
    //set playerVelocityY to whatever is inputed
    playerVelocityY = a;
}

function move(a) {
  //set playerVelocityX to whatever is inputed
    playerVelocityX = a;
}

function reset(){
    //set player y super low so they die 
    player.y = 9999;  
}

function restart(){
    //restart the game and reset most variables
    if (gameOver) {
        player.y = boardHeight/2;
        player.x = boardWidth/2;
        score = 130;
        scale = 130;
        gameOver = false;
        playerVelocityX = 0;
        playerVelocityY = 0;
        gameOverDisplay.style.display = "none";
        updated = true;
        difficulty = 10;
        platformsSpawned = 0;
    }
}

function updateLeaderBoard(){
    if (score >= playerScore){
        //if score is higher than the playerScore add to score
        playerScore = score + Math.floor(Math.random() * 1982);
    } else {
        //if score is lower than the playerScore add to playerScore
        playerScore = playerScore + Math.floor(Math.random() * 578);
    }
    //get random name and get previous playerScore then display it
    randomIndex = Math.floor(Math.random() * playerNameList.length);
    player3.textContent = playerNameList[randomIndex] + ": " + playerScore;

    //get random name and score higher than playerScore then display it
    playerBestScore = playerScore + Math.floor(Math.random() * 1289);
    randomIndex = Math.floor(Math.random() * playerNameList.length);
    player2.textContent = playerNameList[randomIndex] + ": " + playerBestScore;

    //get random name and score higher than bestScore then display it
    playerHighScore = playerBestScore + Math.floor(Math.random() * 1982);
    randomIndex = Math.floor(Math.random() * playerNameList.length);
    player1.textContent = playerNameList[randomIndex] + ": " + playerHighScore;
}

function pause(){
    paused = true;
    pauseMenu.style.display = "block";
}

//resumes the game
function resume(){
    paused = false;
    pauseMenu.style.display = "none";
}

function help(){
    paused = true;
    helpMenu.style.display = "block";
}

function noHelp(){
    paused = false;
    helpMenu.style.display = "none";
}

function rocket(){
    if (coins >= 3){
        coins = coins - 3;
        jump(-10);
    }
}

function noEnemies(){
    if (coins >= 6){
        coins = coins - 6;
        enemyToggle = false;
        console.log("hi");
        noEnemiesDisplay.textContent = "5"
        setTimeout(function() {
            noEnemiesDisplay.textContent = "4"
        }, 1000);
        setTimeout(function() {
            noEnemiesDisplay.textContent = "3"
        }, 2000);
        setTimeout(function() {
            noEnemiesDisplay.textContent = "2"
        }, 3000);
        setTimeout(function() {
            noEnemiesDisplay.textContent = "1"
        }, 4000);
        setTimeout(function() {
            noEnemiesDisplay.textContent = "🚫"
            enemyToggle = true;
        }, 5000);
    }
}

function scoreMultiply(){
    if (coins >= 2){
        coins = coins - 2;
        scoreMultiplier = 2;
        scoreMultiplyDisplay.textContent = "5"
        setTimeout(function() {
            scoreMultiplyDisplay.textContent = "4"
        }, 1000);
        setTimeout(function() {
            scoreMultiplyDisplay.textContent = "3"
        }, 2000);
        setTimeout(function() {
            scoreMultiplyDisplay.textContent = "2"
        }, 3000);
        setTimeout(function() {
            scoreMultiplyDisplay.textContent = "1"
        }, 4000);
        setTimeout(function() {
            scoreMultiplyDisplay.textContent = "✖"
            scoreMultiplier = 1;
        }, 5000);
    }
}

function moreProtein(){
    if (coins >= 1){
        coins = coins - 1;
        proteinRate = 50;
        moreProteinDisplay.textContent = "5"
        setTimeout(function() {
            moreProteinDisplay.textContent = "4"
        }, 1000);
        setTimeout(function() {
            moreProteinDisplay.textContent = "3"
        }, 2000);
        setTimeout(function() {
            moreProteinDisplay.textContent = "2"
        }, 3000);
        setTimeout(function() {
            moreProteinDisplay.textContent = "1"
        }, 4000);
        setTimeout(function() {
            moreProteinDisplay.textContent = "💪"
            proteinRate = 10;
        }, 5000);
    }
}

function noAnderson(){
    if (coins >= 3){
        coins = coins - 3;
        andersonHeight = 9999999999;
        noAndersonDisplay.textContent = "5"
        setTimeout(function() {
            noAndersonDisplay.textContent = "4"
        }, 1000);
        setTimeout(function() {
            noAndersonDisplay.textContent = "3"
        }, 2000);
        setTimeout(function() {
            noAndersonDisplay.textContent = "2"
        }, 3000);
        setTimeout(function() {
            noAndersonDisplay.textContent = "1"
        }, 4000);
        setTimeout(function() {
            noAndersonDisplay.textContent = "⇋"
            andersonHeight = 2500;
        }, 5000);
    }
}
