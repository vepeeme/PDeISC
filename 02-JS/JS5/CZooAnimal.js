// CZooAnimal.js
// Clase con los campos indicados en la consigna

export class CZooAnimal {
  /**
   * @param {number} IdAnimal      Identificador único
   * @param {string} nombre        Nombre del animal
   * @param {number} JaulaNumero   Número de la jaula
   * @param {number} IdTypeAnimal  1=Felino,2=Ave,3=Reptil,...
   * @param {number} peso          Peso en kilogramos
   */
  constructor(IdAnimal, nombre, JaulaNumero, IdTypeAnimal, peso) {
    this.IdAnimal      = IdAnimal;
    this.nombre        = nombre;
    this.JaulaNumero   = JaulaNumero;
    this.IdTypeAnimal  = IdTypeAnimal;
    this.peso          = peso;
  }

  /** true si es felino (IdTypeAnimal === 1) */
  get esFelino() {
    return this.IdTypeAnimal === 1;
  }
}
