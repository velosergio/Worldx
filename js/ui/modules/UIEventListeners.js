/**
 * Módulo para gestionar todos los event listeners de la UI
 */
class UIEventListeners {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Configura todos los event listeners
     */
    setupAllListeners() {
        this.setupControlListeners();
        this.setupDevelopmentListeners();
        this.setupWarMinistryListeners();
        this.setupEconomicMinistryListeners();
        this.setupInvestmentListeners();
        this.setupAlertListeners();
        this.setupNewGameListeners();
        this.setupSpeedControls();
    }

    /**
     * Configura los event listeners de control principal
     */
    setupControlListeners() {
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
                this.uiManager.showNewGameModal();
            });
        }

        // Botón de continuar en modales
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.uiManager.closeEventModal();
            });
        }

        // Cerrar modales
        const closeEventModal = document.getElementById('close-event-modal');
        if (closeEventModal) {
            closeEventModal.addEventListener('click', () => {
                this.uiManager.closeEventModal();
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
     * Configura los event listeners de desarrollo
     */
    setupDevelopmentListeners() {
        // Delegación de eventos para los botones de desarrollo
        const playerPanel = document.querySelector('.player-country-panel');
        if (playerPanel) {
            playerPanel.addEventListener('click', (e) => {
                const target = e.target.closest('.dev-btn');
                if (target && target.dataset.action === 'add') {
                    this.uiManager.incrementStat(target.dataset.stat);
                }
            });
        }
    }

    /**
     * Configura los event listeners del Ministerio de Guerra
     */
    setupWarMinistryListeners() {
        // Botones del Ministerio de Guerra
        const increaseArmyBtn = document.getElementById('increase-army-btn');
        const trainArmyBtn = document.getElementById('train-army-btn');

        if (increaseArmyBtn) {
            increaseArmyBtn.addEventListener('click', () => {
                this.uiManager.increaseArmy();
            });
        }

        if (trainArmyBtn) {
            trainArmyBtn.addEventListener('click', () => {
                this.uiManager.trainArmy();
            });
        }

        const attackBtn = document.getElementById('attack-btn');
        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                this.uiManager.showAttackModal();
            });
        }

        const closeBattleModalBtn = document.getElementById('close-battle-modal');
        if (closeBattleModalBtn) {
            closeBattleModalBtn.addEventListener('click', () => {
                this.uiManager.hideBattleModal();
            });
        }
    }

    /**
     * Configura los event listeners para el Ministerio de Economía
     */
    setupEconomicMinistryListeners() {
        const economicPanel = document.querySelector('.economic-ministry-panel');
        if (!economicPanel) return;

        economicPanel.addEventListener('click', (e) => {
            const button = e.target.closest('.economic-btn');
            if (!button) return;

            const industryItem = button.closest('.industry-item');
            if (industryItem) {
                this.uiManager.buildIndustry(industryItem.dataset.industry);
                return;
            }

            const infraItem = button.closest('.infrastructure-item');
            if (infraItem) {
                this.uiManager.buildInfrastructure(infraItem.dataset.infrastructure);
            }
        });
    }

    /**
     * Configura los event listeners para inversiones
     */
    setupInvestmentListeners() {
        // Botones de inversión
        const investBondsBtn = document.getElementById('invest-bonds');
        const investDevelopmentFundBtn = document.getElementById('invest-development-fund');
        const investEmergencyReservesBtn = document.getElementById('invest-emergency-reserves');

        if (investBondsBtn) {
            investBondsBtn.addEventListener('click', () => {
                this.uiManager.investInBonds();
            });
        }

        if (investDevelopmentFundBtn) {
            investDevelopmentFundBtn.addEventListener('click', () => {
                this.uiManager.investInDevelopmentFund();
            });
        }

        if (investEmergencyReservesBtn) {
            investEmergencyReservesBtn.addEventListener('click', () => {
                this.uiManager.investInEmergencyReserves();
            });
        }
    }

    /**
     * Configura los event listeners para alertas
     */
    setupAlertListeners() {
        const clearAlertsBtn = document.getElementById('clear-alerts-btn');
        if (clearAlertsBtn) {
            clearAlertsBtn.addEventListener('click', () => {
                this.uiManager.clearAllAlerts();
            });
        }
    }

    /**
     * Configura los event listeners para nueva partida
     */
    setupNewGameListeners() {
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
    }

    /**
     * Configura los controles de velocidad
     */
    setupSpeedControls() {
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
    }
} 