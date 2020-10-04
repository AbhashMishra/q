var PLAY = 1;
var END = 0;
var gameState = PLAY;
var background4;
var round;
var planet;
var mount3;

var rocket;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstacle

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
  mount3 = loadImage("planet.png");
  round = loadImage("GROUND.png");
  background4 = loadImage("th.png");
  rocket = loadImage("spaceship.png");

  obstacle = loadImage("planet2.png");
  
  restartImg = loadImage("reset.png");
  gameOverImg = loadImage("gameover2.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  BG = createSprite(width/2,height-380);
  BG.addImage(background4);
  BG.scale = 5;
  BG.velocityX = -5;
  BG.x = width/2;

  var message = "This is a message";
  console.log(message)
  
  rocket1 = createSprite(100,200,width,50);
  rocket1.addImage(rocket);
  

  rocket1.scale = 0.3;
  
  ground = createSprite(width/2,1400,width,125);
  ground.scale = 4.5;
  ground.addImage(round);
  ground.x = width/2;
  
  gameOver = createSprite(755,height-480);
  //320
  gameOver.scale = 0.3;
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(750,height-395);
  restart.scale = 0.7;
  restart.addImage(restartImg); 
  
  invisibleGround = createSprite(width/2,height-250,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups            
  aliensGroup = createGroup();
  MTGroup = createGroup();

  
  rocket1.setCollider("rectangle",0,0,rocket1.width,rocket1.height);
  //trex.debug = true
  
  score = 0;

}

function draw() {  
  background(180);
  if (BG.x < 0){
      BG.x = BG.width/2;
  }
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3 * score/100);
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
       checkPointSound.play() 
    }
    
    //scoring
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space")&& rocket1.y >= 100) {
        rocket1.velocityY = -12; 
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    rocket1.velocityY = rocket1.velocityY + 0.8;
  
    //spawn obstacles on the ground
    spawnAlien();
    Mount();
    
    if(aliensGroup.isTouching(rocket1)||MTGroup.isTouching(rocket1)){
        //trex.velocityY = -12;    
        jumpSound.play();
        gameState = END;
        dieSound.play();
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
          
      ground.velocityX = 0;
      rocket1.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    aliensGroup.setLifetimeEach(-1);
    MTGroup.setLifetimeEach(-1);
     
    aliensGroup.setVelocityXEach(0);
    MTGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
        reset();
     }

   }
  
 
  //stop trex from falling down
  rocket1.collide(invisibleGround);
  drawSprites();
  //plan = createSprite(350,200);
  //plan.scale = 0.2;
  //plan.addImage(planet);
  //displaying score
  
  fill("white");
  textSize(19);
  text("T H E   I N F I N I T E   R O C K E T   I N   G A L A X Y",520,252);
  
  fill("white");
  stroke("white");
  strokeWeight(5);
  textSize(79);
  text("G  A  L  A  X  Y",480,220);

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  aliensGroup.destroyEach();
  MTGroup.destroyEach();
  rocket1.changeAnimation(rocket);
  score = 0;
}

function Mount(){
 if (frameCount % 120 === 0){
   var MT = createSprite(1900,height-300,width,125);
   MT.addImage(mount3);
   MT.velocityX = -(6 + score/100);
   MT.scale = 0.3;
   MT.setCollider("circle",1,7,120);
   MT.debug = false;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
   
    rocket1.depth = MT.depth + 1;
   
    //assign scale and lifetime to the obstacle           
    MT.scale = 0.6;
    MT.lifetime = 800;
   
   //add each obstacle to the group
    MTGroup.add(MT);
 }
}

function spawnAlien(){
 if (frameCount % 250 === 0){
   var alien = createSprite(1900,height-250,width,125);
   alien.addImage(obstacle);
   alien.velocityX = -(6 + score/100);
   alien.setCollider("circle",1,7,298);
   alien.debug = true;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
   
    rocket1.depth = alien.depth + 1;
   
    //assign scale and lifetime to the obstacle
    alien.scale = 0.2;
    alien.lifetime = 800;
   
   //add each obstacle to the group
    aliensGroup.add(alien);
 }
}