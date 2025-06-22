/**
 * Calculador de Ingresos
 * Maneja todos los cálculos relacionados con ingresos, bonificaciones e indicadores económicos
 */
class IncomeCalculator {
    constructor() {
        this.ministryName = "Calculador de Ingresos";
        this.version = "1.0.0";
    }

    /**
     * Calcula los ingresos totales de un país incluyendo bonificaciones económicas
     * @param {Object} country - País a calcular
     * @returns {number} Ingresos totales
     */
    calculateTotalIncome(country) {
        let baseIncome = country.income || 0;
        let totalIncome = baseIncome;
        
        // Bonificaciones por industrias
        totalIncome += this.calculateIndustryBonuses(country);
        
        // Bonificaciones por infraestructura
        totalIncome += this.calculateInfrastructureBonuses(country);
        
        // Bonificaciones por inversiones
        totalIncome += this.calculateInvestmentBonuses(country);
        
        // Aplicar multiplicadores de eficiencia y estabilidad
        totalIncome *= country.economicData.indicators.efficiency;
        totalIncome *= country.economicData.indicators.stability;
        
        return Math.floor(totalIncome);
    }

    /**
     * Calcula bonificaciones de ingresos por inversiones
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateInvestmentBonuses(country) {
        const investments = country.economicData.investments;
        let bonus = 0;
        
        // Fondo de desarrollo: +3% ingresos por cada 10 unidades
        const developmentFundBonus = Math.floor(investments.developmentFund.count / 10) * 0.03 * country.income;
        bonus += developmentFundBonus;
        
        return Math.floor(bonus);
    }

    /**
     * Calcula bonificaciones de ingresos por industrias
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateIndustryBonuses(country) {
        const industries = country.economicData.industries;
        let bonus = 0;
        
        // Industria Básica: +10% por nivel
        bonus += industries.basic * 0.1 * country.income;
        
        // Industria Avanzada: +15% por nivel
        bonus += industries.advanced * 0.15 * country.income;
        
        // Industria Cultural: +12% por nivel
        bonus += industries.cultural * 0.12 * country.income;
        
        // Industria Militar: +8% por nivel (reduce costos militares)
        bonus += industries.military * 0.08 * country.income;
        
        // Industria Tecnológica: +20% por nivel
        bonus += industries.tech * 0.20 * country.income;
        
        return Math.floor(bonus);
    }

    /**
     * Calcula bonificaciones de ingresos por infraestructura con sinergias
     * @param {Object} country - País a calcular
     * @returns {number} Bonificación total
     */
    calculateInfrastructureBonuses(country) {
        const infrastructure = country.economicData.infrastructure;
        let bonus = 0;
        
        // Bonificaciones individuales
        // Carreteras: +10% ingresos
        if (infrastructure.roads > 0) {
            bonus += country.income * 0.10;
        }
        
        // Puertos: +15% ingresos
        if (infrastructure.ports > 0) {
            bonus += country.income * 0.15;
        }
        
        // Universidades: +8% ingresos (por investigación y desarrollo)
        if (infrastructure.universities > 0) {
            bonus += country.income * 0.08;
        }
        
        // Hospitales: +5% ingresos (por productividad laboral)
        if (infrastructure.hospitals > 0) {
            bonus += country.income * 0.05;
        }
        
        // Bancos: +12% ingresos
        if (infrastructure.banks > 0) {
            bonus += country.income * 0.12;
        }
        
        // SINERGIAS DE INFRAESTRUCTURA
        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        
        // Sinergia básica: +2% por cada tipo adicional de infraestructura
        if (builtInfrastructure >= 2) {
            bonus += country.income * (builtInfrastructure - 1) * 0.02;
        }
        
        // Sinergia de transporte: Carreteras + Puertos = +25% adicional
        if (infrastructure.roads > 0 && infrastructure.ports > 0) {
            bonus += country.income * 0.25;
        }
        
        // Sinergia educativa: Universidades + Hospitales = +20% adicional
        if (infrastructure.universities > 0 && infrastructure.hospitals > 0) {
            bonus += country.income * 0.20;
        }
        
        // Sinergia financiera: Bancos + cualquier otra infraestructura = +15% adicional
        if (infrastructure.banks > 0 && builtInfrastructure >= 2) {
            bonus += country.income * 0.15;
        }
        
        // Sinergia completa: Todas las infraestructuras = +50% adicional
        if (builtInfrastructure === 5) {
            bonus += country.income * 0.50;
        }
        
        return Math.floor(bonus);
    }

    /**
     * Calcula bonificaciones de eficiencia por infraestructura
     * @param {Object} country - País a calcular
     * @returns {number} Multiplicador de eficiencia
     */
    calculateInfrastructureEfficiency(country) {
        const infrastructure = country.economicData.infrastructure;
        let efficiency = 1.0;
        
        // Efectos individuales en eficiencia
        if (infrastructure.roads > 0) efficiency += 0.05;      // +5% eficiencia
        if (infrastructure.ports > 0) efficiency += 0.08;      // +8% eficiencia
        if (infrastructure.universities > 0) efficiency += 0.03; // +3% eficiencia
        if (infrastructure.hospitals > 0) efficiency += 0.02;   // +2% eficiencia
        if (infrastructure.banks > 0) efficiency += 0.06;       // +6% eficiencia
        
        // Sinergias de eficiencia
        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        
        // Eficiencia por cantidad: +1% por cada tipo adicional
        if (builtInfrastructure >= 2) {
            efficiency += (builtInfrastructure - 1) * 0.01;
        }
        
        // Sinergia de logística: Carreteras + Puertos = +10% eficiencia adicional
        if (infrastructure.roads > 0 && infrastructure.ports > 0) {
            efficiency += 0.10;
        }
        
        return Math.min(efficiency, 2.0); // Máximo 200% de eficiencia
    }

    /**
     * Calcula bonificaciones de estabilidad por infraestructura
     * @param {Object} country - País a calcular
     * @returns {number} Multiplicador de estabilidad
     */
    calculateInfrastructureStability(country) {
        const infrastructure = country.economicData.infrastructure;
        let stability = 1.0;
        
        // Efectos individuales en estabilidad
        if (infrastructure.hospitals > 0) stability += 0.08;    // +8% estabilidad
        if (infrastructure.banks > 0) stability += 0.10;        // +10% estabilidad
        if (infrastructure.universities > 0) stability += 0.05; // +5% estabilidad
        if (infrastructure.roads > 0) stability += 0.03;        // +3% estabilidad
        if (infrastructure.ports > 0) stability += 0.04;        // +4% estabilidad
        
        // Sinergias de estabilidad
        // Sistema de salud completo: Hospitales + Universidades = +15% estabilidad adicional
        if (infrastructure.hospitals > 0 && infrastructure.universities > 0) {
            stability += 0.15;
        }
        
        // Sistema financiero robusto: Bancos + cualquier otra infraestructura = +8% estabilidad adicional
        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        if (infrastructure.banks > 0 && builtInfrastructure >= 2) {
            stability += 0.08;
        }
        
        return Math.min(stability, 1.5); // Máximo 150% de estabilidad
    }

    /**
     * Calcula el PIB del país
     * @param {Object} country - País a calcular
     * @returns {number} PIB total
     */
    calculateGDP(country) {
        const baseGDP = country.population * 10; // PIB base por persona
        const industryBonus = this.calculateIndustryBonuses(country) * 10;
        const infrastructureBonus = this.calculateInfrastructureBonuses(country) * 10;
        
        return Math.floor(baseGDP + industryBonus + infrastructureBonus);
    }

    /**
     * Calcula la tasa de crecimiento económico
     * @param {Object} country - País a calcular
     * @returns {number} Tasa de crecimiento (porcentaje)
     */
    calculateGrowthRate(country) {
        let growth = 2.0; // Crecimiento base 2%
        
        // Bonificaciones por industrias
        const industries = country.economicData.industries;
        growth += industries.basic * 0.5;
        growth += industries.advanced * 0.8;
        growth += industries.cultural * 0.6;
        growth += industries.military * 0.3;
        growth += industries.tech * 1.0;
        
        // Bonificaciones por infraestructura
        const infrastructure = country.economicData.infrastructure;
        if (infrastructure.roads > 0) growth += 0.5;
        if (infrastructure.ports > 0) growth += 0.8;
        if (infrastructure.universities > 0) growth += 0.3;
        if (infrastructure.hospitals > 0) growth += 0.2;
        if (infrastructure.banks > 0) growth += 0.4;
        
        return Math.min(growth, 10.0); // Máximo 10% de crecimiento
    }

    /**
     * Actualiza los indicadores económicos de un país
     * @param {Object} country - País a actualizar
     */
    updateEconomicIndicators(country) {
        // Asegurarse de que los datos económicos estén inicializados
        if (!country.economicData) {
            throw new Error("Los datos económicos no están inicializados. Use EconomicDataManager.initializeCountryEconomy() primero.");
        }

        country.economicData.indicators.gdp = this.calculateGDP(country);
        country.economicData.indicators.growthRate = this.calculateGrowthRate(country);
        
        // Calcular eficiencia usando el nuevo método con sinergias
        let efficiency = this.calculateInfrastructureEfficiency(country);
        
        // Bonificaciones de eficiencia por inversiones
        const investments = country.economicData.investments;
        efficiency += (investments.developmentFund.count / 20) * 0.02; // +2% eficiencia por cada 20 unidades de fondo
        
        country.economicData.indicators.efficiency = Math.min(efficiency, 2.0);
        
        // Calcular estabilidad usando el nuevo método con sinergias
        let stability = this.calculateInfrastructureStability(country);
        
        // Bonificaciones de estabilidad por industrias
        const industries = country.economicData.industries;
        stability += industries.basic * 0.05;
        stability += industries.advanced * 0.08;
        stability += industries.cultural * 0.06;
        stability += industries.military * 0.04;
        stability += industries.tech * 0.10;
        
        // Bonificaciones de estabilidad por inversiones
        stability += (investments.bonds.count / 100) * 0.02; // +2% estabilidad por cada 100 bonos
        stability += (investments.emergencyReserves.count / 50) * 0.05; // +5% estabilidad por cada 50 reservas
        
        country.economicData.indicators.stability = Math.min(stability, 2.0);
    }

    /**
     * Obtiene información económica para mostrar en la UI
     * @param {Object} country - País
     * @returns {Object} Información económica formateada
     */
    getEconomicInfo(country) {
        this.updateEconomicIndicators(country);
        
        return {
            gdp: country.economicData.indicators.gdp,
            growthRate: country.economicData.indicators.growthRate.toFixed(1),
            efficiency: country.economicData.indicators.efficiency.toFixed(2),
            stability: country.economicData.indicators.stability.toFixed(2),
            totalIncome: this.calculateTotalIncome(country),
            industryBonus: this.calculateIndustryBonuses(country),
            infrastructureBonus: this.calculateInfrastructureBonuses(country),
            investmentBonus: this.calculateInvestmentBonuses(country),
            industries: country.economicData.industries,
            infrastructure: country.economicData.infrastructure,
            investments: country.economicData.investments
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncomeCalculator;
} 