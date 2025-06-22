/**
 * Eventos económicos para Worldx
 */
class EconomicEvents {
    constructor() {
        this.economicEvents = [
            // Eventos que aumentan el dinero
            {
                title: 'Boom Económico',
                description: 'Un período de prosperidad económica ha aumentado significativamente los ingresos.',
                effects: { money: 0.25 }, // +25% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Descubrimiento de Recursos',
                description: 'Se han descubierto valiosos recursos naturales que generan ingresos adicionales.',
                effects: { money: 0.15 }, // +15% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Acuerdo Comercial',
                description: 'Un acuerdo comercial beneficioso ha sido establecido con otra nación.',
                effects: { money: 0.20 }, // +20% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Inversión Extranjera',
                description: 'Inversores extranjeros han decidido invertir en tu país.',
                effects: { money: 0.30 }, // +30% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Reforma Fiscal',
                description: 'Una reforma fiscal ha optimizado la recaudación de impuestos.',
                effects: { money: 0.10 }, // +10% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Turismo Floreciente',
                description: 'El turismo ha aumentado significativamente, generando ingresos adicionales.',
                effects: { money: 0.18 }, // +18% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Exportaciones Exitosas',
                description: 'Las exportaciones han alcanzado niveles récord.',
                effects: { money: 0.22 }, // +22% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },
            {
                title: 'Innovación Tecnológica',
                description: 'Una innovación tecnológica ha mejorado la eficiencia económica.',
                effects: { money: 0.12 }, // +12% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'positive'
            },

            // Eventos que reducen el dinero
            {
                title: 'Recesión Económica',
                description: 'Una recesión económica ha afectado gravemente las finanzas del país.',
                effects: { money: -0.30 }, // -30% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Desastre Natural',
                description: 'Un desastre natural ha causado daños económicos significativos.',
                effects: { money: -0.25 }, // -25% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Corrupción Gubernamental',
                description: 'Escándalos de corrupción han mermado las arcas del estado.',
                effects: { money: -0.20 }, // -20% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Guerra Comercial',
                description: 'Una guerra comercial ha afectado las relaciones comerciales.',
                effects: { money: -0.18 }, // -18% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Inflación Galopante',
                description: 'La inflación ha erosionado el valor del dinero.',
                effects: { money: -0.15 }, // -15% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Fuga de Capitales',
                description: 'Los inversores han retirado sus capitales del país.',
                effects: { money: -0.22 }, // -22% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Crisis Energética',
                description: 'Una crisis energética ha aumentado los costos de producción.',
                effects: { money: -0.12 }, // -12% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            },
            {
                title: 'Pandemia',
                description: 'Una pandemia ha paralizado la actividad económica.',
                effects: { money: -0.28 }, // -28% del dinero actual
                duration: 1,
                type: 'economic',
                category: 'negative'
            }
        ];
    }

    /**
     * Genera un evento económico aleatorio
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento económico
     */
    generateEconomicEvent(country) {
        const economicData = RandomUtils.randomChoice(this.economicEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.ECONOMIC,
            title: economicData.title,
            description: economicData.description,
            effects: economicData.effects,
            year: 0,
            duration: economicData.duration,
            isActive: true,
            category: economicData.category
        };
    }

    /**
     * Genera un evento económico específico por categoría
     * @param {Object} country - País para el cual generar el evento
     * @param {string} category - Categoría del evento ('positive' o 'negative')
     * @returns {Object} Evento económico
     */
    generateEconomicEventByCategory(country, category) {
        const availableEvents = this.economicEvents.filter(event => event.category === category);
        
        if (availableEvents.length === 0) return null;
        
        const economicData = RandomUtils.randomChoice(availableEvents);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.ECONOMIC,
            title: economicData.title,
            description: economicData.description,
            effects: economicData.effects,
            year: 0,
            duration: economicData.duration,
            isActive: true,
            category: economicData.category
        };
    }

    /**
     * Aplica los efectos de un evento económico
     * @param {Object} country - País afectado
     * @param {Object} event - Evento económico
     */
    applyEconomicEffects(country, event) {
        if (event.effects.money) {
            const moneyChange = Math.floor(country.money * event.effects.money);
            country.money += moneyChange;
            
            // Asegurar que el dinero no sea negativo
            if (country.money < 0) {
                country.money = 0;
            }
        }
    }

    /**
     * Obtiene todos los eventos económicos
     * @returns {Array} Array de eventos económicos
     */
    getAllEconomicEvents() {
        return this.economicEvents;
    }

    /**
     * Obtiene eventos económicos por categoría
     * @param {string} category - Categoría del evento
     * @returns {Array} Array de eventos económicos de la categoría
     */
    getEconomicEventsByCategory(category) {
        return this.economicEvents.filter(event => event.category === category);
    }
} 