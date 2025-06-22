/**
 * Sistema de Alertas para WorldX
 * Notifica crisis y oportunidades económicas
 */
class AlertSystem {
    constructor() {
        this.alerts = [];
        this.maxAlerts = 10;
        this.alertTypes = {
            CRISIS: 'crisis',
            OPPORTUNITY: 'opportunity',
            WARNING: 'warning',
            INFO: 'info',
            SUCCESS: 'success'
        };
    }

    /**
     * Analiza un país y genera alertas relevantes
     * @param {Object} country - País a analizar
     * @returns {Array} Lista de alertas generadas
     */
    analyzeCountry(country) {
        const alerts = [];
        
        // Alertas de crisis económica
        alerts.push(...this.checkEconomicCrises(country));
        
        // Alertas de oportunidades de inversión
        alerts.push(...this.checkInvestmentOpportunities(country));
        
        // Alertas de amenazas militares
        alerts.push(...this.checkMilitaryThreats(country));
        
        // Alertas de eventos financieros
        alerts.push(...this.checkFinancialEvents(country));
        
        // Alertas de sinergias disponibles
        alerts.push(...this.checkSynergyOpportunities(country));
        
        // Alertas de recursos bajos
        alerts.push(...this.checkResourceShortages(country));
        
        return alerts;
    }

    /**
     * Verifica crisis económicas
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de crisis
     */
    checkEconomicCrises(country) {
        const alerts = [];
        
        // Crisis de dinero
        if (country.money < 100) {
            alerts.push({
                type: this.alertTypes.CRISIS,
                title: 'Crisis de Liquidez',
                message: `Solo tienes $${country.money} disponibles. Considera vender activos o reducir gastos.`,
                priority: 'high',
                action: 'Considera crear reservas de emergencia o vender inversiones'
            });
        }
        
        // Crisis de ingresos
        if (country.income < 50) {
            alerts.push({
                type: this.alertTypes.WARNING,
                title: 'Ingresos Bajos',
                message: `Tus ingresos semanales son solo $${country.income}. Considera mejorar tu economía.`,
                priority: 'medium',
                action: 'Invierte en industrias básicas o infraestructura económica'
            });
        }
        
        // Crisis de estabilidad
        if (country.economicData?.indicators?.stability < 0.7) {
            alerts.push({
                type: this.alertTypes.CRISIS,
                title: 'Inestabilidad Económica',
                message: 'Tu economía está inestable. Esto afecta negativamente todos tus ingresos.',
                priority: 'high',
                action: 'Construye bancos o crea reservas de emergencia'
            });
        }
        
        // Crisis de eficiencia
        if (country.economicData?.indicators?.efficiency < 0.8) {
            alerts.push({
                type: this.alertTypes.WARNING,
                title: 'Baja Eficiencia Económica',
                message: 'Tu economía no está funcionando eficientemente. Considera mejorar la infraestructura.',
                priority: 'medium',
                action: 'Construye infraestructura para mejorar la eficiencia'
            });
        }
        
        return alerts;
    }

    /**
     * Verifica oportunidades de inversión
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de oportunidades
     */
    checkInvestmentOpportunities(country) {
        const alerts = [];
        
        // Oportunidades por eventos financieros
        if (country.economicData?.investmentMultipliers) {
            const multipliers = country.economicData.investmentMultipliers;
            
            if (multipliers.bonds > 1.3) {
                alerts.push({
                    type: this.alertTypes.OPPORTUNITY,
                    title: 'Oportunidad en Bonos',
                    message: `Los bonos tienen un multiplicador de ${multipliers.bonds.toFixed(1)}x. ¡Aprovecha esta oportunidad!`,
                    priority: 'high',
                    action: 'Invierte en bonos del estado'
                });
            }
            
            if (multipliers.developmentFund > 1.4) {
                alerts.push({
                    type: this.alertTypes.OPPORTUNITY,
                    title: 'Oportunidad en Fondos',
                    message: `Los fondos de desarrollo tienen un multiplicador de ${multipliers.developmentFund.toFixed(1)}x. ¡Invierte ahora!`,
                    priority: 'high',
                    action: 'Invierte en fondos de desarrollo'
                });
            }
        }
        
        // Oportunidades por dinero disponible
        if (country.money > 1000) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Capital Disponible',
                message: `Tienes $${country.money} disponibles. Considera invertir en tu economía.`,
                priority: 'medium',
                action: 'Revisa las opciones de inversión disponibles'
            });
        }
        
        return alerts;
    }

    /**
     * Verifica amenazas militares
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de amenazas
     */
    checkMilitaryThreats(country) {
        const alerts = [];
        
        // Amenaza por ejército pequeño
        const maxArmy = Math.floor(country.population * 0.4);
        if (country.army < maxArmy * 0.3) {
            alerts.push({
                type: this.alertTypes.WARNING,
                title: 'Ejército Débil',
                message: `Tu ejército es muy pequeño (${country.army}/${maxArmy}). Podrías ser vulnerable a ataques.`,
                priority: 'medium',
                action: 'Considera aumentar tu ejército'
            });
        }
        
        // Amenaza por experiencia baja
        if (country.armyExperience < 3) {
            alerts.push({
                type: this.alertTypes.WARNING,
                title: 'Ejército Sin Experiencia',
                message: `Tu ejército tiene poca experiencia (${country.armyExperience}/10). Considera entrenarlo.`,
                priority: 'low',
                action: 'Entrena tu ejército para mejorar su efectividad'
            });
        }
        
        return alerts;
    }

    /**
     * Verifica eventos financieros activos
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de eventos
     */
    checkFinancialEvents(country) {
        const alerts = [];
        
        if (country.economicData?.activeFinancialEvent) {
            const event = country.economicData.activeFinancialEvent;
            const eventTitle = this.getFinancialEventTitle(event.eventId);
            const isNegative = this.isNegativeFinancialEvent(event.eventId);
            
            alerts.push({
                type: isNegative ? this.alertTypes.CRISIS : this.alertTypes.INFO,
                title: `Evento Financiero: ${eventTitle}`,
                message: `Este evento durará ${event.duration} semanas más. ${isNegative ? 'Ten cuidado con las inversiones.' : 'Aprovecha los multiplicadores.'}`,
                priority: isNegative ? 'high' : 'medium',
                action: isNegative ? 'Considera crear reservas de emergencia' : 'Aprovecha los multiplicadores de inversión'
            });
        }
        
        return alerts;
    }

    /**
     * Verifica oportunidades de sinergias
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de sinergias
     */
    checkSynergyOpportunities(country) {
        const alerts = [];
        
        if (!country.economicData?.infrastructure) return alerts;
        
        const infrastructure = country.economicData.infrastructure;
        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        
        // Sinergia de transporte
        if (infrastructure.roads > 0 && !infrastructure.ports) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Sinergia de Transporte Disponible',
                message: 'Tienes carreteras pero no puertos. Construir puertos te dará +25% ingresos adicionales.',
                priority: 'medium',
                action: 'Construye puertos para activar la sinergia de transporte'
            });
        } else if (infrastructure.ports > 0 && !infrastructure.roads) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Sinergia de Transporte Disponible',
                message: 'Tienes puertos pero no carreteras. Construir carreteras te dará +25% ingresos adicionales.',
                priority: 'medium',
                action: 'Construye carreteras para activar la sinergia de transporte'
            });
        }
        
        // Sinergia educativa
        if (infrastructure.universities > 0 && !infrastructure.hospitals) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Sinergia Educativa Disponible',
                message: 'Tienes universidades pero no hospitales. Construir hospitales te dará +20% ingresos adicionales.',
                priority: 'medium',
                action: 'Construye hospitales para activar la sinergia educativa'
            });
        } else if (infrastructure.hospitals > 0 && !infrastructure.universities) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Sinergia Educativa Disponible',
                message: 'Tienes hospitales pero no universidades. Construir universidades te dará +20% ingresos adicionales.',
                priority: 'medium',
                action: 'Construye universidades para activar la sinergia educativa'
            });
        }
        
        // Sinergia completa
        if (builtInfrastructure === 4) {
            alerts.push({
                type: this.alertTypes.OPPORTUNITY,
                title: 'Sinergia Completa Cerca',
                message: 'Te falta solo 1 infraestructura para obtener +50% ingresos adicionales por sinergia completa.',
                priority: 'high',
                action: 'Construye la infraestructura faltante para obtener la sinergia completa'
            });
        }
        
        return alerts;
    }

    /**
     * Verifica escasez de recursos
     * @param {Object} country - País a verificar
     * @returns {Array} Alertas de recursos
     */
    checkResourceShortages(country) {
        const alerts = [];
        
        // Escasez de puntos de desarrollo
        if (country.developmentPoints < 3) {
            alerts.push({
                type: this.alertTypes.WARNING,
                title: 'Puntos de Desarrollo Bajos',
                message: `Solo tienes ${country.developmentPoints} puntos de desarrollo. Considera invertir en fondos de desarrollo.`,
                priority: 'medium',
                action: 'Invierte en fondos de desarrollo para obtener más puntos'
            });
        }
        
        // Escasez de población
        if (country.population < 100) {
            alerts.push({
                type: this.alertTypes.CRISIS,
                title: 'Población Muy Baja',
                message: `Tu población es muy baja (${country.population}). Esto limita tu crecimiento económico.`,
                priority: 'high',
                action: 'Enfócate en mejorar las estadísticas sociales para aumentar la población'
            });
        }
        
        return alerts;
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
     * Agrega una alerta al sistema
     * @param {Object} alert - Alerta a agregar
     */
    addAlert(alert) {
        this.alerts.unshift(alert);
        
        // Mantener solo las alertas más recientes
        if (this.alerts.length > this.maxAlerts) {
            this.alerts = this.alerts.slice(0, this.maxAlerts);
        }
    }

    /**
     * Obtiene todas las alertas activas
     * @returns {Array} Lista de alertas
     */
    getAlerts() {
        return this.alerts;
    }

    /**
     * Obtiene alertas por tipo
     * @param {string} type - Tipo de alerta
     * @returns {Array} Alertas del tipo especificado
     */
    getAlertsByType(type) {
        return this.alerts.filter(alert => alert.type === type);
    }

    /**
     * Obtiene alertas por prioridad
     * @param {string} priority - Prioridad de alerta
     * @returns {Array} Alertas de la prioridad especificada
     */
    getAlertsByPriority(priority) {
        return this.alerts.filter(alert => alert.priority === priority);
    }

    /**
     * Limpia alertas antiguas
     */
    clearOldAlerts() {
        // Por ahora mantenemos todas las alertas, pero podríamos implementar
        // un sistema de expiración basado en tiempo
        this.alerts = this.alerts.slice(0, this.maxAlerts);
    }

    /**
     * Limpia todas las alertas
     */
    clearAllAlerts() {
        this.alerts = [];
    }

    /**
     * Obtiene el número total de alertas
     * @returns {number} Número de alertas
     */
    getAlertCount() {
        return this.alerts.length;
    }

    /**
     * Obtiene el número de alertas críticas
     * @returns {number} Número de alertas críticas
     */
    getCriticalAlertCount() {
        return this.alerts.filter(alert => alert.priority === 'high').length;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertSystem;
} 