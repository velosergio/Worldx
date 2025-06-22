/**
 * Mejoras críticas de JavaScript para experiencia móvil en WorldX
 * Este archivo debe cargarse después de todos los otros scripts
 */

(function() {
    'use strict';
    
    // Detectar si estamos en un dispositivo móvil
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    const isSmallMobile = window.innerWidth <= 480;
    
    console.log('Cargando mejoras móviles para WorldX...');
    console.log('Dispositivo móvil detectado:', isMobile);
    console.log('Móvil pequeño detectado:', isSmallMobile);
    
    /**
     * MEJORA CRÍTICA 1: Ajustar delays basado en dispositivo
     */
    function adjustMobileDelays() {
        if (window.worldxGame && window.worldxGame.showNextEvent) {
            const originalShowNextEvent = window.worldxGame.showNextEvent;
            window.worldxGame.showNextEvent = function() {
                const delay = isMobile ? 600 : 300;
                setTimeout(() => {
                    originalShowNextEvent.call(this);
                }, delay);
            };
        }
    }
    
    /**
     * MEJORA CRÍTICA 2: Agregar feedback táctil a botones dinámicos
     */
    function addMobileFeedback() {
        const addTouchFeedback = (element) => {
            if (!element) return;
            
            element.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.95)';
                e.target.style.opacity = '0.8';
                e.target.style.transition = 'transform 0.1s ease, opacity 0.1s ease';
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '1';
            }, { passive: true });
            
            element.addEventListener('touchcancel', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '1';
            }, { passive: true });
        };
        
        // Agregar feedback a todos los botones críticos
        const criticalButtons = [
            '.dev-btn',
            '.speed-btn',
            '.control-btn',
            '.economic-btn',
            '.war-btn',
            '.battle-attack-btn',
            '.menu-btn',
            '.continue-btn',
            '.new-game-btn'
        ];
        
        criticalButtons.forEach(selector => {
            document.querySelectorAll(selector).forEach(addTouchFeedback);
        });
        
        // Observer para botones creados dinámicamente
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        criticalButtons.forEach(selector => {
                            if (node.matches && node.matches(selector)) {
                                addTouchFeedback(node);
                            }
                            node.querySelectorAll && node.querySelectorAll(selector).forEach(addTouchFeedback);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * MEJORA CRÍTICA 3: Prevenir zoom accidental en inputs
     */
    function preventAccidentalZoom() {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        } else {
            const newViewport = document.createElement('meta');
            newViewport.name = 'viewport';
            newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(newViewport);
        }
    }
    
    /**
     * MEJORA CRÍTICA 4: Mejorar scroll en modales para móvil
     */
    function improveMobileModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent && isMobile) {
                modalContent.style.overflowY = 'auto';
                modalContent.style.webkitOverflowScrolling = 'touch';
                modalContent.style.maxHeight = '90vh';
            }
        });
    }
    
    /**
     * MEJORA CRÍTICA 5: Ajustar tamaños de fuente dinámicamente
     */
    function adjustFontSizes() {
        if (isSmallMobile) {
            document.documentElement.style.setProperty('--mobile-font-scale', '0.9');
        } else if (isMobile) {
            document.documentElement.style.setProperty('--mobile-font-scale', '1.0');
        }
    }
    
    /**
     * MEJORA CRÍTICA 6: Mejorar rendimiento en móvil
     */
    function optimizeMobilePerformance() {
        // Reducir animaciones complejas en móviles lentos
        if (isMobile && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Usar passive listeners donde sea posible
        const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
        passiveEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {}, { passive: true });
        });
    }
    
    /**
     * MEJORA CRÍTICA 7: Manejar orientación de pantalla
     */
    function handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalcular layouts después del cambio de orientación
                if (window.worldxGame && window.worldxGame.uiManager) {
                    window.worldxGame.uiManager.updateDisplay();
                }
                
                // Ajustar viewport height para barras de navegación móvil
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }, 100);
        });
        
        // Configuración inicial
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * MEJORA CRÍTICA 8: Mejorar accesibilidad táctil
     */
    function improveAccessibility() {
        // Agregar indicadores visuales para elementos focusables
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                *:focus {
                    outline: 3px solid #ffd700 !important;
                    outline-offset: 2px !important;
                }
                
                button:focus,
                input:focus,
                .dev-btn:focus {
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Función principal de inicialización
     */
    function initMobileImprovements() {
        console.log('Iniciando mejoras móviles...');
        
        // Aplicar mejoras inmediatamente
        preventAccidentalZoom();
        adjustFontSizes();
        optimizeMobilePerformance();
        handleOrientationChange();
        improveAccessibility();
        
        // Aplicar mejoras cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addMobileFeedback();
                improveMobileModals();
                adjustMobileDelays();
            });
        } else {
            addMobileFeedback();
            improveMobileModals();
            adjustMobileDelays();
        }
        
        console.log('Mejoras móviles aplicadas exitosamente');
    }
    
    // Inicializar mejoras
    initMobileImprovements();
    
    // Exponer funciones globalmente para debugging
    window.WorldXMobile = {
        isMobile,
        isSmallMobile,
        addMobileFeedback,
        improveMobileModals,
        adjustMobileDelays
    };
    
})();