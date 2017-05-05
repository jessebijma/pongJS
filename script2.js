"use strict";
var game = game || {};
var player =  player || {};
var ai = ai || {};
var ball = ball || {};

var keysDown = {};

game.init = function () {
    window.addEventListener("keydown", function(event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];
    });
    
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.w = 400;
    this.h = 600;
    
    player.init();
    ai.init();
    ball.init();
    game.loop();
    console.log(player);
};

game.loop = function () {
    console.log("game loop start");
    //this.ctx.clearRect(0,0,this.w,this.h);
    game.clear();
    player.update();
    player.render();

    console.log("player render");

    ai.update();
    ai.render();

    console.log("ai render");

    ball.update();
    ball.render();
    
    requestAnimationFrame(game.loop);
};

game.clear = function () {
    this.ctx.clearRect(0,0,this.w,this.h);
    console.log("cleared");
};

//----Player en de ball----

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xs = 0;
    this.ys = 0;
}

player.init = function () {
    this.paddle = new Paddle(200, 580, 55, 10);
    this.render();
};

player.render = function () {
    console.log("player render");
    game.ctx.beginPath();
    game.ctx.fillStyle = "#0000FF";
    game.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    game.ctx.closePath();

};

player.update = function () {
    for(var key in keysDown) {
        var value = Number(key);
        if(value == 37) { //Linker pijltjestoets
            this.move(-4, 0);
        } else if (value == 39) { //Rechter pijltjestoets
            this.move(4, 0);
        } else {
            this.move(0, 0);
        }
    }
};

player.move = function (x,y) {
    this.paddle.x += x;
    this.paddle.y += y;
    this.paddle.xs = x;
    this.paddle.ys = y;
    if(this.paddle.x < 0) { //Helemaal links
        this.paddle.x = 0;
        this.paddle.xs = 0;
    } else if (this.paddle.x + this.paddle.width > 400) { //Helemaal rechts
        this.paddle.x = 400 - this.paddle.width;
        this.paddle.xs = 0;
    }
};

ai.init = function () {
    this.paddle = new Paddle(200, 100, 55, 10);
    this.render();
};

ai.render = function () {
    console.log("ai render");
    console.log(this.paddle);
    game.ctx.beginPath();
    game.ctx.fillStyle = "#0000FF";
    game.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    game.ctx.closePath();
    // game.ctx.beginPath();
    // game.ctx.arc(100,75,50,0,2*Math.PI);
    // game.ctx.stroke();
};

ai.update = function () {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if(diff < 0 && diff < -4) { //Snelheid links
        diff = -5;
    } else if(diff > 0 && diff > 4) { //Snelheid rechts
        diff = 5;
    }
  //  this.paddle.move(diff, 0);
    if(this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
        this.paddle.x = 400 - this.paddle.width;
    }
};

// ball
ball.init = function () {
    this.x = 200;
    this.y = 300;
    this.xs = 0;
    this.ys = 3;
    this.r = 5;
    
    ball.render();
    console.log("ball render");
};

ball.render = function () {
    game.ctx.beginPath();
    game.ctx.arc(this.x, this.y, this.r, 2 * Math.PI, false);
    game.ctx.fillStyle = "#000000";
    game.ctx.fill();
    game.ctx.closePath();
};

ball.update = function () {
    this.x += this.xs;
    this.y += this.ys;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if(this.x - 5 < 0) { //Linker muur raken
        this.x = 5;
        this.xs = -this.xs;
    } else if(this.x + 5 > 400) { // Rechter muur  raken
        this.x = 395;
        this.xs = -this.xs;
    }

    if(this.y < 0 || this.y > 600) { //Gescoord
        this.xs = 0;
        this.ys = 3;
        this.x = 200;
        this.y = 400;
    }

    if(top_y > 400) {
        if(top_y < (player.paddle.y + player.paddle.height) && bottom_y > player.paddle.y && top_x < (player.paddle.x + player.paddle.width) && bottom_x > player.paddle.x) {
            //Als de player zijn paddle word geraakt
            this.ys = -2.5;
            this.xs += (player.paddle.xs / 2);
            this.y += this.ys;
        }
    } else {
        if(top_y < (ai.paddle.y + ai.paddle.height) && bottom_y > ai.paddle.y && top_x < (ai.paddle.x + ai.paddle.width) && bottom_x > ai.paddle.x) {
            //Als de AI zijn paddle word geraakt
            this.ys = 2.5;
            this.xs += (ai.paddle.xs / 2);
            this.y += this.ys;
        }
    }
};

game.init();
