interface AtualizavelPorTurno {
  novoTurno(): void;
}

interface Arma extends AtualizavelPorTurno {
  readonly nome: string;

  atacar(): number | null;
}

interface Efeito extends AtualizavelPorTurno {
  readonly nome: string;

  terminou(): boolean;
}

interface Habilidade extends AtualizavelPorTurno {
  readonly nome: string;
  usar(usuario: Personagem, alvos: Personagem[]): void;
}

class Cooldown implements AtualizavelPorTurno {
  private turnosRestantes = 0;

  constructor(private readonly duracao: number) {}

  disponivel(): boolean {
    return this.turnosRestantes === 0;
  }

  iniciar(): void {
    this.turnosRestantes = this.duracao;
  }

  novoTurno(): void {
    if (this.turnosRestantes > 0) {
      this.turnosRestantes--;
    }
  }
}

class Espada implements Arma {
  private readonly cooldown: Cooldown;

  constructor(
    public readonly nome: string,
    private readonly dano: number
  ) {
    this.cooldown = new Cooldown(1);
  }

  atacar(): number | null {
    if (!this.cooldown.disponivel()) {
      console.log(`${this.nome} está em cooldown.`);
      return null;
    }

    this.cooldown.iniciar();

    return this.dano;
  }

  novoTurno(): void {
    this.cooldown.novoTurno();
  }
}

class Arco implements Arma {
  private readonly cooldown: Cooldown;

  constructor(
    public readonly nome: string,
    private readonly dano: number,
    private flechas: number,
    private readonly capacidadeFlechas: number
  ) {
    this.cooldown = new Cooldown(2);
  }

  atacar(): number | null {
    if (!this.cooldown.disponivel()) {
      console.log(`${this.nome} está em cooldown.`);
      return null;
    }

    if (this.flechas === 0) {
      console.log(`${this.nome}: não há flechas.`);
      return null;
    }

    this.flechas--;

    this.cooldown.iniciar();

    console.log(
      `${this.nome}: flecha disparada (${this.flechas} restantes).`
    );

    return this.dano;
  }

  recarregar(quantidade: number): void {
    this.flechas = Math.min(
      this.flechas + quantidade,
      this.capacidadeFlechas
    );

    console.log(
      `${this.nome}: ${this.flechas}/${this.capacidadeFlechas} flechas.`
    );
  }

  novoTurno(): void {
    this.cooldown.novoTurno();
  }
}

class VarinhaMagica implements Arma {
  private readonly cooldown: Cooldown;

  constructor(
    public readonly nome: string,
    private readonly dano: number,
    private mana: number,
    private readonly manaMaxima: number,
    private readonly custoMana: number
  ) {
    this.cooldown = new Cooldown(2);
  }

  atacar(): number | null {
    if (!this.cooldown.disponivel()) {
      console.log(`${this.nome} está em cooldown.`);
      return null;
    }

    if (this.mana < this.custoMana) {
      console.log(`${this.nome}: mana insuficiente.`);
      return null;
    }

    this.mana -= this.custoMana;
    this.cooldown.iniciar();

    console.log(
      `${this.nome}: mana ${this.mana}/${this.manaMaxima}.`
    );

    return this.dano;
  }

  recuperarMana(quantidade: number): void {
    this.mana = Math.min(
      this.mana + quantidade,
      this.manaMaxima
    );

    console.log(
      `${this.nome}: mana ${this.mana}/${this.manaMaxima}.`
    );
  }

  novoTurno(): void {
    this.cooldown.novoTurno();
  }
}

class BolaDeFogo implements Habilidade {
  public readonly nome = "Bola de Fogo";
  private readonly cooldown = new Cooldown(2);
  private readonly custo = 20;

  usar(usuario: Personagem, alvos: Personagem[]): void {
    if (!this.cooldown.disponivel()) return console.log(`${this.nome} está em cooldown.`);
    if (!usuario.consumirMana(this.custo)) return console.log(`${usuario.nome}: mana insuficiente.`);

    const alvo = alvos[0];
    if (alvo) {
      console.log(`${usuario.nome} lançou ${this.nome} em ${alvo.nome}!`);
      alvo.receberDano(40);
      this.cooldown.iniciar();
    }
  }

  novoTurno() { 
      this.cooldown.novoTurno()
  }
}

class Cura implements Habilidade {
  public readonly nome = "Cura";
  private readonly cooldown = new Cooldown(1);
  private readonly custo = 15;

  usar(usuario: Personagem, alvos: Personagem[]): void {
    if (!this.cooldown.disponivel()) return console.log(`${this.nome} está em cooldown.`);
    if (!usuario.consumirMana(this.custo)) return console.log(`${usuario.nome}: mana insuficiente.`);

    const alvo = alvos[0];
    if (alvo) {
      console.log(`${usuario.nome} usou ${this.nome} em ${alvo.nome}!`);
      alvo.curar(30);
      this.cooldown.iniciar();
    }
  }

  novoTurno() { 
      this.cooldown.novoTurno()
  }
}

class GolpePoderoso implements Habilidade {
  public readonly nome = "Golpe Poderoso";
  private readonly cooldown = new Cooldown(3);

  usar(usuario: Personagem, alvos: Personagem[]): void {
    if (!this.cooldown.disponivel()) return console.log(`${this.nome} está em cooldown.`);

    const alvo = alvos[0];
    if (alvo) {
      console.log(`${usuario.nome} desferiu um ${this.nome} em ${alvo.nome}!`);
      alvo.receberDano(60);
      this.cooldown.iniciar();
    }
  }

  novoTurno() { 
      this.cooldown.novoTurno()
  }
}

class Explosao implements Habilidade {
  public readonly nome = "Explosão";
  private readonly cooldown = new Cooldown(3);
  private readonly custo = 25;

  usar(usuario: Personagem, alvos: Personagem[]): void {
    if (!this.cooldown.disponivel()) return console.log(`${this.nome} está em cooldown.`);
    if (!usuario.consumirMana(this.custo)) return console.log(`${usuario.nome}: mana insuficiente.`);

    console.log(`${usuario.nome} causou uma ${this.nome} em varios alvos!`);
    for (const alvo of alvos) {
      alvo.receberDano(20);
    }
    
    this.cooldown.iniciar();
  }

  novoTurno() { 
      this.cooldown.novoTurno()
  }
}

class CorteLacerante implements Habilidade {
  public readonly nome = "Corte Lacerante";
  private readonly cooldown = new Cooldown(3);
  private readonly custo = 10;

  usar(usuario: Personagem, alvos: Personagem[]): void {
    if (!this.cooldown.disponivel()) return console.log(`${this.nome} está em cooldown.`);
    if (!usuario.consumirMana(this.custo)) return console.log(`${usuario.nome}: mana insuficiente.`);

    const alvo = alvos[0];
    if (alvo) {
      console.log(`${usuario.nome} usou ${this.nome} em ${alvo.nome}!`);
      
      alvo.receberDano(20); 
      
      alvo.adicionarEfeito(new Sangramento("Sangramento", alvo, 5, 3));
      
      this.cooldown.iniciar();
    }
  }

  novoTurno(): void { this.cooldown.novoTurno(); }
}

class Item {
  constructor(
    public readonly nome: string,
    public readonly valor: number
  ) {}
}

class Inventario {
  private readonly itens: Item[] = [];

  adicionar(item: Item): void {
    this.itens.push(item);
  }

  remover(item: Item): boolean {
    const indice = this.itens.indexOf(item);

    if (indice === -1) {
      return false;
    }

    this.itens.splice(indice, 1);
    return true;
  }

  listar(): readonly Item[] {
    return [...this.itens];
  }
}


class Veneno implements Efeito {
  private turnosRestantes: number;

  constructor(
    public readonly nome: string,
    private readonly personagem: Personagem,
    private readonly danoPorTurno: number,
    duracao: number
  ) {
    this.turnosRestantes = duracao;
  }

  novoTurno(): void {
    if (this.terminou()) {
      return;
    }

    console.log(
      `${this.personagem.nome} sofreu ` +
      `${this.danoPorTurno} de dano por ${this.nome}.`
    );

    this.personagem.receberDano(this.danoPorTurno);

    this.turnosRestantes--;
  }

  terminou(): boolean {
    return this.turnosRestantes === 0;
  }
}

class Sangramento implements Efeito {
  private turnosRestantes: number;

  constructor(
    public readonly nome: string,
    private readonly personagem: Personagem,
    private readonly danoPorTurno: number,
    duracao: number
  ) {
    this.turnosRestantes = duracao;
  }

  novoTurno(): void {
    if (this.terminou()) {
      return;
    }

    console.log(
      `${this.personagem.nome} sofreu ` +
      `${this.danoPorTurno} de dano por ${this.nome}.`
    );

    this.personagem.receberDano(this.danoPorTurno);

    this.turnosRestantes--;
  }

  terminou(): boolean {
    return this.turnosRestantes === 0;
  }
}

class Regeneracao implements Efeito {
  private turnosRestantes: number;

  constructor(
    public readonly nome: string,
    private readonly personagem: Personagem,
    private readonly curaPorTurno: number,
    duracao: number
  ) {
    this.turnosRestantes = duracao;
  }

  novoTurno(): void {
    if (this.terminou()) {
      return;
    }

    console.log(
      `${this.personagem.nome} recuperou ` +
      `${this.curaPorTurno} HP por ${this.nome}.`
    );

    this.personagem.curar(this.curaPorTurno);

    this.turnosRestantes--;
  }

  terminou(): boolean {
    return this.turnosRestantes === 0;
  }
}

class Personagem implements AtualizavelPorTurno {
  private vida: number
  private mana: number
  private nivel = 1
  private experiencia = 0

  private readonly inventario: Inventario
  private readonly efeitos: Efeito[] = []
  private readonly habilidades: Habilidade[] = []

  private readonly atualizaveis: AtualizavelPorTurno[] = []

  constructor(
    public readonly nome: string,
    private vidaMaxima: number,
    private readonly arma: Arma,
    private readonly manaMaxima: number
  ) {
    this.vida = vidaMaxima
    this.mana = manaMaxima;
    this.inventario = new Inventario()
    this.registrarAtualizavel(arma)
  }

  atacar(inimigo: Personagem): void {
    if (!this.estaVivo()) {
      console.log("Inimigo derrotado.")
      return
    }

    const dano = this.arma.atacar()
    if (dano == null) {
      return
    }

    console.log(`${this.nome} atacou ${inimigo.nome}` +
      ` com ${this.arma.nome}`
    )

    inimigo.receberDano(dano)
    this.ganharExperiencia(10)
  }

  receberDano(dano: number) {
    this.vida = Math.max(0, this.vida - dano)
    if (!this.estaVivo()) {
      console.log(`${this.nome} foi derrotado!`)
    }
  }

  curar(quantidade: number) {
    this.vida = Math.min(
      this.vida + quantidade,
      this.vidaMaxima
    )
  }

  estaVivo() {
    return this.vida > 0
  }

  ganharExperiencia(quantidade: number) {
    this.experiencia += quantidade
  }

  private verificarSubidaDeNivel() {
    while(this.nivel < Personagem.XP_POR_NIVEL.length &&
      this.experiencia >= Personagem.XP_POR_NIVEL[this.nivel]
    ) {
      this.subirDeNivel()
    }
  }

  private subirDeNivel() {
    this.nivel++
    this.vidaMaxima += 20
    this.vida = this.vidaMaxima

    console.log(`${this.nome} subiu para o nível ${this.nivel}`)
  }

  adicionarItem(item: Item) {
    this.inventario.adicionar(item)
  }

  removerItem(item: Item) {
    this.inventario.remover(item)
  }

  mostrarInventario() {
    console.log(`Inventario de ${this.nome}`)

    for (const item of this.inventario.listar()) {
      console.log(`- ${item.nome} (${item.valor})`)
    }
  }

  adicionarEfeito(efeito: Efeito) {
    this.efeitos.push(efeito)
    this.registrarAtualizavel(efeito)
  }

  private registrarAtualizavel(objeto: AtualizavelPorTurno) {
    this.atualizaveis.push(objeto)
  }

  novoTurno() {
    for (const objeto of this.atualizaveis) {
      objeto.novoTurno()
    }

    this.verificarSubidaDeNivel()

    this.removerEfeitosTerminados()
  }

  private removerEfeitosTerminados() {
    for (let i = this.efeitos.length - 1; i >= 0; i--) {
      const efeito = this.efeitos[i]
      if (!efeito.terminou()) {
        continue
      }

      this.efeitos.splice(i, 1)

      const indiceAtualizavel = this.atualizaveis.indexOf(efeito)
      if (indiceAtualizavel !== -1) {
        this.atualizaveis.splice(indiceAtualizavel, 1)
      }
    }
  }

  private static readonly XP_POR_NIVEL = [
    0,    // nível 1
    100,  // nível 2
    250,  // nível 3
    500,  // nível 4
    900,  // nível 5
    1400, // nível 6
    2000  // nível 7
  ];
  
  consumirMana(valor: number): boolean {
    if (this.mana >= valor) {
      this.mana -= valor;
      return true;
    }
    return false;
  }

  adicionarHabilidade(habilidade: Habilidade) {
    this.habilidades.push(habilidade);
    this.registrarAtualizavel(habilidade);
  }

  usarHabilidade(nome: string, alvos: Personagem[]) {
    if (!this.estaVivo()) return;

    let habilidadeEncontrada = null;
    
    for (const h of this.habilidades) {
      if (h.nome === nome) {
        habilidadeEncontrada = h;
        break;
      }
    }

    if (habilidadeEncontrada) {
      habilidadeEncontrada.usar(this, alvos);
    } else {
      console.log(`${this.nome} não possui a habilidade ${nome}.`);
    }
  }
}

class Jogo {
  private readonly personagens: Personagem[] = []
  private turno = 0

  adicionarPersonagem(personagem: Personagem) {
    this.personagens.push(personagem)
  }

  novoTurno() {
    this.turno++

    for (const personagem of this.personagens) {
      personagem.novoTurno()
    }
  }
}

const jogo = new Jogo()

const espada = new Espada("Espada longa", 25)

const arco = new Arco("Arco Élfico", 20, 3, 3)

const varinha = new VarinhaMagica("Varinha de fogo", 30, 50, 50, 10)

const arqueiro = new Personagem("Arqueiro", 100, arco, 100)
const guerreiro = new Personagem("Guerreiro", 150, espada, 50)
const mago = new Personagem("Mago", 80, varinha, 200)

jogo.adicionarPersonagem(guerreiro)
jogo.adicionarPersonagem(mago)
jogo.adicionarPersonagem(arqueiro)

guerreiro.adicionarItem(new Item("Poção de vida", 50))
guerreiro.adicionarItem(new Item("Anel mágico", 200))
guerreiro.adicionarHabilidade(new CorteLacerante())

guerreiro.mostrarInventario()

// Combate
guerreiro.atacar(arqueiro)
arqueiro.atacar(guerreiro)
mago.atacar(guerreiro)
guerreiro.usarHabilidade("Corte Lacerante", [mago])

arqueiro.adicionarEfeito(
  new Veneno(
    "Envenenado",
    arqueiro,
    5,
    3
  )
)

guerreiro.adicionarEfeito(
  new Regeneracao(
    "Regeneração",
    guerreiro,
    8,
    2
  )
)

jogo.novoTurno()
jogo.novoTurno()
jogo.novoTurno()


