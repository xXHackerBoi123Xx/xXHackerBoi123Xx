function openMeny(){
    document.getElementById("meny").style.width="20.5%";
}
function lukkMeny(){
    document.getElementById("meny").style.width="0%";
}
//konstruerer canvaset som en variabel
// er en betingelse til canvaset
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

let tapLyd = new Audio();
let seierLyd = new Audio();

seierLyd.src = "lyd/usSang.mp3";
tapLyd.src = "lyd/lydTap.wav";

let q =0;

function lett(){
    q = 50;
}

function vanskelig(){
    q = 101;
}



function start(){
    
        // Objekt med informasjon om raketten
        const ball = {
            x : canvas.width/2,
            y : canvas.height/2,
            radius : 10,
            hastighetX : 5,
            hastighetY : 5,
            speed : 5,
            farge : "WHITE"
        }

        // objekt med informasjon om brukerens racket
        const bruker = {
            x : 0, // left side of canvas
            y : (canvas.height - 100)/2, // -100 the height of paddle
            width : 10,
            height : 100,
            score : 0,
            farge : "BLUE"
        }
    
        // objekt med informasjon om maskinens racket
        const maskin = {
        x : canvas.width - 10, // - width of paddle
        y : (canvas.height - 100)/2, // -100 the height of paddle
        width : 10,
        height : q,
        score : 0,
        farge : "RED"
        }

        // draw a rectangle, will be used to draw paddles
        function tegnRekt(x, y, w, h, farge){
            ctx.fillStyle = farge;
            ctx.fillRect(x, y, w, h);
        }


        // listening to the mouse
        canvas.addEventListener("mousemove", musPos);

        function musPos(evt){
            let rekt = canvas.getBoundingClientRect();

            bruker.y = evt.clientY - rekt.top - bruker.height/2;
        }

        // when COM or USER scores, we reset the ball
        function nullstillRakett(){
            ball.x = canvas.width/2;
            ball.y = canvas.height/2;
            ball.hastighetX = -ball.hastighetX;
            ball.speed = 7;
        }



        // draw text
        function tegnTekst(text,x,y){
            ctx.fillStyle = "BLACK";
            ctx.font = "75px fantasy";
            ctx.fillText(text, x, y);
        }


        // collision detection
        function collision(b,p){
            p.top = p.y;
            p.bottom = p.y + p.height;
            p.left = p.x;
            p.right = p.x + p.width;

            b.top = b.y - b.radius;
            b.bottom = b.y + b.radius;
            b.left = b.x - b.radius;
            b.right = b.x + b.radius;

            return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
        }

        // update function, the function that does all calculations
        function update(){

                // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
                if( ball.x - ball.radius < 0 ){
                    maskin.score++;
                    nullstillRakett();
                }else if( ball.x + ball.radius > canvas.width){
                    bruker.score++;
                    nullstillRakett();
                }

                // the ball has a velocity
                ball.x += ball.hastighetX;
                ball.y += ball.hastighetY;

                // computer plays for itself, and we must be able to beat it
                // simple AI
                maskin.y += ((ball.y - (maskin.y + maskin.height/2)))*0.1;

                // when the ball collides with bottom and top walls we inverse the y velocity.
                if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
                    ball.hastighetY = -ball.hastighetY;
                }

                // we check if the paddle hit the user or the com paddle
                let spiller = (ball.x + ball.radius < canvas.width/2) ? bruker : maskin;

                // if the ball hits a paddle
                if(collision(ball,spiller)){

                    // we check where the ball hits the paddle
                    let collidePoint = (ball.y - (spiller.y + spiller.height/2));
                    // normalize the value of collidePoint, we need to get numbers between -1 and 1.
                    // -player.height/2 < collide Point < player.height/2
                    collidePoint = collidePoint / (spiller.height/2);

                    // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
                    // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
                    // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
                    // Math.PI/4 = 45degrees
                    let angleRad = (Math.PI/4) * collidePoint;

                    // change the X and Y velocity direction
                    let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
                    ball.hastighetX = direction * ball.speed * Math.cos(angleRad);
                    ball.hastighetY = ball.speed * Math.sin(angleRad);

                    // speed up the ball everytime a paddle hits it.
                    ball.speed += 1;
                }
        }

        // render function, the function that does al the drawing
        function render(){

            // clear the canvas
            tegnRekt(0, 0, canvas.width, canvas.height, "#000");

            var imgTo = document.getElementById("trumpKim");
                ctx.drawImage(imgTo, 0,0,600,450);

            // draw the user score to the left
            tegnTekst(bruker.score,canvas.width/4,canvas.height/5);

            // draw the COM score to the right
            tegnTekst(maskin.score,3*canvas.width/4,canvas.height/5);



            // draw the user's paddle
            tegnRekt(bruker.x, bruker.y, bruker.width, bruker.height, bruker.farge);

            // draw the COM's paddle
            tegnRekt(maskin.x, maskin.y, maskin.width, maskin.height, maskin.farge);

            /* draw the ball
            drawArc(ball.x, ball.y, ball.radius, ball.color);*/

            var img = document.getElementById("nuke");
                ctx.drawImage(img,ball.x-40,ball.y-30,50,30);


        }
        function spill(){
            if (maskin.score ===1 || bruker.score ===1){
                if (maskin.score === 1){

                    document.getElementById("tap").style.visibility ="visible";
                    document.getElementById("seierKim").style.visibility ="visible";

                    tapLyd.play();
                    let svarE = document.getElementById("svar");
                    svarE.style.farge = "RED";
                    svarE.innerHTML="Du tapte :(";


                } else{
                    document.getElementById("seier").style.visibility ="visible";
                    document.getElementById("seierTrump").style.visibility="visible";
                    let svarE = document.getElementById("svar");
                    svarE.style.farge = "BLUE";
                    svarE.innerHTML="Du vant! :)";
                    seierLyd.play();
                }
            } else {
                update(); 
                render();
            }


        }
        // number of frames per second
        let framePerSecond = 50;

        //call the game function 50 times every 1 Sec
        let loop = setInterval(spill,1000/framePerSecond);
}