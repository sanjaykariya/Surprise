function setVH(){
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
const total = 10;
let current = 0;
const book = document.getElementById('book');
const progressEl = document.getElementById('progress');

for(let i=0;i<total;i++){
  const dot = document.createElement('span');
  if(i===0) dot.classList.add('done');
  progressEl.appendChild(dot);
}

function updateProgress(){
  [...progressEl.children].forEach((d,i)=>{
    d.classList.toggle('done', i<=current);
  });
}

function nextPage(){
  if(current >= total-1) return;
  const pages = book.querySelectorAll('.page');
  const curEl = pages[current];
  curEl.classList.add('leaving');
  curEl.classList.remove('active');
  current++;
  const nextEl = pages[current];
  setTimeout(()=>{
    curEl.classList.remove('leaving');
    nextEl.classList.add('active');
    updateProgress();
    if(nextEl.classList.contains('final')){
  launchConfetti();
}
  }, 30);
}

book.addEventListener('click', (e)=>{
  if(e.target.closest('.begin-btn')) return;
  if(current === 0) return;
  nextPage();
});

const heartsWrap = document.getElementById('hearts');
const heartChars = ['♡','♥'];
for(let i=0;i<14;i++){
  const s = document.createElement('span');
  s.textContent = heartChars[Math.floor(Math.random()*heartChars.length)];
  s.style.left = Math.random()*100 + '%';
  s.style.animationDelay = (Math.random()*14) + 's';
  s.style.animationDuration = (10+Math.random()*10) + 's';
  s.style.fontSize = (12+Math.random()*14) + 'px';
  heartsWrap.appendChild(s);
}

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

let particles = [];
const colors = ['#C9707E','#CC9A50','#E7B4B4','#FAF3EA','#8A5A63'];

function launchConfetti(){
  particles = [];
  for(let i=0;i<140;i++){
    particles.push({
      x: canvas.width/2 + (Math.random()-0.5)*80,
      y: canvas.height*0.35,
      vx: (Math.random()-0.5)*8,
      vy: Math.random()*-8 - 3,
      size: 4+Math.random()*6,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vrot: (Math.random()-0.5)*10,
      shape: Math.random()>0.5 ? 'heart' : 'rect'
    });
  }
  requestAnimationFrame(animateConfetti);
}

function drawHeart(x,y,size,color,rot){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot*Math.PI/180);
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size/2;
  ctx.moveTo(0, s*0.3);
  ctx.bezierCurveTo(-s, -s*0.6, -s*1.6, s*0.5, 0, s*1.4);
  ctx.bezierCurveTo(s*1.6, s*0.5, s, -s*0.6, 0, s*0.3);
  ctx.fill();
  ctx.restore();
}

function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let alive = false;
  particles.forEach(p=>{
    p.vy += 0.15;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;
    if(p.y < canvas.height+20) alive = true;
    if(p.shape === 'heart'){
      drawHeart(p.x, p.y, p.size, p.color, p.rot);
    }else{
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      ctx.restore();
    }
  });
  if(alive) requestAnimationFrame(animateConfetti);
  else ctx.clearRect(0,0,canvas.width,canvas.height);
}