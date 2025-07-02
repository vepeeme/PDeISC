import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-simon',
  templateUrl: './simon.page.html',
  styleUrls: ['./simon.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SimonPage implements OnInit {
  private secuencia: string[] = [];
  private secuenciaJugador: string[] = [];
  private indiceActual = 0;
  private puntuacion = 0;
  private juegoActivo = false;
  private mostrandoSecuencia = false;

  constructor() {}
  
  ngOnInit() {
    this.inicializarEventos();
  }

  private inicializarEventos() {
    const botonIniciar = document.getElementById('iniciar');
    const botones = document.querySelectorAll('.color');
    
    if (botonIniciar) {
      botonIniciar.addEventListener('click', () => this.iniciarJuego());
    }

    botones.forEach(boton => {
      boton.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target && !this.mostrandoSecuencia && this.juegoActivo) {
          this.manejarClickJugador(target.id);
        }
      });
    });
  }

  private iniciarJuego() {
    this.secuencia = [];
    this.secuenciaJugador = [];
    this.indiceActual = 0;
    this.puntuacion = 0;
    this.juegoActivo = true;
    this.actualizarPuntuacion();
    this.limpiarMensaje();
    this.siguienteRonda();
  }

  private siguienteRonda() {
    this.secuenciaJugador = [];
    this.indiceActual = 0;
    this.agregarColorASecuencia();
    this.mostrarSecuencia();
  }

  private agregarColorASecuencia() {
    const colores = ['verde', 'rojo', 'amarillo', 'azul'];
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    this.secuencia.push(colorAleatorio);
  }

  private async mostrarSecuencia() {
    this.mostrandoSecuencia = true;
    
    for (let i = 0; i < this.secuencia.length; i++) {
      await this.esperar(600);
      this.iluminarColor(this.secuencia[i]);
      await this.esperar(400);
      this.apagarColor(this.secuencia[i]);
    }
    
    this.mostrandoSecuencia = false;
  }

  private manejarClickJugador(colorId: string) {
    this.secuenciaJugador.push(colorId);
    this.iluminarColor(colorId);
    setTimeout(() => this.apagarColor(colorId), 200);

    if (this.secuenciaJugador[this.indiceActual] !== this.secuencia[this.indiceActual]) {
      this.finalizarJuego();
      return;
    }

    this.indiceActual++;

    if (this.indiceActual === this.secuencia.length) {
      this.puntuacion++;
      this.actualizarPuntuacion();
      setTimeout(() => this.siguienteRonda(), 1000);
    }
  }

  private iluminarColor(colorId: string) {
    const elemento = document.getElementById(colorId);
    if (elemento) {
      elemento.classList.add('activo');
    }
  }

  private apagarColor(colorId: string) {
    const elemento = document.getElementById(colorId);
    if (elemento) {
      elemento.classList.remove('activo');
    }
  }

  private finalizarJuego() {
    this.juegoActivo = false;
    this.mostrarMensaje(`¡Juego terminado! Puntuación final: ${this.puntuacion}`, 'error');
  }

  private actualizarPuntuacion() {
    const elementoPuntuacion = document.getElementById('puntaje');
    if (elementoPuntuacion) {
      elementoPuntuacion.textContent = `Puntuación: ${this.puntuacion}`;
    }
  }

  private mostrarMensaje(texto: string, tipo: string = '') {
    const elementoMensaje = document.getElementById('mensaje');
    if (elementoMensaje) {
      elementoMensaje.textContent = texto;
      elementoMensaje.id = tipo;
    }
  }

  private limpiarMensaje() {
    const elementoMensaje = document.getElementById('mensaje');
    if (elementoMensaje) {
      elementoMensaje.textContent = '';
      elementoMensaje.id = 'mensaje';
    }
  }

  private esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}