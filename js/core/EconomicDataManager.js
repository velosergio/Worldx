/**
 * Gestor de Datos Económicos
 * Maneja la inicialización y estructura de datos económicos de los países
 */
class EconomicDataManager {
    constructor() {
        this.ministryName = "Gestor de Datos Económicos";
        this.version = "1.0.0";
    }

    /**
     * Inicializa las propiedades económicas de un país
     * @param {Object} country - País a inicializar
     */
    initializeCountryEconomy(country) {
        // Propiedades económicas básicas
        country.economicData = {
            // Industrias (0 = no construida, 1-5 = nivel)
            industries: {
                basic: 0,      // Industria Básica
                advanced: 0,   // Industria Avanzada
                cultural: 0,   // Industria Cultural
                military: 0,   // Industria Militar
                tech: 0        // Industria Tecnológica
            },
            
            // Infraestructura (0 = no construida, 1 = construida)
            infrastructure: {
                roads: 0,      // Carreteras
                ports: 0,      // Puertos
                universities: 0, // Universidades
                hospitals: 0,  // Hospitales
                banks: 0       // Bancos
            },
            
            // Inversiones financieras: se guarda la cantidad y el valor total invertido
            investments: {
                bonds: { count: 0, value: 0 },
                developmentFund: { count: 0, value: 0 },
                emergencyReserves: { count: 0, value: 0 }
            },
            
            // Indicadores económicos
            indicators: {
                gdp: 0,        // Producto Interno Bruto
                growthRate: 0, // Tasa de crecimiento
                efficiency: 1, // Eficiencia económica (multiplicador)
                stability: 1   // Estabilidad económica (multiplicador)
            },
            
            // Contadores de mejoras (para costos crecientes)
            upgradeCounts: {
                basicIndustry: 0,
                advancedIndustry: 0,
                culturalIndustry: 0,
                militaryIndustry: 0,
                techIndustry: 0,
                roads: 0,
                ports: 0,
                universities: 0,
                hospitals: 0,
                banks: 0
            }
        };
    }

    /**
     * Verifica si los datos económicos están inicializados
     * @param {Object} country - País a verificar
     * @returns {boolean} Si están inicializados
     */
    isEconomyInitialized(country) {
        return country.economicData && country.economicData.industries;
    }

    /**
     * Asegura que los datos económicos estén inicializados
     * @param {Object} country - País a verificar
     */
    ensureEconomyInitialized(country) {
        if (!this.isEconomyInitialized(country)) {
            this.initializeCountryEconomy(country);
        }
    }

    /**
     * Obtiene el número de infraestructuras construidas
     * @param {Object} country - País
     * @returns {number} Número de infraestructuras construidas
     */
    getBuiltInfrastructureCount(country) {
        if (!this.isEconomyInitialized(country)) return 0;
        
        const infrastructure = country.economicData.infrastructure;
        return Object.values(infrastructure).filter(level => level > 0).length;
    }

    /**
     * Obtiene el nivel total de industrias
     * @param {Object} country - País
     * @returns {number} Nivel total de industrias
     */
    getTotalIndustryLevel(country) {
        if (!this.isEconomyInitialized(country)) return 0;
        
        const industries = country.economicData.industries;
        return Object.values(industries).reduce((total, level) => total + level, 0);
    }

    /**
     * Obtiene el valor total de inversiones
     * @param {Object} country - País
     * @returns {number} Valor total de inversiones
     */
    getTotalInvestmentValue(country) {
        if (!this.isEconomyInitialized(country)) return 0;
        
        const investments = country.economicData.investments;
        return Object.values(investments).reduce((total, inv) => total + inv.value, 0);
    }

    /**
     * Obtiene información resumida de la economía
     * @param {Object} country - País
     * @returns {Object} Información resumida
     */
    getEconomySummary(country) {
        this.ensureEconomyInitialized(country);
        
        return {
            industries: country.economicData.industries,
            infrastructure: country.economicData.infrastructure,
            investments: country.economicData.investments,
            indicators: country.economicData.indicators,
            upgradeCounts: country.economicData.upgradeCounts,
            builtInfrastructureCount: this.getBuiltInfrastructureCount(country),
            totalIndustryLevel: this.getTotalIndustryLevel(country),
            totalInvestmentValue: this.getTotalInvestmentValue(country)
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomicDataManager;
} 