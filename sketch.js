//Create variables here

var dog,dogHappy,database,foodS,foodStock;
var dogImage,milkBottle;
var lastFed,fedTime;
var foodObj;
var button1,button2;
var fed=0;
var readstate,gameState;


function preload()
{
    //load images here
    dogImage=loadImage("images/dogImg.png");
    dogHappy=loadImage("images/happy dog.png");
    milkBottle=loadImage("images/Milk.png");
    bedroom=loadImage("images/Bed Room.png");
    garden=loadImage("images/Garden.png");
    washroom=loadImage("images/Wash Room.png");
    
}

function setup() {
    createCanvas(1050, 700);
    dog=createSprite(800,250);
    dog.addImage(dogImage);
    dog.scale=0.2;
  
    database=firebase.database();    
    foodStock=database.ref("Food");
    foodStock.on("value",readStock);
    

    foodObj = new Food();
     button1= createButton("Feed the Dog");
    button1.position(450,50);
    button1.mousePressed(feedDog);
     button2 = createButton("Add Food");
    button2.position(600,50);
    button2.mousePressed(addStock);

    readstate=database.ref('gameState');
    readstate.on("value",function(data){
        gameState=data.val();
    })
}


function draw() {  
    background(46,139,87);

   
    feedTime=database.ref('FeedTime')
    feedTime.on("value",function(data){
        lastFed=data.val();
    });
    textSize(18)
    fill("black");
    if(lastFed>=12){
        text("Last Fed Time  : "+lastFed%12+" PM",350,30);
    }else  if(lastFed==0){
        text("Last Feed :  12 AM",350,30);
    }else{
        text("Last Feed:  "+lastFed+" AM",350,30);
    }
    if(fed===1){
    foodObj.showBottle();
    }
    if(gameState!="Hungry"){
        button1.hide();
        button2.hide();
        dog.visible=false;
    }
    else{
        button1.show();
        button2.show();
        dog.visible=true;
        dog.addImage(dogImage);
    }

    current_time=hour();
    if(current_time===(lastFed+1)){
        update("Playing");
        foodObj.garden();
    }else if(current_time===(lastFed+2)){
        update("Sleeping");
        foodObj.bedroom();
    }else if(current_time>(lastFed+2) && current_time<=(lastFed+4)){
        update("Bathing");
        foodObj.washroom();
    }else{
        update("Hungry");
        foodObj.display();
    }
    
  drawSprites();
  //add styles here
  


}

function readStock(data){
    foodS=data.val();
    

}

function feedDog(){
    if(foodS!==0){
        console.log("hello")
    dog.addImage(dogHappy); 
     
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    fed=1;

    }
   

}

function writeStock(x){

    if(x<=0){
        x=0;
    }else{
        x=x-1
    }

    database.ref("/").update({
        Food:x
    })

}

function addStock(){
    
    
    foodS++;
    database.ref('/').update({
        Food:foodS
    }) 
    fed=0;

}

function update(state){
    database.ref('/').update({
        gameState:state
    })
}



