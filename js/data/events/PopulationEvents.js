/**
 * Eventos de población para Worldx
 */
class PopulationEvents {
    constructor() {
        this.populationEvents = [
            // Eventos positivos de población
            {
                title: 'Baby Boom',
                description: 'Una ola de optimismo y prosperidad ha llevado a un aumento significativo en la natalidad.',
                effects: { social: 1 },
                populationEffects: { birthRate: 1.5 },
                duration: 4,
                type: 'positive',
                rarity: 'rare'
            },
            {
                title: 'Inmigración Masiva',
                description: 'Personas de otros países han llegado en masa, atraídas por las oportunidades y la estabilidad.',
                effects: { economy: 1, culture: 1 },
                populationEffects: { population: 100, birthRate: 1.1 },
                duration: 0,
                type: 'positive',
                rarity: 'uncommon'
            },
            {
                title: 'Revolución Médica',
                description: 'Avances médicos han reducido drásticamente la mortalidad infantil y aumentado la esperanza de vida.',
                effects: { science: 1, social: 1 },
                populationEffects: { birthRate: 1.3 },
                duration: 6,
                type: 'positive',
                rarity: 'rare'
            },
            {
                title: 'Paz Prolongada',
                description: 'Un período de paz sin precedentes ha creado condiciones ideales para el crecimiento familiar.',
                effects: { social: 1, economy: 1 },
                populationEffects: { birthRate: 1.2 },
                duration: 3,
                type: 'positive',
                rarity: 'common'
            },
            {
                title: 'Reforma Agraria',
                description: 'Una reforma agraria exitosa ha mejorado la seguridad alimentaria y la calidad de vida.',
                effects: { economy: 1, social: 1 },
                populationEffects: { population: 50, birthRate: 1.1 },
                duration: 0,
                type: 'positive',
                rarity: 'uncommon'
            },
            
            // Eventos negativos de población
            {
                title: 'Éxodo Masivo',
                description: 'Muchas personas han abandonado el país en busca de mejores oportunidades en el extranjero.',
                effects: { economy: -1, social: -1 },
                populationEffects: { population: -80, birthRate: 0.8 },
                duration: 0,
                type: 'negative',
                rarity: 'uncommon'
            },
            {
                title: 'Crisis de Fertilidad',
                description: 'Una misteriosa crisis ha reducido drásticamente las tasas de fertilidad en el país.',
                effects: { social: -1 },
                populationEffects: { birthRate: 0.6 },
                duration: 5,
                type: 'negative',
                rarity: 'rare'
            },
            {
                title: 'Envejecimiento Poblacional',
                description: 'La población está envejeciendo rápidamente, con menos jóvenes para sostener la economía.',
                effects: { economy: -1 },
                populationEffects: { birthRate: 0.7 },
                duration: 4,
                type: 'negative',
                rarity: 'uncommon'
            },
            {
                title: 'Emigración de Jóvenes',
                description: 'Los jóvenes están abandonando el país en busca de mejores oportunidades educativas y laborales.',
                effects: { science: -1, economy: -1 },
                populationEffects: { population: -60, birthRate: 0.9 },
                duration: 0,
                type: 'negative',
                rarity: 'common'
            },
            {
                title: 'Crisis de Vivienda',
                description: 'La falta de vivienda asequible está disuadiendo a las familias de tener hijos.',
                effects: { social: -1, economy: -1 },
                populationEffects: { birthRate: 0.8 },
                duration: 3,
                type: 'negative',
                rarity: 'common'
            }
        ];
    }

    /**
     * Genera un evento de población aleatorio
     * @param {Object} country - País afectado
     * @param {number} year - Año actual
     * @returns {Object} Evento de población
     */
    generatePopulationEvent(country, year = 0) {
        const populationData = RandomUtils.randomChoice(this.populationEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.POPULATION,
            title: populationData.title,
            description: populationData.description,
            effects: populationData.effects,
            populationEffects: populationData.populationEffects,
            year: year,
            duration: populationData.duration,
            isActive: true,
            rarity: populationData.rarity
        };
    }

    /**
     * Genera un evento de población específico por tipo
     * @param {string} eventType - Tipo de evento (positive, negative)
     * @param {Object} country - País afectado
     * @param {number} year - Año actual
     * @returns {Object} Evento de población
     */
    generatePopulationEventByType(eventType, country, year = 0) {
        const availableEvents = this.populationEvents.filter(event => event.type === eventType);
        
        if (availableEvents.length === 0) {
            return this.generatePopulationEvent(country, year);
        }
        
        const populationData = RandomUtils.randomChoice(availableEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.POPULATION,
            title: populationData.title,
            description: populationData.description,
            effects: populationData.effects,
            populationEffects: populationData.populationEffects,
            year: year,
            duration: populationData.duration,
            isActive: true,
            rarity: populationData.rarity
        };
    }

    /**
     * Verifica si un país debe tener un evento de población
     * @param {Object} country - País
     * @param {number} year - Año actual
     * @returns {boolean} Si debe tener un evento de población
     */
    shouldTriggerPopulationEvent(country, year = 0) {
        // Probabilidad base de 15% por semana
        let chance = 0.15;
        
        // Aumentar probabilidad si la población es muy alta o muy baja
        if (country.population > 1000) chance += 0.1;
        if (country.population < 200) chance += 0.2;
        
        // Aumentar probabilidad si la natalidad es extrema
        if (country.birthRate > 1.5) chance += 0.1;
        if (country.birthRate < 0.5) chance += 0.1;
        
        // Disminuir probabilidad si ya tiene eventos de población activos
        const activePopulationEvents = country.events ? 
            country.events.filter(e => e.type === EventTypes.POPULATION && e.isActive).length : 0;
        if (activePopulationEvents > 0) chance *= 0.3;
        
        return Math.random() < chance;
    }

    /**
     * Obtiene todos los eventos de población
     * @returns {Array} Array de eventos de población
     */
    getAllPopulationEvents() {
        return this.populationEvents;
    }
} 