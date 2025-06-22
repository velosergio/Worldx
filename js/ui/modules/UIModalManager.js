/**
 * Módulo para gestionar todos los modales del juego
 */
class UIModalManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Muestra un modal de evento
     */
    showEventModal(event, country) {
        if (this.uiManager.eventModal) {
            this.uiManager.eventModal.show(event, country);
        }
    }

    /**
     * Oculta el modal de eventos
     */
    hideEventModal() {
        if (this.uiManager.eventModal) {
            this.uiManager.eventModal.hide();
        }
    }

    /**
     * Cierra el modal de eventos
     */
    closeEventModal() {
        this.hideEventModal();
        
        // Mostrar siguiente evento o actualizar UI si no hay más
        setTimeout(() => {
            this.showNextEvent();
        }, 300); // Pequeño delay para una transición más suave
    }

    /**
     * Muestra el siguiente evento de la cola
     */
    showNextEvent() {
        if (this.uiManager.pendingEvents.length > 0) {
            const { event, country } = this.uiManager.pendingEvents.shift();
            this.showEventModal(event, country);
        } else {
            // Si no hay más eventos, actualizar la UI
            this.uiManager.updateDisplay();
        }
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
     * Muestra el modal de nueva partida
     */
    showNewGameModal() {
        const modal = document.getElementById('new-game-modal');
        if (!modal) return;

        // Generar un nombre aleatorio por defecto
        const countryGenerator = new CountryGenerator();
        const nameInput = document.getElementById('country-name-input');
        nameInput.value = countryGenerator.generateCountryName();

        modal.classList.remove('hidden');
    }

    /**
     * Oculta el modal de nueva partida
     */
    hideNewGameModal() {
        const modal = document.getElementById('new-game-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
} 