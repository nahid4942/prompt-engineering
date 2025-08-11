// ==========================================
// TEA TIME TYCOON - ENHANCED EDITION SCRIPT
// ==========================================

class TeaGame {
  constructor() {
    this.initializeGameState();
    this.initializeUpgrades();
    this.initializeAchievements();
    this.initializeSoundSystem();
    this.initializeWeatherSystem();
    this.initializeDailyChallenges();
    this.initializeReputation();
    this.bindEvents();
    this.startGameLoop();
    this.loadGame();
    this.showWelcomeMessage();
  }

  initializeGameState() {
    this.money = 10;
    this.level = 1;
    this.recipe = [];
    this.customers = [];
    this.nextCustomerId = 1;
    this.isBoiling = false;
    this.boilStartTime = 0;
    this.boilDuration = 3000;
    this.servedCount = 0;
    this.totalEarnings = 0;
    this.gameTime = 0;
    this.customerStreak = 0;
    this.bestStreak = 0;
    this.happyCustomers = 0;
    this.perfectServes = 0;
    this.soundEnabled = true;
    this.gameStartTime = Date.now();
    this.lastCustomerTime = 0;
    this.isPaused = false;
    this.lastSaveTime = Date.now();
    this.steamParticles = [];
    this.autoServeEnabled = false;
    this.recipeBookOpen = false;
    
    // Advanced features
    this.reputation = 3;
    this.vipCustomersServed = 0;
    this.criticsServed = 0;
    this.dailyProgress = 0;
    this.weatherEffects = true;
    this.specialEventsEnabled = true;
    
    // Game balance
    this.baseCustomerInterval = 4000;
    this.customerTimeout = 15000;
    this.maxCustomers = 8;
    
    // Analytics
    this.analytics = {
      efficiency: 85,
      customerRating: 4.2,
      peakHour: '2-4 PM',
      bestseller: 'Chai Tea',
      totalCustomersToday: 0,
      perfectStreakToday: 0
    };
    
    // Tea recipes with enhanced pricing and complexity
    this.teaTypes = {
      'classic': { price: 3, ingredients: ['tea'], difficulty: 1, unlockedAt: 1 },
      'lemon': { price: 4, ingredients: ['tea', 'lemon'], difficulty: 1, unlockedAt: 1 },
      'honey': { price: 4, ingredients: ['tea', 'honey'], difficulty: 1, unlockedAt: 1 },
      'mint': { price: 5, ingredients: ['tea', 'mint'], difficulty: 2, unlockedAt: 2 },
      'spiced': { price: 6, ingredients: ['tea', 'spices'], difficulty: 2, unlockedAt: 2 },
      'milky': { price: 5, ingredients: ['tea', 'milk'], difficulty: 1, unlockedAt: 1 },
      'premium': { price: 8, ingredients: ['tea', 'lemon', 'honey'], difficulty: 3, unlockedAt: 3 },
      'royal': { price: 10, ingredients: ['tea', 'mint', 'spices'], difficulty: 3, unlockedAt: 3 },
      'cardamom': { price: 12, ingredients: ['tea', 'cardamom', 'milk'], difficulty: 4, unlockedAt: 4 },
      'rose': { price: 15, ingredients: ['tea', 'rose', 'honey'], difficulty: 4, unlockedAt: 4 },
      'ultimate': { price: 20, ingredients: ['tea', 'lemon', 'honey', 'mint', 'spices'], difficulty: 5, unlockedAt: 5 },
      'imperial': { price: 25, ingredients: ['tea', 'cardamom', 'rose', 'milk', 'honey'], difficulty: 6, unlockedAt: 6 }
    };

    // Customer types with enhanced AI
    this.customerTypes = {
      regular: { emoji: '🧑‍💼', patience: 15, tip: 1.2, preferences: ['classic', 'milky'], mood: 'neutral', frequency: 0.4 },
      student: { emoji: '👩‍🎓', patience: 20, tip: 1.0, preferences: ['lemon', 'honey'], mood: 'happy', frequency: 0.3 },
      elderly: { emoji: '🧓', patience: 25, tip: 1.5, preferences: ['mint', 'spiced'], mood: 'calm', frequency: 0.2 },
      vip: { emoji: '👑', patience: 8, tip: 3.0, preferences: ['ultimate', 'imperial'], mood: 'demanding', frequency: 0.05 },
      critic: { emoji: '👨‍💻', patience: 6, tip: 5.0, preferences: ['premium', 'royal'], mood: 'critical', frequency: 0.03 },
      tourist: { emoji: '🧳', patience: 12, tip: 2.0, preferences: ['cardamom', 'rose'], mood: 'curious', frequency: 0.15 }
    };
  }

  initializeUpgrades() {
    this.upgrades = {
      faster: { level: 0, maxLevel: 5, baseCost: 15, name: "Faster Brewing", desc: "Reduces brewing time", effect: 0.8 },
      capacity: { level: 0, maxLevel: 3, baseCost: 25, name: "Bigger Kettle", desc: "Serve more customers", effect: 2 },
      efficiency: { level: 0, maxLevel: 5, baseCost: 20, name: "Better Ingredients", desc: "Higher profits per tea", effect: 1.2 },
      attraction: { level: 0, maxLevel: 4, baseCost: 30, name: "Marketing", desc: "Attract customers faster", effect: 0.85 },
      automation: { level: 0, maxLevel: 3, baseCost: 75, name: "Automation", desc: "Auto-serve perfect matches", effect: 0.25 },
      quality: { level: 0, maxLevel: 5, baseCost: 50, name: "Quality Control", desc: "Improves reputation and tips", effect: 1.1 }
    };
  }

  initializeWeatherSystem() {
    this.weather = {
      current: 'sunny',
      effect: 1.0,
      changeTime: 0,
      duration: 180000, // 3 minutes
      types: {
        sunny: { icon: '☀️', name: 'Sunny', effect: 1.2, desc: '+20% customer happiness' },
        cloudy: { icon: '☁️', name: 'Cloudy', effect: 1.0, desc: 'Normal conditions' },
        rainy: { icon: '🌧️', name: 'Rainy', effect: 0.8, desc: '-20% customer spawn rate' },
        stormy: { icon: '⛈️', name: 'Stormy', effect: 0.6, desc: 'Customers more impatient' },
        snowy: { icon: '❄️', name: 'Snowy', effect: 1.5, desc: '+50% tea prices (hot drinks popular)' }
      }
    };
    this.updateWeatherDisplay();
  }

  initializeDailyChallenges() {
    this.dailyChallenge = {
      description: 'Serve 50 customers with perfect recipes',
      target: 50,
      progress: 0,
      reward: { money: 100, ingredient: 'cardamom' },
      timeLeft: 86400000, // 24 hours
      completed: false
    };
    
    // Randomize daily challenge
    const challenges = [
      { desc: 'Serve 50 customers with perfect recipes', target: 50, type: 'perfect' },
      { desc: 'Earn $500 in a single session', target: 500, type: 'money' },
      { desc: 'Achieve a 15-customer streak', target: 15, type: 'streak' },
      { desc: 'Serve 10 VIP customers', target: 10, type: 'vip' },
      { desc: 'Make 25 customers happy', target: 25, type: 'happy' }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    this.dailyChallenge.description = challenge.desc;
    this.dailyChallenge.target = challenge.target;
    this.dailyChallenge.type = challenge.type;
  }

  initializeReputation() {
    this.reputationSystem = {
      level: 3,
      points: 0,
      maxLevel: 5,
      benefits: {
        1: { multiplier: 0.8, desc: 'Poor reputation - 20% less tips' },
        2: { multiplier: 0.9, desc: 'Below average - 10% less tips' },
        3: { multiplier: 1.0, desc: 'Average reputation' },
        4: { multiplier: 1.2, desc: 'Good reputation - 20% bonus tips' },
        5: { multiplier: 1.5, desc: 'Excellent reputation - 50% bonus tips' }
      }
    };
  }

  initializeAchievements() {
    this.achievements = {
      firstSale: { unlocked: false, title: "First Sale!", desc: "Serve your first customer", reward: 10 },
      bigSpender: { unlocked: false, title: "Tea Baron", desc: "Earn 100 coins", reward: 25 },
      speedMaster: { unlocked: false, title: "Speed Demon", desc: "Serve 5 customers in a row", reward: 50 },
      richTycoon: { unlocked: false, title: "Tea Tycoon", desc: "Earn 500 coins total", reward: 100 },
      customerLove: { unlocked: false, title: "Customer Favorite", desc: "Make 10 customers happy", reward: 30 },
      upgradeAddict: { unlocked: false, title: "Tech Enthusiast", desc: "Buy 5 upgrades", reward: 75 },
      ultimateTea: { unlocked: false, title: "Master Brewer", desc: "Craft the ultimate tea blend", reward: 200 },
      streakKing: { unlocked: false, title: "Streak Master", desc: "Achieve a 10 customer streak", reward: 150 },
      vipService: { unlocked: false, title: "VIP Service", desc: "Serve 5 VIP customers perfectly", reward: 300 },
      weatherMaster: { unlocked: false, title: "All Weather Expert", desc: "Serve customers in all weather types", reward: 250 },
      criticsChoice: { unlocked: false, title: "Critic's Choice", desc: "Satisfy 3 food critics", reward: 500 },
      dailyChampion: { unlocked: false, title: "Daily Champion", desc: "Complete a daily challenge", reward: 100 },
      reputationMax: { unlocked: false, title: "Five Star Master", desc: "Reach maximum reputation", reward: 1000 },
      automation: { unlocked: false, title: "Automation Expert", desc: "Use auto-serve for 50 customers", reward: 200 }
    };
  }

  initializeSoundSystem() {
    // Simple sound system using Web Audio API
    this.audioContext = null;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
  }

  playSound(frequency, duration = 100, type = 'sine') {
    if (!this.soundEnabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('Sound playback failed');
    }
  }

  bindEvents() {
    // Ingredient buttons
    document.querySelectorAll('.ing-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ingredient = btn.dataset.ing;
        if (this.isPaused) return;
        this.addIngredient(ingredient);
      });
    });

    // Boil and serve buttons
    document.getElementById('boil').addEventListener('click', () => {
      if (!this.isPaused) this.startBoiling();
    });
    
    document.getElementById('serve').addEventListener('click', () => {
      if (!this.isPaused) this.serveTea();
    });

    // Customer clicking
    document.getElementById('customers').addEventListener('click', (e) => {
      if (e.target.closest('.customer') && !this.isPaused) {
        this.selectCustomer(e.target.closest('.customer'));
      }
    });

    // Upgrade buttons
    document.querySelectorAll('.upgrade button').forEach(btn => {
      btn.addEventListener('click', () => {
        const upgradeType = btn.closest('.upgrade').dataset.upgrade;
        this.buyUpgrade(upgradeType);
      });
    });

    // Recipe book button
    document.getElementById('recipe-book').addEventListener('click', () => {
      this.toggleRecipeBook();
    });

    // Clear recipe button
    document.getElementById('clear-recipe').addEventListener('click', () => {
      if (!this.isPaused && !this.isBoiling) {
        this.recipe = [];
        this.updateDisplay();
        this.log('🗑️ Recipe cleared', 'info');
        this.playSound(400, 100);
      }
    });

    // Auto-serve toggle
    document.getElementById('auto-serve').addEventListener('click', () => {
      if (this.upgrades.automation.level > 0) {
        this.autoServeEnabled = !this.autoServeEnabled;
        const btn = document.getElementById('auto-serve');
        btn.classList.toggle('active', this.autoServeEnabled);
        this.log(`🤖 Auto-serve ${this.autoServeEnabled ? 'enabled' : 'disabled'}`, 'info');
        this.playSound(600, 150);
      } else {
        this.log('❌ Need Automation upgrade first!', 'error');
        this.playSound(200, 300);
      }
    });

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
      this.toggleRecipeBook();
    });

    // Close modal on background click
    document.getElementById('recipe-modal').addEventListener('click', (e) => {
      if (e.target.id === 'recipe-modal') {
        this.toggleRecipeBook();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isPaused && e.key !== ' ') return;
      
      switch(e.key) {
        case '1': this.addIngredient('tea'); break;
        case '2': this.addIngredient('lemon'); break;
        case '3': this.addIngredient('honey'); break;
        case '4': this.addIngredient('mint'); break;
        case '5': this.addIngredient('spices'); break;
        case '6': this.addIngredient('milk'); break;
        case 'b': case 'B': this.startBoiling(); break;
        case 's': case 'S': this.serveTea(); break;
        case ' ': e.preventDefault(); this.togglePause(); break;
        case 'm': case 'M': this.toggleSound(); break;
      }
    });

    // Auto-save
    setInterval(() => this.saveGame(), 30000);
    
    // Weather system
    setInterval(() => this.updateWeather(), 60000); // Every minute
    
    // Daily challenge timer
    setInterval(() => this.updateDailyChallenge(), 1000);
    
    // Special events
    setInterval(() => this.triggerSpecialEvent(), 120000); // Every 2 minutes
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
      pauseBtn.classList.toggle('active', this.isPaused);
    }
    this.log(this.isPaused ? '⏸️ Game Paused' : '▶️ Game Resumed', 'info');
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const soundBtn = document.getElementById('soundToggle');
    soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
    this.playSound(this.soundEnabled ? 800 : 400, 150);
    this.log(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, 'info');
  }

  addIngredient(ingredient) {
    if (this.isBoiling) {
      this.log('⚠️ Wait for current tea to finish brewing!', 'warning');
      this.playSound(200, 300);
      return;
    }

    this.recipe.push(ingredient);
    this.playSound(600, 100);
    this.log(`Added ${ingredient} to recipe`, 'info');
    this.updateDisplay();
    
    // Visual feedback
    const btn = document.querySelector(`[data-ing="${ingredient}"]`);
    if (btn) {
      btn.classList.add('bounce');
      setTimeout(() => btn.classList.remove('bounce'), 600);
    }
  }

  startBoiling() {
    if (this.recipe.length === 0) {
      this.log('❌ Add ingredients first!', 'error');
      this.playSound(200, 500);
      return;
    }

    if (this.isBoiling) {
      this.log('⚠️ Already brewing!', 'warning');
      return;
    }

    this.isBoiling = true;
    this.boilStartTime = Date.now();
    this.playSound(400, 200);
    this.log(`🔥 Started brewing: ${this.recipe.join(', ')}`, 'info');
    this.updateDisplay();
    this.createSteamEffect();
  }

  createSteamEffect() {
    const kettle = document.querySelector('.kettle');
    if (!kettle || !this.isBoiling) return;

    // Create steam particles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.isBoiling) return;
        
        const steam = document.createElement('div');
        steam.className = 'steam';
        steam.style.left = Math.random() * 80 + 10 + '%';
        steam.style.top = '20%';
        kettle.appendChild(steam);
        
        setTimeout(() => {
          if (steam.parentNode) steam.remove();
        }, 2000);
      }, i * 500);
    }

    if (this.isBoiling) {
      setTimeout(() => this.createSteamEffect(), 1000);
    }
  }

  getBoilTime() {
    return this.boilDuration * Math.pow(this.upgrades.faster.effect, this.upgrades.faster.level);
  }

  serveTea() {
    if (!this.isBoiling) {
      this.log('❌ No tea brewing!', 'error');
      this.playSound(200, 300);
      return;
    }

    const boilTime = this.getBoilTime();
    const elapsed = Date.now() - this.boilStartTime;
    
    if (elapsed < boilTime) {
      this.log(`⏱️ Tea needs ${Math.ceil((boilTime - elapsed) / 1000)}s more!`, 'warning');
      this.playSound(300, 200);
      return;
    }

    // Find best matching customer
    const customer = this.findBestCustomer();
    if (!customer) {
      this.log('❌ No customers waiting!', 'error');
      this.playSound(200, 400);
      this.resetKettle();
      return;
    }

    this.serveCustomer(customer);
  }

  findBestCustomer() {
    if (this.customers.length === 0) return null;

    // Try to find exact match first
    let bestCustomer = this.customers.find(c => 
      this.arraysEqual(c.order.sort(), this.recipe.sort())
    );

    // If no exact match, find partial match
    if (!bestCustomer) {
      bestCustomer = this.customers.find(c => 
        c.order.every(ingredient => this.recipe.includes(ingredient))
      );
    }

    // If still no match, serve to any customer (with penalty)
    if (!bestCustomer) {
      bestCustomer = this.customers[0];
    }

    return bestCustomer;
  }

  serveCustomer(customer) {
    const exact = this.arraysEqual(customer.order.sort(), this.recipe.sort());
    const partial = !exact && customer.order.every(ingredient => this.recipe.includes(ingredient));
    
    let earnings = 0;
    let message = '';
    let logType = 'success';

    if (exact) {
      earnings = this.getTeaPrice(customer.order) * Math.pow(this.upgrades.efficiency.effect, this.upgrades.efficiency.level);
      message = `✅ Perfect match! Earned $${earnings.toFixed(2)}`;
      this.customerStreak++;
      this.playSound(800, 300);
      
      // Check for happy customer
      if (customer.timeLeft > 5) {
        this.happyCustomers++;
        customer.element.classList.add('happy');
        earnings *= 1.5;
        message += ' (Happy customer bonus!)';
      }
    } else if (partial) {
      earnings = this.getTeaPrice(customer.order) * 0.7 * Math.pow(this.upgrades.efficiency.effect, this.upgrades.efficiency.level);
      message = `⚠️ Close enough! Earned $${earnings.toFixed(2)}`;
      this.customerStreak = Math.floor(this.customerStreak / 2);
      this.playSound(600, 200);
      logType = 'warning';
    } else {
      earnings = 1;
      message = `❌ Wrong order! Customer disappointed. Earned $${earnings}`;
      this.customerStreak = 0;
      this.playSound(300, 400);
      logType = 'error';
    }

    // Streak bonus
    if (this.customerStreak >= 3) {
      const streakBonus = this.customerStreak * 0.1;
      earnings *= (1 + streakBonus);
      message += ` (${this.customerStreak}x streak bonus!)`;
    }

    this.money += earnings;
    this.totalEarnings += earnings;
    this.servedCount++;
    
    if (this.customerStreak > this.bestStreak) {
      this.bestStreak = this.customerStreak;
    }

    this.log(message, logType);
    this.removeCustomer(customer);
    this.resetKettle();
    this.updateDisplay();
    this.checkAchievements();
  }

  getTeaPrice(ingredients) {
    // Find the tea type that matches these ingredients
    for (const [type, tea] of Object.entries(this.teaTypes)) {
      if (this.arraysEqual(ingredients.sort(), tea.ingredients.sort())) {
        return tea.price;
      }
    }
    // Default price for unrecognized combinations
    return ingredients.length * 2;
  }

  arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  resetKettle() {
    this.isBoiling = false;
    this.recipe = [];
    this.boilStartTime = 0;
    // Clear any remaining steam effects
    document.querySelectorAll('.steam').forEach(steam => steam.remove());
  }

  removeCustomer(customer) {
    const index = this.customers.indexOf(customer);
    if (index > -1) {
      this.customers.splice(index, 1);
      customer.element.classList.add('fade-in');
      setTimeout(() => {
        if (customer.element.parentNode) {
          customer.element.remove();
        }
      }, 300);
    }
  }

  selectCustomer(element) {
    // Remove previous selections
    document.querySelectorAll('.customer').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    
    const customerId = parseInt(element.dataset.id);
    const customer = this.customers.find(c => c.id === customerId);
    
    if (customer) {
      this.log(`👤 Selected customer wants: ${customer.order.join(', ')}`, 'info');
      this.playSound(500, 100);
    }
  }

  spawnCustomer() {
    if (this.customers.length >= this.getMaxCustomers() || this.isPaused) return;

    // Apply weather effect to spawn rate
    if (this.weather.current === 'rainy' && Math.random() < 0.3) return;
    if (this.weather.current === 'stormy' && Math.random() < 0.5) return;

    // Weighted customer type selection
    const types = Object.keys(this.customerTypes);
    let selectedType = 'regular';
    
    const rand = Math.random();
    let cumulative = 0;
    
    for (const type of types) {
      cumulative += this.customerTypes[type].frequency;
      if (rand <= cumulative) {
        selectedType = type;
        break;
      }
    }

    const customerType = this.customerTypes[selectedType];
    
    // Select appropriate tea for this customer type
    const availableTeas = customerType.preferences.filter(tea => 
      this.teaTypes[tea] && this.teaTypes[tea].unlockedAt <= this.level
    );
    
    // Fallback to basic teas if no preferences available
    if (availableTeas.length === 0) {
      availableTeas.push('classic', 'lemon', 'honey');
    }
    
    const selectedTea = availableTeas[Math.floor(Math.random() * availableTeas.length)];
    const tea = this.teaTypes[selectedTea];
    
    if (!tea) return;
    
    const customer = {
      id: this.nextCustomerId++,
      type: selectedType,
      emoji: customerType.emoji,
      order: [...tea.ingredients],
      originalOrder: [...tea.ingredients],
      timeLeft: customerType.patience + (this.upgrades.capacity.level * 2),
      patience: customerType.patience,
      tip: customerType.tip,
      mood: customerType.mood,
      teaName: selectedTea,
      element: null
    };

    // Apply weather effects
    if (this.weather.current === 'stormy') {
      customer.timeLeft *= 0.7; // More impatient in storm
    } else if (this.weather.current === 'sunny') {
      customer.mood = 'happy';
    }

    const customerEl = this.createCustomerElement(customer);
    customer.element = customerEl;
    this.customers.push(customer);

    document.getElementById('customers').appendChild(customerEl);
    this.playSound(450, 150);
    this.log(`${customerType.emoji} Customer wants ${selectedTea} tea`, 'info');
  }

  getRandomIngredients(count) {
    const ingredients = ['lemon', 'honey', 'mint', 'spices', 'milk'];
    const selected = [];
    for (let i = 0; i < count && selected.length < ingredients.length; i++) {
      const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
      if (!selected.includes(ingredient)) {
        selected.push(ingredient);
      }
    }
    return selected;
  }

  createCustomerElement(customer) {
    const div = document.createElement('div');
    div.className = 'customer slide-in';
    div.dataset.id = customer.id;
    
    // Add special styling for customer types
    if (customer.type === 'vip') {
      div.classList.add('vip');
    } else if (customer.type === 'critic') {
      div.classList.add('critic');
    } else if (customer.type === 'tourist') {
      div.classList.add('tourist');
    } else if (customer.type === 'regular' && customer.mood === 'happy') {
      div.classList.add('regular');
    }
    
    div.innerHTML = `
      <div style="font-size: 28px; margin-bottom: 4px;">${customer.emoji}</div>
      <div style="font-size: 10px; color: #666; text-align: center; line-height: 1.2;">
        ${customer.teaName || customer.order.join(' + ')}
      </div>
      <div class="cust-time">${Math.ceil(customer.timeLeft)}s</div>
    `;
    
    return div;
  }

  getMaxCustomers() {
    return this.maxCustomers + (this.upgrades.capacity.level * this.upgrades.capacity.effect);
  }

  getCustomerInterval() {
    return this.baseCustomerInterval * Math.pow(this.upgrades.attraction.effect, this.upgrades.attraction.level);
  }

  buyUpgrade(type) {
    const upgrade = this.upgrades[type];
    if (!upgrade || upgrade.level >= upgrade.maxLevel) {
      this.log('❌ Upgrade maxed out!', 'warning');
      return;
    }

    const cost = this.getUpgradeCost(type);
    if (this.money < cost) {
      this.log(`❌ Need $${cost} for ${upgrade.name}!`, 'error');
      this.playSound(200, 300);
      return;
    }

    this.money -= cost;
    upgrade.level++;
    this.playSound(700, 400);
    this.log(`✅ Bought ${upgrade.name} Level ${upgrade.level}!`, 'success');
    this.updateDisplay();
    this.checkAchievements();
  }

  getUpgradeCost(type) {
    const upgrade = this.upgrades[type];
    return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
  }

  checkAchievements() {
    const checks = [
      ['firstSale', () => this.servedCount >= 1],
      ['bigSpender', () => this.money >= 100],
      ['speedMaster', () => this.customerStreak >= 5],
      ['richTycoon', () => this.totalEarnings >= 500],
      ['customerLove', () => this.happyCustomers >= 10],
      ['upgradeAddict', () => Object.values(this.upgrades).reduce((sum, u) => sum + u.level, 0) >= 5],
      ['ultimateTea', () => this.recipe.length >= 5 && this.recipe.includes('tea')],
      ['streakKing', () => this.bestStreak >= 10]
    ];

    checks.forEach(([key, condition]) => {
      if (!this.achievements[key].unlocked && condition()) {
        this.unlockAchievement(key);
      }
    });
  }

  unlockAchievement(key) {
    const achievement = this.achievements[key];
    achievement.unlocked = true;
    this.showAchievement(achievement);
    this.playSound(1000, 500);
    this.log(`🏆 Achievement: ${achievement.title}`, 'success');
  }

  showAchievement(achievement) {
    const achievementEl = document.querySelector('.achievement');
    achievementEl.querySelector('.title').textContent = achievement.title;
    achievementEl.querySelector('.desc').textContent = achievement.desc;
    achievementEl.classList.add('show');
    
    setTimeout(() => {
      achievementEl.classList.remove('show');
    }, 4000);
  }

  updateDisplay() {
    // Update money and basic stats
    document.getElementById('money').textContent = `$${this.money.toFixed(2)}`;
    document.getElementById('level').textContent = this.level;
    document.getElementById('served').textContent = this.servedCount;
    document.getElementById('streak').textContent = this.customerStreak;
    
    // Update reputation display
    const reputationEl = document.getElementById('reputation');
    const stars = '⭐'.repeat(this.reputationSystem.level) + '☆'.repeat(5 - this.reputationSystem.level);
    reputationEl.textContent = stars;
    
    // Update kettle display
    const kettle = document.querySelector('.kettle');
    const contents = kettle.querySelector('.contents');
    const progressBar = kettle.querySelector('.progress-bar');

    if (this.recipe.length > 0) {
      contents.textContent = this.recipe.join(' + ');
    } else {
      contents.textContent = 'Empty kettle';
    }

    // Update kettle state
    kettle.className = 'kettle';
    if (this.isBoiling) {
      const elapsed = Date.now() - this.boilStartTime;
      const boilTime = this.getBoilTime();
      const progress = Math.min(elapsed / boilTime, 1);
      
      if (progress < 1) {
        kettle.classList.add('boiling');
        progressBar.style.width = (progress * 100) + '%';
      } else {
        kettle.classList.add('ready');
        progressBar.style.width = '100%';
      }
    } else {
      progressBar.style.width = '0%';
    }

    // Update serve button
    const serveBtn = document.getElementById('serve');
    const canServe = this.isBoiling && this.isTeaReady();
    serveBtn.disabled = !canServe;

    // Update ingredient counts and visibility
    document.querySelectorAll('.ing-btn').forEach(btn => {
      const ingredient = btn.dataset.ing;
      const countEl = btn.querySelector('.ing-count');
      const count = this.recipe.filter(r => r === ingredient).length;
      
      // Show special ingredients based on level
      if ((ingredient === 'cardamom' && this.level >= 4) || 
          (ingredient === 'rose' && this.level >= 4)) {
        btn.style.display = 'flex';
      }
      
      if (count > 0) {
        if (!countEl) {
          const counter = document.createElement('div');
          counter.className = 'ing-count';
          btn.appendChild(counter);
        }
        btn.querySelector('.ing-count').textContent = count;
        btn.classList.add('selected');
        countEl.style.display = 'flex';
      } else {
        if (countEl) countEl.style.display = 'none';
        btn.classList.remove('selected');
      }
    });

    // Update upgrades
    Object.keys(this.upgrades).forEach(type => {
      const upgrade = this.upgrades[type];
      const upgradeEl = document.querySelector(`[data-upgrade="${type}"]`);
      if (!upgradeEl) return;

      const btn = upgradeEl.querySelector('button');
      const cost = this.getUpgradeCost(type);
      
      if (upgrade.level >= upgrade.maxLevel) {
        upgradeEl.classList.add('maxed');
        btn.textContent = 'MAXED';
        btn.disabled = true;
      } else {
        upgradeEl.classList.remove('maxed');
        btn.textContent = `$${cost}`;
        btn.disabled = this.money < cost;
      }

      upgradeEl.querySelector('h4').textContent = `${upgrade.name} (${upgrade.level}/${upgrade.maxLevel})`;
    });

    // Update customer timers and moods
    this.customers.forEach(customer => {
      const timeEl = customer.element.querySelector('.cust-time');
      timeEl.textContent = Math.ceil(customer.timeLeft) + 's';
      
      if (customer.timeLeft <= 3) {
        customer.element.classList.add('urgent');
        timeEl.classList.add('urgent');
      } else if (customer.timeLeft > customer.patience * 0.8) {
        customer.element.classList.add('happy');
      }
      
      // Apply weather effects to display
      if (this.weather.current === 'sunny' && !customer.element.classList.contains('happy')) {
        customer.element.classList.add('happy');
      }
    });

    // Update stats
    this.updateStats();
    this.updateAnalytics();
  }

  updateStats() {
    const stats = {
      'total-earned': this.totalEarnings.toFixed(2),
      'customers-served': this.servedCount,
      'current-streak': this.customerStreak,
      'best-streak': this.bestStreak,
      'happy-customers': this.happyCustomers,
      'perfect-serves': this.perfectServes,
      'reputation-level': this.reputationSystem.level,
      'game-time': Math.floor((Date.now() - this.gameStartTime) / 1000)
    };

    // Calculate daily progress percentage
    const dailyPercent = Math.floor((this.dailyChallenge.progress / this.dailyChallenge.target) * 100);
    stats['daily-progress'] = dailyPercent + '%';

    Object.entries(stats).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  updateAnalytics() {
    // Calculate efficiency rate
    const efficiency = this.servedCount > 0 ? 
      Math.floor((this.perfectServes / this.servedCount) * 100) : 85;
    
    // Calculate customer rating
    const rating = Math.max(1, Math.min(5, 3 + (this.reputationSystem.level - 3) * 0.5));
    
    this.analytics.efficiency = efficiency;
    this.analytics.customerRating = rating;
    
    // Update display
    document.getElementById('efficiency').textContent = efficiency + '%';
    document.getElementById('rating').textContent = rating.toFixed(1) + '⭐';
    document.getElementById('peak-time').textContent = this.analytics.peakHour;
    document.getElementById('bestseller').textContent = this.analytics.bestseller;
  }

  checkLevelUp() {
    const requiredEarnings = this.level * 100; // Increased requirement
    if (this.totalEarnings >= requiredEarnings && this.level < 10) {
      this.level++;
      this.playSound(1000, 500);
      this.log(`🎉 Level up! Now level ${this.level}!`, 'success');
      
      // Unlock new features based on level
      if (this.level === 2) {
        this.log('🔓 Unlocked: Mint and Spices ingredients!', 'success');
      } else if (this.level === 3) {
        this.log('🔓 Unlocked: Premium tea recipes!', 'success');
      } else if (this.level === 4) {
        this.log('🔓 Unlocked: Special ingredients (Cardamom, Rose)!', 'success');
        document.querySelector('[data-ing="cardamom"]').style.display = 'flex';
        document.querySelector('[data-ing="rose"]').style.display = 'flex';
      } else if (this.level === 5) {
        this.log('🔓 Unlocked: Ultimate tea recipes!', 'success');
      }
      
      // Visual level up effect
      document.querySelector('header').classList.add('pulse');
      setTimeout(() => document.querySelector('header').classList.remove('pulse'), 2000);
    }
  }

  isTeaReady() {
    if (!this.isBoiling) return false;
    const elapsed = Date.now() - this.boilStartTime;
    return elapsed >= this.getBoilTime();
  }

  gameLoop() {
    if (this.isPaused) return;

    this.gameTime += 100;

    // Update customer timers
    this.customers.forEach(customer => {
      customer.timeLeft -= 0.1;
      if (customer.timeLeft <= 0) {
        this.log(`😞 Customer ${customer.emoji} left disappointed!`, 'error');
        this.removeCustomer(customer);
        this.customerStreak = 0;
        this.updateReputation(-1);
        this.playSound(250, 200);
      }
    });

    // Spawn new customers
    if (Date.now() - this.lastCustomerTime > this.getCustomerInterval()) {
      this.spawnCustomer();
      this.lastCustomerTime = Date.now();
    }

    // Auto-serve logic
    if (this.autoServeEnabled && this.isBoiling && this.isTeaReady()) {
      const customer = this.findBestCustomer();
      if (customer && this.arraysEqual(customer.order.sort(), this.recipe.sort())) {
        this.serveCustomer(customer);
        this.analytics.totalCustomersToday++;
      }
    }

    this.updateDisplay();
  }

  updateWeather() {
    if (!this.weatherEffects) return;
    
    const weatherTypes = Object.keys(this.weather.types);
    const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    if (newWeather !== this.weather.current) {
      this.weather.current = newWeather;
      this.weather.effect = this.weather.types[newWeather].effect;
      this.updateWeatherDisplay();
      this.createWeatherEffects(newWeather);
      this.log(`🌤️ Weather changed to ${this.weather.types[newWeather].name}`, 'info');
    }
  }

  updateWeatherDisplay() {
    const weather = this.weather.types[this.weather.current];
    document.getElementById('weather-icon').textContent = weather.icon;
    document.getElementById('weather-type').textContent = weather.name;
    document.getElementById('weather-effect').textContent = weather.desc;
  }

  createWeatherEffects(weatherType) {
    // Clear existing effects
    document.querySelectorAll('.rain-drop, .snow-flake, .lightning-flash').forEach(el => el.remove());
    
    switch (weatherType) {
      case 'rainy':
        this.createRainEffect();
        break;
      case 'stormy':
        this.createStormEffect();
        break;
      case 'snowy':
        this.createSnowEffect();
        break;
    }
  }

  createRainEffect() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        document.body.appendChild(drop);
        
        setTimeout(() => drop.remove(), 1500);
      }, i * 100);
    }
  }

  createStormEffect() {
    this.createRainEffect();
    
    // Lightning flash
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 2000);
    this.playSound(800, 200);
  }

  createSnowEffect() {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.textContent = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(flake);
        
        setTimeout(() => flake.remove(), 5000);
      }, i * 200);
    }
  }

  updateDailyChallenge() {
    if (this.dailyChallenge.completed) return;
    
    this.dailyChallenge.timeLeft -= 1000;
    
    // Update timer display
    const hours = Math.floor(this.dailyChallenge.timeLeft / 3600000);
    const minutes = Math.floor((this.dailyChallenge.timeLeft % 3600000) / 60000);
    const seconds = Math.floor((this.dailyChallenge.timeLeft % 60000) / 1000);
    
    document.querySelector('.challenge-timer').textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress
    const progressPercent = (this.dailyChallenge.progress / this.dailyChallenge.target) * 100;
    document.querySelector('.progress-fill').style.width = progressPercent + '%';
    document.querySelector('.progress-text').textContent = 
      `${this.dailyChallenge.progress}/${this.dailyChallenge.target}`;
    
    // Check completion
    if (this.dailyChallenge.progress >= this.dailyChallenge.target) {
      this.completeDailyChallenge();
    }
    
    // Reset if time runs out
    if (this.dailyChallenge.timeLeft <= 0) {
      this.initializeDailyChallenges();
    }
  }

  completeDailyChallenge() {
    this.dailyChallenge.completed = true;
    this.money += this.dailyChallenge.reward.money;
    
    // Unlock special ingredient
    if (this.dailyChallenge.reward.ingredient) {
      document.querySelector(`[data-ing="${this.dailyChallenge.reward.ingredient}"]`).style.display = 'flex';
      this.log(`🎉 Daily challenge complete! Unlocked ${this.dailyChallenge.reward.ingredient}!`, 'success');
    }
    
    this.log(`🏆 Daily challenge complete! Earned $${this.dailyChallenge.reward.money}!`, 'success');
    this.unlockAchievement('dailyChampion');
    this.playSound(1200, 800);
  }

  triggerSpecialEvent() {
    if (!this.specialEventsEnabled || Math.random() > 0.3) return;
    
    const events = [
      () => this.spawnVipCustomer(),
      () => this.spawnCriticCustomer(),
      () => this.rushHour(),
      () => this.happyHour(),
      () => this.ingredientSale()
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    event();
  }

  spawnVipCustomer() {
    const vipAlert = document.getElementById('vip-alert');
    vipAlert.style.display = 'block';
    
    setTimeout(() => {
      vipAlert.style.display = 'none';
    }, 5000);
    
    // Force spawn VIP customer
    this.forceSpawnCustomer('vip');
    this.log('👑 VIP customer has arrived!', 'warning');
    this.playSound(1000, 300);
  }

  spawnCriticCustomer() {
    this.forceSpawnCustomer('critic');
    this.log('👨‍💻 Food critic has arrived! Serve perfectly!', 'warning');
    this.playSound(600, 500);
  }

  rushHour() {
    this.log('⚡ Rush hour! Customers arriving faster!', 'info');
    this.baseCustomerInterval = 2000;
    
    setTimeout(() => {
      this.baseCustomerInterval = 4000;
      this.log('😌 Rush hour ended', 'info');
    }, 60000); // 1 minute
  }

  happyHour() {
    this.log('😊 Happy hour! All customers in good mood!', 'success');
    this.customers.forEach(customer => {
      customer.mood = 'happy';
      customer.element.classList.add('happy');
    });
  }

  ingredientSale() {
    this.log('💰 Special offer! Next tea earns double money!', 'success');
    this.nextTeaBonus = 2.0;
  }

  toggleRecipeBook() {
    this.recipeBookOpen = !this.recipeBookOpen;
    const modal = document.getElementById('recipe-modal');
    modal.style.display = this.recipeBookOpen ? 'flex' : 'none';
    
    if (this.recipeBookOpen) {
      this.populateRecipeBook();
    }
  }

  populateRecipeBook() {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '';
    
    Object.entries(this.teaTypes).forEach(([name, recipe]) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      
      if (recipe.unlockedAt <= this.level) {
        card.classList.add('unlocked');
      } else {
        card.style.opacity = '0.5';
      }
      
      if (recipe.difficulty >= 4) {
        card.classList.add('premium');
      }
      
      card.innerHTML = `
        <div class="recipe-name">${name.charAt(0).toUpperCase() + name.slice(1)} Tea</div>
        <div class="recipe-ingredients">${recipe.ingredients.join(' + ')}</div>
        <div class="recipe-price">$${recipe.price}</div>
        <div style="font-size: 11px; color: #999; margin-top: 4px;">
          ${recipe.unlockedAt <= this.level ? 'Available' : `Unlocks at level ${recipe.unlockedAt}`}
        </div>
      `;
      
      card.addEventListener('click', () => {
        if (recipe.unlockedAt <= this.level && !this.isBoiling) {
          this.recipe = [...recipe.ingredients];
          this.updateDisplay();
          this.toggleRecipeBook();
          this.log(`📖 Set recipe: ${recipe.ingredients.join(' + ')}`, 'info');
        }
      });
      
      grid.appendChild(card);
    });
  }

  updateReputation(change) {
    this.reputationSystem.points += change;
    
    // Calculate new level
    const oldLevel = this.reputationSystem.level;
    
    if (this.reputationSystem.points >= 20 && this.reputationSystem.level < 5) {
      this.reputationSystem.level = 5;
    } else if (this.reputationSystem.points >= 10 && this.reputationSystem.level < 4) {
      this.reputationSystem.level = 4;
    } else if (this.reputationSystem.points >= 0 && this.reputationSystem.level < 3) {
      this.reputationSystem.level = 3;
    } else if (this.reputationSystem.points >= -10 && this.reputationSystem.level < 2) {
      this.reputationSystem.level = 2;
    } else if (this.reputationSystem.points < -10) {
      this.reputationSystem.level = 1;
    }
    
    // Clamp points
    this.reputationSystem.points = Math.max(-20, Math.min(25, this.reputationSystem.points));
    
    if (this.reputationSystem.level !== oldLevel) {
      const benefit = this.reputationSystem.benefits[this.reputationSystem.level];
      this.log(`⭐ Reputation changed to ${this.reputationSystem.level} stars! ${benefit.desc}`, 
               this.reputationSystem.level > oldLevel ? 'success' : 'warning');
      
      if (this.reputationSystem.level === 5) {
        this.unlockAchievement('reputationMax');
      }
    }
  }

  forceSpawnCustomer(type) {
    if (this.customers.length >= this.getMaxCustomers()) return;

    const customerType = this.customerTypes[type];
    if (!customerType) return;

    // Select appropriate tea for this customer type
    const availableTeas = customerType.preferences.filter(tea => 
      this.teaTypes[tea] && this.teaTypes[tea].unlockedAt <= this.level
    );
    
    if (availableTeas.length === 0) return;
    
    const selectedTea = availableTeas[Math.floor(Math.random() * availableTeas.length)];
    const tea = this.teaTypes[selectedTea];
    
    const customer = {
      id: this.nextCustomerId++,
      type: type,
      emoji: customerType.emoji,
      order: [...tea.ingredients],
      originalOrder: [...tea.ingredients],
      timeLeft: customerType.patience * this.weather.effect,
      patience: customerType.patience,
      tip: customerType.tip,
      mood: customerType.mood,
      teaName: selectedTea,
      special: true,
      element: null
    };

    const customerEl = this.createCustomerElement(customer);
    customer.element = customerEl;
    this.customers.push(customer);

    document.getElementById('customers').appendChild(customerEl);
    this.playSound(450, 150);
    this.log(`${customerType.emoji} Special ${type} customer wants ${selectedTea} tea!`, 'info');
  }

  startGameLoop() {
    setInterval(() => this.gameLoop(), 100);
  }

  log(message, type = 'info') {
    const logEl = document.getElementById('log');
    const p = document.createElement('p');
    p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    p.className = type;
    logEl.appendChild(p);
    logEl.scrollTop = logEl.scrollHeight;

    // Keep only last 50 messages
    while (logEl.children.length > 50) {
      logEl.removeChild(logEl.firstChild);
    }
  }

  showWelcomeMessage() {
    this.log('🍵 Welcome to Tea Time Tycoon Enhanced!', 'success');
    this.log('🎮 Use keyboard shortcuts: 1-6 for ingredients, B to boil, S to serve', 'info');
    this.log('⏸️ Press SPACE to pause, M to toggle sound', 'info');
    this.log('💡 Click customers to see their orders!', 'info');
  }

  saveGame() {
    const gameData = {
      money: this.money,
      servedCount: this.servedCount,
      totalEarnings: this.totalEarnings,
      customerStreak: this.customerStreak,
      bestStreak: this.bestStreak,
      happyCustomers: this.happyCustomers,
      upgrades: this.upgrades,
      achievements: this.achievements,
      soundEnabled: this.soundEnabled,
      gameStartTime: this.gameStartTime
    };

    try {
      localStorage.setItem('teaGameSave', JSON.stringify(gameData));
      this.log('💾 Game saved automatically', 'info');
    } catch (e) {
      console.log('Failed to save game:', e);
    }
  }

  loadGame() {
    try {
      const saveData = localStorage.getItem('teaGameSave');
      if (!saveData) return;

      const gameData = JSON.parse(saveData);
      
      // Restore saved data
      Object.assign(this, gameData);
      
      // Update sound button
      document.getElementById('soundToggle').textContent = this.soundEnabled ? '🔊' : '🔇';
      
      this.log('💾 Game loaded successfully!', 'success');
      this.updateDisplay();
    } catch (e) {
      console.log('Failed to load game:', e);
      this.log('⚠️ Could not load saved game', 'warning');
    }
  }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.teaGame = new TeaGame();
});
