/**
 * Eventos de desarrollo para Worldx
 */
class DevelopmentEvents {
    constructor() {
        this.developmentEvents = [
            {
                title: 'Desarrollo Equilibrado',
                description: 'El país ha logrado un desarrollo más equilibrado en todas las áreas.',
                effects: 'lowest',
                duration: 1,
                type: 'development'
            },
            {
                title: 'Reforma Educativa',
                description: 'Una reforma educativa ha mejorado el acceso al conocimiento.',
                effects: { science: 1, social: 1 },
                conditions: { social: 3 },
                type: 'development'
            },
            {
                title: 'Modernización Militar',
                description: 'Las fuerzas armadas han sido modernizadas con nueva tecnología.',
                effects: { military: 1, science: 1 },
                conditions: { military: 3, science: 2 },
                type: 'development'
            },
            {
                title: 'Infraestructura Básica',
                description: 'Se ha construido infraestructura básica que mejora la calidad de vida.',
                effects: { social: 1, economy: 1 },
                conditions: { economy: 2 },
                type: 'development'
            },
            {
                title: 'Sistema de Salud',
                description: 'Se ha establecido un sistema de salud público.',
                effects: { social: 1, science: 1 },
                conditions: { science: 2 },
                type: 'development'
            },
            {
                title: 'Red de Transporte',
                description: 'Se ha desarrollado una red de transporte eficiente.',
                effects: { economy: 1, military: 1 },
                conditions: { economy: 3 },
                type: 'development'
            }
        ];
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
            type: EventTypes.DEVELOPMENT,
            title: developmentData.title,
            description: developmentData.description,
            effects: { [lowestStat]: 1 },
            year: 0,
            duration: developmentData.duration,
            isActive: true
        };
    }

    /**
     * Genera un evento de desarrollo específico para una estadística
     * @param {Object} country - País para el cual generar el evento
     * @param {string} targetStat - Estadística objetivo
     * @returns {Object} Evento de desarrollo
     */
    generateDevelopmentEventForStat(country, targetStat) {
        const availableDevelopments = this.developmentEvents.filter(dev => {
            return !dev.conditions || this.checkConditions(dev.conditions, country.stats);
        });
        
        if (availableDevelopments.length === 0) return null;
        
        const developmentData = RandomUtils.randomChoice(availableDevelopments);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.DEVELOPMENT,
            title: developmentData.title,
            description: developmentData.description,
            effects: { [targetStat]: 1 },
            year: 0,
            duration: developmentData.duration,
            isActive: true
        };
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
     * Obtiene todos los eventos de desarrollo
     * @returns {Array} Array de eventos de desarrollo
     */
    getAllDevelopmentEvents() {
        return this.developmentEvents;
    }
} 