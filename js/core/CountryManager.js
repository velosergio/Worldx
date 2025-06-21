/**
 * Gestor de países para Worldx
 */
class CountryManager {
    constructor() {
        this.countries = [];
        this.playerCountry = null;
        this.aiCountries = [];
        this.countryGenerator = new CountryGenerator();
    }

    /**
     * Inicializa los países del juego
     */
    initializeCountries(playerCountryName = null) {
        this.countries = [];
        
        // Generar país del jugador
        this.playerCountry = this.countryGenerator.generateCountry(true, playerCountryName);
        this.countries.push(this.playerCountry);
        
        // Generar países de IA
        this.aiCountries = [];
        for (let i = 0; i < 2; i++) {
            const aiCountry = this.countryGenerator.generateCountry(false);
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
     * Obtiene información limitada de otros países para el panel de Intel.
     */
    getOtherCountriesIntel(playerCountryId) {
        return this.countries
            .filter(country => country.id !== playerCountryId && country.isActive)
            .map(country => this.generateIntel(country));
    }

    /**
     * Obtiene los países enemigos completos que pueden ser atacados.
     */
    getAttackableEnemies(playerCountryId) {
        return this.countries.filter(country => country.id !== playerCountryId && country.isActive);
    }

    /**
     * Genera información de intel para un país
     */
    generateIntel(country) {
        const stats = country.stats;
        const highestStat = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
        const lowestStat = Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b);

        const rumors = [
            `${country.name} parece estar enfocado en el desarrollo ${this.getStatDisplayName(highestStat)}.`,
            `Se rumorea que ${country.name} ha descuidado su ${this.getStatDisplayName(lowestStat)}.`,
            `${country.name} mantiene un perfil bajo, pero se dice que está prosperando.`,
            `Los espías reportan que ${country.name} está invirtiendo fuertemente en ${this.getStatDisplayName(highestStat)}.`,
            `${country.name} parece estar en una posición ${this.getOverallStrength(stats) > 5 ? 'fuerte' : 'débil'}.`
        ];

        return {
            id: country.id,
            name: country.name,
            rumor: RandomUtils.randomChoice(rumors),
            strength: this.getOverallStrength(stats),
            highestStat: highestStat,
            lowestStat: lowestStat
        };
    }

    /**
     * Obtiene la fuerza general de un país
     */
    getOverallStrength(stats) {
        return Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     */
    getStatDisplayName(stat) {
        const names = {
            'military': 'militar',
            'social': 'social',
            'culture': 'cultural',
            'science': 'científico',
            'economy': 'económico'
        };
        
        return names[stat] || stat;
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

    // --- Sistema del Ministerio de Guerra ---

    /**
     * Obtiene el poder militar de un país
     */
    getMilitaryPower(country) {
        if (!country) return 0;
        
        // Poder base = estadística militar * multiplicador de experiencia
        const basePower = country.stats.military * country.armyExperience;
        
        // Bonus por tamaño del ejército (hasta 50% del poder base)
        const armyBonus = (country.army / country.population) * 0.5 * basePower;
        
        return Math.floor(basePower + armyBonus);
    }

    /**
     * Obtiene el poder total de un país
     */
    getTotalPower(country) {
        if (!country) return 0;
        
        const stats = country.stats;
        const militaryPower = this.getMilitaryPower(country);
        
        // Poder total = suma de todas las estadísticas + poder militar
        return Object.values(stats).reduce((sum, stat) => sum + stat, 0) + militaryPower;
    }

    /**
     * Verifica si se puede aumentar el ejército
     */
    canIncreaseArmy(country) {
        if (!country) return false;
        
        const maxArmy = Math.floor(country.population * 0.4); // Máximo 40% de población
        const currentArmy = country.army;
        const increaseAmount = Math.floor(country.population * 0.1); // 10% de población
        
        return (currentArmy + increaseAmount) <= maxArmy;
    }

    /**
     * Obtiene el costo para aumentar el ejército
     */
    getArmyIncreaseCost(country) {
        if (!country) return { social: 0, economy: 0 };
        
        const baseCost = 1;
        const upgradeMultiplier = country.armyUpgrades + 1;
        
        return {
            social: baseCost * upgradeMultiplier,
            economy: baseCost * upgradeMultiplier
        };
    }

    /**
     * Aumenta el ejército de un país
     */
    increaseArmy(countryId) {
        const country = this.getCountryById(countryId);
        if (!country || !this.canIncreaseArmy(country)) return false;
        
        const cost = this.getArmyIncreaseCost(country);
        
        // Verificar que tenga suficientes puntos
        if (country.stats.social < cost.social || country.stats.economy < cost.economy) {
            return false;
        }
        
        // Aplicar costos
        country.stats.social -= cost.social;
        country.stats.economy -= cost.economy;
        
        // Aumentar ejército
        const increaseAmount = Math.floor(country.population * 0.1);
        country.army += increaseAmount;
        country.armyUpgrades++;
        
        return true;
    }

    /**
     * Verifica si se puede entrenar el ejército
     */
    canTrainArmy(country) {
        if (!country) return false;
        
        const cost = 10; // Costo fijo de 10 puntos de poder militar
        return country.stats.military >= cost && country.armyExperience < 10;
    }

    /**
     * Entrena el ejército de un país
     */
    trainArmy(countryId) {
        const country = this.getCountryById(countryId);
        if (!country || !this.canTrainArmy(country)) return false;
        
        const cost = 10;
        
        // Aplicar costo
        country.stats.military -= cost;
        
        // Aumentar experiencia
        country.armyExperience = Math.min(10, country.armyExperience + 1);
        
        return true;
    }

    /**
     * Obtiene información del ejército para la UI
     */
    getArmyInfo(country) {
        if (!country) return null;
        
        const maxArmy = Math.floor(country.population * 0.4);
        const militaryPower = this.getMilitaryPower(country);
        const totalPower = this.getTotalPower(country);
        const canIncrease = this.canIncreaseArmy(country);
        const canTrain = this.canTrainArmy(country);
        const increaseCost = this.getArmyIncreaseCost(country);
        
        return {
            current: country.army,
            max: maxArmy,
            percentage: Math.round((country.army / maxArmy) * 100),
            experience: country.armyExperience,
            militaryPower: militaryPower,
            totalPower: totalPower,
            canIncrease: canIncrease,
            canTrain: canTrain,
            increaseCost: increaseCost,
            trainCost: 10
        };
    }

    // --- Sistema de Batalla ---

    /**
     * Simula una batalla entre dos países.
     * @param {string} attackerId - ID del país atacante.
     * @param {string} defenderId - ID del país defensor.
     * @returns {Object} - Objeto con los resultados de la batalla.
     */
    simulateBattle(attackerId, defenderId) {
        const attacker = this.getCountryById(attackerId);
        const defender = this.getCountryById(defenderId);

        if (!attacker || !defender) {
            return { result: 'error', message: 'País no encontrado.' };
        }

        // 1. Calcular Fuerza de Combate (Poder Militar + Factor Aleatorio)
        const attackerPower = this.getMilitaryPower(attacker);
        const defenderPower = this.getMilitaryPower(defender);

        const attackerCombatStrength = attackerPower * RandomUtils.random(0.8, 1.2); // +/- 20% de suerte
        const defenderCombatStrength = defenderPower * RandomUtils.random(0.8, 1.2);

        // 2. Determinar Resultado
        let result;
        let powerRatio = attackerCombatStrength / (defenderCombatStrength + 1); // Evitar división por cero

        if (powerRatio > 1.2) result = 'Victoria';
        else if (powerRatio < 0.8) result = 'Derrota';
        else result = 'Empate';

        // 3. Calcular Bajas
        let attackerCasualtyRate, defenderCasualtyRate;

        switch (result) {
            case 'Victoria':
                attackerCasualtyRate = RandomUtils.random(0.1, 0.25); // 10-25% de bajas para el ganador
                defenderCasualtyRate = RandomUtils.random(0.4, 0.7);  // 40-70% de bajas para el perdedor
                break;
            case 'Derrota':
                attackerCasualtyRate = RandomUtils.random(0.4, 0.7);
                defenderCasualtyRate = RandomUtils.random(0.1, 0.25);
                break;
            case 'Empate':
            default:
                attackerCasualtyRate = RandomUtils.random(0.25, 0.4); // Bajas altas para ambos
                defenderCasualtyRate = RandomUtils.random(0.25, 0.4);
                break;
        }

        const attackerCasualties = Math.min(attacker.army, Math.floor(attacker.army * attackerCasualtyRate));
        const defenderCasualties = Math.min(defender.army, Math.floor(defender.army * defenderCasualtyRate));

        // 4. Aplicar Bajas (al ejército y a la población)
        attacker.army -= attackerCasualties;
        attacker.population -= attackerCasualties;

        defender.army -= defenderCasualties;
        defender.population -= defenderCasualties;

        // Asegurarse que la población no sea negativa
        if (attacker.population <= 0) {
            attacker.population = 0;
            // Lógica de fin de juego para el jugador se manejará en WorldxGame
        }
        if (defender.population <= 0) {
            defender.population = 0;
        }

        // 5. Devolver Reporte
        return {
            result,
            attacker: {
                id: attackerId,
                name: attacker.name,
                casualties: attackerCasualties,
            },
            defender: {
                id: defenderId,
                name: defender.name,
                casualties: defenderCasualties,
            },
        };
    }

    /**
     * El atacante conquista el territorio del defensor.
     * @param {string} attackerId 
     * @param {string} defenderId 
     */
    conquerCountry(attackerId, defenderId) {
        const attacker = this.getCountryById(attackerId);
        const defender = this.getCountryById(defenderId);

        if (!attacker || !defender) return;

        // 1. Transferir toda la población restante
        attacker.population += defender.population;
        defender.population = 0;

        // 2. Transferir 10% de cada estadística de desarrollo
        for (const stat in defender.stats) {
            const transferAmount = Math.floor(defender.stats[stat] * 0.10);
            attacker.stats[stat] += transferAmount;
            defender.stats[stat] -= transferAmount;
        }

        // 3. Desactivar al defensor
        defender.isActive = false;
        this.aiCountries = this.aiCountries.filter(c => c.id !== defenderId);
    }

    /**
     * El atacante arrasa el territorio del defensor para obtener recursos.
     * @param {string} attackerId 
     * @param {string} defenderId 
     */
    razeCountry(attackerId, defenderId) {
        const attacker = this.getCountryById(attackerId);
        const defender = this.getCountryById(defenderId);

        if (!attacker || !defender) return;

        // 1. Transferir 25% de los puntos de desarrollo
        for (const stat in defender.stats) {
            const transferAmount = Math.floor(defender.stats[stat] * 0.25);
            attacker.stats[stat] += transferAmount;
            defender.stats[stat] -= transferAmount;
        }
    }
} 