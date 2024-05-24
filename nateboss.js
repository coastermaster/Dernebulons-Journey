let cheater = false;
let loop;
let context;
let board;
let maxWidth;
let maxHeight;
let playerImg;
let yVelocity = 0;
let xVelocity = 0;
let moving = false;
let left = false;
let right = false;
let dash;
let dashEnabled = true;
let dashActive = false;
let dashCounter = 0;
let dashOuterDisplay;
let dashInnerDisplay;
let dashCooldownLoop;
let dashWidth = 1;
let trail = [];
let jumping = true;
let health = 300;
let player = {
    x: 0, // Set initial position
    y: 0,
    width: 0,
    height: 0
};
let nate = {
    x: 0, // Set initial position
    y: 0,
    width: 10,
    height: 10
};
let legit;
let moveDirection;
let nateSpeed;
let arms = [];
let armImgLoaded = false;
let handImgLoaded = false;
let nateHealth = {
    totalHP: 3750,
    stage1:3750,
    stage2:2500,
    stage3:1250
};
let gameIsOver = false;
let gameOverDisplay;
let attackType
let ssHealing = 100;
let ssCooldown = 50000;
let canHeal = true;
let weapon = {
    damage: 45,
    cooldown: 100
}
let leftButton;
let rightButton;
let dashButton;
let jumpButton;
let autoFire = true;

weaponImg = new Image();
weaponImg.src = "./Megashark.webp";

nateBossImg = new Image();
nateBossImg.src = "./NateFace.png";

nateArmImg = new Image();
nateArmImg.src = "./NathanArmTop.png";

nateHandImg = new Image();
nateHandImg.src = "./NathanArmTip.png";

let healthDisplay;
let dashDisplay;

function nateMove() {
    let moveDirection = Math.floor(Math.random() * 2);
    const attackInterval = Math.random() * 1000 + 500;
    const desiredDistance = maxWidth / 40; // Desired distance from the player
    const tolerance = maxWidth / 8; // Allowed tolerance for the distance

    // Movement logic
    setInterval(function() {
        moveDirection = Math.floor(Math.random() * 2);
    }, 1000);

    setInterval(function() {
        const distanceToPlayer = player.x - nate.x;

        if (Math.abs(distanceToPlayer) > desiredDistance + tolerance) {
            // Move towards the player if too far
            if (distanceToPlayer > 0) {
                moveDirection = 1; 
            } else {
                moveDirection = 0; 
            }
        } else if (Math.abs(distanceToPlayer) < desiredDistance - tolerance) {
            // Move away from the player if too close
            if (distanceToPlayer > 0) {
                moveDirection = 0; 
            } else {
                moveDirection = 1; 
            }
        }
    }, 10);

    setInterval(function() {
        if (moveDirection === 0) {
            nate.x -= maxWidth / 250;
        } else if (moveDirection === 1) {
            nate.x += maxWidth / 250;
        }

        // Ensure Nate stays within screen bounds
        if (nate.x >= maxWidth - nate.width) {
            nate.x = maxWidth - nate.width;
        } else if (nate.x <= 0) {
            nate.x = 0;
        }
    }, 10);

    // Attack logic
    setInterval(function() {
        const attackType = Math.floor(Math.random() * 2);
        if (attackType === 0) {
            nateBasicAttack();
//        } else if (attackType === 1) {
//            nateDashAttack();
        } else if (attackType === 1) {
            nateSlamAttack();
        }
    }, attackInterval);

    function nateBasicAttack() {
        //This should send a projectile at the player
        if (attackCounter === 0){
            nateSpinningProjectileStart();
        }
        setTimeout(function(){
            attackCounter = 0
        }, 750);
    }

//    function nateDashAttack() {
        // Nate spawns a clone that dashes towards the player
//        console.log('Nate performs a dash attack');
//    }

    function nateSlamAttack() {
        // Nate shoots his arm down towards the ground
        const arm = {
            x: nate.x + nate.width / 2.66,
            y: nate.y,
            width: maxWidth / 20,
            height: maxHeight / 2,
            type: "tip",
            active: true
        };
        arms.push(arm);
    }
}



function detectCollision(a, b) {
    //check if all of a sides are within b sides
    return a.x + a.width > b.x && // Right side of a is to the right of the left side of b
           a.x < b.x + b.width && // Left side of a is to the left of the right side of b
           a.y + a.height > b.y && // Bottom side of a is below the top side of b
           a.y < b.y + b.height; // Top side of a is above the bottom side of b
}

//checks localstorage to set legit to legit then allows them to do the fight if it is true
function verify(){
    legit = localStorage.getItem("legit");
    if (legit === "true"){
        confirmMenu.style.display = "none";
        nateMove();
        //localStorage.removeItem("legit");
    }else{
        alert("You are not legit");
        setInterval(function() {
            window.location.href = "/" 
        }, 2000);
//you can do localStorage.setItem("legit", "true") in console to get permission
    }
}

//send user back to main game if they quit
function quit(){
    window.location.href = "/"
}

window.onload = function() {
    board = document.getElementById("board");
    gameOverDisplay = document.getElementById("gameOverDisplay");
    healthDisplay = document.getElementById("health");
    dashInnerDisplay = document.getElementById("dash");
    dashOuterDisplay = document.getElementById("dashOuter");
    leftButton = document.getElementById("leftButton");
    rightButton = document.getElementById("rightButton");
    dashButton = document.getElementById("dashButton");
    jumpButton = document.getElementById("jumpButton");
    context = board.getContext("2d");

    // Load player image
    playerImg = new Image();
    playerImg.src = "Dernebulon.jpg";
    playerImg.onload = function() {
        // Once image is loaded, set player properties
        player.width = board.height / 10;
        player.height = board.height / 10;
        player.x = (board.width - player.width) / 2;
        player.y = (board.height - player.height) / 2;
    };

    nateBossImg = new Image();
    nateBossImg.src = "NateFace.png";
    nateBossImg.onload = function() {
        // Once image is loaded, set nate properties
        nate.width = board.height / 5;
        nate.height = board.height / 5;
        nate.x = (board.width - nate.width) / 2;
        nate.y = (board.height - nate.height) / 16;
    };

    nateArmImg = new Image();
    nateArmImg.src = "./NathanArmTop.png";
    nateArmImg.onload = function() {
        armImgLoaded = true;
    };

    nateHandImg = new Image();
    nateHandImg.src = "./NathanArmTip.png";
    nateHandImg.onload = function() {
        handImgLoaded = true;
    };

    // Start the game loop once both images are loaded
    Promise.all([playerImg.decode(), nateBossImg.decode()]).then(() => {
        loop = setInterval(update, 33.3333333333);
    });
};

//basically call every frame
function update() {
    if (gameIsOver) {
        return;
    }
    if (nateHealth.totalHP <= 0){
        console.log("you win!!!!")
    }
    if (isMobile()){
        mouseX = nate.x + (nate.width / 2);
        mouseY = nate.y + (nate.height / 2);
        //shootInterval = setInterval(shootBullet, 100);
        isMouseDown = true;
    }
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    trail.push({ x: player.x, y: player.y });
    if (dashActive){
        for (let i = 0; i < trail.length; i += 1) {
            const alpha = (i + 1) / trail.length;
            context.globalAlpha = alpha;
            context.drawImage(playerImg, trail[i].x, trail[i].y, player.width, player.height);
            context.globalAlpha = 1;
        }    
    }
    if (trail.length > 5) {
        trail.shift();
    }
    context.drawImage(nateBossImg, nate.x, nate.y, nate.width, nate.height);

    for (let i = 0; i < arms.length; i++){
        if (arms[i].active === true){
            if (arms[i].type === "tip"){
                if (handImgLoaded){
                    context.drawImage(nateHandImg, arms[i].x, arms[i].y, arms[i].width, arms[i].height);
                    arms[i].y += maxHeight / 100;
                }
            }
            if (detectCollision(player, arms[i])){
                arms[i].active = false;
                console.log("collided");
                damage(100);
            }
        }
    }

    if (jumping) {
        player.y += yVelocity;
        yVelocity += maxHeight / 250;
    }
    if (player.y > maxHeight - player.height) {
        player.y = maxHeight - player.height;
        jumping = false;
        yVelocity = 0;
    }
    if (dashActive) {
        if (xVelocity < 0) {
            xVelocity += maxWidth / 750;
        } else {
            xVelocity -= maxWidth / 750;
        }
    }
    if (!moving) {
        if (left) {
            if (xVelocity < 0) {
                xVelocity += maxWidth / 1000;
            } else {
                xVelocity = 0;
            }
        }
        if (right) {
            if (xVelocity > 0) {
                xVelocity -= maxWidth / 1000;
            } else {
                xVelocity = 0;
            }
        }
    }
    player.x += xVelocity;
    if (player.x < 0) {
        player.x = 0;
        xVelocity = 0;
    } else if (player.x > maxWidth - player.width) {
        player.x = maxWidth - player.width;
        xVelocity = 0;
    }
    if (health <= 0){
        gameOver();
    }

    drawGun();
    updateBullets();
    drawBullets();
}

document.addEventListener('DOMContentLoaded', () => {
    display = document.getElementById("display");
    board = document.getElementById("board");
    function setAspectRatio() {
        const element = document.getElementById('display');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let elementWidth, elementHeight;

        if (viewportWidth / viewportHeight > 16 / 9) {
            // Viewport is wider than 16:9, fit to height
            elementHeight = viewportHeight;
            elementWidth = elementHeight * (16 / 9);
        } else {
            // Viewport is taller than 16:9, fit to width
            elementWidth = viewportWidth;
            elementHeight = elementWidth * (9 / 16);
        }

        element.style.width = `${elementWidth}px`;
        element.style.height = `${elementHeight}px`;
        board.width = elementWidth; // Set canvas width
        board.height = elementHeight; // Set canvas height
        display.width = elementWidth; // Set canvas width
        display.height = elementHeight; // Set canvas height
        maxHeight = elementHeight;
        maxWidth = elementWidth;
        nate.width = board.height / 10;
        nate.height = board.height / 10;
        nate.y = elementHeight / 4;
        player.width = board.height / 10;
        player.height = board.height / 10;
        player.y = elementHeight - player.height;
    }

    // Set the aspect ratio on page load
    setAspectRatio();

    // Update the aspect ratio on window resize
    window.addEventListener('resize', setAspectRatio);
});

document.addEventListener("keyup", function(event) {
    //if A or Left Arrow is released stop moving
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
        if (left){
            moving = false;
        }
    }
    //if D or Right Arrow is released stop moving
    if (event.code === "KeyD" || event.code === "ArrowRight") {
        if (right){
            moving = false;
        }
    }
});

document.addEventListener("keydown", function(event) {
    //if A or Left Arrow is pressed start moving
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
        moving = true;
        xVelocity = -maxWidth / 100;
        left = true;
        right = false;
    }
    if (health >= 300 && cheater === false){
        damage(health - 300);
    }
    //if D or Right Arrow is pressed start moving
    if (event.code === "KeyD" || event.code === "ArrowRight") {
        moving = true;
        xVelocity = maxWidth / 100;
        left = false;
        right = true;
    }
    if (event.code === "KeyM") {
        health = 9999999999
        cheater = true
    }
    if (event.code === "KeyE" && canHeal === true) {
        damage(- ssHealing);
        console.log("healed")
        canHeal = false;
        setTimeout(function(){
            canHeal = true;
        }, ssCooldown);
    };
    if (event.code === "ShiftLeft") {
        if(dashEnabled) {
            if (moving) {
                if (left) {
                    if (xVelocity < 0) {
                        xVelocity -= maxWidth / 37.5;
                        dashEnabled = false;
                        dashActive = true;
                        dashCounter = 0;
                        dashWidth = 0;
                        dashInnerDisplay.style.width = `${1}%`;
                        dashCooldownLoop = setInterval(dashCooldown, 51);
                        setTimeout(function() {
                            dashActive = false;
                        }, 666);
                    }
                }
                if (right) {
                    if (xVelocity > 0) {
                        console.log(xVelocity);
                        xVelocity += maxWidth / 37.5;
                        dashEnabled = false;
                        dashActive = true;
                        dashCounter = 0;
                        dashWidth = 0;
                        dashInnerDisplay.style.width = `${1}%`;
                        dashCooldownLoop = setInterval(dashCooldown, 51);
                        setTimeout(function() {
                            dashActive = false;
                            console.log(xVelocity);
                        }, 666);
                    }
                }
            }
        }
    }
    if (event.code === "Space") {
        if (!jumping) {
            yVelocity -= maxHeight / 20;
            jumping = true;
        }
    }
});

function dashCooldown(){
    dashCounter += 1;
    dashWidth = dashWidth + 1;
    dashInnerDisplay.style.width = `${dashWidth}%`;
    if (dashCounter >= 98){
        dashCounter = 0;
        dashEnabled = true;
        clearInterval(dashCooldownLoop);
    }
}

function damage(amount){
    health -= amount;
    healthDisplay.style.width = `${health/3}%`;
}

function gameOver(){
    gameOverDisplay.style.display = "block";
    gameIsOver = true;
    health = 300;
    nate.x = (board.width - nate.width) / 2;
    nate.y = (board.height - nate.height) / 16;
    player.x = (board.width / 2) - player.width;
    player.y = maxHeight - player.height;
    arms = []
    dashInnerDisplay.style.width = `${"98"}%`;
    healthDisplay.style.width = `${"98"}%`;
    dashEnabled = true;
    clearInterval(dashCooldownLoop);
}
function restart(){
    gameOverDisplay.style.display = "none";
    gameIsOver = false;
}
function begone(){
    window.location.href = "/"
}

let attackCounter = 0;
function nateSpinningProjectileStart(){
    setInterval(function(){
        if (attackCounter <= 4 && gameIsOver === false){
            attackCounter = attackCounter + 1;
            nateSpinningProjectile();
        }
    }, 150);
}
/*-----------------------------------------------
massive chatgpt code here but it works super well
-----------------------------------------------*/
function nateSpinningProjectile() {
    if (gameIsOver){
        return;
    }
    const projectile = {
        x: nate.x + nate.width / 2,
        y: nate.y + nate.height / 2,
        width: maxWidth / 15,
        height: maxWidth / 15,
        angle: 0,
        speed: maxWidth / 100,
        active: true,
    };

    // Calculate direction
    const dx = player.x + player.width / 2 - projectile.x;
    const dy = player.y + player.height / 2 - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    projectile.vx = (dx / distance) * projectile.speed;
    projectile.vy = (dy / distance) * projectile.speed;

    const updateProjectile = setInterval(() => {
        if (!projectile.active) {
            clearInterval(updateProjectile);
            return;
        }

        // Update position
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        // Update angle for spinning
        projectile.angle += 0.1;

        // Check for collision with player
        if (detectCollision(projectile, player)) {
            projectile.active = false;
            damage(20);
            console.log("collided")
            clearInterval(updateProjectile);
            return;
        }

        // Check if projectile is out of bounds
        if (
            projectile.x < 0 ||
            projectile.x > maxWidth ||
            projectile.y < 0 ||
            projectile.y > maxHeight
        ) {
            projectile.active = false;
            clearInterval(updateProjectile);
            return;
        }
    }, 33);

    // Draw the projectile
    function drawProjectile() {
        if (gameIsOver){
            return;
        }
        if (!projectile.active) {
            return;
        }

        context.save();
        context.translate(projectile.x, projectile.y);
        context.rotate(projectile.angle);
        context.drawImage(nateArmImg, -projectile.width / 2, -projectile.height / 2, projectile.width, projectile.height);
        context.restore();

        requestAnimationFrame(drawProjectile);
    }

    drawProjectile();
}


let bullets = [];
let mouseX, mouseY;
let isMouseDown = false;
let shootInterval;

document.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

document.addEventListener("mousedown", function(event) {
    if (event.button === 0) { // Left click
        isMouseDown = true;
        shootInterval = setInterval(shootBullet, 100); // Adjust interval as needed
    }
});

document.addEventListener("mouseup", function(event) {
    if (event.button === 0) { // Left click
        isMouseDown = false;
        clearInterval(shootInterval);
    }
});

function shootBullet() {
    if (!isMouseDown) return;
    
    const bulletSpeed = maxWidth / 25;
    const angle = Math.atan2(mouseY - (player.y + player.height / 2), mouseX - (player.x + player.width / 2));
    const bullet = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: maxWidth / 100,
        height: maxWidth / 100,
        angle: angle,
        speed: bulletSpeed,
        vx: Math.cos(angle) * bulletSpeed,
        vy: Math.sin(angle) * bulletSpeed,
        active: true,
    };
    bullets.push(bullet);
}

function updateBullets() {
    bullets.forEach(bullet => {
        if (bullet.active) {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            // Check if bullet is out of bounds
            if (
                bullet.x < 0 || bullet.x > maxWidth ||
                bullet.y < 0 || bullet.y > maxHeight
            ) {
                bullet.active = false;
            }

            // Check for collision with Nate
            if (detectCollision(bullet, nate)) {
                bullet.active = false;
                nateHealth.totalHP -= weapon.damage;
                console.log("Bullet hit Nate");
                console.log(nateHealth.totalHP);
            }
        }
    });

    // Remove inactive bullets
    bullets = bullets.filter(bullet => bullet.active);
}

function drawGun() {
    const angle = Math.atan2(mouseY - (player.y + player.height / 2), mouseX - (player.x + player.width / 2));
    context.save();
    context.translate(player.x + player.width / 2, player.y + player.height / 2);
    context.rotate(angle);
    context.drawImage(weaponImg, -weaponImg.width / 2, -weaponImg.height / 2, player.width, player.height / 2.6);
    context.restore();
}

function drawBullets() {
    bullets.forEach(bullet => {
        if (bullet.active) {
            context.save();
            context.translate(bullet.x, bullet.y);
            context.rotate(bullet.angle);
            context.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
            context.restore();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    leftButton = document.getElementById("leftButton");
    rightButton = document.getElementById("rightButton");
    dashButton = document.getElementById("dashButton");
    jumpButton = document.getElementById("jumpButton");
    board = document.getElementById("board");

    board.addEventListener("touchstart", function(){
        isMouseDown = true;
        shootInterval = setInterval(shootBullet, 100);
    });

    board.addEventListener("touchend", function() {
        isMouseDown = false;
        learInterval(shootInterval);
    });
    
    leftButton.addEventListener("touchstart", function() {
        moving = true;
        xVelocity = -maxWidth / 100;
        left = true;
        right = false;
    });

    leftButton.addEventListener("touchend", function() {
        if (left){
            moving = false;
        }
    });

    rightButton.addEventListener("touchstart", function() {
        moving = true;
        xVelocity = maxWidth / 100;
        left = false;
        right = true;
    });

    rightButton.addEventListener("touchend", function() {
        if (right){
            moving = false;
        }
    });

    dashButton.addEventListener("touchstart", function() {
        if(dashEnabled) {
            if (moving) {
                if (left) {
                    if (xVelocity < 0) {
                        xVelocity -= maxWidth / 37.5;
                        dashEnabled = false;
                        dashActive = true;
                        dashCounter = 0;
                        dashWidth = 0;
                        dashInnerDisplay.style.width = `${1}%`;
                        dashCooldownLoop = setInterval(dashCooldown, 51);
                        setTimeout(function() {
                            dashActive = false;
                        }, 666);
                    }
                }
                if (right) {
                    if (xVelocity > 0) {
                        console.log(xVelocity);
                        xVelocity += maxWidth / 37.5;
                        dashEnabled = false;
                        dashActive = true;
                        dashCounter = 0;
                        dashWidth = 0;
                        dashInnerDisplay.style.width = `${1}%`;
                        dashCooldownLoop = setInterval(dashCooldown, 51);
                        setTimeout(function() {
                            dashActive = false;
                            console.log(xVelocity);
                        }, 666);
                    }
                }
            }
        }
    });

    jumpButton.addEventListener("touchstart", function() {
        if (!jumping) {
            yVelocity -= maxHeight / 20;
            jumping = true;
        }
    });
});

function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Prevent the default context menu
});