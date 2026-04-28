
    /* --- Personalization placeholders --- */
    const GIRL_NAME = 'Ritu'; // <-- change to her name
    const YOUR_NAME = 'Ur Love'; // <-- change to your name

    /* Apology message. Keep it honest and short. You can edit directly. */
    const APOLOGY_LINES = [
      "I am sorry.",
      "I should't do that😭 I should've thought what you will think and all.",
      "You were right to feel hurt — and I was wrong, i must have appologised more.",
      "If you can, give me one chance to make it right. I will never do that, never ever in my life. I promise.",
      "Forgive me?, please...💕"
    ];

    // --- UI wiring ---
    const curtain = document.getElementById('curtain');
    const openBtn = document.getElementById('openBtn');
    const paper = document.getElementById('paper');
    const bodyText = document.getElementById('bodyText');
    const toName = document.getElementById('toName');
    const fromName = document.getElementById('fromName');
    const forgiveYes = document.getElementById('forgiveYes');
    const forgiveLater = document.getElementById('forgiveLater');

    toName.textContent = GIRL_NAME;
    fromName.textContent = YOUR_NAME;

    // Curtain opening — slight delay then open
    setTimeout(()=> curtain.classList.add('open'), 700);

    // Typewriter effect for letter lines
    function typeApology(lines, el, onComplete) {
      el.textContent = '';
      let i = 0; // line
      let j = 0; // char
      function step() {
        if (i >= lines.length) { if (onComplete) onComplete(); return; }
        const line = lines[i];
        if (j <= line.length) {
          el.textContent = lines.slice(0,i).join('\n') + (i ? '\n' : '') + line.slice(0,j) + (j%2? '|' : '');
          j += 1;
          setTimeout(step, 40 + Math.random()*40);
        } else {
          // move to next line after short pause
          j = 0; i += 1;
          setTimeout(step, 500);
        }
      }
      step();
    }

    // Open button: unfold letter and start typing
    openBtn.addEventListener('click', ()=> {
      paper.classList.remove('folded');
      typeApology(APOLOGY_LINES, bodyText, ()=> {
        // add caret removal
        bodyText.textContent = bodyText.textContent.replace(/\|/g,'');
      });
      // gentle spotlight pulse
      const sp = document.querySelector('.spotlight');
      if (sp && sp.animate) {
        sp.animate([{opacity:1},{opacity:0.92},{opacity:1}],{duration:2800,iterations:1});
      }
    });

    // Forgiveness interactions
    forgiveYes.addEventListener('click', ()=> {
      // celebratory sequence
      launchConfetti();
      showFireworks();
      paper.classList.add('folded');
      // update main title as a gentle visual change instead of photo
      const titleEl = document.querySelector('.title');
      if (titleEl) titleEl.textContent = 'Thank you — I mean it.';
      setTimeout(()=> alert('She forgave you. Now keep your promise.'), 700);
    });

    // --- Confetti implementation (lightweight) ---
    const confettiCanvas = document.getElementById('confetti');
    const ctx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
    let W, H, particles = [];
    function resize(){ W = confettiCanvas.width = innerWidth; H = confettiCanvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();

    function random(min, max){ return Math.random()*(max-min)+min; }
    function launchConfetti(){
      for(let i=0;i<120;i++) particles.push({
        x: random(0, W),
        y: random(-H, 0),
        vx: random(-1.8, 1.8),
        vy: random(2, 6),
        r: random(6, 12),
        c: `hsl(${Math.floor(random(0,360))},80%,60%)`
      });
      tickConfetti();
    }
    let confettiTimer = null;
    function tickConfetti(){
      if (!ctx) return;
      if(confettiTimer) cancelAnimationFrame(confettiTimer);
      function frame(){
        ctx.clearRect(0,0,W,H);
        for(let p of particles){
          p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.998;
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,Math.PI*2); ctx.fill();
        }
        particles = particles.filter(p=>p.y < H+50);
        if(particles.length>0) confettiTimer = requestAnimationFrame(frame);
        else { ctx.clearRect(0,0,W,H); if(confettiTimer) cancelAnimationFrame(confettiTimer); confettiTimer=null; }
      }
      frame();
    }

    // --- Soft fireworks using DOM (simple) ---
    function showFireworks(){
      const root = document.createElement('div'); root.style.position='fixed'; root.style.left=0; root.style.top=0; root.style.width='100%'; root.style.height='100%'; root.style.zIndex=35; root.style.pointerEvents='none';
      document.body.appendChild(root);
      for(let i=0;i<6;i++){
        setTimeout(()=> createBurst(random(0.15,0.85)*W, random(0.15,0.6)*H, root), i*250);
      }
      setTimeout(()=> root.remove(),2400);
    }
    function createBurst(x, y, rootEl){
      const n = 18;
      for(let i=0;i<n;i++){
        const el = document.createElement('div');
        el.style.position='absolute';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = '8px';
        el.style.height = '8px';
        el.style.borderRadius = '50%';
        el.style.background = `hsl(${Math.floor(Math.random()*360)},80%,60%)`;
        el.style.opacity = 1;
        el.style.transform = 'translate(-50%,-50%)';
        el.style.willChange = 'transform,opacity';
        rootEl.appendChild(el);
        const angle = (i/n)*Math.PI*2;
        const vx = Math.cos(angle)*random(40,180);
        const vy = Math.sin(angle)*random(40,180);
        el.animate(
          [
            { transform: `translate(-50%,-50%) translate(0px,0px)`, opacity: 1 },
            { transform: `translate(-50%,-50%) translate(${vx}px,${vy}px)`, opacity: 0 }
          ],
          { duration: 900 + Math.random()*700, easing: 'cubic-bezier(.2,.9,.2,1)' }
        );
        setTimeout(()=> el.remove(), 1600);
      }
    }

    // --- Falling rose petals (gentle) ---
    function spawnPetals(count=10){
      const container = document.getElementById('petals');
      for(let i=0;i<count;i++){
        const el = document.createElement('div'); el.className='petal';
        el.style.left = Math.random()*100 + '%';
        el.style.top = (-10 - Math.random()*20) + 'vh';
        el.style.opacity = 0.9;
        el.style.zIndex = 6;
        el.textContent = '🌹';
        el.style.fontSize = (18 + Math.random()*26) + 'px';
        el.style.transform = `translateY(0) rotate(${Math.random()*180}deg)`;
        container.appendChild(el);
        const duration = 6000 + Math.random()*9000;
        el.animate([{transform:`translateY(0) rotate(0deg)` , opacity:1}, {transform:`translateY(${100+Math.random()*40}vh) rotate(${360+Math.random()*720}deg)`, opacity:0.8}],{duration, easing:'linear'});
        setTimeout(()=> el.remove(), duration+200);
      }
      setTimeout(()=> spawnPetals(6), 4800);
    }
    spawnPetals(12);

    // Small safety: ensure audio stops when navigating away
    window.addEventListener('pagehide', ()=>{ audio.pause(); audio.currentTime = 0; });

    // Extra: allow editing text quickly via prompt (for you)
    document.addEventListener('keydown', (e)=> {
      if(e.ctrlKey && e.key === 'e'){
        const newText = prompt('Edit short apology (separate lines with \\n):', APOLOGY_LINES.join('\\n'));
        if(newText !== null){
          const lines = newText.split('\n').map(s=>s.trim()).filter(Boolean);
          if(lines.length) {
            APOLOGY_LINES.splice(0, APOLOGY_LINES.length, ...lines);
            bodyText.textContent = '';
            alert('Apology updated. Click "Open my heart" to show it.');
          }
        }
      }
    });

  
