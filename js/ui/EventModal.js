/**
 * Modal de eventos para Worldx
 */
class EventModal {
    constructor() {
        this.currentEvent = null;
        this.currentCountry = null;
        this.setupEventListeners();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botón de cerrar
        const closeBtn = document.getElementById('close-event-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Botón de continuar
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });

        // Cerrar al hacer clic fuera del modal
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide();
                }
            });
        }
    }

    /**
     * Muestra el modal con un evento
     */
    show(event, country) {
        this.currentEvent = event;
        this.currentCountry = country;

        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const effects = document.getElementById('event-effects');
        const countryName = document.getElementById('event-country-name');

        if (!modal || !title || !description || !effects || !countryName) return;

        // Configurar contenido
        title.textContent = event.title;
        description.textContent = event.description;
        countryName.textContent = country.name;

        // Mostrar efectos
        this.showEffects(effects, event);

        // Configurar estilo según tipo de evento
        this.setEventStyle(modal, event.type);

        // Mostrar modal con animación
        modal.classList.remove('hidden');
        modal.classList.add('show');

        // Añadir efecto de entrada
        gsap.fromTo(modal, 
            { 
                scale: 0.8, 
                opacity: 0,
                y: -50
            },
            { 
                scale: 1, 
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            }
        );
    }

    /**
     * Oculta el modal
     */
    hide() {
        const modal = document.getElementById('event-modal');
        if (!modal) return;

        // Animación de salida
        gsap.to(modal, {
            scale: 0.8,
            opacity: 0,
            y: -50,
            duration: 0.2,
            ease: "back.in(1.7)",
            onComplete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('show');
            }
        });
    }

    /**
     * Verifica si el modal está visible
     */
    isVisible() {
        const modal = document.getElementById('event-modal');
        return modal && !modal.classList.contains('hidden');
    }

    /**
     * Muestra los efectos del evento
     */
    showEffects(container, event) {
        container.innerHTML = '';

        if (!event.effects || Object.keys(event.effects).length === 0) {
            container.innerHTML = '<p>Este evento no tiene efectos directos.</p>';
            return;
        }

        const effectsList = document.createElement('ul');
        effectsList.className = 'effects-list';

        Object.entries(event.effects).forEach(([stat, value]) => {
            const effectItem = document.createElement('li');
            effectItem.className = 'effect-item';
            
            const icon = value > 0 ? '📈' : value < 0 ? '📉' : '➡️';
            const color = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
            
            effectItem.innerHTML = `
                <span class="effect-icon">${icon}</span>
                <span class="effect-stat">${this.getStatDisplayName(stat)}</span>
                <span class="effect-value ${color}">${value > 0 ? '+' : ''}${value}</span>
            `;
            
            effectsList.appendChild(effectItem);
        });

        container.appendChild(effectsList);
    }

    /**
     * Configura el estilo del modal según el tipo de evento
     */
    setEventStyle(modal, eventType) {
        // Remover estilos anteriores
        modal.classList.remove('event-personage', 'event-crisis', 'event-inspiration', 'event-development');

        // Añadir estilo según tipo
        switch (eventType) {
            case 'personage':
                modal.classList.add('event-personage');
                break;
            case 'crisis':
                modal.classList.add('event-crisis');
                break;
            case 'inspiration':
                modal.classList.add('event-inspiration');
                break;
            case 'development':
                modal.classList.add('event-development');
                break;
        }
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     */
    getStatDisplayName(stat) {
        const names = {
            'military': 'Militar',
            'social': 'Social',
            'culture': 'Cultura',
            'science': 'Ciencia',
            'economy': 'Economía',
            'developmentPoints': 'Puntos de Desarrollo'
        };
        
        return names[stat] || stat;
    }

    /**
     * Muestra un evento especial (edad dorada, victoria, etc.)
     */
    showSpecialEvent(type, data, pauseGame = false) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const effects = document.getElementById('event-effects');

        if (!modal || !title || !description || !effects) return;

        // Configurar contenido según el tipo
        switch (type) {
            case 'golden-age':
                title.textContent = '🌟 ¡Edad Dorada!';
                description.textContent = `${data.country.name} ha entrado en una edad dorada de desarrollo ${this.getStatDisplayName(data.triggerStat)}.`;
                this.showGoldenAgeEffects(effects);
                break;
            case 'victory':
                title.textContent = '🏆 ¡Victoria!';
                description.textContent = `${data.winner.name} ha alcanzado la supremacía ${this.getStatDisplayName(data.winningStat)} y ha ganado el juego.`;
                this.showVictoryEffects(effects, data);
                break;
            case 'game-over':
                title.textContent = '⏰ Fin del Juego';
                description.textContent = 'El tiempo ha terminado. Aquí están las estadísticas finales:';
                this.showGameOverEffects(effects, data);
                break;
        }

        // Configurar estilo especial
        modal.classList.remove('event-personage', 'event-crisis', 'event-inspiration', 'event-development');
        modal.classList.add(`event-${type.replace('-', '-')}`);

        // Mostrar modal
        modal.classList.remove('hidden');
        modal.classList.add('show');

        // Animación de entrada
        gsap.fromTo(modal, 
            { 
                scale: 0.8, 
                opacity: 0,
                y: -50
            },
            { 
                scale: 1, 
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            }
        );
    }

    /**
     * Muestra efectos de edad dorada
     */
    showGoldenAgeEffects(container) {
        container.innerHTML = `
            <ul class="effects-list">
                <li class="effect-item">
                    <span class="effect-icon">🌟</span>
                    <span class="effect-stat">Puntos de Desarrollo</span>
                    <span class="effect-value positive">+5</span>
                </li>
                <li class="effect-item">
                    <span class="effect-icon">⚡</span>
                    <span class="effect-stat">Eficiencia</span>
                    <span class="effect-value positive">+50%</span>
                </li>
            </ul>
        `;
    }

    /**
     * Muestra efectos de victoria
     */
    showVictoryEffects(container, data) {
        container.innerHTML = `
            <ul class="effects-list">
                <li class="effect-item">
                    <span class="effect-icon">🏆</span>
                    <span class="effect-stat">${data.winner.name}</span>
                    <span class="effect-value positive">Victoria</span>
                </li>
                <li class="effect-item">
                    <span class="effect-icon">📊</span>
                    <span class="effect-stat">Puntuación Total</span>
                    <span class="effect-value positive">${Object.values(data.winner.stats).reduce((sum, stat) => sum + stat, 0)}</span>
                </li>
            </ul>
        `;
    }

    /**
     * Muestra efectos de fin de juego
     */
    showGameOverEffects(container, data) {
        let html = '<ul class="effects-list">';
        
        data.countries.forEach(country => {
            const total = Object.values(country.stats).reduce((sum, stat) => sum + stat, 0);
            html += `
                <li class="effect-item">
                    <span class="effect-icon">🏛️</span>
                    <span class="effect-stat">${country.name}</span>
                    <span class="effect-value neutral">${total} puntos</span>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
    }
} 