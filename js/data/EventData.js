/**
 * Datos de eventos para Worldx
 * Wrapper que coordina todos los tipos de eventos
 */
class EventData {
    constructor() {
        // Inicializar el gestor de eventos
        this.eventManager = new EventManager();
        
        // Mantener compatibilidad con el código existente
        this.eventTypes = EventTypes.getAllTypes();
    }

    /**
     * Genera un evento de personaje destacado
     * @param {string} statType - Tipo de estadística que debe favorecer
     * @returns {Object} Evento de personaje
     */
    generatePersonageEvent(statType) {
        return this.eventManager.personageEvents.generatePersonageEvent(statType);
    }

    /**
     * Genera un evento de crisis
     * @param {Array} affectedCountries - Países afectados
     * @returns {Object} Evento de crisis
     */
    generateCrisisEvent(affectedCountries = []) {
        return this.eventManager.crisisEvents.generateCrisisEvent(affectedCountries);
    }

    /**
     * Genera un evento de inspiración
     * @param {string} statType - Tipo de estadística que debe favorecer
     * @returns {Object} Evento de inspiración
     */
    generateInspirationEvent(statType) {
        return this.eventManager.inspirationEvents.generateInspirationEvent(statType);
    }

    /**
     * Genera un evento de desarrollo
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de desarrollo
     */
    generateDevelopmentEvent(country) {
        return this.eventManager.developmentEvents.generateDevelopmentEvent(country);
    }

    /**
     * Genera un evento de milestone (hito)
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de milestone
     */
    generateMilestoneEvent(country) {
        return this.eventManager.specialEvents.generateMilestoneEvent(country);
    }

    /**
     * Genera un evento de descubrimiento
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento de descubrimiento
     */
    generateDiscoveryEvent(country) {
        return this.eventManager.specialEvents.generateDiscoveryEvent(country);
    }

    /**
     * Genera un evento cultural
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento cultural
     */
    generateCulturalEvent(country) {
        return this.eventManager.specialEvents.generateCulturalEvent(country);
    }

    /**
     * Genera un evento tecnológico
     * @param {Object} country - País para el cual generar el evento
     * @returns {Object} Evento tecnológico
     */
    generateTechnologicalEvent(country) {
        return this.eventManager.specialEvents.generateTechnologicalEvent(country);
    }

    /**
     * Verifica si se cumplen las condiciones para un evento
     * @param {Object} conditions - Condiciones requeridas
     * @param {Object} stats - Estadísticas actuales del país
     * @returns {boolean} Si se cumplen las condiciones
     */
    checkConditions(conditions, stats) {
        return this.eventManager.checkConditions(conditions, stats);
    }

    /**
     * Genera un evento aleatorio basado en las estadísticas del país
     * @param {Object} country - País para el cual generar el evento
     * @param {number} year - Año actual
     * @returns {Object|null} Evento generado o null
     */
    generateRandomEvent(country, year) {
        return this.eventManager.generateRandomEvent(country, year);
    }

    /**
     * Aplica los efectos de un evento a un país con sinergias
     * @param {Object} event - Evento a aplicar
     * @param {Object} country - País afectado
     */
    applyEventEffects(event, country) {
        return this.eventManager.applyEventEffects(event, country);
    }

    /**
     * Revierte los efectos de un evento de un país
     * @param {Object} event - Evento a revertir
     * @param {Object} country - País afectado
     */
    revertEventEffects(event, country) {
        return this.eventManager.revertEventEffects(event, country);
    }

    /**
     * Verifica si un evento debe activarse basado en las estadísticas del país
     * @param {Object} event - Evento a verificar
     * @param {Object} country - País para verificar
     * @returns {boolean} Si el evento debe activarse
     */
    shouldTriggerEvent(event, country) {
        return this.eventManager.shouldTriggerEvent(event, country);
    }

    /**
     * Obtiene la descripción completa de un evento
     * @param {Object} event - Evento
     * @returns {string} Descripción completa
     */
    getEventDescription(event) {
        return this.eventManager.getEventDescription(event);
    }

    /**
     * Obtiene el color asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Color en formato CSS
     */
    getEventColor(eventType) {
        return EventTypes.getEventColor(eventType);
    }

    /**
     * Obtiene el icono asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Emoji del icono
     */
    getEventIcon(eventType) {
        return EventTypes.getEventIcon(eventType);
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     * @param {string} stat - Nombre de la estadística
     * @returns {string} Nombre de visualización
     */
    getStatDisplayName(stat) {
        return EventTypes.getStatDisplayName(stat);
    }

    // Métodos de compatibilidad para acceder a los datos de eventos
    get personageEvents() {
        return this.eventManager.personageEvents.getAllPersonageEvents();
    }

    get crisisEvents() {
        return this.eventManager.crisisEvents.getAllCrisisEvents();
    }

    get inspirationEvents() {
        return this.eventManager.inspirationEvents.getAllInspirationEvents();
    }

    get milestoneEvents() {
        return this.eventManager.specialEvents.getAllMilestoneEvents();
    }

    get discoveryEvents() {
        return this.eventManager.specialEvents.getAllDiscoveryEvents();
    }

    get culturalEvents() {
        return this.eventManager.specialEvents.getAllCulturalEvents();
    }

    get technologicalEvents() {
        return this.eventManager.specialEvents.getAllTechnologicalEvents();
    }

    get developmentEvents() {
        return this.eventManager.developmentEvents.getAllDevelopmentEvents();
    }
} 