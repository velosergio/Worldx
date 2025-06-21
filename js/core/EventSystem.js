/**
 * Sistema de eventos para Worldx
 */
class EventSystem {
    constructor() {
        this.eventData = new EventData();
        this.activeEvents = [];
        this.eventQueue = [];
    }

    /**
     * Genera un evento aleatorio para un país
     */
    generateRandomEvent(country, year) {
        return this.eventData.generateRandomEvent(country, year);
    }

    /**
     * Aplica un evento a un país
     */
    applyEvent(event, country) {
        this.eventData.applyEventEffects(event, country);
        this.activeEvents.push(event);
        country.events.push(event);
        
        console.log(`Evento aplicado a ${country.name}: ${event.title}`);
    }

    /**
     * Revierte los efectos de un evento
     */
    removeEvent(event, country) {
        this.eventData.revertEventEffects(event, country);
        this.activeEvents = this.activeEvents.filter(e => e.id !== event.id);
    }

    /**
     * Obtiene todos los eventos activos
     */
    getActiveEvents() {
        return this.activeEvents;
    }

    /**
     * Genera eventos para todos los países
     */
    generateYearlyEvents(countries, year) {
        const events = [];
        
        countries.forEach(country => {
            const event = this.generateRandomEvent(country, year);
            if (event && this.eventData.shouldTriggerEvent(event, country, year)) {
                this.applyEvent(event, country);
                events.push({ event, country });
            }
        });
        
        return events;
    }

    /**
     * Actualiza eventos con duración
     */
    updateEvents() {
        this.activeEvents.forEach(event => {
            if (event.duration > 0) {
                event.duration--;
                if (event.duration <= 0) {
                    // Evento expirado, revertir efectos
                    const country = this.findCountryByEvent(event);
                    if (country) {
                        this.removeEvent(event, country);
                    }
                }
            }
        });
    }

    /**
     * Encuentra el país asociado a un evento
     */
    findCountryByEvent(event) {
        // Buscar en todos los países por el evento
        for (const country of window.worldxGame?.countryManager?.getAllCountries() || []) {
            if (country.events && country.events.find(e => e.id === event.id)) {
                return country;
            }
        }
        return null;
    }

    /**
     * Obtiene eventos recientes de un país
     */
    getRecentEvents(country, count = 5) {
        if (!country.events) return [];
        return country.events.slice(-count);
    }

    /**
     * Limpia eventos antiguos
     */
    cleanupOldEvents() {
        this.activeEvents = this.activeEvents.filter(event => {
            return event.duration > 0 || event.type === 'personage' || event.type === 'inspiration';
        });
    }
} 