/**
 * Eventos de Infraestructura para WorldX
 * Eventos que afectan las construcciones y desarrollo de infraestructura
 */

const INFRASTRUCTURE_EVENTS = {
    // EVENTOS POSITIVOS
    ROAD_NETWORK_EXPANSION: {
        id: 'road_network_expansion',
        name: 'Expansión de Red Vial',
        description: 'Un ambicioso proyecto de carreteras conecta las principales ciudades del país, mejorando el comercio y la movilidad.',
        type: 'INFRASTRUCTURE',
        rarity: 'COMMON',
        color: '#4CAF50',
        icon: '🛣️',
        conditions: {
            minWeeks: 15,
            minEconomy: 4,
            minSocial: 3
        },
        effects: {
            infrastructure: {
                roads: 1 // Construye carreteras automáticamente
            },
            temporary: {
                income: 0.15, // +15% ingresos por 8 semanas
                duration: 8
            }
        }
    },

    PORT_MODERNIZATION: {
        id: 'port_modernization',
        name: 'Modernización Portuaria',
        description: 'Los puertos del país son modernizados con tecnología de vanguardia, aumentando significativamente el comercio marítimo.',
        type: 'INFRASTRUCTURE',
        rarity: 'UNCOMMON',
        color: '#2196F3',
        icon: '🚢',
        conditions: {
            minWeeks: 25,
            minEconomy: 6,
            minScience: 4
        },
        effects: {
            infrastructure: {
                ports: 1 // Construye puertos automáticamente
            },
            temporary: {
                income: 0.20, // +20% ingresos por 10 semanas
                duration: 10
            }
        }
    },

    UNIVERSITY_BOOM: {
        id: 'university_boom',
        name: 'Boom Universitario',
        description: 'Una ola de construcción de universidades y centros de investigación transforma el país en un hub educativo.',
        type: 'INFRASTRUCTURE',
        rarity: 'UNCOMMON',
        color: '#9C27B0',
        icon: '🎓',
        conditions: {
            minWeeks: 30,
            minScience: 6,
            minCulture: 4
        },
        effects: {
            infrastructure: {
                universities: 1 // Construye universidades automáticamente
            },
            temporary: {
                science: 2, // +2 ciencia por 12 semanas
                duration: 12
            }
        }
    },

    HEALTHCARE_REVOLUTION: {
        id: 'healthcare_revolution',
        name: 'Revolución Sanitaria',
        description: 'Un programa masivo de construcción de hospitales y clínicas modernas mejora dramáticamente la salud pública.',
        type: 'INFRASTRUCTURE',
        rarity: 'RARE',
        color: '#F44336',
        icon: '🏥',
        conditions: {
            minWeeks: 35,
            minSocial: 7,
            minScience: 5
        },
        effects: {
            infrastructure: {
                hospitals: 1 // Construye hospitales automáticamente
            },
            temporary: {
                social: 2, // +2 social por 15 semanas
                population: 0.10, // +10% población por 15 semanas
                duration: 15
            }
        }
    },

    FINANCIAL_DISTRICT: {
        id: 'financial_district',
        name: 'Distrito Financiero',
        description: 'Un moderno distrito financiero con bancos de clase mundial atrae inversiones internacionales.',
        type: 'INFRASTRUCTURE',
        rarity: 'RARE',
        color: '#FF9800',
        icon: '🏦',
        conditions: {
            minWeeks: 40,
            minEconomy: 8,
            minSocial: 5
        },
        effects: {
            infrastructure: {
                banks: 1 // Construye bancos automáticamente
            },
            temporary: {
                income: 0.25, // +25% ingresos por 20 semanas
                efficiency: 1.2, // +20% eficiencia económica por 20 semanas
                duration: 20
            }
        }
    },

    INFRASTRUCTURE_SYNERGY: {
        id: 'infrastructure_synergy',
        name: 'Sinergia de Infraestructura',
        description: 'La combinación de diferentes tipos de infraestructura crea efectos sinérgicos que potencian el desarrollo nacional.',
        type: 'INFRASTRUCTURE',
        rarity: 'RARE',
        color: '#00BCD4',
        icon: '🔗',
        conditions: {
            minWeeks: 50,
            minInfrastructureCount: 3 // Requiere al menos 3 tipos de infraestructura
        },
        effects: {
            temporary: {
                income: 0.30, // +30% ingresos por 25 semanas
                efficiency: 1.3, // +30% eficiencia por 25 semanas
                stability: 1.2, // +20% estabilidad por 25 semanas
                duration: 25
            }
        }
    },

    // EVENTOS NEGATIVOS
    INFRASTRUCTURE_DECAY: {
        id: 'infrastructure_decay',
        name: 'Deterioro de Infraestructura',
        description: 'La falta de mantenimiento causa el deterioro de las construcciones existentes, reduciendo su efectividad.',
        type: 'INFRASTRUCTURE',
        rarity: 'COMMON',
        color: '#795548',
        icon: '🏚️',
        conditions: {
            minWeeks: 20,
            minInfrastructureCount: 1 // Requiere al menos 1 tipo de infraestructura
        },
        effects: {
            temporary: {
                income: -0.10, // -10% ingresos por 6 semanas
                efficiency: 0.9, // -10% eficiencia por 6 semanas
                duration: 6
            }
        }
    },

    NATURAL_DISASTER: {
        id: 'natural_disaster',
        name: 'Desastre Natural',
        description: 'Un desastre natural destruye parte de la infraestructura del país, causando pérdidas económicas significativas.',
        type: 'INFRASTRUCTURE',
        rarity: 'UNCOMMON',
        color: '#FF5722',
        icon: '🌪️',
        conditions: {
            minWeeks: 30,
            minInfrastructureCount: 2
        },
        effects: {
            infrastructure: {
                // Destruye aleatoriamente 1-2 tipos de infraestructura
                destroyRandom: [1, 2]
            },
            temporary: {
                income: -0.25, // -25% ingresos por 12 semanas
                stability: 0.8, // -20% estabilidad por 12 semanas
                duration: 12
            }
        }
    },

    CORRUPTION_SCANDAL: {
        id: 'corruption_scandal',
        name: 'Escándalo de Corrupción',
        description: 'Un escándalo de corrupción en proyectos de infraestructura daña la confianza pública y la economía.',
        type: 'INFRASTRUCTURE',
        rarity: 'UNCOMMON',
        color: '#607D8B',
        icon: '💰',
        conditions: {
            minWeeks: 25,
            minInfrastructureCount: 2,
            minSocial: 3
        },
        effects: {
            temporary: {
                income: -0.15, // -15% ingresos por 10 semanas
                social: -1, // -1 social por 10 semanas
                stability: 0.9, // -10% estabilidad por 10 semanas
                duration: 10
            }
        }
    },

    TECHNICAL_FAILURE: {
        id: 'technical_failure',
        name: 'Falla Técnica',
        description: 'Una falla técnica en sistemas críticos de infraestructura causa interrupciones temporales.',
        type: 'INFRASTRUCTURE',
        rarity: 'COMMON',
        color: '#9E9E9E',
        icon: '⚡',
        conditions: {
            minWeeks: 15,
            minInfrastructureCount: 1,
            minScience: 3
        },
        effects: {
            temporary: {
                income: -0.08, // -8% ingresos por 4 semanas
                efficiency: 0.95, // -5% eficiencia por 4 semanas
                duration: 4
            }
        }
    },

    BUDGET_CUTS: {
        id: 'budget_cuts',
        name: 'Recortes Presupuestarios',
        description: 'Recortes en el presupuesto de infraestructura limitan el mantenimiento y desarrollo de construcciones.',
        type: 'INFRASTRUCTURE',
        rarity: 'COMMON',
        color: '#FFC107',
        icon: '✂️',
        conditions: {
            minWeeks: 20,
            minInfrastructureCount: 1,
            maxEconomy: 6 // Solo si la economía no es muy alta
        },
        effects: {
            temporary: {
                income: -0.12, // -12% ingresos por 8 semanas
                efficiency: 0.9, // -10% eficiencia por 8 semanas
                duration: 8
            }
        }
    },

    INFRASTRUCTURE_OVERCAPACITY: {
        id: 'infrastructure_overcapacity',
        name: 'Sobrecapacidad de Infraestructura',
        description: 'La infraestructura construida excede la capacidad de mantenimiento, causando ineficiencias.',
        type: 'INFRASTRUCTURE',
        rarity: 'RARE',
        color: '#E91E63',
        icon: '📈',
        conditions: {
            minWeeks: 45,
            minInfrastructureCount: 4, // Mucha infraestructura
            maxSocial: 6 // Pero poca capacidad social
        },
        effects: {
            temporary: {
                income: -0.20, // -20% ingresos por 15 semanas
                efficiency: 0.8, // -20% eficiencia por 15 semanas
                stability: 0.9, // -10% estabilidad por 15 semanas
                duration: 15
            }
        }
    }
};

/**
 * Verifica si un país puede tener un evento de infraestructura específico
 * @param {Object} country - País a verificar
 * @param {Object} event - Evento a verificar
 * @returns {boolean} Si puede tener el evento
 */
function canHaveInfrastructureEvent(country, event) {
    const conditions = event.conditions;
    
    // Verificar tiempo mínimo
    if (conditions.minWeeks && country.weeks < conditions.minWeeks) {
        return false;
    }
    
    // Verificar estadísticas mínimas
    if (conditions.minEconomy && country.economy < conditions.minEconomy) {
        return false;
    }
    if (conditions.minSocial && country.social < conditions.minSocial) {
        return false;
    }
    if (conditions.minScience && country.science < conditions.minScience) {
        return false;
    }
    if (conditions.minCulture && country.culture < conditions.minCulture) {
        return false;
    }
    
    // Verificar estadísticas máximas
    if (conditions.maxEconomy && country.economy > conditions.maxEconomy) {
        return false;
    }
    if (conditions.maxSocial && country.social > conditions.maxSocial) {
        return false;
    }
    
    // Verificar cantidad de infraestructura
    if (conditions.minInfrastructureCount) {
        const infrastructureCount = Object.values(country.economicData.infrastructure)
            .filter(level => level > 0).length;
        if (infrastructureCount < conditions.minInfrastructureCount) {
            return false;
        }
    }
    
    return true;
}

/**
 * Aplica los efectos de un evento de infraestructura
 * @param {Object} country - País afectado
 * @param {Object} event - Evento a aplicar
 */
function applyInfrastructureEventEffects(country, event) {
    const effects = event.effects;
    
    // Efectos en infraestructura
    if (effects.infrastructure) {
        if (effects.infrastructure.destroyRandom) {
            // Destruir infraestructura aleatoria
            const [min, max] = effects.infrastructure.destroyRandom;
            const count = Math.floor(Math.random() * (max - min + 1)) + min;
            const infrastructureTypes = Object.keys(country.economicData.infrastructure);
            const builtInfrastructure = infrastructureTypes.filter(type => 
                country.economicData.infrastructure[type] > 0
            );
            
            for (let i = 0; i < count && builtInfrastructure.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * builtInfrastructure.length);
                const type = builtInfrastructure[randomIndex];
                country.economicData.infrastructure[type] = 0;
                builtInfrastructure.splice(randomIndex, 1);
            }
        } else {
            // Construir infraestructura específica
            Object.entries(effects.infrastructure).forEach(([type, level]) => {
                if (type !== 'destroyRandom') {
                    country.economicData.infrastructure[type] = level;
                }
            });
        }
    }
    
    // Efectos temporales se manejan en EventManager
}

/**
 * Obtiene todos los eventos de infraestructura disponibles para un país
 * @param {Object} country - País a verificar
 * @returns {Array} Lista de eventos disponibles
 */
function getAvailableInfrastructureEvents(country) {
    return Object.values(INFRASTRUCTURE_EVENTS).filter(event => 
        canHaveInfrastructureEvent(country, event)
    );
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INFRASTRUCTURE_EVENTS,
        canHaveInfrastructureEvent,
        applyInfrastructureEventEffects,
        getAvailableInfrastructureEvents
    };
} 