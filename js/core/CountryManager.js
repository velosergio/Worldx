/**
 * Gestor de países para Worldx
 * REFACTORIZADO: Ahora usa módulos especializados para mejor organización
 */
class CountryManager {
    constructor() {
        this.countries = [];
        this.playerCountry = null;
        this.aiCountries = [];
        this.countryGenerator = new CountryGenerator();
        this.economicMinistry = new EconomicMinistry();
        
        // Inicializar módulos especializados
        this.militaryManager = new MilitaryManager(this);
        this.battleManager = new BattleManager(this);
        this.intelManager = new IntelManager(this);
    }

    /**
     * Inicializa los países del juego
     */
    initializeCountries(playerCountryName = null) {
        this.countries = [];
        
        // Generar país del jugador
        this.playerCountry = this.countryGenerator.generateCountry(true, playerCountryName);
        this.economicMinistry.initializeCountryEconomy(this.playerCountry);
        this.countries.push(this.playerCountry);
        
        // Generar países de IA
        this.aiCountries = [];
        for (let i = 0; i < 2; i++) {
            const aiCountry = this.countryGenerator.generateCountry(false);
            this.economicMinistry.initializeCountryEconomy(aiCountry);
            this.countries.push(aiCountry);
            this.aiCountries.push(aiCountry);
        }
        
        return this.countries;
    }

    /**
     * Obtiene el país del jugador
     */
    getPlayerCountry() {
        return this.playerCountry;
    }

    /**
     * Obtiene los países de IA
     */
    getAICountries() {
        return this.aiCountries;
    }

    /**
     * Obtiene todos los países
     */
    getAllCountries() {
        return this.countries;
    }

    /**
     * Obtiene un país por ID
     */
    getCountryById(id) {
        return this.countries.find(country => country.id === id) || null;
    }

    /**
     * Aplica desarrollo a un país
     */
    applyDevelopment(countryId, development) {
        const country = this.getCountryById(countryId);
        if (!country) return false;

        const totalPoints = Object.values(development).reduce((sum, points) => sum + points, 0);
        if (totalPoints > country.developmentPoints) return false;

        Object.keys(development).forEach(stat => {
            if (country.stats.hasOwnProperty(stat)) {
                country.stats[stat] += development[stat];
            }
        });

        country.developmentPoints -= totalPoints;
        this.checkGoldenAge(country, development);

        return true;
    }

    /**
     * Verifica si se activa la edad dorada
     */
    checkGoldenAge(country, development) {
        if (country.goldenAgeActivated) return;

        // Verificar tiempo mínimo de juego (30 semanas)
        const currentYear = window.worldxGame ? window.worldxGame.currentYear : 0;
        if (currentYear < 30) return;

        const maxPoints = Math.max(...Object.values(development));
        if (maxPoints >= 3) {
            country.goldenAgeActivated = true;
            country.goldenAgeTriggered = true;
            country.developmentPoints += 3;
        }
    }

    /**
     * Añade puntos de desarrollo anuales
     */
    addAnnualDevelopmentPoints(points = 1) {
        this.countries.forEach(country => {
            country.developmentPoints += points;
        });
    }

    /**
     * Actualiza la economía de todos los países (usado por el GameLoop).
     */
    updateEconomy() {
        this.countries.forEach(country => {
            if (country.isActive) {
                this.updateCountryEconomy(country);
            }
        });
    }

    /**
     * Calcula y actualiza las estadísticas económicas base de un país.
     * No modifica el dinero, solo calcula los ingresos y costos.
     */
    calculateEconomyStats(country) {
        if (!country) return;

        // Calcular ingresos por impuestos (basado en población)
        const taxIncome = Math.floor(country.population * country.taxRate);
        country.income = taxIncome;

        // Aplicar bonificaciones militares del Ministerio de Economía
        this.economicMinistry.applyMilitaryBonuses(country);

        // Calcular costos de mantenimiento del ejército con bonificaciones
        const baseMaintenance = 0.5; // Costo base por soldado
        const experienceMultiplier = 1 + (country.armyExperience - 1) * 0.2; // 20% más caro por nivel de experiencia
        const armyMaintenance = Math.floor(country.army * baseMaintenance * experienceMultiplier);
        country.armyMaintenanceCost = armyMaintenance;

        // Aplicar reducción de mantenimiento por bonificaciones económicas
        const adjustedMaintenance = this.economicMinistry.calculateAdjustedMilitaryMaintenance(country);
        country.armyMaintenanceCost = adjustedMaintenance;

        // Este costo es de acción, no recurrente. Se resetea para evitar confusiones.
        country.armyTrainingCost = 0;
    }

    /**
     * Actualiza la economía de un país específico, aplicando ingresos y gastos.
     */
    updateCountryEconomy(country) {
        // Primero, nos aseguramos de que los stats base (ingresos, costos) estén actualizados
        this.calculateEconomyStats(country);

        // Aplicar ingresos y gastos netos (solo si el país está activo)
        if (country.isActive) {
            // Calcular ingresos totales incluyendo bonificaciones del Ministerio de Economía
            const totalIncome = this.economicMinistry.calculateTotalIncome(country);
            const netIncome = totalIncome - country.armyMaintenanceCost;
            
            country.money += netIncome;

            // Asegurar que el dinero no sea negativo
            if (country.money < 0) {
                country.money = 0;
            }
            
            // Actualizar indicadores económicos
            this.economicMinistry.updateEconomicIndicators(country);
            
            // Procesar intereses de inversiones
            this.economicMinistry.processInvestmentInterest(country);
            
            // Procesar eventos financieros activos
            if (window.FinancialEvents && country.economicData) {
                window.FinancialEvents.processTimePassage(country);
            }
        }
    }

    /**
     * Verifica si un país ha ganado
     */
    checkVictory(country) {
        const stats = country.stats;
        return Object.values(stats).some(stat => stat >= 100);
    }

    /**
     * Obtiene el ganador del juego
     */
    getWinner() {
        for (const country of this.countries) {
            if (this.checkVictory(country)) {
                return country;
            }
        }
        return null;
    }

    /**
     * Guarda el estado del juego
     */
    saveGameState() {
        return {
            countries: this.countries,
            playerCountry: this.playerCountry,
            aiCountries: this.aiCountries,
            timestamp: Date.now()
        };
    }

    /**
     * Carga el estado del juego
     */
    loadGameState(gameState) {
        this.countries = gameState.countries || [];
        this.playerCountry = gameState.playerCountry || null;
        this.aiCountries = gameState.aiCountries || [];
    }

    // ============================================================================
    // MÉTODOS DELEGADOS A MÓDULOS ESPECIALIZADOS
    // ============================================================================

    // --- Métodos de Intel (delegados a IntelManager) ---

    /**
     * Obtiene información limitada de otros países para el panel de Intel.
     */
    getOtherCountriesIntel(playerCountryId) {
        return this.intelManager.getOtherCountriesIntel(playerCountryId);
    }

    /**
     * Obtiene los países enemigos completos que pueden ser atacados.
     */
    getAttackableEnemies(playerCountryId) {
        return this.intelManager.getAttackableEnemies(playerCountryId);
    }

    /**
     * Genera información de intel para un país
     */
    generateIntel(country) {
        return this.intelManager.generateIntel(country);
    }

    /**
     * Obtiene la fuerza general de un país
     */
    getOverallStrength(stats) {
        return this.intelManager.getOverallStrength(stats);
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     */
    getStatDisplayName(stat) {
        return this.intelManager.getStatDisplayName(stat);
    }

    // --- Métodos Militares (delegados a MilitaryManager) ---

    /**
     * Obtiene el poder militar de un país con bonificaciones económicas
     */
    getMilitaryPower(country) {
        return this.militaryManager.getMilitaryPower(country);
    }

    /**
     * Obtiene el poder total de un país
     */
    getTotalPower(country) {
        return this.militaryManager.getTotalPower(country);
    }

    /**
     * Obtiene el costo para aumentar el ejército en formato de objeto
     */
    getArmyIncreaseCostObject(country) {
        return this.militaryManager.getArmyIncreaseCostObject(country);
    }

    /**
     * Obtiene el costo para entrenar el ejército en formato de objeto
     */
    getArmyTrainingCostObject(country) {
        return this.militaryManager.getArmyTrainingCostObject(country);
    }

    /**
     * Obtiene el costo para aumentar el ejército
     */
    getArmyIncreaseCost(country) {
        return this.militaryManager.getArmyIncreaseCost(country);
    }

    /**
     * Verifica si se puede aumentar el ejército
     */
    canIncreaseArmy(country) {
        return this.militaryManager.canIncreaseArmy(country);
    }

    /**
     * Aumenta el ejército de un país
     */
    increaseArmy(countryId) {
        return this.militaryManager.increaseArmy(countryId);
    }

    /**
     * Obtiene el costo para entrenar el ejército
     */
    getArmyTrainingCost(country) {
        return this.militaryManager.getArmyTrainingCost(country);
    }

    /**
     * Verifica si se puede entrenar el ejército
     */
    canTrainArmy(country) {
        return this.militaryManager.canTrainArmy(country);
    }

    /**
     * Entrena el ejército de un país
     */
    trainArmy(countryId) {
        return this.militaryManager.trainArmy(countryId);
    }

    /**
     * Obtiene información del ejército para la UI
     */
    getArmyInfo(country) {
        return this.militaryManager.getArmyInfo(country);
    }

    // --- Métodos de Batalla (delegados a BattleManager) ---

    /**
     * Simula una batalla entre dos países.
     */
    simulateBattle(attackerId, defenderId) {
        return this.battleManager.simulateBattle(attackerId, defenderId);
    }

    /**
     * El atacante conquista el territorio del defensor.
     */
    conquerCountry(attackerId, defenderId) {
        return this.battleManager.conquerCountry(attackerId, defenderId);
    }

    /**
     * El atacante arrasa el territorio del defensor para obtener recursos.
     */
    razeCountry(attackerId, defenderId) {
        return this.battleManager.razeCountry(attackerId, defenderId);
    }

    /**
     * Saquea el dinero de un país vencido
     */
    lootCountry(attackerId, defenderId) {
        return this.battleManager.lootCountry(attackerId, defenderId);
    }

    // --- Métodos Económicos (delegados a EconomicMinistry) ---

    /**
     * Obtiene información económica de un país
     */
    getEconomicInfo(country) {
        return {
            money: country.money,
            income: country.income,
            taxRate: country.taxRate,
            armyMaintenanceCost: country.armyMaintenanceCost,
            armyTrainingCost: country.armyTrainingCost,
            netIncome: country.income - country.armyMaintenanceCost
        };
    }

    /**
     * Obtiene información económica avanzada de un país
     */
    getAdvancedEconomicInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;

        const basicInfo = this.getEconomicInfo(country);
        const advancedInfo = this.economicMinistry.getEconomicInfo(country);
        
        return {
            ...basicInfo,
            ...advancedInfo,
            totalIncome: advancedInfo.totalIncome,
            industryBonus: advancedInfo.industryBonus,
            infrastructureBonus: advancedInfo.infrastructureBonus
        };
    }

    /**
     * Construye/mejora una industria
     */
    buildIndustry(countryId, industryType) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.buildIndustry(country, industryType);
    }

    /**
     * Construye infraestructura
     */
    buildInfrastructure(countryId, infrastructureType) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.buildInfrastructure(country, infrastructureType);
    }

    /**
     * Verifica si se puede construir/mejorar una industria
     */
    canBuildIndustry(countryId, industryType) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.canBuildIndustry(country, industryType);
    }

    /**
     * Verifica si se puede construir infraestructura
     */
    canBuildInfrastructure(countryId, infrastructureType) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.canBuildInfrastructure(country, infrastructureType);
    }

    /**
     * Obtiene el costo de una industria
     */
    getIndustryCost(countryId, industryType) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return this.economicMinistry.getIndustryCost(country, industryType);
    }

    /**
     * Obtiene el costo de infraestructura
     */
    getInfrastructureCost(countryId, infrastructureType) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return this.economicMinistry.getInfrastructureCost(country, infrastructureType);
    }

    /**
     * Obtiene las acciones económicas disponibles
     */
    getAvailableEconomicActions(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return [];
        
        return this.economicMinistry.getAvailableActions(country);
    }

    /**
     * Obtiene información de industrias de un país
     */
    getIndustryInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return {
            industries: country.economicData.industries,
            upgradeCounts: country.economicData.upgradeCounts
        };
    }

    /**
     * Obtiene información de infraestructura de un país
     */
    getInfrastructureInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return {
            infrastructure: country.economicData.infrastructure
        };
    }

    /**
     * Obtiene la descripción de una industria
     */
    getIndustryDescription(industryType) {
        return this.economicMinistry.getIndustryDescription(industryType);
    }

    /**
     * Obtiene la descripción de una infraestructura
     */
    getInfrastructureDescription(infrastructureType) {
        return this.economicMinistry.getInfrastructureDescription(infrastructureType);
    }

    /**
     * Invierte en bonos del estado
     */
    investInBonds(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.investInBonds(country);
    }

    /**
     * Invierte en fondo de desarrollo
     */
    investInDevelopmentFund(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.investInDevelopmentFund(country);
    }

    /**
     * Crea reservas de emergencia
     */
    createEmergencyReserves(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.createEmergencyReserves(country);
    }

    /**
     * Verifica si un país puede invertir en bonos
     */
    canInvestInBonds(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.canInvestInBonds(country);
    }

    /**
     * Verifica si un país puede invertir en fondo de desarrollo
     */
    canInvestInDevelopmentFund(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.canInvestInDevelopmentFund(country);
    }

    /**
     * Verifica si un país puede crear reservas de emergencia
     */
    canCreateEmergencyReserves(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return false;
        
        return this.economicMinistry.canCreateEmergencyReserves(country);
    }

    /**
     * Obtiene información sobre inversiones en bonos
     */
    getBondInvestmentInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return this.economicMinistry.getBondInvestmentInfo(country);
    }

    /**
     * Obtiene información sobre inversiones en fondo de desarrollo
     */
    getDevelopmentFundInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return this.economicMinistry.getDevelopmentFundInfo(country);
    }

    /**
     * Obtiene información sobre reservas de emergencia
     */
    getEmergencyReservesInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        return this.economicMinistry.getEmergencyReservesInfo(country);
    }

    /**
     * Obtiene información completa de inversiones
     */
    getInvestmentInfo(countryId) {
        const country = this.getCountryById(countryId);
        if (!country) return null;
        
        const investments = country.economicData.investments;
        const interest = this.economicMinistry.calculateInvestmentInterest(country);
        
        return {
            investments: investments,
            interest: interest,
            totalInterest: Object.values(interest).reduce((sum, val) => sum + val, 0),
            bondInfo: this.getBondInvestmentInfo(countryId),
            developmentFundInfo: this.getDevelopmentFundInfo(countryId),
            emergencyReservesInfo: this.getEmergencyReservesInfo(countryId)
        };
    }
} 