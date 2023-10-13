function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor"); // scenary
    const playerElement = document.getElementById("iPlayer");

    const scenary = new Scenary(scenaryElement, 1000);
    const player = new Player(playerElement, 3, {'L': 118, 'R': 332}); // (elemento Playe, velocidade car, parede esqueda e direita em objeto)

    
    scenary.breake();
    scenary.animate();

    player.move();
}

class Scenary {
    constructor(scenary, vel) {
        this.scenary = scenary;
        this.vel = vel;
    }

    speed() {
        this.vel -= 500;
    }

    breake() {
        this.vel +=500;
    }

    animate() {
        const keyframes = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(100%)' }
        ];

        const options = {
            duration: this.vel,
            iterationCount: "infinite",
        };

        const repeat = () => {
            this.scenary.forEach(element => {
                const animation = element.animate(keyframes, options);
                animation.play();
            });
        }

        const repeatScenary= setInterval(repeat, this.vel);

        setTimeout(() => {
            clearInterval(repeatScenary);
        }, 60000)
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
            parede direita: 322px
        */
        moveLR(this.player, this.vel, this.wall);

        function moveLR(player, vel, wall) {        
                var playerPosition = parseFloat(getComputedStyle(player).getPropertyValue("left"));
                var isMovL = false;
                var isMovR = false;


                function movePlayer(direction) {
                        if(direction === "L" && player.offsetLeft > wall.L) 
                            playerPosition -= vel;
                        else if(direction === "R" && player.offsetLeft < wall.R) 
                            playerPosition += vel;

                    player.style.left = playerPosition + "px";
                    
                    //console.log("Player p: ", player.offsetLeft, "Direction: ", direction, "Veloci: ", vel, "wall RL: ", wall);
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
        
                document.addEventListener("keydown", (event) => {
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
        
                function loop() {
                    // if(isMovR)
                    //     movePlayRight();
                    // if(isMovL)
                    //     movePlayLeft();

                    if(isMovL) 
                        movePlayer("L");
                    if(isMovR)
                        movePlayer("R");

                    requestAnimationFrame(loop);
                }
                loop();
        }       
    }
}

