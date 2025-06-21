/**
 * Datos de eventos para Worldx
 */
class EventData {
    constructor() {
        this.eventTypes = {
            PERSONAGE: 'personage',
            CRISIS: 'crisis',
            INSPIRATION: 'inspiration',
            DEVELOPMENT: 'development'
        };

        this.personageEvents = [
            {
                type: 'military',
                titles: ['General', 'Comandante', 'Capitán', 'Almirante', 'Mariscal'],
                names: ['Alexander', 'Napoleon', 'Caesar', 'Hannibal', 'Sun Tzu', 'Genghis', 'Saladin', 'Joan'],
                descriptions: [
                    'Un líder militar brillante ha surgido, inspirando a las tropas con su valentía y estrategia.',
                    'Un comandante legendario ha tomado el mando, revolucionando las tácticas militares.',
                    'Un héroe de guerra ha emergido, uniendo al pueblo bajo su liderazgo carismático.'
                ],
                effects: { military: 1 }
            },
            {
                type: 'social',
                titles: ['Reformador', 'Líder', 'Activista', 'Visionario', 'Humanista'],
                names: ['Gandhi', 'Martin', 'Rosa', 'Nelson', 'Susan', 'Frederick', 'Harriet', 'Malala'],
                descriptions: [
                    'Un reformador social ha surgido, luchando por los derechos y la justicia.',
                    'Un líder visionario ha inspirado al pueblo a buscar una sociedad más justa.',
                    'Un humanista ha emergido, promoviendo la igualdad y la compasión.'
                ],
                effects: { social: 1 }
            },
            {
                type: 'culture',
                titles: ['Artista', 'Poeta', 'Músico', 'Escritor', 'Filósofo'],
                names: ['Leonardo', 'Shakespeare', 'Mozart', 'Van Gogh', 'Beethoven', 'Dante', 'Homer', 'Sappho'],
                descriptions: [
                    'Un artista genial ha emergido, creando obras que conmueven el alma.',
                    'Un poeta visionario ha surgido, capturando la esencia de la época.',
                    'Un músico prodigio ha aparecido, elevando los espíritus con su arte.'
                ],
                effects: { culture: 1 }
            },
            {
                type: 'science',
                titles: ['Científico', 'Inventor', 'Investigador', 'Descubridor', 'Innovador'],
                names: ['Einstein', 'Newton', 'Tesla', 'Curie', 'Darwin', 'Galileo', 'Archimedes', 'Pythagoras'],
                descriptions: [
                    'Un científico brillante ha hecho un descubrimiento revolucionario.',
                    'Un inventor genial ha creado una tecnología que cambiará el mundo.',
                    'Un investigador visionario ha abierto nuevas fronteras del conocimiento.'
                ],
                effects: { science: 1 }
            },
            {
                type: 'economy',
                titles: ['Comerciante', 'Banquero', 'Empresario', 'Mercader', 'Financiero'],
                names: ['Rothschild', 'Rockefeller', 'Ford', 'Carnegie', 'Morgan', 'Medici', 'Fugger', 'Bardi'],
                descriptions: [
                    'Un comerciante visionario ha establecido rutas comerciales lucrativas.',
                    'Un empresario innovador ha revolucionado la industria.',
                    'Un financiero astuto ha creado nuevas oportunidades económicas.'
                ],
                effects: { economy: 1 }
            }
        ];

        this.crisisEvents = [
            {
                title: 'Plaga',
                description: 'Una enfermedad mortal se ha extendido por el país, causando estragos en la población.',
                effects: { social: -2, economy: -1 },
                duration: 3
            },
            {
                title: 'Sequía',
                description: 'Una sequía prolongada ha devastado las cosechas y causado escasez de alimentos.',
                effects: { economy: -2, social: -1 },
                duration: 2
            },
            {
                title: 'Invasión',
                description: 'Fuerzas enemigas han invadido las fronteras, amenazando la seguridad nacional.',
                effects: { military: -2, economy: -1 },
                duration: 4
            },
            {
                title: 'Revolución',
                description: 'El pueblo se ha levantado contra el gobierno, causando inestabilidad política.',
                effects: { social: -3, economy: -1 },
                duration: 3
            },
            {
                title: 'Desastre Natural',
                description: 'Un terremoto/tsunami ha devastado regiones enteras del país.',
                effects: { economy: -2, social: -1, military: -1 },
                duration: 2
            },
            {
                title: 'Crisis Económica',
                description: 'Una recesión económica ha golpeado duramente al país.',
                effects: { economy: -3, social: -1 },
                duration: 3
            },
            {
                title: 'Corrupción',
                description: 'Escándalos de corrupción han minado la confianza en las instituciones.',
                effects: { social: -2, economy: -1 },
                duration: 2
            },
            {
                title: 'Epidemia',
                description: 'Una epidemia se ha propagado rápidamente, afectando la salud pública.',
                effects: { social: -2, economy: -1 },
                duration: 3
            }
        ];

        this.inspirationEvents = [
            {
                title: 'Renacimiento Militar',
                description: 'El pueblo se ha inspirado en las glorias militares del pasado.',
                effects: { military: 2 },
                trigger: 'military'
            },
            {
                title: 'Movimiento Social',
                description: 'Un movimiento por la justicia social ha inspirado a toda la nación.',
                effects: { social: 2 },
                trigger: 'social'
            },
            {
                title: 'Edad de Oro Cultural',
                description: 'Una explosión de creatividad artística ha iluminado el país.',
                effects: { culture: 2 },
                trigger: 'culture'
            },
            {
                title: 'Revolución Científica',
                description: 'Un nuevo paradigma científico ha revolucionado el pensamiento.',
                effects: { science: 2 },
                trigger: 'science'
            },
            {
                title: 'Boom Económico',
                description: 'Una ola de prosperidad económica ha barrido el país.',
                effects: { economy: 2 },
                trigger: 'economy'
            }
        ];

        this.developmentEvents = [
            {
                title: 'Desarrollo Equilibrado',
                description: 'El país ha logrado un desarrollo más equilibrado en todas las áreas.',
                effects: 'lowest',
                duration: 1
            }
        ];
    }

    /**
     * Genera un evento de personaje destacado
     * @param {string} statType - Tipo de estadística que debe favorecer
     * @returns {Object} Evento de personaje
     */
    generatePersonageEvent(statType) {
        const personageData = this.personageEvents.find(p => p.type === statType);
        if (!personageData) return null;

        const title = RandomUtils.randomChoice(personageData.titles);
        const name = RandomUtils.randomChoice(personageData.names);
        const description = RandomUtils.randomChoice(personageData.descriptions);

        return {
            id: RandomUtils.generateUUID(),
            type: this.eventTypes.PERSONAGE,
            title: `${title} ${name}`,
            description: description,
            effects: personageData.effects,
            year: 0, // Se establecerá cuando se genere
            duration: 0,
            isActive: true
        };
    }

    /**
     * Genera un evento de crisis
     * @param {Array} affectedCountries - Países afectados
     * @returns {Object} Evento de crisis
     */
    generateCrisisEvent(affectedCountries = []) {
        const crisisData = RandomUtils.randomChoice(this.crisisEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: this.eventTypes.CRISIS,
            title: crisisData.title,
            description: crisisData.description,
            effects: crisisData.effects,
            affectedCountries: affectedCountries,
            year: 0, // Se establecerá cuando se genere
            duration: crisisData.duration,
            isActive: true
        };
    }

    /**
     * Genera un evento de inspiración
     * @param {string} statType - Tipo de estadística que debe favorecer
     * @returns {Object} Evento de inspiración
     */
    generateInspirationEvent(statType) {
        const inspirationData = this.inspirationEvents.find(i => i.trigger === statType);
        if (!inspirationData) return null;

        return {
            id: RandomUtils.generateUUID(),
            type: this.eventTypes.INSPIRATION,
            title: inspirationData.title,
            description: inspirationData.description,
            effects: inspirationData.effects,
            year: 0, // Se establecerá cuando se genere
            duration: 0,
            isActive: true
        };
    }

    /**
     * Genera un evento de desarrollo
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de desarrollo
     */
    generateDevelopmentEvent(country) {
        const developmentData = RandomUtils.randomChoice(this.developmentEvents);
        
        // Encontrar la estadística más baja
        const stats = country.stats;
        const lowestStat = Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b);
        
        return {
            id: RandomUtils.generateUUID(),
            type: this.eventTypes.DEVELOPMENT,
            title: developmentData.title,
            description: developmentData.description,
            effects: { [lowestStat]: 1 },
            year: 0, // Se establecerá cuando se genere
            duration: developmentData.duration,
            isActive: true
        };
    }

    /**
     * Genera un evento aleatorio basado en las estadísticas del país
     * @param {Object} country - País para el cual generar el evento
     * @param {number} year - Año actual
     * @returns {Object|null} Evento generado o null
     */
    generateRandomEvent(country, year) {
        const { stats } = country; // Declarar stats al principio

        const probabilities = [
            { type: this.eventTypes.PERSONAGE, weight: 0.4 },
            { type: this.eventTypes.CRISIS, weight: 0.3 },
            { type: this.eventTypes.INSPIRATION, weight: 0.2 },
            { type: this.eventTypes.DEVELOPMENT, weight: 0.1 }
        ];

        // Ajustar pesos basados en la situación del país
        const totalStats = Object.values(stats).reduce((s, v) => s + v, 0);

        if (totalStats < 10) {
            probabilities.find(p => p.type === this.eventTypes.CRISIS).weight = 0.1; // Menos crisis al principio
        }
        
        const chosenEvent = RandomUtils.weightedChoice(probabilities);
        const eventType = chosenEvent ? chosenEvent.type : null;
        
        let event = null;
        if (!eventType) return null;

        switch (eventType) {
            case this.eventTypes.PERSONAGE:
                // Generar personaje basado en la estadística más alta
                const highestStat = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
                event = this.generatePersonageEvent(highestStat);
                break;
                
            case this.eventTypes.CRISIS:
                event = this.generateCrisisEvent([country.id]);
                break;
                
            case this.eventTypes.INSPIRATION:
                // Generar inspiración basada en la estadística más baja
                const weakestStat = Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b);
                event = this.generateInspirationEvent(weakestStat);
                break;
                
            case this.eventTypes.DEVELOPMENT:
                event = this.generateDevelopmentEvent(country);
                break;
        }
        
        if (event) {
            event.year = year;
        }
        
        return event;
    }

    /**
     * Aplica los efectos de un evento a un país
     * @param {Object} event - Evento a aplicar
     * @param {Object} country - País afectado
     */
    applyEventEffects(event, country) {
        if (!event.effects) return;

        if (typeof event.effects === 'object') {
            Object.keys(event.effects).forEach(stat => {
                if (country.stats.hasOwnProperty(stat)) {
                    country.stats[stat] = Math.max(0, country.stats[stat] + event.effects[stat]);
                }
            });
        }
    }

    /**
     * Revierte los efectos de un evento de un país
     * @param {Object} event - Evento a revertir
     * @param {Object} country - País afectado
     */
    revertEventEffects(event, country) {
        if (!event.effects) return;

        if (typeof event.effects === 'object') {
            Object.keys(event.effects).forEach(stat => {
                if (country.stats.hasOwnProperty(stat)) {
                    country.stats[stat] = Math.max(0, country.stats[stat] - event.effects[stat]);
                }
            });
        }
    }

    /**
     * Verifica si un evento debe activarse basado en las estadísticas del país
     * @param {Object} event - Evento a verificar
     * @param {Object} country - País para verificar
     * @returns {boolean} Si el evento debe activarse
     */
    shouldTriggerEvent(event, country) {
        if (event.type === this.eventTypes.PERSONAGE) {
            // Los personajes aparecen cuando tienes puntos en esa estadística
            const statType = Object.keys(event.effects)[0];
            return country.stats[statType] > 0;
        }
        
        if (event.type === this.eventTypes.INSPIRATION) {
            // La inspiración aparece cuando tienes puntos en esa estadística
            const statType = Object.keys(event.effects)[0];
            return country.stats[statType] > 0;
        }
        
        return true; // Crisis y desarrollo siempre pueden ocurrir
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
                const statName = this.getStatDisplayName(stat);
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
        
        return description;
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     * @param {string} stat - Nombre de la estadística
     * @returns {string} Nombre de visualización
     */
    getStatDisplayName(stat) {
        const names = {
            'military': 'Militar',
            'social': 'Social',
            'culture': 'Cultura',
            'science': 'Ciencia',
            'economy': 'Economía'
        };
        
        return names[stat] || stat;
    }
} 