# WorldX - Notas de Cambios

## [Unreleased] - Próximas Características

### Características Planificadas
- **Sistema de guerra**: Agrega los conflictos belicos y sus consecuencias / beneficios
- **Sistema de dinero**: Agrega una variable de dinero
- **Sistema de Gráficos**: Visualización del mundo con mapas interactivos
- **Soporte Multiplayer**: Juego multijugador en tiempo real
- **Tutorial**: Guía interactiva para nuevos jugadores
- **Sistema de Personajes**: Líderes históricos con habilidades únicas
- **Sistema de Eventos**: Eventos dinámicos y ramificados
- **Diplomacia**: Relaciones entre naciones y tratados
- **Proyectos de Estado**: Construcciones y mejoras nacionales
- **Recursos Naturales**: Sistema de recursos y comercio
- **Formas de Gobierno**: Diferentes sistemas políticos
- **Sistema de migración**: La población puede cambiar de país
- **Sistema de bots**: Agrega o elimina bots y modifica su dificultad
- **IA Avanzada**: Sistema de IA que aprende y mejora
- **Panel de estadisticas**: Graficos e información relevante
- **Ciudadanos destacados**: Personajes clave para el desarrollo
- **Sistema de Alimentos**: Seguridad alimentaria
- **Sistema de Empleo**: Seguridad laboral
- **Sistema de Infraestructura**: Buff y Debuff relevantes
- **Sistema Industria**: Producción de bienes y servicios 
- **Sistema de Infamia**: Reputación, fama: buffos y debuff 
- **Sistema de Inteigencia**: Espionaje y contraespionaje.
- **Sistema de Territorio**: Expandirse, fundar ciudades, enviar colonos
---

## [v0.4] - 2025-06-21

### Sistema de Batalla y Conquista
- **Ataques entre naciones**: Los jugadores y la IA pueden lanzar ataques desde el Ministerio de Guerra.
- **Modal de Ataque**: Nueva interfaz para seleccionar un objetivo, mostrando inteligencia clave como población, poder y ejército del enemigo.
- **Simulación de Batalla**: Un nuevo algoritmo en `CountryManager.js` calcula el resultado de la batalla (Victoria, Derrota, Empate) y las bajas para ambos bandos.
- **Consecuencias de la Batalla**:
    - **Victoria**: El vencedor puede elegir entre "Arrasar" (robar 25% de los puntos de desarrollo) o "Conquistar".
    - **Conquista**: Si el ejército enemigo es aniquilado, el vencedor puede anexionar el país, absorbiendo su población y el 10% de su desarrollo, eliminándolo del juego.
    - **Derrota**: La nación derrotada es arrasada por el vencedor. Si el jugador pierde toda su población, pierde la partida.
- **Condición de Victoria por Conquista**: Se puede ganar el juego eliminando a todas las demás naciones del mapa.

### IA Militar Inteligente
- **Gestión Autónoma del Ejército**: La IA ahora decide cuándo aumentar su ejército y entrenar sus tropas basándose en su estrategia y recursos.
- **Decisiones de Ataque Estratégicas**: La IA evalúa su poder militar contra el de sus rivales y solo ataca si tiene una ventaja estratégica clara (ej. 1.3x más poder).
- **Lógica Post-Batalla Avanzada**: Si la IA gana una batalla, decidirá de forma inteligente entre conquistar el territorio enemigo, arrasar sus tierras para obtener recursos o retirarse si ha sufrido demasiadas bajas.

### Simplificación del Sistema de Desarrollo
- **Eliminación del botón "Aplicar Desarrollo"**: Ya no es necesario hacer clic en un botón separado para aplicar los puntos de desarrollo.
- **Aplicación inmediata de puntos**: Al hacer clic en el botón "+" de cada atributo, los puntos se aplican inmediatamente sin acumulación pendiente.
- **Interfaz simplificada**: Eliminación de elementos visuales innecesarios como contadores de puntos pendientes.
- **Código más limpio**: Eliminación de lógica de estado pendiente en `UIManager.js`.

### Sistema del Ministerio de Guerra
- **Panel de gestión militar**: Nuevo panel ubicado entre el país del jugador y el intel de otros países.
- **Sistema de ejército**: Cada país tiene un ejército con un máximo del 40% de su población total.
- **Nivel de experiencia**: Sistema de experiencia del ejército de 1 a 10 niveles que actúa como multiplicador de poder.
- **Poder militar**: Cálculo basado en estadística militar × experiencia + bonus por tamaño del ejército.
- **Poder total**: Suma de todas las estadísticas + poder militar para ranking general.

### Eventos Militares
- **12 eventos militares únicos**: 6 eventos positivos y 6 eventos negativos que afectan el poder militar.
- **Eventos positivos**: Victoria Épica, Reclutamiento Masivo, Entrenamiento Avanzado, Alianza Militar, Innovación Tecnológica, Héroe Nacional.
- **Eventos negativos**: Derrota Desastrosa, Deserción Masiva, Escasez de Equipamiento, Conflicto Interno, Enfermedad en el Ejército, Sabotaje Enemigo.
- **Efectos militares**: Modifican directamente el tamaño del ejército y la experiencia militar.
- **Condiciones específicas**: Cada evento requiere estadísticas mínimas para activarse.
- **Sistema de rareza**: Eventos comunes, poco comunes y raros con diferentes probabilidades.
- **Integración completa**: Los eventos militares se generan automáticamente junto con otros tipos de eventos.

### Acciones del Ministerio de Guerra
- **Aumentar Ejército**: Incrementa el ejército en un 10% de la población, con costos crecientes en Social y Economía.
- **Entrenar Ejército**: Aumenta el nivel de experiencia en 1, con costo fijo de 10 puntos de poder militar.
- **Costos dinámicos**: Los costos para aumentar el ejército se incrementan con cada mejora realizada.
- **Validaciones**: Verificación de recursos disponibles y límites máximos antes de permitir acciones.

### Correcciones y Mejoras
- **Coherencia Visual de la UI**: Se ha restaurado el estilo original de los botones del Ministerio de Guerra para que sea consistente con el resto de la interfaz.
- **Corrección del Panel de Intel**: Solucionado un error que provocaba que la fuerza y los rumores de las naciones IA se mostraran como `undefined`.
- **Estabilidad del Modal de Ataque**: Corregido un error crítico que causaba que el juego se bloqueara al intentar abrir el modal de ataque.
- **Mejora en Pantalla de Victoria**: Añadido un indicador "(Tú)" para resaltar al jugador en la tabla de clasificación final.

### Archivos Modificados
- **`js/ui/UIManager.js`**: Lógica de desarrollo simplificada, gestión del Ministerio de Guerra, sistema de batalla completo y correcciones de errores.
- **`js/core/CountryManager.js`**: Implementación de la lógica militar (ejército, poder, batallas), conquista, arrasamiento y corrección de funciones de intel.
- **`js/core/AIController.js`**: Nueva lógica de IA para gestionar su ejército, atacar y tomar decisiones post-batalla.
- **`js/main.js`**: Integración de la nueva lógica de victoria por conquista y funciones de apoyo para la batalla.
- **`index.html`**: Eliminado el sistema de desarrollo pendiente, añadido el panel del Ministerio de Guerra y el modal de batalla.
- **`styles/main.css`**: Estilos actualizados para el desarrollo, el nuevo panel militar y correcciones de botones.
- **`js/data/CountryGenerator.js`**: Añadidas propiedades militares (`army`, `armyExperience`) a los países.
- **`js/data/events/MilitaryEvents.js`**: Nuevo archivo con 12 eventos militares únicos.
- **`js/data/events/EventTypes.js`**: Agregado el tipo de evento `MILITARY`.
- **`js/data/events/EventManager.js`**: Integración de los nuevos eventos militares.

## [v0.3] - 2025-06-21
- **Atributos de País**: Cada país ahora tiene `population` y `birthRate`, inicializados en `CountryGenerator.js`.
- **Crecimiento Semanal**: La población de cada país aumenta cada semana en `main.js` según su tasa de natalidad.
- **Integración en UI**: La población actual se muestra junto al nombre del país en el panel principal.
- **Nuevos Eventos de Población**: Se ha creado `PopulationEvents.js` con eventos que afectan directamente a la población y la natalidad (ej. "Baby Boom", "Éxodo Masivo").
- **Impacto en Eventos Existentes**: Los eventos de crisis (ej. "Plaga Mortal") y de inspiración ("Edades Doradas") ahora pueden afectar a la población y la tasa de natalidad.
- **Gestión de Efectos**: `EventManager.js` ha sido actualizado para aplicar y revertir los modificadores de población y natalidad.
- **Mejoras en la Pantalla Final**: La pantalla de victoria ahora muestra un ranking completo de todas las naciones.
- **Tabla de Clasificación**: Incluye la posición, nombre del país, puntuación total y población final, destacando al ganador.

## [v0.2] - 2025-06-20

### Rebalanceo de Edades Doradas
- **Condiciones mucho más estrictas** para las edades doradas (eventos de inspiración)
- **Tiempo mínimo de juego**: 20-40 semanas dependiendo del tipo de edad dorada
- **Estadísticas requeridas aumentadas**: De 5 a 8 en la estadística principal
- **Desarrollo equilibrado**: Requiere al menos 4 en todas las estadísticas
- **Efectos potenciados**: De +2 a +3 puntos de estadística
- **Probabilidades ajustadas**: 90% menos probable en condiciones normales

### Nuevas Condiciones por Tipo de Edad Dorada
- **Renacimiento Militar**: Militar 8 + Social 4 + 20 semanas mínimo
- **Movimiento Social Revolucionario**: Social 8 + Cultura 4 + 25 semanas mínimo
- **Edad de Oro Cultural**: Cultura 8 + Ciencia 4 + 30 semanas mínimo
- **Revolución Científica**: Ciencia 8 + Economía 4 + 35 semanas mínimo
- **Boom Económico Histórico**: Economía 8 + Militar 4 + 40 semanas mínimo

### Mejoras en el Sistema
- **Verificación de elegibilidad**: Nueva función `canHaveGoldenAge()`
- **Descripciones mejoradas**: Textos más épicos y detallados
- **Títulos actualizados**: Nombres más impactantes y significativos
- **Lógica de probabilidades**: Solo aparece en condiciones ideales después de mucho tiempo

### Impacto en el Juego
- **Edades doradas más significativas**: Ahora son verdaderos logros
- **Progresión más realista**: Requiere desarrollo equilibrado y tiempo
- **Recompensa mayor**: Efectos más potentes para compensar la dificultad
- **Experiencia más desafiante**: Los jugadores deben trabajar más para conseguirlas

### Refactorización del Sistema de Eventos
- **Refactorización completa del archivo EventData.js** (991 líneas → 6 archivos modulares)
- Separación en módulos especializados para facilitar mantenimiento:
  - `EventTypes.js` - Definiciones de tipos, colores, iconos y utilidades
  - `PersonageEvents.js` - Eventos de personajes destacados
  - `CrisisEvents.js` - Eventos de crisis y desastres
  - `InspirationEvents.js` - Eventos de inspiración y motivación
  - `SpecialEvents.js` - Milestones, descubrimientos, culturales y tecnológicos
  - `DevelopmentEvents.js` - Eventos de desarrollo y progreso
  - `EventManager.js` - Coordinador principal y lógica de generación

### Mejoras Técnicas
- **Arquitectura modular**: Cada archivo tiene responsabilidad específica
- **Mantenibilidad mejorada**: Archivos no superan 500 líneas
- **Compatibilidad preservada**: API pública de EventData.js mantenida
- **Organización clara**: Estructura de directorios `js/data/events/`
- **Dependencias ordenadas**: Carga correcta de scripts en index.html

### Beneficios
- Facilita desarrollo de nuevos tipos de eventos
- Mejora legibilidad y navegación del código
- Permite trabajo en paralelo en diferentes tipos de eventos
- Reduce complejidad cognitiva por archivo
- Mantiene funcionalidad existente sin cambios

### Sistema de Eventos Expandido
- **7 tipos de eventos** con más de 50 eventos únicos
- **Generación semanal y anual** de eventos dinámicos
- **Condiciones dinámicas** basadas en estadísticas del país
- **Sinergias entre estadísticas** para efectos más realistas
- **Efectos temporales** con duración configurable
- **Interfaz mejorada** con iconos y colores por tipo de evento
- **IA reactiva** que responde a eventos del jugador

### Nuevos Tipos de Eventos
- **Personajes destacados**: Líderes que emergen en áreas específicas
- **Crisis**: Desastres naturales, conflictos sociales, crisis económicas
- **Inspiración**: Eventos motivacionales que potencian estadísticas altas
- **Milestones**: Hitos históricos que marcan el progreso
- **Descubrimientos**: Hallazgos científicos y comerciales
- **Eventos culturales**: Festivales, obras maestras, movimientos artísticos
- **Eventos tecnológicos**: Innovaciones e infraestructura moderna

### Mejoras en la IA
- **Eventos reactivos**: La IA responde a eventos del jugador
- **Decisiones estratégicas**: Prioriza estadísticas según situación
- **Comportamiento dinámico**: Adapta estrategia según eventos activos
- **Competencia inteligente**: Rivales más desafiantes y realistas

### Interfaz de Usuario
- **Modal de eventos mejorado** con información detallada
- **Iconos y colores** para identificar tipos de evento rápidamente
- **Descripción completa** con efectos, duración y rareza
- **Historial de eventos** con filtros por tipo
- **Notificaciones visuales** para eventos importantes

---

## [v0.1] - 2024-12-19

### Características Principales
- **Sistema de estadísticas 5D**: Militar, Social, Cultura, Ciencia, Economía
- **Gestión de desarrollo**: Puntos de desarrollo asignables
- **Sistema de eventos**: Eventos aleatorios que afectan estadísticas
- **IA para países rivales**: 4 países controlados por IA
- **Interfaz de usuario moderna**: Diseño responsive y intuitivo
- **Sistema de guardado**: Persistencia de datos del juego
- **Controles de tiempo**: Pausa, velocidad x1, x2, x4
- **Visualización de progreso**: Barras de estadísticas animadas

### Mecánicas de Juego
- **Desarrollo semanal**: Asignación de puntos de desarrollo
- **Eventos dinámicos**: Sistema de buffs y debuffs temporales
- **Competencia**: Comparación con otros países
- **Objetivos**: Meta de alcanzar 10 en todas las estadísticas
- **Estrategia**: Balance entre diferentes áreas de desarrollo

### Tecnologías Utilizadas
- **JavaScript vanilla**: Sin frameworks externos
- **HTML5 Canvas**: Para visualizaciones futuras
- **CSS3**: Animaciones y diseño moderno
- **LocalStorage**: Persistencia de datos
- **GSAP**: Animaciones suaves
- **Chart.js**: Gráficos y visualizaciones

### Arquitectura del Código
- **Módulos separados**: Organización clara por funcionalidad
- **Sistema de eventos**: Arquitectura basada en eventos
- **Generadores de datos**: Contenido procedural
- **Controladores de IA**: Lógica para países rivales
- **Gestión de UI**: Componentes reutilizables
- **Utilidades**: Funciones matemáticas y de aleatoriedad

### Estado del Proyecto
- **MVP funcional**: Juego completamente jugable
- **Base sólida**: Arquitectura extensible
- **Documentación**: README y changelog actualizados
- **Código limpio**: Estándares de calidad mantenidos

---

## Formato de Versionado

Este proyecto utiliza el formato de versionado semántico: `MAJOR.MINOR.PATCH.BUILD`

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas características compatibles hacia atrás
- **PATCH**: Correcciones de bugs compatibles hacia atrás
- **BUILD**: Número de build interno

---

*Última actualización: Junio 2025*