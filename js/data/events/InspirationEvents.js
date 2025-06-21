/**
 * Eventos de inspiración para Worldx
 */
class InspirationEvents {
    constructor() {
        this.inspirationEvents = [
            {
                title: 'Renacimiento Militar',
                description: 'El pueblo se ha inspirado en las glorias militares del pasado, despertando un fervor patriótico sin precedentes.',
                effects: { military: 3 },
                populationEffects: { birthRate: 1.2 },
                trigger: 'military',
                conditions: { 
                    military: 9,  // Requiere militar extremadamente alto
                    social: 6     // Necesita estabilidad social alta
                },
                minYear: 30       // Mínimo 30 semanas de juego
            },
            {
                title: 'Movimiento Social Revolucionario',
                description: 'Un movimiento por la justicia social ha inspirado a toda la nación, creando una ola de reformas progresistas.',
                effects: { social: 3 },
                populationEffects: { birthRate: 1.3 },
                trigger: 'social',
                conditions: { 
                    social: 9,    // Requiere social extremadamente alto
                    culture: 6    // Necesita desarrollo cultural alto
                },
                minYear: 35       // Mínimo 35 semanas de juego
            },
            {
                title: 'Edad de Oro Cultural',
                description: 'Una explosión de creatividad artística ha iluminado el país, atrayendo artistas y pensadores de todo el mundo.',
                effects: { culture: 3 },
                populationEffects: { birthRate: 1.1 },
                trigger: 'culture',
                conditions: { 
                    culture: 9,   // Requiere cultura extremadamente alta
                    science: 6    // Necesita base científica alta
                },
                minYear: 40       // Mínimo 40 semanas de juego
            },
            {
                title: 'Revolución Científica',
                description: 'Un nuevo paradigma científico ha revolucionado el pensamiento, catapultando al país a la vanguardia del conocimiento.',
                effects: { science: 3 },
                populationEffects: { birthRate: 1.2 },
                trigger: 'science',
                conditions: { 
                    science: 9,   // Requiere ciencia extremadamente alta
                    economy: 6    // Necesita recursos económicos altos
                },
                minYear: 45       // Mínimo 45 semanas de juego
            },
            {
                title: 'Boom Económico Histórico',
                description: 'Una ola de prosperidad económica sin precedentes ha barrido el país, creando riqueza y oportunidades para todos.',
                effects: { economy: 3 },
                populationEffects: { birthRate: 1.4 },
                trigger: 'economy',
                conditions: { 
                    economy: 9,   // Requiere economía extremadamente alta
                    military: 6   // Necesita estabilidad militar alta
                },
                minYear: 50       // Mínimo 50 semanas de juego
            }
        ];
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
            type: EventTypes.INSPIRATION,
            title: inspirationData.title,
            description: inspirationData.description,
            effects: inspirationData.effects,
            year: 0,
            duration: 0,
            isActive: true,
            minYear: inspirationData.minYear
        };
    }

    /**
     * Genera un evento de inspiración específico para el país
     * @param {Object} country - País
     * @param {number} currentYear - Año actual del juego
     * @returns {Object} Evento de inspiración
     */
    generateInspirationEventForCountry(country, currentYear = 0) {
        const stats = country.stats;
        
        // Encontrar estadísticas altas que cumplan las condiciones
        const eligibleStats = Object.keys(stats).filter(stat => {
            const inspirationData = this.inspirationEvents.find(i => i.trigger === stat);
            return inspirationData && 
                   this.checkConditions(inspirationData.conditions, stats) &&
                   currentYear >= inspirationData.minYear;
        });
        
        if (eligibleStats.length === 0) return null;
        
        // Preferir estadísticas más altas
        const chosenStat = eligibleStats.reduce((a, b) => stats[a] > stats[b] ? a : b);
        return this.generateInspirationEvent(chosenStat);
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
     * Verifica si un país puede tener una edad dorada
     * @param {Object} country - País
     * @param {number} currentYear - Año actual del juego
     * @returns {boolean} Si puede tener una edad dorada
     */
    canHaveGoldenAge(country, currentYear = 0) {
        const stats = country.stats;
        
        // Verificar tiempo mínimo de juego (más estricto)
        if (currentYear < 30) return false;
        
        // Verificar que tenga al menos una estadística muy alta
        const hasHighStat = Object.values(stats).some(stat => stat >= 8);
        if (!hasHighStat) return false;
        
        // Verificar que tenga desarrollo equilibrado (al menos 5 en todas las estadísticas)
        const hasBalancedDevelopment = Object.values(stats).every(stat => stat >= 5);
        if (!hasBalancedDevelopment) return false;
        
        // Verificar que no tenga estadísticas extremadamente bajas (evita asignación inicial)
        const hasVeryLowStat = Object.values(stats).some(stat => stat <= 2);
        if (hasVeryLowStat) return false;
        
        // Verificar que el desarrollo sea gradual (no todo asignado al inicio)
        const totalStats = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
        const averageStat = totalStats / 5;
        
        // Si el promedio es muy alto para el tiempo transcurrido, probablemente es asignación inicial
        const expectedMaxAverage = Math.min(7, 3 + (currentYear * 0.1)); // Progresión gradual
        if (averageStat > expectedMaxAverage) return false;
        
        // Verificar que haya al menos 3 estadísticas con 6 o más puntos
        const highStats = Object.values(stats).filter(stat => stat >= 6).length;
        if (highStats < 3) return false;
        
        return true;
    }

    /**
     * Obtiene todos los eventos de inspiración
     * @returns {Array} Array de eventos de inspiración
     */
    getAllInspirationEvents() {
        return this.inspirationEvents;
    }
} 