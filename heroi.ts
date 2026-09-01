class Personagem {
    constructor(private nome: string, private vida: number) {
        console.log(`Personagem ${this.nome} criado com ${this.vida} PV.\n`);
    }

    tomarDano(dano: number): void {
        this.vida -= dano;
        if (this.vida < 0) {
            this.vida = 0;
        }
        console.log(`${this.nome} recebeu ${dano} de dano! PV restantes: ${this.vida}\n`);
    }
}

function atacar(atacante: Personagem, defensor: Personagem, dano: number): void {
    defensor.tomarDano(dano);
}

const heroi = new Personagem("Herói", 100);
const vilao = new Personagem("Vilão", 80);

atacar(vilao, heroi, 30);
atacar(vilao, heroi, 80);
