(function() {
  console.log('ROI Calculator embed script starting...');

  // Create the main ROICalc object
  const ROICalc = {
    ns: {},
    
    // Main function call handler
    init: function(namespace, config) {
      console.log('Initializing namespace:', namespace, 'with config:', config);
      
      this.ns[namespace] = {
        config: config || {},
        open: function(customConfig = {}) {
          const finalConfig = { ...config, ...customConfig };
          console.log('Opening popup with final config:', finalConfig);
          ROICalc.openPopup(finalConfig);
        },
        close: function() {
          ROICalc.closePopup();
        },
        ui: function(options) {
          console.log('UI options set:', options);
        }
      };
      
      console.log('Namespace', namespace, 'created successfully');
      console.log('Available namespaces:', Object.keys(this.ns));
    },

    openPopup: function(config) {
      console.log('Opening ROI Calculator popup with config:', config);
      
      // Remove existing popup if any
      this.closePopup();
      
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
        padding: 16px;
        box-sizing: border-box;
      `;
      
      // Create iframe container
      const container = document.createElement('div');
      container.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 1200px;
        height: 90vh;
        max-height: 800px;
        background: #1a1a1a;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
        z-index: 1000001;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        transition: all 0.2s ease;
      `;
      
      closeBtn.addEventListener('click', () => this.closePopup());
      
      // Create iframe
      const iframe = document.createElement('iframe');
      
      // Build URL with parameters
      const url = new URL('https://entreprenovo.github.io/ROI-calculator/');
      url.searchParams.set('embed', 'true');
      url.searchParams.set('serviceCost', config.serviceCost || 7500);
      url.searchParams.set('bookingUrl', config.bookingUrl || 'https://calendly.com/tales-couto/30min');
      
      // Add UTM parameters if provided
      if (config.utm_campaign) url.searchParams.set('utm_campaign', config.utm_campaign);
      if (config.utm_source) url.searchParams.set('utm_source', config.utm_source);
      if (config.utm_medium) url.searchParams.set('utm_medium', config.utm_medium);
      
      console.log('Loading iframe with URL:', url.toString());
      
      iframe.src = url.toString();
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 16px;
        background: #1a1a1a;
      `;
      
      // Add loading state
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
          z-index: 1000000;
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
      
      // Assemble the popup
      container.appendChild(loader);
      container.appendChild(closeBtn);
      container.appendChild(iframe);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Remove loader when iframe loads
      iframe.addEventListener('load', () => {
        console.log('Iframe loaded successfully');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.remove();
          }
        }, 1000);
      });
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closePopup();
        }
      });
      
      // Close on ESC key
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          this.closePopup();
        }
      };
      document.addEventListener('keydown', escHandler);
      
      // Store references for cleanup
      this._currentPopup = { overlay, escHandler };
    },

    closePopup: function() {
      console.log('Closing ROI Calculator popup');
      
      if (this._currentPopup) {
        const { overlay, escHandler } = this._currentPopup;
        
        if (overlay && overlay.parentNode) {
          document.body.removeChild(overlay);
        }
        
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escHandler);
        
        this._currentPopup = null;
      }
    }
  };

  // Expose globally
  window.ROICalc = ROICalc;

  // Handle clicks on elements with data-roi-calc-namespace
  document.addEventListener('click', function(e) {
    const element = e.target.closest('[data-roi-calc-namespace]');
    if (element) {
      e.preventDefault();
      
      const namespace = element.getAttribute('data-roi-calc-namespace');
      const configAttr = element.getAttribute('data-roi-calc-config');
      
      console.log('ROI Calculator button clicked, namespace:', namespace);
      
      let config = {};
      if (configAttr) {
        try {
          config = JSON.parse(configAttr);
          console.log('Config parsed:', config);
        } catch (err) {
          console.warn('Invalid data-roi-calc-config JSON:', err);
        }
      }
      
      if (ROICalc.ns && ROICalc.ns[namespace]) {
        console.log('Opening calculator for namespace:', namespace);
        ROICalc.ns[namespace].open(config);
      } else {
        console.warn('ROI Calculator namespace not found:', namespace);
        console.log('Available namespaces:', ROICalc.ns ? Object.keys(ROICalc.ns) : 'none');
        
        // Fallback - open directly with config
        console.log('Attempting direct open as fallback...');
        ROICalc.openPopup(config);
      }
    }
  });

  console.log('ROI Calculator embed script loaded successfully');
  console.log('ROICalc object created:', ROICalc);

})();
