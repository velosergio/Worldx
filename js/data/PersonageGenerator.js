/**
 * Generador de personajes destacados para Worldx
 */
class PersonageGenerator {
    constructor() {
        this.firstNames = [
            'Alexander', 'Napoleon', 'Caesar', 'Hannibal', 'Sun Tzu', 'Genghis', 'Saladin', 'Joan',
            'Gandhi', 'Martin', 'Rosa', 'Nelson', 'Susan', 'Frederick', 'Harriet', 'Malala',
            'Leonardo', 'Shakespeare', 'Mozart', 'Van Gogh', 'Beethoven', 'Dante', 'Homer', 'Sappho',
            'Einstein', 'Newton', 'Tesla', 'Curie', 'Darwin', 'Galileo', 'Archimedes', 'Pythagoras',
            'Rothschild', 'Rockefeller', 'Ford', 'Carnegie', 'Morgan', 'Medici', 'Fugger', 'Bardi'
        ];

        this.lastNames = [
            'the Great', 'the Wise', 'the Brave', 'the Conqueror', 'the Liberator', 'the Visionary',
            'of Alexandria', 'of Rome', 'of Carthage', 'of China', 'of Mongolia', 'of Jerusalem',
            'the Peacemaker', 'the Reformer', 'the Revolutionary', 'the Dreamer', 'the Scholar',
            'da Vinci', 'the Bard', 'the Composer', 'the Painter', 'the Poet', 'the Philosopher',
            'the Genius', 'the Discoverer', 'the Inventor', 'the Pioneer', 'the Explorer',
            'the Merchant', 'the Banker', 'the Industrialist', 'the Financier', 'the Magnate'
        ];

        this.titles = {
            military: ['General', 'Comandante', 'Capitán', 'Almirante', 'Mariscal', 'Estratega'],
            social: ['Reformador', 'Líder', 'Activista', 'Visionario', 'Humanista', 'Pacifista'],
            culture: ['Artista', 'Poeta', 'Músico', 'Escritor', 'Filósofo', 'Escultor'],
            science: ['Científico', 'Inventor', 'Investigador', 'Descubridor', 'Innovador', 'Teórico'],
            economy: ['Comerciante', 'Banquero', 'Empresario', 'Mercader', 'Financiero', 'Industrial']
        };

        this.achievements = {
            military: [
                'revolucionó las tácticas militares',
                'unificó el ejército bajo su mando',
                'defendió exitosamente las fronteras',
                'expandió el territorio nacional',
                'modernizó las fuerzas armadas'
            ],
            social: [
                'promovió la igualdad social',
                'estableció reformas educativas',
                'mejoró las condiciones de vida',
                'defendió los derechos humanos',
                'creó instituciones de bienestar'
            ],
            culture: [
                'creó obras maestras inmortales',
                'estableció academias de arte',
                'promovió la literatura nacional',
                'fundó teatros y museos',
                'inspiró movimientos culturales'
            ],
            science: [
                'hizo descubrimientos revolucionarios',
                'estableció centros de investigación',
                'desarrolló nuevas tecnologías',
                'promovió la educación científica',
                'fundó universidades'
            ],
            economy: [
                'estableció rutas comerciales',
                'modernizó la industria',
                'creó instituciones financieras',
                'promovió el desarrollo económico',
                'estableció políticas comerciales'
            ]
        };
    }

    /**
     * Genera un personaje destacado
     * @param {string} statType - Tipo de estadística que debe favorecer
     * @param {Object} country - País del personaje
     * @returns {Object} Personaje generado
     */
    generatePersonage(statType, country) {
        const firstName = RandomUtils.randomChoice(this.firstNames);
        const lastName = RandomUtils.randomChoice(this.lastNames);
        const title = RandomUtils.randomChoice(this.titles[statType] || this.titles.social);
        const achievement = RandomUtils.randomChoice(this.achievements[statType] || this.achievements.social);

        return {
            id: RandomUtils.generateUUID(),
            name: `${firstName} ${lastName}`,
            title: title,
            statType: statType,
            country: country.name,
            achievement: achievement,
            biography: this.generateBiography(firstName, lastName, title, achievement, country),
            effects: { [statType]: 1 },
            yearBorn: RandomUtils.random(1, 50),
            yearDied: null,
            isActive: true
        };
    }

    /**
     * Genera la biografía de un personaje
     * @param {string} firstName - Nombre del personaje
     * @param {string} lastName - Apellido del personaje
     * @param {string} title - Título del personaje
     * @param {string} achievement - Logro principal
     * @param {Object} country - País del personaje
     * @returns {string} Biografía
     */
    generateBiography(firstName, lastName, title, achievement, country) {
        const templates = [
            `${firstName} ${lastName}, conocido como ${title}, emergió como una figura prominente en ${country.name}. ${achievement} y dejó un legado duradero en la historia de la nación.`,
            
            `Nacido en ${country.name}, ${firstName} ${lastName} se convirtió en ${title} y ${achievement}. Su visión y liderazgo transformaron el destino del país.`,
            
            `${title} ${firstName} ${lastName} se destacó en ${country.name} por ${achievement}. Su influencia se extendió más allá de su época, moldeando el futuro de la nación.`
        ];

        return RandomUtils.randomChoice(templates);
    }

    /**
     * Genera múltiples personajes para un país
     * @param {Object} country - País para generar personajes
     * @param {number} count - Número de personajes a generar
     * @returns {Array} Array de personajes
     */
    generatePersonages(country, count = 3) {
        const personages = [];
        const statTypes = Object.keys(this.titles);
        
        for (let i = 0; i < count; i++) {
            const statType = RandomUtils.randomChoice(statTypes);
            const personage = this.generatePersonage(statType, country);
            personages.push(personage);
        }
        
        return personages;
    }
} 