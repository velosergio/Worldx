/**
 * Eventos militares para Worldx
 */
class MilitaryEvents {
    constructor() {
        this.militaryEvents = [
            // Eventos Positivos - Aumentan poder militar
            {
                title: 'Victoria Épica',
                description: 'El ejército ha logrado una victoria legendaria que ha elevado la moral y la experiencia de todas las tropas.',
                effects: { military: 2 },
                applyEffect: (country, countryManager) => {
                    countryManager.trainArmy(country.id); // Reutiliza la lógica de entrenamiento
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'rare',
                conditions: { military: 5 }
            },
            {
                title: 'Reclutamiento Masivo',
                description: 'Un programa de reclutamiento exitoso ha atraído a miles de voluntarios al ejército.',
                effects: { military: 1 },
                applyEffect: (country, countryManager) => {
                    const increaseAmount = Math.floor(country.population * 0.15);
                    country.army += increaseAmount;
                    // Asegurarse de no exceder el límite
                    const maxArmy = Math.floor(country.population * 0.4);
                    if (country.army > maxArmy) country.army = maxArmy;
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'common',
                conditions: { social: 3 }
            },
            {
                title: 'Entrenamiento Avanzado',
                description: 'Un programa de entrenamiento especializado ha mejorado significativamente las habilidades del ejército.',
                effects: { military: 1 },
                applyEffect: (country, countryManager) => {
                    countryManager.trainArmy(country.id);
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'uncommon',
                conditions: { military: 4, economy: 3 }
            },
            {
                title: 'Alianza Militar',
                description: 'Una alianza estratégica con otra nación ha fortalecido las capacidades militares.',
                effects: { military: 2, economy: 1 },
                applyEffect: (country, countryManager) => {
                    countryManager.trainArmy(country.id);
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'rare',
                conditions: { military: 4, social: 4 }
            },
            {
                title: 'Innovación Tecnológica',
                description: 'Nuevas tecnologías militares han sido desarrolladas, dando ventaja estratégica al ejército.',
                effects: { military: 2, science: 1 },
                applyEffect: (country, countryManager) => {
                    countryManager.trainArmy(country.id);
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'uncommon',
                conditions: { science: 4, military: 3 }
            },
            {
                title: 'Héroe Nacional',
                description: 'Un comandante legendario ha surgido, inspirando a todo el ejército con su liderazgo.',
                effects: { military: 1, social: 1 },
                applyEffect: (country, countryManager) => {
                    countryManager.trainArmy(country.id);
                    countryManager.trainArmy(country.id); // Doble entrenamiento
                },
                duration: 0,
                type: 'military_positive',
                rarity: 'rare',
                conditions: { military: 5 }
            },

            // Eventos Negativos - Reducen poder militar
            {
                title: 'Derrota Desastrosa',
                description: 'Una derrota militar humillante ha minado la moral y la confianza del ejército.',
                effects: { military: -2, social: -1 },
                applyEffect: (country) => {
                    if (country.armyExperience > 1) country.armyExperience -= 1;
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'rare',
                conditions: { military: 3 }
            },
            {
                title: 'Deserción Masiva',
                description: 'Las tropas han comenzado a desertar en masa, debilitando las fuerzas armadas.',
                effects: { military: -1 },
                applyEffect: (country) => {
                    country.army = Math.floor(country.army * 0.8); // 20% de reducción
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'uncommon',
                conditions: { social: 2 }
            },
            {
                title: 'Escasez de Equipamiento',
                description: 'La falta de equipamiento moderno ha reducido la efectividad del ejército.',
                effects: { military: -1 },
                applyEffect: (country) => {
                    if (country.armyExperience > 1) country.armyExperience -= 1;
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'common',
                conditions: { economy: 2 }
            },
            {
                title: 'Conflicto Interno',
                description: 'Disputas internas en el alto mando han afectado la coordinación militar.',
                effects: { military: -1, social: -1 },
                applyEffect: (country) => {
                    if (country.armyExperience > 1) country.armyExperience -= 1;
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'uncommon',
                conditions: { social: 3 }
            },
            {
                title: 'Enfermedad en el Ejército',
                description: 'Una enfermedad se ha propagado entre las tropas, debilitando su capacidad de combate.',
                effects: { military: -2 },
                applyEffect: (country) => {
                    country.army = Math.floor(country.army * 0.9); // 10% de reducción
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'common',
                conditions: { social: 2 }
            },
            {
                title: 'Sabotaje Enemigo',
                description: 'Agentes enemigos han saboteado instalaciones militares críticas.',
                effects: { military: -2, economy: -1 },
                applyEffect: (country) => {
                    if (country.armyExperience > 1) country.armyExperience -= 1;
                },
                duration: 0,
                type: 'military_negative',
                rarity: 'rare',
                conditions: { military: 4 }
            }
        ];
    }

    /**
     * Genera un evento militar
     * @param {Object} country - País para el cual generar el evento
     * @param {number} year - Año actual
     * @returns {Object} Evento militar
     */
    generateMilitaryEvent(country, year) {
        // Filtrar eventos que cumplan las condiciones
        const eligibleEvents = this.militaryEvents.filter(event => {
            if (!event.conditions) return true;
            
            return Object.keys(event.conditions).every(stat => {
                return country.stats[stat] >= event.conditions[stat];
            });
        });

        if (eligibleEvents.length === 0) return null;

        // Dar más peso a eventos raros
        const weightedEvents = eligibleEvents.map(event => {
            let weight = 1;
            switch (event.rarity) {
                case 'common': weight = 3; break;
                case 'uncommon': weight = 2; break;
                case 'rare': weight = 1; break;
            }
            return { ...event, weight };
        });

        const militaryData = RandomUtils.weightedChoice(weightedEvents);
        
        if (!militaryData) return null;

        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.MILITARY,
            title: militaryData.title,
            description: militaryData.description,
            effects: militaryData.effects,
            applyEffect: militaryData.applyEffect,
            affectedCountries: [country.id],
            year: year,
            duration: militaryData.duration,
            isActive: true,
            rarity: militaryData.rarity,
            conditions: militaryData.conditions
        };
    }

    /**
     * Genera un evento militar específico por tipo
     * @param {string} eventType - Tipo de evento (military_positive, military_negative)
     * @param {Object} country - País afectado
     * @returns {Object} Evento militar
     */
    generateMilitaryEventByType(eventType, country) {
        const filteredEvents = this.militaryEvents.filter(event => event.type === eventType);
        
        if (filteredEvents.length === 0) return null;

        const militaryData = RandomUtils.randomChoice(filteredEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.MILITARY,
            title: militaryData.title,
            description: militaryData.description,
            effects: militaryData.effects,
            applyEffect: militaryData.applyEffect,
            affectedCountries: [country.id],
            year: 0,
            duration: militaryData.duration,
            isActive: true,
            rarity: militaryData.rarity,
            conditions: militaryData.conditions
        };
    }

    /**
     * Obtiene todos los eventos militares
     * @returns {Array} Lista de todos los eventos militares
     */
    getAllMilitaryEvents() {
        return this.militaryEvents;
    }

    /**
     * Obtiene eventos militares por tipo
     * @param {string} eventType - Tipo de evento
     * @returns {Array} Lista de eventos del tipo especificado
     */
    getMilitaryEventsByType(eventType) {
        return this.militaryEvents.filter(event => event.type === eventType);
    }
} 