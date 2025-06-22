/**
 * Gestor militar para Worldx
 * Maneja todo lo relacionado con ejércitos, reclutamiento y entrenamiento
 */
class MilitaryManager {
    constructor(countryManager) {
        this.countryManager = countryManager;
    }

    /**
     * Obtiene el poder militar de un país con bonificaciones económicas
     */
    getMilitaryPower(country) {
        if (!country) return 0;

        // Base power from military stat
        let power = country.stats.military;

        // Bonus por tamaño del ejército (0.1 por cada soldado)
        power += country.army * 0.1;

        return power;
    }

    /**
     * Obtiene el poder total de un país
     */
    getTotalPower(country) {
        const militaryPower = this.getMilitaryPower(country);
        const statsPower = this.getOverallStrength(country.stats);
        return militaryPower + statsPower;
    }

    /**
     * Obtiene la fuerza general de un país
     */
    getOverallStrength(stats) {
        return Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    }

    /**
     * Obtiene el costo para aumentar el ejército en formato de objeto
     */
    getArmyIncreaseCostObject(country) {
        const costMultiplier = Math.pow(1.2, country.increaseArmyCount); // 20% más caro por cada vez
        return {
            money: Math.floor(100 * costMultiplier),
            stats: {
                social: 1, // Se mantiene simple para la UI
                economy: 1
            }
        };
    }

    /**
     * Obtiene el costo para entrenar el ejército en formato de objeto
     */
    getArmyTrainingCostObject(country) {
        const costMultiplier = Math.pow(1.3, country.trainArmyCount); // 30% más caro por cada vez
        return {
            money: Math.floor(200 * costMultiplier),
            stats: {
                military: 1 // Se mantiene simple para la UI
            }
        };
    }

    /**
     * Obtiene el costo para aumentar el ejército
     */
    getArmyIncreaseCost(country) {
        const baseCost = 10;
        const currentArmy = country.army;
        const maxArmy = country.maxArmySize || Math.floor(country.population * 0.4);
        
        // Costo exponencial por cada aumento
        const increaseCount = Math.floor(currentArmy / (country.population * 0.1));
        const costMultiplier = Math.pow(1.5, increaseCount);
        
        // Aplicar bonificación de reclutamiento
        const recruitmentBonus = 1 - (country.recruitmentBonus || 0);
        const finalCost = Math.floor(baseCost * costMultiplier * recruitmentBonus);
        
        return Math.max(5, finalCost); // Mínimo 5 puntos
    }

    /**
     * Verifica si se puede aumentar el ejército
     */
    canIncreaseArmy(country) {
        const cost = this.getArmyIncreaseCostObject(country);
        const maxArmy = country.maxArmySize || Math.floor(country.population * 0.4);
        
        const canAfford = country.money >= cost.money &&
                          country.stats.social >= cost.stats.social &&
                          country.stats.economy >= cost.stats.economy;

        return canAfford && country.army < maxArmy;
    }

    /**
     * Aumenta el ejército de un país
     */
    increaseArmy(countryId) {
        const country = this.countryManager.getCountryById(countryId);
        if (!country) return false;

        if (!this.canIncreaseArmy(country)) return false;

        const cost = this.getArmyIncreaseCostObject(country);
        
        // Deducir costos
        country.money -= cost.money;
        country.stats.social -= cost.stats.social;
        country.stats.economy -= cost.stats.economy;
        
        // Incrementar el contador para la próxima vez
        country.increaseArmyCount++;
        
        // Calcular aumento con bonificaciones
        const baseIncrease = Math.floor(country.population * 0.1);
        const sizeBonus = 1 + (country.recruitmentBonus || 0);
        const actualIncrease = Math.floor(baseIncrease * sizeBonus);
        
        country.army += actualIncrease;
        
        // Asegurar que no exceda el máximo
        const maxArmy = country.maxArmySize || Math.floor(country.population * 0.4);
        if (country.army > maxArmy) {
            country.army = maxArmy;
        }

        return true;
    }

    /**
     * Obtiene el costo para entrenar el ejército
     */
    getArmyTrainingCost(country) {
        const baseCost = 10;
        const currentExperience = country.armyExperience;
        
        // Costo exponencial por nivel de experiencia
        const costMultiplier = Math.pow(1.3, currentExperience - 1);
        
        // Aplicar bonificación de experiencia
        const experienceBonus = 1 - (country.armyExperienceBonus || 0);
        const finalCost = Math.floor(baseCost * costMultiplier * experienceBonus);
        
        return Math.max(5, finalCost); // Mínimo 5 puntos
    }

    /**
     * Verifica si se puede entrenar el ejército
     */
    canTrainArmy(country) {
        const cost = this.getArmyTrainingCostObject(country);
        const canAfford = country.money >= cost.money &&
                          country.stats.military >= cost.stats.military;
        
        return canAfford && country.armyExperience < 10;
    }

    /**
     * Entrena el ejército de un país
     */
    trainArmy(countryId) {
        const country = this.countryManager.getCountryById(countryId);
        if (!country) return false;

        if (!this.canTrainArmy(country)) return false;

        const cost = this.getArmyTrainingCostObject(country);

        // Deducir costos
        country.money -= cost.money;
        country.stats.military -= cost.stats.military;
        
        // Incrementar el contador para la próxima vez
        country.trainArmyCount++;
        
        // Calcular mejora de experiencia con bonificaciones
        const baseExperienceGain = 1;
        const experienceBonus = 1 + (country.armyExperienceBonus || 0);
        const actualExperienceGain = Math.floor(baseExperienceGain * experienceBonus);
        
        country.armyExperience += actualExperienceGain;
        
        // Asegurar que no exceda el máximo
        if (country.armyExperience > 10) {
            country.armyExperience = 10;
        }

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
        const trainCost = this.getArmyTrainingCost(country);
        
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
            trainCost: trainCost
        };
    }
} 