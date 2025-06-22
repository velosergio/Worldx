/**
 * Gestor de Balance
 * Maneja el sistema de balance, multiplicadores y ajustes del juego
 */
class BalanceManager {
    constructor() {
        this.ministryName = "Gestor de Balance";
        this.version = "1.0.0";

        this.balanceMultipliers = {
            // Multiplicadores de costo por semana de juego
            costScaling: {
                industries: 1.02,      // +2% por semana
                infrastructure: 1.015, // +1.5% por semana
                investments: 1.01      // +1% por semana
            },
            
            // Multiplicadores de beneficio por estadísticas
            benefitScaling: {
                income: 1.05,          // +5% por punto de economía
                efficiency: 1.03,      // +3% por punto de ciencia
                stability: 1.02        // +2% por punto de social
            },
            
            // Límites de balance
            limits: {
                maxCostMultiplier: 3.0,    // Máximo 3x el costo original
                maxBenefitMultiplier: 2.5, // Máximo 2.5x el beneficio original
                minCostMultiplier: 0.5,    // Mínimo 0.5x el costo original
                minBenefitMultiplier: 0.7  // Mínimo 0.7x el beneficio original
            }
        };
    }

    /**
     * Calcula el multiplicador de costo basado en el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {string} type - Tipo de construcción (industries, infrastructure, investments)
     * @returns {number} Multiplicador de costo
     */
    calculateCostMultiplier(gameWeek, type) {
        const baseMultiplier = this.balanceMultipliers.costScaling[type] || 1.0;
        const weekMultiplier = Math.pow(baseMultiplier, gameWeek);
        
        // Aplicar límites
        const limitedMultiplier = Math.min(
            this.balanceMultipliers.limits.maxCostMultiplier,
            Math.max(this.balanceMultipliers.limits.minCostMultiplier, weekMultiplier)
        );
        
        return limitedMultiplier;
    }

    /**
     * Calcula el multiplicador de beneficio basado en las estadísticas del país
     * @param {Object} country - País
     * @param {string} benefitType - Tipo de beneficio (income, efficiency, stability)
     * @returns {number} Multiplicador de beneficio
     */
    calculateBenefitMultiplier(country, benefitType) {
        const baseMultiplier = this.balanceMultipliers.benefitScaling[benefitType] || 1.0;
        
        let statValue = 0;
        switch (benefitType) {
            case 'income':
                statValue = country.stats.economy || 0;
                break;
            case 'efficiency':
                statValue = country.stats.science || 0;
                break;
            case 'stability':
                statValue = country.stats.social || 0;
                break;
        }
        
        const statMultiplier = Math.pow(baseMultiplier, statValue);
        
        // Aplicar límites
        const limitedMultiplier = Math.min(
            this.balanceMultipliers.limits.maxBenefitMultiplier,
            Math.max(this.balanceMultipliers.limits.minBenefitMultiplier, statMultiplier)
        );
        
        return limitedMultiplier;
    }

    /**
     * Ajusta los multiplicadores de balance según el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {Array} countries - Lista de países
     */
    adjustBalanceMultipliers(gameWeek, countries) {
        // Calcular estadísticas promedio de todos los países
        const avgStats = this.calculateAverageStats(countries);
        
        // Ajustar multiplicadores basado en el progreso promedio
        this.adjustCostScaling(gameWeek, avgStats);
        this.adjustBenefitScaling(avgStats);
    }

    /**
     * Calcula las estadísticas promedio de todos los países
     * @param {Array} countries - Lista de países
     * @returns {Object} Estadísticas promedio
     */
    calculateAverageStats(countries) {
        const totalStats = { military: 0, social: 0, culture: 0, science: 0, economy: 0 };
        const count = countries.length;
        
        countries.forEach(country => {
            Object.keys(totalStats).forEach(stat => {
                totalStats[stat] += country.stats[stat] || 0;
            });
        });
        
        Object.keys(totalStats).forEach(stat => {
            totalStats[stat] = totalStats[stat] / count;
        });
        
        return totalStats;
    }

    /**
     * Ajusta el escalado de costos según el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {Object} avgStats - Estadísticas promedio
     */
    adjustCostScaling(gameWeek, avgStats) {
        const avgProgress = (avgStats.military + avgStats.social + avgStats.culture + avgStats.science + avgStats.economy) / 5;
        
        // Si el progreso promedio es alto, aumentar los costos más rápidamente
        if (avgProgress > 8) {
            this.balanceMultipliers.costScaling.industries = 1.03;      // +3% por semana
            this.balanceMultipliers.costScaling.infrastructure = 1.02; // +2% por semana
            this.balanceMultipliers.costScaling.investments = 1.015;   // +1.5% por semana
        } else if (avgProgress > 5) {
            this.balanceMultipliers.costScaling.industries = 1.025;     // +2.5% por semana
            this.balanceMultipliers.costScaling.infrastructure = 1.02; // +2% por semana
            this.balanceMultipliers.costScaling.investments = 1.01;    // +1% por semana
        } else {
            // Mantener valores base para progreso bajo
            this.balanceMultipliers.costScaling.industries = 1.02;      // +2% por semana
            this.balanceMultipliers.costScaling.infrastructure = 1.015; // +1.5% por semana
            this.balanceMultipliers.costScaling.investments = 1.01;     // +1% por semana
        }
    }

    /**
     * Ajusta el escalado de beneficios según las estadísticas promedio
     * @param {Object} avgStats - Estadísticas promedio
     */
    adjustBenefitScaling(avgStats) {
        const avgProgress = (avgStats.military + avgStats.social + avgStats.culture + avgStats.science + avgStats.economy) / 5;
        
        // Si el progreso promedio es alto, reducir los beneficios para mantener el desafío
        if (avgProgress > 8) {
            this.balanceMultipliers.benefitScaling.income = 1.03;     // +3% por punto
            this.balanceMultipliers.benefitScaling.efficiency = 1.02; // +2% por punto
            this.balanceMultipliers.benefitScaling.stability = 1.01;  // +1% por punto
        } else if (avgProgress > 5) {
            this.balanceMultipliers.benefitScaling.income = 1.04;     // +4% por punto
            this.balanceMultipliers.benefitScaling.efficiency = 1.025; // +2.5% por punto
            this.balanceMultipliers.benefitScaling.stability = 1.015; // +1.5% por punto
        } else {
            // Mantener valores base para progreso bajo
            this.balanceMultipliers.benefitScaling.income = 1.05;     // +5% por punto
            this.balanceMultipliers.benefitScaling.efficiency = 1.03; // +3% por punto
            this.balanceMultipliers.benefitScaling.stability = 1.02;  // +2% por punto
        }
    }

    /**
     * Obtiene información de balance para la interfaz
     * @param {number} gameWeek - Semana actual del juego
     * @param {Object} country - País
     * @returns {Object} Información de balance
     */
    getBalanceInfo(gameWeek, country) {
        return {
            costMultipliers: {
                industries: this.calculateCostMultiplier(gameWeek, 'industries'),
                infrastructure: this.calculateCostMultiplier(gameWeek, 'infrastructure'),
                investments: this.calculateCostMultiplier(gameWeek, 'investments')
            },
            benefitMultipliers: {
                income: this.calculateBenefitMultiplier(country, 'income'),
                efficiency: this.calculateBenefitMultiplier(country, 'efficiency'),
                stability: this.calculateBenefitMultiplier(country, 'stability')
            },
            gameWeek: gameWeek,
            averageStats: this.calculateAverageStats([country]),
            limits: this.balanceMultipliers.limits
        };
    }

    /**
     * Obtiene los multiplicadores de balance actuales
     * @returns {Object} Multiplicadores actuales
     */
    getCurrentMultipliers() {
        return {
            costScaling: { ...this.balanceMultipliers.costScaling },
            benefitScaling: { ...this.balanceMultipliers.benefitScaling },
            limits: { ...this.balanceMultipliers.limits }
        };
    }

    /**
     * Establece multiplicadores de balance personalizados
     * @param {Object} multipliers - Nuevos multiplicadores
     */
    setCustomMultipliers(multipliers) {
        if (multipliers.costScaling) {
            this.balanceMultipliers.costScaling = { ...this.balanceMultipliers.costScaling, ...multipliers.costScaling };
        }
        
        if (multipliers.benefitScaling) {
            this.balanceMultipliers.benefitScaling = { ...this.balanceMultipliers.benefitScaling, ...multipliers.benefitScaling };
        }
        
        if (multipliers.limits) {
            this.balanceMultipliers.limits = { ...this.balanceMultipliers.limits, ...multipliers.limits };
        }
    }

    /**
     * Restablece los multiplicadores a los valores por defecto
     */
    resetToDefaults() {
        this.balanceMultipliers = {
            costScaling: {
                industries: 1.02,
                infrastructure: 1.015,
                investments: 1.01
            },
            benefitScaling: {
                income: 1.05,
                efficiency: 1.03,
                stability: 1.02
            },
            limits: {
                maxCostMultiplier: 3.0,
                maxBenefitMultiplier: 2.5,
                minCostMultiplier: 0.5,
                minBenefitMultiplier: 0.7
            }
        };
    }

    /**
     * Calcula el progreso promedio de todos los países
     * @param {Array} countries - Lista de países
     * @returns {number} Progreso promedio
     */
    calculateAverageProgress(countries) {
        const avgStats = this.calculateAverageStats(countries);
        return (avgStats.military + avgStats.social + avgStats.culture + avgStats.science + avgStats.economy) / 5;
    }

    /**
     * Determina si el juego necesita ajustes de balance
     * @param {Array} countries - Lista de países
     * @returns {Object} Información sobre si necesita ajustes
     */
    needsBalanceAdjustment(countries) {
        const avgProgress = this.calculateAverageProgress(countries);
        
        return {
            needsAdjustment: avgProgress > 8 || avgProgress < 2,
            averageProgress: avgProgress,
            recommendation: avgProgress > 8 ? 'increase_costs' : avgProgress < 2 ? 'decrease_costs' : 'maintain'
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BalanceManager;
} 