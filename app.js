window.addEventListener('load', function(){
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 620;
    ctx.fillStyle = 'white';
    ctx.strokeWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = '40px Roboto';
    ctx.textAlign = 'center';
    const volumeToggleBtn = document.getElementById('volumeToggle');
    const audioPlayer = document.getElementById('audioPlayer');
    const instructionsButton = document.getElementById('instructionsButton');
    const instructionsModal = document.getElementById('instructionsModal');
    const closeButton = document.querySelector('.close-button');
    
    isMuted = true;
    function toggleVolume() {
        if (isMuted) {
        audioPlayer.play();// Unmute (full volume)
        volumeToggleBtn.textContent = 'Mute'
        } else {
        audioPlayer.pause(); // Mute
        volumeToggleBtn.textContent = 'Unmute' 
        }
        isMuted = !isMuted; // Toggle the state 
    }
    // Attach the click event listener to the button
    volumeToggleBtn.addEventListener('click', toggleVolume);

    
    instructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'block';
    });
    closeButton.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
    if (event.target === instructionsModal) {
    instructionsModal.style.display = 'none';
    }
    });
    
   


       
    const game = new Game(canvas);
    game.init(); // creates our obstacles
    console.log(game)

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);

    
});


