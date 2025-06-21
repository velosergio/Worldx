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

        // Configurar contenido con icono y color
        const eventIcon = this.getEventIcon(event.type);
        const eventColor = this.getEventColor(event.type);
        
        title.innerHTML = `${eventIcon} ${event.title}`;
        title.style.color = eventColor;
        
        description.textContent = event.description;
        countryName.textContent = country.name;

        // Mostrar efectos con mejor formato
        this.showEffects(effects, event);

        // Configurar estilo según tipo de evento
        this.setEventStyle(modal, event);

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
     * Muestra los efectos del evento con mejor formato
     * @param {HTMLElement} container - Contenedor para los efectos
     * @param {Object} event - Evento
     */
    showEffects(container, event) {
        container.innerHTML = '';

        if (!event.effects || Object.keys(event.effects).length === 0) {
            container.innerHTML = '<p class="no-effects">Este evento no tiene efectos directos.</p>';
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

        // Añadir información adicional si existe
        if (event.duration && event.duration > 0) {
            const durationInfo = document.createElement('div');
            durationInfo.className = 'duration-info';
            durationInfo.innerHTML = `<span class="duration-icon">⏱️</span> Duración: ${event.duration} semanas`;
            container.appendChild(durationInfo);
        }

        if (event.rarity) {
            const rarityInfo = document.createElement('div');
            rarityInfo.className = 'rarity-info';
            const rarityNames = {
                'common': 'Común',
                'uncommon': 'Poco común',
                'rare': 'Raro',
                'epic': 'Épico',
                'legendary': 'Legendario'
            };
            rarityInfo.innerHTML = `<span class="rarity-icon">⭐</span> Rareza: ${rarityNames[event.rarity] || event.rarity}`;
            container.appendChild(rarityInfo);
        }
    }

    /**
     * Configura el estilo del modal según el tipo de evento
     * @param {HTMLElement} modal - Elemento del modal
     * @param {Object} event - Evento
     */
    setEventStyle(modal, event) {
        // Remover estilos anteriores
        modal.classList.remove('event-personage', 'event-crisis', 'event-inspiration', 
                              'event-milestone', 'event-discovery', 'event-cultural', 
                              'event-technological', 'event-development');

        // Añadir estilo según tipo
        const eventType = event.type;
        if (eventType) {
            modal.classList.add(`event-${eventType}`);
        }

        // Aplicar color de borde según tipo
        const eventColor = this.getEventColor(eventType);
        modal.style.borderColor = eventColor;
        
        // Aplicar sombra con el color del evento
        modal.style.boxShadow = `0 0 20px ${eventColor}40`;
    }

    /**
     * Obtiene el icono asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Emoji del icono
     */
    getEventIcon(eventType) {
        const icons = {
            'personage': '👤',
            'crisis': '⚠️',
            'inspiration': '💡',
            'milestone': '🏆',
            'discovery': '🔍',
            'cultural': '🎭',
            'technological': '⚙️',
            'development': '📈'
        };
        
        return icons[eventType] || '📋';
    }

    /**
     * Obtiene el color asociado a un tipo de evento
     * @param {string} eventType - Tipo de evento
     * @returns {string} Color en formato CSS
     */
    getEventColor(eventType) {
        const colors = {
            'personage': '#ffd700', // Dorado
            'crisis': '#ff4444', // Rojo
            'inspiration': '#44ff44', // Verde
            'milestone': '#4444ff', // Azul
            'discovery': '#ff44ff', // Magenta
            'cultural': '#ff8844', // Naranja
            'technological': '#44ffff', // Cian
            'development': '#888888' // Gris
        };
        
        return colors[eventType] || '#ffffff';
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
        const victoryModal = document.getElementById('victory-modal');
        if (!victoryModal) return;

        const titleElement = victoryModal.querySelector('h2');
        const messageElement = document.getElementById('victory-message');
        const statsElement = document.getElementById('final-stats');

        if (!titleElement || !messageElement || !statsElement) return;

        // Limpiar contenido anterior
        messageElement.innerHTML = '';
        statsElement.innerHTML = '';

        switch (type) {
            case 'victory':
                titleElement.textContent = '¡Victoria!';
                this.showVictoryEffects(statsElement, data);
                break;
            case 'game-over':
                titleElement.textContent = 'Fin del Juego';
                this.showGameOverEffects(statsElement, data);
                break;
            default:
                return;
        }

        // Mostrar modal de victoria
        victoryModal.classList.remove('hidden');
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
        if (!container || !data) return;
        
        const winner = data.winner;
        const totalScore = Object.values(winner.stats).reduce((sum, stat) => sum + stat, 0);
        
        const messageElement = document.getElementById('victory-message');
        if (messageElement) {
            messageElement.innerHTML = `
                <p>${winner.name} ha alcanzado la supremacía ${this.getStatDisplayName(data.winningStat)} y ha ganado el juego.</p>
            `;
        }

        container.innerHTML = `
            <ul>
                <li>🏆 <strong>${winner.name}</strong>: ¡Victoria por ${this.getStatDisplayName(data.winningStat)}!</li>
                <li>📊 <strong>Puntuación Total</strong>: ${MathUtils.format(totalScore)}</li>
            </ul>
        `;
    }

    /**
     * Muestra efectos de fin de juego
     */
    showGameOverEffects(container, data) {
        if (!container || !data) return;

        const sortedCountries = [...data.countries].sort((a, b) => {
            const scoreA = Object.values(a.stats).reduce((sum, stat) => sum + stat, 0);
            const scoreB = Object.values(b.stats).reduce((sum, stat) => sum + stat, 0);
            return scoreB - scoreA;
        });

        const list = sortedCountries.map(country => {
            const score = Object.values(country.stats).reduce((sum, stat) => sum + stat, 0);
            return `<li><strong>${country.name}</strong>: ${MathUtils.format(score)} puntos</li>`;
        }).join('');

        container.innerHTML = `<ul>${list}</ul>`;
    }
} 