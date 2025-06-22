/**
 * Módulo para gestionar la lógica de desarrollo
 */
class UIDevelopmentManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Actualiza el panel de desarrollo
     */
    updatePanel() {
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
     * Incrementa una estadística
     */
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
            this.uiManager.updateDisplay();
        }
    }
} 