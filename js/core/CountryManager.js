/**
 * Gestor de países para Worldx
 */
class CountryManager {
    constructor() {
        this.countries = [];
        this.playerCountry = null;
        this.aiCountries = [];
        this.countryGenerator = new CountryGenerator();
    }

    /**
     * Inicializa los países del juego
     */
    initializeCountries(playerCountryName = null) {
        this.countries = [];
        
        // Generar país del jugador
        this.playerCountry = this.countryGenerator.generateCountry(true, playerCountryName);
        this.countries.push(this.playerCountry);
        
        // Generar países de IA
        this.aiCountries = [];
        for (let i = 0; i < 2; i++) {
            const aiCountry = this.countryGenerator.generateCountry(false);
            this.countries.push(aiCountry);
            this.aiCountries.push(aiCountry);
        }
        
        return this.countries;
    }

    /**
     * Obtiene el país del jugador
     */
    getPlayerCountry() {
        return this.playerCountry;
    }

    /**
     * Obtiene los países de IA
     */
    getAICountries() {
        return this.aiCountries;
    }

    /**
     * Obtiene todos los países
     */
    getAllCountries() {
        return this.countries;
    }

    /**
     * Obtiene un país por ID
     */
    getCountryById(id) {
        return this.countries.find(country => country.id === id) || null;
    }

    /**
     * Aplica desarrollo a un país
     */
    applyDevelopment(countryId, development) {
        const country = this.getCountryById(countryId);
        if (!country) return false;

        const totalPoints = Object.values(development).reduce((sum, points) => sum + points, 0);
        if (totalPoints > country.developmentPoints) return false;

        Object.keys(development).forEach(stat => {
            if (country.stats.hasOwnProperty(stat)) {
                country.stats[stat] += development[stat];
            }
        });

        country.developmentPoints -= totalPoints;
        this.checkGoldenAge(country, development);

        return true;
    }

    /**
     * Verifica si se activa la edad dorada
     */
    checkGoldenAge(country, development) {
        if (country.goldenAgeActivated) return;

        // Verificar tiempo mínimo de juego (30 semanas)
        const currentYear = window.worldxGame ? window.worldxGame.currentYear : 0;
        if (currentYear < 30) return;

        const maxPoints = Math.max(...Object.values(development));
        if (maxPoints >= 3) {
            country.goldenAgeActivated = true;
            country.goldenAgeTriggered = true;
            country.developmentPoints += 3;
        }
    }

    /**
     * Añade puntos de desarrollo anuales
     */
    addAnnualDevelopmentPoints(points = 1) {
        this.countries.forEach(country => {
            country.developmentPoints += points;
        });
    }

    /**
     * Verifica si un país ha ganado
     */
    checkVictory(country) {
        const stats = country.stats;
        return Object.values(stats).some(stat => stat >= 100);
    }

    /**
     * Obtiene el ganador del juego
     */
    getWinner() {
        for (const country of this.countries) {
            if (this.checkVictory(country)) {
                return country;
            }
        }
        return null;
    }

    /**
     * Obtiene información limitada de otros países
     */
    getOtherCountriesIntel(playerCountryId) {
        return this.countries
            .filter(country => country.id !== playerCountryId)
            .map(country => this.generateIntel(country));
    }

    /**
     * Genera información de intel para un país
     */
    generateIntel(country) {
        const stats = country.stats;
        const highestStat = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
        const lowestStat = Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b);

        const rumors = [
            `${country.name} parece estar enfocado en el desarrollo ${this.getStatDisplayName(highestStat)}.`,
            `Se rumorea que ${country.name} ha descuidado su ${this.getStatDisplayName(lowestStat)}.`,
            `${country.name} mantiene un perfil bajo, pero se dice que está prosperando.`,
            `Los espías reportan que ${country.name} está invirtiendo fuertemente en ${this.getStatDisplayName(highestStat)}.`,
            `${country.name} parece estar en una posición ${this.getOverallStrength(stats) > 5 ? 'fuerte' : 'débil'}.`
        ];

        return {
            id: country.id,
            name: country.name,
            rumor: RandomUtils.randomChoice(rumors),
            strength: this.getOverallStrength(stats),
            highestStat: highestStat,
            lowestStat: lowestStat
        };
    }

    /**
     * Obtiene la fuerza general de un país
     */
    getOverallStrength(stats) {
        return Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     */
    getStatDisplayName(stat) {
        const names = {
            'military': 'militar',
            'social': 'social',
            'culture': 'cultural',
            'science': 'científico',
            'economy': 'económico'
        };
        
        return names[stat] || stat;
    }

    /**
     * Guarda el estado del juego
     */
    saveGameState() {
        return {
            countries: this.countries,
            playerCountry: this.playerCountry,
            aiCountries: this.aiCountries,
            timestamp: Date.now()
        };
    }

    /**
     * Carga el estado del juego
     */
    loadGameState(gameState) {
        this.countries = gameState.countries || [];
        this.playerCountry = gameState.playerCountry || null;
        this.aiCountries = gameState.aiCountries || [];
    }
} 