var pause = true; // false 
var movement = true;
var finished = false;
const timer = 60000;
const delay = 1500;

function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor"); // scenary
    const playerElement = document.getElementById("iPlayer"); // player
    const countCarElement = document.getElementById("iCountCar");
    const enemiesElement = document.querySelector(".enemies");
    const startMenuElement = document.getElementById("Imenu");
    const fuelBarElement = document.getElementById("iFuel-bar");
    const speedometerElement = document.getElementById("iSpeedometer");
    const personPlayer = document.getElementById("iPlayerPersonSprite");



    const scenary = new Scenary(scenaryElement, delay, timer); // cenary element, velocity
    const player = new Player(playerElement, 3, {'L': 118, 'R': 332}, timer, fuelBarElement, speedometerElement, delay, personPlayer); // (elemento Playe, velocidade car, parede esqueda e direita em objeto)
    const bar = new CountBar(countCarElement, delay, timer); // elemento carro,  velMesmo do Scenary, duração 
    const menu = new Menu(startMenuElement);
    const enemies = new Enemies(enemiesElement, delay, timer, menu); 
    const collision = new Collision(playerElement, enemiesElement, menu);

    menu.displayNone();
    
    scenary.animate();
    bar.bar();

    // player.move();-

    if(pause) {
        player.move();
    }

    
    setTimeout(() => {
        enemies.spawnEnemis();
    }, delay);
    // enemies.spawnEnemis();

    collision.collisionDetection();
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
    constructor(player, vel, wall, timer, fuel, speedometer, delay, persoPlayer) {
        this.player = player;
        this.vel = vel;
        this.wall = wall;
        this.timer = timer;
        this.fuel = fuel;
        this.speedometer = speedometer;
        this.delay = delay;
        this.persoPlayer = persoPlayer;
    }

    move() {
        /* 
            parede esquerda: 118px
            parede direita: 332px
        */

        this.fuelBar();

        moveLR(this.player, this.vel, this.wall, this.persoPlayer);

        function moveLR(player, vel, wall, personPlayer) {        
                var playerPosition = parseFloat(getComputedStyle(player).getPropertyValue("left"));
                var isMovL = false;
                var isMovR = false;


                function movePlayer(direction) {
                        if(direction === "L" && player.offsetLeft > wall.L /* && pause */) { 
                            playerPosition -= vel;
                            // personPlayer.style.right = "0px"
                        }
                        else if(direction === "R" && player.offsetLeft < wall.R /* && pause */)  {
                            playerPosition += vel;
                            // personPlayer.style.right = "200px"
                        }

                    player.style.left = playerPosition + "px";
                    
                    // console.log("Player p: ", player.offsetLeft, "Direction: ", direction, "Veloci: ", vel, "wall RL: ", wall, "pause: ", pause);
                }
        

                const keyDownHandler = (event) => {
                    if(event.key === "ArrowLeft") {
                        isMovL = true;
                        personPlayer.style.right = "0px";
                    }
                    
                    if(event.key === "ArrowRight") {
                        isMovR = true;
                        personPlayer.style.right = "300px";
                    }
                };

                const keyUpHandler = (event) => {
                    if(event.key === "ArrowLeft") {
                        isMovL = false;
                        personPlayer.style.right = "150px";
                    }
                    if(event.key === "ArrowRight") {
                        isMovR = false;
                        personPlayer.style.right = "150px";
                    }
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

    fuelBar() {
        var qtd = 0; 
        
        const fuelNav = setInterval(() => {
            qtd++;
            
            this.fuel.style.width =  `${qtd * 100 / 60}%`;

            console.log(qtd * 100 / 60);

            if(qtd >= this.timer / 1000) {
                clearInterval(fuelNav);
            }
        }, 1000);

        this.speedometerVel();
    }

    speedometerVel() {  
        var speedCont = 0;
        
        setTimeout(() => {
            const intervalSpeed = setInterval(() => {
                speedCont ++;
                this.speedometer.innerText = speedCont
    
                if(speedCont >= 350) {
                    clearInterval(intervalSpeed);
                }
    
            }, 10)
        }, this.delay);
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
    constructor(enemiesBG, cont, timer, menu) {
        this.enemiesBG = enemiesBG;
        this.cont = cont;
        this.carUtil = [true, true, true, true, true, true, true, true, true, true];
        this.timer = timer;
        this.menu = menu;
    }

    moveEnemie(enemie, duration = this.cont) {

        const keyframes = [
            {transform: `translateY(0)`},
            {transform: `translateY(900px)`} // 8030px
        ];

        const options = {
            duration: duration,
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

        if(!finished) {
            var randomTimer = Math.floor(Math.random() * (2000 - 1000 + 1) + 100); // 2000 1000 100
    
            var randomCar;

            var tentativas = 0;
            const limiteTentativas = 1000; 

            do {    
                randomCar = Math.floor(Math.random() * (9 - 0 + 1));

                tentativas++;
                if (tentativas >= limiteTentativas) {
                    break;
                }
            } while(!this.carUtil[randomCar])
    
            carInutilize(this.carUtil, randomCar, this.cont);

            function carInutilize(test, b, timer) {
                if(test[b]) {
                    test[b] = false

                    setTimeout(() => {
                        test[b] = true;
                    }, 500 + timer);
                } 
            } 

            setTimeout(() => {  
                const enemies = this.enemiesBG.querySelectorAll("img");             
                this.moveEnemie(enemies[randomCar]);
                if(pause)
                    this.spawnEnemis();
            }, randomTimer);


            setTimeout(() => {
                finished = true;
            }, this.timer - 5000);
        } else {

            setTimeout(() => {
                this.enemiesBG.classList.remove("enemies");
                this.enemiesBG.classList.add("finished");
                this.enemiesBG.innerHTML = `<img class="finishedBar" src="./sprites//spriteFinish.png" alt="finished">`;                
                this.moveEnemie(this.enemiesBG.querySelector("img"), this.cont + 300);
                setTimeout(() => {
                    this.menu.finished();
                    this.menu.displayFlex();
                }, this.cont + 400);
            }, 2400); 

        }
    }
}

class Collision {
    constructor(car, enemies, menu) {
        this.car = car;
        this.enemies = enemies;
        this.menu = menu;
    }

    collision(carEnemies) {
        const playerPosition = this.car.getBoundingClientRect();
        const enemiePosition = carEnemies.getBoundingClientRect();

        return (
            playerPosition.left < enemiePosition.left + enemiePosition.width &&
            playerPosition.left + playerPosition.width > enemiePosition.left &&
            playerPosition.top < enemiePosition.top + enemiePosition.height &&
            playerPosition.top + playerPosition.height > enemiePosition.top
        )
    }

    collisionDetection() {
        const carEnemies = this.enemies.querySelectorAll("img");
        
        for(var i = 0; i < carEnemies.length; i++) {
            if(this.collision(carEnemies[i]) && !finished){
                this.menu.gameover();
                this.menu.displayFlex();
            }
        }

        requestAnimationFrame(() => this.collisionDetection());
    }
}

class Menu {
    constructor(menuContainer) {
        this.menuContainer = menuContainer
    }

    gameover() {
        this.menuContainer.innerHTML = `
        <div class="menuHome">
            <h1>Game Over</h1>
            <button class="startBtn" onclick="location.reload()">Restart</button>
        </div>`;

        pause = false;

        const highestId = window.setTimeout(() => {
            for (let i = highestId; i >= 0; i--) {
              window.clearInterval(i);
            }
        }, 0);
    }

    start() {
        this.menuContainer.innerHTML = `<div class="menuHome">
        <div class="menuHome-instruction_keyboard">
            
            <div class="menuHome-instruction_keyboard--car">
                <img src="./sprites/spriteCountCar.png" alt="mini-car" >
            </div>

            <div class="menuHome-instruction_keyboard--btn" id="ImenuHome-instruction_keyboard--btn">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

        <h1>Press button to start</h1>
        <button id="iStartBtn" class="startBtn" onclick="start()">START</button>

        <script>
            const instructionKey = document.getElementById("ImenuHome-instruction_keyboard--btn");
            const keyboards = instructionKey.querySelectorAll("div");
            const menu = document.getElementById("Imenu");


            const stateAnimation = () => {
                /* if(keyboards[0].style.animationPlayState == "paused") {
                    keyboards[0].style.animationPlayState = "running";
                    keyboards[2].style.animationPlayState = "paused";
                    
                } else {
                    keyboards[2].style.animationPlayState = "running";
                    keyboards[0].style.animationPlayState = "paused";
                } */
                
                if(keyboards[2].style.animationName != "instructionKeyboard") {
                    keyboards[2].style.animationName = "instructionKeyboard";
                    keyboards[0].style.animationName = "none";
                } else {
                    keyboards[0].style.animationName = "instructionKeyboard";
                    keyboards[2].style.animationName = "none";
                }  

                if(menu.style.display === "none") {
                    clearInterval(intervalAnimation);
                }
            }
            
            stateAnimation();
            const intervalAnimation = setInterval(stateAnimation, 1500)
        </script>
    </div>`;
    }

    finished() {
        this.menuContainer.innerHTML = `<div class="menuHome">
        <h1>CONGRATULATIONS!!!</h1>
        <button class="startBtn" onclick="location.reload()">Restart</button>

        <div class="menuMidia">
            <p>Take a look</p>

            <ul>
                <li>
                    <a href='https://github.com/Otavioalv' target='_blank'  rel="noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><g fill="none"><g clip-path="url(#akarIconsGithubFill0)"><path fill="currentColor" fill-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" clip-rule="evenodd"/></g><defs><clipPath id="akarIconsGithubFill0"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>
                    </a>
                </li>
                <li>
                    <a href='mailto:otaviogabriel.alves.barbosa@gmail.com' target='_blank' rel="noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m18.73 5.41l-1.28 1L12 10.46L6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64z"/></svg>
                    </a>
                </li>
                <li>
                    <a href="https://www.linkedin.com/in/ot%C3%A1vio-gabriel-571a46248" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M0 1.5A1.5 1.5 0 0 1 1.5 0h12A1.5 1.5 0 0 1 15 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 13.5v-12ZM5 5H4V4h1v1Zm-1 6V6h1v5H4Zm4.5-4A1.5 1.5 0 0 0 7 8.5V11H6V6h1v.5a2.5 2.5 0 0 1 4 2V11h-1V8.5A1.5 1.5 0 0 0 8.5 7Z" clip-rule="evenodd"/></svg>
                    </a>
                </li>
                <li>
                    <a href="https://instagram.com/otaviog_a?utm_source=qr&amp;igshid=MzNlNGNkZWQ4Mg%3D%3D" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C5.829 0 5.556.01 4.703.048C3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7C.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297c.04.852.174 1.433.372 1.942c.205.526.478.972.923 1.417c.444.445.89.719 1.416.923c.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417c.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046c.78.035 1.204.166 1.486.275c.373.145.64.319.92.599c.28.28.453.546.598.92c.11.281.24.705.275 1.485c.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598c-.28.11-.704.24-1.485.276c-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598a2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485c-.038-.843-.046-1.096-.046-3.233c0-2.136.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486c.145-.373.319-.64.599-.92c.28-.28.546-.453.92-.598c.282-.11.705-.24 1.485-.276c.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92a.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217a4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334a2.667 2.667 0 0 1 0-5.334z"/></svg>
                    </a>
                </li>
            </ul>
        </div>
        </div> `
        pause = false;

        const highestId = window.setTimeout(() => {
            for (let i = highestId; i >= 0; i--) {
              window.clearInterval(i);
            }
        }, 0);
    }

    displayNone() {
        this.menuContainer.style.display = "none";
    }

    displayFlex() {
        this.menuContainer.style.display = "flex";
    }
}