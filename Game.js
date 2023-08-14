
    // Game Class
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.topMargin = 260;
            this.debug = true;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.fps = 60;
            this.timer = 0;
            this.interval = 1000 / this.fps;
            this.eggTimer = 0;
            this.eggInterval = 1000;
            this.numOfObstacles = 10;
            this.obstacles = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.eggs = [];
            this.gameObjects = [];
            this.maxEggs = 5;
            this.score = 0;
            this.winningScore = 10;
            this.gameOver = false;
            this.lostHatchlings = 0;
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // attach event listeners 
            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', e => {
                if(this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
            window.addEventListener('keydown', e => {
                if(e.key === 'd') this.debug = !this.debug;
                else if (e.key === 'r') this.restart();
                
            });
        }
        render(context, deltaTime){
            if(this.timer > this.interval) {
                context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.gameObjects = [...this.eggs, ...this.obstacles, this.player, 
                    ...this.enemies, ...this.hatchlings, ...this.particles];
                // sort the vertical position
                this.gameObjects.sort((a, b) => {
                    return a.collisionY - b.collisionY;
                });
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                });
                this.timer = 0;
            }
            this.timer += deltaTime;
            // add eggs periodically
            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver) {
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime;
            }
            // draw score and hatchlings lost
            context.save();
            context.textAlign = 'left';
            context.fillText('SCORE: ' + this.score, 25, 50);
            context.fillText('LOST: ' + this.lostHatchlings, 25, 90);
            context.restore();

            //win / lose message
            if(this.score > this.winningScore){
                this.gameOver = true;
                context.save();
                context.fillStyle = 'rgba(0,0,0,0.5)';
                context.fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowColor = 'black';
                let message1;
                let message2;
                if (this.lostHatchlings <= 5){
                    message1 = "Bullseye!! Congratulations!!"
                    message2 = "You bullied the bullies!";
                }    else {
                    message1 = "Oh No!!"
                    message2 = "You lost " + this.lostHatchlings + "hatchlings, don't be a pushover!";
                }
                context.font = '130px Roboto';
                context.fillText(message1, this.width * 0.5, this.Height * 0.5 - 20);
                context.font = '40px Roboto';
                context.fillText(message2, this.width * 0.5, this.Height * 0.5 + 30);
                context.fillText("Final score " + this.score + ". Press 'R' to butt heads again!", this.width * 0.5, this.height * 0.5 + 80);
                context.restore();
            } 
        }
        checkCollision(a, b) {
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            return  [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
        }
        addEgg(){
            this.eggs.push(new Egg(this));
        }
        addEnemy(){
            this.enemies.push(new Enemy(this)); 
        }
        removeGameObjects(){
            this.eggs = this.eggs.filter(obj => !obj.markedForDeletion);
            this.hatchlings = this.hatchlings.filter(obj => !obj.markedForDeletion);
            this.particles = this.particles.filter(obj => !obj.markedForDeletion);
        }
        restart(){
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.partcles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.init();
        }
        init(){
            for(let i = 0; i < 5; i++){
                this.addEnemy();
            }
            let attempts = 0;
            while(this.obstacles.length < this.numOfObstacles && attempts < 500) {
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 150;
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius
                     + distanceBuffer;
                    if(distance < sumOfRadii) {
                        overlap = true;
                    }
                });
                const margin = testObstacle.collisionRadius * 3;
                if(!overlap &&
                    testObstacle.spriteX > 0 &&
                    testObstacle.spriteX < this.width - testObstacle.width &&
                    testObstacle.collisionY > this.topMargin + margin &&
                    testObstacle.collisionY < this.height - margin) {
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    } // Game
