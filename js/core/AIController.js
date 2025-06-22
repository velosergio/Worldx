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
        
        // Estrategias económicas específicas
        this.economicStrategies = {
            aggressive: {
                name: 'Militar-Económica',
                priorities: ['military', 'bonds', 'developmentFund'],
                riskTolerance: 'high',
                investmentFocus: 'short-term'
            },
            conservative: {
                name: 'Estabilidad',
                priorities: ['emergencyReserves', 'bonds', 'social'],
                riskTolerance: 'low',
                investmentFocus: 'long-term'
            },
            scientific: {
                name: 'Innovación',
                priorities: ['developmentFund', 'science', 'advanced'],
                riskTolerance: 'medium',
                investmentFocus: 'research'
            },
            cultural: {
                name: 'Cultural',
                priorities: ['cultural', 'social', 'universities'],
                riskTolerance: 'medium',
                investmentFocus: 'balanced'
            },
            mercantile: {
                name: 'Comercial',
                priorities: ['economy', 'ports', 'banks'],
                riskTolerance: 'medium',
                investmentFocus: 'trade'
            }
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
        // 1. Análisis de situación actual
        const situation = this.analyzeEconomicSituation(country);
        
        // 2. Adaptación de estrategia según eventos
        this.adaptEconomicStrategy(country, situation);
        
        // 3. Decisión de Desarrollo (asignar puntos)
        this.makeDevelopmentDecision(country);

        // 4. Decisión Militar (gastar recursos y estadísticas)
        this.makeMilitaryDecision(country);

        // 5. Decisión Económica Inteligente (construir y mejorar)
        this.makeIntelligentEconomicDecision(country, situation);
    }

    /**
     * Analiza la situación económica actual del país
     */
    analyzeEconomicSituation(country) {
        const situation = {
            money: country.money,
            income: country.income,
            stability: country.economicData?.indicators?.stability || 1,
            efficiency: country.economicData?.indicators?.efficiency || 1,
            hasFinancialEvent: !!country.economicData?.activeFinancialEvent,
            financialEventType: country.economicData?.activeFinancialEvent?.eventId,
            investmentMultipliers: country.economicData?.investmentMultipliers,
            militaryThreat: this.detectMilitaryThreat(country),
            economicHealth: this.calculateEconomicHealth(country),
            investmentOpportunities: this.identifyInvestmentOpportunities(country)
        };
        
        return situation;
    }

    /**
     * Calcula la salud económica del país
     */
    calculateEconomicHealth(country) {
        let health = 0;
        
        // Base en ingresos vs gastos
        const netIncome = country.income - (country.armyMaintenanceCost || 0);
        health += (netIncome / Math.max(1, country.income)) * 50;
        
        // Estabilidad económica
        health += (country.economicData?.indicators?.stability || 1) * 25;
        
        // Eficiencia económica
        health += (country.economicData?.indicators?.efficiency || 1) * 25;
        
        return Math.min(100, Math.max(0, health));
    }

    /**
     * Identifica oportunidades de inversión basadas en eventos financieros
     */
    identifyInvestmentOpportunities(country) {
        const opportunities = [];
        const multipliers = country.economicData?.investmentMultipliers;
        
        if (multipliers) {
            if (multipliers.bonds > 1.2) {
                opportunities.push({
                    type: 'bonds',
                    priority: 'high',
                    reason: 'Multiplicador alto en bonos',
                    multiplier: multipliers.bonds
                });
            }
            
            if (multipliers.developmentFund > 1.3) {
                opportunities.push({
                    type: 'developmentFund',
                    priority: 'high',
                    reason: 'Multiplicador alto en fondos',
                    multiplier: multipliers.developmentFund
                });
            }
            
            if (multipliers.emergencyReserves > 1.1) {
                opportunities.push({
                    type: 'emergencyReserves',
                    priority: 'medium',
                    reason: 'Multiplicador en reservas',
                    multiplier: multipliers.emergencyReserves
                });
            }
        }
        
        return opportunities;
    }

    /**
     * Adapta la estrategia económica según la situación actual
     */
    adaptEconomicStrategy(country, situation) {
        const strategy = this.economicStrategies[country.aiStrategy.name] || this.economicStrategies.conservative;
        
        // Adaptar según eventos financieros
        if (situation.hasFinancialEvent) {
            if (situation.financialEventType?.includes('crisis') || situation.financialEventType?.includes('crash')) {
                // En crisis, priorizar estabilidad
                strategy.priorities = ['emergencyReserves', 'bonds', 'social'];
                strategy.riskTolerance = 'low';
            } else if (situation.financialEventType?.includes('boom') || situation.financialEventType?.includes('rally')) {
                // En boom, aprovechar oportunidades
                strategy.priorities = ['developmentFund', 'bonds', 'economy'];
                strategy.riskTolerance = 'high';
            }
        }
        
        // Adaptar según amenaza militar
        if (situation.militaryThreat > 0.7) {
            strategy.priorities = ['military', 'bonds', 'emergencyReserves'];
            strategy.riskTolerance = 'low';
        }
        
        // Adaptar según salud económica
        if (situation.economicHealth < 30) {
            strategy.priorities = ['emergencyReserves', 'social', 'economy'];
            strategy.riskTolerance = 'low';
        } else if (situation.economicHealth > 70) {
            strategy.priorities = ['developmentFund', 'science', 'culture'];
            strategy.riskTolerance = 'medium';
        }
        
        return strategy;
    }

    /**
     * Toma decisiones económicas inteligentes basadas en análisis
     */
    makeIntelligentEconomicDecision(country, situation) {
        if (!this.countryManager || !country.economicData) return;

        const strategy = this.adaptEconomicStrategy(country, situation);
        const availableOptions = this.getAvailableEconomicOptions(country);
        
        if (availableOptions.length === 0) return;

        // Filtrar opciones según estrategia y situación
        const filteredOptions = this.filterOptionsByStrategy(availableOptions, strategy, situation);
        
        // Elegir la mejor opción
        const bestOption = this.chooseIntelligentEconomicOption(country, filteredOptions, strategy, situation);

        if (bestOption) {
            this.executeEconomicAction(country, bestOption);
            console.log(`IA ${country.name} (${strategy.name}) ha tomado decisión económica: ${bestOption.type} - ${bestOption.item}`);
        }
    }

    /**
     * Obtiene todas las opciones económicas disponibles
     */
    getAvailableEconomicOptions(country) {
        const availableOptions = [];

        // Opciones de industria
        for (const type in country.economicData.industries) {
            if (this.countryManager.canBuildIndustry(country.id, type)) {
                const cost = this.countryManager.getIndustryCost(country.id, type);
                const benefit = this.calculateIndustryBenefit(country, type);
                availableOptions.push({ 
                    type: 'industry', 
                    item: type, 
                    cost, 
                    benefit,
                    priority: this.getIndustryPriority(type, country.aiStrategy.name)
                });
            }
        }

        // Opciones de infraestructura
        for (const type in country.economicData.infrastructure) {
            if (this.countryManager.canBuildInfrastructure(country.id, type)) {
                const cost = this.countryManager.getInfrastructureCost(country.id, type);
                const benefit = this.calculateInfrastructureBenefit(country, type);
                availableOptions.push({ 
                    type: 'infrastructure', 
                    item: type, 
                    cost, 
                    benefit,
                    priority: this.getInfrastructurePriority(type, country.aiStrategy.name)
                });
            }
        }

        // Opciones de inversión
        if (this.countryManager.canInvestInBonds(country.id)) {
            const info = this.countryManager.getBondInvestmentInfo(country.id);
            availableOptions.push({ 
                type: 'investment', 
                item: 'bonds', 
                cost: { money: info.cost }, 
                benefit: info,
                priority: this.getInvestmentPriority('bonds', country.aiStrategy.name)
            });
        }

        if (this.countryManager.canInvestInDevelopmentFund(country.id)) {
            const info = this.countryManager.getDevelopmentFundInfo(country.id);
            availableOptions.push({ 
                type: 'investment', 
                item: 'developmentFund', 
                cost: { money: info.cost }, 
                benefit: info,
                priority: this.getInvestmentPriority('developmentFund', country.aiStrategy.name)
            });
        }

        if (this.countryManager.canCreateEmergencyReserves(country.id)) {
            const info = this.countryManager.getEmergencyReservesInfo(country.id);
            availableOptions.push({ 
                type: 'investment', 
                item: 'emergencyReserves', 
                cost: { money: info.cost }, 
                benefit: info,
                priority: this.getInvestmentPriority('emergencyReserves', country.aiStrategy.name)
            });
        }

        return availableOptions;
    }

    /**
     * Filtra opciones según la estrategia y situación actual
     */
    filterOptionsByStrategy(options, strategy, situation) {
        return options.filter(option => {
            // Priorizar según eventos financieros
            if (situation.investmentOpportunities.length > 0) {
                const opportunity = situation.investmentOpportunities.find(opp => opp.type === option.item);
                if (opportunity && opportunity.priority === 'high') {
                    option.priority += 2; // Bonus alto para oportunidades
                }
            }
            
            // Filtrar por tolerancia al riesgo
            if (strategy.riskTolerance === 'low' && option.cost.money > situation.money * 0.3) {
                return false; // No gastar más del 30% del dinero si es conservador
            }
            
            // Filtrar por salud económica
            if (situation.economicHealth < 40 && option.type === 'investment' && option.item !== 'emergencyReserves') {
                return false; // En crisis, solo reservas de emergencia
            }
            
            return true;
        });
    }

    /**
     * Elige la mejor opción económica de forma inteligente
     */
    chooseIntelligentEconomicOption(country, options, strategy, situation) {
        let bestOption = null;
        let maxScore = -Infinity;

        options.forEach(option => {
            let score = 0;
            
            // Score base por prioridad de estrategia
            score += option.priority * 10;
            
            // Score por ROI
            const roi = this.calculateEconomicROI(option, country);
            score += roi * 5;
            
            // Score por sinergias
            const synergyBonus = this.calculateSynergyBonus(option, country);
            score += synergyBonus * 3;
            
            // Score por situación actual
            const situationBonus = this.calculateSituationBonus(option, situation);
            score += situationBonus * 2;
            
            // Score por eventos financieros
            const eventBonus = this.calculateEventBonus(option, situation);
            score += eventBonus * 4;
            
            if (score > maxScore) {
                maxScore = score;
                bestOption = option;
            }
        });
        
        return bestOption;
    }

    /**
     * Calcula el ROI económico de una opción
     */
    calculateEconomicROI(option, country) {
        const cost = option.cost.money || 0;
        const benefit = option.benefit;
        
        if (cost === 0) return 0;
        
        let totalBenefit = 0;
        
        // Beneficios monetarios directos
        if (benefit.money_flat) totalBenefit += benefit.money_flat;
        if (benefit.income_bonus) totalBenefit += country.income * benefit.income_bonus;
        
        // Beneficios de desarrollo
        if (benefit.development_points_flat) totalBenefit += benefit.development_points_flat * 50; // Valorar puntos de desarrollo
        
        // Beneficios de estabilidad
        if (benefit.stability_bonus) totalBenefit += benefit.stability_bonus * 100;
        
        return totalBenefit / cost;
    }

    /**
     * Calcula bonificaciones por sinergias
     */
    calculateSynergyBonus(option, country) {
        let bonus = 0;
        
        if (option.type === 'infrastructure') {
            const infrastructure = country.economicData.infrastructure;
            const builtCount = Object.values(infrastructure).filter(level => level > 0).length;
            
            // Bonus por sinergias de infraestructura
            if (option.item === 'roads' && infrastructure.ports > 0) bonus += 2;
            if (option.item === 'ports' && infrastructure.roads > 0) bonus += 2;
            if (option.item === 'universities' && infrastructure.hospitals > 0) bonus += 2;
            if (option.item === 'hospitals' && infrastructure.universities > 0) bonus += 2;
            if (option.item === 'banks' && builtCount >= 2) bonus += 1;
            if (builtCount === 4 && option.item !== 'banks') bonus += 3; // Casi sinergia completa
        }
        
        return bonus;
    }

    /**
     * Calcula bonificaciones por situación actual
     */
    calculateSituationBonus(option, situation) {
        let bonus = 0;
        
        // Bonus por estabilidad baja (priorizar estabilidad)
        if (situation.stability < 0.8 && option.benefit.stability_bonus) {
            bonus += 3;
        }
        
        // Bonus por eficiencia baja (priorizar eficiencia)
        if (situation.efficiency < 0.8 && option.benefit.efficiency_bonus) {
            bonus += 2;
        }
        
        // Bonus por amenaza militar (priorizar defensa)
        if (situation.militaryThreat > 0.7 && option.item === 'military') {
            bonus += 4;
        }
        
        return bonus;
    }

    /**
     * Calcula bonificaciones por eventos financieros
     */
    calculateEventBonus(option, situation) {
        let bonus = 0;
        
        if (situation.hasFinancialEvent && situation.investmentOpportunities.length > 0) {
            const opportunity = situation.investmentOpportunities.find(opp => opp.type === option.item);
            if (opportunity) {
                bonus += opportunity.multiplier * 2;
            }
        }
        
        return bonus;
    }

    /**
     * Ejecuta una acción económica
     */
    executeEconomicAction(country, option) {
        switch (option.type) {
            case 'industry':
                this.countryManager.buildIndustry(country.id, option.item);
                break;
            case 'infrastructure':
                this.countryManager.buildInfrastructure(country.id, option.item);
                break;
            case 'investment':
                this.executeInvestment(country, option.item);
                break;
        }
    }

    /**
     * Obtiene la prioridad de una industria según la estrategia
     */
    getIndustryPriority(industryType, strategyName) {
        const priorities = {
            aggressive: { military: 5, basic: 3, advanced: 2, cultural: 1, tech: 2 },
            conservative: { basic: 4, cultural: 3, advanced: 2, military: 1, tech: 2 },
            scientific: { tech: 5, advanced: 4, basic: 2, cultural: 2, military: 1 },
            cultural: { cultural: 5, basic: 3, advanced: 2, tech: 2, military: 1 },
            mercantile: { basic: 4, advanced: 3, tech: 3, cultural: 2, military: 1 }
        };
        
        return priorities[strategyName]?.[industryType] || 1;
    }

    /**
     * Obtiene la prioridad de una infraestructura según la estrategia
     */
    getInfrastructurePriority(infrastructureType, strategyName) {
        const priorities = {
            aggressive: { roads: 3, ports: 4, universities: 2, hospitals: 2, banks: 3 },
            conservative: { hospitals: 5, roads: 3, universities: 3, banks: 4, ports: 2 },
            scientific: { universities: 5, hospitals: 3, roads: 2, banks: 3, ports: 2 },
            cultural: { universities: 4, hospitals: 3, roads: 2, banks: 2, ports: 1 },
            mercantile: { banks: 5, ports: 4, roads: 3, universities: 2, hospitals: 2 }
        };
        
        return priorities[strategyName]?.[infrastructureType] || 1;
    }

    /**
     * Obtiene la prioridad de una inversión según la estrategia
     */
    getInvestmentPriority(investmentType, strategyName) {
        const priorities = {
            aggressive: { bonds: 4, developmentFund: 3, emergencyReserves: 2 },
            conservative: { emergencyReserves: 5, bonds: 4, developmentFund: 2 },
            scientific: { developmentFund: 5, bonds: 3, emergencyReserves: 2 },
            cultural: { developmentFund: 4, bonds: 3, emergencyReserves: 2 },
            mercantile: { bonds: 4, developmentFund: 3, emergencyReserves: 3 }
        };
        
        return priorities[strategyName]?.[investmentType] || 1;
    }

    /**
     * Calcula el beneficio de una industria
     */
    calculateIndustryBenefit(country, industryType) {
        const currentLevel = country.economicData.industries[industryType] || 0;
        const nextLevel = currentLevel + 1;
        
        const baseIncome = country.income;
        const incomeBonus = {
            basic: 0.1,
            advanced: 0.15,
            cultural: 0.12,
            military: 0.08,
            tech: 0.20
        };
        
        return {
            income_bonus: incomeBonus[industryType] || 0,
            money_flat: Math.floor(baseIncome * (incomeBonus[industryType] || 0))
        };
    }

    /**
     * Calcula el beneficio de una infraestructura
     */
    calculateInfrastructureBenefit(country, infrastructureType) {
        const baseIncome = country.income;
        const incomeBonus = {
            roads: 0.10,
            ports: 0.15,
            universities: 0.08,
            hospitals: 0.05,
            banks: 0.12
        };
        
        return {
            income_bonus: incomeBonus[infrastructureType] || 0,
            money_flat: Math.floor(baseIncome * (incomeBonus[infrastructureType] || 0)),
            stability_bonus: infrastructureType === 'banks' ? 0.05 : 0
        };
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
            console.log('--- Reporte de Combate (IA) ---', battleReport);
            this.handleBattleAftermath(country, target, battleReport);
        }
    }

    /**
     * Ejecuta una inversión específica
     */
    executeInvestment(country, investmentType) {
        switch (investmentType) {
            case 'bonds':
                this.countryManager.investInBonds(country.id);
                break;
            case 'developmentFund':
                this.countryManager.investInDevelopmentFund(country.id);
                break;
            case 'emergencyReserves':
                this.countryManager.createEmergencyReserves(country.id);
                break;
        }
    }

    /**
     * Elige la mejor opción económica basada en la estrategia y el ROI.
     */
    chooseBestEconomicOption(country, options) {
        const strategyWeights = this.decisionWeights[country.aiStrategy.name] || this.decisionWeights.conservative;
        let bestOption = null;
        let maxScore = -Infinity;

        options.forEach(option => {
            let score = 0;
            const roi = this.calculateROI(option.cost, option.benefit, country);
            
            // Prioridad base por el ROI
            score += roi * 10; // El ROI es el factor más importante

            // Ajuste por estrategia
            if (option.benefit.stats) {
                for (const stat in option.benefit.stats) {
                    score += (strategyWeights[stat] || 0) * option.benefit.stats[stat] * 5;
                }
            }
            if (option.benefit.modifiers) {
                if (option.benefit.modifiers.income_bonus) {
                    score += (strategyWeights.economy || 0) * option.benefit.modifiers.income_bonus * 100;
                }
            }

            // Considerar el costo (opciones más baratas son ligeramente preferibles si el beneficio es similar)
            score -= (option.cost.money || 0) / 100;

            if (score > maxScore) {
                maxScore = score;
                bestOption = option;
            }
        });

        return bestOption;
    }

    /**
     * Calcula un Retorno de Inversión (ROI) simplificado.
     */
    calculateROI(cost, benefit, country) {
        let totalCost = cost.money || 0;
        // Aproximar costo de estadísticas a dinero
        if (cost.stats) {
            totalCost += Object.values(cost.stats).reduce((a, b) => a + b, 0) * 50; 
        }

        let totalBenefit = 0;
        if (benefit.modifiers) {
            // Beneficio de ingresos a lo largo de 20 turnos
            totalBenefit += (benefit.modifiers.income_bonus || 0) * (country.stats.economy * 10) * 20; 
        }
        if (benefit.stats) {
            // Beneficio de estadísticas directas
            totalBenefit += Object.values(benefit.stats).reduce((a, b) => a + b, 0) * 100;
        }

        return totalCost > 0 ? totalBenefit / totalCost : Infinity;
    }

    /**
     * Lógica para que la IA decida qué hacer después de una batalla que ha ganado.
     */
    handleBattleAftermath(attacker, defender, report) {
        // Si el jugador es el defensor, mostrarle el modal con los resultados de la batalla.
        if (defender.isPlayer) {
            window.worldxGame.uiManager.warMinistry.showBattleResults(report);
        }

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
        const strategy = attacker.aiStrategy.name;

        if (canConquer) {
            // Si la conquista es posible, decidir basado en la estrategia
            switch (strategy) {
                case 'aggressive':
                    return 'conquer'; // Siempre conquistar si es posible
                case 'mercantile':
                    return RandomUtils.random(0, 1) < 0.5 ? 'conquer' : 'pillage'; // 50/50 conquistar o saquear
                default:
                    return RandomUtils.random(0, 1) < 0.3 ? 'conquer' : 'raze'; // Otros tienen baja probabilidad de conquistar
            }
        } else {
            // Si no se puede conquistar, elegir entre arrasar o saquear
            switch (strategy) {
                case 'aggressive':
                    return 'raze'; // Dañar para el próximo ataque
                case 'mercantile':
                    return 'pillage'; // Solo tomar el dinero
                case 'scientific':
                case 'cultural':
                    return 'raze'; // Robar puntos de desarrollo
                default: // conservative
                    return 'pillage';
            }
        }
    }

    /**
     * Decide si la IA debe entrenar a su ejército.
     */
    shouldTrainArmy(country) {
        // Usar el método que devuelve el objeto de costo completo
        const cost = this.countryManager.getArmyTrainingCostObject(country);
        
        // Entrenar solo si tiene el doble del costo en dinero y recursos
        if (this.countryManager.canTrainArmy(country) &&
            country.money >= cost.money * 2 && 
            country.stats.military >= cost.stats.military + 2) {
            return true;
        }
        return false;
    }

    /**
     * Decide si la IA debe aumentar su ejército.
     */
    shouldIncreaseArmy(country) {
        const armyInfo = this.countryManager.getArmyInfo(country);
        // Usar el método que devuelve el objeto de costo completo
        const cost = this.countryManager.getArmyIncreaseCostObject(country);

        // Aumentar si tiene menos del 50% del ejército máximo y puede costearlo holgadamente
        if (armyInfo.percentage < 50 && 
            country.money >= cost.money * 2 &&
            country.stats.social >= cost.stats.social + 2 &&
            country.stats.economy >= cost.stats.economy + 2) {
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
        if (!this.countryManager) return 0;
        
        const otherCountries = this.countryManager.getAllCountries()
            .filter(c => c.id !== country.id && c.isActive);
        
        if (otherCountries.length === 0) return 0;

        const myPower = this.countryManager.getMilitaryPower(country);
        const maxEnemyPower = Math.max(...otherCountries.map(c => this.countryManager.getMilitaryPower(c)));
        
        // Devuelve un ratio de amenaza (e.g., 1.5 si el enemigo es 50% más fuerte)
        if (myPower === 0 && maxEnemyPower > 0) return 2.0; // Amenaza alta si no tienes poder
        if (maxEnemyPower === 0) return 0;
        
        return maxEnemyPower / myPower;
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