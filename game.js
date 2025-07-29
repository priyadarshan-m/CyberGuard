/**
 * AssetGenerator Class
 * This class is responsible for programmatically creating all the pixel art
 * assets for the game. This makes the game self-contained without needing
 * to load external image files.
 */
class AssetGenerator {
    // Creates a new in-memory canvas and returns it with its 2D context.
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Essential for crisp pixel art
        return { canvas, ctx };
    }

    // --- PLAYER ASSET ---
    createPlayer() {
        const { canvas, ctx } = this.createCanvas(24, 32);
        // Helmet
        ctx.fillStyle = '#d4d4d4'; // Light grey
        ctx.fillRect(4, 2, 16, 12);
        // Visor
        ctx.fillStyle = '#00ffff'; // Cyan
        ctx.fillRect(6, 6, 12, 6);
        ctx.fillStyle = 'black';
        ctx.fillRect(7, 7, 10, 4);
        // Body
        ctx.fillStyle = '#8b8b8b'; // Darker grey
        ctx.fillRect(4, 14, 16, 14);
        // Body accent
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(10, 16, 4, 8);
        // Boots
        ctx.fillStyle = '#4a4a4a'; // Very dark grey
        ctx.fillRect(4, 28, 6, 4);
        ctx.fillRect(14, 28, 6, 4);
        return canvas;
    }

    // --- PLATFORM ASSETS ---
    createPlatform(width, height, color1, color2) {
        const { canvas, ctx } = this.createCanvas(width, height);
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color2;
        ctx.fillRect(0, 0, width, 4); // Top highlight
        // Grid pattern for texture
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < width; i += 8) {
            ctx.fillRect(i, 0, 1, height);
        }
        for (let i = 0; i < height; i += 8) {
            ctx.fillRect(0, i, width, 1);
        }
        return canvas;
    }

    // --- ENEMY ASSETS ---
    createEnemy(type) {
        const { canvas, ctx } = this.createCanvas(24, 24);
        const colors = {
            virus: '#ff4b4b', malware: '#ff8a4b', spyware: '#ffdb4b', worm: '#a8ff4b',
            rootkit: '#4bffa8', botnet: '#4bb8ff', keylogger: '#8a4bff', ransomware: '#ff4bda',
            adware: '#ff4b8d', supervirus: '#ff0000', megatrojan: '#cc0000',
            ultraworm: '#990000', hypermalware: '#660000'
        };
        const color = colors[type] || '#ff00ff';

        ctx.fillStyle = color;
        ctx.fillRect(2, 2, 20, 20); // Main body
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(6, 8, 4, 4);
        ctx.fillRect(14, 8, 4, 4);
        ctx.fillStyle = 'black';
        ctx.fillRect(7, 9, 2, 2);
        ctx.fillRect(15, 9, 2, 2);
        return canvas;
    }

    // --- COLLECTIBLE ASSETS ---
    createCollectible(type) {
        const { canvas, ctx } = this.createCanvas(20, 20);
        const colors = {
            firewall: '#00ff00', antivirus: '#00ffff', encryption: '#ffff00', password: '#ff00ff',
            vpn: '#00ff88', backup: '#8800ff', masterkey: '#ffffff', quantumencryption: '#00aaff',
            neuralantivirus: '#aa00ff', blockchainvpn: '#ffaa88', aibackup: '#88ffaa'
        };
        const color = colors[type] || '#ffffff';
        // Icon background
        ctx.fillStyle = color;
        ctx.fillRect(2, 2, 16, 16);
        ctx.clearRect(4, 4, 12, 12);
        ctx.fillRect(6, 6, 8, 8);
        // Icon symbol
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const symbols = {
            firewall: 'F', antivirus: 'A', encryption: 'E', password: 'P', vpn: 'V', backup: 'B',
            masterkey: '!', quantumencryption: 'Q', neuralantivirus: 'N', blockchainvpn: '$', aibackup: 'S'
        };
        ctx.fillText(symbols[type] || '?', 10, 11);
        return canvas;
    }
    
    // --- OTHER ASSETS ---
    createGoal() {
         const { canvas, ctx } = this.createCanvas(40, 50);
         // Server rack
         ctx.fillStyle = '#6c757d'; // Dark grey
         ctx.fillRect(0, 0, 40, 50);
         // Front panel
         ctx.fillStyle = '#adb5bd'; // Lighter grey
         ctx.fillRect(4, 4, 32, 42);
         // Animated lights
         ctx.fillStyle = '#00ff00'; // Green
         for(let i=0; i<4; i++) {
             ctx.fillRect(8, 8 + i * 10, 8, 4);
         }
         ctx.fillStyle = '#ffff00'; // Yellow
          for(let i=0; i<4; i++) {
             ctx.fillRect(24, 8 + i * 10, 8, 4);
         }
         return canvas;
    }

    createSpikes() {
        const { canvas, ctx } = this.createCanvas(20, 20); // Create a single spike tile
        ctx.fillStyle = '#ff0000'; // Red
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(10, 0);
        ctx.lineTo(20, 20);
        ctx.fill();
        return canvas;
    }
}


/**
 * CyberGuardGame Class
 * The main game engine. It controls the game state, logic, rendering,
 * and user input. It uses the assets generated by the AssetGenerator.
 */
class CyberGuardGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.assets = {};

        // Game state
        this.gameState = 'start'; // start, playing, gameOver, gameWin
        this.score = 0;
        this.level = 1;
        this.maxLevel = 5;
        this.collectedCount = 0;
        this.totalCollectibles = 0;
        this.startTime = 0;
        this.gameTime = 0;
        this.frame = 0;
        this.lastFrameTime = performance.now();

        // Player properties
        this.player = {
            x: 50, y: 400, width: 24, height: 32,
            velX: 0, velY: 0, speed: 5, jumpPower: 14,
            onGround: false, facing: 1, invulnerable: 0,
        };

        // Game object arrays
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.goal = null;
        this.movingPlatforms = [];
        this.particles = [];
        this.spikes = [];
        this.disappearingPlatforms = [];
        this.fakeGoals = [];
        this.teleporters = [];
        this.switches = [];
        this.doors = [];
        this.fallingPlatforms = [];
        this.chasers = [];
        this.surpriseElements = [];

        // Input handling
        this.keys = {};

        // Camera
        this.camera = { x: 0, y: 0, shakeX: 0, shakeY: 0, shake: 0 };

        this.init();
    }

    init() {
        this.loadAssets();
        this.setupEventListeners();
        this.generateLevel(this.level);
        this.gameLoop();
    }

    loadAssets() {
        const generator = new AssetGenerator();
        this.assets.player = generator.createPlayer();
        
        this.assets.platform = generator.createPlatform(1, 1, '#00ff00', '#55ff55');
        this.assets.movingPlatform = generator.createPlatform(1, 1, '#ffff00', '#ffff55');
        this.assets.disappearingPlatform = generator.createPlatform(1, 1, '#ff00ff', '#ff55ff');
        this.assets.fallingPlatform = generator.createPlatform(1, 1, '#ff8800', '#ffaa00');

        const enemyTypes = ['virus', 'malware', 'spyware', 'worm', 'rootkit', 'botnet', 'keylogger', 'ransomware', 'adware', 'supervirus', 'megatrojan', 'ultraworm', 'hypermalware'];
        enemyTypes.forEach(type => { this.assets[type] = generator.createEnemy(type); });

        const collectibleTypes = ['firewall', 'antivirus', 'encryption', 'password', 'vpn', 'backup', 'masterkey', 'quantumencryption', 'neuralantivirus', 'blockchainvpn', 'aibackup'];
        collectibleTypes.forEach(type => { this.assets[type] = generator.createCollectible(type); });
        
        this.assets.goal = generator.createGoal();
        this.assets.spikes = generator.createSpikes();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        document.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
    }

    startGame() {
        const startScreen = document.getElementById('startScreen');
        startScreen.classList.add('fade-out');
        setTimeout(() => {
            startScreen.classList.add('hidden');
            document.getElementById('ui').classList.remove('hidden');
            this.gameState = 'playing';
            this.startTime = Date.now();
        }, 500);
    }

    restartGame() {
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('gameWin').classList.add('hidden');
        document.getElementById('ui').classList.remove('hidden');
        this.score = 0;
        this.level = 1;
        this.player.x = 50; this.player.y = 400;
        this.player.velX = 0; this.player.velY = 0;
        this.player.invulnerable = 0;
        this.startTime = Date.now();
        this.generateLevel(this.level);
        this.gameState = 'playing';
    }
    
    getLevelData(levelNum) {
        const levels = {
            1: { platforms: [{x:0,y:550,width:200,height:50},{x:300,y:450,width:100,height:20},{x:500,y:350,width:100,height:20},{x:700,y:250,width:100,height:20},{x:900,y:450,width:200,height:50}], movingPlatforms: [{x:250,y:400,width:80,height:20,moveX:100,speed:1}], fallingPlatforms: [{x:600,y:300,width:80,height:20,fallDelay:180}], enemies: [{x:350,y:430,type:'virus',speed:1,patrol:40}], spikes: [{x:450,y:530,width:100}], collectibles: [{x:330,y:420,type:'firewall'},{x:630,y:270,type:'encryption'},{x:730,y:220,type:'antivirus'}] , goal:{x:950,y:400,width:40,height:50}},
            2: { platforms: [{x:0,y:550,width:150,height:50},{x:200,y:450,width:80,height:20},{x:400,y:350,width:80,height:20},{x:600,y:250,width:80,height:20},{x:800,y:350,width:80,height:20},{x:1000,y:450,width:150,height:50}], disappearingPlatforms: [{x:300,y:400,width:80,height:20,timer:120,maxTimer:120}], chasers: [{x:-100,y:570,width:1200,height:30,speed:0.5,type:'lava'}], enemies: [{x:220,y:430,type:'malware',speed:1,patrol:30},{x:620,y:230,type:'spyware',speed:1,patrol:30}], collectibles: [{x:230,y:420,type:'password'},{x:530,y:270,type:'vpn'},{x:830,y:320,type:'backup'}], goal:{x:1050,y:400,width:40,height:50}},
            3: { platforms: [{x:0,y:550,width:120,height:50},{x:200,y:450,width:80,height:20},{x:1000,y:250,width:80,height:20},{x:1400,y:450,width:120,height:50}], teleporters: [{x:240,y:420,width:20,height:30,target:{x:1040,y:220},color:'#ff00ff'}], enemies: [{x:210,y:430,type:'worm',speed:1,patrol:30}], collectibles: [{x:430,y:320,type:'encryption'},{x:830,y:120,type:'antivirus'},{x:1230,y:320,type:'firewall'}], goal:{x:1450,y:400,width:40,height:50}},
            4: { platforms: [{x:0,y:550,width:150,height:50},{x:200,y:400,width:100,height:20},{x:350,y:300,width:100,height:20},{x:500,y:200,width:100,height:20},{x:1100,y:400,width:150,height:50}], movingPlatforms: [{x:750,y:150,width:80,height:20,moveY:150,speed:2}], enemies: [{x:210,y:380,type:'keylogger',speed:1,patrol:40},{x:510,y:180,type:'ransomware',speed:1,patrol:40}], spikes: [{x:150,y:530,width:50}], collectibles: [{x:230,y:370,type:'vpn'},{x:580,y:170,type:'backup'},{x:980,y:270,type:'password'}], goal:{x:1150,y:350,width:40,height:50}},
            5: { platforms: [{x:0,y:550,width:200,height:50},{x:300,y:450,width:100,height:20},{x:1500,y:450,width:200,height:50}], fallingPlatforms: [{x:700,y:250,width:100,height:20,fallDelay:120}], chasers: [{x:1800,y:0,width:50,height:600,speed:1.2,type:'wall'}], enemies: [{x:310,y:430,type:'supervirus',speed:2,patrol:40}], spikes: [{x:200,y:530,width:100}], teleporters: [{x:550,y:320,width:20,height:30,target:{x:50,y:500},color:'#ff00ff'}], collectibles: [{x:330,y:420,type:'masterkey'}], goal:{x:1550,y:400,width:40,height:50}},
        };
        return levels[levelNum] || levels[1];
    }
    
    generateLevel(levelNum) {
    const levelData = this.getLevelData(levelNum);

    // Reset all entity arrays
    const arraysToReset = ['platforms', 'enemies', 'collectibles', 'movingPlatforms', 'spikes', 'disappearingPlatforms', 'fakeGoals', 'teleporters', 'switches', 'doors', 'fallingPlatforms', 'chasers', 'surpriseElements', 'particles'];
    arraysToReset.forEach(arr => this[arr] = []);

    // Create platforms first
    levelData.platforms?.forEach(p => this.platforms.push({ ...p }));
    levelData.movingPlatforms?.forEach(p => this.movingPlatforms.push({ ...p, startX: p.x, startY: p.y, offset: 0, direction: 1 }));
    levelData.fallingPlatforms?.forEach(p => this.fallingPlatforms.push({ ...p, originalY: p.y, falling: false, fallSpeed: 0, triggered: false }));
    levelData.disappearingPlatforms?.forEach(p => this.disappearingPlatforms.push({ ...p, visible: true, alpha: 1, timer: p.maxTimer }));

    // Create enemies and properly position them on platforms
    levelData.enemies?.forEach(e => {
        const enemy = {
            ...e,
            width: 24,
            height: 24,
            direction: 1,
            velY: 0,
            onGround: true, // Start on ground
            patrolStart: e.x - (e.patrol || 50),
            patrolEnd: e.x + (e.patrol || 50)
        };

        // Find the platform this enemy should be standing on
        const allPlatforms = [...this.platforms, ...this.movingPlatforms, ...this.fallingPlatforms];
        let foundPlatform = false;

        for (const platform of allPlatforms) {
            // Check if enemy X position is within platform bounds
            if (enemy.x >= platform.x && enemy.x + enemy.width <= platform.x + platform.width) {
                // Check if enemy is close to being above this platform
                if (Math.abs((enemy.y + enemy.height) - platform.y) < 50) {
                    // Position enemy exactly on top of the platform
                    enemy.y = platform.y - enemy.height;
                    enemy.onGround = true;
                    foundPlatform = true;
                    break;
                }
            }
        }

        // If no platform found, try to find the closest platform below
        if (!foundPlatform) {
            let closestPlatform = null;
            let closestDistance = Infinity;

            for (const platform of allPlatforms) {
                // Check if enemy X overlaps with platform
                if (enemy.x + enemy.width > platform.x && enemy.x < platform.x + platform.width) {
                    const distance = Math.abs(platform.y - (enemy.y + enemy.height));
                    if (distance < closestDistance && platform.y >= enemy.y) {
                        closestDistance = distance;
                        closestPlatform = platform;
                    }
                }
            }

            if (closestPlatform) {
                enemy.y = closestPlatform.y - enemy.height;
                enemy.onGround = true;
            }
        }

        this.enemies.push(enemy);
    });

    // Create other game objects
    levelData.spikes?.forEach(s => this.spikes.push({ ...s, height: 20 }));
    levelData.collectibles?.forEach(c => this.collectibles.push({ ...c, width: 20, height: 20, collected: false, bobOffset: Math.random() * Math.PI * 2 }));
    levelData.teleporters?.forEach(t => this.teleporters.push({ ...t, cooldown: 0, animOffset: Math.random() * Math.PI * 2 }));
    levelData.switches?.forEach(s => this.switches.push({ ...s }));
    levelData.doors?.forEach(d => this.doors.push({ ...d, openHeight: 0 }));
    levelData.chasers?.forEach(c => this.chasers.push({ ...c }));
    levelData.surpriseElements?.forEach(e => this.surpriseElements.push({ ...e, activated: false }));
    levelData.fakeGoals?.forEach(f => this.fakeGoals.push({ ...f, glitch: 0 }));

    this.goal = { ...levelData.goal };
    if (levelData.trick) {
        setTimeout(() => this.showMessage(levelData.trick), 1000);
    }

    this.totalCollectibles = this.collectibles.length;
    this.collectedCount = 0;
}

    update() {
        if (this.gameState !== 'playing') return;

        this.frame++;
        this.gameTime = (Date.now() - this.startTime) / 1000;

        this.handleInput();
        this.updatePlayer();
        this.updateEnemies(); // Enemy physics is now handled here
        this.updateMovingPlatforms();
        this.updateFallingPlatforms();

        this.checkCollisions();
        this.updateCamera();
        this.updateUI();

        if (this.player.invulnerable > 0) this.player.invulnerable--;
    }
    
    handleInput() {
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.velX = -this.player.speed;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.velX = this.player.speed;
        } else {
            this.player.velX *= 0.8; // Friction
        }

        if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) && this.player.onGround) {
            this.player.velY = -this.player.jumpPower;
            this.player.onGround = false;
        }
    }

    updatePlayer() {
        if (this.player.velX > 0.1) this.player.facing = 1;
        if (this.player.velX < -0.1) this.player.facing = -1;

        if (!this.player.onGround) {
            this.player.velY += 0.6; // Gravity
        }
        
        this.player.x += this.player.velX;
        this.player.y += this.player.velY;
        this.player.onGround = false;
        
        const allPlatforms = [...this.platforms, ...this.movingPlatforms, ...this.fallingPlatforms.filter(p => !p.falling)];
        for (const platform of allPlatforms) {
            if (this.checkCollision(this.player, platform)) {
                // Vertical collision (landing on top)
                if (this.player.velY >= 0 && (this.player.y + this.player.height - this.player.velY) <= platform.y) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velY = 0;
                    this.player.onGround = true;
                }
                 // Horizontal collision
                else if (this.player.onGround === false){
                     if (this.player.velX > 0) this.player.x = platform.x - this.player.width;
                     if (this.player.velX < 0) this.player.x = platform.x + platform.width;
                }
            }
        }

        if (this.player.y > this.canvas.height + 200) {
            this.respawnPlayer();
        }
    }

        updateEnemies() {
    const allPlatforms = [...this.platforms, ...this.movingPlatforms, ...this.fallingPlatforms.filter(p => !p.falling)];
    
    this.enemies.forEach(enemy => {
        // Apply gravity only if not on ground
        if (!enemy.onGround) {
            enemy.velY += 0.6; // Gravity
        }
        
        // Move enemy vertically
        enemy.y += enemy.velY;
        enemy.onGround = false;
        
        // Check for platform collisions (landing on platforms)
        for (const platform of allPlatforms) {
            if (this.checkCollision(enemy, platform)) {
                // Check if enemy is falling down and hitting the top of the platform
                if (enemy.velY > 0 && (enemy.y + enemy.height - enemy.velY) <= platform.y) {
                    enemy.y = platform.y - enemy.height;
                    enemy.velY = 0;
                    enemy.onGround = true;
                    break;
                }
                // Handle side collisions
                else if (enemy.velY <= 0) {
                    if (enemy.y < platform.y + platform.height) {
                        enemy.y = platform.y + platform.height;
                        enemy.velY = 0;
                    }
                }
            }
        }

        // If enemy is on ground, do patrol movement
        if (enemy.onGround) {
            // Store current position to check for valid movement
            const oldX = enemy.x;
            enemy.x += (enemy.speed || 1) * enemy.direction;
            
            // Check boundaries - turn around if hit patrol limits
            if (enemy.x <= enemy.patrolStart || (enemy.x + enemy.width) >= enemy.patrolEnd) {
                enemy.direction *= -1;
                enemy.x = oldX; // Reset to valid position
            }
            
            // Check for ground ahead to avoid falling off platforms
            const lookaheadDistance = 10;
            const lookaheadX = enemy.direction > 0 ? 
                enemy.x + enemy.width + lookaheadDistance : 
                enemy.x - lookaheadDistance;
            
            let groundAhead = false;
            
            // Check if there's ground ahead
            for (const platform of allPlatforms) {
                const testRect = {
                    x: lookaheadX - 5,
                    y: enemy.y + enemy.height,
                    width: 10,
                    height: 20
                };
                
                if (this.checkCollision(testRect, platform)) {
                    groundAhead = true;
                    break;
                }
            }
            
            // Turn around if no ground ahead (cliff detection)
            if (!groundAhead) {
                enemy.direction *= -1;
                enemy.x = oldX; // Reset to safe position
            }
        }
        
        // Remove enemies that fall too far (safety net)
        if (enemy.y > this.canvas.height + 100) {
            // Reset enemy to a safe position on their patrol route
            enemy.y = 200; // Reset to a reasonable height
            enemy.x = enemy.patrolStart + (enemy.patrolEnd - enemy.patrolStart) / 2;
            enemy.velY = 0;
            enemy.onGround = false;
        }
    });
}

    updateMovingPlatforms() {
        this.movingPlatforms.forEach(p => {
            p.offset += p.speed;
            if (p.moveX) p.x = p.startX + Math.sin(p.offset * 0.02) * p.moveX;
            if (p.moveY) p.y = p.startY + Math.sin(p.offset * 0.02) * p.moveY;
        });
    }
    
    updateFallingPlatforms() {
        this.fallingPlatforms.forEach(p => {
             if (!p.triggered && this.player.onGround && this.checkCollision(this.player, p)) {
                p.triggered = true;
            }
            if (p.triggered && !p.falling) {
                p.fallDelay -= 1;
                if (p.fallDelay <= 0) p.falling = true;
            }
            if (p.falling) {
                p.fallSpeed += 0.5;
                p.y += p.fallSpeed;
            }
        });
    }

    checkCollisions() {
        if (this.player.invulnerable === 0) {
            this.enemies.forEach(e => { if (this.checkCollision(this.player, e)) this.respawnPlayer(); });
            this.spikes.forEach(s => { if (this.checkCollision(this.player, {x:s.x, y:s.y, width:s.width, height:s.height})) this.respawnPlayer(); });
        }

        this.collectibles.forEach(c => {
            if (!c.collected && this.checkCollision(this.player, c)) {
                c.collected = true; this.collectedCount++; this.score += 150;
                this.showMessage(this.getSecurityTip(c.type));
            }
        });

        if (this.goal && this.checkCollision(this.player, this.goal)) {
            if (this.collectedCount >= this.totalCollectibles) {
                this.nextLevel();
            } else {
                this.showMessage(`Collect all ${this.totalCollectibles} items!`);
            }
        }
    }
    
    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        this.camera.x += (targetX - this.camera.x) * 0.1;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('collected').textContent = `${this.collectedCount}/${this.totalCollectibles}`;
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    nextLevel() {
        this.level++;
        this.score += 500;
        if (this.level > this.maxLevel) {
            this.gameWin();
        } else {
            this.showMessage(`Level ${this.level} Starting!`);
            this.generateLevel(this.level);
            this.player.x = 50; this.player.y = 400;
        }
    }
    
    gameWin() {
        this.gameState = 'gameWin';
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('gameWin').classList.remove('hidden');
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
    }

    gameOver() {
        // This function is now only called if you want to implement other game-over conditions in the future.
        this.gameState = 'gameOver';
        document.getElementById('ui').classList.add('hidden');
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('gameOverScore').textContent = `Score: ${this.score}`;
    }

    respawnPlayer() {
        // **FIX**: Removed life system. Player now has infinite lives.
        this.player.x = 50; this.player.y = 400;
        this.player.velX = 0; this.player.velY = 0;
        this.player.invulnerable = 120; // 2 seconds of invulnerability
        this.showMessage("Respawned!");
    }

    checkCollision(r1, r2) {
        return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
    }

    showMessage(text) {
        const el = document.getElementById('message');
        el.textContent = text;
        el.classList.add('show');
        setTimeout(() => { el.classList.remove('show'); }, 3000);
    }
    
    getSecurityTip(type) {
        // This can be expanded with more tips
        return "Security Token Collected!";
    }

    render() {
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.gameState !== 'playing') return;

        this.ctx.save();
        this.ctx.translate(Math.round(-this.camera.x), 0); // Only camera on X for this style of game

        // Replace the platform rendering section in your render() method with this:

this.renderGrid();
this.renderPlatforms(this.platforms, 'platform');
this.renderPlatforms(this.movingPlatforms, 'movingPlatform');
this.renderPlatforms(this.disappearingPlatforms.filter(p => p.visible), 'disappearingPlatform');
this.renderPlatforms(this.fallingPlatforms, 'fallingPlatform');
this.renderEnemies();
this.renderSpikes();
this.renderCollectibles();
this.renderGoal();
this.renderPlayer();
        
        this.ctx.restore();
    }

    renderGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        const gridSize = 50;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        for (let x = startX; x < startX + this.canvas.width + gridSize; x += gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
    }

    renderPlatforms(platforms, assetKey) {
    const img = this.assets[assetKey];
    if (!img) return;
    
    platforms.forEach(p => {
        // Get the colors based on platform type
        let color1, color2;
        switch(assetKey) {
            case 'platform':
                color1 = '#00ff00';
                color2 = '#55ff55';
                break;
            case 'movingPlatform':
                color1 = '#ffff00';
                color2 = '#ffff55';
                break;
            case 'disappearingPlatform':
                color1 = '#ff00ff';
                color2 = '#ff55ff';
                break;
            case 'fallingPlatform':
                color1 = '#ff8800';
                color2 = '#ffaa00';
                break;
            default:
                color1 = '#00ff00';
                color2 = '#55ff55';
        }
        
        // Draw the platform manually instead of using pattern
        this.ctx.fillStyle = color1;
        this.ctx.fillRect(p.x, p.y, p.width, p.height);
        
        // Add top highlight
        this.ctx.fillStyle = color2;
        this.ctx.fillRect(p.x, p.y, p.width, 4);
        
        // Add grid pattern for texture
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < p.width; i += 8) {
            this.ctx.fillRect(p.x + i, p.y, 1, p.height);
        }
        for (let i = 0; i < p.height; i += 8) {
            this.ctx.fillRect(p.x, p.y + i, p.width, 1);
        }
    });
}

    renderEnemies() {
        this.enemies.forEach(enemy => {
            const img = this.assets[enemy.type];
            if (img) this.ctx.drawImage(img, Math.round(enemy.x), Math.round(enemy.y));
        });
    }

    renderSpikes() {
        const img = this.assets.spikes;
        if (!img) return;
        this.spikes.forEach(spike => {
            for (let x = 0; x < spike.width; x += img.width) {
                this.ctx.drawImage(img, spike.x + x, spike.y);
            }
        });
    }

    renderCollectibles() {
        this.collectibles.forEach(item => {
            if (!item.collected) {
                const img = this.assets[item.type];
                if(img) {
                    item.bobOffset += 0.05;
                    this.ctx.drawImage(img, item.x, item.y + Math.sin(item.bobOffset) * 5);
                }
            }
        });
    }

    renderGoal() {
        const img = this.assets.goal;
        if (this.goal && img) this.ctx.drawImage(img, this.goal.x, this.goal.y);
    }

    renderPlayer() {
        if (this.player.invulnerable > 0 && Math.floor(this.frame / 4) % 2) return;
        const img = this.assets.player;
        if (!img) return;
        
        this.ctx.save();
        if (this.player.facing === -1) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(img, -this.player.x - this.player.width, this.player.y);
        } else {
            this.ctx.drawImage(img, this.player.x, this.player.y);
        }
        this.ctx.restore();
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => { new CyberGuardGame(); });