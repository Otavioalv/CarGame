function start() {
    /* const scenaryElement = document.getElementById("idScenaryMonitor"); */
    const scenaryElement = document.querySelectorAll(".scenaryMonitor");

    const scenary = new Scenary(scenaryElement, 1000);

    scenary.speed(); 
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

    animate() {
        const keyframes = [
        { transform: 'translateY(0)' },
        { transform: 'translateY(100%)' }
        ];

        const options = {
            duration: this.vel,
            fill: 'forwards'
        };

        this.scenary.forEach(element => {
            const animation = element.animate(keyframes, options);
            animation.play();
        });

        setTimeout(() => {
            this.scrolling();
        }, this.vel);

        /* 
        function minhaFuncao() {
          console.log("Esta função foi executada após 1 segundo.");
        }

        // Executa a função 'minhaFuncao' após 1000 milissegundos (1 segundo)
        setTimeout(minhaFuncao, 1000);
        */
    }

    scrolling() {
        console.log(this.scenary[0])
        console.log(this.scenary[1])
        

        /* 
            [0, 1, 2]

            1 = 0 1 2

            2= 1 2 apaga o 0

            3 = 0 1 2 recoloca ele no final

            4 = repete
        */
    }
}