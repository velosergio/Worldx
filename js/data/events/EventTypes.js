/**
 * Tipos de eventos para Worldx
 */
class EventTypes {
    static PERSONAGE = 'personage';
    static CRISIS = 'crisis';
    static INSPIRATION = 'inspiration';
    static DEVELOPMENT = 'development';
    static MILESTONE = 'milestone';
    static DISCOVERY = 'discovery';
    static CONFLICT = 'conflict';
    static CULTURAL = 'cultural';
    static TECHNOLOGICAL = 'technological';
    static ECONOMIC = 'economic';
    static SOCIAL = 'social';
    static NATURAL = 'natural';

    /**
     * Obtiene todos los tipos de eventos
     */
    static getAllTypes() {
        return {
            PERSONAGE: this.PERSONAGE,
            CRISIS: this.CRISIS,
            INSPIRATION: this.INSPIRATION,
            DEVELOPMENT: this.DEVELOPMENT,
            MILESTONE: this.MILESTONE,
            DISCOVERY: this.DISCOVERY,
            CONFLICT: this.CONFLICT,
            CULTURAL: this.CULTURAL,
            TECHNOLOGICAL: this.TECHNOLOGICAL,
            ECONOMIC: this.ECONOMIC,
            SOCIAL: this.SOCIAL,
            NATURAL: this.NATURAL
        };
    }

    /**
     * Obtiene el color asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Color en formato CSS
     */
    static getEventColor(eventType) {
        const colors = {
            [this.PERSONAGE]: '#ffd700', // Dorado
            [this.CRISIS]: '#ff4444', // Rojo
            [this.INSPIRATION]: '#44ff44', // Verde
            [this.MILESTONE]: '#4444ff', // Azul
            [this.DISCOVERY]: '#ff44ff', // Magenta
            [this.CULTURAL]: '#ff8844', // Naranja
            [this.TECHNOLOGICAL]: '#44ffff', // Cian
            [this.DEVELOPMENT]: '#888888' // Gris
        };
        
        return colors[eventType] || '#ffffff';
    }

    /**
     * Obtiene el icono asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Emoji del icono
     */
    static getEventIcon(eventType) {
        const icons = {
            [this.PERSONAGE]: '👤',
            [this.CRISIS]: '⚠️',
            [this.INSPIRATION]: '💡',
            [this.MILESTONE]: '🏆',
            [this.DISCOVERY]: '🔍',
            [this.CULTURAL]: '🎭',
            [this.TECHNOLOGICAL]: '⚙️',
            [this.DEVELOPMENT]: '📈'
        };
        
        return icons[eventType] || '📋';
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     * @param {string} stat - Nombre de la estadística
     * @returns {string} Nombre de visualización
     */
    static getStatDisplayName(stat) {
        const names = {
            'military': 'Militar',
            'social': 'Social',
            'culture': 'Cultura',
            'science': 'Ciencia',
            'economy': 'Economía'
        };
        
        return names[stat] || stat;
    }

    /**
     * Obtiene las sinergias entre estadísticas
     * @returns {Object} Mapa de sinergias
     */
    static getSynergies() {
        return {
            military: ['economy', 'science'],
            social: ['culture', 'economy'],
            culture: ['social', 'science'],
            science: ['culture', 'economy'],
            economy: ['military', 'science']
        };
    }
} 