/**
 * Game Loop principal para Worldx
 */
class GameLoop {
    constructor(game) {
        this.game = game;
        this.isRunning = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000; // 1 segundo por año
        this.frameId = null;
    }

    /**
     * Inicia el game loop
     */
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    /**
     * Detiene el game loop
     */
    stop() {
        this.isRunning = false;
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    /**
     * Loop principal del juego
     */
    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.accumulator += deltaTime;

        // Actualizar juego en intervalos fijos
        while (this.accumulator >= this.timestep) {
            this.update();
            this.accumulator -= this.timestep;
        }

        // Renderizar en cada frame
        this.render();

        this.frameId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Actualiza la lógica del juego
     */
    update() {
        if (this.game.gameState === 'playing' && this.game.gameSpeed > 0) {
            this.game.updateDay();
        }
    }

    /**
     * Renderiza el juego
     */
    render() {
        // El render se maneja principalmente en UIManager
        // No es necesario llamar a updateDisplay aquí, ya que se hace al final de updateWeek
    }

    /**
     * Ajusta la velocidad del juego
     */
    setSpeed(speed) {
        this.timestep = speed;
    }

    /**
     * Obtiene la velocidad actual
     */
    getSpeed() {
        return this.timestep;
    }

    /**
     * Pausa el game loop
     */
    pause() {
        this.isRunning = false;
    }

    /**
     * Reanuda el game loop
     */
    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }

    /**
     * Obtiene el FPS actual
     */
    getFPS() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        return 1000 / deltaTime;
    }
} 