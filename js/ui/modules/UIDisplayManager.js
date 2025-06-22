/**
 * Módulo para gestionar todas las actualizaciones de display
 */
class UIDisplayManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
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
     * Actualiza el display de economía en la barra superior
     */
    updateEconomyDisplay() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const economicInfo = this.game.countryManager.getAdvancedEconomicInfo(playerCountry.id);
        if (!economicInfo) return;

        const moneyElement = document.getElementById('player-money');
        const incomeElement = document.getElementById('player-income');

        if (moneyElement) {
            moneyElement.textContent = `$${Math.floor(playerCountry.money).toLocaleString()}`;
        }

        if (incomeElement) {
            const netIncome = economicInfo.totalIncome - (playerCountry.armyMaintenanceCost || 0);
            incomeElement.textContent = `(${netIncome >= 0 ? '+' : ''}${netIncome.toLocaleString()})`;
            incomeElement.style.color = netIncome >= 0 ? '#90EE90' : '#ff6b6b';
        }
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
} 