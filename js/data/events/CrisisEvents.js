/**
 * Eventos de crisis para Worldx
 */
class CrisisEvents {
    constructor() {
        this.crisisEvents = [
            // Crisis Militares
            {
                title: 'Invasión Extranjera',
                description: 'Fuerzas enemigas han invadido las fronteras, amenazando la seguridad nacional.',
                effects: { military: -2, economy: -1 },
                duration: 4,
                type: 'military',
                severity: 'high'
            },
            {
                title: 'Golpe de Estado',
                description: 'Una facción militar ha tomado el poder por la fuerza, causando inestabilidad.',
                effects: { military: -1, social: -3, economy: -1 },
                duration: 3,
                type: 'military',
                severity: 'high'
            },
            {
                title: 'Deserción Masiva',
                description: 'Las tropas han comenzado a desertar en masa, debilitando las fuerzas armadas.',
                effects: { military: -2 },
                duration: 2,
                type: 'military',
                severity: 'medium'
            },
            
            // Crisis Sociales
            {
                title: 'Revolución Popular',
                description: 'El pueblo se ha levantado contra el gobierno, causando inestabilidad política.',
                effects: { social: -3, economy: -1 },
                duration: 3,
                type: 'social',
                severity: 'high'
            },
            {
                title: 'Plaga Mortal',
                description: 'Una enfermedad mortal se ha extendido por el país, causando estragos en la población.',
                effects: { social: -2, economy: -1 },
                duration: 3,
                type: 'social',
                severity: 'high'
            },
            {
                title: 'Epidemia',
                description: 'Una epidemia se ha propagado rápidamente, afectando la salud pública.',
                effects: { social: -2, economy: -1 },
                duration: 3,
                type: 'social',
                severity: 'medium'
            },
            {
                title: 'Corrupción Gubernamental',
                description: 'Escándalos de corrupción han minado la confianza en las instituciones.',
                effects: { social: -2, economy: -1 },
                duration: 2,
                type: 'social',
                severity: 'medium'
            },
            {
                title: 'Conflicto Étnico',
                description: 'Tensiones étnicas han estallado en violencia civil.',
                effects: { social: -2, military: -1 },
                duration: 3,
                type: 'social',
                severity: 'medium'
            },
            
            // Crisis Económicas
            {
                title: 'Crisis Económica',
                description: 'Una recesión económica ha golpeado duramente al país.',
                effects: { economy: -3, social: -1 },
                duration: 3,
                type: 'economic',
                severity: 'high'
            },
            {
                title: 'Hiperinflación',
                description: 'La moneda ha perdido su valor, causando caos económico.',
                effects: { economy: -2, social: -1 },
                duration: 2,
                type: 'economic',
                severity: 'high'
            },
            {
                title: 'Quiebra Bancaria',
                description: 'Los bancos principales han colapsado, paralizando la economía.',
                effects: { economy: -2, social: -1 },
                duration: 2,
                type: 'economic',
                severity: 'medium'
            },
            {
                title: 'Escasez de Recursos',
                description: 'La falta de recursos esenciales ha afectado la producción.',
                effects: { economy: -1, military: -1 },
                duration: 2,
                type: 'economic',
                severity: 'medium'
            },
            
            // Crisis Naturales
            {
                title: 'Terremoto Devastador',
                description: 'Un terremoto ha devastado regiones enteras del país.',
                effects: { economy: -2, social: -1, military: -1 },
                duration: 2,
                type: 'natural',
                severity: 'high'
            },
            {
                title: 'Sequía Prolongada',
                description: 'Una sequía prolongada ha devastado las cosechas y causado escasez de alimentos.',
                effects: { economy: -2, social: -1 },
                duration: 2,
                type: 'natural',
                severity: 'medium'
            },
            {
                title: 'Inundación Masiva',
                description: 'Inundaciones han destruido infraestructura y cultivos.',
                effects: { economy: -1, social: -1 },
                duration: 2,
                type: 'natural',
                severity: 'medium'
            },
            {
                title: 'Erupción Volcánica',
                description: 'Una erupción volcánica ha cubierto regiones con ceniza y lava.',
                effects: { economy: -2, social: -1 },
                duration: 3,
                type: 'natural',
                severity: 'high'
            }
        ];
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
            type: EventTypes.CRISIS,
            title: crisisData.title,
            description: crisisData.description,
            effects: crisisData.effects,
            affectedCountries: affectedCountries,
            year: 0,
            duration: crisisData.duration,
            isActive: true,
            severity: crisisData.severity
        };
    }

    /**
     * Genera una crisis específica por tipo
     * @param {string} crisisType - Tipo de crisis (military, social, economic, natural)
     * @param {Array} affectedCountries - Países afectados
     * @returns {Object} Evento de crisis
     */
    generateCrisisByType(crisisType, affectedCountries = []) {
        const availableCrises = this.crisisEvents.filter(crisis => crisis.type === crisisType);
        
        if (availableCrises.length === 0) {
            return this.generateCrisisEvent(affectedCountries);
        }
        
        const crisisData = RandomUtils.randomChoice(availableCrises);
        
        return {
            id: RandomUtils.generateUUID(),
            type: EventTypes.CRISIS,
            title: crisisData.title,
            description: crisisData.description,
            effects: crisisData.effects,
            affectedCountries: affectedCountries,
            year: 0,
            duration: crisisData.duration,
            isActive: true,
            severity: crisisData.severity
        };
    }

    /**
     * Obtiene todas las crisis por tipo
     * @param {string} crisisType - Tipo de crisis
     * @returns {Array} Array de crisis del tipo especificado
     */
    getCrisesByType(crisisType) {
        return this.crisisEvents.filter(crisis => crisis.type === crisisType);
    }

    /**
     * Obtiene todas las crisis
     * @returns {Array} Array de todas las crisis
     */
    getAllCrisisEvents() {
        return this.crisisEvents;
    }
} 