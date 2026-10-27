// Home-page nav scrolling, the sun-click -> chat screen transition,
// and the mobile sidebar toggle for the chat screen.

/* ---------------- HOME NAV SCROLL ---------------- */
const homeScroll = document.getElementById('homeScroll');

function scrollHomeTo(target){
  homeScroll.scrollTop = target.offsetTop;
}

document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    window.playScreenFlip(() => scrollHomeTo(document.getElementById(a.dataset.scroll)));
  });
});
document.getElementById('navBrand').addEventListener('click', ()=>{
  window.playScreenFlip(() => { homeScroll.scrollTop = 0; });
});

// "← Back to Home" pills at the top of the Projects and Resume sections
document.querySelectorAll('[data-scroll-top]').forEach(btn=>{
  btn.addEventListener('click', event=>{
    event.preventDefault();
    window.playScreenFlip(() => { homeScroll.scrollTop = 0; });
  });
});

/* ---------------- HOME -> CHAT TRANSITION ---------------- */
const sunButton = document.getElementById('sunButton');
const flash = document.getElementById('flash');
const home = document.getElementById('home');
const chat = document.getElementById('chat');
const backHome = document.getElementById('backHome');
const chatBackBtn = document.getElementById('chatBackBtn');

function goToChat(){
  const rect = sunButton.getBoundingClientRect();
  flash.style.top = (rect.top + rect.height/2) + 'px';
  flash.style.left = (rect.left + rect.width/2) + 'px';
  flash.classList.add('go');
  setTimeout(()=>{
    home.classList.add('hidden');
    chat.classList.remove('hidden');
    chat.classList.add('active');
    document.getElementById('input').focus();
  }, 420);
  setTimeout(()=>{ flash.classList.remove('go'); flash.style.transform='scale(0)'; }, 900);
}
sunButton.addEventListener('click', goToChat);
sunButton.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') goToChat(); });

function goHome(){
  chat.classList.remove('active');
  chat.classList.add('hidden');
  home.classList.remove('hidden');
}
backHome.addEventListener('click', goHome);
chatBackBtn.addEventListener('click', goHome);

/* ---------------- MOBILE SIDEBAR ---------------- */
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
document.getElementById('menuBtn').addEventListener('click', ()=>{
  sidebar.classList.add('open'); scrim.classList.add('show');
});
scrim.addEventListener('click', ()=>{
  sidebar.classList.remove('open'); scrim.classList.remove('show');
});
