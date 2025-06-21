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

        // Botones del Ministerio de Guerra
        const increaseArmyBtn = document.getElementById('increase-army-btn');
        const trainArmyBtn = document.getElementById('train-army-btn');

        if (increaseArmyBtn) {
            increaseArmyBtn.addEventListener('click', () => {
                this.increaseArmy();
            });
        }

        if (trainArmyBtn) {
            trainArmyBtn.addEventListener('click', () => {
                this.trainArmy();
            });
        }

        const attackBtn = document.getElementById('attack-btn');
        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                this.showAttackModal();
            });
        }

        const closeBattleModalBtn = document.getElementById('close-battle-modal');
        if (closeBattleModalBtn) {
            closeBattleModalBtn.addEventListener('click', () => {
                this.hideBattleModal();
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
        this.updateWarMinistryPanel();
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

        // Actualizar población
        const populationElement = document.getElementById('player-population');
        if (populationElement) {
            populationElement.textContent = MathUtils.format(playerCountry.population);
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
        const availablePoints = playerCountry.developmentPoints;

        // Actualizar puntos disponibles
        const availableElement = document.getElementById('available-points');
        if (availableElement) {
            availableElement.textContent = availablePoints;
        }

        // Actualizar estado de botones de desarrollo
        Object.keys(playerCountry.stats).forEach(stat => {
            const addBtn = document.querySelector(`.dev-btn[data-stat="${stat}"]`);
            if (addBtn) {
                addBtn.disabled = availablePoints <= 0;
            }
        });
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
    showVictoryModal(winner, customMessage = null) {
        const modal = document.getElementById('victory-modal');
        const messageEl = document.getElementById('victory-message');
        const statsEl = document.getElementById('final-stats');

        if (!modal || !messageEl || !statsEl) {
            console.error('Error: No se pudo encontrar el modal de victoria o sus elementos.');
            return;
        }

        const playerCountry = this.game.getPlayerCountry();
        const allCountries = this.game.countryManager.getAllCountries();
        const rankedCountries = allCountries.map(country => {
            const totalScore = this.game.countryManager.getTotalPower(country);
            return { ...country, totalScore };
        }).sort((a, b) => b.totalScore - a.totalScore);

        // Determinar el ganador si no se pasó uno (por fin de tiempo)
        if (!winner && rankedCountries.length > 0) {
            winner = rankedCountries[0];
        }
        
        const titleEl = modal.querySelector('.modal-header h2');

        if (playerCountry.population <= 0 || (winner && winner.id !== playerCountry.id && customMessage)) {
            // Derrota
            titleEl.textContent = '¡Derrota!';
            messageEl.innerHTML = `<p>${customMessage || `La nación de <strong>${winner.name}</strong> ha alcanzado la supremacía.`}</p>`;
        } else {
            // Victoria
            titleEl.textContent = '¡Victoria!';
            const winningStat = Object.keys(winner.stats).find(stat => winner.stats[stat] >= 100) || 'Puntuación';
            const statDisplayName = EventTypes.getStatDisplayName(winningStat);
            messageEl.innerHTML = `<p>¡La nación de <strong>${winner.name}</strong> ha alcanzado la Supremacía por <strong>${statDisplayName}</strong>!</p>`;
        }

        let statsHtml = '<ul class="ranking-list">';
        rankedCountries.forEach((country, index) => {
            const isWinner = winner && country.id === winner.id;
            const isPlayer = country.id === playerCountry.id;
            const playerIndicator = isPlayer ? ' (Tú)' : '';
            const winnerIndicator = isWinner ? ' 🏆' : '';

            statsHtml += `
                <li class="ranking-item ${isWinner ? 'winner' : ''} ${isPlayer ? 'player' : ''}">
                    <span class="rank">#${index + 1}</span>
                    <span class="country-name">${country.name}${playerIndicator}${winnerIndicator}</span>
                    <span class="country-score">${MathUtils.format(country.totalScore)} Pts</span>
                    <span class="country-population">${MathUtils.format(country.population)} Hab.</span>
                </li>
            `;
        });
        statsHtml += '</ul>';

        statsEl.innerHTML = statsHtml;
        modal.classList.remove('hidden');
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

        // Verificar si hay puntos disponibles
        if (playerCountry.developmentPoints <= 0) return;

        // Aplicar inmediatamente 1 punto a la estadística
        const development = { [stat]: 1 };
        const success = this.game.applyDevelopment(development);
        
        if (success) {
            // Actualizar la interfaz inmediatamente
            this.updateDisplay();
        }
    }

    // --- Lógica del Ministerio de Guerra ---

    /**
     * Aumenta el ejército del país del jugador
     */
    increaseArmy() {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.increaseArmy(playerCountry.id);
        
        if (success) {
            this.updateDisplay();
            this.game.showNotification('Ejército aumentado exitosamente');
        } else {
            this.game.showNotification('No se puede aumentar el ejército. Verifica los requisitos.');
        }
    }

    /**
     * Entrena el ejército del país del jugador
     */
    trainArmy() {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.trainArmy(playerCountry.id);
        
        if (success) {
            this.updateDisplay();
            this.game.showNotification('Ejército entrenado exitosamente');
        } else {
            this.game.showNotification('No se puede entrenar el ejército. Se requieren 10 puntos de poder militar.');
        }
    }

    /**
     * Actualiza el panel del Ministerio de Guerra
     */
    updateWarMinistryPanel() {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const armyInfo = this.game.countryManager.getArmyInfo(playerCountry);
        if (!armyInfo) return;

        // Actualizar estadísticas del ejército
        const armyCurrent = document.getElementById('army-current');
        const armyMax = document.getElementById('army-max');
        const armyFill = document.getElementById('army-fill');
        const armyExperience = document.getElementById('army-experience');
        const militaryPower = document.getElementById('military-power');
        const totalPower = document.getElementById('total-power');

        if (armyCurrent) armyCurrent.textContent = armyInfo.current;
        if (armyMax) armyMax.textContent = armyInfo.max;
        if (armyFill) armyFill.style.width = `${armyInfo.percentage}%`;
        if (armyExperience) armyExperience.textContent = armyInfo.experience;
        if (militaryPower) militaryPower.textContent = MathUtils.format(armyInfo.militaryPower);
        if (totalPower) totalPower.textContent = MathUtils.format(armyInfo.totalPower);

        // Actualizar estrellas de experiencia
        const stars = document.querySelectorAll('.experience-stars .star');
        stars.forEach((star, index) => {
            const level = index + 1;
            if (level <= armyInfo.experience) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });

        // Actualizar botones y costos
        const increaseArmyBtn = document.getElementById('increase-army-btn');
        const trainArmyBtn = document.getElementById('train-army-btn');
        const increaseArmyCost = document.getElementById('increase-army-cost');
        const trainArmyCost = document.getElementById('train-army-cost');

        if (increaseArmyBtn) {
            increaseArmyBtn.disabled = !armyInfo.canIncrease;
        }

        if (trainArmyBtn) {
            trainArmyBtn.disabled = !armyInfo.canTrain;
        }

        if (increaseArmyCost) {
            increaseArmyCost.textContent = `Costo: Social -${armyInfo.increaseCost.social}, Economía -${armyInfo.increaseCost.economy}`;
        }

        if (trainArmyCost) {
            trainArmyCost.textContent = `Costo: Militar -${armyInfo.trainCost}`;
        }
    }

    // --- Lógica del Modal de Batalla ---

    showAttackModal() {
        const modal = document.getElementById('battle-modal');
        const modalTitle = document.getElementById('battle-modal-title');
        const modalBody = document.getElementById('battle-modal-body');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = 'Lanzar Ataque';

        const otherCountries = this.game.getAttackableEnemies();
        if (otherCountries.length === 0) {
            modalBody.innerHTML = '<p>No hay otras naciones que atacar.</p>';
            modal.classList.remove('hidden');
            return;
        }

        let enemyListHtml = '<div class="battle-enemy-list">';
        otherCountries.forEach(country => {
            const armyInfo = this.game.countryManager.getArmyInfo(country);
            enemyListHtml += `
                <div class="battle-enemy-item">
                    <div class="battle-enemy-info">
                        <h4>${country.name}</h4>
                        <div class="battle-enemy-intel">
                            <p>Población: <span>${MathUtils.format(country.population)}</span></p>
                            <p>Poder: <span>${MathUtils.format(armyInfo.totalPower)}</span></p>
                            <p>Ejército: <span>${MathUtils.format(armyInfo.current)}</span></p>
                        </div>
                    </div>
                    <button class="battle-attack-btn" data-id="${country.id}">Atacar</button>
                </div>
            `;
        });
        enemyListHtml += '</div>';

        modalBody.innerHTML = enemyListHtml;

        // Añadir event listeners a los nuevos botones de atacar
        modalBody.querySelectorAll('.battle-attack-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const defenderId = e.target.dataset.id;
                this.startBattle(defenderId);
            });
        });

        modal.classList.remove('hidden');
    }

    hideBattleModal() {
        const modal = document.getElementById('battle-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    startBattle(defenderId) {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const battleReport = this.game.countryManager.simulateBattle(playerCountry.id, defenderId);

        this.showBattleResults(battleReport);
    }

    showBattleResults(report) {
        const modalTitle = document.getElementById('battle-modal-title');
        const modalBody = document.getElementById('battle-modal-body');

        modalTitle.textContent = 'Reporte de Batalla';

        let resultClass;
        switch (report.result) {
            case 'Victoria': resultClass = 'victory'; break;
            case 'Derrota': resultClass = 'defeat'; break;
            case 'Empate': resultClass = 'draw'; break;
        }

        let resultsHtml = `
            <div class="battle-result-view">
                <h3 class="battle-result-title ${resultClass}">${report.result}</h3>
                <div class="casualties-container">
                    <div class="casualty-box">
                        <h4>Bajas de ${report.attacker.name}</h4>
                        <p>${MathUtils.format(report.attacker.casualties)}</p>
                    </div>
                    <div class="casualty-box">
                        <h4>Bajas de ${report.defender.name}</h4>
                        <p>${MathUtils.format(report.defender.casualties)}</p>
                    </div>
                </div>
                <div id="battle-options-container">
                    <!-- Aquí se cargarán las opciones post-batalla -->
                </div>
            </div>
        `;
        modalBody.innerHTML = resultsHtml;

        // Cargar las opciones correspondientes
        this.loadPostBattleOptions(report);
    }

    loadPostBattleOptions(report) {
        const optionsContainer = document.getElementById('battle-options-container');
        let optionsHtml = '';

        switch (report.result) {
            case 'Victoria':
                const defender = this.game.countryManager.getCountryById(report.defender.id);
                const canConquer = defender && defender.army <= 0;
                
                optionsHtml = `
                    <h3>Has ganado la batalla. ¿Qué harás ahora?</h3>
                    <div class="battle-options-buttons">
                        <button id="raze-btn" class="control-btn">Arrasar</button>
                        <button id="conquer-btn" class="control-btn" ${!canConquer ? 'disabled' : ''} title="${!canConquer ? 'El ejército enemigo debe ser aniquilado para conquistar.' : 'Anexa la nación y su población.'}">Conquistar</button>
                    </div>
                `;
                optionsContainer.innerHTML = optionsHtml;

                document.getElementById('raze-btn').addEventListener('click', () => {
                    this.game.countryManager.razeCountry(report.attacker.id, report.defender.id);
                    this.game.showNotification(`${report.defender.name} ha sido arrasado.`);
                    this.hideBattleModal();
                    this.updateDisplay();
                });

                if (canConquer) {
                    document.getElementById('conquer-btn').addEventListener('click', () => {
                        this.game.countryManager.conquerCountry(report.attacker.id, report.defender.id);
                        this.game.showNotification(`${report.defender.name} ha sido conquistado.`);
                        this.hideBattleModal();
                        this.updateDisplay();
                    });
                }
                break;

            case 'Derrota':
                // Por ahora, la IA siempre arrasará al jugador
                this.game.countryManager.razeCountry(report.defender.id, report.attacker.id);
                optionsHtml = `
                    <h3>Has sido derrotado.</h3>
                    <p>La nación de ${report.defender.name} ha decidido arrasar tus tierras como castigo.</p>
                    <button id="continue-battle-btn" class="control-btn">Continuar</button>
                `;
                optionsContainer.innerHTML = optionsHtml;

                document.getElementById('continue-battle-btn').addEventListener('click', () => {
                    this.hideBattleModal();
                    this.updateDisplay();
                    // Verificar si el jugador perdió el juego
                    if (this.game.getPlayerCountry().population <= 0) {
                        this.game.endGame(null, 'Tu nación ha sido aniquilada.');
                    }
                });
                break;
            
            case 'Empate':
            default:
                optionsHtml = `
                    <h3>La batalla ha terminado en un punto muerto.</h3>
                    <p>Ambos ejércitos se retiran para lamer sus heridas.</p>
                    <button id="continue-battle-btn" class="control-btn">Continuar</button>
                `;
                optionsContainer.innerHTML = optionsHtml;

                document.getElementById('continue-battle-btn').addEventListener('click', () => {
                    this.hideBattleModal();
                    this.updateDisplay();
                });
                break;
        }
    }
} 