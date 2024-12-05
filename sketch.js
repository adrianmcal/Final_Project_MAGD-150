let score = 0;
let combo = 0;
let pegsHit = 49;
let ballNum = 10;
let pegs;
let ball;
let ballBucket;
let ballInPlay = false;
let gameStarted = false;
let doug;
let dougMood = "fine";
let gameOver = false;
let gameWon = false;

function preload() {
  handPos1 = loadImage("dougsHand.png");
  handPos2 = loadImage("dougsHand2.png");
  scenery = loadImage("mountains.png");
  normalDoug = loadImage("dougNormal.png");
  excitedDoug = loadImage("dougExcited.png");
  manicDoug = loadImage("dougManic.png");
  sadDoug = loadImage("dougSad.png");
  jackson = loadImage("hungryJack.png");
  zenDoug1 = loadImage("dougZen.png");
  zenDoug2 = loadImage("dougZen2.png");
  zenDoug3 = loadImage("dougZen3.png");
}

function setup() {
  createCanvas(800, 600);

  startButton = new Sprite(400, 350, 240, 60);
  startButton.text = "NEW GAME";
  startButton.collider = "static";
  startButton.fill = 200;
  startButton.textSize = 40;

  world.gravity.y = 10;

  doug = new Sprite();
  doug.x = 696;
  doug.y = 104;
  doug.scale = 1.25;
  doug.diameter = 150;
  doug.collider = "none";

  dougsLeftEye = new Sprite(665, 88, 35, "static");
  dougsLeftEye.shape = "chain";
  dougsLeftEye.strokeWeight = 2;
  dougsLeftEye.color = "black";

  dougsRightEye = new Sprite(718, 88, 35, "static");
  dougsRightEye.shape = "chain";
  dougsRightEye.strokeWeight = 2;
  dougsRightEye.color = "black";

  dougsLeftPupil = new Sprite(665, 88, 8);
  dougsLeftPupil.fill = "black";

  dougsRightPupil = new Sprite(718, 88, 8);
  dougsRightPupil.fill = "black";

  pegs = new Group();
  pegs.diameter = 25;
  pegs.color = "orange";
  pegs.collider = "static";
  pegs.x = (i) => (i % 10) * 60 + 125 + (floor(i / 10) % 2 === 0 ? 20 : -20);
  pegs.y = (i) => ceil(i / 10 + 0.001) * 50 + 200;
  //pegs.text = (i => i)
  pegs.amount = 50;
  for (i = 0; i < 3; i++) {
    barrierLeft = new Sprite(25, 275 + 75 * i, 15, 100, "static");
    barrierLeft.rotation = 120;
    barrierLeft.color = "brown";
  }
  for (i = 0; i < 3; i++) {
    barrierRight = new Sprite(775, 275 + 75 * i, 15, 100, "static");
    barrierRight.rotation = 60;
    barrierRight.color = "brown";
  }

  ballEater = new Sprite();
  ballEater.image = jackson;
  ballEater.collider = "none";

  ballWall1 = new Sprite();
  ballWall1.collider = "k";
  ballWall1.visible = false;

  ballWall2 = new Sprite();
  ballWall2.collider = "k";
  ballWall2.visible = false;

  ballBucket = new Sprite(500, 550, 100, 20, "k");
  ballBucket.visible = false;
  bucketMovement();

  cannon = new Sprite(400, 80, 15, 60, "none");

  cannon.image = handPos1;

  boundaries = new Sprite(400, 300, 801, 1000, "s");
  boundaries.shape = "chain";

  abyss = new Sprite(400, 700, 810, 10, "s");
}

function draw() {
  if (startButton.mouse.hovering()) {
    mouse.cursor = "grab";
    startButton.color = "lime";
  } else {
    mouse.cursor = ARROW;
    startButton.color = "lightgrey";
  }

  if (startButton.mouse.released()) {
    opening();
  }
  if (gameStarted == true) {
    allSprites.visible = true;
    ballBucket.visible = false;
    ballWall1.visible = false;
    ballWall2.visible = false;
    startButton.remove();
    dougsFace();
    image(scenery, 0, 0);
    stroke(0);
    strokeWeight(4);
    fill(255);
    textSize(25);
    text("SCORE:" + score, 50, 50);
    text("BALLS LEFT:" + ballNum, 605, 225);
    strokeWeight(2);
    if (dougMood == "excited") {
      stroke(0);
      strokeWeight(4);
      fill(255);
      fill(255, 130, 190);
      textSize(70);
      text("FREE BALL!!!", 150, 200);

      strokeWeight(2);
    }
    if (mouse.released()) {
      cannon.image = handPos1;
    }

    if (mouse.pressing()) {
      cannon.image = handPos2;
    }
    if (ballInPlay == false) {
      combo = 0;
      fill("cadetblue");
      if (ballNum > 0) {
        circle(400, 80, 18);
      }
      dougsLeftPupil.moveTowards(mouse, 0.01);
      dougsRightPupil.moveTowards(mouse, 0.01);
      if (mouse.presses()) {
        if (ballNum > 0) {
          ball = new Sprite(400, 80, 18);
          ball.sleeping = false;
          ball.bounciness = 0.65;
          ball.moveTowards(mouse, 0.075);
          ball.speed = 12;
          ball.color = "cadetblue";
          ballNum -= 1;
          ballInPlay = true;
        }
      }
    } else {
      dougsLeftPupil.moveTowards(ball.x, ball.y, 0.01);
      dougsRightPupil.moveTowards(ball.x, ball.y, 0.01);
    }
    if (ball) {
      ball.collides(pegs, collect);
    }
    if (ball) {
      if (ball.collides(abyss)) {
        ball.remove();
        ballInPlay = false;
        if (ballNum == 0) {
          dougMood = "depressed";
        } else if (combo == 0) {
          dougMood = "sad";
        }
      }
      if (ball) {
        if (ball.collides(ballBucket)) {
          ball.remove();
          ballInPlay = false;
          ballNum += 1;
          if (combo == 1) {
            score += 10000;
          } else if (combo > 1) {
            score += 5000;
          }
          dougMood = "excited";
        }
      }
    }
    cannon.rotateTowards(mouse, 0.5, 180);
    //cannon.debug = true
    cannon.offset.x = 40;

    ballEater.x = ballBucket.x - 10;
    ballEater.y = ballBucket.y - 25;

    ballWall1.scale = 0.75;
    ballWall1.x = ballBucket.x - 68;
    ballWall1.y = ballBucket.y - 10;

    ballWall2.scale = 0.75;
    ballWall2.x = ballBucket.x + 68;
    ballWall2.y = ballBucket.y + 5;
  } else {
    allSprites.visible = false;
    startButton.visible = true;
  }

  function collect(ball, peg) {
    dyingPeg = new Sprite();
    dyingPeg.x = peg.x;
    dyingPeg.y = peg.y;
    dyingPeg.collider = "static";
    dyingPeg.diameter = 22;
    dyingPeg.shape = "circle";
    dyingPeg.color = "orangered";
    dyingPeg.life = 120;
    peg.remove();
    combo += 1;
    score += combo * combo * 10;
    pegsHit += 1;
    //print(score);
  }
  if (pegsHit > 49) {
    dougMood = "manic";
  }
  if (gameOver == true) {
    background(0);
    textSize(50);
    text("GAME OVER", 250, 300);
  }
  if (gameWon == true) {
  background(0);
  textSize(50);
  text("YOU WIN", 250, 300);
}

}

async function bucketMovement() {
  await ballBucket.moveTo(725, 550, 5);
  await delay(100);
  await ballBucket.moveTo(75, 550, 5);
  await delay(100);
  bucketMovement();
}

async function dougsFace() {
  if (dougMood == "fine") {
    doug.image = normalDoug;
  } else if (dougMood == "excited") {
    doug.image = excitedDoug;
    await delay(3500);
    dougMood = "fine";
  } else if (dougMood == "sad") {
    doug.image = sadDoug;
    await delay(3500);
    dougMood = "fine";
  } else if (dougMood == "depressed") {
    doug.image = sadDoug;
    await delay(2000);
    gameStarted = false;
    gameOver = true;
    allSprites.remove();
  } else if (dougMood == "manic") {
    doug.image = manicDoug;
    await delay(2000);
    gameStarted = false;
    gameWon = true;
    allSprites.remove();
  }
}

async function opening() {
  startButton.remove();
  image(zenDoug1, 0, 0);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1500);
  image(zenDoug1, 0, 0);
  await delay(350);
  image(zenDoug2, 0, 0);
  await delay(350);
  image(zenDoug1, 0, 0);
  await delay(350);
  image(zenDoug2, 0, 0);
  await delay(1500);
  textSize(25);
  text("Hello", 250, 150);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1000);
  text("You're here for DougBall™?", 200, 150);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1000);
  text("Then you're in the right place", 200, 150);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1000);
  text("It's a simple game:", 150, 150);
  text("You have 10 balls", 150, 175);
  text("Hit 50 pegs to win", 150, 200);
  await delay(7000);
  image(zenDoug2, 0, 0);
  await delay(2500);
  text("Oh and one more thing", 200, 150);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1000);
  text("Hungry Jack will reward you for feeding him", 200, 150);
  await delay(3500);
  image(zenDoug2, 0, 0);
  await delay(1000);
  text("I'll be watching", 200, 150);
  await delay(3500);
  gameStarted = true;
}
