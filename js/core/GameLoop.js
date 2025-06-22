/**
 * Game Loop principal para Worldx
 */
class GameLoop {
    constructor(game) {
        this.game = game;
        this.isRunning = false;
        this.lastTime = 0;
        this.gameTickAccumulator = 0; // Acumulador para la lógica del juego (días, semanas)
        this.economyAccumulator = 0;  // Acumulador separado para la economía
        this.timestep = 1000; // 1 segundo por día (se ajustará por la velocidad)
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

        // Incrementar ambos acumuladores
        this.gameTickAccumulator += deltaTime;
        this.economyAccumulator += deltaTime;

        // Actualizar economía cada segundo (1000ms), sin afectar el tick del juego
        if (this.economyAccumulator >= 1000) {
            this.updateEconomy();
            this.economyAccumulator -= 1000;
        }

        // Actualizar juego en intervalos fijos basado en su propio acumulador
        while (this.gameTickAccumulator >= this.timestep) {
            this.update();
            this.gameTickAccumulator -= this.timestep;
        }

        // Renderizar en cada frame
        this.render();

        this.frameId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Actualiza la economía
     */
    updateEconomy() {
        if (this.game.gameState === 'playing') {
            // El cálculo de ingresos/gastos ya se hace en el loop principal.
            // Esta función solo se asegura de que la UI se actualice.
            this.game.uiManager.updateEconomyDisplay();
        }
    }

    /**
     * Actualiza la lógica del juego
     */
    update() {
        if (this.game.gameState === 'playing' && this.game.gameSpeed > 0) {
            // Actualizar economía y luego el día
            this.game.countryManager.updateEconomy();
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