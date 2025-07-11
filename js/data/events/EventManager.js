/**
 * Gestor principal de eventos para Worldx
 * Coordina todos los tipos de eventos y maneja la lógica de generación
 */
class EventManager {
    constructor() {
        this.personageEvents = new PersonageEvents();
        this.crisisEvents = new CrisisEvents();
        this.inspirationEvents = new InspirationEvents();
        this.specialEvents = new SpecialEvents();
        this.developmentEvents = new DevelopmentEvents();
        this.populationEvents = new PopulationEvents();
        this.militaryEvents = new MilitaryEvents();
        this.economicEvents = new EconomicEvents();
        this.industryEvents = new IndustryEvents();
        this.financialEvents = FinancialEvents;
    }

    /**
     * Genera un evento aleatorio basado en las estadísticas del país
     * @param {Object} country - País para el cual generar el evento
     * @param {number} year - Año actual
     * @returns {Object|null} Evento generado o null
     */
    generateRandomEvent(country, year) {
        const { stats } = country;

        // Probabilidades base con más variedad
        const probabilities = [
            { type: EventTypes.PERSONAGE, weight: 0.15 },
            { type: EventTypes.CRISIS, weight: 0.14 },
            { type: EventTypes.INSPIRATION, weight: 0.08 },
            { type: EventTypes.MILESTONE, weight: 0.08 },
            { type: EventTypes.DISCOVERY, weight: 0.06 },
            { type: EventTypes.CULTURAL, weight: 0.05 },
            { type: EventTypes.TECHNOLOGICAL, weight: 0.04 },
            { type: EventTypes.POPULATION, weight: 0.12 },
            { type: EventTypes.MILITARY, weight: 0.11 },
            { type: EventTypes.ECONOMIC, weight: 0.17 },
            { type: EventTypes.INDUSTRY, weight: 0.10 },
            { type: EventTypes.INFRASTRUCTURE, weight: 0.10 },
            { type: EventTypes.FINANCIAL, weight: 0.12 }
        ];

        // Ajustar pesos basados en la situación del país
        this.adjustProbabilities(probabilities, stats, year);
        
        const chosenEvent = RandomUtils.weightedChoice(probabilities);
        const eventType = chosenEvent ? chosenEvent.type : null;
        
        let event = null;
        if (!eventType) return null;

        switch (eventType) {
            case EventTypes.PERSONAGE:
                event = this.personageEvents.generatePersonageEventForCountry(country);
                break;
                
            case EventTypes.CRISIS:
                event = this.crisisEvents.generateCrisisEvent([country.id]);
                break;
                
            case EventTypes.INSPIRATION:
                event = this.inspirationEvents.generateInspirationEventForCountry(country, year);
                break;
                
            case EventTypes.MILESTONE:
                event = this.specialEvents.generateMilestoneEvent(country);
                break;
                
            case EventTypes.DISCOVERY:
                event = this.specialEvents.generateDiscoveryEvent(country);
                break;
                
            case EventTypes.CULTURAL:
                event = this.specialEvents.generateCulturalEvent(country);
                break;
                
            case EventTypes.TECHNOLOGICAL:
                event = this.specialEvents.generateTechnologicalEvent(country);
                break;
                
            case EventTypes.POPULATION:
                event = this.populationEvents.generatePopulationEvent(country, year);
                break;
                
            case EventTypes.MILITARY:
                event = this.militaryEvents.generateMilitaryEvent(country, year);
                break;

            case EventTypes.ECONOMIC:
                event = this.economicEvents.generateEconomicEvent(country);
                break;
                
            case EventTypes.INDUSTRY:
                event = this.industryEvents.generateRandomEvent(country);
                break;

            case EventTypes.INFRASTRUCTURE:
                event = this.generateInfrastructureEvent(country);
                break;

            case EventTypes.FINANCIAL:
                event = this.generateFinancialEvent(country);
                break;
        }
        
        if (event) {
            event.year = year;
        }
        
        return event;
    }

    /**
     * Genera un evento de infraestructura usando el nuevo sistema
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object|null} Evento de infraestructura o null
     */
    generateInfrastructureEvent(country) {
        // Usar la función del nuevo sistema de eventos de infraestructura
        const availableEvents = getAvailableInfrastructureEvents(country);
        
        if (availableEvents.length === 0) {
            return null;
        }
        
        // Seleccionar evento basado en rareza
        const eventWeights = availableEvents.map(event => {
            switch (event.rarity) {
                case 'COMMON': return 10;
                case 'UNCOMMON': return 5;
                case 'RARE': return 2;
                default: return 1;
            }
        });
        
        const selectedEvent = RandomUtils.weightedChoice(
            availableEvents.map((event, index) => ({
                item: event,
                weight: eventWeights[index]
            }))
        );
        
        return selectedEvent ? selectedEvent.item : null;
    }

    /**
     * Genera un evento financiero usando el nuevo sistema
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object|null} Evento financiero o null
     */
    generateFinancialEvent(country) {
        // Obtener eventos disponibles basados en las condiciones del país
        const availableEvents = this.financialEvents.getAllEvents().filter(event => 
            this.financialEvents.canHaveEvent(country, event)
        );
        
        if (availableEvents.length === 0) {
            return null;
        }
        
        // Separar eventos positivos y negativos
        const positiveEvents = availableEvents.filter(event => 
            this.financialEvents.positive.includes(event)
        );
        const negativeEvents = availableEvents.filter(event => 
            this.financialEvents.negative.includes(event)
        );
        
        // 60% probabilidad de evento positivo, 40% de evento negativo
        const isPositive = Math.random() < 0.6;
        const eventPool = isPositive ? positiveEvents : negativeEvents;
        
        if (eventPool.length === 0) {
            return null;
        }
        
        // Seleccionar evento basado en rareza
        const eventWeights = eventPool.map(event => {
            switch (event.rarity) {
                case 'COMMON': return 10;
                case 'UNCOMMON': return 5;
                case 'RARE': return 2;
                default: return 1;
            }
        });
        
        const selectedEvent = RandomUtils.weightedChoice(
            eventPool.map((event, index) => ({
                item: event,
                weight: eventWeights[index]
            }))
        );
        
        return selectedEvent ? selectedEvent.item : null;
    }

    /**
     * Ajusta las probabilidades basadas en la situación del país
     * @param {Array} probabilities - Array de probabilidades
     * @param {Object} stats - Estadísticas del país
     * @param {number} year - Año actual
     */
    adjustProbabilities(probabilities, stats, year) {
        const totalStats = Object.values(stats).reduce((s, v) => s + v, 0);
        const averageStat = totalStats / 5;
        const maxStat = Math.max(...Object.values(stats));
        const minStat = Math.min(...Object.values(stats));

        // Menos crisis al principio del juego
        if (year < 10) {
            const crisisEvent = probabilities.find(p => p.type === EventTypes.CRISIS);
            if (crisisEvent) crisisEvent.weight *= 0.5;
        }

        // Edades doradas mucho más raras y específicas
        const inspirationEvent = probabilities.find(p => p.type === EventTypes.INSPIRATION);
        if (inspirationEvent) {
            // Solo permitir edades doradas después de mucho tiempo y con desarrollo muy alto
            if (year < 40 || averageStat < 7 || maxStat < 9) {
                inspirationEvent.weight *= 0.05; // 95% menos probable
            } else if (year >= 60 && averageStat >= 8 && maxStat >= 9) {
                inspirationEvent.weight *= 3.0; // Más probable solo en condiciones ideales
            } else {
                inspirationEvent.weight *= 0.1; // 90% menos probable en condiciones normales
            }
        }

        // Más milestones cuando tienes estadísticas altas
        if (averageStat > 5) {
            const milestoneEvent = probabilities.find(p => p.type === EventTypes.MILESTONE);
            if (milestoneEvent) milestoneEvent.weight *= 1.5;
        }

        // Más descubrimientos cuando tienes ciencia alta
        if (stats.science > 6) {
            const discoveryEvent = probabilities.find(p => p.type === EventTypes.DISCOVERY);
            if (discoveryEvent) discoveryEvent.weight *= 2.0;
        }

        // Más eventos culturales cuando tienes cultura alta
        if (stats.culture > 6) {
            const culturalEvent = probabilities.find(p => p.type === EventTypes.CULTURAL);
            if (culturalEvent) culturalEvent.weight *= 1.5;
        }

        // Más eventos tecnológicos cuando tienes ciencia y economía altas
        if (stats.science > 4 && stats.economy > 4) {
            const techEvent = probabilities.find(p => p.type === EventTypes.TECHNOLOGICAL);
            if (techEvent) techEvent.weight *= 1.5;
        }

        // Más eventos militares cuando tienes poder militar alto
        if (stats.military > 4) {
            const militaryEvent = probabilities.find(p => p.type === EventTypes.MILITARY);
            if (militaryEvent) militaryEvent.weight *= 1.5;
        }

        // Normalizar probabilidades
        const totalWeight = probabilities.reduce((sum, p) => sum + p.weight, 0);
        probabilities.forEach(p => p.weight /= totalWeight);
    }

    /**
     * Aplica los efectos de un evento a un país con sinergias
     * @param {Object} event - Evento a aplicar
     * @param {Object} country - País afectado
     */
    applyEventEffects(event, country) {
        // Aplicar efectos permanentes (si no son temporales)
        if (event.effects) {
            for (const stat in event.effects) {
                if (typeof event.effects[stat] !== 'object' && country.stats.hasOwnProperty(stat)) {
                    const baseEffect = event.effects[stat];
                    // Aplicar sinergias
                    const synergyBonus = this.calculateSynergyBonus(baseEffect, stat, country.stats, event.type);
                    const finalEffect = baseEffect + synergyBonus;
                    
                    country.stats[stat] = Math.max(0, country.stats[stat] + finalEffect);
                }
            }
        }
        
        // Aplicar efectos temporales
        if (event.effects && event.effects.temporary) {
            for (const stat in event.effects.temporary) {
                if (country.stats.hasOwnProperty(stat)) {
                    let effect = event.effects.temporary[stat];
                    
                    // Aplicar sinergias
                    const synergyBonus = this.calculateSynergyBonus(effect, stat, country.stats, event.type);
                    effect += synergyBonus;

                    if (!country.temporaryEffects) {
                        country.temporaryEffects = {};
                    }
                    if (!country.temporaryEffects[stat]) {
                        country.temporaryEffects[stat] = 0;
                    }
                    country.temporaryEffects[stat] += effect;
                    // Aplicar efecto inmediato, asegurando que no sea negativo
                    country.stats[stat] = Math.max(0, country.stats[stat] + effect);
                }
            }
        }

        // Ejecutar función de efecto personalizado si existe (para lógica compleja)
        if (typeof event.applyEffect === 'function') {
            event.applyEffect(country, window.worldxGame.countryManager);
        }

        // Aplicar efectos económicos (del sistema antiguo, para compatibilidad)
        if (event.economicEffects) {
            this.applyEconomicEffects(event, country);
        }
    }

    /**
     * Calcula bonificaciones por sinergias
     * @param {number} baseEffect - Efecto base
     * @param {string} stat - Estadística afectada
     * @param {Object} stats - Estadísticas actuales
     * @param {string} eventType - Tipo de evento
     * @returns {number} Efecto final con sinergias
     */
    calculateSynergyBonus(baseEffect, stat, stats, eventType) {
        let bonus = baseEffect;
        
        // Sinergias por estadísticas relacionadas
        const synergies = EventTypes.getSynergies();
        const relatedStats = synergies[stat] || [];
        
        relatedStats.forEach(relatedStat => {
            if (stats[relatedStat] > 5) {
                bonus += baseEffect * 0.2; // 20% bonus por estadística relacionada alta
            }
        });
        
        // Bonificaciones por tipo de evento
        if (eventType === EventTypes.MILESTONE) {
            bonus += 0.5; // Milestones son más poderosos
        }
        
        if (eventType === EventTypes.DISCOVERY) {
            bonus += 0.3; // Descubrimientos son especiales
        }
        
        return Math.round(bonus * 10) / 10; // Redondear a 1 decimal
    }

    /**
     * Revierte los efectos de un evento de un país
     * @param {Object} event - Evento a revertir
     * @param {Object} country - País afectado
     */
    revertEventEffects(event, country) {
        // Revertir efectos financieros (si es un evento financiero)
        if (event.type === EventTypes.FINANCIAL) {
            this.financialEvents.revertEventEffects(country, event);
        }

        // Revertir efectos de estadísticas
        if (event.effects) {
            if (typeof event.effects === 'object') {
                Object.keys(event.effects).forEach(stat => {
                    if (country.stats.hasOwnProperty(stat)) {
                        // Solo revertir el efecto base, no las sinergias
                        country.stats[stat] = Math.max(0, country.stats[stat] - event.effects[stat]);
                    }
                });
            }
        }

        // Revertir efectos de población (solo para efectos temporales)
        if (event.populationEffects && event.duration > 0) {
            if (event.populationEffects.birthRate) {
                // Revertir el multiplicador de natalidad
                country.birthRate = Math.max(0.1, country.birthRate / event.populationEffects.birthRate);
            }
        }

        // Revertir efectos militares (solo para efectos temporales)
        if (event.militaryEffects && event.duration > 0) {
            if (event.militaryEffects.armyExperience !== undefined) {
                country.armyExperience = Math.max(1, Math.min(10, country.armyExperience - event.militaryEffects.armyExperience));
            }
        }

        if (event.effects && event.effects.temporary) {
            for (const stat in event.effects.temporary) {
                if (country.stats.hasOwnProperty(stat)) {
                    // Revertir el efecto aplicado
                    let effect = event.effects.temporary[stat];
                    const synergyBonus = this.calculateSynergyBonus(effect, stat, country.stats, event.type);
                    effect += synergyBonus;
                    
                    // Revertir y asegurar que no sea negativo
                    country.stats[stat] = Math.max(0, country.stats[stat] - effect);

                    // Limpiar el efecto temporal del registro del país
                    if (country.temporaryEffects && country.temporaryEffects[stat]) {
                        country.temporaryEffects[stat] -= effect;
                    }
                }
            }
        }
    }

    /**
     * Verifica si un evento debe activarse basado en las estadísticas del país
     * @param {Object} event - Evento a verificar
     * @param {Object} country - País para verificar
     * @param {number} currentYear - Año actual del juego
     * @returns {boolean} Si el evento debe activarse
     */
    shouldTriggerEvent(event, country, currentYear = 0) {
        // Verificar condiciones específicas del evento
        if (event.conditions) {
            return this.checkConditions(event.conditions, country.stats);
        }
        
        // Verificar triggers específicos por tipo
        switch (event.type) {
            case EventTypes.PERSONAGE:
                const statType = Object.keys(event.effects)[0];
                return country.stats[statType] >= 2; // Requiere al menos 2 en la estadística
                
            case EventTypes.INSPIRATION:
                const triggerStat = Object.keys(event.effects)[0];
                // Las edades doradas requieren condiciones muy estrictas
                return country.stats[triggerStat] >= 9 && // Estadística extremadamente alta
                       currentYear >= 30 && // Tiempo mínimo de juego: 30 semanas
                       this.inspirationEvents.canHaveGoldenAge(country, currentYear);
                
            case EventTypes.MILESTONE:
            case EventTypes.DISCOVERY:
            case EventTypes.CULTURAL:
            case EventTypes.TECHNOLOGICAL:
                // Estos eventos tienen sus propias condiciones
                return true;
                
            default:
                return true; // Crisis y otros eventos siempre pueden ocurrir
        }
    }

    /**
     * Verifica si se cumplen las condiciones para un evento
     * @param {Object} conditions - Condiciones requeridas
     * @param {Object} stats - Estadísticas actuales del país
     * @returns {boolean} Si se cumplen las condiciones
     */
    checkConditions(conditions, stats) {
        if (!conditions) return true;
        
        return Object.keys(conditions).every(stat => {
            return stats[stat] >= conditions[stat];
        });
    }

    /**
     * Obtiene la descripción completa de un evento
     * @param {Object} event - Evento
     * @returns {string} Descripción completa
     */
    getEventDescription(event) {
        let description = event.description;
        
        if (event.effects) {
            const effectsList = [];
            Object.keys(event.effects).forEach(stat => {
                const effect = event.effects[stat];
                const statName = EventTypes.getStatDisplayName(stat);
                if (effect > 0) {
                    effectsList.push(`+${effect} ${statName}`);
                } else if (effect < 0) {
                    effectsList.push(`${effect} ${statName}`);
                }
            });
            
            if (effectsList.length > 0) {
                description += `\n\nEfectos: ${effectsList.join(', ')}`;
            }
        }
        
        // Añadir información sobre duración si es temporal
        if (event.duration && event.duration > 0) {
            description += `\n\nDuración: ${event.duration} semanas`;
        }
        
        // Añadir información sobre rareza si aplica
        if (event.rarity) {
            const rarityNames = {
                'common': 'Común',
                'uncommon': 'Poco común',
                'rare': 'Raro',
                'epic': 'Épico',
                'legendary': 'Legendario'
            };
            description += `\n\nRareza: ${rarityNames[event.rarity] || event.rarity}`;
        }
        
        return description;
    }

    /**
     * Genera múltiples eventos para un país
     * @param {Object} country - País
     * @param {number} year - Año actual
     * @param {number} count - Número de eventos a generar
     * @returns {Array} Array de eventos generados
     */
    generateMultipleEvents(country, year, count = 1) {
        const events = [];
        
        for (let i = 0; i < count; i++) {
            const event = this.generateRandomEvent(country, year);
            if (event) {
                events.push(event);
            }
        }
        
        return events;
    }
} 