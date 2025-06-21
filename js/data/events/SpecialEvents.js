/**
 * Eventos especiales para Worldx (Milestones, Descubrimientos, Culturales, Tecnológicos)
 */
class SpecialEvents {
    constructor() {
        this.milestoneEvents = [
            {
                title: 'Primera Universidad',
                description: 'Se ha fundado la primera universidad del país, marcando el inicio de la educación superior.',
                effects: { science: 1, culture: 1 },
                conditions: { science: 3, economy: 2 },
                type: 'milestone'
            },
            {
                title: 'Constitución Nacional',
                description: 'Se ha promulgado una constitución que establece los derechos fundamentales.',
                effects: { social: 2, culture: 1 },
                conditions: { social: 4 },
                type: 'milestone'
            },
            {
                title: 'Primera Fábrica',
                description: 'La industrialización comienza con la construcción de la primera fábrica moderna.',
                effects: { economy: 2, science: 1 },
                conditions: { economy: 3, science: 2 },
                type: 'milestone'
            },
            {
                title: 'Ejército Profesional',
                description: 'Se ha establecido un ejército profesional y bien entrenado.',
                effects: { military: 2, social: 1 },
                conditions: { military: 4, economy: 2 },
                type: 'milestone'
            }
        ];

        this.discoveryEvents = [
            {
                title: 'Descubrimiento de Recursos',
                description: 'Se han descubierto valiosos recursos naturales en el territorio.',
                effects: { economy: 1, science: 1 },
                type: 'discovery',
                rarity: 'rare'
            },
            {
                title: 'Tecnología Revolucionaria',
                description: 'Científicos han desarrollado una tecnología que cambiará el mundo.',
                effects: { science: 2, economy: 1 },
                conditions: { science: 6 },
                type: 'discovery',
                rarity: 'rare'
            },
            {
                title: 'Ruta Comercial',
                description: 'Se ha establecido una nueva ruta comercial lucrativa.',
                effects: { economy: 2, culture: 1 },
                conditions: { economy: 4 },
                type: 'discovery',
                rarity: 'uncommon'
            }
        ];

        this.culturalEvents = [
            {
                title: 'Festival Nacional',
                description: 'Un gran festival cultural ha unido al pueblo y elevado el espíritu nacional.',
                effects: { culture: 1, social: 1 },
                type: 'cultural',
                duration: 1
            },
            {
                title: 'Obra Maestra',
                description: 'Un artista ha creado una obra que será recordada por generaciones.',
                effects: { culture: 2 },
                conditions: { culture: 3 },
                type: 'cultural'
            },
            {
                title: 'Movimiento Artístico',
                description: 'Un nuevo movimiento artístico ha surgido, inspirando a toda una generación.',
                effects: { culture: 1, science: 1 },
                conditions: { culture: 4 },
                type: 'cultural',
                duration: 2
            }
        ];

        this.technologicalEvents = [
            {
                title: 'Innovación Industrial',
                description: 'Una innovación tecnológica ha revolucionado la industria.',
                effects: { science: 1, economy: 1 },
                conditions: { science: 4, economy: 3 },
                type: 'technological'
            },
            {
                title: 'Avance Médico',
                description: 'Un descubrimiento médico ha mejorado significativamente la salud pública.',
                effects: { science: 1, social: 1 },
                conditions: { science: 5 },
                type: 'technological'
            },
            {
                title: 'Infraestructura Moderna',
                description: 'Se ha construido infraestructura moderna que mejora la eficiencia nacional.',
                effects: { economy: 1, military: 1 },
                conditions: { economy: 4 },
                type: 'technological'
            }
        ];
    }

    /**
     * Genera un evento de milestone (hito)
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de milestone
     */
    generateMilestoneEvent(country) {
        const availableMilestones = this.milestoneEvents.filter(milestone => {
            return this.checkConditions(milestone.conditions, country.stats);
        });
        
        if (availableMilestones.length === 0) return null;
        
        const milestoneData = RandomUtils.randomChoice(availableMilestones);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.MILESTONE,
            title: milestoneData.title,
            description: milestoneData.description,
            effects: milestoneData.effects,
            year: 0,
            duration: 0,
            isActive: true
        };
    }

    /**
     * Genera un evento de descubrimiento
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de descubrimiento
     */
    generateDiscoveryEvent(country) {
        const availableDiscoveries = this.discoveryEvents.filter(discovery => {
            return !discovery.conditions || this.checkConditions(discovery.conditions, country.stats);
        });
        
        if (availableDiscoveries.length === 0) return null;
        
        const discoveryData = RandomUtils.randomChoice(availableDiscoveries);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.DISCOVERY,
            title: discoveryData.title,
            description: discoveryData.description,
            effects: discoveryData.effects,
            year: 0,
            duration: 0,
            isActive: true,
            rarity: discoveryData.rarity
        };
    }

    /**
     * Genera un evento cultural
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento cultural
     */
    generateCulturalEvent(country) {
        const availableCultural = this.culturalEvents.filter(cultural => {
            return !cultural.conditions || this.checkConditions(cultural.conditions, country.stats);
        });
        
        if (availableCultural.length === 0) return null;
        
        const culturalData = RandomUtils.randomChoice(availableCultural);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.CULTURAL,
            title: culturalData.title,
            description: culturalData.description,
            effects: culturalData.effects,
            year: 0,
            duration: culturalData.duration || 0,
            isActive: true
        };
    }

    /**
     * Genera un evento tecnológico
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento tecnológico
     */
    generateTechnologicalEvent(country) {
        const availableTechnological = this.technologicalEvents.filter(tech => {
            return !tech.conditions || this.checkConditions(tech.conditions, country.stats);
        });
        
        if (availableTechnological.length === 0) return null;
        
        const techData = RandomUtils.randomChoice(availableTechnological);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.TECHNOLOGICAL,
            title: techData.title,
            description: techData.description,
            effects: techData.effects,
            year: 0,
            duration: 0,
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
     * Obtiene todos los eventos de milestone
     * @returns {Array} Array de eventos de milestone
     */
    getAllMilestoneEvents() {
        return this.milestoneEvents;
    }

    /**
     * Obtiene todos los eventos de descubrimiento
     * @returns {Array} Array de eventos de descubrimiento
     */
    getAllDiscoveryEvents() {
        return this.discoveryEvents;
    }

    /**
     * Obtiene todos los eventos culturales
     * @returns {Array} Array de eventos culturales
     */
    getAllCulturalEvents() {
        return this.culturalEvents;
    }

    /**
     * Obtiene todos los eventos tecnológicos
     * @returns {Array} Array de eventos tecnológicos
     */
    getAllTechnologicalEvents() {
        return this.technologicalEvents;
    }
} 