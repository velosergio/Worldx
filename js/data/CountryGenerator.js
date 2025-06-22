/**
 * Generador de países ficticios para Worldx
 */
class CountryGenerator {
    constructor() {
        this.countryPrefixes = [
            'Nova', 'Eldor', 'Astra', 'Myst', 'Zen', 'Crystal', 'Solar', 'Lunar',
            'Aqua', 'Terra', 'Vega', 'Orion', 'Phoenix', 'Dragon', 'Eagle', 'Lion',
            'Wolf', 'Bear', 'Tiger', 'Serpent', 'Falcon', 'Hawk', 'Raven', 'Swan',
            'Rose', 'Lily', 'Oak', 'Pine', 'Cedar', 'Maple', 'Willow', 'Birch',
            'Silver', 'Golden', 'Iron', 'Steel', 'Copper', 'Bronze', 'Platinum', 'Diamond',
            'Emerald', 'Ruby', 'Sapphire', 'Amethyst', 'Pearl', 'Jade', 'Onyx', 'Topaz',
            'North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower', 'Inner',
            'Outer', 'Greater', 'Lesser', 'New', 'Old', 'Ancient', 'Modern', 'Future'
        ];

        this.countrySuffixes = [
            'land', 'ia', 'stan', 'burg', 'port', 'ville', 'ton', 'ford', 'bridge',
            'dale', 'wood', 'field', 'hill', 'mountain', 'valley', 'river', 'lake',
            'sea', 'ocean', 'bay', 'gulf', 'strait', 'island', 'peninsula', 'coast',
            'empire', 'kingdom', 'republic', 'federation', 'alliance', 'union', 'league',
            'confederation', 'commonwealth', 'dominion', 'protectorate', 'colony', 'territory',
            'province', 'state', 'region', 'district', 'zone', 'area', 'sector', 'quarter',
            'realm', 'domain', 'territory', 'nation', 'country', 'state', 'republic',
            'monarchy', 'duchy', 'principality', 'marquisate', 'county', 'barony', 'fiefdom'
        ];

        this.culturalThemes = [
            'militarista', 'mercantil', 'artístico', 'científico', 'espiritual',
            'nómada', 'marítimo', 'montañoso', 'desértico', 'forestal',
            'urbano', 'rural', 'industrial', 'agrario', 'tecnológico',
            'tradicional', 'progresista', 'conservador', 'liberal', 'autoritario'
        ];

        this.geographicFeatures = [
            'montañas nevadas', 'desiertos áridos', 'selvas exuberantes', 'llanuras fértiles',
            'costas rocosas', 'islas tropicales', 'valles profundos', 'mesetas elevadas',
            'ríos caudalosos', 'lagos cristalinos', 'volcanes activos', 'glaciares eternos',
            'cañones imponentes', 'cataratas majestuosas', 'cuevas misteriosas', 'dunas móviles'
        ];

        this.climates = [
            'templado', 'tropical', 'ártico', 'desértico', 'mediterráneo',
            'subtropical', 'alpino', 'continental', 'oceánico', 'monzónico'
        ];

        this.resources = [
            'oro', 'plata', 'hierro', 'cobre', 'carbón', 'petróleo', 'gas natural',
            'madera', 'piedra', 'mármol', 'granito', 'diamantes', 'esmeraldas',
            'trigo', 'maíz', 'arroz', 'café', 'té', 'azúcar', 'algodón',
            'pescado', 'ganado', 'ovejas', 'cerdos', 'aves', 'caballos'
        ];
    }

    /**
     * Genera un país completo con todas sus características
     * @param {boolean} isPlayer - Si es el país del jugador
     * @returns {Object} País generado
     */
    generateCountry(isPlayer = false, customName = null) {
        const name = isPlayer && customName ? customName : this.generateCountryName();
        const theme = this.generateCulturalTheme();
        const geography = this.generateGeography();
        const resources = this.generateResources();
        const aiStrategy = this.generateAIStrategy();

        return {
            id: RandomUtils.generateUUID(),
            name: name,
            isPlayer: isPlayer,
            theme: theme,
            geography: geography,
            resources: resources,
            aiStrategy: aiStrategy,
            
            // Estadísticas iniciales (todas empiezan equilibradas)
            stats: {
                military: 0,
                social: 0,
                culture: 0,
                science: 0,
                economy: 0
            },

            // Puntos de desarrollo
            developmentPoints: 10,
            pendingDevelopment: {
                military: 0,
                social: 0,
                culture: 0,
                science: 0,
                economy: 0
            },

            // Sistema de población
            population: 500, // Población inicial fija
            birthRate: 1.0, // Multiplicador de natalidad (1.0 = normal)

            // Sistema de economía
            money: 1000, // Dinero inicial
            income: 25, // Ingreso por segundo (basado en población)
            taxRate: 0.05, // Tasa de impuestos (5% de la población)
            armyMaintenanceCost: 0, // Costo de mantenimiento del ejército
            armyTrainingCost: 0, // Costo de entrenamiento del ejército

            // Sistema militar
            army: 0, // Número de tropas (máximo 40% de población)
            armyExperience: 1, // Nivel de experiencia del ejército (1-10)
            maxArmySize: 0, // Se calcula dinámicamente
            increaseArmyCount: 0, // Para escalar costos
            trainArmyCount: 0, // Para escalar costos

            // Estado del juego
            isActive: true, // El país está activo en el juego
            goldenAgeActivated: false,
            goldenAgeTriggered: false,
            events: [],
            history: [],
            
            // Información adicional
            capital: this.generateCapital(name),
            government: this.generateGovernment(theme),
            religion: this.generateReligion(theme),
            language: this.generateLanguage(name),
            
            // Fecha de creación
            founded: 1,
            lastUpdated: 1
        };
    }

    /**
     * Genera un nombre de país combinando prefijos y sufijos
     * @returns {string} Nombre del país
     */
    generateCountryName() {
        const prefix = RandomUtils.randomChoice(this.countryPrefixes);
        const suffix = RandomUtils.randomChoice(this.countrySuffixes);
        
        // Asegurar que el nombre sea único y suene bien
        let name = prefix + suffix;
        
        // Aplicar algunas reglas para mejorar la sonoridad
        if (prefix.endsWith('a') && suffix.startsWith('a')) {
            name = prefix + suffix.substring(1);
        }
        
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    /**
     * Genera un tema cultural para el país
     * @returns {Object} Tema cultural
     */
    generateCulturalTheme() {
        const primaryTheme = RandomUtils.randomChoice(this.culturalThemes);
        const secondaryTheme = RandomUtils.randomChoice(this.culturalThemes.filter(t => t !== primaryTheme));
        
        return {
            primary: primaryTheme,
            secondary: secondaryTheme,
            description: this.generateThemeDescription(primaryTheme, secondaryTheme)
        };
    }

    /**
     * Genera descripción del tema cultural
     * @param {string} primary - Tema primario
     * @param {string} secondary - Tema secundario
     * @returns {string} Descripción
     */
    generateThemeDescription(primary, secondary) {
        const descriptions = {
            'militarista': 'Una sociedad que valora la disciplina y la fuerza militar',
            'mercantil': 'Un pueblo dedicado al comercio y la prosperidad económica',
            'artístico': 'Una cultura que celebra la creatividad y la expresión artística',
            'científico': 'Una nación que busca el conocimiento y la innovación',
            'espiritual': 'Un pueblo profundamente conectado con lo sagrado y lo místico',
            'nómada': 'Una sociedad que valora la libertad y el movimiento',
            'marítimo': 'Una cultura que vive del mar y la navegación',
            'montañoso': 'Un pueblo adaptado a la vida en las alturas',
            'desértico': 'Una sociedad que ha aprendido a prosperar en la aridez',
            'forestal': 'Una cultura que vive en armonía con los bosques',
            'urbano': 'Una sociedad moderna y cosmopolita',
            'rural': 'Un pueblo que mantiene tradiciones agrarias',
            'industrial': 'Una nación que se ha industrializado rápidamente',
            'agrario': 'Una sociedad basada en la agricultura',
            'tecnológico': 'Una cultura que abraza la tecnología avanzada',
            'tradicional': 'Un pueblo que preserva sus costumbres ancestrales',
            'progresista': 'Una sociedad que busca el cambio y la mejora',
            'conservador': 'Una cultura que valora la estabilidad y el orden',
            'liberal': 'Una sociedad que promueve la libertad individual',
            'autoritario': 'Una nación con un gobierno centralizado y fuerte'
        };

        return `${descriptions[primary]}, pero también ${descriptions[secondary].toLowerCase()}.`;
    }

    /**
     * Genera características geográficas
     * @returns {Object} Geografía del país
     */
    generateGeography() {
        const feature = RandomUtils.randomChoice(this.geographicFeatures);
        const climate = RandomUtils.randomChoice(this.climates);
        const size = RandomUtils.randomChoice(['pequeño', 'mediano', 'grande', 'enorme']);
        
        return {
            feature: feature,
            climate: climate,
            size: size,
            description: this.generateGeographyDescription(feature, climate, size)
        };
    }

    /**
     * Genera descripción geográfica
     * @param {string} feature - Característica principal
     * @param {string} climate - Clima
     * @param {string} size - Tamaño
     * @returns {string} Descripción
     */
    generateGeographyDescription(feature, climate, size) {
        return `Un país ${size} caracterizado por sus ${feature} y un clima ${climate}.`;
    }

    /**
     * Genera recursos naturales
     * @returns {Array} Lista de recursos
     */
    generateResources() {
        const resourceCount = RandomUtils.random(2, 5);
        const selectedResources = RandomUtils.randomChoices(this.resources, resourceCount, true);
        
        return selectedResources.map(resource => ({
            name: resource,
            abundance: RandomUtils.randomChoice(['escaso', 'moderado', 'abundante']),
            description: this.generateResourceDescription(resource)
        }));
    }

    /**
     * Genera descripción de un recurso
     * @param {string} resource - Nombre del recurso
     * @returns {string} Descripción
     */
    generateResourceDescription(resource) {
        const descriptions = {
            'oro': 'Metal precioso usado para joyería y monedas',
            'plata': 'Metal brillante valorado por su belleza',
            'hierro': 'Metal fuerte esencial para herramientas y armas',
            'cobre': 'Metal versátil usado en construcción y electricidad',
            'carbón': 'Combustible fósil para energía y industria',
            'petróleo': 'Recurso energético vital para la economía',
            'gas natural': 'Combustible limpio para calefacción y cocina',
            'madera': 'Material renovable para construcción y muebles',
            'piedra': 'Material duradero para construcción',
            'mármol': 'Piedra elegante para esculturas y edificios',
            'granito': 'Roca dura para construcción y pavimentación',
            'diamantes': 'Piedras preciosas de gran valor',
            'esmeraldas': 'Gemas verdes de belleza excepcional',
            'trigo': 'Cereal básico para pan y alimentos',
            'maíz': 'Cereal versátil para múltiples usos',
            'arroz': 'Grano esencial en la dieta diaria',
            'café': 'Bebida estimulante muy popular',
            'té': 'Infusión tradicional y saludable',
            'azúcar': 'Endulzante natural muy demandado',
            'algodón': 'Fibra natural para textiles',
            'pescado': 'Proteína marina abundante',
            'ganado': 'Animales para carne y productos lácteos',
            'ovejas': 'Animales para lana y carne',
            'cerdos': 'Animales versátiles para carne',
            'aves': 'Animales para huevos y carne',
            'caballos': 'Animales para transporte y trabajo'
        };

        return descriptions[resource] || 'Recurso valioso para el comercio';
    }

    /**
     * Genera estrategia de IA para países no jugador
     * @returns {Object} Estrategia de IA
     */
    generateAIStrategy() {
        const strategies = [
            {
                name: 'agresiva',
                description: 'Prioriza el desarrollo militar y la expansión',
                priorities: ['military', 'economy', 'science', 'social', 'culture'],
                aggression: 0.8,
                riskTolerance: 0.7
            },
            {
                name: 'conservadora',
                description: 'Se enfoca en el desarrollo social y la estabilidad',
                priorities: ['social', 'economy', 'science', 'culture', 'military'],
                aggression: 0.3,
                riskTolerance: 0.4
            },
            {
                name: 'científica',
                description: 'Busca el progreso a través del conocimiento',
                priorities: ['science', 'economy', 'culture', 'social', 'military'],
                aggression: 0.5,
                riskTolerance: 0.6
            },
            {
                name: 'cultural',
                description: 'Valora el desarrollo artístico y la influencia',
                priorities: ['culture', 'social', 'economy', 'science', 'military'],
                aggression: 0.4,
                riskTolerance: 0.5
            },
            {
                name: 'mercantil',
                description: 'Se enfoca en la prosperidad económica',
                priorities: ['economy', 'science', 'social', 'culture', 'military'],
                aggression: 0.6,
                riskTolerance: 0.5
            }
        ];

        return RandomUtils.randomChoice(strategies);
    }

    /**
     * Genera nombre de capital
     * @param {string} countryName - Nombre del país
     * @returns {string} Nombre de la capital
     */
    generateCapital(countryName) {
        const capitalPrefixes = ['Gran', 'Nueva', 'Vieja', 'Real', 'Imperial', 'Santa', 'San'];
        const capitalSuffixes = ['polis', 'burg', 'ton', 'ville', 'port', 'ford', 'bridge'];
        
        const prefix = RandomUtils.randomChoice(capitalPrefixes);
        const suffix = RandomUtils.randomChoice(capitalSuffixes);
        
        return prefix + ' ' + suffix;
    }

    /**
     * Genera tipo de gobierno
     * @param {Object} theme - Tema cultural
     * @returns {string} Tipo de gobierno
     */
    generateGovernment(theme) {
        const governments = {
            'militarista': ['Dictadura militar', 'Junta militar', 'Monarquía militar'],
            'mercantil': ['República mercantil', 'Oligarquía comercial', 'Federación comercial'],
            'artístico': ['República artística', 'Monarquía cultural', 'Democracia creativa'],
            'científico': ['República científica', 'Academia gobernante', 'Tecnocracia'],
            'espiritual': ['Teocracia', 'Monarquía divina', 'República sagrada'],
            'nómada': ['Confederación tribal', 'Jefatura nómada', 'Federación de clanes'],
            'marítimo': ['República marítima', 'Liga naval', 'Confederación costera'],
            'montañoso': ['Confederación montañesa', 'República alpina', 'Liga de valles'],
            'desértico': ['Emirato', 'Sultanato', 'Confederación tribal'],
            'forestal': ['República forestal', 'Confederación de bosques', 'Liga verde'],
            'urbano': ['República urbana', 'Democracia moderna', 'Federación de ciudades'],
            'rural': ['República agraria', 'Confederación rural', 'Liga campesina'],
            'industrial': ['República industrial', 'Sindicato gobernante', 'Federación obrera'],
            'agrario': ['República agraria', 'Confederación rural', 'Liga campesina'],
            'tecnológico': ['Tecnocracia', 'República digital', 'Federación tecnológica'],
            'tradicional': ['Monarquía tradicional', 'República ancestral', 'Confederación tribal'],
            'progresista': ['Democracia progresista', 'República liberal', 'Federación moderna'],
            'conservador': ['Monarquía conservadora', 'República tradicional', 'Confederación estable'],
            'liberal': ['Democracia liberal', 'República libre', 'Federación democrática'],
            'autoritario': ['Dictadura', 'Monarquía absoluta', 'República autoritaria']
        };

        const primaryTheme = theme.primary;
        const availableGovernments = governments[primaryTheme] || ['República', 'Monarquía', 'Confederación'];
        
        return RandomUtils.randomChoice(availableGovernments);
    }

    /**
     * Genera religión
     * @param {Object} theme - Tema cultural
     * @returns {string} Religión
     */
    generateReligion(theme) {
        const religions = {
            'espiritual': ['Culto de los Ancestros', 'Fe de la Naturaleza', 'Culto Solar', 'Misticismo Universal'],
            'militarista': ['Culto del Guerrero', 'Fe de la Victoria', 'Culto del Honor', 'Religión de la Fuerza'],
            'mercantil': ['Culto de la Prosperidad', 'Fe del Comercio', 'Culto del Oro', 'Religión del Éxito'],
            'artístico': ['Culto de la Belleza', 'Fe de la Creatividad', 'Culto de las Musas', 'Religión del Arte'],
            'científico': ['Culto del Conocimiento', 'Fe de la Razón', 'Culto de la Verdad', 'Religión de la Ciencia'],
            'nómada': ['Culto del Viento', 'Fe del Camino', 'Culto del Espíritu Libre', 'Religión del Movimiento'],
            'marítimo': ['Culto del Mar', 'Fe de las Olas', 'Culto de Neptuno', 'Religión Marina'],
            'montañoso': ['Culto de las Montañas', 'Fe de las Alturas', 'Culto del Pico', 'Religión Alpina'],
            'desértico': ['Culto del Sol', 'Fe de la Arena', 'Culto del Desierto', 'Religión del Oasis'],
            'forestal': ['Culto de los Árboles', 'Fe del Bosque', 'Culto de la Naturaleza', 'Religión Verde']
        };

        const primaryTheme = theme.primary;
        const availableReligions = religions[primaryTheme] || ['Culto Local', 'Fe Tradicional', 'Religión Ancestral'];
        
        return RandomUtils.randomChoice(availableReligions);
    }

    /**
     * Genera idioma
     * @param {string} countryName - Nombre del país
     * @returns {string} Idioma
     */
    generateLanguage(countryName) {
        const languageRoots = ['Nova', 'Eld', 'Astra', 'Myst', 'Zen', 'Crystal', 'Solar', 'Lunar'];
        const languageSuffixes = ['iano', 'és', 'ano', 'ico', 'ense', 'ita', 'ero', 'ano'];
        
        const root = RandomUtils.randomChoice(languageRoots);
        const suffix = RandomUtils.randomChoice(languageSuffixes);
        
        return root + suffix;
    }
} 