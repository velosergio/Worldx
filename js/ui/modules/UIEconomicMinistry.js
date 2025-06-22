/**
 * Módulo para gestionar la interfaz del Ministerio de Economía
 */
class UIEconomicMinistry {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Actualiza el display de economía en la barra superior
     */
    updateEconomyDisplay() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const economicInfo = this.game.countryManager.getAdvancedEconomicInfo(playerCountry.id);
        if (!economicInfo) return;

        const moneyElement = document.getElementById('player-money');
        const incomeElement = document.getElementById('player-income');

        if (moneyElement) {
            moneyElement.textContent = `$${Math.floor(playerCountry.money).toLocaleString()}`;
        }

        if (incomeElement) {
            const netIncome = economicInfo.totalIncome - (playerCountry.armyMaintenanceCost || 0);
            incomeElement.textContent = `(${netIncome >= 0 ? '+' : ''}${netIncome.toLocaleString()})`;
            incomeElement.style.color = netIncome >= 0 ? '#90EE90' : '#ff6b6b';
        }
    }

    /**
     * Actualiza toda la interfaz del Ministerio de Economía
     */
    updatePanel() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        const economicInfo = this.game.countryManager.getAdvancedEconomicInfo(playerCountry.id);
        const industryInfo = this.game.countryManager.getIndustryInfo(playerCountry.id);
        const infrastructureInfo = this.game.countryManager.getInfrastructureInfo(playerCountry.id);

        if (economicInfo) {
            this.updateEconomicIndicators(economicInfo);
            this.updateFinanceBreakdown(economicInfo);
        }

        this.updateIndustries(industryInfo);
        this.updateInfrastructure(infrastructureInfo);
        this.updateEconomicCosts(playerCountry);
    }

    /**
     * Actualiza el panel de desglose de finanzas
     */
    updateFinanceBreakdown(economicInfo) {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry || !economicInfo) return;

        const breakdownContainer = document.getElementById('finance-breakdown');
        if (!breakdownContainer) return;

        const baseIncome = playerCountry.income || 0;
        const industryBonus = economicInfo.industryBonus || 0;
        const infrastructureBonus = economicInfo.infrastructureBonus || 0;
        const investmentBonus = economicInfo.investmentBonus || 0;
        const grossIncome = baseIncome + industryBonus + infrastructureBonus + investmentBonus;

        const armyMaintenance = playerCountry.armyMaintenanceCost || 0;
        const netIncome = grossIncome - armyMaintenance;

        breakdownContainer.innerHTML = `
            <div class="breakdown-section">
                <h5>Ingresos</h5>
                <div class="breakdown-item">
                    <span class="breakdown-label">Ingreso Base (Población):</span>
                    <span class="breakdown-value positive">+$${baseIncome.toLocaleString()}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Bonificación de Industrias:</span>
                    <span class="breakdown-value positive">+$${industryBonus.toLocaleString()}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Bonificación de Infraestructura:</span>
                    <span class="breakdown-value positive">+$${infrastructureBonus.toLocaleString()}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Bonificación de Inversiones:</span>
                    <span class="breakdown-value positive">+$${investmentBonus.toLocaleString()}</span>
                </div>
                <div class="breakdown-item total">
                    <span class="breakdown-label">Ingreso Bruto:</span>
                    <span class="breakdown-value">$${grossIncome.toLocaleString()}</span>
                </div>
            </div>
            <div class="breakdown-section">
                <h5>Gastos</h5>
                <div class="breakdown-item">
                    <span class="breakdown-label">Mantenimiento del Ejército:</span>
                    <span class="breakdown-value negative">-$${armyMaintenance.toLocaleString()}</span>
                </div>
            </div>
            <div class="breakdown-section">
                <div class="breakdown-item total">
                    <span class="breakdown-label">Ingreso Neto:</span>
                    <span class="breakdown-value ${netIncome >= 0 ? 'positive' : 'negative'}">${netIncome >= 0 ? '+' : ''}$${netIncome.toLocaleString()}</span>
                </div>
            </div>
        `;
    }

    /**
     * Actualiza los indicadores económicos
     */
    updateEconomicIndicators(economicInfo) {
        const gdpElement = document.getElementById('gdp-value');
        const growthElement = document.getElementById('growth-rate');
        const efficiencyElement = document.getElementById('efficiency-value');
        const stabilityElement = document.getElementById('stability-value');

        if (gdpElement) gdpElement.textContent = MathUtils.format(economicInfo.gdp);
        if (growthElement) growthElement.textContent = economicInfo.growthRate;
        if (efficiencyElement) efficiencyElement.textContent = economicInfo.efficiency;
        if (stabilityElement) stabilityElement.textContent = economicInfo.stability;
    }

    /**
     * Actualiza la información de industrias
     */
    updateIndustries(industryInfo) {
        if (!industryInfo) return;

        const industries = industryInfo.industries;
        
        // Actualizar niveles de industrias
        Object.keys(industries).forEach(industryType => {
            const levelElement = document.getElementById(`${industryType}-industry-level`);
            if (levelElement) {
                levelElement.textContent = industries[industryType];
            }
        });
    }

    /**
     * Actualiza la información de infraestructura
     */
    updateInfrastructure(infrastructureInfo) {
        if (!infrastructureInfo) return;

        const infrastructure = infrastructureInfo.infrastructure;
        
        // Actualizar estado de infraestructura
        Object.keys(infrastructure).forEach(infraType => {
            const statusElement = document.getElementById(`${infraType}-status`);
            if (statusElement) {
                if (infrastructure[infraType] > 0) {
                    statusElement.textContent = 'Construida';
                    statusElement.classList.add('built');
                } else {
                    statusElement.textContent = 'No construida';
                    statusElement.classList.remove('built');
                }
            }
        });
    }

    /**
     * Actualiza los costos y disponibilidad de acciones económicas
     */
    updateEconomicCosts(playerCountry) {
        // Actualizar costos de industrias
        const industryTypes = ['basic', 'advanced', 'cultural', 'military', 'tech'];
        industryTypes.forEach(type => {
            const costElement = document.getElementById(`${type}-industry-cost`);
            const benefitElement = document.getElementById(`${type}-industry-benefit`);
            const button = document.getElementById(`build-${type}-industry`);
            
            if (costElement && button && benefitElement) {
                const cost = this.game.countryManager.getIndustryCost(playerCountry.id, type);
                const canBuild = this.game.countryManager.canBuildIndustry(playerCountry.id, type);
                const description = this.game.countryManager.getIndustryDescription(type);
                
                if (cost) {
                    const costText = this.formatCost(cost);
                    costElement.textContent = `Costo: ${costText}`;
                }
                
                benefitElement.textContent = description;
                button.disabled = !canBuild;
            }
        });

        // Actualizar costos de infraestructura
        const infrastructureTypes = ['roads', 'ports', 'universities', 'hospitals', 'banks'];
        infrastructureTypes.forEach(type => {
            const costElement = document.getElementById(`${type}-cost`);
            const benefitElement = document.getElementById(`${type}-benefit`);
            const button = document.getElementById(`build-${type}`);
            
            if (costElement && button && benefitElement) {
                const cost = this.game.countryManager.getInfrastructureCost(playerCountry.id, type);
                const canBuild = this.game.countryManager.canBuildInfrastructure(playerCountry.id, type);
                const description = this.game.countryManager.getInfrastructureDescription(type);
                
                if (cost) {
                    const costText = this.formatCost(cost);
                    costElement.textContent = `Costo: ${costText}`;
                }
                
                benefitElement.textContent = description;
                button.disabled = !canBuild;
            }
        });
    }

    /**
     * Formatea un costo para mostrar en la UI
     */
    formatCost(cost) {
        const parts = [];
        
        if (cost.money) {
            parts.push(`$${MathUtils.format(cost.money)}`);
        }
        
        Object.keys(cost).forEach(key => {
            if (key !== 'money') {
                const statName = this.getStatDisplayName(key);
                parts.push(`${statName} -${cost[key]}`);
            }
        });
        
        return parts.join(', ');
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
            'economy': 'Economía'
        };
        return names[stat] || stat;
    }

    /**
     * Obtiene el nombre de visualización de una industria
     */
    getIndustryDisplayName(industryType) {
        const names = {
            'basic': 'Básica',
            'advanced': 'Avanzada',
            'cultural': 'Cultural',
            'military': 'Militar',
            'tech': 'Tecnológica'
        };
        return names[industryType] || industryType;
    }

    /**
     * Obtiene el nombre de visualización de infraestructura
     */
    getInfrastructureDisplayName(infrastructureType) {
        const names = {
            'roads': 'Carreteras',
            'ports': 'Puertos',
            'universities': 'Universidades',
            'hospitals': 'Hospitales',
            'banks': 'Bancos'
        };
        return names[infrastructureType] || infrastructureType;
    }

    /**
     * Construye o mejora una industria
     */
    buildIndustry(industryType) {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.buildIndustry(playerCountry.id, industryType);
        if (success) {
            this.uiManager.updateDisplay();
            this.uiManager.showNotification(`Industria ${this.getIndustryDisplayName(industryType)} construida/mejorada.`, 'success');
        } else {
            this.uiManager.showNotification(`No se pudo construir la industria ${this.getIndustryDisplayName(industryType)}.`, 'error');
        }
    }

    /**
     * Construye una infraestructura
     */
    buildInfrastructure(infrastructureType) {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.buildInfrastructure(playerCountry.id, infrastructureType);
        if (success) {
            this.uiManager.updateDisplay();
            this.uiManager.showNotification(`Infraestructura ${this.getInfrastructureDisplayName(infrastructureType)} construida.`, 'success');
        } else {
            this.uiManager.showNotification(`No se pudo construir la infraestructura ${this.getInfrastructureDisplayName(infrastructureType)}.`, 'error');
        }
    }
} 