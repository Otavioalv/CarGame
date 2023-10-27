var pause = true; // false 
var movement = true;
const timer = 60000;
const delay = 1500;

function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor"); // scenary
    const playerElement = document.getElementById("iPlayer"); // player
    const countCarElement = document.getElementById("iCountCar");
    const enemiesElement = document.querySelector(".enemies");

    const startBtnElement = document.getElementById("iStartBtn");


    const scenary = new Scenary(scenaryElement, delay, timer); // cenary element, velocity
    const player = new Player(playerElement, 3, {'L': 118, 'R': 332}); // (elemento Playe, velocidade car, parede esqueda e direita em objeto)
    const bar = new CountBar(countCarElement, delay, timer); // elemento carro,  velMesmo do Scenary, duração 
    const enemies = new Enemies(enemiesElement, delay);
    // startBtnElement.style.display = "none";
    scenary.animate();
    bar.bar();

    // player.move();

    if(pause) {
        player.move();
    }

    enemies.spawnEnemis();
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


        const keyframes = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(100%)' }
        ];

        const options = {
            duration: this.vel,
            iterationCount: "infinite",
        };

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
        }, this.time + 1300)
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
        }

        setTimeout(animation, this.count)

    }
}

class Enemies {
    constructor(enemiesBG, cont) {
        this.enemiesBG = enemiesBG;
        this.cont = cont;
        this.test = [true, true, true, true, true];
    }

    moveEnemie(enemie) {

        const keyframes = [
            {transform: `translateY(0)`},
            {transform: `translateY(900px)`} // 8030px
        ];

        const options = {
            duration: this.cont,
            fill: "forwards"
        }

        const animation = () => {
            enemie.animate(keyframes, options); // tese
        }

        setTimeout(animation, 500);
    }

    spawnEnemis() {
        // timeout : repete uma vez
        // interval: repete com intervalod
        


        var randomTimer = Math.floor(Math.random() * (2000 - 1000 + 1) + 100);
        // var randomCar = Math.floor(Math.random() * (4 - 0 + 1));
        var randomCar;

        // this.test[randomCar] = false;

        
        
        let tentativas = 0;
        const limiteTentativas = 1000; // Define um limite máximo de tentativas



        do {    
            randomCar = Math.floor(Math.random() * (4 - 0 + 1));
            console.log(this.test[randomCar], randomCar);

            // tentativas++;
            // if (tentativas >= limiteTentativas) {
            //     // Saia do loop se o limite máximo de tentativas for atingido
            //     break;
            // }
        } while(!this.test[randomCar])
 
        test2(this.test, randomCar, this.cont);
        console.log(randomCar, randomTimer);
        console.log(this.test);

        

        function test2(test, b, timer) {
            if(test[b]) {
                test[b] = false

                setTimeout(() => {
                    test[b] = true;
                }, 500 + timer);
            } 
        } 
    


        setTimeout(() => {
            // this.enemiesBG.innerHTML += `<img class="enemieCar" src="./sprites//spriteEnemy.png" alt="enemie">`
            
            const enemies = this.enemiesBG.querySelectorAll("img"); 
            // const lastEnemie = enemies[enemies.length - 1];
            // console.log(lastEnemie);
            
            this.moveEnemie(enemies[randomCar]);

            if(pause)
                this.spawnEnemis();
        }, randomTimer);

        //const wid = getComputedStyle(this.enemiesBG).getPropertyValue("width");
        // console.log(wid);
    }
}
