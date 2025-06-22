/**
 * Gestor principal de interfaz de usuario para Worldx
 * Coordina todos los módulos de UI especializados
 */
class UIManager {
    constructor() {
        this.game = null;
        this.statsDisplay = null;
        this.developmentPanel = null;
        this.eventModal = null;
        this.pendingEvents = [];
        this.alertSystem = null;
        
        // Módulos especializados
        this.eventListeners = null;
        this.displayManager = null;
        this.modalManager = null;
        this.developmentManager = null;
        this.warMinistry = null;
        this.economicMinistry = null;
        this.investmentManager = null;
        this.alertManager = null;
    }

    /**
     * Inicializa el gestor de UI
     */
    init(game) {
        this.game = game;
        this.statsDisplay = new StatsDisplay();
        this.eventModal = new EventModal();
        this.alertSystem = new AlertSystem();
        
        // Inicializar módulos especializados
        this.initializeModules();
        
        // Configurar event listeners
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * Inicializa todos los módulos especializados
     */
    initializeModules() {
        // Event Listeners Manager
        this.eventListeners = new UIEventListeners(this);
        
        // Display Manager
        this.displayManager = new UIDisplayManager(this);
        
        // Modal Manager
        this.modalManager = new UIModalManager(this);
        
        // Development Manager
        this.developmentManager = new UIDevelopmentManager(this);
        
        // War Ministry UI
        this.warMinistry = new UIWarMinistry(this);
        
        // Economic Ministry UI
        this.economicMinistry = new UIEconomicMinistry(this);
        
        // Investment Manager
        this.investmentManager = new UIInvestmentManager(this);
        
        // Alert Manager
        this.alertManager = new UIAlertManager(this);
    }

    /**
     * Configura los event listeners principales
     */
    setupEventListeners() {
        if (this.eventListeners) {
            this.eventListeners.setupAllListeners();
        }
    }

    /**
     * Actualiza toda la interfaz
     */
    updateDisplay() {
        if (!this.game) return;

        // Llama a los métodos de actualización de cada módulo
        this.displayManager.updateYearDisplay();
        this.displayManager.updatePlayerStats();
        this.displayManager.updateEconomyDisplay();
        this.displayManager.updateOtherCountries();
        this.displayManager.updateEventsPanel();
        
        // Actualiza los paneles principales que UIDisplayManager no maneja
        this.updateWarMinistryPanel();
        this.updateEconomicMinistryPanel();
        this.updateAlertsPanel();
    }

    // --- Métodos delegados a módulos especializados ---

    /**
     * Actualiza el display del día
     */
    updateDayDisplay(day) {
        if (this.displayManager) {
            this.displayManager.updateDayDisplay(day);
        }
    }

    /**
     * Actualiza el display del año (ahora semana)
     */
    updateYearDisplay() {
        if (this.displayManager) {
            this.displayManager.updateYearDisplay();
        }
    }

    /**
     * Actualiza las estadísticas del jugador
     */
    updatePlayerStats() {
        if (this.displayManager) {
            this.displayManager.updatePlayerStats();
        }
    }

    /**
     * Actualiza información de otros países
     */
    updateOtherCountries() {
        if (this.displayManager) {
            this.displayManager.updateOtherCountries();
        }
    }

    /**
     * Actualiza el panel de desarrollo
     */
    updateDevelopmentPanel() {
        if (this.developmentManager) {
            this.developmentManager.updatePanel();
        }
    }

    /**
     * Actualiza el panel de eventos
     */
    updateEventsPanel() {
        if (this.displayManager) {
            this.displayManager.updateEventsPanel();
        }
    }

    /**
     * Actualiza los botones de control de velocidad
     */
    updateSpeedControls(speed) {
        if (this.displayManager) {
            this.displayManager.updateSpeedControls(speed);
        }
    }

    /**
     * Actualiza el botón de pausa
     */
    updatePauseButton(isPaused) {
        if (this.displayManager) {
            this.displayManager.updatePauseButton(isPaused);
        }
    }

    /**
     * Muestra un modal de evento
     */
    showEventModal(event, country) {
        if (this.modalManager) {
            this.modalManager.showEventModal(event, country);
        }
    }

    /**
     * Oculta el modal de eventos
     */
    hideEventModal() {
        if (this.modalManager) {
            this.modalManager.hideEventModal();
        }
    }

    /**
     * Cierra el modal de eventos
     */
    closeEventModal() {
        if (this.modalManager) {
            this.modalManager.closeEventModal();
        }
    }

    /**
     * Muestra el siguiente evento
     */
    showNextEvent() {
        if (this.modalManager) {
            this.modalManager.showNextEvent();
        }
    }

    /**
     * Muestra el modal de victoria
     */
    showVictoryModal(winner, customMessage = null) {
        if (this.modalManager) {
            this.modalManager.showVictoryModal(winner, customMessage);
        }
    }

    /**
     * Añade un evento a la cola
     */
    addPendingEvent(event, country) {
        this.pendingEvents.push({ event, country });
    }

    /**
     * Muestra el modal de nueva partida
     */
    showNewGameModal() {
        if (this.modalManager) {
            this.modalManager.showNewGameModal();
        }
    }

    /**
     * Oculta el modal de nueva partida
     */
    hideNewGameModal() {
        if (this.modalManager) {
            this.modalManager.hideNewGameModal();
        }
    }

    /**
     * Incrementa una estadística
     */
    incrementStat(stat) {
        if (this.developmentManager) {
            this.developmentManager.incrementStat(stat);
        }
    }

    /**
     * Aumenta el ejército del país del jugador
     */
    increaseArmy() {
        if (this.warMinistry) {
            this.warMinistry.increaseArmy();
            this.updateWarMinistryPanel();
        }
    }

    /**
     * Entrena el ejército del país del jugador
     */
    trainArmy() {
        if (this.warMinistry) {
            this.warMinistry.trainArmy();
        }
    }

    /**
     * Actualiza el panel del Ministerio de Guerra
     */
    updateWarMinistryPanel() {
        if (this.warMinistry) {
            this.warMinistry.updatePanel();
        }
    }

    /**
     * Muestra el modal de ataque
     */
    showAttackModal() {
        if (this.warMinistry) {
            this.warMinistry.showAttackModal();
        }
    }

    /**
     * Oculta el modal de batalla
     */
    hideBattleModal() {
        if (this.warMinistry) {
            this.warMinistry.hideBattleModal();
        }
    }

    /**
     * Actualiza el display de economía en la barra superior
     */
    updateEconomyDisplay() {
        if (this.economicMinistry) {
            this.economicMinistry.updateEconomyDisplay();
        }
    }

    /**
     * Actualiza toda la interfaz del Ministerio de Economía
     */
    updateEconomicMinistryPanel() {
        if (this.economicMinistry) {
            this.economicMinistry.updatePanel();
        }
    }

    /**
     * Construye o mejora una industria
     */
    buildIndustry(industryType) {
        if (this.economicMinistry) {
            this.economicMinistry.buildIndustry(industryType);
        }
    }

    /**
     * Construye una infraestructura
     */
    buildInfrastructure(infrastructureType) {
        if (this.economicMinistry) {
            this.economicMinistry.buildInfrastructure(infrastructureType);
        }
    }

    /**
     * Actualiza el panel de inversiones
     */
    updateInvestmentPanel() {
        if (this.investmentManager) {
            this.investmentManager.updatePanel();
        }
    }

    /**
     * Invierte en bonos del estado
     */
    investInBonds() {
        if (this.investmentManager) {
            this.investmentManager.investInBonds();
        }
    }

    /**
     * Invierte en fondo de desarrollo
     */
    investInDevelopmentFund() {
        if (this.investmentManager) {
            this.investmentManager.investInDevelopmentFund();
        }
    }

    /**
     * Crea reservas de emergencia
     */
    investInEmergencyReserves() {
        if (this.investmentManager) {
            this.investmentManager.investInEmergencyReserves();
        }
    }

    /**
     * Actualiza el panel de alertas
     */
    updateAlertsPanel() {
        if (this.alertManager) {
            this.alertManager.updatePanel();
        }
    }

    /**
     * Limpia todas las alertas
     */
    clearAllAlerts() {
        if (this.alertManager) {
            this.alertManager.clearAllAlerts();
        }
    }

    /**
     * Agrega una alerta manual
     */
    addAlert(alert) {
        if (this.alertManager) {
            this.alertManager.addAlert(alert);
        }
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        if (this.displayManager) {
            this.displayManager.showNotification(message, type);
        }
    }
} 