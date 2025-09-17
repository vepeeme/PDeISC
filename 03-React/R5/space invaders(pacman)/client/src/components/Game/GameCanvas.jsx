import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveScore } from '../../services/scores';

const GameCanvas = ({ isTwoPlayerMode = false, currentPlayer = 1, onPlayerDeath = null }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const audioContextRef = useRef(null);
  const keysPressed = useRef({});
  
  // Estado del juego
  const [gameState, setGameState] = useState({
    player: { x: 380, y: 550, width: 40, height: 40, speed: 4, lastShot: 0, mouthOpen: false },
    aliens: [],
    bullets: [],
    explosions: [],
    barriers: [],
    score: 0,
    lives: 3,
    level: 1,
    gameRunning: false,
    gameOver: false,
    lastEnemyShot: 0,
    lastMoveTime: 0,
    moveInterval: 500,
    direction: 'right',
    scoreSaved: false,
    enemyShotCooldown: 2000, // Cooldown entre disparos enemigos (ms)
    lastAlienShooter: -1 // Índice del último alien que disparó
  });

  const [userInteracted, setUserInteracted] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Función para crear contexto de audio
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && userInteracted) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API no soportada:', e);
      }
    }
  }, [userInteracted]);

  // Función para generar sonidos
  const playSound = useCallback((type) => {
    if (!audioContextRef.current || !userInteracted) return;
    
    try {
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      switch (type) {
        case 'shoot':
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
          break;
        case 'enemyKilled':
          oscillator.frequency.setValueAtTime(200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.3);
          break;
        case 'playerDeath':
          oscillator.frequency.setValueAtTime(300, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.8);
          gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.8);
          break;
      }
    } catch (e) {
      console.warn('Error reproduciendo sonido:', e);
    }
  }, [userInteracted]);

  // Función para guardar puntaje
  const handleSaveScore = async (finalScore) => {
    if (isTwoPlayerMode) return;
    
    const user = localStorage.getItem('user');
    if (!user) return;
    
    try {
      setSavingScore(true);
      const userData = JSON.parse(user);
      await saveScore(userData.id, finalScore);
      console.log('Puntaje guardado exitosamente');
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    } finally {
      setSavingScore(false);
    }
  };

  // Calcular dificultad basada en el nivel
  const getDifficultySettings = useCallback((level) => {
    return {
      enemyShotCooldown: Math.max(3000 - (level - 1) * 300, 1000), // Reduce cooldown gradualmente
      alienSpeed: Math.max(600 - (level - 1) * 75, 250), // Más rápidos cada nivel  
      pointsPerAlien: 100 + (level - 1) * 25 // Más puntos por nivel
    };
  }, []);

  // Inicializar juego
  const initGame = useCallback((resetLevel = true) => {
    const aliens = [];
    const colors = ['red', 'pink', 'orange', 'cyan'];
    const rows = 5;
    const cols = 11;
    const spacingX = 50;
    const spacingY = 40;
    const startX = 50;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const color = colors[row % colors.length];
        aliens.push({
          x: startX + col * spacingX,
          y: startY + row * spacingY,
          width: 40,
          height: 40,
          color,
          alive: true,
          animFrame: 0
        });
      }
    }

    const barriers = [];
    for (let i = 0; i < 4; i++) {
      barriers.push({
        x: 100 + i * 150,
        y: 400,
        width: 100,
        height: 60,
        health: 3
      });
    }

    const newLevel = resetLevel ? 1 : gameState.level;
    const difficulty = getDifficultySettings(newLevel);

    setGameState(prev => ({
      ...prev,
      aliens,
      barriers,
      player: { x: 380, y: 550, width: 40, height: 40, speed: 4, lastShot: 0, mouthOpen: false },
      bullets: [],
      explosions: [],
      level: newLevel,
      gameRunning: true,
      gameOver: false,
      lastEnemyShot: 0,
      lastMoveTime: Date.now(),
      moveInterval: difficulty.alienSpeed,
      direction: 'right',
      scoreSaved: false,
      enemyShotCooldown: difficulty.enemyShotCooldown,
      lastAlienShooter: -1
    }));
  }, [gameState.level, getDifficultySettings]);

  // Funciones de dibujo mejoradas
  const drawPacman = useCallback((ctx, x, y, size, mouthOpen = false) => {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    
    if (mouthOpen) {
      // Boca abierta apuntando hacia arriba (disparando)
      ctx.arc(x + size/2, y + size/2, size/2, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.lineTo(x + size/2, y + size/2);
    } else {
      // Círculo completo cuando no dispara
      ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
    }
    
    ctx.fill();
    
    // Ojo
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + size/2 + 3, y + size/2 - 5, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const drawGhost = useCallback((ctx, x, y, size, color, direction) => {
    const colors = {
      red: '#FF0000',
      pink: '#FFB6C1',
      orange: '#FFA500',
      cyan: '#00FFFF'
    };
    
    ctx.fillStyle = colors[color] || '#FF0000';
    
    // Cuerpo del fantasma
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/3, size/3, Math.PI, 0);
    ctx.rect(x + size/6, y + size/3, size * 2/3, size * 2/3);
    ctx.fill();
    
    // Parte inferior ondulada
    ctx.beginPath();
    ctx.moveTo(x + size/6, y + size);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(x + size/6 + (i * size/6) + size/12, y + size - 10);
      ctx.lineTo(x + size/6 + ((i + 1) * size/6), y + size);
    }
    ctx.lineTo(x + size/6, y + size);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + size/3, y + size/2, 6, 0, 2 * Math.PI);
    ctx.arc(x + 2*size/3, y + size/2, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    const eyeOffset = direction === 'right' ? 2 : -2;
    ctx.beginPath();
    ctx.arc(x + size/3 + eyeOffset, y + size/2, 3, 0, 2 * Math.PI);
    ctx.arc(x + 2*size/3 + eyeOffset, y + size/2, 3, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const drawBarrier = useCallback((ctx, x, y, width, height, health) => {
    if (health <= 0) return;
    
    const colors = ['#00FF00', '#FFFF00', '#FF0000'];
    ctx.fillStyle = colors[3 - health] || '#00FF00';
    ctx.fillRect(x, y, width, height);
    
    if (health < 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < (3 - health) * 5; i++) {
        ctx.fillRect(
          x + Math.random() * width,
          y + Math.random() * height,
          4, 4
        );
      }
    }
  }, []);

  const drawExplosion = useCallback((ctx, x, y, frame) => {
    const colors = ['#FFFF00', '#FF8C00', '#FF4500', '#FF0000'];
    const size = 20 + frame * 5;
    
    ctx.fillStyle = colors[Math.min(frame, colors.length - 1)];
    ctx.beginPath();
    ctx.arc(x + 20, y + 20, size, 0, 2 * Math.PI);
    ctx.fill();
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const distance = frame * 10;
      const particleX = x + 20 + Math.cos(angle) * distance;
      const particleY = y + 20 + Math.sin(angle) * distance;
      
      ctx.fillStyle = colors[(frame + i) % colors.length];
      ctx.fillRect(particleX - 2, particleY - 2, 4, 4);
    }
  }, []);

  // Controles móviles
  const handleMobileControl = (action) => {
    setUserInteracted(true);
    const currentTime = Date.now();
    
    switch(action) {
      case 'left':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            x: Math.max(0, prev.player.x - 20)
          }
        }));
        break;
      case 'right':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            x: Math.min(760, prev.player.x + 20)
          }
        }));
        break;
      case 'shoot':
        if (currentTime - gameState.player.lastShot > 200) {
          setGameState(prev => ({
            ...prev,
            bullets: [...prev.bullets, {
              x: prev.player.x + 18,
              y: prev.player.y,
              width: 4,
              height: 10,
              speed: 8,
              fromPlayer: true
            }],
            player: {
              ...prev.player,
              lastShot: currentTime,
              mouthOpen: true
            }
          }));
          playSound('shoot');
          
          // Cerrar boca después de 150ms
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              player: {
                ...prev.player,
                mouthOpen: false
              }
            }));
          }, 150);
        }
        break;
    }
  };

  // Controles del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      setUserInteracted(true);
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Inicializar audio context cuando el usuario interactúa
  useEffect(() => {
    if (userInteracted) {
      initAudioContext();
    }
  }, [userInteracted, initAudioContext]);

  // Inicializar juego al montar el componente
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Game loop principal mejorado
  useEffect(() => {
    if (!canvasRef.current || !gameState.gameRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const gameLoop = () => {
      if (!gameState.gameRunning) return;

      const currentTime = Date.now();
      let newGameState = { ...gameState };

      // Mover jugador
      if (keysPressed.current['ArrowLeft'] && newGameState.player.x > 0) {
        newGameState.player.x -= newGameState.player.speed;
      }
      if (keysPressed.current['ArrowRight'] && newGameState.player.x < 760) {
        newGameState.player.x += newGameState.player.speed;
      }

      // Disparar
      if (keysPressed.current[' '] && currentTime - newGameState.player.lastShot > 200) {
        newGameState.bullets.push({
          x: newGameState.player.x + 18,
          y: newGameState.player.y,
          width: 4,
          height: 10,
          speed: 8,
          fromPlayer: true
        });
        newGameState.player.lastShot = currentTime;
        newGameState.player.mouthOpen = true;
        playSound('shoot');
        
        // Cerrar boca después de 150ms
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            player: {
              ...prev.player,
              mouthOpen: false
            }
          }));
        }, 150);
      }

      // Mover alienígenas
      const aliveAliens = newGameState.aliens.filter(a => a.alive);
      
      if (currentTime - newGameState.lastMoveTime >= newGameState.moveInterval) {
        let shouldMoveDown = false;
        let newDirection = newGameState.direction;

        if (newGameState.direction === 'right') {
          const rightmost = Math.max(...aliveAliens.map(a => a.x + a.width));
          if (rightmost >= 780) {
            shouldMoveDown = true;
            newDirection = 'left';
          }
        } else {
          const leftmost = Math.min(...aliveAliens.map(a => a.x));
          if (leftmost <= 20) {
            shouldMoveDown = true;
            newDirection = 'right';
          }
        }

        newGameState.aliens = newGameState.aliens.map(alien => {
          if (!alien.alive) return alien;
          
          return {
            ...alien,
            x: shouldMoveDown ? alien.x : alien.x + (newDirection === 'right' ? 10 : -10),
            y: shouldMoveDown ? alien.y + 20 : alien.y,
            animFrame: (alien.animFrame + 1) % 60
          };
        });

        newGameState.direction = newDirection;
        newGameState.lastMoveTime = currentTime;
      }

      // Disparo enemigo mejorado - uno a la vez con cooldown
      if (currentTime - newGameState.lastEnemyShot >= newGameState.enemyShotCooldown && aliveAliens.length > 0) {
        // Elegir un alien diferente al último que disparó
        let availableAliens = aliveAliens.filter((_, index) => index !== newGameState.lastAlienShooter);
        if (availableAliens.length === 0) availableAliens = aliveAliens;
        
        const randomIndex = Math.floor(Math.random() * availableAliens.length);
        const shootingAlien = availableAliens[randomIndex];
        
        // Encontrar el índice original del alien que va a disparar
        const originalIndex = newGameState.aliens.findIndex(alien => alien === shootingAlien);
        
        newGameState.bullets.push({
          x: shootingAlien.x + 18,
          y: shootingAlien.y + 40,
          width: 4,
          height: 10,
          speed: 3 + Math.floor(newGameState.level / 3), // Velocidad aumenta ligeramente con nivel
          fromPlayer: false
        });
        
        newGameState.lastEnemyShot = currentTime;
        newGameState.lastAlienShooter = originalIndex;
      }

      // Mover balas
      newGameState.bullets = newGameState.bullets.map(bullet => ({
        ...bullet,
        y: bullet.fromPlayer ? bullet.y - bullet.speed : bullet.y + bullet.speed
      })).filter(bullet => bullet.y > -20 && bullet.y < 620);

      // Colisiones bala del jugador
      newGameState.bullets = newGameState.bullets.filter(bullet => {
        if (!bullet.fromPlayer) return true;

        // Con alienígenas
        for (let i = 0; i < newGameState.aliens.length; i++) {
          const alien = newGameState.aliens[i];
          if (!alien.alive) continue;
          
          if (bullet.x < alien.x + alien.width &&
              bullet.x + bullet.width > alien.x &&
              bullet.y < alien.y + alien.height &&
              bullet.y + bullet.height > alien.y) {
            
            newGameState.aliens[i] = { ...alien, alive: false };
            const difficulty = getDifficultySettings(newGameState.level);
            newGameState.score += difficulty.pointsPerAlien;
            newGameState.explosions.push({
              x: alien.x,
              y: alien.y,
              frame: 0,
              startTime: currentTime
            });
            
            playSound('enemyKilled');
            return false;
          }
        }

        // Con barreras
        for (let i = 0; i < newGameState.barriers.length; i++) {
          const barrier = newGameState.barriers[i];
          if (barrier.health <= 0) continue;
          
          if (bullet.x < barrier.x + barrier.width &&
              bullet.x + bullet.width > barrier.x &&
              bullet.y < barrier.y + barrier.height &&
              bullet.y + bullet.height > barrier.y) {
            
            newGameState.barriers[i] = { ...barrier, health: barrier.health - 1 };
            return false;
          }
        }

        return true;
      });

      // Colisiones bala enemiga - CON BARRERAS INCLUIDAS
      newGameState.bullets = newGameState.bullets.filter(bullet => {
        if (bullet.fromPlayer) return true;

        // Colisión con jugador
        if (bullet.x < newGameState.player.x + newGameState.player.width &&
            bullet.x + bullet.width > newGameState.player.x &&
            bullet.y < newGameState.player.y + newGameState.player.height &&
            bullet.y + bullet.height > newGameState.player.y) {
          
          newGameState.lives--;
          playSound('playerDeath');
          
          if (newGameState.lives <= 0) {
            newGameState.gameRunning = false;
            newGameState.gameOver = true;
            
            if (!isTwoPlayerMode && !newGameState.scoreSaved) {
              newGameState.scoreSaved = true;
              handleSaveScore(newGameState.score);
            }
            
            if (isTwoPlayerMode && onPlayerDeath) {
              onPlayerDeath(newGameState.score);
            }
          }
          
          return false;
        }

        // Colisión con barreras
        for (let i = 0; i < newGameState.barriers.length; i++) {
          const barrier = newGameState.barriers[i];
          if (barrier.health <= 0) continue;
          
          if (bullet.x < barrier.x + barrier.width &&
              bullet.x + bullet.width > barrier.x &&
              bullet.y < barrier.y + barrier.height &&
              bullet.y + bullet.height > barrier.y) {
            
            newGameState.barriers[i] = { ...barrier, health: barrier.health - 1 };
            return false; // La bala desaparece
          }
        }

        return true;
      });

      // Actualizar explosiones
      newGameState.explosions = newGameState.explosions.filter(explosion => {
        const frame = Math.floor((currentTime - explosion.startTime) / 80);
        return frame < 10;
      }).map(explosion => ({
        ...explosion,
        frame: Math.floor((currentTime - explosion.startTime) / 80)
      }));

      // Verificar victoria - Pasar al siguiente nivel
      const remainingAliens = newGameState.aliens.filter(a => a.alive).length;
      if (remainingAliens === 0) {
        // Siguiente nivel
        newGameState.level++;
        const difficulty = getDifficultySettings(newGameState.level);
        
        // Reinicializar con nueva dificultad
        const aliens = [];
        const colors = ['red', 'pink', 'orange', 'cyan'];
        const rows = 5;
        const cols = 11;
        const spacingX = 50;
        const spacingY = 40;
        const startX = 50;
        const startY = 50;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const color = colors[row % colors.length];
            aliens.push({
              x: startX + col * spacingX,
              y: startY + row * spacingY,
              width: 40,
              height: 40,
              color,
              alive: true,
              animFrame: 0
            });
          }
        }

        // Restaurar barreras
        const barriers = [];
        for (let i = 0; i < 4; i++) {
          barriers.push({
            x: 100 + i * 150,
            y: 400,
            width: 100,
            height: 60,
            health: 3
          });
        }

        newGameState.aliens = aliens;
        newGameState.barriers = barriers;
        newGameState.bullets = [];
        newGameState.explosions = [];
        newGameState.moveInterval = difficulty.alienSpeed;
        newGameState.enemyShotCooldown = difficulty.enemyShotCooldown;
        newGameState.lastMoveTime = Date.now();
        newGameState.lastEnemyShot = 0;
        newGameState.lastAlienShooter = -1;
        
        // Bonus por completar nivel
        newGameState.score += 500 * newGameState.level;
      }

      // Verificar derrota por invasión
      if (aliveAliens.some(alien => alien.y + alien.height >= newGameState.player.y)) {
        newGameState.gameRunning = false;
        newGameState.gameOver = true;
        playSound('playerDeath');
        
        if (!isTwoPlayerMode && !newGameState.scoreSaved) {
          newGameState.scoreSaved = true;
          handleSaveScore(newGameState.score);
        }
        
        if (isTwoPlayerMode && onPlayerDeath) {
          onPlayerDeath(newGameState.score);
        }
      }

      // Actualizar estado
      setGameState(newGameState);

      // Dibujar
      ctx.clearRect(0, 0, 800, 600);
      
      // Fondo
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, 800, 600);
      
      // Estrellas
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % 800;
        const y = (i * 47) % 600;
        if (Math.sin(currentTime * 0.001 + i) > 0.8) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Jugador
      drawPacman(ctx, newGameState.player.x, newGameState.player.y, 40, newGameState.player.mouthOpen);

      // Alienígenas
      newGameState.aliens.forEach(alien => {
        if (alien.alive) {
          drawGhost(ctx, alien.x, alien.y, 40, alien.color, newGameState.direction);
        }
      });

      // Barreras
      newGameState.barriers.forEach(barrier => {
        drawBarrier(ctx, barrier.x, barrier.y, barrier.width, barrier.height, barrier.health);
      });

      // Balas
      newGameState.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.fromPlayer ? '#00FF00' : '#FF0000';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Explosiones
      newGameState.explosions.forEach(explosion => {
        drawExplosion(ctx, explosion.x, explosion.y, explosion.frame);
      });

      // UI mejorado
      ctx.fillStyle = '#00FF00';
      ctx.font = '20px monospace';
      ctx.fillText(`Score: ${newGameState.score}`, 20, 30);
      ctx.fillText(`Lives: ${newGameState.lives}`, 20, 60);
      ctx.fillText(`Level: ${newGameState.level}`, 20, 90);
      ctx.fillText(`Enemies: ${remainingAliens}`, 20, 120);
      
      if (isTwoPlayerMode) {
        ctx.fillText(`Player ${currentPlayer}`, 600, 30);
      }

      // Continuar el loop
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, drawPacman, drawGhost, drawBarrier, drawExplosion, playSound, isTwoPlayerMode, currentPlayer, onPlayerDeath, getDifficultySettings, handleSaveScore]);

  const restartGame = () => {
    setUserInteracted(true);
    initAudioContext();
    initGame();
  };

  const goToHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="fullscreen-game-container">
      <div className="game-content">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="game-canvas"
          style={{ background: '#000011' }}
          tabIndex={0}
        />

        {/* Controles móviles */}
        {isMobile && (
          <div className="mobile-controls">
            <div className="mobile-controls-row">
              <button 
                className="mobile-btn move-btn"
                onTouchStart={() => handleMobileControl('left')}
                onMouseDown={() => handleMobileControl('left')}
              >
                ←
              </button>
              <button 
                className="mobile-btn shoot-btn"
                onTouchStart={() => handleMobileControl('shoot')}
                onMouseDown={() => handleMobileControl('shoot')}
              >
                🔫
              </button>
              <button 
                className="mobile-btn move-btn"
                onTouchStart={() => handleMobileControl('right')}
                onMouseDown={() => handleMobileControl('right')}
              >
                →
              </button>
            </div>
            <div className="mobile-controls-info">
              <span>Toca los botones para jugar</span>
            </div>
          </div>
        )}

        {/* Modal de Game Over centrado */}
        {gameState.gameOver && (
          <div className="game-over-modal">
            <div className="game-over-content">
              <h1 className="game-over-title">¡Game Over!</h1>
              <div className="game-over-emoji">☠️</div>
              <p className="game-over-subtitle">
                {isTwoPlayerMode ? `Jugador ${currentPlayer}` : 'Puntaje Final'}
              </p>
              <p className="game-over-score">{gameState.score}</p>
              <p className="game-over-level">Nivel Alcanzado: {gameState.level}</p>
              
              {savingScore && (
                <p className="saving-score">Guardando puntaje...</p>
              )}
              
              <div className="game-over-buttons">
                <button
                  onClick={restartGame}
                  className="game-over-btn primary"
                >
                  {isTwoPlayerMode ? 'Siguiente Jugador' : 'Jugar de Nuevo'}
                </button>
                <button
                  onClick={goToHome}
                  className="game-over-btn secondary"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles para desktop */}
      {!isMobile && (
        <div className="game-controls">
          <p className="controls-title">Controles:</p>
          <div className="controls-list">
            <span className="control-item">← → Mover</span>
            <span className="control-item">ESPACIO Disparar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;