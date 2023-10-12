function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor");

    const scenary = new Scenary(scenaryElement, 1000);

    // scenary.speed(); 
    
    scenary.breake();
    scenary.animate();
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
