/**
 * Controlador de IA para Worldx
 */
class AIController {
    constructor() {
        this.countryManager = null;
        this.decisionWeights = {
            aggressive: { military: 0.35, economy: 0.3, science: 0.2, social: 0.1, culture: 0.05 },
            conservative: { social: 0.35, economy: 0.3, science: 0.2, culture: 0.1, military: 0.05 },
            scientific: { science: 0.35, economy: 0.3, culture: 0.15, social: 0.15, military: 0.05 },
            cultural: { culture: 0.35, social: 0.25, economy: 0.2, science: 0.15, military: 0.05 },
            mercantile: { economy: 0.35, science: 0.25, social: 0.2, culture: 0.1, military: 0.1 }
        };
    }

    /**
     * Establece el gestor de países
     */
    setCountryManager(countryManager) {
        this.countryManager = countryManager;
    }

    /**
     * Toma decisiones para todos los países de IA
     */
    makeDecisions(aiCountries) {
        aiCountries.forEach(country => {
            this.makeDecision(country);
        });
    }

    /**
     * Toma una decisión para un país específico
     */
    makeDecision(country) {
        // 1. Decisión de Desarrollo (asignar puntos)
        this.makeDevelopmentDecision(country);

        // 2. Decisión Militar (gastar recursos y estadísticas)
        this.makeMilitaryDecision(country);
    }

    /**
     * Toma decisiones sobre cómo asignar los puntos de desarrollo.
     */
    makeDevelopmentDecision(country) {
        const availablePoints = country.developmentPoints;
        if (availablePoints <= 0) return;

        // Obtener pesos según la estrategia
        const weights = this.decisionWeights[country.aiStrategy.name] || this.decisionWeights.conservative;
        
        // Calcular distribución de puntos
        const development = this.calculateDevelopment(weights, availablePoints, country);
        
        // Aplicar desarrollo
        if (this.countryManager) {
            this.countryManager.applyDevelopment(country.id, development);
            console.log(`IA ${country.name} (${country.aiStrategy.name}) invierte en desarrollo: ${JSON.stringify(development)}`);
        }
    }

    /**
     * Toma decisiones militares como entrenar, aumentar ejército o atacar.
     */
    makeMilitaryDecision(country) {
        if (!this.countryManager) return;

        // Decisión de entrenar (prioridad alta para usar puntos militares)
        if (this.shouldTrainArmy(country)) {
            this.countryManager.trainArmy(country.id);
            console.log(`IA ${country.name} ha entrenado a su ejército.`);
        }

        // Decisión de aumentar el ejército
        if (this.shouldIncreaseArmy(country)) {
            this.countryManager.increaseArmy(country.id);
            console.log(`IA ${country.name} ha aumentado su ejército.`);
        }

        // Decisión de atacar
        const target = this.shouldAttack(country);
        if (target) {
            console.log(`IA ${country.name} está atacando a ${target.name}!`);
            const battleReport = this.countryManager.simulateBattle(country.id, target.id);
            this.handleBattleAftermath(country, target, battleReport);
        }
    }

    /**
     * Lógica para que la IA decida qué hacer después de una batalla que ha ganado.
     */
    handleBattleAftermath(attacker, defender, report) {
        if (report.result === 'Victoria') {
            console.log(`IA ${attacker.name} ha derrotado a ${defender.name}.`);
            
            // Lógica de decisión post-victoria de la IA
            const decision = this.decidePostBattleAction(attacker, defender);

            switch(decision) {
                case 'conquer':
                    this.countryManager.conquerCountry(attacker.id, defender.id);
                    console.log(`IA ${attacker.name} ha conquistado a ${defender.name}.`);
                    if (defender.isPlayer) {
                        window.worldxGame.endGame(attacker, `${attacker.name} ha conquistado tu nación.`);
                    }
                    break;
                case 'raze':
                    this.countryManager.razeCountry(attacker.id, defender.id);
                    console.log(`IA ${attacker.name} ha arrasado a ${defender.name}.`);
                    if (defender.isPlayer) {
                        window.worldxGame.showNotification(`${attacker.name} ha arrasado tus tierras.`);
                    }
                    break;
                case 'nothing':
                default:
                    console.log(`IA ${attacker.name} se retira tras la batalla contra ${defender.name}.`);
                    break;
            }
        }
    }

    /**
     * Toma la decisión de qué hacer después de una victoria.
     * @returns {'conquer'|'raze'|'nothing'}
     */
    decidePostBattleAction(attacker, defender) {
        const canConquer = defender.army <= 0;

        if (canConquer) {
            // Si puede conquistar, hay una alta probabilidad de que lo haga
            if (RandomUtils.random(0, 1) < 0.7) return 'conquer'; // 70% de probabilidad
        }

        // Si no puede conquistar o falló el 70%, arrasará
        return 'raze';
    }

    /**
     * Decide si la IA debe entrenar a su ejército.
     */
    shouldTrainArmy(country) {
        // Entrenar si tiene más de 15 puntos militares y no está al máximo nivel
        return this.countryManager.canTrainArmy(country) && country.stats.military > 15;
    }

    /**
     * Decide si la IA debe aumentar su ejército.
     */
    shouldIncreaseArmy(country) {
        const armyInfo = this.countryManager.getArmyInfo(country);
        const cost = armyInfo.increaseCost;

        // Aumentar si tiene menos del 50% del ejército máximo y puede costearlo
        if (armyInfo.percentage < 50 && country.stats.social > cost.social + 5 && country.stats.economy > cost.economy + 5) {
             return this.countryManager.canIncreaseArmy(country);
        }
        return false;
    }

    /**
     * Decide si la IA debe atacar y a quién.
     * @returns {object|null} - El país objetivo o null.
     */
    shouldAttack(country) {
        const myPower = this.countryManager.getMilitaryPower(country);
        if (myPower < 20) return null; // No atacar si es muy débil

        const potentialTargets = this.countryManager.getAllCountries().filter(c => c.id !== country.id && c.isActive);

        let bestTarget = null;
        let highestPowerRatio = 1.0;

        for (const target of potentialTargets) {
            const targetPower = this.countryManager.getMilitaryPower(target);
            const powerRatio = myPower / (targetPower + 1);

            // La IA agresiva necesita menos ventaja para atacar
            const requiredRatio = country.aiStrategy.name === 'aggressive' ? 1.2 : 1.5;

            if (powerRatio > requiredRatio && powerRatio > highestPowerRatio) {
                highestPowerRatio = powerRatio;
                bestTarget = target;
            }
        }
        
        // Para evitar ataques constantes, añadir una probabilidad
        if (bestTarget && RandomUtils.random(0, 1) < 0.25) { // 25% de probabilidad de atacar por turno si hay un buen objetivo
            return bestTarget;
        }

        return null;
    }

    /**
     * Calcula la distribución de desarrollo basada en pesos
     */
    calculateDevelopment(weights, availablePoints, country) {
        const development = {
            military: 0,
            social: 0,
            culture: 0,
            science: 0,
            economy: 0
        };

        let remainingPoints = availablePoints;
        const stats = Object.keys(weights);
        
        // Ordenar por peso descendente
        stats.sort((a, b) => weights[b] - weights[a]);

        // Distribuir puntos según pesos
        for (const stat of stats) {
            if (remainingPoints <= 0) break;
            
            const maxPoints = Math.floor(weights[stat] * availablePoints);
            const pointsToAdd = Math.min(remainingPoints, maxPoints, RandomUtils.random(1, 2));
            
            if (pointsToAdd > 0) {
                development[stat] = pointsToAdd;
                remainingPoints -= pointsToAdd;
            }
        }

        // Si quedan puntos, distribuirlos aleatoriamente
        while (remainingPoints > 0) {
            const randomStat = RandomUtils.randomChoice(stats);
            development[randomStat]++;
            remainingPoints--;
        }

        return development;
    }

    /**
     * Adapta la estrategia basada en eventos
     */
    adaptStrategy(country, events) {
        const strategy = country.aiStrategy;
        
        // Si hay crisis, priorizar estabilidad
        const hasCrisis = events.some(event => event.type === 'crisis');
        if (hasCrisis) {
            strategy.priorities = ['social', 'economy', 'military', 'science', 'culture'];
        }
        
        // Si hay competencia militar, responder
        const hasMilitaryThreat = this.detectMilitaryThreat(country);
        if (hasMilitaryThreat) {
            strategy.priorities = ['military', 'economy', 'science', 'social', 'culture'];
        }
    }

    /**
     * Detecta amenazas militares
     */
    detectMilitaryThreat(country) {
        if (!this.countryManager) return false;
        
        const otherCountries = this.countryManager.getAllCountries()
            .filter(c => c.id !== country.id);
        
        // Verificar si algún país tiene mucho más poder militar
        const myMilitary = country.stats.military;
        const maxEnemyMilitary = Math.max(...otherCountries.map(c => c.stats.military));
        
        return maxEnemyMilitary > myMilitary + 2;
    }

    /**
     * Evalúa la situación del país
     */
    evaluateSituation(country) {
        const stats = country.stats;
        const totalStrength = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
        const averageStat = totalStrength / 5;
        
        return {
            totalStrength,
            averageStat,
            weakestStat: Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b),
            strongestStat: Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b),
            isBalanced: Math.max(...Object.values(stats)) - Math.min(...Object.values(stats)) <= 2
        };
    }

    /**
     * Toma decisiones reactivas basadas en la situación
     */
    makeReactiveDecision(country) {
        const situation = this.evaluateSituation(country);
        
        // Si está muy desbalanceado, equilibrar
        if (!situation.isBalanced) {
            return { [situation.weakestStat]: 2 };
        }
        
        // Si está bien balanceado, seguir estrategia
        return this.makeDecision(country);
    }
} 