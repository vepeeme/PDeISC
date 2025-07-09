// Exportamos la clase CZooAnimal
export class CZooAnimal {
  constructor(IdAnimal, nombre, JaulaNumero, IdTypeAnimal, peso) {
    this.IdAnimal      = IdAnimal;
    this.nombre        = nombre;
    this.JaulaNumero   = JaulaNumero;
    this.IdTypeAnimal  = IdTypeAnimal;
    this.peso          = peso;
  }
  // Verifica que el animal sea felino
  get esFelino() {
    return this.IdTypeAnimal === 1;
  }
}
