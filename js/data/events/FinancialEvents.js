/**
 * Eventos Financieros para WorldX
 * Crisis y booms económicos que afectan inversiones y economía
 */

const FinancialEvents = {
    // EVENTOS POSITIVOS (BOOMS ECONÓMICOS)
    positive: [
        {
            id: "financial_boom",
            title: "Boom Económico",
            description: "La economía experimenta un crecimiento excepcional. Los mercados están en auge y las inversiones rinden extraordinariamente bien.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 6,
                minStability: 5,
                minWeeks: 15
            },
            effects: {
                income: 50,
                efficiency: 1.3,
                stability: 1.2,
                duration: 4
            },
            investmentBonus: {
                bonds: 1.5,      // 50% más retorno en bonos
                developmentFund: 1.3, // 30% más retorno en fondos
                emergencyReserves: 1.2 // 20% más valor en reservas
            }
        },
        {
            id: "market_rally",
            title: "Rally del Mercado",
            description: "Los mercados financieros experimentan un rally masivo. Las inversiones en bonos y fondos de desarrollo rinden extraordinariamente bien.",
            type: "FINANCIAL",
            rarity: "UNCOMMON",
            conditions: {
                minEconomy: 5,
                minWeeks: 10
            },
            effects: {
                income: 30,
                efficiency: 1.2,
                duration: 3
            },
            investmentBonus: {
                bonds: 1.4,
                developmentFund: 1.25
            }
        },
        {
            id: "investment_windfall",
            title: "Golpe de Suerte Inversor",
            description: "Una serie de inversiones estratégicas rinden frutos inesperados. Los fondos de desarrollo generan retornos extraordinarios.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 7,
                minDevelopmentFund: 5, // Requiere tener al menos 5 fondos de desarrollo
                minWeeks: 20
            },
            effects: {
                income: 40,
                developmentPoints: 15, // Bonus de puntos de desarrollo
                duration: 2
            },
            investmentBonus: {
                developmentFund: 1.6, // 60% más retorno en fondos
                bonds: 1.2
            }
        },
        {
            id: "golden_opportunity",
            title: "Oportunidad Dorada",
            description: "Se presenta una oportunidad única de inversión. Los bonos gubernamentales ofrecen retornos históricamente altos.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 6,
                minBonds: 3, // Requiere tener al menos 3 bonos
                minWeeks: 25
            },
            effects: {
                income: 35,
                stability: 1.15,
                duration: 3
            },
            investmentBonus: {
                bonds: 1.8, // 80% más retorno en bonos
                emergencyReserves: 1.1
            }
        },
        {
            id: "economic_stability",
            title: "Estabilidad Económica",
            description: "La economía nacional alcanza un período de estabilidad excepcional. Las reservas de emergencia se valorizan significativamente.",
            type: "FINANCIAL",
            rarity: "COMMON",
            conditions: {
                minEconomy: 4,
                minStability: 6,
                minWeeks: 8
            },
            effects: {
                income: 20,
                stability: 1.25,
                duration: 2
            },
            investmentBonus: {
                emergencyReserves: 1.4, // 40% más valor en reservas
                bonds: 1.1
            }
        },
        {
            id: "development_surge",
            title: "Impulso de Desarrollo",
            description: "Un período de innovación y desarrollo acelera el progreso nacional. Los fondos de desarrollo son extremadamente efectivos.",
            type: "FINANCIAL",
            rarity: "UNCOMMON",
            conditions: {
                minScience: 5,
                minEconomy: 5,
                minWeeks: 12
            },
            effects: {
                income: 25,
                developmentPoints: 10,
                efficiency: 1.15,
                duration: 3
            },
            investmentBonus: {
                developmentFund: 1.5,
                bonds: 1.1
            }
        }
    ],

    // EVENTOS NEGATIVOS (CRISIS ECONÓMICAS)
    negative: [
        {
            id: "financial_crisis",
            title: "Crisis Financiera",
            description: "Una crisis financiera golpea la economía. Los mercados se desploman y las inversiones pierden valor significativamente.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 4,
                minWeeks: 10
            },
            effects: {
                income: -40,
                efficiency: 0.7,
                stability: 0.8,
                duration: 4
            },
            investmentPenalty: {
                bonds: 0.6,      // 40% menos retorno en bonos
                developmentFund: 0.7, // 30% menos retorno en fondos
                emergencyReserves: 0.8 // 20% menos valor en reservas
            }
        },
        {
            id: "market_crash",
            title: "Caída del Mercado",
            description: "Los mercados financieros experimentan una caída masiva. Las inversiones en bonos y fondos sufren pérdidas significativas.",
            type: "FINANCIAL",
            rarity: "UNCOMMON",
            conditions: {
                minEconomy: 3,
                minWeeks: 8
            },
            effects: {
                income: -30,
                efficiency: 0.8,
                duration: 3
            },
            investmentPenalty: {
                bonds: 0.7,
                developmentFund: 0.75
            }
        },
        {
            id: "investment_scandal",
            title: "Escándalo de Inversiones",
            description: "Un escándalo financiero sacude la confianza en los mercados. Los fondos de desarrollo pierden valor y credibilidad.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 5,
                minDevelopmentFund: 3,
                minWeeks: 15
            },
            effects: {
                income: -25,
                stability: 0.85,
                developmentPoints: -5,
                duration: 3
            },
            investmentPenalty: {
                developmentFund: 0.6, // 40% menos retorno en fondos
                bonds: 0.9
            }
        },
        {
            id: "bond_default",
            title: "Default de Bonos",
            description: "Algunos bonos gubernamentales entran en default. La confianza en los bonos se ve severamente afectada.",
            type: "FINANCIAL",
            rarity: "RARE",
            conditions: {
                minEconomy: 4,
                minBonds: 2,
                minWeeks: 12
            },
            effects: {
                income: -20,
                stability: 0.9,
                duration: 2
            },
            investmentPenalty: {
                bonds: 0.5, // 50% menos retorno en bonos
                emergencyReserves: 0.95
            }
        },
        {
            id: "economic_recession",
            title: "Recesión Económica",
            description: "La economía entra en recesión. Los ingresos caen y las reservas de emergencia pierden valor.",
            type: "FINANCIAL",
            rarity: "UNCOMMON",
            conditions: {
                minEconomy: 3,
                minWeeks: 6
            },
            effects: {
                income: -35,
                efficiency: 0.85,
                stability: 0.75,
                duration: 3
            },
            investmentPenalty: {
                emergencyReserves: 0.7, // 30% menos valor en reservas
                bonds: 0.8,
                developmentFund: 0.85
            }
        },
        {
            id: "development_stagnation",
            title: "Estancamiento del Desarrollo",
            description: "El progreso nacional se estanca. Los fondos de desarrollo pierden efectividad y el desarrollo se ralentiza.",
            type: "FINANCIAL",
            rarity: "COMMON",
            conditions: {
                minScience: 3,
                minEconomy: 3,
                minWeeks: 8
            },
            effects: {
                income: -15,
                developmentPoints: -3,
                efficiency: 0.9,
                duration: 2
            },
            investmentPenalty: {
                developmentFund: 0.8, // 20% menos retorno en fondos
                bonds: 0.95
            }
        }
    ],

    /**
     * Obtiene todos los eventos financieros
     * @returns {Array} Lista de todos los eventos financieros
     */
    getAllEvents() {
        return [...this.positive, ...this.negative];
    },

    /**
     * Obtiene eventos financieros positivos
     * @returns {Array} Lista de eventos positivos
     */
    getPositiveEvents() {
        return this.positive;
    },

    /**
     * Obtiene eventos financieros negativos
     * @returns {Array} Lista de eventos negativos
     */
    getNegativeEvents() {
        return this.negative;
    },

    /**
     * Verifica si un país puede tener un evento financiero específico
     * @param {Object} country - País a verificar
     * @param {Object} event - Evento a verificar
     * @returns {boolean} True si puede tener el evento
     */
    canHaveEvent(country, event) {
        const conditions = event.conditions;
        
        // Verificar estadísticas mínimas
        if (conditions.minEconomy && country.economy < conditions.minEconomy) return false;
        if (conditions.minStability && country.economicData?.indicators?.stability < conditions.minStability) return false;
        if (conditions.minScience && country.science < conditions.minScience) return false;
        
        // Verificar inversiones mínimas
        if (conditions.minBonds && country.economicData?.investments?.bonds?.count < conditions.minBonds) return false;
        if (conditions.minDevelopmentFund && country.economicData?.investments?.developmentFund?.count < conditions.minDevelopmentFund) return false;
        
        // Verificar tiempo mínimo de juego
        if (conditions.minWeeks && country.weeksAlive < conditions.minWeeks) return false;
        
        return true;
    },

    /**
     * Aplica los efectos de un evento financiero a un país
     * @param {Object} country - País afectado
     * @param {Object} event - Evento a aplicar
     */
    applyEventEffects(country, event) {
        const effects = event.effects;
        
        // Aplicar efectos básicos
        if (effects.income) {
            country.income = Math.max(0, country.income + effects.income);
        }
        
        if (effects.developmentPoints) {
            country.developmentPoints = Math.max(0, country.developmentPoints + effects.developmentPoints);
        }
        
        // Aplicar multiplicadores económicos
        if (effects.efficiency) {
            country.economicData.indicators.efficiency *= effects.efficiency;
        }
        
        if (effects.stability) {
            country.economicData.indicators.stability *= effects.stability;
        }
        
        // Aplicar bonificaciones/penalizaciones de inversiones
        if (event.investmentBonus) {
            country.economicData.investmentMultipliers = event.investmentBonus;
        } else if (event.investmentPenalty) {
            country.economicData.investmentMultipliers = event.investmentPenalty;
        }
        
        // Guardar duración del evento
        if (effects.duration) {
            country.economicData.activeFinancialEvent = {
                eventId: event.id,
                duration: effects.duration,
                effects: effects
            };
        }
    },

    /**
     * Revierte los efectos de un evento financiero
     * @param {Object} country - País afectado
     * @param {Object} event - Evento a revertir
     */
    revertEventEffects(country, event) {
        const effects = event.effects;
        
        // Revertir efectos básicos
        if (effects.income) {
            country.income = Math.max(0, country.income - effects.income);
        }
        
        if (effects.developmentPoints) {
            country.developmentPoints = Math.max(0, country.developmentPoints - effects.developmentPoints);
        }
        
        // Revertir multiplicadores económicos
        if (effects.efficiency) {
            country.economicData.indicators.efficiency /= effects.efficiency;
        }
        
        if (effects.stability) {
            country.economicData.indicators.stability /= effects.stability;
        }
        
        // Limpiar multiplicadores de inversión
        delete country.economicData.investmentMultipliers;
        delete country.economicData.activeFinancialEvent;
    },

    /**
     * Procesa el paso del tiempo para eventos financieros activos
     * @param {Object} country - País a procesar
     */
    processTimePassage(country) {
        if (country.economicData.activeFinancialEvent) {
            const activeEvent = country.economicData.activeFinancialEvent;
            activeEvent.duration--;
            
            if (activeEvent.duration <= 0) {
                // Evento terminado, limpiar efectos
                delete country.economicData.activeFinancialEvent;
                delete country.economicData.investmentMultipliers;
            }
        }
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialEvents;
} 