(function (window, document) {
  'use strict';

  const ROICalc = {
    loaded: false,
    ns: {},
    q: [],
    instance: null,
    
    init: function(namespace, config = {}) {
      this.loaded = true;
      if (namespace) {
        this.ns[namespace] = this.createInstance(config);
      }
      this.processQueue();
    },
    
    createInstance: function(config) {
      const instance = {
        config: {
          calculatorUrl: 'https://entreprenovo.github.io/roi-calculator/',
          serviceCost: 7500,
          bookingUrl: 'https://calendly.com/tales-couto/30min',
          ...config
        },
        
        ui: function(options) {
          this.uiOptions = { ...this.uiOptions, ...options };
        },
        
        open: function(customConfig = {}) {
          const finalConfig = { ...this.config, ...customConfig };
          ROICalc.openCalculator(finalConfig);
        },
        
        close: function() {
          ROICalc.closeCalculator();
        }
      };
      
      return instance;
    },
    
    openCalculator: function(config) {
      console.log('Opening calculator with config:', config);
      
      if (this.instance) {
        this.closeCalculator();
      }
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'roi-calculator-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      // Create iframe container
      const container = document.createElement('div');
      container.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 1200px;
        height: 90vh;
        max-height: 800px;
        background: transparent;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        transform: scale(0.95);
        transition: transform 0.3s ease;
      `;
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        transition: background 0.2s ease;
      `;
      
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 1)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.9)';
      });
      
      // Create iframe
      const iframe = document.createElement('iframe');
      const calculatorUrl = new URL(config.calculatorUrl);
      
      // Add config as URL parameters
      const params = new URLSearchParams();
      params.set('embed', 'true');
      params.set('serviceCost', config.serviceCost);
      params.set('bookingUrl', config.bookingUrl);
      if (config.utm_campaign) params.set('utm_campaign', config.utm_campaign);
      if (config.utm_source) params.set('utm_source', config.utm_source);
      if (config.utm_medium) params.set('utm_medium', config.utm_medium);
      
      calculatorUrl.search = params.toString();
      
      iframe.src = calculatorUrl.toString();
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 16px;
        background: #0f0f0f;
      `;
      
      // Add loading indicator
      const loader = document.createElement('div');
      loader.innerHTML = `
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-align: center;
        ">
          <div style="
            width: 40px;
            height: 40px;
            border: 3px solid #8b5cf6;
            border-top: 3px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          "></div>
          <div style="font-size: 16px; opacity: 0.8;">Loading Calculator...</div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      
      container.appendChild(loader);
      container.appendChild(closeBtn);
      container.appendChild(iframe);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Fade in animation
      setTimeout(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'scale(1)';
      }, 10);
      
      // Remove loader when iframe loads
      iframe.addEventListener('load', () => {
        setTimeout(() => {
          if (loader.parentNode) {
            loader.remove();
          }
        }, 500);
      });
      
      // Event listeners
      closeBtn.addEventListener('click', () => {
        this.closeCalculator();
      });
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeCalculator();
        }
      });
      
      // Listen for messages from iframe
      window.addEventListener('message', (event) => {
        if (event.origin !== calculatorUrl.origin) return;
        
        if (event.data.type === 'roi-calculator-close') {
          this.closeCalculator();
        }
      });
      
      // ESC key to close
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          this.closeCalculator();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
      
      this.instance = { overlay, container, escHandler };
    },
    
    closeCalculator: function() {
      if (this.instance) {
        const { overlay, escHandler } = this.instance;
        
        // Fade out animation
        overlay.style.opacity = '0';
        overlay.querySelector('div').style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (overlay.parentNode) {
            document.body.removeChild(overlay);
          }
          document.body.style.overflow = '';
        }, 300);
        
        document.removeEventListener('keydown', escHandler);
        this.instance = null;
      }
    },
    
    processQueue: function() {
      this.q.forEach(args => {
        this.handleCall(...args);
      });
      this.q = [];
    },
    
    handleCall: function(method, ...args) {
      if (method === 'init') {
        this.init(...args);
      } else if (method === 'open') {
        const [namespace, config] = args;
        if (this.ns[namespace]) {
          this.ns[namespace].open(config);
        }
      } else if (method === 'close') {
        this.closeCalculator();
      }
    }
  };
  
  // Global API
  window.ROICalc = function() {
    const args = Array.from(arguments);
    if (!ROICalc.loaded) {
      ROICalc.q.push(args);
    } else {
      ROICalc.handleCall(...args);
    }
  };
  
  // Event delegation for data attributes (just like Cal.com)
  document.addEventListener('click', function(e) {
    const element = e.target.closest('[data-roi-calc-namespace]');
    if (element) {
      e.preventDefault();
      const namespace = element.getAttribute('data-roi-calc-namespace');
      const configAttr = element.getAttribute('data-roi-calc-config');
      let config = {};
      
      if (configAttr) {
        try {
          config = JSON.parse(configAttr);
        } catch (err) {
          console.warn('Invalid data-roi-calc-config JSON:', err);
        }
      }
      
      console.log('Opening calculator for namespace:', namespace, 'with config:', config);
      
      if (ROICalc.ns[namespace]) {
        ROICalc.ns[namespace].open(config);
      } else {
        console.warn('Namespace not found:', namespace);
      }
    }
  });
  
})(window, document);
