/**
 * Gestor de Infraestructura
 * Maneja toda la infraestructura, costos, construcción y sinergias
 */
class InfrastructureManager {
    constructor() {
        this.ministryName = "Gestor de Infraestructura";
        this.version = "1.0.0";
    }

    /**
     * Obtiene el costo para construir infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {Object} Costo en dinero y estadísticas
     */
    getInfrastructureCost(country, infrastructureType) {
        const costs = {
            roads: { money: 500, economy: 2, social: 1 },
            ports: { money: 800, economy: 3, science: 1 },
            universities: { money: 1200, science: 3, economy: 2 },
            hospitals: { money: 1000, social: 3, economy: 2 },
            banks: { money: 1500, economy: 4, social: 1 }
        };
        
        return costs[infrastructureType] || null;
    }

    /**
     * Verifica si se puede construir infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {boolean} Si se puede construir
     */
    canBuildInfrastructure(country, infrastructureType) {
        const cost = this.getInfrastructureCost(country, infrastructureType);
        if (!cost) return false;
        
        // Verificar si ya está construida
        if (country.economicData.infrastructure[infrastructureType] > 0) {
            return false;
        }
        
        // Verificar recursos
        if (country.money < cost.money) return false;
        
        for (const [stat, value] of Object.entries(cost)) {
            if (stat !== 'money' && country.stats[stat] < value) return false;
        }
        
        return true;
    }

    /**
     * Construye infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {boolean} Si se construyó exitosamente
     */
    buildInfrastructure(country, infrastructureType) {
        if (!this.canBuildInfrastructure(country, infrastructureType)) {
            return false;
        }
        
        const cost = this.getInfrastructureCost(country, infrastructureType);
        
        // Aplicar costos
        country.money -= cost.money;
        for (const [stat, value] of Object.entries(cost)) {
            if (stat !== 'money') {
                country.stats[stat] -= value;
            }
        }
        
        // Construir infraestructura
        country.economicData.infrastructure[infrastructureType] = 1;
        
        return true;
    }

    /**
     * Obtiene descripción de infraestructura
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {string} Descripción
     */
    getInfrastructureDescription(infrastructureType) {
        const descriptions = {
            roads: "Carreteras: +10% ingresos, +5% eficiencia, +3% estabilidad. Sinergia con Puertos: +25% ingresos adicionales",
            ports: "Puertos: +15% ingresos, +8% eficiencia, +4% estabilidad. Sinergia con Carreteras: +25% ingresos adicionales",
            universities: "Universidades: +8% ingresos, +3% eficiencia, +5% estabilidad. Sinergia con Hospitales: +20% ingresos adicionales",
            hospitals: "Hospitales: +5% ingresos, +2% eficiencia, +8% estabilidad. Sinergia con Universidades: +20% ingresos adicionales",
            banks: "Bancos: +12% ingresos, +6% eficiencia, +10% estabilidad. Sinergia con cualquier otra infraestructura: +15% ingresos adicionales"
        };
        return descriptions[infrastructureType] || "";
    }

    /**
     * Obtiene el costo balanceado de una infraestructura
     * @param {string} infrastructureType - Tipo de infraestructura
     * @param {number} gameWeek - Semana actual del juego
     * @returns {Object} Costo balanceado
     */
    getBalancedInfrastructureCost(infrastructureType, gameWeek) {
        const baseCost = this.getInfrastructureCost(infrastructureType);
        const costMultiplier = this.calculateCostMultiplier(gameWeek, 'infrastructure');
        
        return {
            money: Math.floor(baseCost.money * costMultiplier),
            stats: baseCost.stats // Los costos de estadísticas no escalan
        };
    }

    /**
     * Obtiene el beneficio balanceado de una infraestructura
     * @param {string} infrastructureType - Tipo de infraestructura
     * @param {Object} country - País
     * @returns {Object} Beneficio balanceado
     */
    getBalancedInfrastructureBenefit(infrastructureType, country) {
        const baseBenefit = this.getInfrastructureBenefit(infrastructureType);
        const incomeMultiplier = this.calculateBenefitMultiplier(country, 'income');
        const efficiencyMultiplier = this.calculateBenefitMultiplier(country, 'efficiency');
        const stabilityMultiplier = this.calculateBenefitMultiplier(country, 'stability');
        
        return {
            income_bonus: baseBenefit.income_bonus * incomeMultiplier,
            money_flat: Math.floor(baseBenefit.money_flat * incomeMultiplier),
            efficiency_bonus: baseBenefit.efficiency_bonus * efficiencyMultiplier,
            stability_bonus: baseBenefit.stability_bonus * stabilityMultiplier
        };
    }

    /**
     * Obtiene el beneficio base de una infraestructura
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {Object} Beneficio base
     */
    getInfrastructureBenefit(infrastructureType) {
        const benefits = {
            roads: { income_bonus: 0.10, efficiency_bonus: 0.05, stability_bonus: 0.03, money_flat: 0 },
            ports: { income_bonus: 0.15, efficiency_bonus: 0.08, stability_bonus: 0.04, money_flat: 0 },
            universities: { income_bonus: 0.08, efficiency_bonus: 0.03, stability_bonus: 0.05, money_flat: 0 },
            hospitals: { income_bonus: 0.05, efficiency_bonus: 0.02, stability_bonus: 0.08, money_flat: 0 },
            banks: { income_bonus: 0.12, efficiency_bonus: 0.06, stability_bonus: 0.10, money_flat: 0 }
        };
        
        return benefits[infrastructureType] || {};
    }

    /**
     * Calcula el multiplicador de costo basado en el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {string} type - Tipo de construcción
     * @returns {number} Multiplicador de costo
     */
    calculateCostMultiplier(gameWeek, type) {
        const baseMultiplier = 1.015; // +1.5% por semana para infraestructura
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
        const baseMultipliers = {
            income: 1.05,     // +5% por punto de economía
            efficiency: 1.03, // +3% por punto de ciencia
            stability: 1.02   // +2% por punto de social
        };
        
        const baseMultiplier = baseMultipliers[benefitType] || 1.0;
        
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
        const maxMultiplier = 2.5;
        const minMultiplier = 0.7;
        
        return Math.min(maxMultiplier, Math.max(minMultiplier, statMultiplier));
    }

    /**
     * Obtiene información de todas las infraestructuras disponibles
     * @param {Object} country - País
     * @returns {Array} Lista de infraestructuras disponibles
     */
    getAvailableInfrastructure(country) {
        const infrastructureTypes = ['roads', 'ports', 'universities', 'hospitals', 'banks'];
        const available = [];
        
        infrastructureTypes.forEach(type => {
            if (this.canBuildInfrastructure(country, type)) {
                const cost = this.getInfrastructureCost(country, type);
                available.push({
                    type: 'infrastructure',
                    name: type,
                    cost: cost,
                    description: this.getInfrastructureDescription(type)
                });
            }
        });
        
        return available;
    }

    /**
     * Obtiene información de todas las infraestructuras (construidas y disponibles)
     * @param {Object} country - País
     * @returns {Object} Información de infraestructuras
     */
    getInfrastructureInfo(country) {
        const infrastructureTypes = ['roads', 'ports', 'universities', 'hospitals', 'banks'];
        const info = {};
        
        infrastructureTypes.forEach(type => {
            const isBuilt = country.economicData.infrastructure[type] > 0;
            const canBuild = this.canBuildInfrastructure(country, type);
            const cost = canBuild ? this.getInfrastructureCost(country, type) : null;
            
            info[type] = {
                isBuilt: isBuilt,
                canBuild: canBuild,
                cost: cost,
                description: this.getInfrastructureDescription(type),
                benefit: this.getInfrastructureBenefit(type)
            };
        });
        
        return info;
    }

    /**
     * Obtiene el número de infraestructuras construidas
     * @param {Object} country - País
     * @returns {number} Número de infraestructuras construidas
     */
    getBuiltInfrastructureCount(country) {
        const infrastructure = country.economicData.infrastructure;
        return Object.values(infrastructure).filter(level => level > 0).length;
    }

    /**
     * Verifica si existe una sinergia específica
     * @param {Object} country - País
     * @param {string} synergyType - Tipo de sinergia
     * @returns {boolean} Si existe la sinergia
     */
    hasSynergy(country, synergyType) {
        const infrastructure = country.economicData.infrastructure;
        
        switch (synergyType) {
            case 'transport':
                return infrastructure.roads > 0 && infrastructure.ports > 0;
            case 'education':
                return infrastructure.universities > 0 && infrastructure.hospitals > 0;
            case 'financial':
                const builtCount = this.getBuiltInfrastructureCount(country);
                return infrastructure.banks > 0 && builtCount >= 2;
            case 'complete':
                return this.getBuiltInfrastructureCount(country) === 5;
            default:
                return false;
        }
    }

    /**
     * Obtiene información de sinergias disponibles
     * @param {Object} country - País
     * @returns {Array} Lista de sinergias disponibles
     */
    getAvailableSynergies(country) {
        const synergies = [];
        const infrastructure = country.economicData.infrastructure;
        
        // Sinergia de transporte
        if (infrastructure.roads > 0 && !infrastructure.ports) {
            synergies.push({
                type: 'transport',
                name: 'Sinergia de Transporte',
                description: 'Construir puertos para activar sinergia con carreteras',
                bonus: '+25% ingresos adicionales'
            });
        }
        
        if (infrastructure.ports > 0 && !infrastructure.roads) {
            synergies.push({
                type: 'transport',
                name: 'Sinergia de Transporte',
                description: 'Construir carreteras para activar sinergia con puertos',
                bonus: '+25% ingresos adicionales'
            });
        }
        
        // Sinergia educativa
        if (infrastructure.universities > 0 && !infrastructure.hospitals) {
            synergies.push({
                type: 'education',
                name: 'Sinergia Educativa',
                description: 'Construir hospitales para activar sinergia con universidades',
                bonus: '+20% ingresos adicionales'
            });
        }
        
        if (infrastructure.hospitals > 0 && !infrastructure.universities) {
            synergies.push({
                type: 'education',
                name: 'Sinergia Educativa',
                description: 'Construir universidades para activar sinergia con hospitales',
                bonus: '+20% ingresos adicionales'
            });
        }
        
        // Sinergia financiera
        if (infrastructure.banks > 0 && this.getBuiltInfrastructureCount(country) < 2) {
            synergies.push({
                type: 'financial',
                name: 'Sinergia Financiera',
                description: 'Construir cualquier otra infraestructura para activar sinergia con bancos',
                bonus: '+15% ingresos adicionales'
            });
        }
        
        // Sinergia completa
        const builtCount = this.getBuiltInfrastructureCount(country);
        if (builtCount === 4) {
            synergies.push({
                type: 'complete',
                name: 'Sinergia Completa',
                description: 'Construir la infraestructura faltante para activar sinergia completa',
                bonus: '+50% ingresos adicionales'
            });
        }
        
        return synergies;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfrastructureManager;
} 