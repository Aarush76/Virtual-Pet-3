var dog, dogImg, happyDog, sadDog, foodS, database, foodStock;
var feedTime, foodObj, feedButton, addFoodButton;
var lastFed, gameState, readState, updateState; // why creating 2 same variables, computer will get confused
var bedroomImg, washroomImg, gardenImg;
var currentTime;

function preload(){
//error - images folder is not there
  dogImg = loadImage("dogImg.png")
  happyDog = loadImage("dogImg1.png")
  sadDog = loadImage("Lazy.png")

  bedroomImg = loadImage("Bedroom.png")
  washroomImg = loadImage("Washroom.png")
  gardenImg = loadImage("Garden.png")
}

function setup() {
  database = firebase.database()
  createCanvas(800, 650);

  foodObj = new Food();
  //it should be Food(), not Food, this will not create the object
  
  dog = createSprite(650,350,20,20)
  dog.addImage(dogImg)
  dog.scale = 0.25

  //lastFed = hour();

  feedButton = createButton("Feed the Dog")
  feedButton.position(500,95)
  feedButton.mousePressed(feedDog)

  addFoodButton = createButton("Add Food")
  addFoodButton.position(600,95)
  addFoodButton.mousePressed(addFood)

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val()
  })
}

function draw() {  
  background('#0678BE') ;
  
  //foodObj.display();

  feedTime = database.ref('feedTime')
  feedTime.on("value", function(data){
    feedTime = data.val()
  })
  
  drawSprites();

  fill("red")
  textSize(30)
  if(lastFed >= 12){
    text("Last Fed: " + lastFed%12 + "PM", 60,550)
  } else if(lastFed == 0){
    text("Last Fed: 12 AM", 60, 550)
  } else{
    text("Last Fed: " + lastFed + "AM", 60,550)
  }
 
  currentTime = hour();
  //console.log(currentTime)

  if(currentTime == (lastFed)){
    update("Playing");
    foodObj.garden();
  } else if(currentTime == (lastFed +2)){
    update("Sleeping");
    foodObj.bedroom();
  } else if(currentTime > (lastFed +2) && currentTime <= (lastFed +4)){
    update("Bathing");
    foodObj.washroom();
  } else{
    update("Hungry");
    dog.addImage(sadDog);
    foodObj.display();
  }

  if(gameState != "Hungry"){
    feedButton.hide();
    addFoodButton.hide();
    dog.remove();
  }else{
    feedButton.show();
    addFoodButton.show();
    //dog.addImage(dogImg);
  }

 

  console.log(gameState)
}

function feedDog(){
   dog.addImage(happyDog);
   
   lastFed = hour()
   foodObj.updateStock(foodObj.getStock() - 1);
   database.ref('/').update({
     food:getStock(),
     lastFed: hour()
   })
   dog.addImage(happyDog);
   lastFed = hour()
  }

function addFood(){
  foodStock++
  database.ref('/').update({
    food:foodStock
  })
}

function checkTime(){
  database.ref('/').update({
    lastFed: feedTime
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })
}