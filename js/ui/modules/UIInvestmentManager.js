/**
 * Módulo para gestionar la interfaz de inversiones
 */
class UIInvestmentManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Actualiza el panel de inversiones
     */
    updatePanel() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const investmentInfo = this.game.countryManager.getInvestmentInfo(playerCountry.id);
        if (!investmentInfo) return;

        // Actualizar cantidades
        document.getElementById('bonds-amount').textContent = investmentInfo.investments.bonds.count;
        document.getElementById('development-fund-amount').textContent = investmentInfo.investments.developmentFund.count;
        document.getElementById('emergency-reserves-amount').textContent = investmentInfo.investments.emergencyReserves.count;

        // Actualizar costos y beneficios
        this.updateInvestmentCostsAndBenefits(investmentInfo);

        // Actualizar resumen
        document.getElementById('total-interest').textContent = `$${investmentInfo.totalInterest}`;
        
        const stability = Math.floor(playerCountry.economicData.indicators.stability * 100);
        document.getElementById('investment-stability').textContent = `${stability}%`;

        // Mostrar información sobre eventos financieros activos
        this.updateFinancialEventInfo(playerCountry);

        // Actualizar estado de botones
        this.updateInvestmentButtonStates(playerCountry);
    }

    /**
     * Actualiza costos y beneficios de inversiones
     */
    updateInvestmentCostsAndBenefits(investmentInfo) {
        // Bonos
        if (investmentInfo.bondInfo) {
            document.getElementById('bonds-cost').textContent = `Costo: $${investmentInfo.bondInfo.cost}`;
            document.getElementById('bonds-benefit').textContent = investmentInfo.bondInfo.description;
        }

        // Fondo de desarrollo
        if (investmentInfo.developmentFundInfo) {
            document.getElementById('development-fund-cost').textContent = `Costo: $${investmentInfo.developmentFundInfo.cost}`;
            document.getElementById('development-fund-benefit').textContent = investmentInfo.developmentFundInfo.description;
        }

        // Reservas de emergencia
        if (investmentInfo.emergencyReservesInfo) {
            document.getElementById('emergency-reserves-cost').textContent = `Costo: $${investmentInfo.emergencyReservesInfo.cost}`;
            document.getElementById('emergency-reserves-benefit').textContent = investmentInfo.emergencyReservesInfo.description;
        }
    }

    /**
     * Actualiza el estado de los botones de inversión
     */
    updateInvestmentButtonStates(playerCountry) {
        const investBondsBtn = document.getElementById('invest-bonds');
        const investDevelopmentFundBtn = document.getElementById('invest-development-fund');
        const investEmergencyReservesBtn = document.getElementById('invest-emergency-reserves');

        if (investBondsBtn) {
            const canInvest = this.game.countryManager.canInvestInBonds(playerCountry.id);
            investBondsBtn.disabled = !canInvest;
        }

        if (investDevelopmentFundBtn) {
            const canInvest = this.game.countryManager.canInvestInDevelopmentFund(playerCountry.id);
            investDevelopmentFundBtn.disabled = !canInvest;
        }

        if (investEmergencyReservesBtn) {
            const canInvest = this.game.countryManager.canCreateEmergencyReserves(playerCountry.id);
            investEmergencyReservesBtn.disabled = !canInvest;
        }
    }

    /**
     * Actualiza la información sobre eventos financieros activos
     */
    updateFinancialEventInfo(playerCountry) {
        const investmentSummary = document.querySelector('.investment-summary');
        if (!investmentSummary) return;

        // Buscar o crear elemento para mostrar eventos financieros
        let eventInfoElement = investmentSummary.querySelector('.financial-event-info');
        if (!eventInfoElement) {
            eventInfoElement = document.createElement('div');
            eventInfoElement.className = 'financial-event-info';
            investmentSummary.appendChild(eventInfoElement);
        }

        // Verificar si hay eventos financieros activos
        const activeEvent = playerCountry.economicData?.activeFinancialEvent;
        const multipliers = playerCountry.economicData?.investmentMultipliers;

        if (activeEvent && multipliers) {
            // Determinar si es un evento positivo o negativo
            const isNegativeEvent = this.isNegativeFinancialEvent(activeEvent.eventId);
            
            // Aplicar clase CSS según el tipo de evento
            eventInfoElement.className = `financial-event-info ${isNegativeEvent ? 'negative' : ''}`;
            
            // Mostrar información del evento activo
            const eventTitle = this.getFinancialEventTitle(activeEvent.eventId);
            const duration = activeEvent.duration;
            
            eventInfoElement.innerHTML = `
                <div class="summary-item financial-event-active">
                    <span class="summary-label">💰 Evento Activo:</span>
                    <span class="summary-value">${eventTitle} (${duration} semanas)</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">📈 Multiplicadores:</span>
                    <span class="summary-value">
                        ${this.formatMultipliers(multipliers)}
                    </span>
                </div>
            `;
            eventInfoElement.style.display = 'block';
        } else {
            // Ocultar si no hay eventos activos
            eventInfoElement.style.display = 'none';
        }
    }

    /**
     * Verifica si un evento financiero es negativo
     */
    isNegativeFinancialEvent(eventId) {
        const negativeEvents = [
            'financial_crisis',
            'market_crash',
            'investment_scandal',
            'bond_default',
            'economic_recession',
            'development_stagnation'
        ];
        
        return negativeEvents.includes(eventId);
    }

    /**
     * Obtiene el título de un evento financiero
     */
    getFinancialEventTitle(eventId) {
        const eventTitles = {
            'financial_boom': 'Boom Económico',
            'market_rally': 'Rally del Mercado',
            'investment_windfall': 'Golpe de Suerte Inversor',
            'golden_opportunity': 'Oportunidad Dorada',
            'economic_stability': 'Estabilidad Económica',
            'development_surge': 'Impulso de Desarrollo',
            'financial_crisis': 'Crisis Financiera',
            'market_crash': 'Caída del Mercado',
            'investment_scandal': 'Escándalo de Inversiones',
            'bond_default': 'Default de Bonos',
            'economic_recession': 'Recesión Económica',
            'development_stagnation': 'Estancamiento del Desarrollo'
        };
        
        return eventTitles[eventId] || 'Evento Financiero';
    }

    /**
     * Formatea los multiplicadores de inversión
     */
    formatMultipliers(multipliers) {
        const formatted = [];
        
        if (multipliers.bonds) {
            const percentage = ((multipliers.bonds - 1) * 100).toFixed(0);
            const sign = multipliers.bonds > 1 ? '+' : '';
            formatted.push(`Bonos ${sign}${percentage}%`);
        }
        
        if (multipliers.developmentFund) {
            const percentage = ((multipliers.developmentFund - 1) * 100).toFixed(0);
            const sign = multipliers.developmentFund > 1 ? '+' : '';
            formatted.push(`Fondos ${sign}${percentage}%`);
        }
        
        if (multipliers.emergencyReserves) {
            const percentage = ((multipliers.emergencyReserves - 1) * 100).toFixed(0);
            const sign = multipliers.emergencyReserves > 1 ? '+' : '';
            formatted.push(`Reservas ${sign}${percentage}%`);
        }
        
        return formatted.join(', ') || 'Ninguno';
    }

    /**
     * Invierte en bonos del estado
     */
    investInBonds() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.investInBonds(playerCountry.id);
        if (success) {
            this.uiManager.updateDisplay();
            this.uiManager.showNotification('Inversión en bonos realizada con éxito', 'success');
        } else {
            this.uiManager.showNotification('No puedes invertir en bonos en este momento', 'error');
        }
    }

    /**
     * Invierte en fondo de desarrollo
     */
    investInDevelopmentFund() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.investInDevelopmentFund(playerCountry.id);
        if (success) {
            this.uiManager.updateDisplay();
            this.uiManager.showNotification('Inversión en fondo de desarrollo realizada con éxito', 'success');
        } else {
            this.uiManager.showNotification('No puedes invertir en fondo de desarrollo en este momento', 'error');
        }
    }

    /**
     * Crea reservas de emergencia
     */
    investInEmergencyReserves() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.createEmergencyReserves(playerCountry.id);
        if (success) {
            this.uiManager.updateDisplay();
            this.uiManager.showNotification('Reservas de emergencia creadas con éxito', 'success');
        } else {
            this.uiManager.showNotification('No puedes crear reservas de emergencia en este momento', 'error');
        }
    }
} 