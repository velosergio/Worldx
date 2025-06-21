/**
 * Display de estadísticas para Worldx
 */
class StatsDisplay {
    constructor() {
        this.chart = null;
        this.initChart();
    }

    /**
     * Inicializa el gráfico de estadísticas
     */
    initChart() {
        const ctx = document.getElementById('stats-chart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Militar', 'Social', 'Cultura', 'Ciencia', 'Economía'],
                datasets: [{
                    label: 'Tu País',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Actualiza el gráfico con nuevas estadísticas
     */
    updateChart(stats) {
        if (!this.chart) return;

        const data = [
            stats.military || 0,
            stats.social || 0,
            stats.culture || 0,
            stats.science || 0,
            stats.economy || 0
        ];

        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    /**
     * Actualiza el display de estadísticas
     */
    updateDisplay(playerCountry) {
        if (!playerCountry) return;

        // Actualizar gráfico
        this.updateChart(playerCountry.stats);

        // Actualizar barras de progreso
        this.updateProgressBars(playerCountry.stats);

        // Actualizar información adicional
        this.updateAdditionalInfo(playerCountry);
    }

    /**
     * Actualiza las barras de progreso
     */
    updateProgressBars(stats) {
        Object.keys(stats).forEach(stat => {
            const progressBar = document.getElementById(`${stat}-progress`);
            if (progressBar) {
                const percentage = (stats[stat] / 10) * 100;
                progressBar.style.width = `${percentage}%`;
                
                // Cambiar color según el valor
                this.updateProgressColor(progressBar, stats[stat]);
            }
        });
    }

    /**
     * Actualiza el color de una barra de progreso
     */
    updateProgressColor(element, value) {
        if (value >= 8) {
            element.style.backgroundColor = '#4CAF50';
        } else if (value >= 5) {
            element.style.backgroundColor = '#8BC34A';
        } else if (value >= 3) {
            element.style.backgroundColor = '#FFC107';
        } else {
            element.style.backgroundColor = '#F44336';
        }
    }

    /**
     * Actualiza información adicional
     */
    updateAdditionalInfo(country) {
        // Calcular estadísticas derivadas
        const totalStrength = Object.values(country.stats).reduce((sum, stat) => sum + stat, 0);
        const averageStat = totalStrength / 5;
        const strongestStat = Object.keys(country.stats).reduce((a, b) => 
            country.stats[a] > country.stats[b] ? a : b
        );
        const weakestStat = Object.keys(country.stats).reduce((a, b) => 
            country.stats[a] < country.stats[b] ? a : b
        );

        // Actualizar elementos de información
        const totalElement = document.getElementById('total-strength');
        if (totalElement) {
            totalElement.textContent = totalStrength;
        }

        const averageElement = document.getElementById('average-stat');
        if (averageElement) {
            averageElement.textContent = averageStat.toFixed(1);
        }

        const strongestElement = document.getElementById('strongest-stat');
        if (strongestElement) {
            strongestElement.textContent = this.getStatDisplayName(strongestStat);
        }

        const weakestElement = document.getElementById('weakest-stat');
        if (weakestElement) {
            weakestElement.textContent = this.getStatDisplayName(weakestStat);
        }

        // Mostrar recomendaciones
        this.showRecommendations(country.stats, strongestStat, weakestStat);
    }

    /**
     * Muestra recomendaciones basadas en las estadísticas
     */
    showRecommendations(stats, strongestStat, weakestStat) {
        const recommendationsElement = document.getElementById('recommendations');
        if (!recommendationsElement) return;

        const recommendations = [];

        // Recomendaciones basadas en estadísticas débiles
        if (stats[weakestStat] <= 2) {
            recommendations.push(`Prioriza el desarrollo ${this.getStatDisplayName(weakestStat)} para evitar desequilibrios.`);
        }

        // Recomendaciones basadas en sinergias
        if (stats.military >= 6 && stats.economy <= 3) {
            recommendations.push('Considera invertir en economía para sostener tu poder militar.');
        }

        if (stats.science >= 6 && stats.culture <= 3) {
            recommendations.push('Desarrolla la cultura para inspirar innovación científica.');
        }

        if (stats.social >= 6 && stats.economy <= 3) {
            recommendations.push('Mejora la economía para mantener la estabilidad social.');
        }

        // Recomendaciones generales
        if (recommendations.length === 0) {
            if (stats[strongestStat] >= 8) {
                recommendations.push('Tu país está bien desarrollado. Considera equilibrar las estadísticas.');
            } else {
                recommendations.push('Continúa desarrollando tus fortalezas mientras mantienes el equilibrio.');
            }
        }

        recommendationsElement.innerHTML = recommendations.map(rec => `<p>• ${rec}</p>`).join('');
    }

    /**
     * Obtiene el nombre de visualización de una estadística
     */
    getStatDisplayName(stat) {
        const names = {
            'military': 'Militar',
            'social': 'Social',
            'culture': 'Cultural',
            'science': 'Científico',
            'economy': 'Económico'
        };
        
        return names[stat] || stat;
    }

    /**
     * Muestra una comparación con otros países
     */
    showComparison(playerStats, otherCountries) {
        if (!this.chart || otherCountries.length === 0) return;

        // Limpiar datasets existentes
        this.chart.data.datasets = [];

        // Añadir dataset del jugador
        this.chart.data.datasets.push({
            label: 'Tu País',
            data: [
                playerStats.military || 0,
                playerStats.social || 0,
                playerStats.culture || 0,
                playerStats.science || 0,
                playerStats.economy || 0
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        });

        // Añadir datasets de otros países
        const colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 205, 86, 0.2)'
        ];

        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 205, 86, 1)'
        ];

        otherCountries.forEach((country, index) => {
            this.chart.data.datasets.push({
                label: country.name,
                data: [
                    country.stats.military || 0,
                    country.stats.social || 0,
                    country.stats.culture || 0,
                    country.stats.science || 0,
                    country.stats.economy || 0
                ],
                backgroundColor: colors[index % colors.length],
                borderColor: borderColors[index % borderColors.length],
                borderWidth: 2
            });
        });

        this.chart.update();
    }

    /**
     * Destruye el gráfico
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
} 