(function (window, document) {
  'use strict';

  // ROI Calculator embed script
  const ROICalc = {
    loaded: false,
    ns: {},
    q: [],
    instances: {},
    
    init: function(namespace, config = {}) {
      if (!this.loaded) {
        this.loadDependencies(() => {
          this.loaded = true;
          this.processQueue();
        });
      }
      
      if (namespace) {
        this.ns[namespace] = this.ns[namespace] || this.createInstance(config);
      }
    },
    
    loadDependencies: function(callback) {
      const dependencies = [
        'https://unpkg.com/react@18/umd/react.production.min.js',
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        'https://unpkg.com/framer-motion@10.16.0/dist/framer-motion.js'
      ];
      
      let loadedCount = 0;
      dependencies.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          loadedCount++;
          if (loadedCount === dependencies.length) {
            this.initReactComponents();
            callback();
          }
        };
        document.head.appendChild(script);
      });
    },
    
    initReactComponents: function() {
      // Your ROI Calculator components (simplified for embed)
      window.ROICalculatorComponents = this.createROIComponents();
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
      if (this.instances.current) {
        this.closeCalculator();
      }
      
      // Create container
      const container = document.createElement('div');
      container.id = 'roi-calculator-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
      `;
      
      document.body.appendChild(container);
      
      // Render React component
      const { createElement: h, useState, useCallback } = window.React;
      const { createRoot } = window.ReactDOM;
      
      const ROICalculatorApp = () => {
        const [isOpen, setIsOpen] = useState(true);
        
        const handleClose = useCallback(() => {
          setIsOpen(false);
          setTimeout(() => {
            ROICalc.closeCalculator();
          }, 300);
        }, []);
        
        return h(window.ROICalculatorComponents.ROICalculator, {
          isOpen,
          onClose: handleClose,
          config
        });
      };
      
      const root = createRoot(container);
      root.render(h(ROICalculatorApp));
      
      this.instances.current = { container, root };
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    },
    
    closeCalculator: function() {
      if (this.instances.current) {
        const { container, root } = this.instances.current;
        root.unmount();
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        this.instances.current = null;
        document.body.style.overflow = '';
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
    },
    
    createROIComponents: function() {
      const { createElement: h, useState, useCallback, useEffect } = window.React;
      const { AnimatePresence, motion } = window.FramerMotion || {};
      
      // Simplified ROI Calculator component for embed
      const ROICalculator = ({ isOpen, onClose, config }) => {
        const [currentStep, setCurrentStep] = useState(1);
        const [formData, setFormData] = useState({
          industry: 1.0,
          revenue: 50000,
          teamSize: 10,
          hourlyCost: 75,
          leadGenHours: 15,
          followUpHours: 12,
          dataEntryHours: 8,
          schedulingHours: 6,
          reportingHours: 4,
          emailHours: 8
        });
        const [results, setResults] = useState(null);
        
        const calculateROI = useCallback(() => {
          const totalWeeklyHours = formData.leadGenHours + formData.followUpHours + 
            formData.dataEntryHours + formData.schedulingHours + 
            formData.reportingHours + formData.emailHours;
          const totalMonthlyHours = totalWeeklyHours * 4.33;
          const monthlyWastedCost = totalMonthlyHours * formData.hourlyCost;
          const automationEfficiency = 0.8;
          const hoursAutomated = Math.round(totalMonthlyHours * automationEfficiency);
          const monthlySavings = hoursAutomated * formData.hourlyCost;
          const productivityGain = totalMonthlyHours > 0 ? 
            Math.round((hoursAutomated / totalMonthlyHours) * 100 * 1.2) : 0;
          const revenueBoostPercentage = formData.industry * 0.15;
          const monthlyRevenueBoost = formData.revenue * revenueBoostPercentage;
          const totalMonthlyBenefit = monthlySavings + monthlyRevenueBoost;
          const annualBenefit = totalMonthlyBenefit * 12;
          const roi = config.serviceCost > 0 ? 
            Math.round(((annualBenefit - config.serviceCost) / config.serviceCost) * 100) : 
            Infinity;
          
          setResults({
            totalMonthlyHours,
            monthlyWastedCost,
            hoursAutomated,
            monthlySavings,
            productivityGain,
            monthlyRevenueBoost,
            roi
          });
        }, [formData, config.serviceCost]);
        
        const nextStep = () => {
          if (currentStep === 2) {
            calculateROI();
          }
          if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
          }
        };
        
        const prevStep = () => {
          if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
          }
        };
        
        const updateData = (key, value) => {
          setFormData(prev => ({ ...prev, [key]: value }));
        };
        
        if (!isOpen) return null;
        
        return h('div', {
          className: 'roi-calculator-overlay',
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 999999
          },
          onClick: onClose
        }, [
          h('div', {
            key: 'modal',
            style: {
              background: '#1f2937',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              color: 'white',
              position: 'relative'
            },
            onClick: (e) => e.stopPropagation()
          }, [
            // Close button
            h('button', {
              key: 'close',
              onClick: onClose,
              style: {
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px'
              }
            }, '×'),
            
            // Content
            h('div', { key: 'content' }, [
              h('h2', {
                key: 'title',
                style: { 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  textAlign: 'center'
                }
              }, 'AI Automation ROI Calculator'),
              
              h('p', {
                key: 'subtitle',
                style: { 
                  color: '#9ca3af', 
                  marginBottom: '32px',
                  textAlign: 'center'
                }
              }, `Step ${currentStep} of 3`),
              
              // Steps content
              currentStep === 1 && h(Step1, {
                key: 'step1',
                data: formData,
                updateData
              }),
              
              currentStep === 2 && h(Step2, {
                key: 'step2', 
                data: formData,
                updateData
              }),
              
              currentStep === 3 && results && h(Step3, {
                key: 'step3',
                results,
                config
              }),
              
              // Navigation buttons
              currentStep < 3 && h('div', {
                key: 'nav',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '32px'
                }
              }, [
                h('button', {
                  key: 'prev',
                  onClick: prevStep,
                  disabled: currentStep === 1,
                  style: {
                    background: currentStep === 1 ? '#374151' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentStep === 1 ? 0.5 : 1
                  }
                }, 'Previous'),
                
                h('button', {
                  key: 'next',
                  onClick: nextStep,
                  style: {
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }
                }, currentStep === 2 ? 'Calculate ROI' : 'Next')
              ])
            ])
          ])
        ]);
      };
      
      // Simplified Step components
      const Step1 = ({ data, updateData }) => {
        return h('div', { style: { space: '24px' } }, [
          h('h3', { 
            key: 'title',
            style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }
          }, 'Tell us about your business'),
          
          h('div', { 
            key: 'form',
            style: { display: 'grid', gap: '16px' }
          }, [
            h('div', { key: 'revenue' }, [
              h('label', { 
                style: { display: 'block', marginBottom: '8px', fontSize: '14px' }
              }, 'Monthly Revenue ($)'),
              h('input', {
                type: 'range',
                min: 10000,
                max: 500000,
                step: 5000,
                value: data.revenue,
                onChange: (e) => updateData('revenue', parseInt(e.target.value)),
                style: { width: '100%', marginBottom: '4px' }
              }),
              h('div', { 
                style: { textAlign: 'center', fontSize: '14px', color: '#9ca3af' }
              }, `$${data.revenue.toLocaleString()}`)
            ]),
            
            h('div', { key: 'team' }, [
              h('label', { 
                style: { display: 'block', marginBottom: '8px', fontSize: '14px' }
              }, 'Team Size'),
              h('input', {
                type: 'range',
                min: 1,
                max: 100,
                value: data.teamSize,
                onChange: (e) => updateData('teamSize', parseInt(e.target.value)),
                style: { width: '100%', marginBottom: '4px' }
              }),
              h('div', { 
                style: { textAlign: 'center', fontSize: '14px', color: '#9ca3af' }
              }, `${data.teamSize} people`)
            ]),
            
            h('div', { key: 'cost' }, [
              h('label', { 
                style: { display: 'block', marginBottom: '8px', fontSize: '14px' }
              }, 'Average Hourly Cost ($)'),
              h('input', {
                type: 'range',
                min: 25,
                max: 200,
                step: 5,
                value: data.hourlyCost,
                onChange: (e) => updateData('hourlyCost', parseInt(e.target.value)),
                style: { width: '100%', marginBottom: '4px' }
              }),
              h('div', { 
                style: { textAlign: 'center', fontSize: '14px', color: '#9ca3af' }
              }, `$${data.hourlyCost}/hour`)
            ])
          ])
        ]);
      };
      
      const Step2 = ({ data, updateData }) => {
        const tasks = [
          { key: 'leadGenHours', label: 'Lead Generation', max: 40 },
          { key: 'followUpHours', label: 'Customer Follow-ups', max: 30 },
          { key: 'dataEntryHours', label: 'Data Entry & Admin', max: 25 },
          { key: 'schedulingHours', label: 'Scheduling', max: 20 },
          { key: 'reportingHours', label: 'Reporting', max: 15 },
          { key: 'emailHours', label: 'Email Management', max: 20 }
        ];
        
        const totalHours = tasks.reduce((sum, task) => sum + data[task.key], 0);
        
        return h('div', {}, [
          h('h3', { 
            key: 'title',
            style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }
          }, 'Weekly Manual Hours'),
          
          h('p', {
            key: 'subtitle', 
            style: { color: '#9ca3af', marginBottom: '16px' }
          }, 'How many hours per week does your team spend on these tasks?'),
          
          h('div', {
            key: 'total',
            style: { 
              textAlign: 'center', 
              marginBottom: '24px',
              padding: '12px',
              background: '#374151',
              borderRadius: '8px'
            }
          }, `Total: ${totalHours} hours/week`),
          
          h('div', { 
            key: 'tasks',
            style: { display: 'grid', gap: '16px' }
          }, tasks.map(task => 
            h('div', { key: task.key }, [
              h('label', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px', 
                  fontSize: '14px' 
                }
              }, [
                h('span', {}, task.label),
                h('span', { style: { color: '#9ca3af' } }, `${data[task.key]} hrs`)
              ]),
              h('input', {
                type: 'range',
                min: 0,
                max: task.max,
                value: data[task.key],
                onChange: (e) => updateData(task.key, parseInt(e.target.value)),
                style: { width: '100%' }
              })
            ])
          ))
        ]);
      };
      
      const Step3 = ({ results, config }) => {
        const handleBookCall = () => {
          window.open(config.bookingUrl, '_blank');
        };
        
        return h('div', { style: { textAlign: 'center' } }, [
          h('h3', { 
            key: 'title',
            style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }
          }, 'Your ROI Potential'),
          
          h('div', {
            key: 'roi',
            style: {
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px'
            }
          }, [
            h('div', { 
              style: { fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }
            }, `${results.roi === Infinity ? '10,000+' : results.roi}%`),
            h('div', { 
              style: { fontSize: '16px', opacity: 0.9 }
            }, 'First Year ROI')
          ]),
          
          h('div', {
            key: 'metrics',
            style: { 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '32px'
            }
          }, [
            h('div', {
              key: 'savings',
              style: { 
                background: '#374151', 
                padding: '16px', 
                borderRadius: '8px' 
              }
            }, [
              h('div', { 
                style: { fontSize: '24px', fontWeight: 'bold', color: '#34d399' }
              }, `$${results.monthlySavings.toLocaleString()}`),
              h('div', { 
                style: { fontSize: '12px', color: '#9ca3af' }
              }, 'Monthly Savings')
            ]),
            
            h('div', {
              key: 'hours',
              style: { 
                background: '#374151', 
                padding: '16px', 
                borderRadius: '8px' 
              }
            }, [
              h('div', { 
                style: { fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }
              }, `${results.hoursAutomated}`),
              h('div', { 
                style: { fontSize: '12px', color: '#9ca3af' }
              }, 'Hours Automated/Month')
            ]),
            
            h('div', {
              key: 'productivity',
              style: { 
                background: '#374151', 
                padding: '16px', 
                borderRadius: '8px' 
              }
            }, [
              h('div', { 
                style: { fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }
              }, `${results.productivityGain}%`),
              h('div', { 
                style: { fontSize: '12px', color: '#9ca3af' }
              }, 'Productivity Gain')
            ]),
            
            h('div', {
              key: 'revenue',
              style: { 
                background: '#374151', 
                padding: '16px', 
                borderRadius: '8px' 
              }
            }, [
              h('div', { 
                style: { fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }
              }, `$${Math.round(results.monthlyRevenueBoost).toLocaleString()}`),
              h('div', { 
                style: { fontSize: '12px', color: '#9ca3af' }
              }, 'Revenue Boost/Month')
            ])
          ]),
          
          h('button', {
            key: 'cta',
            onClick: handleBookCall,
            style: {
              background: '#34d399',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }
          }, 'Book Free Strategy Call')
        ]);
      };
      
      return {
        ROICalculator,
        Step1,
        Step2,
        Step3
      };
    }
  };
  
  // Global API similar to Cal.com
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
          console.warn('Invalid data-roi-calc-config JSON');
        }
      }
      
      if (ROICalc.ns[namespace]) {
        ROICalc.ns[namespace].open(config);
      }
    }
  });
  
})(window, document);
