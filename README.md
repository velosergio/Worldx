# WorldX: Juego de Estrategia 4X

**WorldX** es un juego de estrategia 4X en tiempo real basado en navegador donde tomas el control de una nación y la guías a través de los tiempos. Gestiona tus recursos, toma decisiones estratégicas y compite contra civilizaciones controladas por la IA para alcanzar la supremacía.

## 🚀 Sobre el Juego

En WorldX, tu objetivo es desarrollar tu nación en cinco áreas clave: **Militar, Social, Cultura, Ciencia y Economía**. Cada semana, obtienes puntos de desarrollo que puedes invertir para fortalecer tus estadísticas. El camino hacia la victoria está lleno de eventos dinámicos que pueden impulsar tu progreso o poner a prueba tu liderazgo con crisis inesperadas.

¿Llevarás a tu pueblo a una edad de oro cultural o construirás una potencia económica imparable? La decisión es tuya.

## ✨ Características Principales

*   **Sistema de Estadísticas 5D**: Equilibra el desarrollo entre Militar, Social, Cultura, Ciencia y Economía.
*   **Ministerio de Guerra**: Gestiona tu ejército, entrénalo, aumenta su poder y lánzate a la conquista.
*   **Sistema de Batalla**: Simula batallas contra otras naciones con consecuencias estratégicas como la conquista o el arrasamiento de tierras.
*   **Eventos Dinámicos**: Más de 60 eventos únicos que afectan el curso de tu nación, desde crisis devastadoras hasta inspiraciones gloriosas.
*   **Generación Procedural**: Cada partida es única, con nombres de países, temas culturales y estrategias de IA generados al azar.
*   **IA Competitiva**: Enfréntate a 2 oponentes controlados por IA con 5 estrategias diferentes, ahora capaces de gestionar su propio ejército, lanzar ataques y tomar decisiones estratégicas en la guerra.
*   **Sistema de Desarrollo Simplificado**: Asigna puntos de desarrollo semanales de forma instantánea para dar forma al destino de tu nación.
*   **Guardado y Carga**: Guarda tu progreso en cualquier momento y continúa tu partida más tarde.
*   **Controles de Tiempo**: Pausa el juego o acelera el tiempo (x1, x2, x4) para jugar a tu propio ritmo.
*   **Interfaz Moderna**: Una interfaz de usuario limpia e intuitiva con animaciones fluidas.

## 🎮 Cómo Jugar

1.  **Abre `index.html`** en tu navegador web.
2.  Haz clic en **"Nueva Partida"**.
3.  Elige un nombre para tu nación o genera uno al azar.
4.  Asigna tus puntos de desarrollo haciendo clic en los botones `+` junto a cada estadística.
5.  Controla el paso del tiempo con los botones de velocidad.
6.  ¡Alcanza **100 puntos** en cualquier estadística o **conquista a todas las demás naciones** para ganar el juego!

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Animaciones**: [GSAP (GreenSock)](https://greensock.com/gsap/)
*   **Dependencias (preparadas)**: [Chart.js](https://www.chartjs.org/), [Pixi.js](https://pixijs.com/)

## 📂 Estructura del Proyecto

El código está organizado de forma modular para facilitar su mantenimiento y escalabilidad:

```
worldx/
├── js/
│   ├── core/         # Lógica principal del juego (GameLoop, EventSystem, etc.)
│   ├── data/         # Generadores de contenido (países, eventos)
│   ├── ui/           # Módulos de la interfaz de usuario (UIManager, EventModal)
│   └── utils/        # Funciones de utilidad (Math, Random)
├── styles/           # Hojas de estilo CSS
├── index.html        # Punto de entrada del juego
└── README.md         # Este archivo
```

## 🔮 Futuras Características

El desarrollo de WorldX continúa. Algunas de las características planificadas son:

*   **Sistema de Diplomacia**: Tratados, alianzas y guerras con otras naciones.
*   **Árbol de Tecnologías**: Desbloquea nuevas habilidades y bonificaciones.
*   **Visualización Gráfica**: Un mapa del mundo interactivo.
*   **Soporte Multijugador**: Compite contra otros jugadores en tiempo real.

---
*Desarrollado con ❤️ para los amantes de la estrategia.*
