/**
 * Gestor de Inversiones
 * Maneja todas las inversiones financieras, intereses y cálculos relacionados
 */
class InvestmentManager {
    constructor() {
        this.ministryName = "Gestor de Inversiones";
        this.version = "1.0.0";
    }

    /**
     * Calcula los intereses de todas las inversiones con multiplicadores de eventos
     * @param {Object} country - País
     * @returns {Object} Intereses por tipo de inversión
     */
    calculateInvestmentInterest(country) {
        const investments = country.economicData.investments;
        const interestRates = {
            bonds: 0.05,           // 5% anual para bonos
            developmentFund: 0.08, // 8% anual para fondo de desarrollo
            emergencyReserves: 0.02 // 2% anual para reservas (bajo riesgo)
        };
        
        // Aplicar multiplicadores de eventos financieros si existen
        const multipliers = country.economicData.investmentMultipliers || {};
        
        const interest = {};
        for (const type in investments) {
            let baseInterest = Math.floor(investments[type].value * interestRates[type]);
            
            // Aplicar multiplicador si existe
            if (multipliers[type]) {
                baseInterest = Math.floor(baseInterest * multipliers[type]);
            }
            
            interest[type] = baseInterest;
        }
        
        return interest;
    }

    /**
     * Obtiene el costo para invertir en bonos del estado
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getBondInvestmentInfo(country) {
        const currentBonds = country.economicData.investments.bonds.count;
        const baseCost = 200; // Costo base por bono
        const costMultiplier = 1 + (currentBonds / 100); // Costo crece con la cantidad
        
        // Calcular interés actual con multiplicadores
        const currentInterest = this.calculateInvestmentInterest(country).bonds || 0;
        const interestRate = currentInterest / Math.max(1, country.economicData.investments.bonds.value) * 100;
        
        return {
            cost: Math.floor(baseCost * costMultiplier),
            benefit: {
                money_flat: currentInterest,
                stability_bonus: 0.02 // +2% estabilidad por cada 100 bonos
            },
            description: `Bonos del Estado: Inversión segura con retorno del ${interestRate.toFixed(1)}% anual.`,
            currentInterest: currentInterest,
            interestRate: interestRate
        };
    }

    /**
     * Obtiene el costo para invertir en fondo de desarrollo
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getDevelopmentFundInfo(country) {
        const currentFund = country.economicData.investments.developmentFund.count;
        const baseCost = 300; // Costo base por unidad
        const costMultiplier = 1 + (currentFund / 50); // Costo crece más rápido
        
        // Calcular interés actual con multiplicadores
        const currentInterest = this.calculateInvestmentInterest(country).developmentFund || 0;
        const interestRate = currentInterest / Math.max(1, country.economicData.investments.developmentFund.value) * 100;
        
        return {
            cost: Math.floor(baseCost * costMultiplier),
            benefit: {
                development_points_flat: 1, // +1 punto de desarrollo por unidad
                income_bonus: 0.03, // +3% ingresos por cada 10 unidades
                science_bonus: 0.5 // +0.5 ciencia por cada 10 unidades
            },
            description: `Fondo de Desarrollo: Inversión en el futuro con retorno del ${interestRate.toFixed(1)}% anual y bonificaciones de desarrollo.`,
            currentInterest: currentInterest,
            interestRate: interestRate
        };
    }

    /**
     * Obtiene el costo para crear reservas de emergencia
     * @param {Object} country - País
     * @returns {Object} Costo y beneficios
     */
    getEmergencyReservesInfo(country) {
        const currentReserves = country.economicData.investments.emergencyReserves.count;
        const baseCost = 150; // Costo base por unidad
        const costMultiplier = 1 + (currentReserves / 200); // Costo crece más lento
        
        // Calcular interés actual con multiplicadores
        const currentInterest = this.calculateInvestmentInterest(country).emergencyReserves || 0;
        const interestRate = currentInterest / Math.max(1, country.economicData.investments.emergencyReserves.value) * 100;
        
        return {
            cost: Math.floor(baseCost * costMultiplier),
            benefit: {
                money_flat: currentInterest,
                stability_bonus: 0.05, // +5% estabilidad por cada 50 reservas
                crisis_resistance: 0.1 // +10% resistencia a crisis por cada 50 reservas
            },
            description: `Reservas de Emergencia: Protección financiera con retorno del ${interestRate.toFixed(1)}% anual y alta estabilidad.`,
            currentInterest: currentInterest,
            interestRate: interestRate
        };
    }

    /**
     * Verifica si un país puede invertir en bonos
     * @param {Object} country - País
     * @returns {boolean} Si puede invertir
     */
    canInvestInBonds(country) {
        const info = this.getBondInvestmentInfo(country);
        return country.money >= info.cost && country.stats.economy >= 3;
    }

    /**
     * Verifica si un país puede invertir en fondo de desarrollo
     * @param {Object} country - País
     * @returns {boolean} Si puede invertir
     */
    canInvestInDevelopmentFund(country) {
        const info = this.getDevelopmentFundInfo(country);
        return country.money >= info.cost && country.stats.economy >= 5;
    }

    /**
     * Verifica si un país puede crear reservas de emergencia
     * @param {Object} country - País
     * @returns {boolean} Si puede crear
     */
    canCreateEmergencyReserves(country) {
        const info = this.getEmergencyReservesInfo(country);
        return country.money >= info.cost && country.stats.economy >= 2;
    }

    /**
     * Invierte en bonos del estado
     * @param {Object} country - País
     * @returns {boolean} Si la inversión fue exitosa
     */
    investInBonds(country) {
        if (!this.canInvestInBonds(country)) return false;
        
        const info = this.getBondInvestmentInfo(country);
        country.money -= info.cost;
        country.economicData.investments.bonds.count++;
        country.economicData.investments.bonds.value += info.cost;
        
        return true;
    }

    /**
     * Invierte en fondo de desarrollo
     * @param {Object} country - País
     * @returns {boolean} Si la inversión fue exitosa
     */
    investInDevelopmentFund(country) {
        if (!this.canInvestInDevelopmentFund(country)) return false;
        
        const info = this.getDevelopmentFundInfo(country);
        country.money -= info.cost;
        country.economicData.investments.developmentFund.count++;
        country.economicData.investments.developmentFund.value += info.cost;
        
        return true;
    }

    /**
     * Crea reservas de emergencia
     * @param {Object} country - País
     * @returns {boolean} Si la creación fue exitosa
     */
    createEmergencyReserves(country) {
        if (!this.canCreateEmergencyReserves(country)) return false;
        
        const info = this.getEmergencyReservesInfo(country);
        country.money -= info.cost;
        country.economicData.investments.emergencyReserves.count++;
        country.economicData.investments.emergencyReserves.value += info.cost;
        
        return true;
    }

    /**
     * Procesa los intereses de todas las inversiones
     * @param {Object} country - País
     */
    processInvestmentInterest(country) {
        const interest = this.calculateInvestmentInterest(country);
        
        // Añadir intereses al dinero del país
        for (const type in interest) {
            country.money += interest[type];
        }
        
        // Aplicar bonificaciones de estabilidad
        const investments = country.economicData.investments;
        
        if (investments.bonds.count > 0) {
            country.economicData.indicators.stability += (investments.bonds.count / 100) * 0.02;
        }
        
        if (investments.emergencyReserves.count > 0) {
            country.economicData.indicators.stability += (investments.emergencyReserves.count / 50) * 0.05;
        }
    }

    /**
     * Obtiene información de todas las inversiones disponibles
     * @param {Object} country - País
     * @returns {Object} Información de inversiones
     */
    getInvestmentInfo(country) {
        return {
            bonds: this.getBondInvestmentInfo(country),
            developmentFund: this.getDevelopmentFundInfo(country),
            emergencyReserves: this.getEmergencyReservesInfo(country),
            canInvest: {
                bonds: this.canInvestInBonds(country),
                developmentFund: this.canInvestInDevelopmentFund(country),
                emergencyReserves: this.canCreateEmergencyReserves(country)
            }
        };
    }

    /**
     * Obtiene el costo balanceado de una inversión
     * @param {string} investmentType - Tipo de inversión
     * @param {number} currentAmount - Cantidad actual
     * @param {number} gameWeek - Semana actual del juego
     * @returns {number} Costo balanceado
     */
    getBalancedInvestmentCost(investmentType, currentAmount, gameWeek) {
        const baseCost = this.getInvestmentCost(investmentType, currentAmount);
        const costMultiplier = this.calculateCostMultiplier(gameWeek, 'investments');
        
        return Math.floor(baseCost * costMultiplier);
    }

    /**
     * Obtiene el beneficio balanceado de una inversión
     * @param {string} investmentType - Tipo de inversión
     * @param {number} amount - Cantidad invertida
     * @param {Object} country - País
     * @returns {Object} Beneficio balanceado
     */
    getBalancedInvestmentBenefit(investmentType, amount, country) {
        const baseBenefit = this.getInvestmentBenefit(investmentType, amount);
        const incomeMultiplier = this.calculateBenefitMultiplier(country, 'income');
        const stabilityMultiplier = this.calculateBenefitMultiplier(country, 'stability');
        
        return {
            money_flat: Math.floor(baseBenefit.money_flat * incomeMultiplier),
            income_bonus: baseBenefit.income_bonus * incomeMultiplier,
            stability_bonus: baseBenefit.stability_bonus * stabilityMultiplier,
            development_points_flat: baseBenefit.development_points_flat // Los puntos de desarrollo no escalan
        };
    }

    /**
     * Obtiene el costo base de una inversión
     * @param {string} investmentType - Tipo de inversión
     * @param {number} currentAmount - Cantidad actual
     * @returns {number} Costo base
     */
    getInvestmentCost(investmentType, currentAmount) {
        const baseCosts = {
            bonds: 200,
            developmentFund: 300,
            emergencyReserves: 150
        };
        
        const baseCost = baseCosts[investmentType] || 0;
        const costMultiplier = 1 + (currentAmount / 100);
        
        return Math.floor(baseCost * costMultiplier);
    }

    /**
     * Obtiene el beneficio base de una inversión
     * @param {string} investmentType - Tipo de inversión
     * @param {number} amount - Cantidad invertida
     * @returns {Object} Beneficio base
     */
    getInvestmentBenefit(investmentType, amount) {
        const benefits = {
            bonds: {
                money_flat: amount * 0.05,
                stability_bonus: 0.02
            },
            developmentFund: {
                development_points_flat: 1,
                income_bonus: 0.03,
                science_bonus: 0.5
            },
            emergencyReserves: {
                money_flat: amount * 0.02,
                stability_bonus: 0.05,
                crisis_resistance: 0.1
            }
        };
        
        return benefits[investmentType] || {};
    }

    /**
     * Calcula el multiplicador de costo basado en el progreso del juego
     * @param {number} gameWeek - Semana actual del juego
     * @param {string} type - Tipo de inversión
     * @returns {number} Multiplicador de costo
     */
    calculateCostMultiplier(gameWeek, type) {
        const baseMultiplier = 1.01; // +1% por semana para inversiones
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
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvestmentManager;
} 