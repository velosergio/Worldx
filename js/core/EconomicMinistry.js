/**
 * Ministerio de Economía para Worldx
 * Gestiona las finanzas del país, industrias, infraestructura e inversiones
 * 
 * REFACTORIZADO: Ahora usa módulos especializados para mejor organización
 */
class EconomicMinistry {
    constructor() {
        this.ministryName = "Ministerio de Economía";
        this.version = "2.0.0";

        // Inicializar módulos especializados
        this.dataManager = new EconomicDataManager();
        this.incomeCalculator = new IncomeCalculator();
        this.investmentManager = new InvestmentManager();
        this.industryManager = new IndustryManager();
        this.infrastructureManager = new InfrastructureManager();
        this.militaryBonusManager = new MilitaryBonusManager();
        this.balanceManager = new BalanceManager();
    }

    // ============================================================================
    // MÉTODOS DE DATOS ECONÓMICOS (delegados a EconomicDataManager)
    // ============================================================================

    /**
     * Inicializa las propiedades económicas de un país
     * @param {Object} country - País a inicializar
     */
    initializeCountryEconomy(country) {
        this.dataManager.initializeCountryEconomy(country);
    }

    /**
     * Verifica si los datos económicos están inicializados
     * @param {Object} country - País a verificar
     * @returns {boolean} Si están inicializados
     */
    isEconomyInitialized(country) {
        return this.dataManager.isEconomyInitialized(country);
    }

    /**
     * Asegura que los datos económicos estén inicializados
     * @param {Object} country - País a verificar
     */
    ensureEconomyInitialized(country) {
        this.dataManager.ensureEconomyInitialized(country);
    }

    // ============================================================================
    // MÉTODOS DE CÁLCULO DE INGRESOS (delegados a IncomeCalculator)
    // ============================================================================

    /**
     * Calcula los ingresos totales de un país incluyendo bonificaciones económicas
     * @param {Object} country - País a calcular
     * @returns {number} Ingresos totales
     */
    calculateTotalIncome(country) {
        return this.incomeCalculator.calculateTotalIncome(country);
    }

    /**
     * Calcula bonificaciones de ingresos por inversiones
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateInvestmentBonuses(country) {
        return this.incomeCalculator.calculateInvestmentBonuses(country);
    }

    /**
     * Calcula bonificaciones de ingresos por industrias
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateIndustryBonuses(country) {
        return this.incomeCalculator.calculateIndustryBonuses(country);
    }

    /**
     * Calcula bonificaciones de ingresos por infraestructura con sinergias
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateInfrastructureBonuses(country) {
        return this.incomeCalculator.calculateInfrastructureBonuses(country);
    }

    /**
     * Calcula bonificaciones de eficiencia por infraestructura
     * @param {Object} country - País a calcular
     * @returns {number} Multiplicador de eficiencia
     */
    calculateInfrastructureEfficiency(country) {
        return this.incomeCalculator.calculateInfrastructureEfficiency(country);
    }

    /**
     * Calcula bonificaciones de estabilidad por infraestructura
     * @param {Object} country - País a calcular
     * @returns {number} Multiplicador de estabilidad
     */
    calculateInfrastructureStability(country) {
        return this.incomeCalculator.calculateInfrastructureStability(country);
    }

    /**
     * Calcula el PIB del país
     * @param {Object} country - País a calcular
     * @returns {number} PIB total
     */
    calculateGDP(country) {
        return this.incomeCalculator.calculateGDP(country);
    }

    /**
     * Calcula la tasa de crecimiento económico
     * @param {Object} country - País a calcular
     * @returns {number} Tasa de crecimiento (porcentaje)
     */
    calculateGrowthRate(country) {
        return this.incomeCalculator.calculateGrowthRate(country);
    }

    /**
     * Actualiza los indicadores económicos de un país
     * @param {Object} country - País a actualizar
     */
    updateEconomicIndicators(country) {
        this.incomeCalculator.updateEconomicIndicators(country);
    }

    /**
     * Obtiene información económica para mostrar en la UI
     * @param {Object} country - País
     * @returns {Object} Información económica formateada
     */
    getEconomicInfo(country) {
        return this.incomeCalculator.getEconomicInfo(country);
    }

    // ============================================================================
    // MÉTODOS DE INVERSIONES (delegados a InvestmentManager)
    // ============================================================================

    /**
     * Calcula los intereses de todas las inversiones con multiplicadores de eventos
     * @param {Object} country - País
     * @returns {Object} Intereses por tipo de inversión
     */
    calculateInvestmentInterest(country) {
        return this.investmentManager.calculateInvestmentInterest(country);
    }

    /**
     * Obtiene el costo para invertir en bonos del estado
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getBondInvestmentInfo(country) {
        return this.investmentManager.getBondInvestmentInfo(country);
    }

    /**
     * Obtiene el costo para invertir en fondo de desarrollo
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getDevelopmentFundInfo(country) {
        return this.investmentManager.getDevelopmentFundInfo(country);
    }

    /**
     * Obtiene el costo para crear reservas de emergencia
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getEmergencyReservesInfo(country) {
        return this.investmentManager.getEmergencyReservesInfo(country);
    }

    /**
     * Verifica si un país puede invertir en bonos
     * @param {Object} country - País
     * @returns {boolean} Si puede invertir
     */
    canInvestInBonds(country) {
        return this.investmentManager.canInvestInBonds(country);
    }

    /**
     * Verifica si un país puede invertir en fondo de desarrollo
     * @param {Object} country - País
     * @returns {boolean} Si puede invertir
     */
    canInvestInDevelopmentFund(country) {
        return this.investmentManager.canInvestInDevelopmentFund(country);
    }

    /**
     * Verifica si un país puede crear reservas de emergencia
     * @param {Object} country - País
     * @returns {boolean} Si puede crear
     */
    canCreateEmergencyReserves(country) {
        return this.investmentManager.canCreateEmergencyReserves(country);
    }

    /**
     * Invierte en bonos del estado
     * @param {Object} country - País
     * @returns {boolean} Si la inversión fue exitosa
     */
    investInBonds(country) {
        const success = this.investmentManager.investInBonds(country);
        if (success) {
            this.updateEconomicIndicators(country);
        }
        return success;
    }

    /**
     * Invierte en fondo de desarrollo
     * @param {Object} country - País
     * @returns {boolean} Si la inversión fue exitosa
     */
    investInDevelopmentFund(country) {
        const success = this.investmentManager.investInDevelopmentFund(country);
        if (success) {
            this.updateEconomicIndicators(country);
        }
        return success;
    }

    /**
     * Crea reservas de emergencia
     * @param {Object} country - País
     * @returns {boolean} Si la creación fue exitosa
     */
    createEmergencyReserves(country) {
        const success = this.investmentManager.createEmergencyReserves(country);
        if (success) {
            this.updateEconomicIndicators(country);
        }
        return success;
    }

    /**
     * Procesa los intereses de todas las inversiones
     * @param {Object} country - País
     */
    processInvestmentInterest(country) {
        this.investmentManager.processInvestmentInterest(country);
    }

    // ============================================================================
    // MÉTODOS DE INDUSTRIAS (delegados a IndustryManager)
    // ============================================================================

    /**
     * Obtiene el costo para construir/mejorar una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {Object} Costo en dinero y estadísticas
     */
    getIndustryCost(country, industryType) {
        return this.industryManager.getIndustryCost(country, industryType);
    }

    /**
     * Verifica si se puede construir/mejorar una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {boolean} Si se puede construir
     */
    canBuildIndustry(country, industryType) {
        return this.industryManager.canBuildIndustry(country, industryType);
    }

    /**
     * Construye/mejora una industria
     * @param {Object} country - País
     * @param {string} industryType - Tipo de industria
     * @returns {boolean} Si se construyó exitosamente
     */
    buildIndustry(country, industryType) {
        const success = this.industryManager.buildIndustry(country, industryType);
        if (success) {
            this.updateEconomicIndicators(country);
        }
        return success;
    }

    /**
     * Obtiene descripción de una industria
     * @param {string} industryType - Tipo de industria
     * @returns {string} Descripción
     */
    getIndustryDescription(industryType) {
        return this.industryManager.getIndustryDescription(industryType);
    }

    // ============================================================================
    // MÉTODOS DE INFRAESTRUCTURA (delegados a InfrastructureManager)
    // ============================================================================

    /**
     * Obtiene el costo para construir infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {Object} Costo en dinero y estadísticas
     */
    getInfrastructureCost(country, infrastructureType) {
        return this.infrastructureManager.getInfrastructureCost(country, infrastructureType);
    }

    /**
     * Verifica si se puede construir infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {boolean} Si se puede construir
     */
    canBuildInfrastructure(country, infrastructureType) {
        return this.infrastructureManager.canBuildInfrastructure(country, infrastructureType);
    }

    /**
     * Construye infraestructura
     * @param {Object} country - País
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {boolean} Si se construyó exitosamente
     */
    buildInfrastructure(country, infrastructureType) {
        const success = this.infrastructureManager.buildInfrastructure(country, infrastructureType);
        if (success) {
            this.updateEconomicIndicators(country);
        }
        return success;
    }

    /**
     * Obtiene descripción de infraestructura
     * @param {string} infrastructureType - Tipo de infraestructura
     * @returns {string} Descripción
     */
    getInfrastructureDescription(infrastructureType) {
        return this.infrastructureManager.getInfrastructureDescription(infrastructureType);
    }

    // ============================================================================
    // MÉTODOS DE BONIFICACIONES MILITARES (delegados a MilitaryBonusManager)
    // ============================================================================

    /**
     * Calcula las bonificaciones militares basadas en la economía
     * @param {Object} country - País
     * @returns {Object} Bonificaciones militares
     */
    calculateMilitaryBonuses(country) {
        return this.militaryBonusManager.calculateMilitaryBonuses(country);
    }

    /**
     * Aplica las bonificaciones militares a un país
     * @param {Object} country - País
     */
    applyMilitaryBonuses(country) {
        this.militaryBonusManager.applyMilitaryBonuses(country);
    }

    /**
     * Obtiene información de las sinergias militares
     * @param {Object} country - País
     * @returns {Object} Información de sinergias
     */
    getMilitarySynergyInfo(country) {
        return this.militaryBonusManager.getMilitarySynergyInfo(country);
    }

    /**
     * Calcula el costo de mantenimiento militar con bonificaciones
     * @param {Object} country - País
     * @returns {number} Costo de mantenimiento ajustado
     */
    calculateAdjustedMilitaryMaintenance(country) {
        return this.militaryBonusManager.calculateAdjustedMilitaryMaintenance(country);
    }

    /**
     * Calcula el poder militar total con bonificaciones económicas
     * @param {Object} country - País
     * @returns {number} Poder militar total
     */
    calculateTotalMilitaryPower(country) {
        return this.militaryBonusManager.calculateTotalMilitaryPower(country);
    }

    // ============================================================================
    // MÉTODOS DE BALANCE (delegados a BalanceManager)
    // ============================================================================

    /**
     * Calcula el multiplicador de costo basado en el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {string} type - Tipo de construcción (industries, infrastructure, investments)
     * @returns {number} Multiplicador de costo
     */
    calculateCostMultiplier(gameWeek, type) {
        return this.balanceManager.calculateCostMultiplier(gameWeek, type);
    }

    /**
     * Calcula el multiplicador de beneficio basado en las estadísticas del país
     * @param {Object} country - País
     * @param {string} benefitType - Tipo de beneficio (income, efficiency, stability)
     * @returns {number} Multiplicador de beneficio
     */
    calculateBenefitMultiplier(country, benefitType) {
        return this.balanceManager.calculateBenefitMultiplier(country, benefitType);
    }

    /**
     * Ajusta los multiplicadores de balance según el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {Array} countries - Lista de países
     */
    adjustBalanceMultipliers(gameWeek, countries) {
        this.balanceManager.adjustBalanceMultipliers(gameWeek, countries);
    }

    /**
     * Obtiene información de balance para la interfaz
     * @param {number} gameWeek - Semana actual del juego
     * @param {Object} country - País
     * @returns {Object} Información de balance
     */
    getBalanceInfo(gameWeek, country) {
        return this.balanceManager.getBalanceInfo(gameWeek, country);
    }

    // ============================================================================
    // MÉTODOS DE CONVENIENCIA Y COMPATIBILIDAD
    // ============================================================================

    /**
     * Obtiene el resumen de acciones disponibles
     * @param {Object} country - País
     * @returns {Array} Lista de acciones disponibles
     */
    getAvailableActions(country) {
        const actions = [];
        
        // Industrias disponibles
        const availableIndustries = this.industryManager.getAvailableIndustries(country);
        actions.push(...availableIndustries);
        
        // Infraestructura disponible
        const availableInfrastructure = this.infrastructureManager.getAvailableInfrastructure(country);
        actions.push(...availableInfrastructure);
        
        return actions;
    }

    /**
     * Obtiene información completa de la economía de un país
     * @param {Object} country - País
     * @returns {Object} Información completa
     */
    getCompleteEconomicInfo(country) {
        this.ensureEconomyInitialized(country);
        
        return {
            // Información básica
            economicInfo: this.getEconomicInfo(country),
            economySummary: this.dataManager.getEconomySummary(country),
            
            // Información de industrias
            industryInfo: this.industryManager.getIndustryInfo(country),
            availableIndustries: this.industryManager.getAvailableIndustries(country),
            
            // Información de infraestructura
            infrastructureInfo: this.infrastructureManager.getInfrastructureInfo(country),
            availableInfrastructure: this.infrastructureManager.getAvailableInfrastructure(country),
            availableSynergies: this.infrastructureManager.getAvailableSynergies(country),
            
            // Información de inversiones
            investmentInfo: this.investmentManager.getInvestmentInfo(country),
            
            // Información militar
            militaryBonusInfo: this.militaryBonusManager.getMilitaryBonusInfo(country),
            
            // Información de balance
            balanceInfo: this.getBalanceInfo(0, country) // gameWeek = 0 por defecto
        };
    }

    /**
     * Procesa todas las actualizaciones económicas de un país
     * @param {Object} country - País
     */
    processEconomicUpdates(country) {
        this.ensureEconomyInitialized(country);
        this.updateEconomicIndicators(country);
        this.applyMilitaryBonuses(country);
        this.processInvestmentInterest(country);
    }

    /**
     * Obtiene información de todos los módulos
     * @returns {Object} Información de módulos
     */
    getModulesInfo() {
        return {
            dataManager: this.dataManager.ministryName,
            incomeCalculator: this.incomeCalculator.ministryName,
            investmentManager: this.investmentManager.ministryName,
            industryManager: this.industryManager.ministryName,
            infrastructureManager: this.infrastructureManager.ministryName,
            militaryBonusManager: this.militaryBonusManager.ministryName,
            balanceManager: this.balanceManager.ministryName,
            version: this.version
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomicMinistry;
} 