/**
 * Gestor de inteligencia para Worldx
 * Maneja todo lo relacionado con información de países y espionaje
 */
class IntelManager {
    constructor(countryManager) {
        this.countryManager = countryManager;
    }

    /**
     * Obtiene información limitada de otros países para el panel de Intel.
     */
    getOtherCountriesIntel(playerCountryId) {
        return this.countryManager.countries
            .filter(country => country.id !== playerCountryId && country.isActive)
            .map(country => this.generateIntel(country));
    }

    /**
     * Obtiene los países enemigos completos que pueden ser atacados.
     */
    getAttackableEnemies(playerCountryId) {
        return this.countryManager.countries.filter(country => country.id !== playerCountryId && country.isActive);
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
} 