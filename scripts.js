var pause = true; // false 
var movement = true;
const timer = 60000;
const delay = 1500;

function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor"); // scenary
    const playerElement = document.getElementById("iPlayer"); // player
    const countCarElement = document.getElementById("iCountCar");

    const startBtnElement = document.getElementById("iStartBtn");


    const scenary = new Scenary(scenaryElement, delay, timer); // cenary element, velocity
    const player = new Player(playerElement, 3, {'L': 118, 'R': 332}); // (elemento Playe, velocidade car, parede esqueda e direita em objeto)
    const bar = new CountBar(countCarElement, delay, timer); // elemento carro,  velMesmo do Scenary, duração 

    
    // startBtnElement.style.display = "none";
    scenary.animate();
    bar.bar();

    // player.move();

    if(pause) {
        player.move();
    }
}


function stopp() {
    
}

class Scenary {
    constructor(scenary, vel, time) {
        this.scenary = scenary;
        this.vel = vel;
        this.time = time;
    }

    speed() {
        this.vel -= 500;
    }

    breake() {
        this.vel +=500;
    }

    animate() {

        /* if(pause)
            pause = false;
        else 
            pause = true; // pause TOTAL
 */

        const keyframes = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(100%)' }
        ];

        const options = {
            duration: this.vel,
            iterationCount: "infinite",
        };

        /* const repeat = () => {
            this.scenary.forEach(element => {
                const animation = element.animate(keyframes, options);
                animation.play();
            });
        }

        const repeatScenary= setInterval(repeat, this.vel) */

        var repeatScenary;

        const repeat = () => {
            this.scenary.forEach(element => {
                if(!pause) {
                        clearInterval(repeatScenary);
                    console.log(pause)
                } else {
                    const newAnimation = element.animate(keyframes, options);
                    newAnimation.play();
                }
            })
        }

        repeatScenary = setInterval(repeat, this.vel)

        setTimeout(() => {
            clearInterval(repeatScenary);
            pause = false;
        }, this.time)
    }
}


class Player {
    constructor(player, vel, wall) {
        this.player = player;
        this.vel = vel;
        this.wall = wall
    }

    move() {
        /* 
            parede esquerda: 118px
            parede direita: 332px
        */
        moveLR(this.player, this.vel, this.wall);

        function moveLR(player, vel, wall) {        
                var playerPosition = parseFloat(getComputedStyle(player).getPropertyValue("left"));
                var isMovL = false;
                var isMovR = false;


                function movePlayer(direction) {
                        if(direction === "L" && player.offsetLeft > wall.L /* && pause */) 
                            playerPosition -= vel;
                        else if(direction === "R" && player.offsetLeft < wall.R /* && pause */) 
                            playerPosition += vel;

                    player.style.left = playerPosition + "px";
                    
                    // console.log("Player p: ", player.offsetLeft, "Direction: ", direction, "Veloci: ", vel, "wall RL: ", wall, "pause: ", pause);
                }
        
                /* function movePlayLeft() {
                    playerPosition -= vel;
                    player.style.left = playerPosition + "px";
                    console.log(player.offsetLeft);
                }

                function movePlayRight() {
                    playerPosition += vel;
                    player.style.left = playerPosition + "px";
                    console.log(player.offsetLeft);
                } */


        
                /* document.addEventListener("keydown", (event) => {
                    if(event.key === "ArrowLeft") 
                        isMovL = true;
                    
                    if(event.key === "ArrowRight")
                        isMovR = true;
                })
        
                document.addEventListener("keyup", (event) => {
                    if(event.key === "ArrowLeft") {
                        isMovL = false;
                    }
                    if(event.key === "ArrowRight") 
                        isMovR = false;
                });
                
                if(pause){ 
                    removeEventListener("keydown");
                    removeEventListener("keyup");
                } */

                const keyDownHandler = (event) => {
                    if(event.key === "ArrowLeft") 
                        isMovL = true;
                    
                    if(event.key === "ArrowRight")
                        isMovR = true;
                };

                const keyUpHandler = (event) => {
                    if(event.key === "ArrowLeft") {
                        isMovL = false;
                    }
                    if(event.key === "ArrowRight") 
                        isMovR = false;
                };

               
                document.addEventListener("keydown", keyDownHandler);
                document.addEventListener("keyup", keyUpHandler);

                function loop() {
                    // if(isMovR)
                    //     movePlayRight();
                    // if(isMovL)
                    //     movePlayLeft();

                    if(pause) {
                        if(isMovL) 
                            movePlayer("L");
                        if(isMovR)
                            movePlayer("R");
                    }

                    requestAnimationFrame(loop);
                }
                loop();
        }       
    }
}

class CountBar {
    constructor(car, count, duration) {
        this.car = car;
        this.count = count;
        this.duration = duration;
    }

    bar() {
        const positionCar = parseFloat(getComputedStyle(this.car).getPropertyValue("bottom"));

        const keyframes = [ 
            {transform: 'translateY(0)',},
            {transform: 'translateY(-580px)'}
        ];

        const options = {
            duration: this.duration,
            fill: 'forwards'
        };

        const animation = () => {
            this.car.animate(keyframes, options); 
            animation.play();
        }

        setTimeout(animation, this.count)

    }
}
