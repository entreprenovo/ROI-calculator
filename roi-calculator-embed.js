(function (window, document) {
  'use strict';

  // Simple ROI Calculator embed script
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
      `;
      
      // Create modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: #1a1a1a;
        border-radius: 16px;
        padding: 32px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      `;
      
      // Create calculator content
      modal.innerHTML = this.createCalculatorHTML(config);
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add event listeners
      this.addEventListeners(overlay, config);
      
      this.instance = { overlay, modal };
    },
    
    createCalculatorHTML: function(config) {
      return `
        <button id="roi-close-btn" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: color 0.2s;
        ">&times;</button>
        
        <div id="roi-calculator-content">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0; background: linear-gradient(135deg, #8b5cf6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              AI Automation ROI Calculator
            </h2>
            <p style="color: #9ca3af; margin: 0;">Discover your automation potential in 2 minutes</p>
          </div>
          
          <div id="roi-step-1" class="roi-step">
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 24px; text-align: center;">Tell us about your business</h3>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Monthly Revenue</label>
              <input type="range" id="revenue" min="10000" max="500000" step="5000" value="50000" style="width: 100%; margin-bottom: 8px;">
              <div id="revenue-display" style="text-align: center; color: #8b5cf6; font-weight: bold;">$50,000</div>
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Team Size</label>
              <input type="range" id="teamSize" min="1" max="100" value="10" style="width: 100%; margin-bottom: 8px;">
              <div id="teamSize-display" style="text-align: center; color: #8b5cf6; font-weight: bold;">10 people</div>
            </div>
            
            <div style="margin-bottom: 32px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Average Hourly Cost</label>
              <input type="range" id="hourlyCost" min="25" max="200" step="5" value="75" style="width: 100%; margin-bottom: 8px;">
              <div id="hourlyCost-display" style="text-align: center; color: #8b5cf6; font-weight: bold;">$75/hour</div>
            </div>
            
            <button id="roi-next-1" style="
              background: linear-gradient(135deg, #8b5cf6, #a855f7);
              color: white;
              border: none;
              padding: 16px 32px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              width: 100%;
              transition: transform 0.2s;
            ">Next Step</button>
          </div>
          
          <div id="roi-step-2" class="roi-step" style="display: none;">
            <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center;">Weekly Manual Hours</h3>
            <p style="color: #9ca3af; text-align: center; margin-bottom: 24px;">How many hours per week does your team spend on these tasks?</p>
            
            <div id="total-hours" style="text-align: center; margin-bottom: 24px; padding: 12px; background: #374151; border-radius: 8px; font-weight: bold;">
              Total: <span id="total-hours-value">53</span> hours/week
            </div>
            
            <div style="display: grid; gap: 20px; margin-bottom: 32px;">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Lead Generation</label>
                  <span id="leadGen-display">15 hrs</span>
                </div>
                <input type="range" id="leadGen" min="0" max="40" value="15" style="width: 100%;">
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Customer Follow-ups</label>
                  <span id="followUp-display">12 hrs</span>
                </div>
                <input type="range" id="followUp" min="0" max="30" value="12" style="width: 100%;">
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Data Entry & Admin</label>
                  <span id="dataEntry-display">8 hrs</span>
                </div>
                <input type="range" id="dataEntry" min="0" max="25" value="8" style="width: 100%;">
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Scheduling</label>
                  <span id="scheduling-display">6 hrs</span>
                </div>
                <input type="range" id="scheduling" min="0" max="20" value="6" style="width: 100%;">
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Reporting</label>
                  <span id="reporting-display">4 hrs</span>
                </div>
                <input type="range" id="reporting" min="0" max="15" value="4" style="width: 100%;">
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <label>Email Management</label>
                  <span id="email-display">8 hrs</span>
                </div>
                <input type="range" id="email" min="0" max="20" value="8" style="width: 100%;">
              </div>
            </div>
            
            <div style="display: flex; gap: 16px;">
              <button id="roi-back-2" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 16px 24px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                flex: 1;
              ">Previous</button>
              <button id="roi-calculate" style="
                background: linear-gradient(135deg, #8b5cf6, #a855f7);
                color: white;
                border: none;
                padding: 16px 24px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                flex: 2;
              ">Calculate ROI</button>
            </div>
          </div>
          
          <div id="roi-step-3" class="roi-step" style="display: none;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Your ROI Potential</h3>
              
              <div style="
                background: linear-gradient(135deg, #8b5cf6, #a855f7);
                padding: 32px;
                border-radius: 16px;
                margin-bottom: 24px;
              ">
                <div id="roi-percentage" style="font-size: 48px; font-weight: bold; margin-bottom: 8px;">1,247%</div>
                <div style="font-size: 16px; opacity: 0.9;">First Year ROI</div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                <div style="background: #374151; padding: 20px; border-radius: 12px;">
                  <div id="monthly-savings" style="font-size: 24px; font-weight: bold; color: #34d399; margin-bottom: 4px;">$12,675</div>
                  <div style="font-size: 12px; color: #9ca3af;">Monthly Savings</div>
                </div>
                
                <div style="background: #374151; padding: 20px; border-radius: 12px;">
                  <div id="hours-automated" style="font-size: 24px; font-weight: bold; color: #60a5fa; margin-bottom: 4px;">184</div>
                  <div style="font-size: 12px; color: #9ca3af;">Hours Automated/Month</div>
                </div>
                
                <div style="background: #374151; padding: 20px; border-radius: 12px;">
                  <div id="productivity-gain" style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">96%</div>
                  <div style="font-size: 12px; color: #9ca3af;">Productivity Gain</div>
                </div>
                
                <div style="background: #374151; padding: 20px; border-radius: 12px;">
                  <div id="revenue-boost" style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin-bottom: 4px;">$750</div>
                  <div style="font-size: 12px; color: #9ca3af;">Revenue Boost/Month</div>
                </div>
              </div>
              
              <button id="roi-book-call" style="
                background: linear-gradient(135deg, #34d399, #10b981);
                color: white;
                border: none;
                padding: 20px 40px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s;
              ">Book Free Strategy Call →</button>
            </div>
          </div>
        </div>
      `;
    },
    
    addEventListeners: function(overlay, config) {
      const formData = {
        revenue: 50000,
        teamSize: 10,
        hourlyCost: 75,
        leadGen: 15,
        followUp: 12,
        dataEntry: 8,
        scheduling: 6,
        reporting: 4,
        email: 8
      };
      
      // Close button
      overlay.querySelector('#roi-close-btn').addEventListener('click', () => {
        this.closeCalculator();
      });
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeCalculator();
        }
      });
      
      // Step 1 sliders
      ['revenue', 'teamSize', 'hourlyCost'].forEach(field => {
        const slider = overlay.querySelector(`#${field}`);
        const display = overlay.querySelector(`#${field}-display`);
        
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          formData[field] = value;
          
          if (field === 'revenue') {
            display.textContent = `$${value.toLocaleString()}`;
          } else if (field === 'teamSize') {
            display.textContent = `${value} people`;
          } else if (field === 'hourlyCost') {
            display.textContent = `$${value}/hour`;
          }
        });
      });
      
      // Step 1 next button
      overlay.querySelector('#roi-next-1').addEventListener('click', () => {
        overlay.querySelector('#roi-step-1').style.display = 'none';
        overlay.querySelector('#roi-step-2').style.display = 'block';
      });
      
      // Step 2 sliders
      ['leadGen', 'followUp', 'dataEntry', 'scheduling', 'reporting', 'email'].forEach(field => {
        const slider = overlay.querySelector(`#${field}`);
        const display = overlay.querySelector(`#${field}-display`);
        
        slider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          formData[field] = value;
          display.textContent = `${value} hrs`;
          
          // Update total
          const total = formData.leadGen + formData.followUp + formData.dataEntry + 
                       formData.scheduling + formData.reporting + formData.email;
          overlay.querySelector('#total-hours-value').textContent = total;
        });
      });
      
      // Step 2 back button
      overlay.querySelector('#roi-back-2').addEventListener('click', () => {
        overlay.querySelector('#roi-step-2').style.display = 'none';
        overlay.querySelector('#roi-step-1').style.display = 'block';
      });
      
      // Calculate button
      overlay.querySelector('#roi-calculate').addEventListener('click', () => {
        this.calculateAndShowResults(overlay, formData, config);
      });
    },
    
    calculateAndShowResults: function(overlay, data, config) {
      const totalWeeklyHours = data.leadGen + data.followUp + data.dataEntry + 
                              data.scheduling + data.reporting + data.email;
      const totalMonthlyHours = totalWeeklyHours * 4.33;
      const monthlyWastedCost = totalMonthlyHours * data.hourlyCost;
      const automationEfficiency = 0.8;
      const hoursAutomated = Math.round(totalMonthlyHours * automationEfficiency);
      const monthlySavings = hoursAutomated * data.hourlyCost;
      const productivityGain = totalMonthlyHours > 0 ? 
        Math.round((hoursAutomated / totalMonthlyHours) * 100 * 1.2) : 0;
      const revenueBoostPercentage = 0.15; // 15% revenue boost
      const monthlyRevenueBoost = data.revenue * revenueBoostPercentage;
      const totalMonthlyBenefit = monthlySavings + monthlyRevenueBoost;
      const annualBenefit = totalMonthlyBenefit * 12;
      const roi = config.serviceCost > 0 ? 
        Math.round(((annualBenefit - config.serviceCost) / config.serviceCost) * 100) : 
        10000;
      
      // Update results display
      overlay.querySelector('#roi-percentage').textContent = `${roi.toLocaleString()}%`;
      overlay.querySelector('#monthly-savings').textContent = `$${monthlySavings.toLocaleString()}`;
      overlay.querySelector('#hours-automated').textContent = hoursAutomated.toLocaleString();
      overlay.querySelector('#productivity-gain').textContent = `${productivityGain}%`;
      overlay.querySelector('#revenue-boost').textContent = `$${Math.round(monthlyRevenueBoost).toLocaleString()}`;
      
      // Show results
      overlay.querySelector('#roi-step-2').style.display = 'none';
      overlay.querySelector('#roi-step-3').style.display = 'block';
      
      // Book call button
      overlay.querySelector('#roi-book-call').addEventListener('click', () => {
        window.open(config.bookingUrl, '_blank');
      });
    },
    
    closeCalculator: function() {
      if (this.instance) {
        document.body.removeChild(this.instance.overlay);
        document.body.style.overflow = '';
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
  
  // Event delegation for data attributes
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
