/**
 * Módulo para gestionar la interfaz del Ministerio de Guerra
 */
class UIWarMinistry {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
    }

    /**
     * Aumenta el ejército del país del jugador
     */
    increaseArmy() {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.increaseArmy(playerCountry.id);
        
        if (success) {
            this.uiManager.updateDisplay();
            this.game.showNotification('Ejército aumentado exitosamente');
        } else {
            const cost = this.game.countryManager.getArmyIncreaseCostObject(playerCountry);
            const costText = this.formatArmyCost(cost).replace('Costo:', 'Requiere:');
            this.game.showNotification(`No se puede aumentar el ejército. ${costText}`);
        }
    }

    /**
     * Entrena el ejército del país del jugador
     */
    trainArmy() {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const success = this.game.countryManager.trainArmy(playerCountry.id);
        
        if (success) {
            this.uiManager.updateDisplay();
            this.game.showNotification('Ejército entrenado exitosamente');
        } else {
            const cost = this.game.countryManager.getArmyTrainingCostObject(playerCountry);
            const costText = this.formatArmyCost(cost).replace('Costo:', 'Requiere:');
            this.game.showNotification(`No se puede entrenar el ejército. ${costText}`);
        }
    }

    /**
     * Actualiza el panel del Ministerio de Guerra
     */
    updatePanel() {
        const playerCountry = this.game.countryManager.getPlayerCountry();
        if (!playerCountry) return;

        // Actualizar información del ejército
        const armyInfo = this.game.countryManager.getArmyInfo(playerCountry);
        
        // Corregir IDs para que coincidan con el HTML
        const armySizeElement = document.getElementById('army-current');
        const armyExperienceElement = document.getElementById('army-experience');
        const armyPowerElement = document.getElementById('military-power');
        const totalPowerElement = document.getElementById('total-power');
        
        // Verificar que los elementos existen antes de actualizarlos
        if (armySizeElement) armySizeElement.textContent = armyInfo.current;
        if (armyExperienceElement) armyExperienceElement.textContent = armyInfo.experience;
        if (armyPowerElement) armyPowerElement.textContent = armyInfo.militaryPower;
        if (totalPowerElement) totalPowerElement.textContent = armyInfo.totalPower;

        // Actualizar barra de progreso del ejército
        const armyFillElement = document.getElementById('army-fill');
        if (armyFillElement) {
            const percentage = armyInfo.max > 0 ? (armyInfo.current / armyInfo.max) * 100 : 0;
            armyFillElement.style.width = `${percentage}%`;
        }

        // Actualizar costos del ejército
        this.updateArmyCosts(playerCountry);

        // Actualizar sinergias militares
        this.updateMilitarySynergies(playerCountry);
    }

    /**
     * Actualiza los costos del ejército en la interfaz
     */
    updateArmyCosts(playerCountry) {
        const increaseCostObj = this.game.countryManager.getArmyIncreaseCostObject(playerCountry);
        const trainCostObj = this.game.countryManager.getArmyTrainingCostObject(playerCountry);
        
        // Actualizar costo de aumentar ejército
        const increaseCostElement = document.getElementById('increase-army-cost');
        if (increaseCostElement) {
            const costText = this.formatArmyCost(increaseCostObj);
            increaseCostElement.textContent = costText;
        }
        
        // Actualizar costo de entrenar ejército
        const trainCostElement = document.getElementById('train-army-cost');
        if (trainCostElement) {
            const costText = this.formatArmyCost(trainCostObj);
            trainCostElement.textContent = costText;
        }
    }

    /**
     * Formatea el costo del ejército para mostrar en la interfaz
     */
    formatArmyCost(costObj) {
        let costText = `Costo: $${costObj.money}`;
        
        const statCosts = [];
        if (costObj.stats.military) statCosts.push(`Militar -${costObj.stats.military}`);
        if (costObj.stats.social) statCosts.push(`Social -${costObj.stats.social}`);
        if (costObj.stats.economy) statCosts.push(`Economía -${costObj.stats.economy}`);
        if (costObj.stats.science) statCosts.push(`Ciencia -${costObj.stats.science}`);
        if (costObj.stats.culture) statCosts.push(`Cultura -${costObj.stats.culture}`);
        
        if (statCosts.length > 0) {
            costText += `, ${statCosts.join(', ')}`;
        }
        
        return costText;
    }

    /**
     * Actualiza las sinergias militares en la interfaz
     */
    updateMilitarySynergies(playerCountry) {
        const synergyInfo = this.game.countryManager.economicMinistry.getMilitarySynergyInfo(playerCountry);
        
        // Buscar o crear el contenedor de sinergias
        let synergyContainer = document.querySelector('.military-synergies');
        if (!synergyContainer) {
            const warPanel = document.querySelector('.war-ministry-panel');
            if (warPanel) {
                synergyContainer = document.createElement('div');
                synergyContainer.className = 'military-synergies';
                synergyContainer.innerHTML = '<h4>⚔️ Sinergias Militares</h4><div class="synergies-list"></div>';
                warPanel.appendChild(synergyContainer);
            }
        }

        if (!synergyContainer) return;

        const synergiesList = synergyContainer.querySelector('.synergies-list');
        synergiesList.innerHTML = '';

        // Mostrar bonificaciones activas
        if (synergyInfo.bonuses) {
            const activeBonuses = this.getActiveMilitaryBonuses(synergyInfo.bonuses);
            if (activeBonuses.length > 0) {
                const bonusesDiv = document.createElement('div');
                bonusesDiv.className = 'active-bonuses';
                bonusesDiv.innerHTML = '<h5>Bonificaciones Activas:</h5>';
                
                activeBonuses.forEach(bonus => {
                    const bonusDiv = document.createElement('div');
                    bonusDiv.className = 'bonus-item';
                    bonusDiv.innerHTML = `
                        <span class="bonus-name">${bonus.name}</span>
                        <span class="bonus-value">${bonus.value}</span>
                    `;
                    bonusesDiv.appendChild(bonusDiv);
                });
                
                synergiesList.appendChild(bonusesDiv);
            }
        }

        // Mostrar sinergias disponibles
        if (synergyInfo.synergies && synergyInfo.synergies.length > 0) {
            const synergiesDiv = document.createElement('div');
            synergiesDiv.className = 'available-synergies';
            synergiesDiv.innerHTML = '<h5>Sinergias Disponibles:</h5>';
            
            synergyInfo.synergies.forEach(synergy => {
                const synergyDiv = document.createElement('div');
                synergyDiv.className = 'synergy-item';
                synergyDiv.innerHTML = `
                    <div class="synergy-header">
                        <span class="synergy-name">${synergy.name}</span>
                        <span class="synergy-type">${this.getSynergyTypeIcon(synergy.type)}</span>
                    </div>
                    <div class="synergy-description">${synergy.description}</div>
                    <div class="synergy-bonus">${synergy.bonus}</div>
                `;
                synergiesDiv.appendChild(synergyDiv);
            });
            
            synergiesList.appendChild(synergiesDiv);
        }

        // Mostrar mensaje si no hay sinergias
        if ((!synergyInfo.bonuses || Object.values(synergyInfo.bonuses).every(b => b === 0)) && 
            (!synergyInfo.synergies || synergyInfo.synergies.length === 0)) {
            synergiesList.innerHTML = `
                <div class="no-synergies">
                    <p>No hay sinergias militares activas.</p>
                    <p>Construye industrias e infraestructura para desbloquear bonificaciones militares.</p>
                </div>
            `;
        }
    }

    /**
     * Obtiene las bonificaciones militares activas
     */
    getActiveMilitaryBonuses(bonuses) {
        const activeBonuses = [];
        
        if (bonuses.armySizeBonus > 0) {
            activeBonuses.push({
                name: 'Tamaño del Ejército',
                value: `+${(bonuses.armySizeBonus * 100).toFixed(0)}%`
            });
        }
        
        if (bonuses.armyExperienceBonus > 0) {
            activeBonuses.push({
                name: 'Experiencia del Ejército',
                value: `+${(bonuses.armyExperienceBonus * 100).toFixed(0)}%`
            });
        }
        
        if (bonuses.armyMaintenanceReduction > 0) {
            activeBonuses.push({
                name: 'Reducción de Mantenimiento',
                value: `-${(bonuses.armyMaintenanceReduction * 100).toFixed(0)}%`
            });
        }
        
        if (bonuses.attackBonus > 0) {
            activeBonuses.push({
                name: 'Bonus de Ataque',
                value: `+${(bonuses.attackBonus * 100).toFixed(0)}%`
            });
        }
        
        if (bonuses.defenseBonus > 0) {
            activeBonuses.push({
                name: 'Bonus de Defensa',
                value: `+${(bonuses.defenseBonus * 100).toFixed(0)}%`
            });
        }
        
        if (bonuses.recruitmentBonus > 0) {
            activeBonuses.push({
                name: 'Bonus de Reclutamiento',
                value: `+${(bonuses.recruitmentBonus * 100).toFixed(0)}%`
            });
        }
        
        return activeBonuses;
    }

    /**
     * Obtiene el icono para el tipo de sinergia
     */
    getSynergyTypeIcon(type) {
        const icons = {
            'logistics': '🚛',
            'research': '🔬',
            'supply': '🚢',
            'health': '🏥',
            'complete': '⭐'
        };
        
        return icons[type] || '⚔️';
    }

    /**
     * Muestra el modal de ataque
     */
    showAttackModal() {
        const modal = document.getElementById('battle-modal');
        const modalTitle = document.getElementById('battle-modal-title');
        const modalBody = document.getElementById('battle-modal-body');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = 'Lanzar Ataque';

        const otherCountries = this.game.getAttackableEnemies();
        if (otherCountries.length === 0) {
            modalBody.innerHTML = '<p>No hay otras naciones que atacar.</p>';
            modal.classList.remove('hidden');
            return;
        }

        let enemyListHtml = '<div class="battle-enemy-list">';
        otherCountries.forEach(country => {
            const armyInfo = this.game.countryManager.getArmyInfo(country);
            enemyListHtml += `
                <div class="battle-enemy-item">
                    <div class="battle-enemy-info">
                        <h4>${country.name}</h4>
                        <div class="battle-enemy-intel">
                            <p>Población: <span>${MathUtils.format(country.population)}</span></p>
                            <p>Poder: <span>${MathUtils.format(armyInfo.totalPower)}</span></p>
                            <p>Ejército: <span>${MathUtils.format(armyInfo.current)}</span></p>
                        </div>
                    </div>
                    <button class="battle-attack-btn" data-id="${country.id}">Atacar</button>
                </div>
            `;
        });
        enemyListHtml += '</div>';

        modalBody.innerHTML = enemyListHtml;

        // Añadir event listeners a los nuevos botones de atacar
        modalBody.querySelectorAll('.battle-attack-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const defenderId = e.target.dataset.id;
                this.startBattle(defenderId);
            });
        });

        modal.classList.remove('hidden');
    }

    /**
     * Oculta el modal de batalla y actualiza la UI
     */
    hideBattleModal() {
        const battleModal = document.getElementById('battle-modal');
        if (battleModal) {
            battleModal.classList.add('hidden');
        }
        this.uiManager.updateDisplay(); // Forzar actualización de la UI
    }

    /**
     * Inicia una batalla
     */
    startBattle(defenderId) {
        const playerCountry = this.game.getPlayerCountry();
        if (!playerCountry) return;

        const battleReport = this.game.countryManager.simulateBattle(playerCountry.id, defenderId);

        console.log('--- Reporte de Combate (Jugador) ---', battleReport);

        this.showBattleResults(battleReport);
    }

    /**
     * Muestra los resultados de la batalla
     */
    showBattleResults(report) {
        const modalTitle = document.getElementById('battle-modal-title');
        const modalBody = document.getElementById('battle-modal-body');

        modalTitle.textContent = 'Reporte de Batalla';

        let resultClass;
        switch (report.result) {
            case 'Victoria': resultClass = 'victory'; break;
            case 'Derrota': resultClass = 'defeat'; break;
            case 'Empate': resultClass = 'draw'; break;
        }

        let resultsHtml = `
            <div class="battle-result-view">
                <h3 class="battle-result-title ${resultClass}">${report.result}</h3>
                <div class="casualties-container">
                    <div class="casualty-box">
                        <h4>${report.attacker.name}</h4>
                        <p>Fuerza de Combate: <span>${MathUtils.format(report.attacker.combatStrength)}</span></p>
                        <p class="casualties">Bajas: <span>${MathUtils.format(report.attacker.casualties)}</span></p>
                    </div>
                    <div class="casualty-box">
                        <h4>${report.defender.name}</h4>
                        <p>Fuerza de Combate: <span>${MathUtils.format(report.defender.combatStrength)}</span></p>
                        <p class="casualties">Bajas: <span>${MathUtils.format(report.defender.casualties)}</span></p>
                    </div>
                </div>
                <div id="battle-options-container">
                    <!-- Aquí se cargarán las opciones post-batalla -->
                </div>
            </div>
        `;
        modalBody.innerHTML = resultsHtml;

        // Cargar las opciones correspondientes
        this.loadPostBattleOptions(report);
    }

    /**
     * Carga las opciones post-batalla
     */
    loadPostBattleOptions(report) {
        const optionsContainer = document.getElementById('battle-options-container');
        let optionsHtml = '';

        switch (report.result) {
            case 'Victoria':
                const defender = this.game.countryManager.getCountryById(report.defender.id);
                const canConquer = defender && defender.army <= 0;
                
                optionsHtml = `
                    <div class="battle-options-view">
                        <h3>Has ganado la batalla. ¿Qué harás ahora?</h3>
                        <div class="battle-options-list">
                            <div class="battle-option-item">
                                <button id="pillage-btn" class="control-btn">Saquear</button>
                                <p class="option-description">Roba el 75% del dinero del enemigo sin causar daños a largo plazo. Una opción rápida para obtener ganancias.</p>
                            </div>
                            <div class="battle-option-item">
                                <button id="raze-btn" class="control-btn">Arrasar</button>
                                <p class="option-description">Destruye la infraestructura enemiga para robar el 25% de sus puntos de desarrollo. La nación quedará devastada.</p>
                            </div>
                            <div class="battle-option-item">
                                <button id="conquer-btn" class="control-btn" ${!canConquer ? 'disabled' : ''} title="${!canConquer ? 'El ejército enemigo debe ser aniquilado para conquistar.' : 'Anexa la nación enemiga, absorbiendo su población y el 10% de su desarrollo.'}">Conquistar</button>
                                <p class="option-description">Anexa la nación enemiga, absorbiendo su población y el 10% de su desarrollo. Requiere que su ejército esté completamente aniquilado.</p>
                            </div>
                        </div>
                    </div>
                `;
                optionsContainer.innerHTML = optionsHtml;

                // Usar una función manejadora para asegurar el contexto de 'this'
                document.getElementById('pillage-btn').addEventListener('click', () => this.handlePostBattleAction('pillage', report));
                document.getElementById('raze-btn').addEventListener('click', () => this.handlePostBattleAction('raze', report));
                if (canConquer) {
                    document.getElementById('conquer-btn').addEventListener('click', () => this.handlePostBattleAction('conquer', report));
                }
                break;

            case 'Derrota':
                // Por ahora, la IA siempre arrasará al jugador
                this.game.countryManager.razeCountry(report.defender.id, report.attacker.id);
                optionsHtml = `
                    <h3>Has sido derrotado.</h3>
                    <p>La nación de ${report.defender.name} ha decidido arrasar tus tierras como castigo.</p>
                    <button id="continue-battle-btn" class="control-btn">Continuar</button>
                `;
                optionsContainer.innerHTML = optionsHtml;

                document.getElementById('continue-battle-btn').addEventListener('click', () => this.handlePostBattleAction('continue', report));
                break;
            
            case 'Empate':
            default:
                optionsHtml = `
                    <h3>La batalla ha terminado en un punto muerto.</h3>
                    <p>Ambos ejércitos se retiran para lamer sus heridas.</p>
                    <button id="continue-battle-btn" class="control-btn">Continuar</button>
                `;
                optionsContainer.innerHTML = optionsHtml;

                document.getElementById('continue-battle-btn').addEventListener('click', () => this.handlePostBattleAction('continue', report));
                break;
        }
    }

    /**
     * Maneja las acciones del jugador después de la batalla (saquear, arrasar, etc.)
     */
    handlePostBattleAction(action, report) {
        const attackerId = report.attacker.id;
        const defenderId = report.defender.id;
        const defenderName = report.defender.name;

        switch (action) {
            case 'pillage':
                const lootAmount = this.game.countryManager.lootCountry(attackerId, defenderId);
                this.game.showNotification(`Has saqueado a ${defenderName} y has obtenido $${MathUtils.format(lootAmount)} de oro.`);
                break;
            case 'raze':
                this.game.countryManager.razeCountry(attackerId, defenderId);
                this.game.showNotification(`${defenderName} ha sido arrasado. Has obtenido puntos de desarrollo.`);
                break;
            case 'conquer':
                this.game.countryManager.conquerCountry(attackerId, defenderId);
                this.game.showNotification(`${defenderName} ha sido conquistado y anexado a tu nación.`);
                break;
            case 'continue':
                // No se necesita acción, solo cerrar el modal
                break;
        }
        
        // Ocultar el modal y actualizar la UI, que es lo importante
        this.hideBattleModal();
    }
} 