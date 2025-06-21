/**
 * Utilidades matemáticas para el juego Worldx
 */
class MathUtils {
    /**
     * Clampa un valor entre un mínimo y máximo
     * @param {number} value - Valor a clamar
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Valor clampeado
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Interpola linealmente entre dos valores
     * @param {number} a - Valor inicial
     * @param {number} b - Valor final
     * @param {number} t - Factor de interpolación (0-1)
     * @returns {number} Valor interpolado
     */
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Calcula el porcentaje de un valor respecto a un máximo
     * @param {number} value - Valor actual
     * @param {number} max - Valor máximo
     * @returns {number} Porcentaje (0-100)
     */
    static percentage(value, max) {
        return (value / max) * 100;
    }

    /**
     * Calcula la distancia euclidiana entre dos puntos
     * @param {number} x1 - Coordenada X del primer punto
     * @param {number} y1 - Coordenada Y del primer punto
     * @param {number} x2 - Coordenada X del segundo punto
     * @param {number} y2 - Coordenada Y del segundo punto
     * @returns {number} Distancia
     */
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Calcula el promedio de un array de números
     * @param {number[]} values - Array de valores
     * @returns {number} Promedio
     */
    static average(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    /**
     * Encuentra el valor máximo en un array
     * @param {number[]} values - Array de valores
     * @returns {number} Valor máximo
     */
    static max(values) {
        if (values.length === 0) return 0;
        return Math.max(...values);
    }

    /**
     * Encuentra el valor mínimo en un array
     * @param {number[]} values - Array de valores
     * @returns {number} Valor mínimo
     */
    static min(values) {
        if (values.length === 0) return 0;
        return Math.min(...values);
    }

    /**
     * Calcula la suma de un array de números
     * @param {number[]} values - Array de valores
     * @returns {number} Suma total
     */
    static sum(values) {
        return values.reduce((sum, value) => sum + value, 0);
    }

    /**
     * Calcula el factorial de un número
     * @param {number} n - Número para calcular factorial
     * @returns {number} Factorial
     */
    static factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    /**
     * Calcula la potencia de un número
     * @param {number} base - Base
     * @param {number} exponent - Exponente
     * @returns {number} Resultado
     */
    static power(base, exponent) {
        return Math.pow(base, exponent);
    }

    /**
     * Redondea un número a un número específico de decimales
     * @param {number} value - Valor a redondear
     * @param {number} decimals - Número de decimales
     * @returns {number} Valor redondeado
     */
    static round(value, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    /**
     * Calcula la desviación estándar de un array de valores
     * @param {number[]} values - Array de valores
     * @returns {number} Desviación estándar
     */
    static standardDeviation(values) {
        if (values.length === 0) return 0;
        const avg = this.average(values);
        const squaredDiffs = values.map(value => Math.pow(value - avg, 2));
        const avgSquaredDiff = this.average(squaredDiffs);
        return Math.sqrt(avgSquaredDiff);
    }

    /**
     * Normaliza un valor entre 0 y 1
     * @param {number} value - Valor a normalizar
     * @param {number} min - Valor mínimo del rango
     * @param {number} max - Valor máximo del rango
     * @returns {number} Valor normalizado (0-1)
     */
    static normalize(value, min, max) {
        return (value - min) / (max - min);
    }

    /**
     * Aplica una función de suavizado (easing) a un valor
     * @param {number} t - Valor de tiempo (0-1)
     * @param {string} type - Tipo de easing ('linear', 'easeIn', 'easeOut', 'easeInOut')
     * @returns {number} Valor con easing aplicado
     */
    static ease(t, type = 'linear') {
        switch (type) {
            case 'linear':
                return t;
            case 'easeIn':
                return t * t;
            case 'easeOut':
                return t * (2 - t);
            case 'easeInOut':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            default:
                return t;
        }
    }
} 