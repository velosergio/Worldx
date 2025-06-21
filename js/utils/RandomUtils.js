/**
 * Utilidades de generación aleatoria para el juego Worldx
 */
class RandomUtils {
    /**
     * Genera un número aleatorio entre min y max (inclusive)
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Número aleatorio
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Genera un número decimal aleatorio entre min y max
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Número decimal aleatorio
     */
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Selecciona un elemento aleatorio de un array
     * @param {Array} array - Array de elementos
     * @returns {*} Elemento aleatorio
     */
    static randomChoice(array) {
        if (array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Selecciona múltiples elementos aleatorios de un array
     * @param {Array} array - Array de elementos
     * @param {number} count - Número de elementos a seleccionar
     * @param {boolean} unique - Si los elementos deben ser únicos
     * @returns {Array} Array de elementos seleccionados
     */
    static randomChoices(array, count, unique = true) {
        if (array.length === 0) return [];
        
        if (unique) {
            const shuffled = [...array].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, array.length));
        } else {
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(this.randomChoice(array));
            }
            return result;
        }
    }

    /**
     * Baraja un array (algoritmo Fisher-Yates)
     * @param {Array} array - Array a barajar
     * @returns {Array} Array barajado
     */
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Genera un peso aleatorio basado en probabilidades
     * @param {Array} weights - Array de pesos/probabilidades
     * @returns {number} Índice seleccionado
     */
    static weightedRandom(weights) {
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * total;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return i;
            }
        }
        
        return weights.length - 1;
    }

    /**
     * Selecciona un elemento con peso de un array de objetos
     * @param {Array<Object>} items - Array de objetos, cada uno con una propiedad 'weight'
     * @returns {Object|null} Objeto seleccionado o null
     */
    static weightedChoice(items) {
        if (!items || items.length === 0) {
            return null;
        }

        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
        if (totalWeight <= 0) {
            // Si no hay pesos, elige uno al azar para evitar errores
            return this.randomChoice(items);
        }
        
        let random = Math.random() * totalWeight;

        for (const item of items) {
            if (item.weight) {
                random -= item.weight;
                if (random <= 0) {
                    return item;
                }
            }
        }
        
        return items[items.length - 1]; // Fallback por si acaso
    }

    /**
     * Genera un UUID simple
     * @returns {string} UUID
     */
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Genera un color aleatorio en formato hexadecimal
     * @returns {string} Color en formato #RRGGBB
     */
    static randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    /**
     * Genera un color aleatorio con transparencia
     * @param {number} alpha - Valor de transparencia (0-1)
     * @returns {string} Color en formato rgba
     */
    static randomColorRGBA(alpha = 1) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    /**
     * Genera un nombre aleatorio combinando prefijos y sufijos
     * @param {Array} prefixes - Array de prefijos
     * @param {Array} suffixes - Array de sufijos
     * @returns {string} Nombre generado
     */
    static generateName(prefixes, suffixes) {
        const prefix = this.randomChoice(prefixes);
        const suffix = this.randomChoice(suffixes);
        return prefix + suffix;
    }

    /**
     * Genera un texto aleatorio de longitud específica
     * @param {number} length - Longitud del texto
     * @param {string} charset - Caracteres disponibles
     * @returns {string} Texto aleatorio
     */
    static randomText(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    }

    /**
     * Genera un número que sigue una distribución normal (aproximada)
     * @param {number} mean - Media
     * @param {number} stdDev - Desviación estándar
     * @returns {number} Número con distribución normal
     */
    static normalRandom(mean = 0, stdDev = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + z * stdDev;
    }

    /**
     * Genera un número que sigue una distribución exponencial
     * @param {number} lambda - Parámetro de la distribución exponencial
     * @returns {number} Número con distribución exponencial
     */
    static exponentialRandom(lambda = 1) {
        return -Math.log(1 - Math.random()) / lambda;
    }

    /**
     * Genera un punto aleatorio dentro de un círculo
     * @param {number} centerX - Coordenada X del centro
     * @param {number} centerY - Coordenada Y del centro
     * @param {number} radius - Radio del círculo
     * @returns {Object} Objeto con coordenadas {x, y}
     */
    static randomPointInCircle(centerX, centerY, radius) {
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random()) * radius;
        
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    }

    /**
     * Genera un punto aleatorio dentro de un rectángulo
     * @param {number} x - Coordenada X del rectángulo
     * @param {number} y - Coordenada Y del rectángulo
     * @param {number} width - Ancho del rectángulo
     * @param {number} height - Alto del rectángulo
     * @returns {Object} Objeto con coordenadas {x, y}
     */
    static randomPointInRect(x, y, width, height) {
        return {
            x: x + Math.random() * width,
            y: y + Math.random() * height
        };
    }

    /**
     * Genera un array de números aleatorios únicos
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @param {number} count - Cantidad de números
     * @returns {Array} Array de números únicos
     */
    static randomUniqueNumbers(min, max, count) {
        const numbers = [];
        const range = max - min + 1;
        
        if (count > range) {
            throw new Error('No se pueden generar más números únicos que el rango disponible');
        }
        
        while (numbers.length < count) {
            const num = this.random(min, max);
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        
        return numbers;
    }

    /**
     * Genera un ruido de Perlin simplificado (1D)
     * @param {number} x - Coordenada X
     * @param {number} scale - Escala del ruido
     * @returns {number} Valor de ruido (-1 a 1)
     */
    static perlinNoise1D(x, scale = 1) {
        const xi = Math.floor(x * scale);
        const xf = (x * scale) - xi;
        
        const n0 = this.hash(xi);
        const n1 = this.hash(xi + 1);
        
        const u = this.fade(xf);
        
        return this.lerp(n0, n1, u) * 2 - 1;
    }

    /**
     * Función hash simple para el ruido de Perlin
     * @param {number} n - Número a hashear
     * @returns {number} Valor hasheado
     */
    static hash(n) {
        n = (n << 13) ^ n;
        return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 0x7fffffff;
    }

    /**
     * Función de suavizado para el ruido de Perlin
     * @param {number} t - Valor de entrada
     * @returns {number} Valor suavizado
     */
    static fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Interpolación lineal para el ruido de Perlin
     * @param {number} a - Valor inicial
     * @param {number} b - Valor final
     * @param {number} t - Factor de interpolación
     * @returns {number} Valor interpolado
     */
    static lerp(a, b, t) {
        return a + t * (b - a);
    }
} 