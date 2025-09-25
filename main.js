// Main JavaScript for Elan Miles Personal Website - FIXED VERSION

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    
    // Check if Typed.js is available
    if (typeof Typed !== 'undefined') {
        initTypewriter();
    } else {
        console.log('Typed.js not loaded yet, waiting...');
        setTimeout(initTypewriter, 1000);
    }
    
    // Check if p5.js is available
    if (typeof p5 !== 'undefined') {
        initParticleSystem();
    }
    
    initScrollAnimations();
    initSkillMeters();
    initLearningChart();
    initSmoothScrolling();
    initProjectFiltering();
});

// Typewriter effect for hero section
function initTypewriter() {
    const typedElement = document.getElementById('typed-text');
    if (typedElement && typeof Typed !== 'undefined') {
        try {
            const typed = new Typed('#typed-text', {
                strings: [
                    'Python Developer',
                    'C# Programmer', 
                    'Problem Solver',
                    'Code Enthusiast',
                    'Always Learning'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        } catch (error) {
            console.log('Typed.js initialization error:', error);
            // Fallback: display static text
            typedElement.textContent = 'Python & C# Developer';
        }
    }
}

// Simple particle system (fallback if p5.js fails)
function initParticleSystem() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    // Simple CSS-based particles as fallback
    if (typeof p5 === 'undefined') {
        console.log('p5.js not available, using CSS particles');
        container.innerHTML = `
            <style>
                .css-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .particle {
                    position: absolute;
                    background: rgba(245, 158, 11, 0.6);
                    border-radius: 50%;
                    animation: float 20s infinite linear;
                }
                @keyframes float {
                    0% { transform: translateY(100vh) translateX(0); }
                    100% { transform: translateY(-100px) translateX(100px); }
                }
            </style>
            <div class="css-particles" id="css-particles"></div>
        `;
        
        const particlesContainer = document.getElementById('css-particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particlesContainer.appendChild(particle);
        }
        return;
    }
    
    // Original p5.js implementation
    const sketch = (p) => {
        let particles = [];
        const numParticles = 30;
        
        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent('particle-container');
            
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(p));
            }
        };
        
        p.draw = () => {
            p.clear();
            particles.forEach(particle => {
                particle.update();
                particle.display();
            });
        };
        
        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
        
        class Particle {
            constructor(p) {
                this.p = p;
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = p.random(-0.5, 0.5);
                this.vy = p.random(-0.5, 0.5);
                this.size = p.random(2, 4);
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > this.p.width) this.vx *= -1;
                if (this.y < 0 || this.y > this.p.height) this.vy *= -1;
            }
            
            display() {
                this.p.fill(245, 158, 11, 100);
                this.p.noStroke();
                this.p.ellipse(this.x, this.y, this.size);
            }
        }
    };
    
    new p5(sketch);
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-element').forEach(el => {
        observer.observe(el);
    });
}

// Skill meters animation
function initSkillMeters() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFills = entry.target.querySelectorAll('.skill-fill');
                skillFills.forEach(fill => {
                    const width = fill.getAttribute('data-width') || '0';
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });
}

// Learning journey chart
function initLearningChart() {
    const chartElement = document.getElementById('learning-chart');
    if (!chartElement) return;
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && typeof echarts !== 'undefined') {
                initializeChart();
            }
        });
    }, { threshold: 0.3 });
    
    chartObserver.observe(chartElement);
    
    function initializeChart() {
        const myChart = echarts.init(chartElement);
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#f8f8f8' }
            },
            legend: {
                data: ['Python', 'C#', 'C++', 'PHP'],
                textStyle: { color: '#f8f8f8' },
                top: '10px'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '20%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2022', '2023', '2024', '2025'],
                axisLine: { lineStyle: { color: '#64748b' } },
                axisLabel: { color: '#f8f8f8' }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLine: { lineStyle: { color: '#64748b' } },
                axisLabel: { color: '#f8f8f8' },
                splitLine: { 
                    lineStyle: { 
                        color: '#64748b', 
                        opacity: 0.3 
                    } 
                }
            },
            series: [
                {
                    name: 'Python',
                    type: 'line',
                    data: [60, 75, 85, 90],
                    lineStyle: { color: '#3b82f6' },
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: 'C#',
                    type: 'line', 
                    data: [40, 60, 75, 85],
                    lineStyle: { color: '#8b5cf6' },
                    itemStyle: { color: '#8b5cf6' }
                },
                {
                    name: 'C++',
                    type: 'line',
                    data: [20, 30, 50, 70],
                    lineStyle: { color: '#06b6d4' },
                    itemStyle: { color: '#06b6d4' }
                },
                {
                    name: 'PHP',
                    type: 'line',
                    data: [50, 65, 70, 75],
                    lineStyle: { color: '#8b5a9f' },
                    itemStyle: { color: '#8b5a9f' }
                }
            ]
        };
        
        myChart.setOption(option);
        
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Project filtering (for projects page)
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-item');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                if (categories && (filter === 'all' || categories.includes(filter))) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Navigation background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
    }
});

// Utility function for copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const message = document.createElement('div');
        message.textContent = 'Copied to clipboard!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }).catch(err => {
        console.log('Copy failed: ', err);
    });
}

// Fallback for browsers that don't support IntersectionObserver
if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported, using fallback');
    setTimeout(() => {
        document.querySelectorAll('.reveal-element').forEach(el => {
            el.classList.add('revealed');
        });
    }, 500);
}