<script id="roi-calculator-embed-script">
    (function() {
        'use strict';
        
        // Avoid multiple initializations
        if (window.ROICalculator && window.ROICalculator.initialized) return;
        
        window.ROICalculator = window.ROICalculator || {};
        window.ROICalculator.initialized = true;
        
        // Configuration
        const defaultConfig = {
            serviceCost: 7500,
            bookingUrl: 'https://calendly.com/talescouto/30min',
            origin: window.location.origin
        };
        
        // Store active instances
        const instances = new Map();
        
        // Create calculator instance
        class ROICalculatorInstance {
            constructor(namespace, config) {
                this.namespace = namespace;
                this.config = { ...defaultConfig, ...config };
                this.container = null;
                this.shadowRoot = null;
                this.isOpen = false;
            }
            
            init() {
                // Create container with shadow DOM for style isolation
                this.container = document.createElement('div');
                this.container.id = `roi-calculator-${this.namespace}`;
                this.container.style.position = 'fixed';
                this.container.style.zIndex = '999999';
                this.container.style.top = '0';
                this.container.style.left = '0';
                this.container.style.width = '100%';
                this.container.style.height = '100%';
                this.container.style.pointerEvents = 'none';
                this.container.style.display = 'none';
                
                // Use shadow DOM for style isolation
                this.shadowRoot = this.container.attachShadow({ mode: 'open' });
                
                // Add styles
                const style = document.createElement('style');
                style.textContent = `
                    * {
                        box-sizing: border-box;
                    }
                    
                    .roi-backdrop {
                        position: fixed;
                        inset: 0;
                        background: rgba(15, 23, 42, 0.5);
                        backdrop-filter: blur(4px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 1rem;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        pointer-events: all;
                    }
                    
                    .roi-backdrop.open {
                        opacity: 1;
                    }
                    
                    .roi-modal {
                        background: #f8fafc;
                        border: 1px solid rgba(226, 232, 240, 0.5);
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        width: 100%;
                        max-width: 56rem;
                        max-height: 95vh;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        transform: scale(0.95) translateY(20px);
                        transition: transform 0.3s ease;
                    }
                    
                    .roi-backdrop.open .roi-modal {
                        transform: scale(1) translateY(0);
                    }
                    
                    .roi-header {
                        padding: 1.5rem;
                        text-align: center;
                        border-bottom: 1px solid #e2e8f0;
                        position: relative;
                        background: white;
                    }
                    
                    .roi-close {
                        position: absolute;
                        top: 0.75rem;
                        right: 0.75rem;
                        background: none;
                        border: none;
                        padding: 0.5rem;
                        cursor: pointer;
                        border-radius: 50%;
                        transition: background 0.2s;
                        color: #64748b;
                    }
                    
                    .roi-close:hover {
                        background: rgba(226, 232, 240, 0.6);
                        color: #1e293b;
                    }
                    
                    .roi-content {
                        flex: 1;
                        overflow: hidden;
                        background: white;
                    }
                    
                    .roi-iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                    
                    @media (max-width: 640px) {
                        .roi-modal {
                            max-height: 90vh;
                        }
                        
                        .roi-header {
                            padding: 1rem;
                        }
                    }
                `;
                this.shadowRoot.appendChild(style);
                
                document.body.appendChild(this.container);
            }
            
            open() {
                if (this.isOpen) return;
                
                this.isOpen = true;
                this.container.style.display = 'block';
                
                // Create modal content
                const backdrop = document.createElement('div');
                backdrop.className = 'roi-backdrop';
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) this.close();
                });
                
                const modal = document.createElement('div');
                modal.className = 'roi-modal';
                modal.addEventListener('click', (e) => e.stopPropagation());
                
                const header = document.createElement('div');
                header.className = 'roi-header';
                header.innerHTML = `
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #0f172a; margin: 0;">Your Personalized ROI Analysis</h2>
                    <p style="font-size: 1rem; color: #64748b; margin: 0.25rem 0 0 0;">Just a few steps to quantify your potential.</p>
                    <button class="roi-close" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                
                header.querySelector('.roi-close').addEventListener('click', () => this.close());
                
                const content = document.createElement('div');
                content.className = 'roi-content';
                
                // Create iframe with calculator app
                const iframe = document.createElement('iframe');
                iframe.className = 'roi-iframe';
                iframe.src = `${this.config.origin}/roi-calculator-app.html?serviceCost=${this.config.serviceCost}&bookingUrl=${encodeURIComponent(this.config.bookingUrl)}`;
                
                content.appendChild(iframe);
                modal.appendChild(header);
                modal.appendChild(content);
                backdrop.appendChild(modal);
                this.shadowRoot.appendChild(backdrop);
                
                // Trigger animation
                requestAnimationFrame(() => {
                    backdrop.classList.add('open');
                });
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            }
            
            close() {
                if (!this.isOpen) return;
                
                const backdrop = this.shadowRoot.querySelector('.roi-backdrop');
                if (backdrop) {
                    backdrop.classList.remove('open');
                    setTimeout(() => {
                        this.shadowRoot.innerHTML = '';
                        this.container.style.display = 'none';
                        this.isOpen = false;
                        document.body.style.overflow = '';
                    }, 300);
                }
            }
        }
        
        // Initialize calculator
        window.ROICalculator.init = function(namespace, config) {
            if (!namespace) {
                console.error('ROICalculator: namespace is required');
                return;
            }
            
            // Create instance
            const instance = new ROICalculatorInstance(namespace, config);
            instance.init();
            instances.set(namespace, instance);
            
            // Set up element click handlers
            const setupClickHandlers = () => {
                const elements = document.querySelectorAll(`[data-roi-namespace="${namespace}"]`);
                elements.forEach(element => {
                    // Remove existing listener to avoid duplicates
                    element.removeEventListener('click', element._roiClickHandler);
                    
                    // Add new listener
                    element._roiClickHandler = (e) => {
                        e.preventDefault();
                        
                        // Get element-specific config
                        const elementConfig = element.getAttribute('data-roi-config');
                        if (elementConfig) {
                            try {
                                const parsedConfig = JSON.parse(elementConfig);
                                Object.assign(instance.config, parsedConfig);
                            } catch (error) {
                                console.error('ROICalculator: Invalid config JSON', error);
                            }
                        }
                        
                        instance.open();
                    };
                    
                    element.addEventListener('click', element._roiClickHandler);
                });
            };
            
            // Initial setup
            setupClickHandlers();
            
            // Watch for new elements
            const observer = new MutationObserver(() => {
                setupClickHandlers();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Return API
            return {
                open: () => instance.open(),
                close: () => instance.close(),
                updateConfig: (newConfig) => Object.assign(instance.config, newConfig)
            };
        };
        
        // Auto-initialize if script has data attributes
        const currentScript = document.currentScript || document.querySelector('script[data-roi-namespace]');
        if (currentScript) {
            const namespace = currentScript.getAttribute('data-roi-namespace');
            const configAttr = currentScript.getAttribute('data-roi-config');
            let config = {};
            
            if (configAttr) {
                try {
                    config = JSON.parse(configAttr);
                } catch (error) {
                    console.error('ROICalculator: Invalid config JSON in script tag', error);
                }
            }
            
            if (namespace) {
                window.ROICalculator.init(namespace, config);
            }
        }
    })();
    </script>

    <!-- USAGE EXAMPLE FOR FRAMER -->
    
    <!-- Step 1: Add this to your Framer site's custom code (in Site Settings > Custom Code > End of <body> tag) -->
    <script type="text/javascript">
    (function (R, O, I) {
        let d = R.document;
        R.ROICalculator = R.ROICalculator || function() {
            if (!R.ROICalculator.loaded) {
                d.head.appendChild(d.createElement("script")).src = O;
                R.ROICalculator.loaded = true;
            }
        };
    })(window, "https://your-domain.com/embed.js", "init");
    
    // Initialize the calculator with your configuration
    ROICalculator();
    setTimeout(() => {
        ROICalculator.init("main", {
            serviceCost: 7500,
            bookingUrl: "https://calendly.com/talescouto/30min",
            origin: "https://your-domain.com"
        });
    }, 1000);
    </script>

    <!-- Step 2: Create a Code Override in Framer -->
    <script>
    // Save this as a code override in Framer (e.g., "roiCalculatorTrigger.tsx")
    
    export function withROICalculator(Component): ComponentType {
        return (props) => {
            return (
                <Component
                    {...props}
                    data-roi-namespace="main"
                    data-roi-config='{"serviceCost":7500}'
                />
            )
        }
    }
    </script>
