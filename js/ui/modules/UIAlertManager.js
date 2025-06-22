/**
 * Módulo para gestionar el sistema de alertas
 */
class UIAlertManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.alertSystem = uiManager.alertSystem;
    }

    /**
     * Actualiza el panel de alertas
     */
    updatePanel() {
        if (!this.alertSystem) return;
        
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        // Analizar el país y generar alertas
        const alerts = this.alertSystem.analyzeCountry(playerCountry);
        
        // Actualizar alertas en el sistema
        this.alertSystem.clearAllAlerts();
        alerts.forEach(alert => this.alertSystem.addAlert(alert));
        
        // Actualizar la interfaz
        this.renderAlerts();
    }

    /**
     * Renderiza las alertas en la interfaz
     */
    renderAlerts() {
        const alertsList = document.getElementById('alerts-list');
        const alertsCount = document.getElementById('alerts-count');
        
        if (!alertsList || !alertsCount) return;
        
        const alerts = this.alertSystem.getAlerts();
        const criticalCount = this.alertSystem.getCriticalAlertCount();
        
        // Actualizar contador
        alertsCount.textContent = `${alerts.length} alerta${alerts.length !== 1 ? 's' : ''}`;
        if (criticalCount > 0) {
            alertsCount.textContent += ` (${criticalCount} críticas)`;
            alertsCount.style.color = '#ff4444';
        } else {
            alertsCount.style.color = 'rgba(255, 255, 255, 0.7)';
        }
        
        // Limpiar lista actual
        alertsList.innerHTML = '';
        
        if (alerts.length === 0) {
            alertsList.innerHTML = `
                <div class="alert-item info">
                    <div class="alert-header">
                        <div class="alert-title">Sin Alertas</div>
                        <div class="alert-priority low">Info</div>
                    </div>
                    <div class="alert-message">Tu nación está funcionando correctamente. ¡Sigue así!</div>
                </div>
            `;
            return;
        }
        
        // Renderizar cada alerta
        alerts.forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            alertsList.appendChild(alertElement);
        });
    }

    /**
     * Crea un elemento de alerta
     */
    createAlertElement(alert) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${alert.type} ${alert.priority}`;
        
        alertDiv.innerHTML = `
            <div class="alert-header">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-priority ${alert.priority}">${this.getPriorityText(alert.priority)}</div>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-action">💡 ${alert.action}</div>
        `;
        
        return alertDiv;
    }

    /**
     * Obtiene el texto de prioridad
     */
    getPriorityText(priority) {
        const priorityTexts = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        
        return priorityTexts[priority] || 'Media';
    }

    /**
     * Limpia todas las alertas
     */
    clearAllAlerts() {
        if (this.alertSystem) {
            this.alertSystem.clearAllAlerts();
            this.renderAlerts();
        }
    }

    /**
     * Agrega una alerta manual
     */
    addAlert(alert) {
        if (this.alertSystem) {
            this.alertSystem.addAlert(alert);
            this.renderAlerts();
        }
    }
} 