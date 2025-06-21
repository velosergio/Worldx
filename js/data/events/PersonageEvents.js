/**
 * Eventos de personajes destacados para Worldx
 */
class PersonageEvents {
    constructor() {
        this.personageEvents = [
            {
                type: 'military',
                titles: ['General', 'Comandante', 'Capitán', 'Almirante', 'Mariscal', 'Estratega', 'Conquistador', 'Defensor'],
                names: ['Alexander', 'Napoleon', 'Caesar', 'Hannibal', 'Sun Tzu', 'Genghis', 'Saladin', 'Joan', 'Wellington', 'Rommel', 'Patton', 'Zhukov'],
                descriptions: [
                    'Un líder militar brillante ha surgido, inspirando a las tropas con su valentía y estrategia.',
                    'Un comandante legendario ha tomado el mando, revolucionando las tácticas militares.',
                    'Un héroe de guerra ha emergido, uniendo al pueblo bajo su liderazgo carismático.',
                    'Un estratega visionario ha reorganizado las fuerzas armadas, elevando su eficiencia.',
                    'Un conquistador audaz ha expandido las fronteras del país con campañas exitosas.'
                ],
                effects: { military: 1 },
                conditions: { military: 2 }
            },
            {
                type: 'social',
                titles: ['Reformador', 'Líder', 'Activista', 'Visionario', 'Humanista', 'Pacifista', 'Revolucionario', 'Diplomático'],
                names: ['Gandhi', 'Martin', 'Rosa', 'Nelson', 'Susan', 'Frederick', 'Harriet', 'Malala', 'Mandela', 'King', 'Parks', 'Tubman'],
                descriptions: [
                    'Un reformador social ha surgido, luchando por los derechos y la justicia.',
                    'Un líder visionario ha inspirado al pueblo a buscar una sociedad más justa.',
                    'Un humanista ha emergido, promoviendo la igualdad y la compasión.',
                    'Un diplomático hábil ha mejorado las relaciones sociales internas.',
                    'Un activista comprometido ha movilizado a las masas por el cambio social.'
                ],
                effects: { social: 1 },
                conditions: { social: 2 }
            },
            {
                type: 'culture',
                titles: ['Artista', 'Poeta', 'Músico', 'Escritor', 'Filósofo', 'Escultor', 'Arquitecto', 'Dramaturgo'],
                names: ['Leonardo', 'Shakespeare', 'Mozart', 'Van Gogh', 'Beethoven', 'Dante', 'Homer', 'Sappho', 'Michelangelo', 'Bach', 'Rembrandt', 'Tolstoy'],
                descriptions: [
                    'Un artista genial ha emergido, creando obras que conmueven el alma.',
                    'Un poeta visionario ha surgido, capturando la esencia de la época.',
                    'Un músico prodigio ha aparecido, elevando los espíritus con su arte.',
                    'Un filósofo profundo ha iluminado el pensamiento nacional.',
                    'Un arquitecto innovador ha transformado el paisaje urbano.'
                ],
                effects: { culture: 1 },
                conditions: { culture: 2 }
            },
            {
                type: 'science',
                titles: ['Científico', 'Inventor', 'Investigador', 'Descubridor', 'Innovador', 'Teórico', 'Experimentalista', 'Pionero'],
                names: ['Einstein', 'Newton', 'Tesla', 'Curie', 'Darwin', 'Galileo', 'Archimedes', 'Pythagoras', 'Copernicus', 'Kepler', 'Boyle', 'Lavoisier'],
                descriptions: [
                    'Un científico brillante ha hecho un descubrimiento revolucionario.',
                    'Un inventor genial ha creado una tecnología que cambiará el mundo.',
                    'Un investigador visionario ha abierto nuevas fronteras del conocimiento.',
                    'Un teórico audaz ha propuesto una nueva teoría científica.',
                    'Un experimentalista meticuloso ha validado hipótesis revolucionarias.'
                ],
                effects: { science: 1 },
                conditions: { science: 2 }
            },
            {
                type: 'economy',
                titles: ['Comerciante', 'Banquero', 'Empresario', 'Mercader', 'Financiero', 'Industrial', 'Mercantil', 'Capitalista'],
                names: ['Rothschild', 'Rockefeller', 'Ford', 'Carnegie', 'Morgan', 'Medici', 'Fugger', 'Bardi', 'Vanderbilt', 'Astor', 'Gould', 'Hearst'],
                descriptions: [
                    'Un comerciante visionario ha establecido rutas comerciales lucrativas.',
                    'Un empresario innovador ha revolucionado la industria.',
                    'Un financiero astuto ha creado nuevas oportunidades económicas.',
                    'Un industrial pionero ha modernizado la producción nacional.',
                    'Un mercantil hábil ha expandido el comercio internacional.'
                ],
                effects: { economy: 1 },
                conditions: { economy: 2 }
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
            type: EventTypes.PERSONAGE,
            title: `${title} ${name}`,
            description: description,
            effects: personageData.effects,
            year: 0,
            duration: 0,
            isActive: true
        };
    }

    /**
     * Genera un personaje específico para el país
     * @param {Object} country - País
     * @returns {Object} Evento de personaje
     */
    generatePersonageEventForCountry(country) {
        const stats = country.stats;
        
        // Encontrar estadísticas altas que cumplan las condiciones
        const eligibleStats = Object.keys(stats).filter(stat => {
            const personageData = this.personageEvents.find(p => p.type === stat);
            return personageData && this.checkConditions(personageData.conditions, stats);
        });
        
        if (eligibleStats.length === 0) return null;
        
        // Preferir estadísticas más altas
        const chosenStat = eligibleStats.reduce((a, b) => stats[a] > stats[b] ? a : b);
        return this.generatePersonageEvent(chosenStat);
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
     * Obtiene todos los eventos de personajes
     * @returns {Array} Array de eventos de personajes
     */
    getAllPersonageEvents() {
        return this.personageEvents;
    }
} 