/**
 * Juego principal Worldx
 */
class WorldxGame {
    constructor() {
        this.countryManager = new CountryManager();
        this.eventSystem = new EventSystem();
        this.aiController = new AIController();
        this.gameLoop = new GameLoop(this);
        this.uiManager = new UIManager();
        
        this.currentYear = 0; // Se mantiene como 'year' pero representa semanas
        this.currentDay = 1;  // Día de la semana (1-7)
        this.gameSpeed = 0; // 0: pausa, 1: x1, 2: x2, 4: x4

        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.isPaused = false;
        this.maxYears = 100; // 100 semanas de juego
        
        // Configurar referencias
        this.aiController.setCountryManager(this.countryManager);
        
        // Hacer disponible globalmente
        window.worldxGame = this;
    }

    /**
     * Inicializa el juego
     */
    init() {
        console.log('Inicializando Worldx...');
        
        // Inicializar UI
        this.uiManager.init(this);
        
        // Mostrar menú principal
        this.showMainMenu();
    }

    /**
     * Muestra el menú principal
     */
    showMainMenu() {
        const gameContainer = document.getElementById('game-container');
        const menuContainer = document.getElementById('menu-container');
        
        if (gameContainer && menuContainer) {
            gameContainer.classList.add('hidden');
            menuContainer.classList.remove('hidden');
        }
    }

    /**
     * Inicia el proceso de una nueva partida mostrando la modal de configuración
     */
    newGame() {
        this.uiManager.showNewGameModal();
    }

    /**
     * Comienza el juego con la configuración elegida
     * @param {string} countryName - El nombre para el país del jugador
     */
    startGame(countryName) {
        console.log(`Iniciando nueva partida para ${countryName}...`);
        
        // Ocultar menú y modales
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {
            menuContainer.classList.add('hidden');
        }
        this.uiManager.hideNewGameModal();

        // Mostrar juego
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
        }

        // Inicializar países con el nombre personalizado
        this.countryManager.initializeCountries(countryName);
        
        // Configurar estado del juego
        this.currentYear = 0;
        this.currentDay = 1;
        this.gameState = 'playing';
        
        // Actualizar UI
        this.uiManager.updateDisplay();
        this.uiManager.updateDayDisplay(this.currentDay);
        
        // Iniciar game loop
        this.setSpeed(1); // Iniciar a velocidad x1 por defecto
        if (!this.gameLoop.isRunning) {
            this.gameLoop.start();
        }
        
        console.log('Partida iniciada. Países:', this.countryManager.getAllCountries().map(c => c.name));
    }

    /**
     * Actualiza el juego CADA DÍA
     */
    updateDay() {
        if (this.gameState !== 'playing') return;

        // Avanzar día
        this.currentDay++;

        // Si es el final de la semana, actualizar la lógica principal
        if (this.currentDay > 7) {
            this.currentDay = 1;
            this.updateWeek();
        }

        // Actualizar UI del día
        this.uiManager.updateDayDisplay(this.currentDay);
    }

    /**
     * Actualiza la lógica principal del juego CADA SEMANA
     */
    updateWeek() {
        // Verificar fin del juego
        if (this.currentYear >= this.maxYears) {
            this.endGame();
            return;
        }

        // Avanzar semana
        this.currentYear++;
        
        // Añadir puntos de desarrollo semanales
        this.countryManager.addAnnualDevelopmentPoints(1);
        
        // Generar eventos cada 4 semanas
        if (this.currentYear % 4 === 0) {
            this.generateYearlyEvents();
        }
        
        // Tomar decisiones de IA
        this.aiController.makeDecisions(this.countryManager.getAICountries());
        
        // Verificar victoria
        const winner = this.countryManager.getWinner();
        if (winner) {
            this.endGame(winner);
            return;
        }
        
        // Actualizar UI
        this.uiManager.updateDisplay();
        
        console.log(`Semana ${this.currentYear} completada`);
    }

    /**
     * Genera eventos anuales
     */
    generateYearlyEvents() {
        const countries = this.countryManager.getAllCountries();
        const events = this.eventSystem.generateYearlyEvents(countries, this.currentYear);
        
        // Mostrar eventos al jugador
        events.forEach(({ event, country }) => {
            if (country.id === this.countryManager.getPlayerCountry().id) {
                this.uiManager.addPendingEvent(event, country);
            }
        });
        
        // Mostrar primer evento si hay
        if (this.uiManager.pendingEvents.length > 0) {
            setTimeout(() => {
                this.uiManager.showNextEvent();
            }, 500);
        }
    }

    /**
     * Aplica desarrollo del jugador
     */
    applyDevelopment(development) {
        const playerCountry = this.countryManager.getPlayerCountry();
        if (!playerCountry) return false;

        const success = this.countryManager.applyDevelopment(playerCountry.id, development);
        
        if (success) {
            // Verificar edad dorada
            if (playerCountry.goldenAgeTriggered) {
                this.uiManager.eventModal.showSpecialEvent('golden-age', {
                    country: playerCountry,
                    triggerStat: Object.keys(development).reduce((a, b) => development[a] > development[b] ? a : b)
                }, false);
            }
            
            // Verificar victoria
            if (this.countryManager.checkVictory(playerCountry)) {
                this.endGame(playerCountry);
                return true;
            }
            
            // Actualizar UI
            this.uiManager.updateDisplay();
        }
        
        return success;
    }

    /**
     * Pausa el juego
     */
    pauseGame() {
        this.setSpeed(0);
    }

    /**
     * Reanuda el juego
     */
    resumeGame() {
        if (this.gameSpeed === 0) {
            this.setSpeed(1); // Reanudar a x1 por defecto
        } else {
            this.setSpeed(this.gameSpeed);
        }
    }

    /**
     * Alterna la pausa
     */
    togglePause() {
        if (this.gameSpeed > 0) {
            this.setSpeed(0);
        } else {
            this.setSpeed(1); // Reanudar a x1
        }
    }

    /**
     * Establece la velocidad del juego
     * @param {number} speed - 0: pausa, 1: x1, 2: x2, 4: x4
     */
    setSpeed(speed) {
        this.gameSpeed = speed;
        let timestep = 0;

        switch (speed) {
            case 0: // Pausa
                this.gameLoop.pause();
                break;
            case 1: // x1 (3s por día)
                timestep = 3000;
                break;
            case 2: // x2 (1s por día)
                timestep = 1000;
                break;
            case 4: // x4 (1s por semana => 1/7s por día)
                timestep = 1000 / 7;
                break;
        }

        if (speed > 0) {
            this.gameLoop.setSpeed(timestep);
            if (!this.gameLoop.isRunning) {
                this.gameLoop.resume();
            }
        }
        
        this.uiManager.updateSpeedControls(speed);
    }

    /**
     * Termina el juego
     */
    endGame(winner = null) {
        this.gameState = 'gameOver';
        this.gameLoop.stop();
        
        if (winner) {
            // Mostrar modal de victoria
            this.uiManager.eventModal.showSpecialEvent('victory', {
                winner: winner,
                winningStat: Object.keys(winner.stats).reduce((a, b) => winner.stats[a] > winner.stats[b] ? a : b)
            });
        } else {
            // Mostrar estadísticas finales
            this.uiManager.eventModal.showSpecialEvent('game-over', {
                countries: this.countryManager.getAllCountries()
            });
        }
        
        console.log('Juego terminado');
    }

    /**
     * Guarda el juego
     */
    saveGame() {
        const gameState = {
            countryManager: this.countryManager.saveGameState(),
            eventSystem: {
                activeEvents: this.eventSystem.getActiveEvents()
            },
            currentYear: this.currentYear,
            gameState: this.gameState,
            timestamp: Date.now()
        };
        
        localStorage.setItem('worldx_save', JSON.stringify(gameState));
        console.log('Juego guardado');
        
        // Mostrar notificación
        this.showNotification('Juego guardado exitosamente');
    }

    /**
     * Carga el juego
     */
    loadGame() {
        const savedGame = localStorage.getItem('worldx_save');
        if (!savedGame) {
            this.showNotification('No hay partida guardada');
            return;
        }
        
        try {
            const gameState = JSON.parse(savedGame);
            
            // Cargar estado
            this.countryManager.loadGameState(gameState.countryManager);
            this.currentYear = gameState.currentYear;
            this.gameState = gameState.gameState;
            
            // Mostrar juego
            const gameContainer = document.getElementById('game-container');
            const menuContainer = document.getElementById('menu-container');
            
            if (gameContainer && menuContainer) {
                gameContainer.classList.remove('hidden');
                menuContainer.classList.add('hidden');
            }
            
            // Actualizar UI
            this.uiManager.updateDisplay();
            
            // Reanudar juego si estaba en juego
            if (this.gameState === 'playing') {
                this.gameLoop.start();
            }
            
            console.log('Juego cargado');
            this.showNotification('Juego cargado exitosamente');
            
        } catch (error) {
            console.error('Error al cargar el juego:', error);
            this.showNotification('Error al cargar el juego');
        }
    }

    /**
     * Muestra una notificación
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        gsap.fromTo(notification, 
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.3 }
        );
        
        // Remover después de 3 segundos
        setTimeout(() => {
            gsap.to(notification, {
                opacity: 0,
                y: -50,
                duration: 0.3,
                onComplete: () => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }
            });
        }, 3000);
    }

    /**
     * Obtiene el año actual (que ahora es semana)
     */
    getCurrentYear() {
        return this.currentYear;
    }

    /**
     * Obtiene el país del jugador
     */
    getPlayerCountry() {
        return this.countryManager.getPlayerCountry();
    }

    /**
     * Obtiene información de otros países
     */
    getOtherCountriesIntel() {
        const playerCountry = this.getPlayerCountry();
        if (!playerCountry) return [];
        
        return this.countryManager.getOtherCountriesIntel(playerCountry.id);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new WorldxGame();
    game.init();
    
    // Configurar event listeners adicionales
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            game.newGame();
        });
    }
    
    const loadGameBtn = document.getElementById('load-game-btn');
    if (loadGameBtn) {
        loadGameBtn.addEventListener('click', () => {
            game.loadGame();
        });
    }
    
    console.log('Worldx inicializado correctamente');
}); 