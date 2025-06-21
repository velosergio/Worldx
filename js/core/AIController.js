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
        const strategy = country.aiStrategy;
        const availablePoints = country.developmentPoints;
        
        if (availablePoints <= 0) return;

        // Obtener pesos según la estrategia
        const weights = this.decisionWeights[strategy.name] || this.decisionWeights.conservative;
        
        // Calcular distribución de puntos
        const development = this.calculateDevelopment(weights, availablePoints, country);
        
        // Aplicar desarrollo
        if (this.countryManager) {
            this.countryManager.applyDevelopment(country.id, development);
        }
        
        console.log(`IA ${country.name} (${strategy.name}): ${JSON.stringify(development)}`);
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