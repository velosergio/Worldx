/**
 * Eventos de Industria para Worldx
 */
class IndustryEvents {
    constructor() {
        this.events = [
            // Eventos Positivos
            {
                id: 'IND_001',
                type: 'INDUSTRY',
                name: 'Boom de la Productividad',
                description: 'Nuevas técnicas de gestión han disparado la productividad en nuestras industrias básicas.',
                rarity: 'common',
                conditions: { stats: { economy: 5, basic: 1 } },
                effects: { modifiers: { income_bonus: 0.15 }, duration: 10 }
            },
            {
                id: 'IND_002',
                type: 'INDUSTRY',
                name: 'Innovación en la Manufactura',
                description: 'Un avance en la maquinaria pesada ha mejorado la eficiencia de nuestras industrias avanzadas.',
                rarity: 'uncommon',
                conditions: { stats: { science: 10, advanced: 1 } },
                effects: { modifiers: { income_bonus: 0.25 }, duration: 8 }
            },
            {
                id: 'IND_003',
                type: 'INDUSTRY',
                name: 'Festival Cultural Internacional',
                description: 'Nuestro festival ha atraído a miles de turistas, generando ingresos récord para nuestra industria cultural.',
                rarity: 'uncommon',
                conditions: { stats: { culture: 15, cultural: 1 } },
                effects: { modifiers: { income_bonus: 0.30, culture_bonus: 2 }, duration: 5 }
            },
            {
                id: 'IND_004',
                type: 'INDUSTRY',
                name: 'Contrato de Exportación Militar',
                description: 'Hemos firmado un lucrativo contrato para exportar armamento, beneficiando a nuestra industria militar.',
                rarity: 'rare',
                conditions: { stats: { military: 20, military_industry: 1 } },
                effects: { modifiers: { money_flat: 1000, income_bonus: 0.10 }, duration: 12 }
            },
            {
                id: 'IND_005',
                type: 'INDUSTRY',
                name: 'Revolución Tecnológica',
                description: 'Un descubrimiento disruptivo ha puesto a nuestra industria tecnológica a la vanguardia mundial.',
                rarity: 'rare',
                conditions: { stats: { science: 25, tech: 1 } },
                effects: { modifiers: { science_bonus: 5, income_bonus: 0.20 }, duration: 10 }
            },

            // Eventos Negativos
            {
                id: 'IND_006',
                type: 'INDUSTRY',
                name: 'Huelga General',
                description: 'Los trabajadores exigen mejores condiciones, paralizando gran parte de nuestra industria básica.',
                rarity: 'common',
                conditions: { stats: { social: -5 } },
                effects: { modifiers: { income_bonus: -0.20 }, duration: 8 }
            },
            {
                id: 'IND_007',
                type: 'INDUSTRY',
                name: 'Obsolescencia Programada',
                description: 'Nuestra industria avanzada sufre una crisis de reputación por productos de baja calidad.',
                rarity: 'uncommon',
                conditions: { stats: { advanced: 2 } },
                effects: { modifiers: { income_bonus: -0.30 }, duration: 10 }
            },
            {
                id: 'IND_008',
                type: 'INDUSTRY',
                name: 'Escándalo de Corrupción',
                description: 'Un escándalo de corrupción ha salpicado a nuestra industria cultural, ahuyentando a los inversores.',
                rarity: 'uncommon',
                conditions: { stats: { cultural: 2 } },
                effects: { modifiers: { income_bonus: -0.25, money_flat: -500 }, duration: 12 }
            },
            {
                id: 'IND_009',
                type: 'INDUSTRY',
                name: 'Embargo de Armas',
                description: 'Un embargo internacional ha bloqueado las exportaciones de nuestra industria militar.',
                rarity: 'rare',
                conditions: { stats: { military_industry: 2 } },
                effects: { modifiers: { income_bonus: -0.50 }, duration: 15 }
            },
            {
                id: 'IND_010',
                type: 'INDUSTRY',
                name: 'Fuga de Cerebros',
                description: 'Nuestros mejores científicos han sido fichados por naciones rivales, afectando a nuestra industria tecnológica.',
                rarity: 'rare',
                conditions: { stats: { tech: 2 } },
                effects: { modifiers: { income_bonus: -0.35, science_bonus: -3 }, duration: 10 }
            }
        ];
    }

    /**
     * Obtiene todos los eventos de industria
     * @returns {Array}
     */
    getAllEvents() {
        return this.events;
    }

    /**
     * Genera un evento de industria aleatorio
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object|null}
     */
    generateRandomEvent(country) {
        const possibleEvents = this.events.filter(event => 
            this.checkConditions(event.conditions, country.stats) &&
            this.checkIndustryRequirement(event.conditions, country.economicData.industries)
        );

        if (possibleEvents.length === 0) return null;

        return RandomUtils.randomChoice(possibleEvents);
    }
    
    /**
     * Verifica si se cumplen las condiciones de estadísticas
     * @param {Object} conditions - Condiciones del evento
     * @param {Object} stats - Estadísticas del país
     * @returns {boolean}
     */
    checkConditions(conditions, stats) {
        if (!conditions || !conditions.stats) return true;
        
        for (const stat in conditions.stats) {
            const required = conditions.stats[stat];
            if (required > 0 && stats[stat] < required) {
                return false;
            }
            if (required < 0 && stats[stat] > required) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Verifica si se cumplen los requisitos de industria
     * @param {Object} conditions - Condiciones del evento
     * @param {Object} industries - Industrias del país
     * @returns {boolean}
     */
    checkIndustryRequirement(conditions, industries) {
        if (!conditions || !conditions.stats) return true;

        const industryMapping = {
            basic: 'basic',
            advanced: 'advanced',
            cultural: 'cultural',
            military_industry: 'military',
            tech: 'tech'
        };

        for (const req in conditions.stats) {
            const industryType = industryMapping[req];
            if (industryType && industries[industryType] < conditions.stats[req]) {
                return false;
            }
        }
        return true;
    }
} 