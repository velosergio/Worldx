/**
 * Gestor de batallas para Worldx
 * Maneja todo lo relacionado con batallas, conquistas y saqueos
 */
class BattleManager {
    constructor(countryManager) {
        this.countryManager = countryManager;
    }

    /**
     * Simula una batalla entre dos países.
     * @param {string} attackerId - ID del país atacante.
     * @param {string} defenderId - ID del país defensor.
     * @returns {Object} - Objeto con los resultados de la batalla.
     */
    simulateBattle(attackerId, defenderId) {
        const attacker = this.countryManager.getCountryById(attackerId);
        const defender = this.countryManager.getCountryById(defenderId);

        if (!attacker || !defender) {
            return { result: 'error', message: 'País no encontrado.' };
        }

        // 1. Calcular Fuerza de Combate (Poder Militar + Factor Aleatorio)
        const attackerPower = this.countryManager.militaryManager.getMilitaryPower(attacker);
        const defenderPower = this.countryManager.militaryManager.getMilitaryPower(defender);

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
                combatStrength: Math.floor(attackerCombatStrength),
                casualties: attackerCasualties,
            },
            defender: {
                id: defenderId,
                name: defender.name,
                combatStrength: Math.floor(defenderCombatStrength),
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
        const attacker = this.countryManager.getCountryById(attackerId);
        const defender = this.countryManager.getCountryById(defenderId);

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
        this.countryManager.aiCountries = this.countryManager.aiCountries.filter(c => c.id !== defenderId);
    }

    /**
     * El atacante arrasa el territorio del defensor para obtener recursos.
     * @param {string} attackerId 
     * @param {string} defenderId 
     */
    razeCountry(attackerId, defenderId) {
        const attacker = this.countryManager.getCountryById(attackerId);
        const defender = this.countryManager.getCountryById(defenderId);

        if (!attacker || !defender) return;

        // 1. Transferir 25% de los puntos de desarrollo
        for (const stat in defender.stats) {
            const transferAmount = Math.floor(defender.stats[stat] * 0.25);
            attacker.stats[stat] += transferAmount;
            defender.stats[stat] -= transferAmount;
        }
    }

    /**
     * Saquea el dinero de un país vencido
     */
    lootCountry(attackerId, defenderId) {
        const attacker = this.countryManager.getCountryById(attackerId);
        const defender = this.countryManager.getCountryById(defenderId);
        
        if (!attacker || !defender || !defender.isActive) return 0;

        const lootAmount = Math.floor(defender.money * 0.75); // 75% del dinero
        attacker.money += lootAmount;
        defender.money = Math.floor(defender.money * 0.25); // Dejar 25%

        return lootAmount;
    }
} 