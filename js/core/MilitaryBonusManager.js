/**
 * Gestor de Bonificaciones Militares
 * Maneja todas las bonificaciones militares y sinergias relacionadas con la economía
 */
class MilitaryBonusManager {
    constructor() {
        this.ministryName = "Gestor de Bonificaciones Militares";
        this.version = "1.0.0";
    }

    /**
     * Calcula las bonificaciones militares basadas en la economía
     * @param {Object} country - País
     * @returns {Object} Bonificaciones militares
     */
    calculateMilitaryBonuses(country) {
        const bonuses = {
            armySizeBonus: 0,
            armyExperienceBonus: 0,
            armyMaintenanceReduction: 0,
            attackBonus: 0,
            defenseBonus: 0,
            recruitmentBonus: 0
        };

        if (!country.economicData) return bonuses;

        // Bonificaciones por industrias
        const industries = country.economicData.industries;
        
        // Industria Militar: Mejora el ejército
        if (industries.military > 0) {
            bonuses.armySizeBonus += industries.military * 0.05; // +5% por nivel
            bonuses.armyExperienceBonus += industries.military * 0.1; // +10% experiencia por nivel
            bonuses.attackBonus += industries.military * 0.02; // +2% ataque por nivel
        }

        // Industria Tecnológica: Mejora la eficiencia militar
        if (industries.tech > 0) {
            bonuses.armyMaintenanceReduction += industries.tech * 0.03; // -3% mantenimiento por nivel
            bonuses.defenseBonus += industries.tech * 0.015; // +1.5% defensa por nivel
            bonuses.recruitmentBonus += industries.tech * 0.05; // +5% reclutamiento por nivel
        }

        // Industria Básica: Proporciona recursos para el ejército
        if (industries.basic > 0) {
            bonuses.armyMaintenanceReduction += industries.basic * 0.02; // -2% mantenimiento por nivel
            bonuses.recruitmentBonus += industries.basic * 0.03; // +3% reclutamiento por nivel
        }

        // Bonificaciones por infraestructura
        const infrastructure = country.economicData.infrastructure;
        
        // Carreteras: Mejora la movilidad militar
        if (infrastructure.roads > 0) {
            bonuses.attackBonus += 0.05; // +5% ataque
            bonuses.defenseBonus += 0.03; // +3% defensa
        }

        // Puertos: Mejora la logística naval
        if (infrastructure.ports > 0) {
            bonuses.armySizeBonus += 0.03; // +3% tamaño del ejército
            bonuses.recruitmentBonus += 0.04; // +4% reclutamiento
        }

        // Universidades: Mejora la estrategia militar
        if (infrastructure.universities > 0) {
            bonuses.armyExperienceBonus += 0.15; // +15% experiencia
            bonuses.attackBonus += 0.02; // +2% ataque
            bonuses.defenseBonus += 0.02; // +2% defensa
        }

        // Hospitales: Reduce las bajas
        if (infrastructure.hospitals > 0) {
            bonuses.defenseBonus += 0.04; // +4% defensa
            bonuses.armyMaintenanceReduction += 0.02; // -2% mantenimiento
        }

        // Bancos: Mejora la financiación militar
        if (infrastructure.banks > 0) {
            bonuses.armyMaintenanceReduction += 0.05; // -5% mantenimiento
            bonuses.recruitmentBonus += 0.06; // +6% reclutamiento
        }

        // Bonificaciones por inversiones
        const investments = country.economicData.investments;
        
        // Bonos del Estado: Proporcionan estabilidad militar
        if (investments.bonds.count > 0) {
            bonuses.defenseBonus += investments.bonds.count * 0.01; // +1% defensa por bono
            bonuses.armyMaintenanceReduction += investments.bonds.count * 0.005; // -0.5% mantenimiento por bono
        }

        // Fondos de Desarrollo: Mejoran la capacidad de reclutamiento
        if (investments.developmentFund.count > 0) {
            bonuses.recruitmentBonus += investments.developmentFund.count * 0.02; // +2% reclutamiento por fondo
            bonuses.armyExperienceBonus += investments.developmentFund.count * 0.05; // +5% experiencia por fondo
        }

        // Reservas de Emergencia: Proporcionan protección en crisis
        if (investments.emergencyReserves.count > 0) {
            bonuses.defenseBonus += investments.emergencyReserves.count * 0.015; // +1.5% defensa por reserva
            bonuses.armyMaintenanceReduction += investments.emergencyReserves.count * 0.01; // -1% mantenimiento por reserva
        }

        // Sinergias especiales
        this.calculateMilitarySynergies(country, bonuses);

        return bonuses;
    }

    /**
     * Calcula sinergias especiales entre economía y guerra
     * @param {Object} country - País
     * @param {Object} bonuses - Bonificaciones a modificar
     */
    calculateMilitarySynergies(country, bonuses) {
        if (!country.economicData) return;

        const industries = country.economicData.industries;
        const infrastructure = country.economicData.infrastructure;

        // Sinergia: Industria Militar + Carreteras = Logística Avanzada
        if (industries.military > 0 && infrastructure.roads > 0) {
            bonuses.attackBonus += 0.03; // +3% ataque adicional
            bonuses.armySizeBonus += 0.02; // +2% tamaño adicional
        }

        // Sinergia: Industria Tecnológica + Universidades = Investigación Militar
        if (industries.tech > 0 && infrastructure.universities > 0) {
            bonuses.armyExperienceBonus += 0.1; // +10% experiencia adicional
            bonuses.defenseBonus += 0.02; // +2% defensa adicional
        }

        // Sinergia: Industria Básica + Puertos = Suministros Navales
        if (industries.basic > 0 && infrastructure.ports > 0) {
            bonuses.armyMaintenanceReduction += 0.02; // -2% mantenimiento adicional
            bonuses.recruitmentBonus += 0.03; // +3% reclutamiento adicional
        }

        // Sinergia: Hospitales + Bancos = Sistema de Salud Militar
        if (infrastructure.hospitals > 0 && infrastructure.banks > 0) {
            bonuses.defenseBonus += 0.03; // +3% defensa adicional
            bonuses.armyMaintenanceReduction += 0.02; // -2% mantenimiento adicional
        }

        // Sinergia Completa: Todas las infraestructuras = Poder Militar Total
        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        if (builtInfrastructure === 5) {
            bonuses.attackBonus += 0.05; // +5% ataque
            bonuses.defenseBonus += 0.05; // +5% defensa
            bonuses.armySizeBonus += 0.03; // +3% tamaño
            bonuses.armyExperienceBonus += 0.1; // +10% experiencia
            bonuses.recruitmentBonus += 0.05; // +5% reclutamiento
            bonuses.armyMaintenanceReduction += 0.03; // -3% mantenimiento
        }
    }

    /**
     * Aplica las bonificaciones militares a un país
     * @param {Object} country - País
     */
    applyMilitaryBonuses(country) {
        const bonuses = this.calculateMilitaryBonuses(country);
        
        // Aplicar bonificaciones al país
        country.militaryBonuses = bonuses;
        
        // Calcular ejército máximo con bonificaciones
        const baseMaxArmy = Math.floor(country.population * 0.4);
        const sizeBonus = 1 + bonuses.armySizeBonus;
        country.maxArmySize = Math.floor(baseMaxArmy * sizeBonus);
        
        // Aplicar reducción de mantenimiento
        const maintenanceReduction = 1 - bonuses.armyMaintenanceReduction;
        country.armyMaintenanceMultiplier = Math.max(0.5, maintenanceReduction); // Mínimo 50% del costo original
        
        // Aplicar bonificaciones de experiencia
        country.armyExperienceBonus = bonuses.armyExperienceBonus;
        
        // Aplicar bonificaciones de combate
        country.attackBonus = bonuses.attackBonus;
        country.defenseBonus = bonuses.defenseBonus;
        
        // Aplicar bonificación de reclutamiento
        country.recruitmentBonus = bonuses.recruitmentBonus;
    }

    /**
     * Obtiene información de las sinergias militares
     * @param {Object} country - País
     * @returns {Object} Información de sinergias
     */
    getMilitarySynergyInfo(country) {
        const bonuses = this.calculateMilitaryBonuses(country);
        const synergies = [];

        if (!country.economicData) return { bonuses, synergies };

        const industries = country.economicData.industries;
        const infrastructure = country.economicData.infrastructure;

        // Verificar sinergias disponibles
        if (industries.military > 0 && !infrastructure.roads) {
            synergies.push({
                type: 'logistics',
                name: 'Logística Avanzada',
                description: 'Construir carreteras con industria militar activa',
                bonus: '+3% ataque, +2% tamaño del ejército'
            });
        }

        if (industries.tech > 0 && !infrastructure.universities) {
            synergies.push({
                type: 'research',
                name: 'Investigación Militar',
                description: 'Construir universidades con industria tecnológica activa',
                bonus: '+10% experiencia, +2% defensa'
            });
        }

        if (industries.basic > 0 && !infrastructure.ports) {
            synergies.push({
                type: 'supply',
                name: 'Suministros Navales',
                description: 'Construir puertos con industria básica activa',
                bonus: '-2% mantenimiento, +3% reclutamiento'
            });
        }

        if (infrastructure.hospitals > 0 && !infrastructure.banks) {
            synergies.push({
                type: 'health',
                name: 'Sistema de Salud Militar',
                description: 'Construir bancos con hospitales activos',
                bonus: '+3% defensa, -2% mantenimiento'
            });
        }

        const builtInfrastructure = Object.values(infrastructure).filter(level => level > 0).length;
        if (builtInfrastructure === 4) {
            synergies.push({
                type: 'complete',
                name: 'Poder Militar Total',
                description: 'Construir la infraestructura faltante para sinergia completa',
                bonus: '+5% ataque/defensa, +3% tamaño, +10% experiencia, +5% reclutamiento, -3% mantenimiento'
            });
        }

        return { bonuses, synergies };
    }

    /**
     * Calcula el costo de mantenimiento militar con bonificaciones
     * @param {Object} country - País
     * @returns {number} Costo de mantenimiento ajustado
     */
    calculateAdjustedMilitaryMaintenance(country) {
        if (!country.armyMaintenanceMultiplier) {
            this.applyMilitaryBonuses(country);
        }
        
        const baseMaintenance = country.armyMaintenanceCost || 0;
        return Math.floor(baseMaintenance * country.armyMaintenanceMultiplier);
    }

    /**
     * Calcula el poder militar total con bonificaciones económicas
     * @param {Object} country - País
     * @returns {number} Poder militar total
     */
    calculateTotalMilitaryPower(country) {
        if (!country.militaryBonuses) {
            this.applyMilitaryBonuses(country);
        }

        const basePower = country.stats.military * country.armyExperience;
        const sizeBonus = 1 + (country.army / Math.max(1, country.population)) * 0.5;
        
        // Aplicar bonificaciones económicas
        const attackBonus = 1 + (country.attackBonus || 0);
        const defenseBonus = 1 + (country.defenseBonus || 0);
        
        return Math.floor(basePower * sizeBonus * attackBonus * defenseBonus);
    }

    /**
     * Obtiene información completa de bonificaciones militares
     * @param {Object} country - País
     * @returns {Object} Información completa de bonificaciones
     */
    getMilitaryBonusInfo(country) {
        const bonuses = this.calculateMilitaryBonuses(country);
        const synergyInfo = this.getMilitarySynergyInfo(country);
        
        return {
            bonuses: bonuses,
            synergies: synergyInfo.synergies,
            adjustedMaintenance: this.calculateAdjustedMilitaryMaintenance(country),
            totalMilitaryPower: this.calculateTotalMilitaryPower(country),
            maxArmySize: country.maxArmySize || Math.floor(country.population * 0.4),
            armyExperienceBonus: country.armyExperienceBonus || 0,
            attackBonus: country.attackBonus || 0,
            defenseBonus: country.defenseBonus || 0,
            recruitmentBonus: country.recruitmentBonus || 0
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MilitaryBonusManager;
} 