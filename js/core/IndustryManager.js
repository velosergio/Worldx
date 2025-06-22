/**
 * Gestor de Industrias
 * Maneja todas las industrias, sus costos, construcción y verificaciones
 */
class IndustryManager {
    constructor() {
        this.ministryName = "Gestor de Industrias";
        this.version = "1.0.0";
    }

    /**
     * Obtiene el costo para construir/mejorar una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {Object} Costo en dinero y estadísticas
     */
    getIndustryCost(country, industryType) {
        const upgradeCount = country.economicData.upgradeCounts[industryType + 'Industry'] || 0;
        const baseCosts = {
            basic: { money: 300, economy: 1 },
            advanced: { money: 600, science: 2, economy: 2 },
            cultural: { money: 500, culture: 2, economy: 1 },
            military: { money: 400, military: 2, economy: 1 },
            tech: { money: 800, science: 3, economy: 2 }
        };
        
        const baseCost = baseCosts[industryType];
        if (!baseCost) return null;
        
        // Costo exponencial por nivel
        const multiplier = Math.pow(1.5, upgradeCount);
        
        return {
            money: Math.floor(baseCost.money * multiplier),
            ...Object.fromEntries(
                Object.entries(baseCost)
                    .filter(([key]) => key !== 'money')
                    .map(([key, value]) => [key, Math.ceil(value * multiplier)])
            )
        };
    }

    /**
     * Verifica si se puede construir/mejorar una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {boolean} Si se puede construir
     */
    canBuildIndustry(country, industryType) {
        const cost = this.getIndustryCost(country, industryType);
        if (!cost) return false;
        
        // Verificar requisitos de estadísticas
        const requirements = {
            basic: { economy: 1 },
            advanced: { science: 5, economy: 3 },
            cultural: { culture: 5, economy: 2 },
            military: { military: 5, economy: 2 },
            tech: { science: 8, economy: 4 }
        };
        
        const req = requirements[industryType];
        if (req) {
            for (const [stat, value] of Object.entries(req)) {
                if (country.stats[stat] < value) return false;
            }
        }
        
        // Verificar recursos
        if (country.money < cost.money) return false;
        
        for (const [stat, value] of Object.entries(cost)) {
            if (stat !== 'money' && country.stats[stat] < value) return false;
        }
        
        return true;
    }

    /**
     * Construye/mejora una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {boolean} Si se construyó exitosamente
     */
    buildIndustry(country, industryType) {
        if (!this.canBuildIndustry(country, industryType)) {
            return false;
        }
        
        const cost = this.getIndustryCost(country, industryType);
        
        // Aplicar costos
        country.money -= cost.money;
        for (const [stat, value] of Object.entries(cost)) {
            if (stat !== 'money') {
                country.stats[stat] -= value;
            }
        }
        
        // Construir/mejorar industria
        country.economicData.industries[industryType]++;
        country.economicData.upgradeCounts[industryType + 'Industry']++;
        
        return true;
    }

    /**
     * Obtiene descripción de una industria
     * @param {string} industryType - Tipo de industria
     * @returns {string} Descripción
     */
    getIndustryDescription(industryType) {
        const descriptions = {
            basic: "Industria Básica: +10% ingresos por nivel",
            advanced: "Industria Avanzada: +15% ingresos por nivel (requiere Ciencia 5)",
            cultural: "Industria Cultural: +12% ingresos por nivel (requiere Cultura 5)",
            military: "Industria Militar: +8% ingresos por nivel (requiere Militar 5)",
            tech: "Industria Tecnológica: +20% ingresos por nivel (requiere Ciencia 8)"
        };
        return descriptions[industryType] || "";
    }

    /**
     * Obtiene el costo balanceado de una industria
     * @param {string} industryType - Tipo de industria
     * @param {number} currentLevel - Nivel actual
     * @param {number} gameWeek - Semana actual del juego
     * @returns {Object} Costo balanceado
     */
    getBalancedIndustryCost(industryType, currentLevel, gameWeek) {
        const baseCost = this.getIndustryCost(industryType, currentLevel);
        const costMultiplier = this.calculateCostMultiplier(gameWeek, 'industries');
        
        return {
            money: Math.floor(baseCost.money * costMultiplier),
            stats: baseCost.stats // Los costos de estadísticas no escalan
        };
    }

    /**
     * Obtiene el beneficio balanceado de una industria
     * @param {string} industryType - Tipo de industria
     * @param {number} level - Nivel de la industria
     * @param {Object} country - País
     * @returns {Object} Beneficio balanceado
     */
    getBalancedIndustryBenefit(industryType, level, country) {
        const baseBenefit = this.getIndustryBenefit(industryType, level);
        const incomeMultiplier = this.calculateBenefitMultiplier(country, 'income');
        
        return {
            income_bonus: baseBenefit.income_bonus * incomeMultiplier,
            money_flat: Math.floor(baseBenefit.money_flat * incomeMultiplier)
        };
    }

    /**
     * Obtiene el beneficio base de una industria
     * @param {string} industryType - Tipo de industria
     * @param {number} level - Nivel de la industria
     * @returns {Object} Beneficio base
     */
    getIndustryBenefit(industryType, level) {
        const benefits = {
            basic: { income_bonus: 0.1, money_flat: 0 },
            advanced: { income_bonus: 0.15, money_flat: 0 },
            cultural: { income_bonus: 0.12, money_flat: 0 },
            military: { income_bonus: 0.08, money_flat: 0 },
            tech: { income_bonus: 0.20, money_flat: 0 }
        };
        
        const baseBenefit = benefits[industryType] || {};
        return {
            income_bonus: baseBenefit.income_bonus * level,
            money_flat: baseBenefit.money_flat * level
        };
    }

    /**
     * Calcula el multiplicador de costo basado en el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {string} type - Tipo de construcción
     * @returns {number} Multiplicador de costo
     */
    calculateCostMultiplier(gameWeek, type) {
        const baseMultiplier = 1.02; // +2% por semana para industrias
        const weekMultiplier = Math.pow(baseMultiplier, gameWeek);
        
        // Aplicar límites
        const maxMultiplier = 3.0;
        const minMultiplier = 0.5;
        
        return Math.min(maxMultiplier, Math.max(minMultiplier, weekMultiplier));
    }

    /**
     * Calcula el multiplicador de beneficio basado en las estadísticas del país
     * @param {Object} country - País
     * @param {string} benefitType - Tipo de beneficio
     * @returns {number} Multiplicador de beneficio
     */
    calculateBenefitMultiplier(country, benefitType) {
        const baseMultiplier = 1.05; // +5% por punto de economía
        
        let statValue = 0;
        switch (benefitType) {
            case 'income':
                statValue = country.stats.economy || 0;
                break;
        }
        
        const statMultiplier = Math.pow(baseMultiplier, statValue);
        
        // Aplicar límites
        const maxMultiplier = 2.5;
        const minMultiplier = 0.7;
        
        return Math.min(maxMultiplier, Math.max(minMultiplier, statMultiplier));
    }

    /**
     * Obtiene información de todas las industrias disponibles
     * @param {Object} country - País
     * @returns {Array} Lista de industrias disponibles
     */
    getAvailableIndustries(country) {
        const industryTypes = ['basic', 'advanced', 'cultural', 'military', 'tech'];
        const available = [];
        
        industryTypes.forEach(type => {
            if (this.canBuildIndustry(country, type)) {
                const cost = this.getIndustryCost(country, type);
                available.push({
                    type: 'industry',
                    name: type,
                    cost: cost,
                    description: this.getIndustryDescription(type)
                });
            }
        });
        
        return available;
    }

    /**
     * Obtiene información de todas las industrias (construidas y disponibles)
     * @param {Object} country - País
     * @returns {Object} Información de industrias
     */
    getIndustryInfo(country) {
        const industryTypes = ['basic', 'advanced', 'cultural', 'military', 'tech'];
        const info = {};
        
        industryTypes.forEach(type => {
            const currentLevel = country.economicData.industries[type] || 0;
            const canBuild = this.canBuildIndustry(country, type);
            const cost = canBuild ? this.getIndustryCost(country, type) : null;
            
            info[type] = {
                currentLevel: currentLevel,
                canBuild: canBuild,
                cost: cost,
                description: this.getIndustryDescription(type),
                benefit: this.getIndustryBenefit(type, currentLevel)
            };
        });
        
        return info;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndustryManager;
} 