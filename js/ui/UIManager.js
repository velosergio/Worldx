/**
 * Gestor de interfaz de usuario para Worldx
 */
class UIManager {
    constructor() {
        this.game = null;
        this.statsDisplay = null;
        this.developmentPanel = null;
        this.eventModal = null;
        this.pendingEvents = [];
        this.pendingDevelopment = {
            military: 0,
            social: 0,
            culture: 0,
            science: 0,
            economy: 0
        };
    }

    /**
     * Inicializa el gestor de UI
     */
    init(game) {
        this.game = game;
        this.statsDisplay = new StatsDisplay();
        this.eventModal = new EventModal();
        
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botones de control
        const pauseBtn = document.getElementById('pause-btn');
        const saveBtn = document.getElementById('save-btn');
        const loadBtn = document.getElementById('load-btn');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.game.togglePause();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.game.saveGame();
            });
        }

        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.game.loadGame();
            });
        }

        // Botón de nueva partida
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.showNewGameModal();
            });
        }

        // Botón de continuar en modales
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.closeEventModal();
            });
        }

        // Cerrar modales
        const closeEventModal = document.getElementById('close-event-modal');
        if (closeEventModal) {
            closeEventModal.addEventListener('click', () => {
                this.closeEventModal();
            });
        }

        // Delegación de eventos para los botones de desarrollo
        const playerPanel = document.querySelector('.player-country-panel');
        if (playerPanel) {
            playerPanel.addEventListener('click', (e) => {
                const target = e.target.closest('.dev-btn');
                if (target && target.dataset.action === 'add') {
                    this.incrementStat(target.dataset.stat);
                }
            });
        }

        // Botón de aplicar desarrollo
        const applyBtn = document.getElementById('apply-development');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyDevelopment();
            });
        }

        // Botones de control
        const speedControls = document.querySelector('.speed-controls');
        if (speedControls) {
            speedControls.addEventListener('click', (e) => {
                const target = e.target.closest('.speed-btn');
                if (target) {
                    const speed = parseInt(target.dataset.speed, 10);
                    this.game.setSpeed(speed);
                }
            });
        }

        // --- Listeners para la modal de nueva partida ---
        const newGameModal = document.getElementById('new-game-modal');
        const randomNameBtn = document.getElementById('random-name-btn');
        const startGameBtn = document.getElementById('start-game-btn');

        if (randomNameBtn) {
            randomNameBtn.addEventListener('click', () => {
                const countryGenerator = new CountryGenerator();
                const nameInput = document.getElementById('country-name-input');
                nameInput.value = countryGenerator.generateCountryName();
            });
        }

        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('country-name-input');
                let countryName = nameInput.value.trim();

                if (countryName === "") {
                    const countryGenerator = new CountryGenerator();
                    countryName = countryGenerator.generateCountryName();
                }
                
                this.game.startGame(countryName);
            });
        }

        // Botón de menú principal en modal de victoria
        const mainMenuBtn = document.getElementById('main-menu-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    /**
     * Actualiza toda la interfaz
     */
    updateDisplay() {
        this.updateYearDisplay();
        this.updatePlayerStats();
        this.updateOtherCountries();
        this.updateDevelopmentPanel();
        this.updateEventsPanel();
    }

    /**
     * Actualiza el display del día
     */
    updateDayDisplay(day) {
        const spinner = document.querySelector('.day-spinner');
        if (!spinner) return;

        // Desactivar todos los días
        spinner.querySelectorAll('.day').forEach(d => d.classList.remove('active'));

        // Activar el día actual
        const currentDayEl = spinner.querySelector(`.day[data-day="${day}"]`);
        if (currentDayEl) {
            currentDayEl.classList.add('active');
        }

        // Posicionar los días en el círculo
        const days = spinner.querySelectorAll('.day');
        const angle = 360 / days.length;
        const radius = 30;

        days.forEach((d, i) => {
            const currentAngle = (angle * i) - 90; // Empezar desde arriba
            const x = Math.cos(currentAngle * Math.PI / 180) * radius;
            const y = Math.sin(currentAngle * Math.PI / 180) * radius;
            d.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    /**
     * Actualiza el display del año (ahora semana)
     */
    updateYearDisplay() {
        const yearElement = document.getElementById('current-year');
        if (yearElement && this.game) {
            yearElement.textContent = this.game.getCurrentYear();
        }
    }

    /**
     * Actualiza las estadísticas del jugador
     */
    updatePlayerStats() {
        const playerCountry = this.game?.getPlayerCountry();
        if (!playerCountry) return;

        // Actualizar nombre del país
        const nameElement = document.getElementById('player-country-name');
        if (nameElement) {
            nameElement.textContent = playerCountry.name;
        }

        // Actualizar estadísticas
        Object.keys(playerCountry.stats).forEach(stat => {
            const valueElement = document.getElementById(`${stat}-value`);
            if (valueElement) {
                valueElement.textContent = MathUtils.format(playerCountry.stats[stat]);
            }

            const fillElement = document.getElementById(`${stat}-fill`);
            if (fillElement) {
                const percentage = (playerCountry.stats[stat] / 100) * 100;
                fillElement.style.width = `${percentage}%`;
                this.updateStatColor(fillElement, playerCountry.stats[stat]);
            }
        });

        // Actualizar puntos disponibles
        const pointsElement = document.getElementById('available-points');
        if (pointsElement) {
            pointsElement.textContent = playerCountry.developmentPoints;
        }

        // Efecto de edad dorada
        if (playerCountry.goldenAgeTriggered) {
            this.showGoldenAgeEffect();
            // Resetear para que no se muestre en cada actualización
            playerCountry.goldenAgeTriggered = false; 
        }
    }

    /**
     * Actualiza el color de una estadística
     */
    updateStatColor(element, value) {
        if (!element) return;

        let color = '#4a90e2'; // Azul por defecto

        if (value >= 80) { // Glorioso
            color = 'linear-gradient(90deg, #ffd700, #ffec8b)';
        } else if (value >= 60) { // Fuerte
            color = 'linear-gradient(90deg, #4caf50, #81c784)';
        } else if (value >= 40) { // Estable
            color = 'linear-gradient(90deg, #8bc34a, #c5e1a5)';
        } else if (value >= 20) { // En desarrollo
            color = 'linear-gradient(90deg, #ffc107, #ffd54f)';
        } else { // Débil
            color = 'linear-gradient(90deg, #f44336, #e57373)';
        }

        element.style.background = color;
    }

    /**
     * Muestra efecto de edad dorada
     */
    showGoldenAgeEffect() {
        const playerPanel = document.querySelector('.player-country-panel');
        if (playerPanel) {
            playerPanel.classList.add('golden-age');
            setTimeout(() => {
                playerPanel.classList.remove('golden-age');
            }, 3000);
        }
    }

    /**
     * Actualiza información de otros países
     */
    updateOtherCountries() {
        const intelList = document.getElementById('other-countries-list');
        const otherCountries = this.game?.getOtherCountriesIntel();

        if (!intelList || !otherCountries) return;

        intelList.innerHTML = '';

        otherCountries.forEach(country => {
            const item = document.createElement('div');
            item.className = 'country-item';
            
            const strengthFormatted = MathUtils.format(country.strength);

            item.innerHTML = `
                <div class="country-name">${country.name}</div>
                <div class="country-rumor">${country.rumor}</div>
                <div class="country-strength">Fuerza: ${strengthFormatted}</div>
            `;
            intelList.appendChild(item);
        });
    }

    /**
     * Actualiza el panel de desarrollo
     */
    updateDevelopmentPanel() {
        if (!this.game || !this.game.getPlayerCountry()) return;

        const playerCountry = this.game.getPlayerCountry();
        const totalUsed = Object.values(this.pendingDevelopment).reduce((a, b) => a + b, 0);
        const availablePoints = playerCountry.developmentPoints - totalUsed;
        const maxPoints = playerCountry.developmentPoints;

        // Actualizar puntos disponibles
        const availableElement = document.getElementById('available-points');
        if (availableElement) {
            availableElement.textContent = availablePoints;
        }

        // Actualizar valores pendientes y estado de botones
        Object.keys(this.pendingDevelopment).forEach(stat => {
            const pendingValueEl = document.querySelector(`[data-stat-pending="${stat}"]`);
            if (pendingValueEl) {
                pendingValueEl.textContent = `+${this.pendingDevelopment[stat]}`;
            }

            const addBtn = document.querySelector(`.dev-btn[data-stat="${stat}"]`);
            if (addBtn) {
                addBtn.disabled = availablePoints <= 0;
            }
        });

        // Actualizar botón de aplicar
        const applyBtn = document.getElementById('apply-development');
        if (applyBtn) {
            applyBtn.disabled = totalUsed === 0;
        }
    }

    /**
     * Actualiza el panel de eventos
     */
    updateEventsPanel() {
        const eventsPanel = document.getElementById('events-panel');
        const eventsList = document.getElementById('events-list');
        
        if (!eventsPanel || !eventsList) return;

        const playerCountry = this.game?.getPlayerCountry();
        if (!playerCountry || !playerCountry.events || playerCountry.events.length === 0) {
            eventsPanel.classList.add('hidden');
            return;
        }

        eventsPanel.classList.remove('hidden');
        eventsList.innerHTML = '';

        // Mostrar últimos 3 eventos
        const recentEvents = playerCountry.events.slice(-3);
        recentEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
            `;
            eventsList.appendChild(eventElement);
        });
    }

    /**
     * Actualiza los botones de control de velocidad
     */
    updateSpeedControls(speed) {
        const speedControls = document.querySelector('.speed-controls');
        if (!speedControls) return;

        // Actualizar botones
        speedControls.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.speed, 10) === speed) {
                btn.classList.add('active');
            }
        });

        // Actualizar animación del spinner
        const spinner = document.querySelector('.day-spinner');
        if (!spinner) return;
        
        spinner.classList.remove('spinning', 'speed-1', 'speed-2', 'speed-4');

        if (speed > 0) {
            spinner.classList.add('spinning', `speed-${speed}`);
        }
    }

    /**
     * Actualiza el botón de pausa
     */
    updatePauseButton(isPaused) {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = isPaused ? '▶️ Reanudar' : '⏸️ Pausar';
        }
    }

    /**
     * Muestra un modal de evento
     */
    showEventModal(event, country) {
        if (this.eventModal) {
            this.eventModal.show(event, country);
        }
    }

    /**
     * Oculta el modal de eventos
     */
    hideEventModal() {
        if (this.eventModal) {
            this.eventModal.hide();
        }
    }

    /**
     * Cierra el modal de eventos
     */
    closeEventModal() {
        this.hideEventModal();
        
        // Mostrar siguiente evento si hay más
        if (this.pendingEvents.length > 0) {
            setTimeout(() => {
                this.showNextEvent();
            }, 500);
        }
    }

    /**
     * Muestra el siguiente evento
     */
    showNextEvent() {
        if (this.pendingEvents.length === 0) return;
        
        const { event, country } = this.pendingEvents.shift();
        this.showEventModal(event, country);
    }

    /**
     * Muestra el modal de victoria
     */
    showVictoryModal(winner) {
        const modal = document.getElementById('victory-modal');
        const message = document.getElementById('victory-message');
        const stats = document.getElementById('final-stats');
        
        if (!modal || !message || !stats) return;

        if (winner) {
            message.textContent = `¡${winner.name} ha alcanzado la victoria!`;
        } else {
            message.textContent = '¡El juego ha terminado en empate!';
        }
        
        // Mostrar estadísticas finales
        const allCountries = this.game.countryManager.getAllCountries();
        let statsHTML = '<h3>Estadísticas Finales:</h3>';
        allCountries.forEach(country => {
            const total = Object.values(country.stats).reduce((sum, stat) => sum + stat, 0);
            statsHTML += `<p><strong>${country.name}:</strong> ${total} puntos totales</p>`;
        });
        stats.innerHTML = statsHTML;
        
        modal.classList.remove('hidden');
    }

    /**
     * Obtiene el desarrollo pendiente
     */
    getPendingDevelopment() {
        return this.developmentPanel ? this.developmentPanel.getPendingDevelopment() : {};
    }

    /**
     * Limpia el desarrollo pendiente
     */
    clearPendingDevelopment() {
        if (this.developmentPanel) {
            this.developmentPanel.clearPendingDevelopment();
        }
    }

    /**
     * Añade un evento a la cola
     */
    addPendingEvent(event, country) {
        this.pendingEvents.push({ event, country });
    }

    // --- Lógica de la Modal de Nueva Partida ---

    showNewGameModal() {
        const modal = document.getElementById('new-game-modal');
        if (!modal) return;

        // Generar un nombre aleatorio por defecto
        const countryGenerator = new CountryGenerator();
        const nameInput = document.getElementById('country-name-input');
        nameInput.value = countryGenerator.generateCountryName();

        modal.classList.remove('hidden');
    }

    hideNewGameModal() {
        const modal = document.getElementById('new-game-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // --- Lógica de Desarrollo ---

    incrementStat(stat) {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const totalUsed = Object.values(this.pendingDevelopment).reduce((a, b) => a + b, 0);
        if (playerCountry.developmentPoints - totalUsed <= 0) return;

        this.pendingDevelopment[stat]++;
        this.updateDevelopmentPanel();
    }

    applyDevelopment() {
        const totalUsed = Object.values(this.pendingDevelopment).reduce((a, b) => a + b, 0);
        if (totalUsed === 0) return;

        if (this.game) {
            const success = this.game.applyDevelopment(this.pendingDevelopment);
            if (success) {
                // Limpiar puntos pendientes después de aplicarlos
                this.pendingDevelopment = {
                    military: 0,
                    social: 0,
                    culture: 0,
                    science: 0,
                    economy: 0
                };
                this.updateDevelopmentPanel();
            }
        }
    }
} 