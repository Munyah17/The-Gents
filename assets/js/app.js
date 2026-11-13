
(()=>{
'use strict';
const IM={hero:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85',salon:'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80',salon2:'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80',salon3:'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=80',barber1:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80',barber2:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=620&q=80',barber3:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=620&q=80',barber4:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=620&q=80',equipment:'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=700&q=80'};
const TIERS=[
{id:'basic',name:'Basic',price:5,color:'#9aa3ad',perks:'Member rates · 50 pts per visit'},
{id:'gold',name:'Gold',price:10,color:'#d4af37',perks:'10% off retail · priority booking · 100 pts per visit'},
{id:'diamond',name:'Diamond',price:15,color:'#67e8f9',perks:'15% off · free beard trim monthly · 150 pts per visit'},
{id:'platinum',name:'Platinum',price:25,color:'#e5e4e2',perks:'20% off · dedicated barber · early access · 250 pts per visit'}];
const MEMBERS=[{id:'m001',memberNo:'GT-M-0001',name:'T. Moyo',pseudo:'TM',profession:'Engineer',email:'tmoyo@example.com',branch:'borrowdale',tier:'gold',joined:'2025-11-02',status:'active'}];
const HE=[{title:'Modern Grooming for the Gentleman',desc:'Precision cuts, expert grooming and a premium lounge experience.',photo:'/uploads/site/a10a0712.jpg'},{title:'Your Style. Our Craft.',desc:'Thoughtful details and precision barbering for every gentleman.',photo:'/uploads/site/a10a0713.jpg'},{title:'A Cut Above the Ordinary.',desc:'A relaxed space, skilled hands and a fresh look.',photo:'/uploads/site/a10a0714.jpg'},{title:'Made for the Modern Gent.',desc:'Discover signature haircuts, shaves and personal grooming.',photo:'/uploads/site/a10a0715.jpg'},{title:'Find Your Perfect Barber.',desc:'Choose your branch, barber and preferred time in minutes.',photo:'/uploads/site/a10a0716.jpg'}];
const GE=['0717','0723','0724','0725','0726','0727'].map(n=>({url:'/uploads/site/a10a'+n+'.jpg',alt:"The Gent's grooming center",category:'Grooming Center'})).concat(['0718','0719','0720','0721','0722'].map(n=>({url:'/uploads/site/a10a'+n+'.jpg',alt:'The Gent’s barbers at work',category:'Haircuts'})));
const SERVICES=[{id:'hot-towels',name:'Hot Towels Cut & Shave',desc:'Precision cut and shave finished with warm towels.',price:15,duration:25,icon:'♨',branches:['borrowdale','fife']},{id:'skin-fade-nodye',name:'Skin Fade — No Dye',desc:'A seamless skin fade, no colour added.',price:10,duration:20,icon:'✂',branches:['borrowdale','fife']},{id:'skin-fade-dye',name:'Skin Fade — With Dye',desc:'Skin fade finished with colour dye.',price:15,duration:30,icon:'✂',branches:['borrowdale','fife']},{id:'taper-fade',name:'Taper Fade',desc:'A clean taper that blends naturally.',price:15,duration:30,icon:'◐',branches:['borrowdale','fife']},{id:'burst-fade',name:'Burst Fade',desc:'A curved burst fade around the ears.',price:15,duration:30,icon:'◎',branches:['borrowdale','fife']},{id:'low-fade',name:'Low Fade',desc:'A subtle, blended low fade.',price:15,duration:30,icon:'◔',branches:['borrowdale','fife']},{id:'high-fade',name:'High Fade',desc:'A bold, defined high fade.',price:15,duration:30,icon:'◑',branches:['borrowdale','fife']},{id:'ladies-cut',name:'Ladies Cut',desc:'A tailored cut, finished to perfection.',price:15,duration:30,icon:'❀',branches:['borrowdale','fife']},{id:'kids-cut',name:'Kids Cut',desc:'A patient, quality cut for the little gents.',price:10,duration:30,icon:'★',branches:['borrowdale','fife']},{id:'beard-nodye',name:'Beard Shave — No Dye',desc:'A clean beard line-up, no colour.',price:5,duration:5,icon:'♜',branches:['borrowdale','fife']},{id:'beard-dye',name:'Beard Shave — With Dye',desc:'Beard sculpting finished with dye.',price:10,duration:15,icon:'♜',branches:['borrowdale','fife']},{id:'clean-shave',name:'Clean Shave',desc:'A close, smooth clean shave.',price:10,duration:10,icon:'⌁',branches:['borrowdale','fife']},{id:'white-tint',name:'White Tint',desc:'A crisp white colour tint.',price:30,duration:60,icon:'❆',branches:['borrowdale','fife']},{id:'color-tint',name:'Color Tint — Other Colors',desc:'Custom colour tint in any shade.',price:25,duration:60,icon:'✧',branches:['borrowdale','fife']}];
const initial={branches:[{id:'borrowdale',name:'Kudu Corner',place:'Kudu Corner, Harare',hours:'Mon–Sat · 08:00–17:30 · Sun by booking',phone:'079 052 0449',photo:'/uploads/site/a10a0723.jpg'},{id:'fife',name:'Five Avenue',place:'Five Avenue, Harare',hours:'Mon–Sat · 08:00–18:00 · Sun · 08:00–15:00',phone:'078 766 6753',photo:'/uploads/site/a10a0724.jpg'}],services:SERVICES,barbers:[{id:'tawanda',name:'Tawanda M.',role:'Senior Barber',branch:'borrowdale',photo:'',services:['hot-towels','skin-fade-nodye','skin-fade-dye','taper-fade','burst-fade','low-fade','high-fade','beard-nodye','beard-dye','clean-shave','white-tint','color-tint']},{id:'prince',name:'Prince C.',role:'Master Barber',branch:'fife',photo:'',services:['hot-towels','skin-fade-nodye','skin-fade-dye','taper-fade','burst-fade','low-fade','high-fade','ladies-cut','kids-cut','beard-nodye','beard-dye','clean-shave','white-tint','color-tint']},{id:'kuda',name:'Kuda N.',role:'Barber',branch:'fife',photo:'',services:['skin-fade-nodye','taper-fade','low-fade','high-fade','kids-cut','beard-nodye','clean-shave']},{id:'brian',name:'Brian T.',role:'Grooming Specialist',branch:'borrowdale',photo:'',services:['hot-towels','ladies-cut','beard-nodye','beard-dye','clean-shave','white-tint','color-tint']},{id:'panashe',name:'Panashe Dlamini',role:'Barber',branch:'borrowdale',photo:'/uploads/panashe-dlamini.jpg',bio:'',services:['skin-fade-nodye','skin-fade-dye','taper-fade','low-fade','high-fade','kids-cut','beard-nodye','beard-dye','clean-shave']},{id:'charmaine',name:'Charmaine Gwaze',role:'Barber',branch:'borrowdale',photo:'/uploads/charmaine-gwaze.jpg',bio:'',services:['ladies-cut','kids-cut','skin-fade-nodye','taper-fade','low-fade','beard-nodye','clean-shave']},{id:'takudzwa',name:'Takudzwa Saruchera',role:'Barber',branch:'fife',photo:'/uploads/takudzwa-saruchera.jpg',bio:'',services:['skin-fade-nodye','skin-fade-dye','taper-fade','burst-fade','low-fade','high-fade','beard-nodye','beard-dye','clean-shave']},{id:'kudakwashe',name:'Kudakwashe Mudonhi',role:'Barber',branch:'fife',photo:'/uploads/kudakwashe-mudonhi.jpg',bio:'',services:['skin-fade-nodye','skin-fade-dye','taper-fade','burst-fade','low-fade','high-fade','beard-nodye','beard-dye','clean-shave']},{id:'wesley',name:'Wesley Enock',role:'Barber',branch:'fife',photo:'/uploads/wesley-enock.jpg',bio:'',services:['skin-fade-nodye','skin-fade-dye','taper-fade','burst-fade','low-fade','high-fade','beard-nodye','beard-dye','clean-shave']}],bookings:[],contacts:[],notifications:[],membership:false,hero:HE.map(x=>({...x})),gallery:GE.map(x=>({...x})),settings:{name:'The Gent’s',phone:'+263 79 052 0449',email:'admin@thegents.co.zw',whatsapp:'+263 79 052 0449',address:'Kudu Corner & Five Avenue, Harare',logo:'/uploads/logo-the-gents.jpg',social:{facebook:'https://www.facebook.com/share/1E9i4XqKWj/',instagram:'https://www.instagram.com/gents_cut_and_shaves',tiktok:'https://www.tiktok.com/@thegentscutandshaves'},clientProfile:{name:'',phone:'',email:'',favBranch:'',favBarber:''}}};
const storage={getItem(k){try{return window.localStorage.getItem(k)}catch(e){return null}},setItem(k,v){try{window.localStorage.setItem(k,v)}catch(e){}},removeItem(k){try{window.localStorage.removeItem(k)}catch(e){}}};
const KEY='gents_prototype_v6';let db=structuredClone(initial);if(!db.membershipTiers||!db.membershipTiers.length)db.membershipTiers=structuredClone(TIERS);if(!db.members)db.members=[];if(!db.wallets)db.wallets=[];else if(!Array.isArray(db.wallets))db.wallets=Object.entries(db.wallets).map(([email,x])=>({email,balance:(x&&x.balance)||0}));if(!db.giftCards)db.giftCards=[];if(!db.walletTxns)db.walletTxns=[];if(!db.rewards)db.rewards={};if(!db.rewardConfig)db.rewardConfig={perVisit:100};
const today=new Date();today.setHours(12,0,0,0);const dateOffset=(n)=>{let d=new Date(today);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};

if(!Array.isArray(db.hero)||!db.hero.length)db.hero=HE.map(x=>({...x}));if(!Array.isArray(db.gallery)||!db.gallery.length)db.gallery=GE.map(x=>({...x}));if(!db.settings)db.settings={name:'The Gent’s',phone:'+263 79 052 0449',email:'admin@thegents.co.zw',whatsapp:'+263 79 052 0449',address:'Kudu Corner & Five Avenue, Harare',logo:'/uploads/logo-the-gents.jpg',social:{facebook:'https://www.facebook.com/share/1E9i4XqKWj/',instagram:'https://www.instagram.com/gents_cut_and_shaves',tiktok:'https://www.tiktok.com/@thegentscutandshaves'}};
const SVC_MAP={'cut':'skin-fade-nodye','beard':'beard-nodye','shave':'clean-shave','facial':'hot-towels','package':'hot-towels'};
if(db.services&&db.services.some(s=>SVC_MAP[s.id])){db.services=structuredClone(SERVICES);(db.bookings||[]).forEach(b=>{if(SVC_MAP[b.service])b.service=SVC_MAP[b.service]});(db.barbers||[]).forEach(b=>{if(Array.isArray(b.services))b.services=[...new Set(b.services.map(s=>SVC_MAP[s]||s))]})}
let remoteTimer=null,remoteDirty=false,remoteRev=null;let remoteReadyResolve=()=>{};const remoteReady=new Promise(r=>remoteReadyResolve=r);
const adoptRemote=d=>{if(!d)return;for(const k in db)delete db[k];Object.assign(db,d);syncHero()};
const gentsRole=()=>{try{return sessionStorage.getItem('gents_auth')==='admin'?'admin':'guest'}catch(e){return 'guest'}};
const remoteSave=()=>{if(!/^https?:$/.test(location.protocol))return;remoteDirty=true;clearTimeout(remoteTimer);remoteTimer=setTimeout(async()=>{try{const r=await fetch('api/db.php',{method:'POST',headers:{'Content-Type':'application/json','X-Gents-Role':gentsRole(),'X-Data-Rev':remoteRev||''},body:JSON.stringify(db),credentials:'same-origin'});if(r.status===401||r.status===403){toast('Your session expired — please sign in again.');remoteDirty=false;return}if(r.status===409){const j=await r.json();if(j&&j.data){adoptRemote(j.data);remoteRev=j.rev||remoteRev;toast('Data was updated elsewhere — latest version loaded.')}remoteDirty=false;return}if(!r.ok){const j=await r.json().catch(()=>null);toast('Save failed — '+((j&&j.error)||('server error '+r.status))+'. Your change was not stored.');remoteDirty=false;return}const j=await r.json();remoteRev=j.rev||remoteRev;if(j&&j.data)adoptRemote(j.data)}catch(e){toast('Save failed — could not reach server. Your change was not stored.')}remoteDirty=false},400)};
window.addEventListener('pagehide',()=>{if(remoteDirty&&/^https?:$/.test(location.protocol)){try{navigator.sendBeacon('api/db.php',JSON.stringify(db))}catch(e){}}});
async function bootRemote(){if(!/^https?:$/.test(location.protocol)){remoteReadyResolve();return}try{const r=await fetch('api/db.php',{credentials:'same-origin'});if(!r.ok)return;const j=await r.json();if(!j||!j.ok)return;remoteRev=j.rev||remoteRev;if(j.data){if(!remoteDirty)adoptRemote(j.data)}else remoteSave();if(gentsRole()==='admin'){const ar=await fetch('api/auth.php',{credentials:'same-origin'});const aj=await ar.json().catch(()=>null);if(!aj||!aj.ok){try{sessionStorage.removeItem('gents_auth');sessionStorage.removeItem('gents_staff')}catch(e){}if(page==='admin')render()}}}catch(e){}finally{remoteReadyResolve()}}
const save=(push=true)=>{if(!/^https?:$/.test(location.protocol))storage.setItem(KEY,JSON.stringify(db));if(push)remoteSave()};save(false);
let page=document.body.dataset.page||'home',dark=storage.getItem('gents_theme')!=='light',dashboardTab='overview',clientTab='upcoming',branchFilter='all',barberFilter='all',galleryFilter='all',bookingStep=0,booking={},selectedImage='',dateStart=1;
if(dark)document.documentElement.classList.add('dark');
const auth=(r)=>{try{return sessionStorage.getItem('gents_auth')===r}catch(e){return false}};const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const branch=(id)=>db.branches.find(x=>x.id===id)||{name:id,place:''};const service=(id)=>db.services.find(x=>x.id===id)||{name:id,price:0,duration:30};const barber=(id)=>db.barbers.find(x=>x.id===id)||{name:id};const money=(x)=>'$'+Number(x||0).toFixed(2);
const fmt=(s)=>s?new Date(s+'T12:00:00').toLocaleDateString('en-ZW',{day:'numeric',month:'short',year:'numeric'}):'—';const badge=(s)=>`<span class="status ${esc((s||'').toLowerCase().replace(/\s/g,''))}">${esc(s)}</span>`;
const button=(text,act,klass='btn')=>`<button class="${klass}" data-action="${act}">${text}</button>`;
function header(){const lg=(db.settings&&db.settings.logo)||'';return `<header class="nav"><div class="shell"><button class="icon-btn menu-toggle" data-action="menu">☰</button><a class="brand" data-page="home">${lg?`<img class="brand-logo" src="${esc(lg)}" alt="The Gent’s">`:`<div class="brand-icon">⚒</div>`}<div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS GROOMING CENTER</div></div></a><nav id="links" class="links">${[['home','Home'],['services','Services'],['barbers','Barbers'],['gallery','Gallery'],['membership','Membership'],['contact','Contact']].map(([k,t])=>`<button data-page="${k}" class="navlink ${page===k?'active':''}">${t}</button>`).join('')}</nav><div class="nav-actions"><button class="theme-toggle" data-action="theme" title="Toggle dark mode"><span class="tt-opt ${dark?'':'active'}">☀</span><span class="tt-opt ${dark?'active':''}">☾</span></button><button class="btn" data-page="login">Login</button><button class="btn btn-gold" data-action="start-booking">Book Now</button></div></div></header>`}
function waNum(s){let w=String(s||'').replace(/[^0-9]/g,'');if(w.startsWith('0'))w='263'+w.slice(1);return w}
function socialIcons(s,cls='footer-icon'){const soc=(s&&s.social)||{};return [['facebook',soc.facebook,'f'],['instagram',soc.instagram,'◎'],['tiktok',soc.tiktok,'♪']].filter(x=>x[1]).map(([k,u,i])=>`<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener" title="${k}">${i}</a>`).join('')}
function footer(){const s=db.settings||{};const ph=s.phone||'+263 79 052 0449',em=s.email||'admin@thegents.co.zw',ad=s.address||'Kudu Corner & Five Avenue, Harare',wa=waNum(s.whatsapp||ph),soc=socialIcons(s);return `<footer class="footer"><div class="shell footer-grid"><div class="footer-col"><a class="brand" data-page="home">${s.logo?`<img class="brand-logo" src="${esc(s.logo)}" alt="The Gent’s">`:`<span class="brand-icon">⚒</span>`}<span><span class="brand-title">The Gent’s</span><div class="brand-sub">BARBER & GENTS GROOMING CENTER</div></span></a><p class="footer-about">Precision cuts, expert grooming and a premium lounge experience — Harare’s destination for the modern gentleman.</p><div class="footer-social"><a class="footer-icon" href="https://wa.me/${wa}" target="_blank" rel="noopener" title="WhatsApp us">✆</a><a class="footer-icon" href="mailto:${esc(em)}" title="Email us">✉</a><a class="footer-icon" href="tel:${esc(ph.replace(/[^0-9+]/g,''))}" title="Call us">☎</a>${soc}</div></div><div class="footer-col"><h4>Quick Links</h4><a class="flink" data-page="home">Home</a><a class="flink" data-page="services">Services</a><a class="flink" data-page="barbers">Our Barbers</a><a class="flink" data-page="gallery">Gallery</a><a class="flink" data-page="membership">Membership</a><a class="flink" data-page="contact">Contact Us</a></div><div class="footer-col fcontact"><h4>Get in Touch</h4><div><span class="fi">☎</span><a href="tel:${esc(ph.replace(/[^0-9+]/g,''))}">${esc(ph)}</a></div><div><span class="fi">✉</span><a href="mailto:${esc(em)}">${esc(em)}</a></div><div><span class="fi">✆</span><a href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp ${esc(s.whatsapp||ph)}</a></div><div><span class="fi">⌖</span><span>${esc(ad)}</span></div></div><div class="footer-col"><h4>Opening Hours</h4><div class="fhours">${db.branches.map(b=>`<div class="fh"><b>${esc(b.name)}</b><span>${esc(b.hours||'')}</span>${b.phone?`<span class="muted small">☎ ${esc(b.phone)}</span>`:''}</div>`).join('')}</div><div class="footer-cta">${button('Book Appointment →','start-booking','btn btn-gold')}</div></div></div><div class="shell footer-bottom"><small>© 2026 The Gents Cut & Shave. All Rights Reserved. Developed and Powered By <a href="https://www.globalspaceweb.co.zw" target="_blank" rel="noopener" style="color:var(--gold)">Global Space Web</a>. <a href="tel:+263773909307" style="color:var(--gold)">+263773909307</a></small></div></footer>`}
const heading=(k,h,sub='')=>`<div class="heading-row"><div><div class="eyebrow">${k}</div><h2>${h}</h2>${sub?`<p class="muted">${sub}</p>`:''}</div></div>`;
const branchTiles=()=>db.branches.map(x=>`<button data-action="open-branch:${x.id}" class="card tile"><span class="tile-icon">⌖</span><span><strong>${esc(x.name)}</strong><small>${esc(x.place)}</small></span><span class="arrow">→</span></button>`).join('');
const heroSlides=[];
let slideIndex=0;
const syncHero=()=>{const s=db.hero&&db.hero.length?db.hero:HE;heroSlides.splice(0,heroSlides.length,...s);if(slideIndex>=heroSlides.length)slideIndex=0};
syncHero();
function heroMarkup(){return `<section class="slider-hero" aria-label="The Gent’s featured highlights"><div class="slider-visual">${heroSlides.map((x,i)=>`<div class="hero-slide ${i===slideIndex?'active':''}" style="background-image:url('${x.photo}')"></div>`).join('')}<div class="hero-glass"></div></div><div class="slider-content"><div class="eyebrow">PREMIUM BARBER & GENTS GROOMING CENTER</div><h1 id="slide-title">${heroSlides[slideIndex].title}</h1><p id="slide-desc">${heroSlides[slideIndex].desc}</p><div class="hero-actions">${button('Book Appointment →','start-booking','btn btn-gold')}${button('Explore Services','go:services','btn btn-hero-outline')}</div></div><div class="slider-bottom"><div class="slider-dots">${heroSlides.map((x,i)=>`<button class="slider-dot ${i===slideIndex?'active':''}" aria-label="Slide ${i+1}" data-action="slide:${i}"></button>`).join('')}</div><div class="slider-arrows"><button class="slider-arrow" aria-label="Previous slide" data-action="slide-prev">←</button><button class="slider-arrow" aria-label="Next slide" data-action="slide-next">→</button></div></div></section>`}
function serviceCard(x){return `<article class="card service-card">${x.image?`<img class="service-img" src="${esc(x.image)}" alt="${esc(x.name)}">`:''}<div class="service-card-icon">${x.icon}</div><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><div class="service-card-bottom"><span>${x.duration} min <b>· ${money(x.price)}</b></span><button class="service-book" data-action="book-service:${x.id}">Book ↗</button></div></article>`}
function membershipCard(){return `<div class="membership-card" role="img" aria-label="Illustration of The Gent’s membership card"><div class="member-card-glow"></div><div class="member-card-top"><span class="member-card-mark">✂</span><span>MEMBER</span></div><div class="member-card-brand">The Gent’s</div><div class="member-card-caption">BARBER & GENTS GROOMING CENTER</div><div class="member-card-bottom"><span>THE GENT’S CLUB</span><span>✦ ✦ ✦</span></div></div>`}
const STATS=[['✂','1,200+','Happy Clients'],['♛','8+','Years of Craft'],['⌖','2','Prime Locations'],['★','4.9','Average Rating']];
const WHY=[['✂','Premium Tools & Products','Professional-grade equipment and products for every service on the menu.'],['♛','Expert Barbers','Skilled, vetted professionals who take genuine pride in their work.'],['⌖','Two Convenient Locations','Kudu Corner and Five Avenue — choose the branch closest to you.'],['◷','Effortless Booking','Reserve online in minutes or walk in during opening hours.']];
const TESTIMONIALS=[{name:'T. Moyo',role:'Loyal Client · Kudu Corner',text:'Best fade in Harare. The attention to detail is unreal — I haven’t missed an appointment in months.',rating:5},{name:'C. Dube',role:'Client · Five Avenue',text:'Booked online in two minutes and the whole experience felt premium from start to finish.',rating:5},{name:'R. Chikomo',role:'Client · Kudu Corner',text:'The Signature package is worth every cent. My beard has never looked this sharp.',rating:5}];
function statsStrip(){return `<section class="section-tight" style="padding-top:8px"><div class="stat-grid">${STATS.map(([i,n,t])=>`<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div></section>`}
function whyUs(){return `<section class="section-tight">${heading('WHY CHOOSE US','The Gent’s Difference','More than a haircut — a complete grooming experience.')}${`<div class="grid grid-4">${WHY.map(([i,t,d])=>`<div class="card why-card"><div class="why-icon">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`}</section>`}
function testimonials(){return `<section class="section-tight">${heading('WALK-IN REVIEWS','Client Stories','Don’t just take our word for it.')}${`<div class="grid grid-3">${TESTIMONIALS.map(t=>`<div class="card testi-card"><div class="testi-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div><p class="testi-quote">“${t.text}”</p><div class="testi-author"><strong>${esc(t.name)}</strong><span class="muted small">${esc(t.role)}</span></div></div>`).join('')}</div><div class="section-foot">${button('Book Your Appointment →','start-booking','btn btn-gold')}</div>`}</section>`}
function gentlemensStory(){const img=(db.hero&&db.hero[0]&&db.hero[0].photo)||(db.gallery&&db.gallery[0]&&db.gallery[0].url)||IM.salon;return `<section class="section-tight"><div class="member-section"><div class="member-section-copy"><div class="eyebrow">THE GENTLEMEN'S STORY</div><h2>He saw kings walking like commoners.</h2><p>Men with power in their hands, but doubt in their eyes — settling for rushed cuts in loud shops that treated them like numbers. So he built his own table, one chair, one blade, one standard. Excellence.</p><p>Here, a haircut is a reset, a shave is a statement. You don't just look sharp — you remember who you are.</p><p class="muted"><b>This is The Gentlemen's</b> — where ordinary men come in, and confident kings walk out. The smallest thing makes the biggest difference.</p></div><img class="story-img" src="${esc(img)}" alt="The Gentlemen's Story"></div></section>`}
function home(){return `${heroMarkup()}<div class="shell">${statsStrip()}<section class="section-tight">${heading('FIND YOUR LOCATION','Our Branches','Choose a location to explore its team and services.')}<div class="grid grid-4 branch-grid">${branchTiles()}</div></section><section class="section-tight">${heading('WHAT WE DO','Our Services','Simple, expert grooming.')}<div class="grid grid-4 service-grid">${db.services.slice(0,4).map(serviceCard).join('')}</div><div class="section-foot">${button('View All Services →','go:services')}</div></section>${whyUs()}${db.branches.map(br=>`<section class="section-tight">${heading('MEET THE TEAM',esc(br.name)+' Barbers','Our team at '+esc(br.name)+'.')}<div class="grid grid-4 barber-row">${db.barbers.filter(x=>x.branch===br.id).slice(0,4).map(x=>barberCard(x)).join('')}</div><div class="section-foot">${button('View All Barbers →','go:barbers')}</div></section>`).join('')}<section class="section-tight"><div class="member-section"><div class="member-section-copy"><div class="eyebrow">THE GENT’S MEMBERSHIP</div><h2>More than a haircut.</h2><p>Exclusive benefits, priority booking and a better grooming experience.</p>${button('Explore Membership →','go:membership','btn btn-gold')}</div>${membershipCard()}</div></section>${gentlemensStory()}<section class="section-tight">${heading('BEHIND THE CHAIR','Gallery')}<div class="grid grid-4">${galleryImages().slice(0,4).map(x=>`<div class="card"><img class="gallery-img" data-action="image:${x.url}" src="${x.url}" alt="${x.alt}"></div>`).join('')}</div></section>${testimonials()}</div>`}

function services(){return `<div class="shell"><div class="page-head"><div class="eyebrow">OUR EXPERTISE</div><h1>Our Services</h1><p>Expert grooming services tailored for the modern gentleman. Select a card to book.</p></div><div class="grid grid-4 service-grid">${db.services.map(serviceCard).join('')}</div></div>`}
function barberCard(x){const ph=x.photo||'',lg=(db.settings&&db.settings.logo)||'/uploads/logo-the-gents.jpg';return `<div class="card">${ph?`<img class="barber-photo" src="${ph}" alt="${esc(x.name)}" loading="lazy">`:`<div class="barber-photo barber-photo-fallback"><img src="${esc(lg)}" alt="${esc(x.name)}"></div>`}<div class="barber-info"><h3>${esc(x.name)}</h3><p>${esc(x.role)} · ${esc(branch(x.branch).name)}</p>${x.bio?`<p class="small muted" style="margin:2px 0 8px">${esc(x.bio)}</p>`:''}${button('Book with '+esc(x.name.split(' ')[0])+' →','book-barber:'+x.id,'btn btn-sm')}</div></div>`}
function barbers(){let list=db.barbers.filter(x=>barberFilter==='all'||x.branch===barberFilter);return `<div class="shell"><div class="page-head"><div class="eyebrow">THE TEAM</div><h1>Our Barbers</h1><p>Meet our skilled and experienced barbers.</p></div><div class="segmented" style="margin-bottom:22px">${[{id:'all',name:'All Branches'},...db.branches].map(x=>`<button class="pill ${barberFilter===x.id?'active':''}" data-action="barber-filter:${x.id}">${esc(x.name)}</button>`).join('')}</div><div class="grid grid-4">${list.map(barberCard).join('')}</div></div>`}
function galleryImages(){return (db.gallery&&db.gallery.length?db.gallery:GE).map(x=>({url:x.url,alt:x.alt||'Gallery image',category:x.category||'Grooming Center'}))}
function gallery(){const all=galleryImages(),cats=['all',...new Set(all.map(x=>x.category))],imgs=all.filter(x=>galleryFilter==='all'||x.category===galleryFilter);return `<div class="shell"><div class="page-head"><div class="eyebrow">OUR WORK</div><h1>Gallery</h1><p>A look inside The Gent’s experience.</p></div><div class="segmented" style="margin-bottom:23px">${cats.map(x=>`<button data-action="gallery-filter:${x}" class="pill ${galleryFilter===x?'active':''}">${x==='all'?'All':esc(x)}</button>`).join('')}</div><div class="grid grid-4">${imgs.map(x=>`<div class="card"><img loading="lazy" class="gallery-img" data-action="image:${x.url}" src="${x.url}" alt="${x.alt}"></div>`).join('')}</div></div>`}
function membership(){const tiers=(typeof memTiers==='function'?memTiers():[])||[];const tierCards=tiers.map(t=>{const perks=Array.isArray(t.perks)?t.perks:String(t.perks||'').split('·').map(x=>x.trim()).filter(Boolean);return `<div class="card" style="padding:22px;text-align:center"><div class="mem-tier" style="--tc:${esc(t.color||'#9aa3ad')};margin:0 auto 10px">${esc(t.name)}</div><div style="font-size:26px;font-weight:700;color:var(--gold)">$${Number(t.price||0)}</div><div class="small muted" style="margin-bottom:10px">per month</div><div class="small" style="text-align:left">${perks.map(p=>`<div style="padding:3px 0">✓ ${esc(p)}</div>`).join('')}</div></div>`}).join('');return `<div class="shell"><div class="page-head"><div class="eyebrow">THE GENT’S CLUB</div><h1>Membership</h1><p>Exclusive benefits for our loyal clients.</p></div><div class="grid grid-4" style="margin-bottom:30px">${tierCards||'<p class="muted">Membership tiers coming soon.</p>'}</div><div class="member-section member-page-section"><div class="member-section-copy"><div class="eyebrow">A LITTLE SOMETHING EXTRA</div><h2>More than a haircut.</h2><p>A premium experience, with benefits worth coming back for — member-only offers, priority booking, exclusive experiences and early access to new services.</p>${button('Join Membership →','join-membership','btn btn-gold')}<p class="muted small" style="margin-top:18px">Create a free client account to enrol — your digital membership card lives in your client portal.</p></div>${membershipCard()}</div></div>`}
function contact(){const s=db.settings||{};const ph=s.phone||'+263 79 052 0449',em=s.email||'admin@thegents.co.zw',ad=s.address||'Kudu Corner & Five Avenue, Harare',wa=waNum(s.whatsapp||ph),soc=socialIcons(s,'soc-icon');return `<div class="shell"><div class="page-head"><div class="eyebrow">SAY HELLO</div><h1>Get in Touch</h1><p>We’re here to assist you.</p></div><div class="contact-grid"><form class="page-panel" id="contact-form"><h3>Send a message</h3><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" placeholder="Your name"></div><div class="form-group"><label class="form-label">Email</label><input class="field" required type="email" name="email" placeholder="you@example.com"></div></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Message</label><textarea required class="field" name="message" placeholder="How can we help?"></textarea></div><button type="submit" class="btn btn-gold">Send Message →</button></form><div class="page-panel"><h3>Contact details</h3><div class="info-list"><div class="info-item"><span class="gold">☎</span><div><b>Phone</b><a class="muted" href="tel:${esc(ph.replace(/[^0-9+]/g,''))}">${esc(ph)}</a></div></div><div class="info-item"><span class="gold">✉</span><div><b>Email</b><a class="muted" href="mailto:${esc(em)}">${esc(em)}</a></div></div><div class="info-item"><span class="gold">✆</span><div><b>WhatsApp</b><a class="muted" href="https://wa.me/${wa}" target="_blank" rel="noopener">${esc(s.whatsapp||ph)}</a></div></div><div class="info-item"><span class="gold">⌖</span><div><b>Locations</b><span class="muted">${esc(ad)}</span></div></div></div>${soc?`<div class="soc-row" style="margin-top:20px">${soc}</div>`:''}<div style="margin-top:28px">${button('WhatsApp enquiry ↗','whatsapp-demo','btn')}</div></div></div><div class="section-tight" style="padding-top:0"><div class="grid grid-2">${db.branches.map(x=>`<div class="page-panel"><h3>⌖ ${esc(x.name)}</h3><p class="muted small">${esc(x.place)}</p><div class="info-list"><div class="info-item"><span class="gold">☎</span><div><b>Call</b>${x.phone?`<a class="muted" href="tel:${esc(x.phone.replace(/[^0-9]/g,''))}">${esc(x.phone)}</a>`:'<span class="muted">—</span>'}</div></div><div class="info-item"><span class="gold">◷</span><div><b>Hours</b><span class="muted">${esc(x.hours||'')}</span></div></div></div></div>`).join('')}</div></div></div>`}
function branchPage(id){const x=branch(id);return `<div class="shell"><div class="hero"><div><div class="eyebrow">THE GENT’S · ${esc(x.name.toUpperCase())}</div><h1>Your grooming destination in ${esc(x.name)}</h1><p>A refined space for precision cuts, expert grooming and excellent service.</p><p class="muted">⌖ ${esc(x.place)}<br>◷ ${esc(x.hours)}</p>${button('Book at this Branch →','book-branch:'+id,'btn btn-gold')} ${button('All Branches','go:home')}</div><img class="hero-photo" src="${x.photo}" alt="${esc(x.name)} branch"></div><div class="section-tight">${heading('THE TEAM','Our Barbers')}<div class="grid grid-4">${db.barbers.filter(b=>b.branch===id).map(barberCard).join('')}</div></div></div>`}
function resetBooking(preset={}){booking={branch:'',service:'',barber:'',date:'',time:'',name:'',email:'',phone:'',...preset};bookingStep=preset.branch?(preset.barber?3:preset.service?2:1):0;page='booking';render()}
const stepLabels=['Branch','Service','Barber','Date & Time','Details','Review'];
function bookingPage(){return `<div class="shell"><div class="page-head" style="text-align:center"><div class="eyebrow">APPOINTMENTS</div><h1>Book an Appointment</h1><p style="margin:0 auto">Choose your branch, service, barber and preferred time.</p></div><div class="steps">${stepLabels.map((x,i)=>`<div class="step ${i===bookingStep?'active':i<bookingStep?'done':''}"><div class="step-num">${i<bookingStep?'✓':i+1}</div><span>${x}</span></div>`).join('')}</div><div class="booking-wrap"><div class="page-panel">${bookingStepContent()}<div class="booking-actions">${bookingStep>0?button('← Back','book-back'):''}${bookingStep<5?button('Continue →','book-next','btn btn-gold'):button('Submit Booking Request →','book-submit','btn btn-gold')}</div></div></div></div>`}
function bookingStepContent(){if(bookingStep===0)return `<h2>Select a Branch</h2><p class="muted">Choose the location you would like to visit.</p><div class="grid grid-4 booking-cards">${db.branches.map(x=>`<button class="selectable ${booking.branch===x.id?'selected':''}" data-action="book-choose-branch:${x.id}"><img src="${x.photo}" alt=""><div class="body"><strong>${esc(x.name)}</strong><small>${esc(x.place)}</small></div></button>`).join('')}</div>`;
if(bookingStep===1)return `<h2>Select a Service</h2><p class="muted">Choose your grooming treatment.</p><div class="grid grid-3">${db.services.filter(x=>x.branches.includes(booking.branch)).map(x=>`<button class="selectable ${booking.service===x.id?'selected':''}" style="padding:19px" data-action="book-choose-service:${x.id}"><div class="gold" style="font-size:24px">${x.icon}</div><strong style="display:block;margin:11px 0 6px">${esc(x.name)}</strong><small class="muted">${x.duration} min · ${money(x.price)}</small></button>`).join('')}</div>`;
if(bookingStep===2){let bx=db.barbers.filter(x=>x.branch===booking.branch&&x.services.includes(booking.service));return `<h2>Select a Barber</h2><p class="muted">Choose your barber or let us assign one.</p><div class="grid grid-3 booking-cards"><button class="selectable ${booking.barber==='any'?'selected':''}" data-action="book-choose-barber:any"><div class="body" style="padding:28px"><strong>Any Available Barber</strong><small>We will assign an available professional.</small></div></button>${bx.map(x=>`<button class="selectable ${booking.barber===x.id?'selected':''}" data-action="book-choose-barber:${x.id}"><img src="${x.photo}" alt=""><div class="body"><strong>${esc(x.name)}</strong><small>${esc(x.role)}</small></div></button>`).join('')}</div>`}
if(bookingStep===3){let days=Array.from({length:14},(_,i)=>{let d=new Date(today);d.setDate(d.getDate()+i+1);const iso=d.toISOString().slice(0,10);return {iso,day:d.toLocaleDateString('en-ZW',{weekday:'short'}),n:d.getDate()}});let slots=['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];return `<h2>Choose a Date & Time</h2><p class="muted">Available times are illustrative.</p><div class="date-grid">${days.map(d=>`<button class="date-choice ${booking.date===d.iso?'selected':''}" data-action="book-choose-date:${d.iso}"><small>${d.day}</small><strong>${d.n}</strong></button>`).join('')}</div><div style="margin-top:25px"><strong>Available times ${booking.date?'· '+fmt(booking.date):''}</strong><div class="times">${slots.map(t=>{const busy=booking.date&&db.bookings.some(b=>b.date===booking.date&&b.time===t&&b.branch===booking.branch&&['Pending','Confirmed'].includes(b.status)&&(booking.barber==='any'||b.barber===booking.barber));return `<button class="time-choice ${booking.time===t?'selected':''}" data-action="book-choose-time:${t}" ${busy?'disabled':''}>${t}</button>`}).join('')}</div></div>`}
if(bookingStep===4)return `<h2>Your Details</h2><p class="muted">We’ll use these details for your appointment notification.</p><div class="form-grid"><div class="form-group"><label class="form-label">Full name *</label><input class="field" id="bk-name" value="${esc(booking.name)}" placeholder="Your full name"></div><div class="form-group"><label class="form-label">Phone *</label><input class="field" id="bk-phone" value="${esc(booking.phone)}" placeholder="+263..."></div><div class="form-group"><label class="form-label">Email *</label><input class="field" id="bk-email" type="email" value="${esc(booking.email)}" placeholder="you@example.com"></div><div class="form-group"><label class="form-label">Notes (optional)</label><input class="field" id="bk-notes" value="${esc(booking.notes||'')}" placeholder="Any special requests?"></div></div><div class="notice">Your request is subject to approval by the branch receptionist.</div>`;
return `<h2>Review Your Booking</h2><p class="muted">Check the details before sending your request.</p><div class="review-grid"><div>${[['Branch',branch(booking.branch).name],['Service',service(booking.service).name],['Barber',booking.barber==='any'?'Any Available Barber':barber(booking.barber).name],['Date',fmt(booking.date)],['Time',booking.time],['Name',booking.name],['Phone',booking.phone],['Email',booking.email]].map(([a,b])=>`<div class="summary-row"><span>${a}</span><strong>${esc(b)}</strong></div>`).join('')}</div><div class="card card-pad"><div class="eyebrow">BOOKING SUMMARY</div><h2 style="margin:12px 0">${money(service(booking.service).price)}</h2><p class="muted">${esc(service(booking.service).name)} · ${service(booking.service).duration} min</p><div class="notice" style="margin-top:25px">⏳ This booking is <b>not yet confirmed</b>. The receptionist will review your request.</div></div></div>`}
function client(){if(!auth('client')){location.replace('login');return''}let list=db.bookings.filter(x=>x.phone==='+263771234567'||x.clientCreated);let upcoming=list.filter(x=>x.status!=='Completed'&&x.status!=='Cancelled'&&x.status!=='Declined');let past=list.filter(x=>!upcoming.includes(x));return dashboardFrame('client',`<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>My Bookings</h1><p class="muted">View and manage your appointments.</p></div>${button('Book New Appointment →','start-booking','btn btn-gold')}</div><div class="segmented" style="margin-bottom:22px"><button class="pill ${clientTab==='upcoming'?'active':''}" data-action="client-tab:upcoming">Upcoming (${upcoming.length})</button><button class="pill ${clientTab==='past'?'active':''}" data-action="client-tab:past">Past (${past.length})</button></div>${(clientTab==='upcoming'?upcoming:past).map(b=>`<div class="appointment" style="margin-bottom:12px"><div><strong>${esc(service(b.service).name)}</strong><small>⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</small></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${badge(b.status)}<button class="btn btn-sm" data-action="view-booking:${b.id}">Details</button>${b.status==='Confirmed'||b.status==='Pending'?`<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>`:''}${b.status==='Completed'?`<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>`:''}</div></div>`).join('')||`<div class="empty card">No ${clientTab} bookings yet. Try booking an appointment to add one.</div>`}`)}
function dashboardFrame(role,content){const admin=role==='admin';let items=admin?[["overview","Dashboard","⌂"],["bookings","Bookings","▢"],["calendar","Calendar","▦"],["branches","Branches","⌖"],["barbers","Barbers","✂"],["services","Services","✧"],["clients","Clients","♧"],["reports","Reports","▥"],["settings","Settings","⚙"]]:[["mybookings","My Bookings","▢"],["profile","Profile","♙"]];const selected=admin?dashboardTab:'mybookings';let nav=items.map(([key,title,ico])=>`<button class="${selected===key?'active':''}" data-action="${admin?'admin-tab':'client-side'}:${key}">${ico} &nbsp; ${title}</button>`).join('');return `<div class="dashboard"><aside class="side"><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS GROOMING CENTER</div></div></a><div class="side-nav">${nav}<button data-page="home">↗ &nbsp; Visit Website</button></div></aside><div><div class="dash-mobile">${nav}</div><main class="dash-main">${content}</main></div></div>`}
function admin(){return auth('admin')?dashboardFrame('admin',adminBody()):loginCard('admin')}
function adminBody(){let f=branchFilter==='all'?db.bookings:db.bookings.filter(b=>b.branch===branchFilter);const top=`<div class="dash-top"><div><div class="eyebrow">THE GENT’S · MANAGEMENT</div><h1>${({overview:'Admin Dashboard',bookings:'Bookings',calendar:'Appointment Calendar',branches:'Branches',barbers:'Barbers',services:'Services',clients:'Clients',reports:'Reports & Analytics',settings:'Settings'})[dashboardTab]}</h1><p class="muted">${dashboardTab==='overview'?'Overview of bookings and branch performance.':'Changes are saved in your browser.'}</p></div><select id="admin-branch" class="field" style="width:205px"><option value="all">All Branches</option>${db.branches.map(b=>`<option value="${b.id}" ${branchFilter===b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></div>`;
const counts=(s)=>f.filter(x=>x.status===s).length;
if(dashboardTab==='overview')return top+`<div class="stat-grid">${[['▢',f.length,'Total Bookings'],['✓',counts('Confirmed'),'Confirmed'],['◷',counts('Pending'),'Pending'],['×',counts('Cancelled'),'Cancelled']].map(([ico,num,t])=>`<div class="stat"><span class="stat-icon">${ico}</span><div class="number">${num}</div><div class="small">${t}</div></div>`).join('')}</div><div class="panel">${bookingTable(f.slice().reverse().slice(0,7),'Recent Bookings',true)}</div><div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Branch Performance</h3></div>${db.branches.map(x=>{let n=db.bookings.filter(b=>b.branch===x.id).length;return `<div class="progress-row"><span>${esc(x.name)}</span><div class="track"><div class="fill" style="width:${Math.max(3,n/db.bookings.length*100)}%"></div></div><b>${n}</b></div>`}).join('')}</div><div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="grid grid-3">${button('+ Walk-in','walkin','btn')}${button('+ Branch','add-branch','btn')}${button('Pending','admin-tab:bookings','btn')}</div></div></div>`;
if(dashboardTab==='bookings')return top+`<div class="panel"><div class="panel-head"><h3>All Bookings</h3><div class="auth-actions">${button('+ Walk-in','walkin','btn btn-gold btn-sm')}${button('Reset Data','reset','btn btn-sm')}</div></div>${bookingTable(f.slice().reverse(),'Booking Requests',false)}</div>`;
if(dashboardTab==='calendar'){let groups=[...new Set(f.map(x=>x.date))].sort();return top+`<div class="panel"><div class="panel-head"><h3>Calendar</h3>${button('+ Walk-in','walkin','btn btn-gold btn-sm')}</div>${groups.map(day=>`<h3 style="font-size:20px;margin:25px 0 12px">${fmt(day)}</h3>${f.filter(b=>b.date===day).sort((a,b)=>a.time.localeCompare(b.time)).map(b=>`<div class="appointment"><div><strong>${esc(b.time)} · ${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${esc(branch(b.branch).name)}</small></div>${badge(b.status)}</div>`).join('')}`).join('')||'<p class="muted">No appointments.</p>'}</div>`}
if(dashboardTab==='branches')return top+`<div class="panel"><div class="panel-head"><h3>Branch Directory</h3>${button('+ Add Branch','add-branch','btn btn-gold btn-sm')}</div><div class="grid grid-3">${db.branches.map(x=>`<div class="card"><img class="branch-photo" src="${x.photo}"><div class="card-pad"><h3>${esc(x.name)}</h3><p class="muted small">${esc(x.place)}<br>${esc(x.hours)}</p>${button('View Page','open-branch:'+x.id,'btn btn-sm')}</div></div>`).join('')}</div></div>`;
if(dashboardTab==='barbers')return top+`<div class="panel"><div class="panel-head"><h3>Team</h3>${button('+ Add Barber','add-barber','btn btn-gold btn-sm')}</div><div class="grid grid-4">${db.barbers.map(barberCard).join('')}</div></div>`;
if(dashboardTab==='services')return top+`<div class="panel"><div class="panel-head"><h3>Services & Prices</h3>${button('+ Add Service','add-service','btn btn-gold btn-sm')}</div>${db.services.map(x=>`<div class="service-row"><span class="service-icon">${x.icon}</span><div class="service-text"><strong>${esc(x.name)}</strong><small>${x.duration} min</small></div><b>${money(x.price)}</b>${button('Edit','edit-service:'+x.id,'btn btn-sm')}</div>`).join('')}</div>`;
if(dashboardTab==='clients'){let clients=[...new Map(db.bookings.map(x=>[x.phone,x])).values()];return top+`<div class="panel"><div class="panel-head"><h3>Customers (${clients.length})</h3></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Last Booking</th></tr></thead><tbody>${clients.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td>${esc(x.email)}</td><td>${fmt(x.date)}</td></tr>`).join('')}</tbody></table></div></div>`}
if(dashboardTab==='reports'){const total=f.length||1;return top+`<div class="stat-grid">${[['◉','1,284','Visitors (sample)'],['↗','3.8%','Booking rate (sample)'],['▢',f.length,'Actual bookings'],['✓',counts('Confirmed'),'Confirmed appointments']].map(([i,n,t])=>`<div class="stat"><div class="stat-icon">${i}</div><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div><div class="dash-grid"><div class="panel"><h3>Booking Status</h3>${['Pending','Confirmed','Cancelled','Completed'].map(x=>`<div class="progress-row"><span>${x}</span><div class="track"><div class="fill" style="width:${counts(x)/total*100}%"></div></div><b>${counts(x)}</b></div>`).join('')}</div><div class="panel"><h3>Source Breakdown</h3>${['Online','Walk-in'].map(x=>{let n=f.filter(b=>b.source===x).length;return `<div class="progress-row"><span>${x}</span><div class="track"><div class="fill" style="width:${n/total*100}%"></div></div><b>${n}</b></div>`}).join('')}<p class="small muted">Visitor figures above are illustrative; bookings reflect actual data.</p></div></div>`}
return top+`<div class="panel" style="max-width:620px"><h3>Settings</h3><p class="muted">Theme, sample data and local state controls.</p><div class="auth-actions">${button('Toggle Theme','theme')}${button('Reset Sample Data','reset')}${button('Preview Website','go:home','btn btn-gold')}</div><p class="muted small" style="margin-top:25px">In production, SMTP, WhatsApp Business API, roles and SEO settings would be configured on the PHP/MySQL backend. This prototype makes no network changes.</p></div>`}
function bookingTable(list,title,short){return `${short?`<div class="panel-head"><h3>${title}</h3>${button('View All','admin-tab:bookings','btn btn-sm')}</div>`:''}<div class="table-wrap"><table><thead><tr><th>Time</th><th>Client</th><th>Service</th><th>Barber</th><th>Branch</th><th>Status</th><th>Action</th></tr></thead><tbody>${list.map(b=>`<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td>${badge(b.status)}</td><td>${b.status==='Pending'?`<div class="row-actions"><button class="btn btn-sm" data-action="approve:${b.id}">✓</button><button class="btn btn-sm" data-action="decline:${b.id}">×</button></div>`:button('View','view-booking:'+b.id,'btn btn-sm')}</td></tr>`).join('')}</tbody></table>${list.length?'':'<div class="empty">No bookings yet.</div>'}</div>`}
function login(){if(auth('admin')){location.replace('admin');return''}if(auth('client')){location.replace('client');return''}return loginCard('client')}function loginCard(role){const admin=role==='admin';return `<div class="shell" style="max-width:560px"><div class="page-panel" style="margin:60px auto"><div class="eyebrow">${admin?'ADMIN PORTAL':'CLIENT PORTAL'}</div><h2 style="margin:12px 0 6px">Sign In</h2><p class="muted">${admin?'Sign in to the management dashboard.':'Sign in to view and manage your bookings.'}</p><form id="login-form" data-role="${role}"><div class="form-group"><label class="form-label">Email, name or pseudonym</label><input class="field" type="text" required name="email" placeholder="you@example.com · Alex Demo · AD"></div><div class="form-group"><label class="form-label">Password</label><input class="field" type="password" required name="password" placeholder="Enter your password"></div><button class="btn btn-gold" type="submit" style="width:100%">Sign In →</button></form><p class="muted small" style="margin-top:20px;text-align:center">${admin?'':'New here? <a href="booking" style="color:var(--gold)">Book an appointment</a> · <a href="#" data-action="cl-register" style="color:var(--gold)">Create account</a>'}</p></div></div>`}function confirmPage(){return `<div class="shell" style="max-width:740px;text-align:center"><div class="section"><div style="display:inline-grid;place-items:center;background:var(--gold-soft);color:var(--gold);width:72px;height:72px;border-radius:50%;font-size:29px;margin-bottom:20px">✓</div><div class="eyebrow">REQUEST SUBMITTED</div><h1>Booking Request Received</h1><p class="muted">Your request has been sent to the branch receptionist for review. Notifications are simulated.</p><div class="page-panel" style="margin:25px auto;max-width:540px;text-align:left">${[['Booking reference',booking.id],['Branch',branch(booking.branch).name],['Service',service(booking.service).name],['Date',fmt(booking.date)],['Time',booking.time],['Status','Pending approval']].map(([k,v])=>`<div class="summary-row"><span>${k}</span><strong>${esc(v)}</strong></div>`).join('')}</div>${button('My Bookings','go:client','btn btn-gold')} ${button('Back to Home','go:home')}</div></div>`}
function render(){syncHero();let body;if(page.startsWith('branch:'))body=branchPage(page.slice(7));else body=({home,services,barbers,gallery,membership,contact,booking:bookingPage,client,admin,login,confirmation:confirmPage})[page]?.()||home();document.getElementById('app').innerHTML=header()+`<div class="page">${body}</div>`+(page==='admin'||page==='client'?'':footer());document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)}`;document.querySelector('meta[name=theme-color]').content=dark?'#111111':'#ffffff';}
function navigate(p){if(p.startsWith('branch:')){location.href='branch#'+p.slice(7);return}const f={home:'index',services:'services',barbers:'barbers',gallery:'gallery',membership:'membership',contact:'contact',login:'login',booking:'booking',client:'client',admin:'admin',confirmation:'booking'}[p]||'index';const fp=(location.pathname.split('/').pop()||'index');if(f===fp){page=p;window.scrollTo({top:0,behavior:'instant'});render()}else location.href=f}
function toast(message){document.getElementById('toast-root').innerHTML=`<div class="toast"><b>Notification</b><br>${esc(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>document.getElementById('toast-root').innerHTML='',3500)}
function modal(title,content){document.getElementById('modal-root').innerHTML=`<div class="overlay" id="overlay"><div class="modal"><div class="modal-top"><h3>${title}</h3><button data-action="close-modal" class="icon-btn">×</button></div>${content}</div></div>`}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function showSlide(n){slideIndex=(n+heroSlides.length)%heroSlides.length;const slides=document.querySelectorAll('.hero-slide');slides.forEach((el,i)=>el.classList.toggle('active',i===slideIndex));document.querySelectorAll('.slider-dot').forEach((el,i)=>el.classList.toggle('active',i===slideIndex));const title=document.getElementById('slide-title'),desc=document.getElementById('slide-desc');if(title)title.innerHTML=heroSlides[slideIndex].title;if(desc)desc.textContent=heroSlides[slideIndex].desc;}
setInterval(()=>{if(page==='home'&&!document.hidden)showSlide(slideIndex+1)},6500);
function handle(action){let [cmd,...parts]=action.split(':'),val=parts.join(':');if(cmd==='slide')return showSlide(Number(val));if(cmd==='slide-next')return showSlide(slideIndex+1);if(cmd==='slide-prev')return showSlide(slideIndex-1);if(cmd==='go')return navigate(val);if(cmd==='theme'){dark=!dark;document.documentElement.classList.toggle('dark',dark);storage.setItem('gents_theme',dark?'dark':'light');render();return}if(cmd==='menu'){document.getElementById('links').classList.toggle('open');return}if(cmd==='start-booking'){try{sessionStorage.removeItem('gents_booking_preset')}catch(e){}location.href='booking';return};if(cmd==='open-branch')return navigate('branch:'+val);if(cmd==='book-branch'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:val}))}catch(e){}location.href='booking';return};if(cmd==='book-service'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({service:val}))}catch(e){}location.href='booking';return};if(cmd==='book-barber'){let b=barber(val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,barber:val}))}catch(e){}location.href='booking';return}if(cmd==='barber-filter'){barberFilter=val;return render()}if(cmd==='gallery-filter'){galleryFilter=val;return render()}if(cmd==='image'){return modal('Gallery',`<img style="width:100%;border-radius:10px" src="${val}" alt="Gallery preview">`)}if(cmd==='close-modal')return closeModal();if(cmd==='join-membership'){location.href='login';return}if(cmd==='whatsapp-demo'){const w=(db.settings&&db.settings.whatsapp)||'+263 77 601 1938';window.open('https://wa.me/'+w.replace(/[^0-9]/g,''),'_blank');return}
if(cmd==='book-choose-branch'){booking.branch=val;booking.barber='';if(booking.service&&!service(booking.service).branches.includes(val))booking.service='';booking.date='';booking.time='';return render()}if(cmd==='book-choose-service'){booking.service=val;booking.barber='';booking.date='';booking.time='';return render()}if(cmd==='book-choose-barber'){booking.barber=val;booking.date='';booking.time='';return render()}if(cmd==='book-choose-date'){booking.date=val;booking.time='';return render()}if(cmd==='book-choose-time'){booking.time=val;return render()};if(cmd==='book-back'){bookingStep=Math.max(0,bookingStep-1);return render()}if(cmd==='book-next'){if(bookingStep===0&&!booking.branch||bookingStep===1&&!booking.service||bookingStep===2&&!booking.barber||bookingStep===3&&(!booking.date||!booking.time))return toast('Please make a selection before continuing.');if(bookingStep===4){booking.name=document.getElementById('bk-name').value.trim();booking.phone=document.getElementById('bk-phone').value.trim();booking.email=document.getElementById('bk-email').value.trim();booking.notes=document.getElementById('bk-notes').value.trim();if(!booking.name||!booking.phone||!/^\S+@\S+\.\S+$/.test(booking.email))return toast('Please enter a name, phone number and valid email.')}bookingStep++;return render()}
if(cmd==='book-submit'){const assigned=booking.barber==='any'?(db.barbers.find(x=>x.branch===booking.branch&&x.services.includes(booking.service))||{}).id:booking.barber;if(!assigned)return toast('No available barber for this selection.');if(db.bookings.some(x=>x.branch===booking.branch&&x.barber===assigned&&x.date===booking.date&&x.time===booking.time&&['Pending','Confirmed'].includes(x.status)))return toast('This slot has just been taken. Please choose another.');booking.id='GT-'+(1050+db.bookings.length)+'-'+Math.random().toString(36).slice(2,6);db.bookings.push({...booking,barber:assigned,status:'Pending',source:'Online',clientCreated:true,clientEmail:clEmail()});db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);try{sessionStorage.setItem('gents_auth','client')}catch(e){}save();return navigate('confirmation')}
if(cmd==='admin-tab'){dashboardTab=val;return render()}if(cmd==='client-tab'){clientTab=val;return render()}if(cmd==='client-side'){if(val==='profile')return toast('Profile changes are not enabled yet.');return render()}
if(cmd==='approve'||cmd==='decline'||cmd==='client-cancel'){let b=db.bookings.find(x=>x.id===val);if(!b)return;if(cmd==='client-cancel'&&!confirm('Cancel this booking?'))return;b.status=cmd==='approve'?'Confirmed':cmd==='decline'?'Declined':'Cancelled';db.notifications.unshift(`Booking ${b.id} ${b.status}. Email and WhatsApp confirmation simulated.`);save();toast(`Booking ${b.id} ${b.status.toLowerCase()}. Email and WhatsApp notices simulated.`);return render()}
if(cmd==='view-booking'){let b=db.bookings.find(x=>x.id===val);return modal('Appointment '+esc(val),[['Customer',b.name],['Branch',branch(b.branch).name],['Service',service(b.service).name],['Barber',barber(b.barber).name],['Date & time',fmt(b.date)+' · '+b.time],['Status',b.status]].map(([k,v])=>`<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('')+(b.status==='Pending'?`<div class="auth-actions" style="margin-top:20px"><button class="btn btn-gold" data-action="approve:${b.id}">Approve</button><button class="btn" data-action="decline:${b.id}">Decline</button></div>`:''))}
if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,service:b.service,barber:b.barber}))}catch(e){}location.href='booking';return}
if(cmd==='walkin')return modal('Register Walk-in',`<form id="walkin-form"><div class="form-group"><label class="form-label">Client name</label><input name="name" required class="field" placeholder="Customer name"></div><div class="form-group"><label class="form-label">Branch</label><select name="branch" required class="field">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Service</label><select name="service" required class="field">${db.services.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Date & time</label><input type="date" name="date" class="field" required min="${dateOffset(0)}" value="${dateOffset(1)}"><select name="time" class="field" style="margin-top:9px">${['09:00','10:00','11:00','12:00','13:00','14:00','15:00'].map(x=>`<option>${x}</option>`).join('')}</select></div><button class="btn btn-gold" type="submit">Register Walk-in</button></form>`)
if(cmd==='add-branch')return modal('Add Branch',`<form id="branch-form"><div class="form-group"><label class="form-label">Branch name</label><input name="name" required class="field" placeholder="New location"></div><div class="form-group"><label class="form-label">Address</label><input name="place" required class="field" placeholder="Location, city"></div><button class="btn btn-gold">Add Branch</button></form>`)
if(cmd==='add-barber')return modal('Add Barber',`<form id="barber-form"><div class="form-group"><label class="form-label">Name</label><input name="name" required class="field" placeholder="Barber name"></div><div class="form-group"><label class="form-label">Branch</label><select name="branch" class="field">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><button class="btn btn-gold">Add Barber</button></form>`)
if(cmd==='add-service')return modal('Add Service',`<form id="service-form"><div class="form-group"><label class="form-label">Service name</label><input class="field" required name="name"></div><div class="form-group"><label class="form-label">Price (USD)</label><input class="field" type="number" min="0" required name="price"></div><div class="form-group"><label class="form-label">Duration (minutes)</label><input class="field" type="number" min="5" required name="duration" value="30"></div><button class="btn btn-gold">Add Service</button></form>`)
if(cmd==='edit-service'){let x=service(val);return modal('Edit Service',`<form id="edit-service-form"><input type="hidden" name="id" value="${esc(x.id)}"><div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(x.name)}"></div><div class="form-group"><label class="form-label">Price</label><input class="field" type="number" min="0" required name="price" value="${x.price}"></div><button class="btn btn-gold">Save Changes</button></form>`)}
if(cmd==='reset'){if(!confirm('Reset all data, bookings and changes?'))return;fetch('api/db.php',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"__reset":true}',credentials:'same-origin'}).then(r=>r.json()).then(j=>{if(j&&j.ok){storage.removeItem(KEY);location.reload()}else toast('Reset failed — server did not confirm.')}).catch(()=>toast('Reset failed — could not reach server.'));return}
}
document.addEventListener('click',e=>{let el=e.target.closest('[data-action],[data-page]');if(!el||el===document.body)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}});
document.addEventListener('change',e=>{if(e.target.id==='admin-branch'){branchFilter=e.target.value;render()}});
// ===== The Gent's — Admin portal =====
// Injected inside app.js IIFE by _build.js. Overrides adminBody/dashboardFrame
// (later function declarations win) and adds adm-* actions/listeners.

let admQ = '', admStatusF = 'all', admCalOff = 0, admCQ = '', admRange = 30, reqTab = 'pending', admPayF = 'all';

const admF = () => {
  let l = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  if (admStatusF !== 'all') l = l.filter(b => b.status === admStatusF);
  if (admQ) l = l.filter(b => (b.name + ' ' + b.phone + ' ' + (b.email || '')).toLowerCase().includes(admQ));
  return l;
};

function adminBody() {
  const titles = { overview: 'Dashboard', bookings: 'Bookings', requests: 'Booking Requests', calendar: 'Calendar', branches: 'Branches', barbers: 'Barbers', services: 'Services', content: 'Content & Media', clients: 'Clients', membership: 'Membership & Wallet', reports: 'Reports', users: 'User Management', staff: 'Account Access', erp: 'Accounting & ERP', settings: 'Settings' };
  const f = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  const top = `<div class="dash-top"><div><div class="eyebrow">THE GENT’S · MANAGEMENT</div><h1>${titles[dashboardTab] || 'Dashboard'}</h1><p class="muted">All changes are saved locally.</p></div><select id="admin-branch" class="field" style="width:205px"><option value="all">All Branches</option>${db.branches.map(b => `<option value="${b.id}" ${branchFilter === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>`;
  if (!admCan(dashboardTab)) {
    const alt = Object.keys(PERM_MAP).find(k => admCan(k));
    if (alt) dashboardTab = alt;
  }
  if (!admCan(dashboardTab)) return top + `<div class="panel"><p class="muted">You don’t have permission to access this section. Contact your administrator.</p></div>`;
  if (dashboardTab === 'overview') return admOverview(f, top);
  if (dashboardTab === 'bookings') return admBookings(top);
  if (dashboardTab === 'requests') return admRequests(top);
  if (dashboardTab === 'calendar') return admCalendar(f, top);
  if (dashboardTab === 'branches') return admBranches(top);
  if (dashboardTab === 'barbers') return admBarbers(top);
  if (dashboardTab === 'services') return admServices(top);
  if (dashboardTab === 'content') return admContent(top);
  if (dashboardTab === 'membership') return admMembership(top);
  if (dashboardTab === 'clients') return admClients(top);
  if (dashboardTab === 'reports') return admReports(f, top);
  if (dashboardTab === 'users') return admUsers(top);
  if (dashboardTab === 'staff') return admStaff(top);
  if (dashboardTab === 'erp') return admErp(top);
  return admSettings(top);
}

function dashboardFrame(role, content) {
  const admin = role === 'admin';
  const items = admin
    ? [["overview", "Dashboard", "⌂"], ["requests", "Requests", "✉"], ["bookings", "Bookings", "▢"], ["calendar", "Calendar", "▦"], ["branches", "Branches", "⌖"], ["barbers", "Barbers", "✂"], ["services", "Services", "✧"], ["content", "Content & Media", "◈"], ["clients", "Clients", "♧"], ["membership", "Membership", "❖"], ["reports", "Reports", "▥"], ["users", "User Management", "♟"], ["staff", "Account Access", "⚑"], ["erp", "Accounting & ERP", "¤"], ["settings", "Settings", "⚙"]]
    : [["overview", "Overview", "⌂"], ["bookings", "My Bookings", "▢"], ["membership", "Membership", "❖"], ["wallet", "Wallet", "▣"], ["rewards", "Rewards", "★"], ["notifications", "Alerts", "◔"], ["profile", "Profile", "♙"]];
  const selected = admin ? dashboardTab : (typeof clientView !== 'undefined' ? clientView : 'overview');
  const navItems = admin ? items.filter(([key]) => admCan(key)) : items;
  const nav = navItems.map(([key, title, ico]) => `<button class="${selected === key ? 'active' : ''}" data-action="${admin ? 'admin-tab' : 'client-side'}:${key}">${ico} &nbsp; ${title}</button>`).join('');
  const out = `<button data-action="adm-logout">⇥ &nbsp; Sign Out</button>`;
  return `<div class="dashboard"><aside class="side"><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS GROOMING CENTER</div></div></a><div class="side-nav">${nav}${out}<button data-page="home">↗ &nbsp; Visit Website</button></div></aside><div><div class="dash-mobile">${nav}${out}</div><main class="dash-main">${content}</main></div></div>`;
}

// ---------- Overview ----------
function admOverview(f, top) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = f.filter(b => b.date === todayISO);
  const pending = f.filter(b => b.status === 'Pending');
  const rev = f.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0);
  const stats = [['▢', f.length, 'Total Bookings'], ['◷', today.length, 'Today'], ['✓', pending.length, 'Pending'], ['$', money(rev), 'Revenue']];
  let h = top + `<div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div>`;
  h += `<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Pending Approvals</h3>${admCan('requests') || admCan('bookings') ? button('View all', 'admin-tab:requests', 'btn btn-sm') : ''}</div>${pending.slice(0, 6).map(b => `<div class="appointment"><div><strong>${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} ${esc(b.time)}</small></div><div class="row-actions">${hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">×</button>` : ''}</div></div>`).join('') || '<p class="muted">Nothing pending.</p>'}</div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Today’s Schedule</h3></div>${today.slice().sort((a, b) => a.time.localeCompare(b.time)).map(b => `<div class="appointment"><div><strong>${esc(b.time)} · ${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)}</small></div>${badge(b.status)}</div>`).join('') || '<p class="muted">No appointments today.</p>'}</div></div>`;
  h += `<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Branch Performance</h3></div>${db.branches.map(x => { const n = db.bookings.filter(b => b.branch === x.id).length; return `<div class="progress-row"><span>${esc(x.name)}</span><div class="track"><div class="fill" style="width:${Math.max(3, n / Math.max(1, db.bookings.length) * 100)}%"></div></div><b>${n}</b></div>`; }).join('')}</div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Recent Activity</h3></div>${(db.notifications || []).slice(0, 6).map(n => `<p class="small" style="margin:8px 0;color:var(--muted)">• ${esc(n)}</p>`).join('') || '<p class="muted">No activity yet.</p>'}</div></div>`;
  h += `<div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="grid grid-3">${button('+ Walk-in', 'walkin', 'btn')}${button('+ Branch', 'adm-add-branch', 'btn')}${button('+ Barber', 'adm-add-barber', 'btn')}${button('+ Service', 'adm-add-service', 'btn')}${button('All Bookings', 'admin-tab:bookings', 'btn')}${button('Calendar', 'admin-tab:calendar', 'btn')}</div></div>`;
  return h;
}

// ---------- Bookings ----------
function admBookings(top) {
  const list = admF().slice().sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  const statuses = ['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'];
  return top + `<div class="panel"><div class="panel-head"><h3>All Bookings (${list.length})</h3><div class="auth-actions">${hasPerm('bookings.create') ? button('+ Walk-in', 'walkin', 'btn btn-gold btn-sm') : ''}${ioButtons('bookings', true)}${myPerms().includes('*') ? button('Reset Data', 'reset', 'btn btn-sm') : ''}</div></div>
  <div class="adm-filters"><input id="adm-q" class="field" style="max-width:260px" placeholder="Search name, phone, email…" value="${esc(admQ)}"><div class="segmented">${statuses.map(s => `<button class="pill ${admStatusF === s ? 'active' : ''}" data-action="adm-status:${s}">${s === 'all' ? 'All' : s}</button>`).join('')}</div></div>${admTable(list)}</div>`;
}

function admTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Date & Time</th><th>Client</th><th>Contact</th><th>Service</th><th>Barber</th><th>Branch</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(b => `<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td class="small muted">${esc(b.phone)}<br>${esc(b.email || '')}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td class="small">${esc(b.source || '—')}</td><td>${badge(b.status)}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="adm-view-booking:${b.id}">View</button>${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${b.status === 'Pending' && hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">×</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn btn-sm" data-action="adm-complete:${b.id}">Done</button>` : ''}${hasPerm('bookings.delete') ? `<button class="btn btn-sm" data-action="adm-del-booking:${b.id}">Del</button>` : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No bookings match.</div>'}</div>`;
}

function admViewBooking(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Client', b.name], ['Phone', b.phone], ['Email', b.email || '—'], ['Branch', branch(b.branch).name], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status], ['Decline reason', b.declineReason || '—'], ['Payment', (b.payment || 'Unpaid') + (b.paidAt ? ' · ' + b.paidAt : '')], ['Source', b.source || '—'], ['Notes', b.notes || '—']];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:20px;flex-wrap:wrap">${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-gold" data-action="approve:${b.id}">Approve</button>` : ''}${(b.status === 'Pending' || b.status === 'Confirmed') && hasPerm('bookings.decline') ? `<button class="btn" data-action="decline:${b.id}">Decline</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn" data-action="adm-complete:${b.id}">Mark Completed</button>` : ''}${hasPerm('bookings.cancel') ? `<button class="btn" data-action="adm-cancel-booking:${b.id}">Cancel Booking</button>` : ''}${hasPerm('bookings.delete') ? `<button class="btn" data-action="adm-del-booking:${b.id}">Delete</button>` : ''}</div>`);
}

// ---------- Booking Requests ----------
const payBadge = p => { const v = p || 'Unpaid'; return `<span class="badge status ${v === 'Unpaid' ? 'cancelled' : 'confirmed'}">${esc(v)}</span>`; };
function admRequests(top) {
  const map = { pending: 'Pending', approved: 'Confirmed', completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled' };
  const base = admF();
  const counts = {}; Object.values(map).forEach(s => counts[s] = base.filter(b => b.status === s).length);
  let list = base;
  if (reqTab !== 'all') list = list.filter(b => b.status === (map[reqTab] || reqTab));
  if (admPayF !== 'all') list = list.filter(b => (b.payment || 'Unpaid') === admPayF);
  list = list.slice().sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const tabs = [['pending', 'Pending'], ['approved', 'Approved'], ['completed', 'Completed'], ['declined', 'Declined'], ['cancelled', 'Cancelled'], ['all', 'All']];
  const pays = ['Unpaid', 'Paid', 'Wallet', 'Gift Card', 'Comp'];
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return top + `<div class="panel"><div class="panel-head"><h3>Booking Requests</h3><div class="auth-actions">${hasPerm('bookings.create') ? button('+ Walk-in', 'walkin', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="adm-filters"><div class="segmented" style="flex-wrap:wrap">${tabs.map(([k, t]) => `<button class="pill ${reqTab === k ? 'active' : ''}" data-action="req-tab:${k}">${t} (${k === 'all' ? total : counts[map[k]] || 0})</button>`).join('')}</div></div>
  <div class="adm-filters"><div class="segmented">${['all', ...pays].map(p => `<button class="pill ${admPayF === p ? 'active' : ''}" data-action="req-pay:${p}">${p === 'all' ? 'All payments' : p}</button>`).join('')}</div><input id="adm-q" class="field" style="max-width:240px" placeholder="Search name, phone, email…" value="${esc(admQ)}"></div>
  ${admReqTable(list)}</div>`;
}
function admReqTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Date & Time</th><th>Client</th><th>Contact</th><th>Service</th><th>Barber</th><th>Branch</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>${list.map(b => `<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td class="small muted">${esc(b.phone)}<br>${esc(b.email || '')}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td>${badge(b.status)}${b.declineReason ? `<br><span class="muted small" title="Decline reason">↳ ${esc(b.declineReason)}</span>` : ''}</td><td>${payBadge(b.payment)}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="adm-view-booking:${b.id}">View</button>${b.status === 'Pending' && hasPerm('bookings.approve') ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button>` : ''}${(b.status === 'Pending' || b.status === 'Confirmed') && hasPerm('bookings.decline') ? `<button class="btn btn-sm" data-action="decline:${b.id}">Decline</button>` : ''}${b.status === 'Confirmed' && hasPerm('bookings.complete') ? `<button class="btn btn-sm" data-action="adm-complete:${b.id}">Done</button>` : ''}${(b.status === 'Confirmed' || b.status === 'Completed') && hasPerm('bookings.pay') ? button('Pay', 'adm-pay:' + b.id, 'btn btn-sm') : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No requests in this view.</div>'}</div>`;
}
function admDeclineModal(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  modal('Decline ' + esc(b.id), `<p class="muted">${esc(b.name)} · ${esc(service(b.service).name)} · ${fmt(b.date)} ${esc(b.time)}</p>
  <form id="adm-decline-form"><input type="hidden" name="id" value="${esc(id)}">
  <div class="form-group"><label class="form-label">Reason (kept on record)</label><textarea class="field" name="reason" rows="3" placeholder="e.g. Slot no longer available, outside service area…"></textarea></div>
  <button class="btn" type="submit">Decline Request</button></form>`);
}
function admPayModal(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  modal('Record payment — ' + esc(b.id), `<p class="muted">${esc(b.name)} · ${esc(service(b.service).name)} · ${money(service(b.service).price)} · ${fmt(b.date)} ${esc(b.time)}</p>
  <form id="adm-pay-form"><input type="hidden" name="id" value="${esc(id)}">
  <div class="form-group"><label class="form-label">Payment method</label><select class="field" name="method"><option value="Paid">Paid (cash / card)</option><option value="Wallet">Wallet</option><option value="Gift Card">Gift Card</option><option value="Comp">Complimentary</option></select></div>
  <button class="btn btn-gold" type="submit">Record Payment</button></form>`);
}

// ---------- Calendar ----------
function admCalendar(f, top) {
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + admCalOff);
  const y = base.getFullYear(), m = base.getMonth();
  const startDow = new Date(y, m, 1).getDay();
  const dim = new Date(y, m + 1, 0).getDate();
  const todayISO = new Date().toISOString().slice(0, 10);
  const byDate = {}; f.forEach(b => { (byDate[b.date] = byDate[b.date] || []).push(b); });
  let cells = '';
  for (let i = 0; i < startDow; i++) cells += '<div class="cal-day muted"></div>';
  for (let d = 1; d <= dim; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const list = byDate[iso] || [];
    cells += `<div class="cal-day ${iso === todayISO ? 'today' : ''}" data-action="adm-day:${iso}"><span class="n">${d}</span>${list.length ? `<span class="cal-count">${list.length}</span>` : ''}<div class="cal-chips">${list.slice(0, 3).map(b => `<span class="cal-chip">${esc(b.time)} ${esc(b.name.split(' ')[0])}</span>`).join('')}</div></div>`;
  }
  const mn = base.toLocaleDateString('en-ZW', { month: 'long', year: 'numeric' });
  return top + `<div class="panel"><div class="cal-head"><button class="btn btn-sm" data-action="adm-cal:prev">← Prev</button><h3 style="margin:0">${mn}</h3><div><button class="btn btn-sm" data-action="adm-cal:today">Today</button> <button class="btn btn-sm" data-action="adm-cal:next">Next →</button> ${ioButtons('calendar', false)}</div></div><div class="cal-dows">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="cal-dow">${d}</div>`).join('')}</div><div class="cal-grid">${cells}</div></div>`;
}

function admDay(iso) {
  const list = (branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter)).filter(b => b.date === iso).sort((a, b) => a.time.localeCompare(b.time));
  modal(fmt(iso), list.map(b => `<div class="data-line"><span class="muted">${esc(b.time)} · ${esc(b.name)} · ${esc(b.phone || '')}</span><b>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${esc(branch(b.branch).name)} · ${badge(b.status)}</b></div>`).join('') || '<p class="muted">No appointments.</p>');
}

// ---------- Branches ----------
function admBranches(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Branch Directory</h3><div class="auth-actions">${ioButtons('branches', true)}${hasPerm('branches.manage') ? button('+ Add Branch', 'adm-add-branch', 'btn btn-gold btn-sm') : ''}</div></div><div class="grid grid-3">${db.branches.map(x => { const n = db.bookings.filter(b => b.branch === x.id).length; return `<div class="card"><img class="branch-photo" src="${esc(x.photo)}"><div class="card-pad"><h3>${esc(x.name)}</h3><p class="muted small">${esc(x.place)}<br>${esc(x.hours)}<br>${n} booking${n === 1 ? '' : 's'}</p>${hasPerm('branches.manage') ? `<div class="row-actions" style="margin-top:10px"><button class="btn btn-sm" data-action="adm-edit-branch:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-branch:${x.id}">Delete</button></div>` : ''}</div></div>`; }).join('')}</div></div>`;
}

function admBranchForm(id) {
  const x = id ? db.branches.find(b => b.id === id) : { name: '', place: '', hours: 'Mon–Sat · 09:00–18:00', photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' };
  if (!x) return;
  modal(id ? 'Edit Branch' : 'Add Branch', `<form id="adm-branch-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Branch name</label><input class="field" required name="name" value="${esc(x.name)}"></div><div class="form-group"><label class="form-label">Address / area</label><input class="field" required name="place" value="${esc(x.place || '')}"></div><div class="form-group"><label class="form-label">Opening hours</label><input class="field" name="hours" value="${esc(x.hours || '')}"></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Branch'}</button></form>`);
}

// ---------- Barbers ----------
function admBarbers(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Team (${db.barbers.length})</h3><div class="auth-actions">${ioButtons('barbers', true)}${hasPerm('staff_data.manage') ? button('+ Add Barber', 'adm-add-barber', 'btn btn-gold btn-sm') : ''}</div></div><div class="grid grid-4">${db.barbers.map(x => `<div class="card"><img class="barber-photo" src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy"><div class="barber-info"><h3>${esc(x.name)}</h3><p>${esc(x.role)} · ${esc(branch(x.branch).name)}</p><p class="small muted">${x.services.map(s => esc(service(s).name)).join(' · ')}</p>${x.bio ? `<p class="small muted">${esc(x.bio)}</p>` : ''}${hasPerm('staff_data.manage') ? `<div class="row-actions" style="margin-top:8px"><button class="btn btn-sm" data-action="adm-edit-barber:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-barber:${x.id}">Delete</button></div>` : ''}</div></div>`).join('')}</div></div>`;
}

function admBarberForm(id) {
  const x = id ? barber(id) : { name: '', role: 'Barber', branch: db.branches[0] ? db.branches[0].id : '', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', services: db.services.map(s => s.id) };
  if (id && !db.barbers.find(b => b.id === id)) return;
  modal(id ? 'Edit Barber' : 'Add Barber', `<form id="adm-barber-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(id ? x.name : '')}"></div><div class="form-group"><label class="form-label">Role</label><input class="field" name="role" value="${esc(id ? x.role : 'Barber')}"></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}" ${x.branch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><div class="form-group"><label class="form-label">Bio (shown on profile cards)</label><textarea class="field" name="bio" rows="2" placeholder="e.g. 8 years of precision cutting">${esc(x.bio || '')}</textarea></div><div class="form-group"><label class="form-label">Services</label><div style="display:grid;gap:6px">${db.services.map(s => `<label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="services" value="${s.id}" ${(x.services || []).includes(s.id) ? 'checked' : ''}> ${esc(s.name)}</label>`).join('')}</div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Barber'}</button></form>`);
}

// ---------- Services ----------
function admServices(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Services & Pricing</h3><div class="auth-actions">${ioButtons('services', true)}${hasPerm('staff_data.manage') ? button('+ Add Service', 'adm-add-service', 'btn btn-gold btn-sm') : ''}</div></div>${db.services.map(x => `<div class="service-row">${x.image ? `<img class="service-thumb" src="${esc(x.image)}" alt="">` : `<span class="service-icon">${x.icon}</span>`}<div class="service-text"><strong>${esc(x.name)}</strong><small>${esc(x.desc || '')} · ${x.duration} min · ${x.branches.map(b => esc(branch(b).name)).join(', ') || 'all branches'}</small></div><b>${money(x.price)}</b>${hasPerm('staff_data.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="adm-edit-service:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-service:${x.id}">Delete</button></div>` : ''}</div>`).join('')}</div>`;
}

function admServiceForm(id) {
  const x = id ? service(id) : { name: '', desc: '', price: 0, duration: 30, icon: '✂', branches: db.branches.map(b => b.id) };
  if (id && !db.services.find(s => s.id === id)) return;
  modal(id ? 'Edit Service' : 'Add Service', `<form id="adm-service-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Service name</label><input class="field" required name="name" value="${esc(id ? x.name : '')}"></div><div class="form-group"><label class="form-label">Icon</label><input class="field" name="icon" value="${esc(id ? x.icon : '✂')}"></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" name="desc" value="${esc(id ? x.desc : '')}"></div><div class="form-group"><label class="form-label">Card image URL (optional)</label><input class="field" name="image" value="${esc(id ? x.image || '' : '')}" placeholder="https://… or /uploads/…"></div><div class="form-grid"><div class="form-group"><label class="form-label">Price (USD)</label><input class="field" type="number" min="0" step="0.01" required name="price" value="${id ? x.price : ''}"></div><div class="form-group"><label class="form-label">Duration (minutes)</label><input class="field" type="number" min="5" required name="duration" value="${id ? x.duration : 30}"></div></div><div class="form-group"><label class="form-label">Available at branches</label><div style="display:grid;gap:6px">${db.branches.map(b => `<label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="branches" value="${b.id}" ${(x.branches || []).includes(b.id) ? 'checked' : ''}> ${esc(b.name)}</label>`).join('')}</div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Service'}</button></form>`);
}

// ---------- Clients ----------
function admClients(top) {
  const map = {};
  db.bookings.forEach(b => { const k = b.phone || b.email || b.name; (map[k] = map[k] || { name: b.name, phone: b.phone, email: b.email, items: [] }).items.push(b); });
  let list = Object.values(map).map(c => ({ name: c.name, phone: c.phone, email: c.email, count: c.items.length, last: c.items.map(i => i.date).sort().pop(), spent: c.items.filter(i => i.status !== 'Cancelled' && i.status !== 'Declined').reduce((s, i) => s + Number(service(i.service).price || 0), 0) }));
  if (admCQ) list = list.filter(c => (c.name + ' ' + c.phone + ' ' + (c.email || '')).toLowerCase().includes(admCQ));
  list.sort((a, b) => (b.last || '').localeCompare(a.last || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Customers (${list.length})</h3><div class="auth-actions">${ioButtons('customers', false)}</div></div><div class="adm-filters"><input id="adm-cq" class="field" style="max-width:280px" placeholder="Search clients…" value="${esc(admCQ)}"></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Last Visit</th><th>Total Spend</th><th></th></tr></thead><tbody>${list.map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.email || '—')}</td><td>${c.count}</td><td>${fmt(c.last)}</td><td>${money(c.spent)}</td><td><button class="btn btn-sm" data-action="adm-client:${encodeURIComponent(c.phone || c.email || c.name)}">History</button></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No clients yet.</div>'}</div></div>`;
}

function admClient(key) {
  const k = decodeURIComponent(key);
  const items = db.bookings.filter(b => (b.phone || b.email || b.name) === k).sort((a, b) => b.date.localeCompare(a.date));
  const c = items[0] || {};
  modal('Client · ' + esc(c.name || k), `<div class="kv" style="margin-bottom:16px"><span>Phone</span><b>${esc(c.phone || '—')}</b><span>Email</span><b>${esc(c.email || '—')}</b><span>Total bookings</span><b>${items.length}</b></div>` + items.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} ${esc(b.time)} · ${esc(service(b.service).name)}</span><b>${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${badge(b.status)}</b></div>`).join(''));
}

// ---------- Reports ----------
function admReports(f, top) {
  const days = admRange === 'all' ? null : Number(admRange);
  const cutoff = days ? new Date(Date.now() - days * 864e5).toISOString().slice(0, 10) : null;
  const r = days ? f.filter(b => b.date >= cutoff) : f;
  const rev = r.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0);
  const done = r.filter(b => b.status === 'Completed').length;
  let buckets = [];
  if (days && days <= 31) {
    for (let i = days - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5); const iso = d.toISOString().slice(0, 10); buckets.push({ label: d.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' }), n: r.filter(b => b.date === iso).length }); }
  } else {
    const weeks = Math.ceil((days || 365) / 7);
    for (let i = weeks - 1; i >= 0; i--) { const end = new Date(Date.now() - i * 7 * 864e5); const start = new Date(end - 6 * 864e5); const n = r.filter(b => b.date >= start.toISOString().slice(0, 10) && b.date <= end.toISOString().slice(0, 10)).length; buckets.push({ label: start.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' }), n }); }
  }
  const max = Math.max(1, ...buckets.map(x => x.n));
  const svc = {}; r.forEach(b => { svc[b.service] = (svc[b.service] || 0) + 1; });
  const topSvc = Object.entries(svc).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const brd = {}; r.forEach(b => { brd[b.barber] = (brd[b.barber] || 0) + 1; });
  const topBr = Object.entries(brd).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const st = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'].map(s => [s, r.filter(b => b.status === s).length]);
  const stat = (i, n, t) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`;
  return top + `<div class="adm-filters"><div class="segmented">${['7', '30', '90', 'all'].map(x => `<button class="pill ${String(admRange) === x ? 'active' : ''}" data-action="adm-range:${x}">${x === 'all' ? 'All time' : x + ' days'}</button>`).join('')}</div>${ioButtons('reports', false)}</div>
  <div class="stat-grid">${stat('▢', r.length, 'Bookings')}${stat('$', money(rev), 'Revenue')}${stat('✓', done, 'Completed')}${stat('◷', r.length ? money(rev / r.length) : '$0.00', 'Avg ticket')}</div>
  <div class="dash-grid"><div class="panel"><h3>Bookings over time</h3><div class="chart">${buckets.map(x => `<div class="bar" title="${x.n} booking${x.n === 1 ? '' : 's'}"><i style="height:${Math.max(4, Math.round(x.n / max * 140))}px"></i><span>${x.label}</span></div>`).join('')}</div></div>
  <div class="panel"><h3>Status breakdown</h3>${st.map(([s, n]) => `<div class="progress-row"><span>${s}</span><div class="track"><div class="fill" style="width:${r.length ? n / r.length * 100 : 0}%"></div></div><b>${n}</b></div>`).join('')}</div></div></div>
  <div class="dash-grid"><div class="panel"><h3>Top services</h3>${topSvc.map(([id, n]) => `<div class="progress-row"><span>${esc(service(id).name)}</span><div class="track"><div class="fill" style="width:${n / Math.max(1, r.length) * 100}%"></div></div><b>${n}</b></div>`).join('') || '<p class="muted">No data.</p>'}</div>
  <div class="panel"><h3>Top barbers</h3>${topBr.map(([id, n]) => `<div class="progress-row"><span>${esc(barber(id).name)}</span><div class="track"><div class="fill" style="width:${n / Math.max(1, r.length) * 100}%"></div></div><b>${n}</b></div>`).join('') || '<p class="muted">No data.</p>'}</div></div>`;
}

// ---------- Settings ----------
function admSettings(top) {
  const s = db.settings || {};
  return top + `<div class="panel" style="max-width:640px"><div class="panel-head"><h3>Business Profile</h3></div><form id="adm-settings-form"><div class="form-grid"><div class="form-group"><label class="form-label">Grooming center name</label><input class="field" name="name" value="${esc(s.name || 'The Gent’s')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" value="${esc(s.phone || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">WhatsApp number</label><input class="field" name="whatsapp" value="${esc(s.whatsapp || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" name="email" value="${esc(s.email || 'admin@thegents.co.zw')}"></div><div class="form-group"><label class="form-label">Address</label><input class="field" name="address" value="${esc(s.address || 'Fife Avenue & Borrowdale, Harare')}"></div><div class="form-group"><label class="form-label">Logo URL (optional — replaces the ⚒ icon)</label><input class="field" name="logo" value="${esc(s.logo || '')}" placeholder="/uploads/logo.png or https://…"></div><div class="form-group"><label class="form-label">Facebook URL</label><input class="field" name="fb" value="${esc((s.social || {}).facebook || '')}" placeholder="https://facebook.com/…"></div><div class="form-group"><label class="form-label">Instagram URL</label><input class="field" name="ig" value="${esc((s.social || {}).instagram || '')}" placeholder="https://instagram.com/…"></div><div class="form-group"><label class="form-label">TikTok URL</label><input class="field" name="tt" value="${esc((s.social || {}).tiktok || '')}" placeholder="https://tiktok.com/@…"></div></div><button class="btn btn-gold">Save Settings</button></form>
  <h3 style="margin-top:30px">Data</h3><div class="auth-actions">${button('Export Data (JSON)', 'adm-export-json', 'btn')}${button('Reset All Data', 'reset', 'btn')}</div><p class="muted small" style="margin-top:16px">Business details appear on the Contact page. Export downloads a backup of all local data.</p></div>`;
}

// ---------- Export ----------
function admDownload(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
function admExportCSV() {
  const list = admF();
  const rows = [['Date', 'Time', 'Client', 'Phone', 'Email', 'Service', 'Barber', 'Branch', 'Status', 'Source'].join(',')]
    .concat(list.map(b => [b.date, b.time, b.name, b.phone, b.email || '', service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status, b.source || ''].map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')));
  admDownload('bookings.csv', rows.join('\n'), 'text/csv');
  toast('CSV exported.');
}
function admExportJSON() {
  admDownload('thegents-data.json', JSON.stringify(db, null, 2), 'application/json');
  toast('Data exported.');
}

// ---------- Events ----------
// Decline always asks for a reason — intercept before the prototype's instant handler
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action^="decline:"]');
  if (!el || page !== 'admin') return;
  e.preventDefault(); e.stopImmediatePropagation();
  admDeclineModal(el.dataset.action.split(':')[1]);
}, true);

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'adm-logout') { try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {} location.href = page === 'admin' ? 'admin' : 'login'; return; }
  if (c === 'adm-add-branch' || c === 'adm-edit-branch' || c === 'adm-del-branch') { if (!hasPerm('branches.manage')) return toast('No permission.'); }
  if (c === 'adm-add-barber' || c === 'adm-edit-barber' || c === 'adm-del-barber' || c === 'adm-add-service' || c === 'adm-edit-service' || c === 'adm-del-service') { if (!hasPerm('staff_data.manage')) return toast('No permission.'); }
  if (c === 'adm-complete' && !hasPerm('bookings.complete')) return toast('No permission.');
  if (c === 'adm-cancel-booking' && !hasPerm('bookings.cancel')) return toast('No permission.');
  if (c === 'adm-del-booking' && !hasPerm('bookings.delete')) return toast('No permission.');
  if (c === 'adm-pay' && !hasPerm('bookings.pay')) return toast('No permission.');
  if (c === 'adm-add-branch') return admBranchForm();
  if (c === 'adm-edit-branch') return admBranchForm(v);
  if (c === 'adm-add-barber') return admBarberForm();
  if (c === 'adm-edit-barber') return admBarberForm(v);
  if (c === 'adm-add-service') return admServiceForm();
  if (c === 'adm-edit-service') return admServiceForm(v);
  if (c === 'adm-view-booking') return admViewBooking(v);
  if (c === 'adm-client') return admClient(v);
  if (c === 'adm-day') return admDay(v);
  if (c === 'adm-cal') { admCalOff += v === 'next' ? 1 : v === 'prev' ? -1 : 0; if (v === 'today') admCalOff = 0; return render(); }
  if (c === 'adm-status') { admStatusF = v; return render(); }
  if (c === 'req-tab') { reqTab = v; return render(); }
  if (c === 'req-pay') { admPayF = v; return render(); }
  if (c === 'adm-pay') return admPayModal(v);
  if (c === 'adm-range') { admRange = v === 'all' ? 'all' : Number(v); return render(); }
  if (c === 'adm-complete') { const b = db.bookings.find(x => x.id === v); if (b) { b.status = 'Completed'; db.notifications.unshift('Booking ' + b.id + ' completed.'); save(); toast('Booking marked completed.'); render(); } return; }
  if (c === 'adm-cancel-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Cancel this booking?')) return; b.status = 'Cancelled'; save(); toast('Booking cancelled.'); closeModal(); render(); return; }
  if (c === 'adm-del-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Permanently delete booking ' + b.id + '?')) return; db.bookings = db.bookings.filter(x => x.id !== v); save(); toast('Booking deleted.'); closeModal(); render(); return; }
  if (c === 'adm-del-branch') { const x = db.branches.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.branch === v)) return toast('Cannot delete: this branch has bookings.'); if (db.barbers.some(b => b.branch === v)) return toast('Cannot delete: this branch still has barbers.'); if (!confirm('Delete branch "' + x.name + '"?')) return; db.branches = db.branches.filter(b => b.id !== v); save(); toast('Branch deleted.'); render(); return; }
  if (c === 'adm-del-barber') { const x = db.barbers.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.barber === v)) return toast('Cannot delete: this barber has bookings.'); if (!confirm('Delete ' + x.name + '?')) return; db.barbers = db.barbers.filter(b => b.id !== v); save(); toast('Barber removed.'); render(); return; }
  if (c === 'adm-del-service') { const x = db.services.find(s => s.id === v); if (!x) return; if (db.bookings.some(b => b.service === v)) return toast('Cannot delete: this service has bookings.'); if (!confirm('Delete service "' + x.name + '"?')) return; db.services = db.services.filter(s => s.id !== v); save(); toast('Service deleted.'); render(); return; }
  if (c === 'adm-export') { if (!hasPerm('reports.view')) return toast('No permission.'); return admExportCSV(); }
  if (c === 'adm-export-json') { if (myPerms().includes('*')) return admExportJSON(); return toast('Primary admin only.'); }
});

document.addEventListener('input', e => {
  if (e.target.id === 'adm-q' || e.target.id === 'adm-cq') {
    if (e.target.id === 'adm-q') admQ = e.target.value; else admCQ = e.target.value;
    render();
    const i = document.getElementById(e.target.id);
    if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }
});

document.addEventListener('submit', async e => {
  const form = e.target;
  if (form.id === 'adm-decline-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const b = db.bookings.find(x => x.id === v.id); if (!b) return;
    b.status = 'Declined'; b.declineReason = (v.reason || '').trim() || 'No reason given';
    db.notifications.unshift('Booking ' + b.id + ' declined.');
    save(); closeModal(); toast('Booking ' + b.id + ' declined.'); render(); return;
  }
  if (form.id === 'adm-pay-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const b = db.bookings.find(x => x.id === v.id); if (!b) return;
    b.payment = v.method || 'Paid'; b.paidAt = new Date().toISOString().slice(0, 10);
    db.notifications.unshift('Booking ' + b.id + ' paid via ' + b.payment + '.');
    save(); closeModal(); toast('Payment recorded for ' + b.id + '.'); render(); return;
  }
  if (form.id === 'login-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const fd = new FormData(form); const em = (fd.get('email') || '').trim(); const pw = fd.get('password') || '';
    const role = form.dataset.role === 'admin' ? 'admin' : 'client';
    if (role === 'client') {
      // Client login — verify against the PHP/MySQL clients table
      try {
        const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'client-login', email: em, password: pw }), credentials: 'same-origin' });
        const j = await r.json();
        if (j && j.ok) { try { sessionStorage.setItem('gents_auth', 'client'); sessionStorage.setItem('gents_client', JSON.stringify(j.client)); sessionStorage.removeItem('gents_staff') } catch (x) {} location.href = 'client'; return; }
        if (r.status === 401) { toast('Invalid email or password.'); return; }
      } catch (x) { toast('Sign-in service unavailable — check your connection.'); return; }
    }
    // Admin login — credentials verified server-side against MySQL only
    try {
      const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, password: pw }), credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok) {
        try { sessionStorage.setItem('gents_auth', 'admin'); sessionStorage.setItem('gents_staff', j.staff && j.staff.id || '') } catch (x) {}
        bootRemote(); location.href = 'admin'; return;
      }
      toast(r.status === 401 ? 'Invalid admin credentials.' : 'Sign-in service error — try again.');
      return;
    } catch (x) { toast('Sign-in service unavailable — check your connection.'); return; }
  }
  if (form.id === 'adm-branch-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (v.id) { const x = db.branches.find(b => b.id === v.id); if (x) Object.assign(x, { name: v.name, place: v.place, hours: v.hours, photo: v.photo || x.photo }); toast('Branch updated.'); }
    else { db.branches.push({ id: v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4), name: v.name, place: v.place, hours: v.hours || 'Mon–Sat · 09:00–18:00', photo: v.photo || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' }); toast('Branch added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-barber-form') {
    e.preventDefault(); const fd = new FormData(form); const v = Object.fromEntries(fd); const sv = fd.getAll('services');
    const data = { name: v.name, role: v.role || 'Barber', branch: v.branch, photo: v.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', bio: v.bio || '', services: sv.length ? sv : db.services.map(s => s.id) };
    if (v.id) { const x = db.barbers.find(b => b.id === v.id); if (x) Object.assign(x, data); toast('Barber updated.'); }
    else { db.barbers.push({ id: 'barber' + Date.now(), ...data }); toast('Barber added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-service-form') {
    e.preventDefault(); const fd = new FormData(form); const v = Object.fromEntries(fd); const bv = fd.getAll('branches');
    const data = { name: v.name, desc: v.desc || 'Grooming service', image: v.image || '', icon: v.icon || '✂', duration: Number(v.duration) || 30, price: Number(v.price) || 0, branches: bv.length ? bv : db.branches.map(b => b.id) };
    if (v.id) { const x = db.services.find(s => s.id === v.id); if (x) Object.assign(x, data); toast('Service updated.'); }
    else { db.services.push({ id: 'srv' + Date.now(), ...data }); toast('Service added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'adm-settings-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    db.settings = { name: v.name, phone: v.phone, whatsapp: v.whatsapp || v.phone, email: v.email, address: v.address, logo: v.logo || '', social: { facebook: v.fb || '', instagram: v.ig || '', tiktok: v.tt || '' } };
    save(); toast('Settings saved.'); return;
  }
});

// ===== The Gent's — Client portal =====
// Injected inside app.js IIFE by _build.js. Overrides client() and adds
// cl-* actions + a capture-phase listener for client-side tab switching.

let clientView = 'overview';
const cp = () => db.clientProfile || (db.clientProfile = { name: '', phone: '', email: '', favBranch: '', favBarber: '' });
function clClient() { try { return JSON.parse(sessionStorage.getItem('gents_client') || 'null') } catch (e) { return null } }
function clEmail() { const c = clClient(); return (c && c.email) || '' }
const myBookings = () => { const em = clEmail(); return db.bookings.filter(b => em ? ((b.clientEmail && b.clientEmail === em) || (!b.clientEmail && cp().phone && b.phone === cp().phone)) : (b.clientCreated || (cp().phone && b.phone === cp().phone))) };
const clPerVisit = () => (clMem && clMem.rewards && clMem.rewards.perVisit) || 100;
const clPoints = list => { const done = (list || myBookings()).filter(b => b.status === 'Completed').length; const ov = clMem && clMem.rewards ? clMem.rewards.override : null; return ov != null ? ov : done * clPerVisit(); };

function client() {
  const p = cp();
  const list = myBookings();
  const upcoming = list.filter(x => !['Completed', 'Cancelled', 'Declined'].includes(x.status));
  const past = list.filter(x => !upcoming.includes(x));
  let content = '';
  if (clientView === 'bookings') content = clBookings(list, upcoming, past);
  else if (clientView === 'rewards') content = clRewards(list);
  else if (clientView === 'notifications') content = clNotifications(list);
  else if (clientView === 'profile') content = clProfile(p);
  else if (clientView === 'membership') content = clMembership();
  else if (clientView === 'wallet') content = clWallet();
  else content = clOverview(p, list, upcoming);
  return dashboardFrame('client', content);
}

// ---------- Overview ----------
function clOverview(p, list, upcoming) {
  const next = upcoming.slice().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];
  const done = list.filter(b => b.status === 'Completed').length;
  const pts = clPoints(list);
  return `<div class="dash-top"><div><div class="eyebrow">WELCOME BACK</div><h1>Hello, ${esc((p.name || 'there').split(' ')[0])}</h1><p class="muted">Here’s what’s happening with your bookings.</p></div>${button('Book New Appointment →', 'start-booking', 'btn btn-gold')}</div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Next Appointment</h3></div>${next ? `<div class="appointment"><div><strong>${esc(service(next.service).name)}</strong><small>⌖ ${esc(branch(next.branch).name)} · ${esc(barber(next.barber).name)} · ${fmt(next.date)} at ${esc(next.time)}</small></div>${badge(next.status)}</div>` : '<p class="muted">No upcoming appointments — book your next visit.</p>'}</div>
  <div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="grid grid-3">${button('Book Appointment', 'start-booking', 'btn')}${button('My Bookings', 'client-side:bookings', 'btn')}${button('Rewards', 'client-side:rewards', 'btn')}</div></div></div>
  <div class="stat-grid">${[['▢', upcoming.length, 'Upcoming'], ['✓', done, 'Completed Visits'], ['★', pts, 'Reward Points'], ['♙', list.length, 'Total Bookings']].map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div>
  <div class="panel"><div class="panel-head"><h3>Recent Bookings</h3><button class="btn btn-sm" data-action="client-side:bookings">View all</button></div>${list.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map(clBookingRow).join('') || '<p class="muted">No bookings yet.</p>'}</div>`;
}

function clBookingRow(b) {
  return `<div class="appointment"><div><strong>${esc(service(b.service).name)}</strong><small>${b.id} · ⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</small></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${badge(b.status)}<button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button></div></div>`;
}

// ---------- My Bookings ----------
function clBookings(list, upcoming, past) {
  const show = clientTab === 'upcoming' ? upcoming : clientTab === 'past' ? past : list;
  const tabs = [['upcoming', 'Upcoming'], ['past', 'Past'], ['all', 'All']];
  return `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>My Bookings</h1><p class="muted">View and manage your appointments.</p></div>${button('Book New Appointment →', 'start-booking', 'btn btn-gold')}</div>
  <div class="segmented" style="margin-bottom:22px">${tabs.map(([k, t]) => `<button class="pill ${clientTab === k ? 'active' : ''}" data-action="client-tab:${k}">${t} (${k === 'upcoming' ? upcoming.length : k === 'past' ? past.length : list.length})</button>`).join('')}</div>
  ${show.map(b => `<div class="card" style="padding:20px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">${esc(b.id)}</div><h3 style="margin:6px 0 4px">${esc(service(b.service).name)}</h3><p class="muted small" style="margin:0">⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</p></div><div style="text-align:right"><div style="font-size:17px;font-weight:700;color:var(--gold)">${money(service(b.service).price)}</div><div style="margin:8px 0">${badge(b.status)}</div></div></div><div class="row-actions" style="margin-top:14px"><button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button>${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>` : ''}</div></div>`).join('') || `<div class="empty card">No ${clientTab === 'all' ? '' : clientTab} bookings yet. <a href="booking" style="color:var(--gold)">Book an appointment</a>.</div>`}`;
}

function clDetails(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Price', money(service(b.service).price)], ['Branch', branch(b.branch).name], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status]];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:18px">${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn" data-action="client-cancel:${b.id}">Cancel Booking</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-gold" data-action="rebook:${b.id}">Book Again</button>` : ''}</div>`);
}

// ---------- Rewards ----------
function clRewards(list) {
  clKickMem();
  const done = list.filter(b => b.status === 'Completed').sort((a, b) => a.date.localeCompare(b.date));
  const pts = clPoints(list);
  const perVisit = clPerVisit();
  const tier = pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
  const nextAt = pts >= 800 ? null : pts >= 300 ? 800 : 300;
  const pct = nextAt ? Math.min(100, Math.round(pts / nextAt * 100)) : 100;
  const perks = [['Bronze', perVisit + ' points per completed visit'], ['Silver', '10% off retail · priority booking'], ['Gold', 'Free beard trim monthly · early access']];
  const marks = ['◌', '◑', '●'];
  const adjusted = clMem && clMem.rewards && clMem.rewards.override != null;
  return `<div class="dash-top"><div><div class="eyebrow">LOYALTY</div><h1>Rewards</h1><p class="muted">Earn points every time you visit.</p></div></div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Your Tier · ${tier}</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">${pts}<span class="small muted"> pts</span></div><div class="progress-row" style="margin-top:14px"><span>${nextAt ? nextAt + ' pts for ' + (pts >= 300 ? 'Gold' : 'Silver') : 'Top tier reached'}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><b>${pct}%</b></div><p class="muted small" style="margin-top:14px">${perVisit} points per completed appointment.${adjusted ? ' Points adjusted by the grooming center.' : ''}</p></div>
  <div class="panel"><div class="panel-head"><h3>Perks</h3></div>${perks.map(([t, d], i) => `<div class="progress-row"><span>${marks[i]} ${t}</span><b class="small muted" style="font-weight:500">${d}</b></div>`).join('')}</div></div>
  <div class="panel"><div class="panel-head"><h3>Points History</h3></div>${done.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} · ${esc(service(b.service).name)}</span><b>+${perVisit} pts</b></div>`).join('') || '<p class="muted">Complete an appointment to start earning.</p>'}</div>`;
}

// ---------- Notifications ----------
function clNotifications(list) {
  const ids = list.map(b => b.id);
  const notes = (db.notifications || []).filter(n => ids.some(id => n.includes(id)));
  return `<div class="dash-top"><div><div class="eyebrow">UPDATES</div><h1>Notifications</h1><p class="muted">Booking confirmations and status changes.</p></div></div><div class="panel">${notes.map(n => `<div class="data-line"><span>◔</span><b class="small" style="font-weight:500">${esc(n)}</b></div>`).join('') || '<p class="muted">No notifications yet.</p>'}</div>`;
}

// ---------- Profile ----------
function clProfile(p) {
  return `<div class="dash-top"><div><div class="eyebrow">ACCOUNT</div><h1>Profile</h1><p class="muted">Your details are used for bookings and receipts.</p></div></div>
  <div class="panel" style="max-width:640px"><form id="cl-profile-form"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(p.name || '')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" required name="phone" value="${esc(p.phone || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" value="${esc(p.email || '')}"></div><div class="form-group"><label class="form-label">Favorite branch</label><select class="field" name="favBranch"><option value="">No preference</option>${db.branches.map(b => `<option value="${b.id}" ${p.favBranch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Favorite barber</label><select class="field" name="favBarber"><option value="">No preference</option>${db.barbers.map(b => `<option value="${b.id}" ${p.favBarber === b.id ? 'selected' : ''}>${esc(b.name)} · ${esc(branch(b.branch).name)}</option>`).join('')}</select></div></div><button class="btn btn-gold">Save Profile</button></form><div class="auth-actions" style="margin-top:14px">${button('Sign Out','cl-logout','btn btn-sm')}</div><p class="muted small" style="margin-top:16px">Bookings are matched to your account by email and phone number.</p></div>`;
}

// ---------- Booking auth gate (sign in / register to finish booking) ----------
let clAuthMode = 'login';
function clAuthModal() {
  const reg = clAuthMode === 'register';
  modal('One quick step', `<p class="muted" style="margin-top:0">Sign in or create a free account to confirm your booking.</p>
  <div class="segmented" style="margin-bottom:16px"><button class="pill ${!reg ? 'active' : ''}" data-action="cl-auth-mode:login">Sign In</button><button class="pill ${reg ? 'active' : ''}" data-action="cl-auth-mode:register">Create Account</button></div>
  <form id="client-auth-form" data-mode="${clAuthMode}">
    ${reg ? `<div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" placeholder="Your full name"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" placeholder="+263..."></div>` : ''}
    <div class="form-group"><label class="form-label">Email, name or pseudonym</label><input class="field" type="text" required name="email" placeholder="you@example.com · Alex Demo · AD"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="field" type="password" required name="password" minlength="6" placeholder="${reg ? 'Choose a password (6+ characters)' : 'Your password'}"></div>
    <button class="btn btn-gold" type="submit" style="width:100%">${reg ? 'Create Account & Book →' : 'Sign In & Book →'}</button>
  </form>
  <p class="muted small" style="margin-top:14px;text-align:center">Your booking details are kept — you'll finish right after.</p>`);
}
// Intercept Submit Booking before the main handler when the visitor isn't signed in.
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action="book-submit"]');
  if (el && !auth('client') && !auth('admin')) { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'login'; clAuthModal(); }
}, true);

// ---------- Membership & Wallet ----------
let clMem = null, clMemLoading = false, clMemLoaded = false;
async function clLoadMem(force) {
  if (clMemLoading || (clMemLoaded && !force)) return;
  clMemLoading = true;
  try { const r = await fetch('api/member.php', { credentials: 'same-origin' }); const j = await r.json(); if (j && j.ok) clMem = j; }
  catch (e) {}
  clMemLoading = false; clMemLoaded = true;
  if (page === 'client') render();
}
function clKickMem(force) { if (force || !clMemLoaded) clLoadMem(force); }

function clMembership() {
  clKickMem();
  const top = `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>Membership</h1><p class="muted">Your digital member card — tap it to flip.</p></div>${button('Wallet →', 'client-side:wallet', 'btn')}</div>`;
  if (!clMemLoaded) return top + '<div class="panel"><p class="muted">Loading your membership…</p></div>';
  const m = clMem && clMem.member;
  if (!m) return top + `<div class="panel" style="max-width:560px"><h3>Not a member yet</h3><p class="muted">Enrol for a membership card to unlock member rates, a wallet and gift cards. Basic tier is free to join.</p><div style="margin-top:16px">${button('Enrol — Basic Tier', 'cl-enrol', 'btn btn-gold')}</div></div>`;
  const w = (clMem.wallet || {}).balance || 0;
  return top + `<div class="dash-grid"><div>${clCard(m)}<p class="muted small" style="text-align:center;margin-top:10px">Tap the card to flip it · valid at any branch</p></div>
  <div><div class="panel"><div class="panel-head"><h3>${esc(m.tierName || 'Member')}</h3><span class="mem-tier" style="--tc:${esc(m.tierColor || '#9aa3ad')}">${esc(m.tierName || '')}</span></div>
  <div class="data-line"><span class="muted">Member No</span><b>${esc(m.memberNo)}</b></div>
  <div class="data-line"><span class="muted">Status</span><b>${m.status === 'active' ? 'Active' : 'Suspended'}</b></div>
  <div class="data-line"><span class="muted">Wallet balance</span><b>$${Number(w).toFixed(2)}</b></div>
  <p class="muted small" style="margin-top:14px">${esc(m.perks || '')}</p>
  <div class="auth-actions" style="margin-top:14px">${button('Open Wallet', 'client-side:wallet', 'btn btn-gold btn-sm')}</div></div></div></div>`;
}

function clCard(m) {
  const tc = m.tierColor || '#d4af37';
  return `<div class="mcard-scene"><div class="mcard" data-action="cl-flip" title="Tap to flip">
    <div class="mcard-face mcard-front" style="--tc:${esc(tc)}">
      <div class="mcard-top"><span class="mcard-brand">The Gent’s</span><span class="mcard-tier">${esc(m.tierName || 'MEMBER')}</span></div>
      <div class="mcard-mid"><div class="mcard-chip">▣</div><div class="mcard-name">${esc(m.name || 'Member')}</div><div class="mcard-pseudo">“${esc(m.pseudo || '—')}”</div></div>
      <div class="mcard-bottom"><span class="mcard-no">${esc(m.memberNo || '')}</span><span class="mcard-tag">MEMBER</span></div>
    </div>
    <div class="mcard-face mcard-back" style="--tc:${esc(tc)}">
      <div class="mcard-back-top"><span class="mcard-brand">The Gent’s</span><span class="mcard-tier">${esc(m.tierName || '')}</span></div>
      <div class="mcard-details">
        <div><span>Profession</span><b>${esc(m.profession || '—')}</b></div>
        <div><span>Branch</span><b>${esc(branch(m.branch).name)}</b></div>
        <div><span>Date joined</span><b>${esc(m.joined || '—')}</b></div>
        <div><span>Status</span><b>${m.status === 'active' ? 'Active' : 'Suspended'}</b></div>
        <div><span>Member No</span><b>${esc(m.memberNo || '')}</b></div>
      </div>
      <div class="mcard-perks">${esc(m.perks || '')}</div>
      <div class="mcard-barcode"></div>
    </div>
  </div></div>`;
}

async function clApi(action, payload) {
  const r = await fetch('api/member.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...(payload || {}) }), credentials: 'same-origin' });
  return r.json().catch(() => null);
}

function clWallet() {
  clKickMem();
  const top = `<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>Wallet & Gift Cards</h1><p class="muted">Top up your balance and send gift cards to friends & family.</p></div></div>`;
  if (!clMemLoaded) return top + '<div class="panel"><p class="muted">Loading your wallet…</p></div>';
  if (!clMem || !clMem.member) return top + `<div class="panel" style="max-width:560px"><h3>Wallet needs a membership</h3><p class="muted">Enrol as a member first to use the wallet and issue gift cards.</p><div style="margin-top:16px">${button('Go to Membership', 'client-side:membership', 'btn btn-gold')}</div></div>`;
  const w = (clMem.wallet || {}).balance || 0;
  const issued = (clMem.giftCards && clMem.giftCards.issued) || [];
  const received = (clMem.giftCards && clMem.giftCards.received) || [];
  const txns = clMem.transactions || [];
  const gcRow = g => { const cons = [g.serviceId ? 'Only: ' + esc(service(g.serviceId).name) : '', g.expiresAt ? 'Expires ' + esc(g.expiresAt) : ''].filter(Boolean).join(' · '); return `<div class="card" style="padding:16px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">GIFT CARD · ${esc(g.code)}</div><div style="font-weight:700;margin:4px 0">${esc(g.toName || g.toEmail || 'Recipient')}</div><small class="muted">${g.maxUses ? g.maxUses + ' use' + (g.maxUses === 1 ? '' : 's') + ' max' : 'Until balance runs out'}${cons ? ' · ' + cons : ''} · issued ${esc((g.created || '').slice(0, 10))}</small></div><div style="text-align:right"><div style="font-size:18px;font-weight:700;color:var(--gold)">$${Number(g.remaining).toFixed(2)}</div><div class="small muted">of $${Number(g.amount).toFixed(2)}</div></div></div></div>`; };
  return top + `<div class="dash-grid">
  <div class="panel"><div class="panel-head"><h3>Balance</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">$${Number(w).toFixed(2)}</div><p class="muted small">Pre-load to pay for services at any branch.</p>
  <form id="cl-topup-form" style="margin-top:14px"><div class="form-group"><label class="form-label">Top-up amount ($)</label><input class="field" type="number" step="0.01" min="1" max="10000" required name="amount" placeholder="e.g. 50"></div><button class="btn btn-gold">Request Top-up</button><p class="muted small" style="margin-top:8px">The grooming center confirms top-ups — balance updates once approved.</p></form></div>
  <div class="panel"><div class="panel-head"><h3>Issue a Gift Card</h3></div><form id="cl-gc-form">
  <div class="form-group"><label class="form-label">Amount ($)</label><input class="field" type="number" step="0.01" min="1" max="10000" required name="amount" placeholder="e.g. 30"></div>
  <div class="form-group"><label class="form-label">Recipient name</label><input class="field" required name="toName" placeholder="e.g. T. Moyo"></div>
  <div class="form-group"><label class="form-label">Recipient email (optional — lets them see it)</label><input class="field" type="email" name="toEmail" placeholder="them@example.com"></div>
  <div class="form-group"><label class="form-label">Use limit</label><select class="field" name="maxUses"><option value="1">Once</option><option value="2">Twice</option><option value="3">Three times</option><option value="5">Five times</option><option value="0">Until balance runs out</option></select></div>
  <div class="form-group"><label class="form-label">Restrict to service (optional)</label><select class="field" name="serviceId"><option value="">Any service</option>${db.services.map(s => `<option value="${esc(s.id)}">${esc(s.name)} — ${money(s.price)}</option>`).join('')}</select></div>
  <div class="form-group"><label class="form-label">Expires on (optional)</label><input class="field" type="date" name="expiresAt" min="${new Date().toISOString().slice(0, 10)}"></div>
  <button class="btn btn-gold">Issue Gift Card</button><p class="muted small" style="margin-top:8px">Deducted from your balance instantly. The recipient redeems services up to the remaining value — you can restrict it to one service or set an expiry.</p></form></div></div>
  <div class="dash-grid" style="margin-top:18px"><div class="panel"><div class="panel-head"><h3>Gift Cards I've Sent (${issued.length})</h3></div>${issued.map(gcRow).join('') || '<p class="muted">None yet — issue one above.</p>'}</div>
  <div class="panel"><div class="panel-head"><h3>Gift Cards for Me (${received.length})</h3></div>${received.map(gcRow).join('') || '<p class="muted">No gift cards addressed to you.</p>'}</div></div>
  <div class="panel" style="margin-top:18px"><div class="panel-head"><h3>Wallet History</h3></div>${txns.map(t => { const kind = t.kind === 'giftcard' ? 'Gift card' : t.kind === 'adjust' ? 'Adjustment' : 'Top-up'; const amt = Number(t.amount || 0); return `<div class="data-line"><span class="muted">${esc((t.created || '').slice(0, 10))} · ${kind} ${amt < 0 ? '−' : '+'}$${Math.abs(amt).toFixed(2)}${t.ref ? ' · ' + esc(t.ref) : ''}${t.balanceAfter != null ? ' → $' + Number(t.balanceAfter).toFixed(2) : ''}</span><b>${badge(t.status === 'approved' || t.status === 'completed' ? 'Confirmed' : t.status === 'pending' ? 'Pending' : 'Cancelled')}</b></div>`; }).join('') || '<p class="muted">No wallet activity yet.</p>'}</div>`;
}

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'cl-flip') { const card = el.closest('.mcard'); if (card) card.classList.toggle('flipped'); e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (c === 'cl-enrol') {
    e.preventDefault(); e.stopImmediatePropagation();
    clApi('enrol').then(j => { if (j && j.ok) { clMemLoaded = false; clKickMem(true); toast('Welcome to The Gent’s membership!'); } else toast('Could not enrol right now.'); }); return;
  }
  if (c === 'cl-auth-mode') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = v; return clAuthModal(); }
  if (c === 'cl-register') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'register'; return clAuthModal(); }
  if (c === 'cl-logout') {
    e.preventDefault(); e.stopImmediatePropagation();
    try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_client'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {}
    location.href = 'login'; return;
  }
  if (page !== 'client') return;
  if (c === 'client-side') { e.preventDefault(); e.stopImmediatePropagation(); clientView = v; render(); return; }
  if (c === 'cl-details') { e.stopImmediatePropagation(); return clDetails(v); }
}, true);

document.addEventListener('submit', async e => {
  const form = e.target;
  if (form.id === 'client-auth-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
    try {
      const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: form.dataset.mode === 'register' ? 'client-register' : 'client-login', name: v.name, email: v.email, phone: v.phone, password: v.password }), credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok) {
        try { sessionStorage.setItem('gents_auth', 'client'); sessionStorage.setItem('gents_client', JSON.stringify(j.client)); sessionStorage.removeItem('gents_staff') } catch (x) {}
        closeModal(); toast('Welcome' + (j.client && j.client.name ? ', ' + j.client.name.split(' ')[0] : '') + '! Confirming your booking…');
        handle('book-submit'); return;
      }
      if (r.status === 409) { clAuthMode = 'login'; clAuthModal(); toast('Account already exists — please sign in.'); return; }
      toast((j && j.error === 'invalid credentials') ? 'Invalid email or password.' : ((j && j.error) || 'Sign-in failed — please try again.'));
    } catch (x) { toast('Could not reach the server — check your connection.'); }
    if (btn) btn.disabled = false; return;
  }
  if (form.id === 'cl-topup-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    const amount = Number(v.amount);
    // Try Paynow first — falls back to a manual top-up request if not configured
    try {
      const pr = await fetch('api/paya.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'init', amount }), credentials: 'same-origin' });
      const pj = await pr.json();
      if (pj && pj.ok && pj.redirect) { location.href = pj.redirect; return; }
      if (!(pj && pj.error === 'payments_not_configured')) { toast((pj && pj.error) || 'Payment failed — try again.'); return; }
    } catch (x) { /* gateway unreachable → manual request */ }
    clApi('topup', { amount }).then(j => {
      if (j && j.ok) { toast(j.message || 'Top-up requested.'); clMemLoaded = false; clKickMem(true); }
      else toast((j && j.error) || 'Top-up failed.');
    }).catch(() => toast('Could not reach the server.')); return;
  }
  if (form.id === 'cl-gc-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const v = Object.fromEntries(new FormData(form));
    clApi('issue-giftcard', { amount: Number(v.amount), toName: v.toName, toEmail: v.toEmail, maxUses: Number(v.maxUses), serviceId: v.serviceId || '', expiresAt: v.expiresAt || '' }).then(j => {
      if (j && j.ok) { toast('Gift card ' + j.giftCard.code + ' issued — $' + Number(j.balance).toFixed(2) + ' left.'); clMemLoaded = false; clKickMem(true); }
      else toast((j && j.error) || 'Could not issue gift card.');
    }).catch(() => toast('Could not reach the server.')); return;
  }
  if (form.id !== 'cl-profile-form') return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(form));
  db.clientProfile = { name: v.name, phone: v.phone, email: v.email, favBranch: v.favBranch || '', favBarber: v.favBarber || '' };
  save(); toast('Profile saved.'); render();
});

// ===== The Gent's — Staff, User Management & Accounting/ERP =====
// Injected inside app.js IIFE by _build.js. Adds admCan/myPerms (used by
// adminBody/dashboardFrame in admin-extra.js), new admin tabs, CRUD,
// CSV/Excel/PDF export and CSV/Excel import, payroll/payslips, petty cash,
// HR actions and a rule-based assistant.

let erpTab = 'overview', aiLog = [];
const ERPTABS = [['overview', 'Overview'], ['transactions', 'Income & Expenses'], ['payroll', 'Payroll'], ['petty', 'Petty Cash'], ['hr', 'Promotions & HR'], ['assistant', 'AI Assistant']];

// ---------- Permissions (granular RBAC) ----------
// [group, [[permKey, label], ...]] — every privilege is a single component.
const PERM_GROUPS = [
  ['Dashboard', [['dashboard.view', 'View dashboard']]],
  ['Bookings & Requests', [
    ['bookings.view', 'View bookings'], ['bookings.create', 'Create walk-ins'],
    ['bookings.approve', 'Approve requests'], ['bookings.decline', 'Decline requests (with reason)'],
    ['bookings.complete', 'Mark completed'], ['bookings.cancel', 'Cancel bookings'],
    ['bookings.delete', 'Delete bookings'], ['bookings.pay', 'Record payments'],
    ['bookings.export', 'Import / Export data'], ['requests.view', 'Booking Requests page'],
    ['calendar.view', 'Calendar page']]],
  ['Branches', [['branches.view', 'View branches'], ['branches.manage', 'Add / edit / delete branches']]],
  ['Barbers & Services', [['staff_data.view', 'View barbers & services'], ['staff_data.manage', 'Add / edit / delete barbers & services']]],
  ['Content & Media', [['content.view', 'View content'], ['content.manage', 'Edit hero banners & gallery']]],
  ['Clients', [['clients.view', 'View client profiles'], ['clients.manage', 'Manage client profiles']]],
  ['Membership & Wallet', [
    ['membership.view', 'View membership'], ['membership.tiers', 'Manage tiers'],
    ['membership.members', 'Manage members'], ['membership.wallets', 'Wallets & top-up approvals'],
    ['membership.giftcards', 'Manage gift cards'], ['membership.rewards', 'Client rewards']]],
  ['Reports', [['reports.view', 'View reports']]],
  ['User Management', [['usermgmt.view', 'View client directory'], ['usermgmt.manage', 'Add / edit client profiles']]],
  ['Staff & Roles', [['staffmgmt.view', 'View staff'], ['staffmgmt.manage', 'Manage staff, permissions & roles']]],
  ['Accounting & ERP', [
    ['erp.view', 'View ERP'], ['erp.transactions', 'Income & expenses'], ['erp.payroll', 'Payroll'],
    ['erp.petty', 'Petty cash'], ['erp.hr', 'HR & promotions'], ['erp.assistant', 'AI assistant'],
    ['erp.manage', 'Add entries / run payroll / settings']]],
  ['Settings', [['settings.manage', 'Edit site settings']]]
];
const PERM_MAP = {
  overview: 'dashboard.view', bookings: 'bookings.view', requests: 'requests.view', calendar: 'calendar.view',
  branches: 'branches.view', barbers: 'staff_data.view', services: 'staff_data.view',
  content: 'content.view', clients: 'clients.view', membership: 'membership.view', reports: 'reports.view',
  users: 'usermgmt.view', staff: 'staffmgmt.view', erp: 'erp.view', settings: 'settings.manage'
};
// Legacy module keys → granular expansion (keep in sync with api/lib.php)
const LEGACY_PERM_MAP = {
  dashboard: ['dashboard.view'],
  bookings: ['bookings.view', 'bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'bookings.delete', 'bookings.pay', 'bookings.export', 'requests.view', 'calendar.view'],
  calendar: ['calendar.view'],
  branches: ['branches.view', 'branches.manage'],
  staff_data: ['staff_data.view', 'staff_data.manage'],
  content: ['content.view', 'content.manage'],
  clients: ['clients.view', 'clients.manage'],
  membership: ['membership.view', 'membership.tiers', 'membership.members', 'membership.wallets', 'membership.giftcards', 'membership.rewards'],
  reports: ['reports.view'],
  settings: ['settings.manage'],
  usermgmt: ['usermgmt.view', 'usermgmt.manage'],
  staffmgmt: ['staffmgmt.view', 'staffmgmt.manage'],
  erp: ['erp.view', 'erp.transactions', 'erp.payroll', 'erp.petty', 'erp.hr', 'erp.assistant', 'erp.manage']
};
const STAFF_SEED = [{ id: 'admin1', username: 'Munyah', name: 'Munyah', email: 'munyah777@gmail.com', role: 'Super Admin', permissions: '*', protected: true, status: 'active', salary: 0, createdAt: '2026-01-01' }];
const ROLES = ['Receptionist', 'Manager', 'Super Admin'];

function safeSS(k) { try { return sessionStorage.getItem(k) } catch (e) { return null } }
function staffAll() { if (!Array.isArray(db.staff)) db.staff = JSON.parse(JSON.stringify(STAFF_SEED)); if (!Array.isArray(db.roles)) db.roles = roleSeeds(); return db.staff; }
function roleSeeds() {
  return [
    { id: 'rol-recep', name: 'Receptionist', perms: ['bookings.view', 'bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'requests.view', 'calendar.view', 'clients.view', 'branches.view', 'staff_data.view', 'content.view'], createdAt: '2026-01-01' },
    { id: 'rol-mgr', name: 'Manager', perms: ['dashboard.view', 'bookings.view', 'bookings.create', 'bookings.approve', 'bookings.decline', 'bookings.complete', 'bookings.cancel', 'bookings.pay', 'bookings.export', 'requests.view', 'calendar.view', 'branches.view', 'branches.manage', 'staff_data.view', 'staff_data.manage', 'content.view', 'content.manage', 'clients.view', 'clients.manage', 'membership.view', 'membership.tiers', 'membership.members', 'membership.wallets', 'membership.giftcards', 'membership.rewards', 'reports.view', 'usermgmt.view', 'usermgmt.manage', 'staffmgmt.view', 'erp.view', 'erp.transactions', 'erp.payroll', 'erp.petty', 'erp.hr', 'erp.assistant', 'erp.manage'], createdAt: '2026-01-01' }
  ];
}
function admMe() { const l = staffAll(); const id = safeSS('gents_staff') || ''; if (id.indexOf('admin_users:') === 0) return { id, username: 'Admin', name: 'Administrator', email: '', role: 'Super Admin', permissions: '*', protected: true, status: 'active' }; return l.find(s => s.id === id) || null; }
function expandPerms(list) { const out = new Set(); (list || []).forEach(p => (LEGACY_PERM_MAP[p] || [p]).forEach(x => out.add(x))); return [...out]; }
function myPerms() {
  const m = admMe(); if (!m) return [];
  if (m.permissions === '*') return ['*'];
  const list = [...(m.permissions || [])];
  const rid = m.roleId || '';
  const r = (db.roles || []).find(x => x.id === rid || x.name === rid || x.name === m.role);
  if (r) (r.perms || []).forEach(p => list.push(p));
  return expandPerms(list);
}
function hasPerm(p) {
  const m = myPerms(); if (m.includes('*')) return true;
  if (m.includes(p)) return true;
  if (p.endsWith('.view')) { const mg = p.slice(0, -5) + '.manage'; if (m.includes(mg)) return true; }
  return false;
}
function admCan(tab) { const need = PERM_MAP[tab]; return need ? hasPerm(need) : false; }
const ERP_TAB_PERM = { overview: 'erp.view', transactions: 'erp.transactions', payroll: 'erp.payroll', petty: 'erp.petty', hr: 'erp.hr', assistant: 'erp.assistant' };
function erpTabAllowed(t) { return hasPerm(ERP_TAB_PERM[t] || 'erp.view') || hasPerm('erp.manage'); }
function erpCan(s) { return hasPerm('erp.' + s) || hasPerm('erp.manage'); }
const IO_PERM = {
  bookings: { exp: ['bookings.view', 'bookings.export'], imp: ['bookings.create', 'bookings.export'] },
  branches: { exp: ['branches.view'], imp: ['branches.manage'] },
  barbers: { exp: ['staff_data.view'], imp: ['staff_data.manage'] },
  services: { exp: ['staff_data.view'], imp: ['staff_data.manage'] },
  clients: { exp: ['usermgmt.view'], imp: ['usermgmt.manage'] },
  customers: { exp: ['clients.view'] },
  staff: { exp: ['staffmgmt.view'], imp: ['staffmgmt.manage'] },
  transactions: { exp: ['erp.transactions'], imp: ['erp.manage'] },
  payroll: { exp: ['erp.payroll'], imp: ['erp.manage'] },
  petty: { exp: ['erp.petty'], imp: ['erp.manage'] },
  calendar: { exp: ['calendar.view'] },
  reports: { exp: ['reports.view'] }
};
function ioAllowed(ent, mode) { const d = IO_PERM[ent]; if (!d) return false; const list = mode === 'imp' ? (d.imp || []) : (d.exp || []); return list.some(hasPerm); }
function acct() { if (!db.accounting) db.accounting = { openingBalance: 0, transactions: [], payroll: [], pettyFloat: 0, pettyCash: [], hrEvents: [] }; return db.accounting; }
function clientProfiles() {
  if (!Array.isArray(db.clientProfiles)) {
    const seen = {};
    db.clientProfiles = db.bookings.map(b => { const k = b.phone || b.email || b.name; if (!k || seen[k]) return null; seen[k] = 1; return { id: 'cli' + b.id, name: b.name, phone: b.phone || '', email: b.email || '', status: 'active', note: '', createdAt: b.date }; }).filter(Boolean);
  }
  return db.clientProfiles;
}

// ---------- ERP helpers ----------
const txList = () => acct().transactions;
const incTotal = l => (l || txList().filter(t => t.type === 'income')).reduce((s, t) => s + Number(t.amount || 0), 0);
const expTotal = l => (l || txList().filter(t => t.type === 'expense')).reduce((s, t) => s + Number(t.amount || 0), 0);
const pettyBalance = () => Number(acct().pettyFloat || 0) - acct().pettyCash.reduce((s, p) => s + Number(p.amount || 0), 0);
const money0 = n => '$' + Number(n || 0).toFixed(2);

// =====================================================================
//  USER MANAGEMENT (client profiles)
// =====================================================================
function admUsers(top) {
  const list = clientProfiles().slice().sort((a, b) => a.name.localeCompare(b.name));
  const spend = {};
  db.bookings.forEach(b => { const k = b.phone || b.email || b.name; spend[k] = (spend[k] || 0) + (b.status !== 'Cancelled' && b.status !== 'Declined' ? Number(service(b.service).price || 0) : 0); });
  return top + `<div class="panel"><div class="panel-head"><h3>Client Profiles (${list.length})</h3><div class="auth-actions">${ioButtons('clients', true)}${hasPerm('usermgmt.manage') ? button('+ Add Client', 'usr-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Total Spend</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(c => { const bk = db.bookings.filter(b => (b.phone || b.email || b.name) === (c.phone || c.email || c.name)); const sp = spend[c.phone || c.email || c.name] || 0; const plat = sp >= 100; return `<tr><td><strong>${esc(c.name)}</strong>${plat ? ' <span class="badge status completed" style="font-size:9px">PLATINUM</span>' : ''}</td><td>${esc(c.phone || '—')}</td><td>${esc(c.email || '—')}</td><td>${bk.length}</td><td>${money(sp)}</td><td>${c.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td>${hasPerm('usermgmt.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="usr-edit:${c.id}">Edit</button><button class="btn btn-sm" data-action="usr-del:${c.id}">Del</button></div>` : ''}</td></tr>`; }).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No client profiles yet.</div>'}</div></div>`;
}

function usrForm(id) {
  const x = id ? clientProfiles().find(c => c.id === id) : { name: '', phone: '', email: '', status: 'active', note: '' };
  if (id && !x) return;
  modal(id ? 'Edit Client' : 'Add Client', `<form id="usr-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(x.name || '')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" value="${esc(x.phone || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" name="email" value="${esc(x.email || '')}"></div><div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${x.status === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${x.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div></div><div class="form-group"><label class="form-label">Notes</label><input class="field" name="note" value="${esc(x.note || '')}"></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Client'}</button></form>`);
}

// =====================================================================
//  STAFF MANAGEMENT (admins + permissions)
// =====================================================================
function admStaff(top) {
  const list = staffAll().slice().sort((a, b) => a.name.localeCompare(b.name));
  const roles = db.roles || [];
  const roleName = s => { const r = roles.find(x => x.id === (s.roleId || '') || x.name === (s.roleId || s.role)); return r ? r.name : (s.role || '—'); };
  const permCount = s => s.permissions === '*' ? 'All' : expandPerms([...(s.permissions || []), ...((roles.find(x => x.id === (s.roleId || '') || x.name === (s.roleId || s.role)) || {}).perms || [])]).length + ' perms';
  const canManage = hasPerm('staffmgmt.manage');
  return top + admRolesPanel(canManage) + `<div class="panel"><div class="panel-head"><h3>Staff & Admins (${list.length})</h3><div class="auth-actions">${canManage ? ioButtons('staff', true) + button('+ Add Staff', 'stf-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Permissions</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.username)}</td><td>${esc(s.email)}</td><td>${esc(roleName(s))}</td><td>${s.permissions === '*' ? 'All' : permCount(s)}</td><td>${s.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions">${canManage || s.id === (admMe() || {}).id ? `<button class="btn btn-sm" data-action="stf-edit:${s.id}">Edit</button>` : ''}${!s.protected && canManage ? `<button class="btn btn-sm" data-action="stf-perms:${s.id}">Perms</button><button class="btn btn-sm" data-action="stf-del:${s.id}">Del</button>` : ''}</div></td></tr>`).join('')}</tbody></table></div></div>`;
}

function admRolesPanel(canManage) {
  const roles = db.roles || [];
  return `<div class="panel" style="margin-bottom:20px"><div class="panel-head"><h3>Roles & Permission Sets (${roles.length})</h3>${canManage ? `<div class="auth-actions">${button('+ New Role', 'role-add', 'btn btn-gold btn-sm')}</div>` : ''}</div>
  <p class="muted small" style="margin-top:0">Bundle permissions into reusable roles — assign them when creating or editing staff.</p>
  <div class="grid grid-3">${roles.map(r => `<div class="card" style="padding:14px"><strong>${esc(r.name)}</strong><div class="small muted" style="margin:6px 0">${(r.perms || []).length} permissions</div><div class="small muted" style="margin-bottom:8px">${(r.perms || []).slice(0, 4).map(p => esc(p)).join(' · ')}${(r.perms || []).length > 4 ? ' …' : ''}</div>${canManage ? `<div class="row-actions">${button('Edit', 'role-edit:' + r.id, 'btn btn-sm')}${button('Del', 'role-del:' + r.id, 'btn btn-sm')}</div>` : ''}</div>`).join('') || '<p class="muted">No custom roles yet.</p>'}</div></div>`;
}

function permPicker(sel) {
  return PERM_GROUPS.map(([g, items]) => `<div data-pgroup="${esc(g)}" style="margin:12px 0"><div class="eyebrow" style="font-size:10px;display:flex;justify-content:space-between;align-items:center">${esc(g)} <label class="small muted" style="font-weight:400;text-transform:none;letter-spacing:0"><input type="checkbox" class="perm-all"> all</label></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 14px;margin-top:6px">${items.map(([k, l]) => `<label class="small" style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" name="perm" value="${k}" ${sel.includes(k) ? 'checked' : ''} style="margin-top:2px"> <span>${l}</span></label>`).join('')}</div></div>`).join('');
}

function roleForm(id) {
  const x = id ? (db.roles || []).find(r => r.id === id) : { name: '', perms: [] };
  if (id && !x) return;
  modal(id ? 'Edit Role' : 'New Role', `<form id="role-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Role name</label><input class="field" required name="name" value="${esc(x.name || '')}" placeholder="e.g. Junior Barber, Cashier"></div><div class="form-group"><label class="form-label">Permissions</label>${permPicker(x.perms || [])}</div><button class="btn btn-gold">${id ? 'Save Role' : 'Create Role'}</button></form>`);
}

function stfForm(id) {
  const x = id ? staffAll().find(s => s.id === id) : { username: '', name: '', email: '', role: '', roleId: '', password: '', status: 'active' };
  if (id && !x) return;
  const isAdmin = x.permissions === '*';
  const roleOpts = (db.roles || []).map(r => `<option value="${r.id}" ${x.roleId === r.id ? 'selected' : ''}>${esc(r.name)} (role)</option>`).join('');
  modal(id ? 'Edit Staff' : 'Add Staff', `<form id="stf-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(x.name || '')}"></div><div class="form-group"><label class="form-label">Username</label><input class="field" required name="username" value="${esc(x.username || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" value="${esc(x.email || '')}"></div><div class="form-group"><label class="form-label">Job title</label><input class="field" name="role" value="${esc(x.role || '')}" placeholder="e.g. Receptionist"></div><div class="form-group"><label class="form-label">Access level</label><select class="field" name="access"><option value="staff" ${isAdmin ? '' : 'selected'}>Staff — limited permissions</option><option value="admin" ${isAdmin ? 'selected' : ''}>Administrator — full access</option></select><p class="muted small" style="margin:4px 0 0">Admins see every dashboard section; staff only see what their permissions allow.</p></div><div class="form-group"><label class="form-label">Permission role</label><select class="field" name="roleId" ${isAdmin ? 'disabled' : ''}><option value="">— none —</option>${roleOpts}</select><p class="muted small" style="margin:4px 0 0">Assign a custom role to grant its permission set — you can add more below.</p></div><div class="form-group"><label class="form-label">${id ? 'New password (blank = keep)' : 'Password'}</label><input class="field" type="password" name="password" ${id ? '' : 'required'}></div><div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${x.status === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${x.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Staff'}</button></form>`);
}

function stfPerms(id) {
  const s = staffAll().find(x => x.id === id); if (!s || s.protected) return;
  const rid = s.roleId || '';
  const r = (db.roles || []).find(x => x.id === rid || x.name === rid || x.name === s.role);
  const rolePerms = r ? (r.perms || []) : [];
  const cur = s.permissions === '*' ? PERM_GROUPS.flatMap(g => g[1]).map(i => i[0]) : expandPerms([...(s.permissions || []), ...rolePerms]);
  modal('Permissions — ' + esc(s.name), `<form id="stf-perms-form"><input type="hidden" name="id" value="${esc(id)}"><p class="muted small" style="margin-top:0">${r ? 'Role <b>' + esc(r.name) + '</b> grants ' + rolePerms.length + ' permissions (shown checked) — uncheck to override, or add extras.' : 'Select which privileges this staff member has — anything unchecked simply won\'t appear on their dashboard.'}</p>${permPicker(cur)}<button class="btn btn-gold">Save Permissions</button></form>`);
}

// =====================================================================
//  ACCOUNTING & ERP
// =====================================================================
function admErp(top) {
  if (!erpTabAllowed(erpTab)) erpTab = 'overview';
  const a = acct();
  const inc = incTotal(), exp = expTotal(), net = inc - exp;
  return erpTab === 'transactions' ? erpTransactions(top) : erpTab === 'payroll' ? erpPayroll(top) : erpTab === 'petty' ? erpPetty(top) : erpTab === 'hr' ? erpHr(top) : erpTab === 'assistant' ? erpAssistant(top) : erpOverview(a, inc, exp, net, top);
}

function erpOverview(a, inc, exp, net, top) {
  const pendingPay = a.payroll.filter(p => p.status === 'pending').length;
  const stats = [
    ['▤', money0(a.openingBalance), 'Opening Balance'],
    ['↓', money0(inc), 'Income'],
    ['↑', money0(exp), 'Expenses'],
    ['◈', money0(net), 'Net Profit'],
    ['¤', money0(pettyBalance()), 'Petty Cash'],
    ['▣', pendingPay, 'Payroll Pending']
  ];
  // last 6 months income vs expense
  const months = [];
  for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleDateString('en-ZW', { month: 'short' }) }); }
  const inM = months.map(m => ({ label: m.label, n: a.transactions.filter(t => t.type === 'income' && (t.date || '').startsWith(m.key)).reduce((s, t) => s + Number(t.amount || 0), 0) }));
  const exM = months.map(m => ({ label: m.label, n: a.transactions.filter(t => t.type === 'expense' && (t.date || '').startsWith(m.key)).reduce((s, t) => s + Number(t.amount || 0), 0) }));
  const maxV = Math.max(1, ...inM.map(x => x.n), ...exM.map(x => x.n));
  const chart = months.map((m, i) => `<div class="bar" style="flex-direction:column;align-items:center;justify-content:flex-end;height:150px;gap:4px"><div style="display:flex;gap:3px;align-items:flex-end;height:120px"><i title="Income ${money0(inM[i].n)}" style="width:12px;background:var(--gold);border-radius:3px 3px 0 0;height:${Math.max(2, inM[i].n / maxV * 110)}px"></i><i title="Expense ${money0(exM[i].n)}" style="width:12px;background:#c0392b;border-radius:3px 3px 0 0;height:${Math.max(2, exM[i].n / maxV * 110)}px"></i></div><span style="font-size:9px;color:var(--muted)">${m.label}</span></div>`).join('');
  const recent = a.transactions.slice().sort((x, y) => (y.date || '').localeCompare(x.date || '')).slice(0, 6);
  return `<div class="dash-top"><div><div class="eyebrow">FINANCE</div><h1>Accounting & ERP</h1><p class="muted">Income, expenses, payroll, petty cash and HR — all in one place.</p></div></div>
  <div class="segmented" style="margin-bottom:20px">${ERPTABS.filter(([k]) => erpTabAllowed(k)).map(([k, t]) => `<button class="pill ${erpTab === k ? 'active' : ''}" data-action="erp-tab:${k}">${t}</button>`).join('')}</div>
  <div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number" style="font-size:20px">${n}</div><div class="small">${t}</div></div>`).join('')}</div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Income vs Expenses · 6 months</h3><span class="small muted"><i style="display:inline-block;width:9px;height:9px;background:var(--gold);border-radius:2px"></i> income &nbsp;<i style="display:inline-block;width:9px;height:9px;background:#c0392b;border-radius:2px"></i> expense</span></div><div class="chart">${chart}</div></div>
  <div class="panel"><div class="panel-head"><h3>Opening Balance & Quick Actions</h3></div><form id="erp-opening" class="form-group" style="display:flex;gap:8px;align-items:end;margin-bottom:14px"><input class="field" type="number" step="0.01" name="opening" value="${a.openingBalance || 0}" style="max-width:160px"><button class="btn btn-sm">Set</button></form><div class="grid grid-3">${erpCan('transactions') ? button('+ Income', 'erp-addtx:income', 'btn') + button('+ Expense', 'erp-addtx:expense', 'btn') : ''}${erpCan('payroll') ? button('Run Payroll', 'erp-payroll-run', 'btn') : ''}</div></div></div>
  <div class="panel"><div class="panel-head"><h3>Recent Transactions</h3><button class="btn btn-sm" data-action="erp-tab:transactions">View all</button></div>${recent.map(t => `<div class="data-line"><span class="muted">${esc(t.date)} · ${esc(t.description || t.category)}</span><b style="color:${t.type === 'income' ? 'var(--gold)' : '#e08a8a'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</b></div>`).join('') || '<p class="muted">No transactions yet.</p>'}</div>`;
}

function erpTransactions(top) {
  const list = txList().slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const cats = [...new Set(txList().map(t => t.category).filter(Boolean))];
  return top + `<div class="panel"><div class="panel-head"><h3>Transactions (${list.length})</h3><div class="auth-actions">${erpCan('transactions') ? button('+ Income', 'erp-addtx:income', 'btn btn-gold btn-sm') + button('+ Expense', 'erp-addtx:expense', 'btn btn-sm') : ''}${ioButtons('transactions', true)}</div></div>
  ${cats.length ? `<div class="adm-filters"><div class="segmented">${['all', ...cats].map(c => `<button class="pill ${admTxCat === c ? 'active' : ''}" data-action="erp-cat:${c}">${c === 'all' ? 'All' : esc(c)}</button>`).join('')}</div></div>` : ''}
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Branch</th><th>Amount</th></tr></thead><tbody>${list.filter(t => admTxCat === 'all' || t.category === admTxCat).map(t => `<tr><td>${esc(t.date)}</td><td>${t.type === 'income' ? '<span class="badge status confirmed">Income</span>' : '<span class="badge status declined">Expense</span>'}</td><td>${esc(t.category)}</td><td>${esc(t.description || '—')}</td><td>${esc(branch(t.branch).name)}</td><td style="color:${t.type === 'income' ? 'var(--gold)' : '#e08a8a'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No transactions yet.</div>'}</div>
  <p class="muted small" style="margin-top:12px">Totals — Income: <b style="color:var(--gold)">${money(incTotal())}</b> · Expenses: <b style="color:#e08a8a">${money(expTotal())}</b> · Net: <b>${money(incTotal() - expTotal())}</b></p></div>`;
}
let admTxCat = 'all';

function txForm(type) {
  const cats = type === 'income' ? ['Service Sales', 'Product Sales', 'Membership', 'Other Income'] : ['Rent', 'Supplies', 'Utilities', 'Salaries', 'Marketing', 'Other Expense'];
  modal(type === 'income' ? 'Add Income' : 'Add Expense', `<form id="erp-tx-form"><input type="hidden" name="type" value="${type}"><div class="form-grid"><div class="form-group"><label class="form-label">Date</label><input class="field" type="date" required name="date" value="${new Date().toISOString().slice(0, 10)}"></div><div class="form-group"><label class="form-label">Amount (USD)</label><input class="field" type="number" min="0.01" step="0.01" required name="amount"></div><div class="form-group"><label class="form-label">Category</label><select class="field" name="category">${cats.map(c => `<option>${c}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}<option value="">All / HQ</option></select></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" name="description" placeholder="e.g. Saturday service sales"></div><button class="btn btn-gold">Save ${type === 'income' ? 'Income' : 'Expense'}</button></form>`);
}

function erpPayroll(top) {
  const a = acct();
  const list = a.payroll.slice().sort((x, y) => (y.month || '').localeCompare(x.month || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Payroll</h3><div class="auth-actions">${erpCan('payroll') ? button('Run Payroll', 'erp-payroll-run', 'btn btn-gold btn-sm') : ''}${ioButtons('payroll', true)}</div></div>
  <p class="muted small" style="margin-top:0">Run payroll generates a payslip for every active staff member based on their monthly salary.</p>
  <div class="table-wrap"><table><thead><tr><th>Payslip</th><th>Staff</th><th>Role</th><th>Month</th><th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th><th></th></tr></thead><tbody>${list.map(p => `<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${esc(p.month)}</td><td>${money(p.gross)}</td><td>${money(p.deductions || 0)}</td><td><b>${money(p.net)}</b></td><td>${p.status === 'paid' ? '<span class="badge status completed">Paid</span>' : '<span class="badge status pending">Pending</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="erp-payslip:${p.id}">Payslip</button>${p.status === 'pending' ? `<button class="btn btn-sm" data-action="erp-pay-paid:${p.id}">Mark Paid</button>` : ''}</div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No payslips yet — run payroll to generate them.</div>'}</div></div>`;
}

function runPayroll() {
  const month = new Date().toISOString().slice(0, 7);
  const a = acct();
  const staff = staffAll().filter(s => s.status === 'active');
  if (!staff.length) return toast('No active staff.');
  staff.forEach(s => {
    if (a.payroll.some(p => p.staffId === s.id && p.month === month)) return;
    const gross = Number(s.salary || 0), deductions = 0;
    a.payroll.push({ id: 'PAY-' + s.id + '-' + month, staffId: s.id, name: s.name, role: s.role, month, gross, deductions, net: gross - deductions, status: 'pending' });
  });
  save(); toast('Payroll generated for ' + month + '.'); render();
}

function payslip(id) {
  const p = acct().payroll.find(x => x.id === id); if (!p) return;
  const s = staffAll().find(x => x.id === p.staffId) || {};
  modal('Payslip ' + esc(p.id), `<div class="payslip"><div class="payslip-head"><div><div class="eyebrow">THE GENT’S BARBER & GENTS GROOMING CENTER</div><h3>Payslip</h3></div><div class="small muted" style="text-align:right">${esc(p.month)}<br>${p.status === 'paid' ? 'PAID' : 'PENDING'}</div></div>
  <div class="kv" style="margin:16px 0"><span>Employee</span><b>${esc(p.name)}</b><span>Role</span><b>${esc(p.role)}</b><span>Employee ID</span><b>${esc(p.staffId)}</b></div>
  <table style="width:100%;font-size:13px"><thead><tr><th style="text-align:left">Earnings</th><th style="text-align:right">Amount</th></tr></thead><tbody><tr><td>Basic Salary</td><td style="text-align:right">${money(p.gross)}</td></tr></tbody></table>
  <table style="width:100%;font-size:13px;margin-top:8px"><thead><tr><th style="text-align:left">Deductions</th><th style="text-align:right">Amount</th></tr></thead><tbody><tr><td>Statutory / Other</td><td style="text-align:right">${money(p.deductions || 0)}</td></tr></tbody></table>
  <div class="data-line" style="margin-top:14px;border-top:1px solid var(--line);padding-top:10px"><span>NET PAY</span><b style="font-size:18px;color:var(--gold)">${money(p.net)}</b></div>
  <p class="muted small" style="margin-top:18px">Generated ${new Date().toLocaleDateString('en-ZW')}. This is a system-generated payslip.</p></div>
  <div class="auth-actions" style="margin-top:16px">${button('Download PDF', 'erp-payslip-pdf:' + p.id, 'btn btn-gold')}${p.status === 'pending' ? button('Mark Paid', 'erp-pay-paid:' + p.id, 'btn') : ''}</div>`);
}

function erpPetty(top) {
  const a = acct();
  const list = a.pettyCash.slice().sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  return top + `<div class="panel"><div class="panel-head"><h3>Petty Cash</h3><div class="auth-actions">${button('Set Float', 'erp-float', 'btn btn-sm')}${button('+ Expense Voucher', 'erp-petty-add', 'btn btn-gold btn-sm')}${ioButtons('petty', true)}</div></div>
  <div class="stat-grid" style="margin-bottom:18px"><div class="stat"><span class="stat-icon">¤</span><div class="number">${money0(pettyBalance())}</div><div class="small">Current Balance</div></div><div class="stat"><span class="stat-icon">▤</span><div class="number">${money0(a.pettyFloat || 0)}</div><div class="small">Float</div></div><div class="stat"><span class="stat-icon">↑</span><div class="number">${money0(a.pettyCash.reduce((s, p) => s + Number(p.amount || 0), 0))}</div><div class="small">Total Spent</div></div></div>
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Voucher</th><th>Description</th><th>Received By</th><th>Amount</th></tr></thead><tbody>${list.map(p => `<tr><td>${esc(p.date)}</td><td>${esc(p.id)}</td><td>${esc(p.description)}</td><td>${esc(p.receivedBy || '—')}</td><td style="color:#e08a8a">−${money(p.amount)}</td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No petty cash expenses yet.</div>'}</div></div>`;
}

function pettyForm() {
  modal('Petty Cash Voucher', `<form id="erp-petty-form"><div class="form-grid"><div class="form-group"><label class="form-label">Date</label><input class="field" type="date" required name="date" value="${new Date().toISOString().slice(0, 10)}"></div><div class="form-group"><label class="form-label">Amount (USD)</label><input class="field" type="number" min="0.01" step="0.01" required name="amount"></div><div class="form-group"><label class="form-label">Received by</label><input class="field" name="receivedBy" placeholder="Staff member"></div></div><div class="form-group"><label class="form-label">Description</label><input class="field" required name="description" placeholder="e.g. Taxi fare for supplier pickup"></div><button class="btn btn-gold">Save Voucher</button></form>`);
}

function erpHr(top) {
  const a = acct();
  const events = a.hrEvents.slice().sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  const roleIdx = r => ROLES.indexOf(r);
  return top + `<div class="panel"><div class="panel-head"><h3>Staff Roles & Actions</h3></div><p class="muted small" style="margin-top:0">Promote, demote or suspend staff members. Every action is logged below.</p>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Current Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>${staffAll().filter(s => !s.protected).map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.role)}</td><td>${s.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="erp-hr:promote:${s.id}">▲ Promote</button><button class="btn btn-sm" data-action="erp-hr:demote:${s.id}">▼ Demote</button><button class="btn btn-sm" data-action="erp-hr:${s.status === 'active' ? 'suspend' : 'activate'}:${s.id}">${s.status === 'active' ? 'Suspend' : 'Reactivate'}</button></div></td></tr>`).join('') || '<tr><td colspan="4" class="muted">Only the owner account exists.</td></tr>'}</tbody></table></div></div>
  <div class="panel"><div class="panel-head"><h3>HR Event Log</h3></div>${events.map(e => `<div class="data-line"><span class="muted">${esc(e.date)} · ${esc(e.staffName)}</span><b>${e.type === 'promotion' ? '▲ Promoted' : e.type === 'demotion' ? '▼ Demoted' : '⏻ ' + e.type}${e.fromRole || e.toRole ? ' · ' + esc(e.fromRole || '') + ' → ' + esc(e.toRole || '') : ''}</b></div>`).join('') || '<p class="muted">No HR events yet.</p>'}</div>`;
}

function erpAssistant(top) {
  return top + `<div class="panel" style="max-width:720px"><div class="panel-head"><h3>Assistant</h3></div><p class="muted small" style="margin-top:0">Ask about revenue, expenses, bookings, approvals, top barbers, petty cash or staff.</p>
  <div id="ai-log" style="display:grid;gap:10px;margin:14px 0;max-height:340px;overflow:auto">${aiLog.map(m => `<div class="data-line"><span class="muted">You: ${esc(m.q)}</span><b style="font-weight:500">${esc(m.a)}</b></div>`).join('') || '<p class="muted">No questions yet.</p>'}</div>
  <form id="ai-form" style="display:flex;gap:8px"><input class="field" name="q" placeholder="e.g. What was revenue this month?" required><button class="btn btn-gold">Ask</button></form></div>`;
}

function aiAnswer(q) {
  const s = q.toLowerCase(), a = acct();
  const mkey = new Date().toISOString().slice(0, 7);
  const mTx = a.transactions.filter(t => (t.date || '').startsWith(mkey));
  if (/revenue|income|sales|earn|money in/.test(s)) return 'This month: income ' + money(incTotal(mTx.filter(t => t.type === 'income'))) + ', expenses ' + money(incTotal(mTx.filter(t => t.type === 'expense'))) + ', net ' + money(incTotal(mTx.filter(t => t.type === 'income')) - incTotal(mTx.filter(t => t.type === 'expense'))) + '.';
  if (/expense|spent|cost|money out/.test(s)) return 'Expenses this month total ' + money(expTotal(mTx.filter(t => t.type === 'expense'))) + ' across ' + mTx.filter(t => t.type === 'expense').length + ' transactions.';
  if (/profit|net|bottom line/.test(s)) return 'Net profit this month is ' + money(incTotal(mTx.filter(t => t.type === 'income')) - incTotal(mTx.filter(t => t.type === 'expense'))) + '.';
  if (/booking|appointment|reservation/.test(s)) { const n = db.bookings.filter(b => (b.date || '').startsWith(mkey)).length; return 'There are ' + n + ' bookings dated this month (' + db.bookings.filter(b => b.status === 'Pending').length + ' still pending approval overall).'; }
  if (/pending|approval|approve/.test(s)) return db.bookings.filter(b => b.status === 'Pending').length + ' bookings are waiting for approval.';
  if (/barber|top|best|perform/.test(s)) { const c = {}; db.bookings.forEach(b => { if (b.status !== 'Cancelled' && b.status !== 'Declined') c[b.barber] = (c[b.barber] || 0) + 1; }); const top = Object.entries(c).sort((x, y) => y[1] - x[1])[0]; return top ? esc(barber(top[0]).name) + ' leads with ' + top[1] + ' bookings.' : 'No booking data yet.'; }
  if (/petty|float|cash/.test(s)) return 'Petty cash balance is ' + money0(pettyBalance()) + ' (float ' + money0(a.pettyFloat || 0) + ').';
  if (/staff|team|admin|employee/.test(s)) return staffAll().length + ' staff accounts: ' + staffAll().map(s => s.name + ' (' + s.role + ')').join(', ') + '.';
  if (/opening|balance/.test(s)) return 'Opening balance is set to ' + money0(a.openingBalance) + '.';
  if (/hi|hello|help/.test(s)) return 'Hi! I can report on revenue, expenses, profit, bookings, pending approvals, top barbers, petty cash, staff and opening balance. What would you like to know?';
  return 'I can help with revenue, expenses, bookings, approvals, top barbers, petty cash, staff and balances. Try asking "what is net profit this month?"';
}

// =====================================================================
//  IMPORT / EXPORT
// =====================================================================
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); }); }
async function loadXLSX() { if (!window.XLSX) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); }
async function loadPDF() { if (!(window.jspdf && window.jspdf.jsPDF)) { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'); } }

const IO = {
  bookings: { title: 'Bookings', headers: ['Date', 'Time', 'Client', 'Phone', 'Email', 'Service', 'Barber', 'Branch', 'Status', 'Source'], rows: () => db.bookings.map(b => [b.date, b.time, b.name, b.phone, b.email || '', service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status, b.source || '']), imp: true },
  branches: { title: 'Branches', headers: ['Name', 'Place', 'Hours', 'Photo'], rows: () => db.branches.map(b => [b.name, b.place, b.hours || '', b.photo || '']), imp: true },
  barbers: { title: 'Barbers', headers: ['Name', 'Role', 'Branch', 'Services', 'Photo'], rows: () => db.barbers.map(b => [b.name, b.role, branch(b.branch).name, b.services.map(s => service(s).name).join('; '), b.photo || '']), imp: true },
  services: { title: 'Services', headers: ['Name', 'Description', 'Price', 'Duration', 'Icon', 'Branches'], rows: () => db.services.map(s => [s.name, s.desc || '', s.price, s.duration, s.icon, s.branches.map(b => branch(b).name).join('; ')]), imp: true },
  clients: { title: 'Client Profiles', headers: ['Name', 'Phone', 'Email', 'Status', 'Notes'], rows: () => clientProfiles().map(c => [c.name, c.phone || '', c.email || '', c.status, c.note || '']), imp: true },
  customers: { title: 'Customers', headers: ['Name', 'Phone', 'Email', 'Bookings', 'Last Visit', 'Total Spend'], rows: () => { const m = {}; db.bookings.forEach(b => { const k = b.phone || b.email || b.name; (m[k] = m[k] || { n: b.name, p: b.phone, e: b.email, c: 0, l: '', s: 0 }).c++; if ((b.date || '') > m[k].l) m[k].l = b.date; if (b.status !== 'Cancelled' && b.status !== 'Declined') m[k].s += Number(service(b.service).price || 0); }); return Object.values(m).map(c => [c.n, c.p || '', c.e || '', c.c, c.l, c.s.toFixed(2)]); }, imp: false },
  staff: { title: 'Staff', headers: ['Username', 'Name', 'Email', 'Role', 'Salary', 'Status'], rows: () => staffAll().map(s => [s.username, s.name, s.email, s.role, s.salary || 0, s.status]), imp: true },
  transactions: { title: 'Transactions', headers: ['Date', 'Type', 'Category', 'Amount', 'Description', 'Branch'], rows: () => txList().map(t => [t.date, t.type, t.category, t.amount, t.description || '', branch(t.branch).name]), imp: true },
  payroll: { title: 'Payroll', headers: ['Payslip', 'Staff', 'Role', 'Month', 'Gross', 'Deductions', 'Net', 'Status'], rows: () => acct().payroll.map(p => [p.id, p.name, p.role, p.month, p.gross, p.deductions || 0, p.net, p.status]), imp: true },
  petty: { title: 'Petty Cash', headers: ['Date', 'Voucher', 'Description', 'Received By', 'Amount'], rows: () => acct().pettyCash.map(p => [p.date, p.id, p.description, p.receivedBy || '', p.amount]), imp: true },
  calendar: { title: 'Calendar Bookings', headers: ['Date', 'Time', 'Client', 'Service', 'Barber', 'Branch', 'Status'], rows: () => { const base = new Date(); base.setMonth(base.getMonth() + admCalOff); const y = base.getFullYear(), m = base.getMonth(); const p = n => String(n).padStart(2, '0'); const pref = y + '-' + p(m + 1); return db.bookings.filter(b => (b.date || '').startsWith(pref)).map(b => [b.date, b.time, b.name, service(b.service).name, barber(b.barber).name, branch(b.branch).name, b.status]); }, imp: false },
  reports: { title: 'Reports Summary', headers: ['Metric', 'Value'], rows: () => [['Total bookings', db.bookings.length], ['Revenue (confirmed+completed)', db.bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0).toFixed(2)], ['Pending', db.bookings.filter(b => b.status === 'Pending').length], ['Income (ERP)', incTotal().toFixed(2)], ['Expenses (ERP)', expTotal().toFixed(2)], ['Net profit', (incTotal() - expTotal()).toFixed(2)]], imp: false }
};

function ioButtons(entity, canImport) { const d = IO[entity]; if (!d || !ioAllowed(entity, 'exp')) return ''; return `<span class="io-bar">${button('CSV', 'io-exp:' + entity + ':csv', 'btn btn-sm')}${button('Excel', 'io-exp:' + entity + ':xlsx', 'btn btn-sm')}${button('PDF', 'io-exp:' + entity + ':pdf', 'btn btn-sm')}${canImport && d.imp && ioAllowed(entity, 'imp') ? button('Import', 'io-imp:' + entity, 'btn btn-sm') : ''}</span>`; }

function csvEscape(v) { return '"' + String(v ?? '').replace(/"/g, '""') + '"'; }
async function doExport(entity, fmt) {
  const d = IO[entity]; if (!d) return;
  const rows = [d.headers, ...d.rows()];
  if (fmt === 'csv') { admDownload(d.title + '.csv', rows.map(r => r.map(csvEscape).join(',')).join('\n'), 'text/csv'); toast('CSV exported.'); return; }
  if (fmt === 'xlsx') { await loadXLSX(); const ws = XLSX.utils.aoa_to_sheet(rows); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, d.title.slice(0, 31)); XLSX.writeFile(wb, d.title + '.xlsx'); toast('Excel exported.'); return; }
  if (fmt === 'pdf') { await loadPDF(); const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFontSize(14); doc.text("The Gent's — " + d.title, 14, 15); doc.setFontSize(9); doc.text('Generated ' + new Date().toLocaleString('en-ZW'), 14, 21); doc.autoTable({ head: [d.headers], body: rows.slice(1), startY: 26, styles: { fontSize: 8 }, headStyles: { fillColor: [60, 45, 20] } }); doc.save(d.title + '.pdf'); toast('PDF exported.'); }
}

const normH = h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const findCol = (hdrs, names) => { for (const n of names) { const i = hdrs.findIndex(h => normH(h) === normH(n)); if (i > -1) return i; } return -1; };

async function doImport(entity) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.csv,.xlsx,.xls';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      await loadXLSX();
      let wb;
      if (/\.csv$/i.test(f.name)) wb = XLSX.read(await f.text(), { type: 'string' });
      else wb = XLSX.read(await f.arrayBuffer());
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      if (rows.length < 2) return toast('File is empty.');
      const hdrs = rows[0].map(String);
      const data = rows.slice(1).filter(r => r.some(c => String(c).trim() !== ''));
      const n = importRows(entity, hdrs, data);
      toast(n + ' row(s) imported into ' + entity + '.');
      render();
    } catch (err) { toast('Import failed: ' + (err && err.message ? err.message : err)); }
  };
  inp.click();
}

function importRows(entity, hdrs, data) {
  const col = (names) => findCol(hdrs, names);
  let n = 0;
  const nameTo = (arr, nm) => { const t = String(nm || '').toLowerCase().trim(); return arr.find(x => (x.name || '').toLowerCase() === t) || arr.find(x => (x.name || '').toLowerCase().includes(t)) || null; };
  if (entity === 'bookings') {
    const ci = { date: col(['date']), time: col(['time']), name: col(['client', 'name']), phone: col(['phone']), email: col(['email']), service: col(['service']), barber: col(['barber']), branch: col(['branch']), status: col(['status']), source: col(['source']) };
    data.forEach(r => { const sv = nameTo(db.services, r[ci.service]); const br = nameTo(db.branches, r[ci.branch]); const ba = nameTo(db.barbers, r[ci.barber]); if (!sv || !br) return; db.bookings.push({ id: 'GT-' + (1100 + db.bookings.length) + '-' + Date.now().toString().slice(-3), name: String(r[ci.name] || 'Guest'), phone: String(r[ci.phone] || ''), email: String(r[ci.email] || ''), branch: br.id, service: sv.id, barber: ba ? ba.id : null, date: String(r[ci.date] || '').slice(0, 10), time: String(r[ci.time] || '10:00').slice(0, 5), status: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'].includes(r[ci.status]) ? r[ci.status] : 'Pending', source: r[ci.source] === 'Walk-in' ? 'Walk-in' : 'Online', notes: '' }); n++; });
  } else if (entity === 'branches') {
    const ci = { name: col(['name']), place: col(['place', 'address']), hours: col(['hours']), photo: col(['photo']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; db.branches.push({ id: 'br-' + Date.now().toString().slice(-6) + n, name: String(r[ci.name]), place: String(r[ci.place] || ''), hours: String(r[ci.hours] || ''), photo: String(r[ci.photo] || '') || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' }); n++; });
  } else if (entity === 'services') {
    const ci = { name: col(['name']), desc: col(['description', 'desc']), price: col(['price']), duration: col(['duration']), icon: col(['icon']), branches: col(['branches']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; const bnames = String(r[ci.branches] || '').split(/[;,]/).map(x => x.trim().toLowerCase()).filter(Boolean); const bids = db.branches.filter(b => bnames.includes(b.name.toLowerCase())).map(b => b.id); db.services.push({ id: 'srv' + Date.now() + n, name: String(r[ci.name]), desc: String(r[ci.desc] || ''), price: Number(r[ci.price]) || 0, duration: Number(r[ci.duration]) || 30, icon: String(r[ci.icon] || '✂'), branches: bids.length ? bids : db.branches.map(b => b.id) }); n++; });
  } else if (entity === 'barbers') {
    const ci = { name: col(['name']), role: col(['role']), branch: col(['branch']), services: col(['services']), photo: col(['photo']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; const br = nameTo(db.branches, r[ci.branch]); const snames = String(r[ci.services] || '').split(/[;,]/).map(x => x.trim().toLowerCase()).filter(Boolean); const sids = db.services.filter(s => snames.includes(s.name.toLowerCase())).map(s => s.id); db.barbers.push({ id: 'barber' + Date.now() + n, name: String(r[ci.name]), role: String(r[ci.role] || 'Barber'), branch: br ? br.id : (db.branches[0] ? db.branches[0].id : ''), photo: String(r[ci.photo] || '') || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', services: sids.length ? sids : db.services.map(s => s.id) }); n++; });
  } else if (entity === 'clients') {
    const ci = { name: col(['name']), phone: col(['phone']), email: col(['email']), status: col(['status']), note: col(['notes', 'note']) };
    data.forEach(r => { if (!String(r[ci.name] || '').trim()) return; clientProfiles().push({ id: 'cli' + Date.now() + n, name: String(r[ci.name]), phone: String(r[ci.phone] || ''), email: String(r[ci.email] || ''), status: String(r[ci.status] || 'active') === 'suspended' ? 'suspended' : 'active', note: String(r[ci.note] || ''), createdAt: new Date().toISOString().slice(0, 10) }); n++; });
  } else if (entity === 'staff') {
    const ci = { username: col(['username']), name: col(['name']), email: col(['email']), role: col(['role']), salary: col(['salary']), status: col(['status']) };
    data.forEach(r => { const em = String(r[ci.email] || '').toLowerCase(); if (!String(r[ci.name] || '').trim() || staffAll().some(s => s.email.toLowerCase() === em)) return; staffAll().push({ id: 'staff' + Date.now() + n, username: String(r[ci.username] || String(r[ci.name]).toLowerCase().replace(/\s+/g, '.')), name: String(r[ci.name]), email: em, password: '', role: ROLES.includes(r[ci.role]) ? r[ci.role] : 'Receptionist', permissions: [], protected: false, status: String(r[ci.status] || 'active') === 'suspended' ? 'suspended' : 'active', salary: Number(r[ci.salary]) || 0, createdAt: new Date().toISOString().slice(0, 10) }); n++; });
  } else if (entity === 'transactions') {
    const ci = { date: col(['date']), type: col(['type']), category: col(['category']), amount: col(['amount']), desc: col(['description']), branch: col(['branch']) };
    data.forEach(r => { const type = String(r[ci.type] || '').toLowerCase() === 'income' ? 'income' : 'expense'; if (!(Number(r[ci.amount]) > 0)) return; const br = nameTo(db.branches, r[ci.branch]); acct().transactions.push({ id: 'TX-' + Date.now().toString().slice(-6) + n, type, category: String(r[ci.category] || (type === 'income' ? 'Other Income' : 'Other Expense')), amount: Number(r[ci.amount]), date: String(r[ci.date] || '').slice(0, 10), description: String(r[ci.desc] || ''), branch: br ? br.id : '' }); n++; });
  } else if (entity === 'payroll') {
    const ci = { id: col(['payslip', 'id']), name: col(['staff', 'name']), role: col(['role']), month: col(['month']), gross: col(['gross']), deductions: col(['deductions']), net: col(['net']), status: col(['status']) };
    data.forEach(r => { const nm = String(r[ci.name] || ''); if (!nm.trim()) return; const s = staffAll().find(x => x.name.toLowerCase() === nm.toLowerCase()); acct().payroll.push({ id: String(r[ci.id] || '') || 'PAY-IMP-' + Date.now() + n, staffId: s ? s.id : '', name: nm, role: String(r[ci.role] || ''), month: String(r[ci.month] || '').slice(0, 7), gross: Number(r[ci.gross]) || 0, deductions: Number(r[ci.deductions]) || 0, net: Number(r[ci.net]) || 0, status: String(r[ci.status] || 'pending') === 'paid' ? 'paid' : 'pending' }); n++; });
  } else if (entity === 'petty') {
    const ci = { date: col(['date']), id: col(['voucher', 'id']), desc: col(['description']), by: col(['received by', 'receivedby']), amount: col(['amount']) };
    data.forEach(r => { if (!(Number(r[ci.amount]) > 0)) return; acct().pettyCash.push({ id: String(r[ci.id] || '') || 'PC-' + Date.now().toString().slice(-6) + n, date: String(r[ci.date] || '').slice(0, 10), description: String(r[ci.desc] || ''), receivedBy: String(r[ci.by] || ''), amount: Number(r[ci.amount]) }); n++; });
  }
  return n;
}

// =====================================================================
//  EVENTS
// =====================================================================
// Group "all" checkbox toggles every permission in its group
document.addEventListener('change', e => {
  if (e.target.classList && e.target.classList.contains('perm-all')) {
    const g = e.target.closest('[data-pgroup]');
    if (g) g.querySelectorAll('input[name="perm"]').forEach(c => c.checked = e.target.checked);
  }
});

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, parts = a.split(':'), c = parts[0];
  if (!['erp-', 'usr-', 'stf-', 'io-', 'role-'].some(p => c.startsWith(p))) return;
  e.stopImmediatePropagation();
  const v = parts.slice(1).join(':');

  // --- roles ---
  if (c === 'role-add') { if (!hasPerm('staffmgmt.manage')) return toast('No permission.'); return roleForm(); }
  if (c === 'role-edit') { if (!hasPerm('staffmgmt.manage')) return toast('No permission.'); return roleForm(v); }
  if (c === 'role-del') {
    if (!hasPerm('staffmgmt.manage')) return toast('No permission.');
    const r = (db.roles || []).find(x => x.id === v); if (!r) return;
    if (staffAll().some(s => s.roleId === v)) return toast('Role is assigned to staff — reassign them first.');
    if (!confirm('Delete role "' + r.name + '"?')) return;
    db.roles = (db.roles || []).filter(x => x.id !== v); save(); toast('Role deleted.'); render(); return;
  }

  // --- tab switching ---
  if (c === 'erp-tab') { if (!erpTabAllowed(v)) return toast('No permission for that section.'); erpTab = v; return render(); }
  if (c === 'erp-cat') { admTxCat = v; return render(); }

  // --- user management ---
  if (c === 'usr-add') { if (!hasPerm('usermgmt.manage')) return toast('No permission.'); return usrForm(); }
  if (c === 'usr-edit') { if (!hasPerm('usermgmt.manage')) return toast('No permission.'); return usrForm(v); }
  if (c === 'usr-del') { if (!hasPerm('usermgmt.manage')) return toast('No permission.'); const x = clientProfiles().find(c => c.id === v); if (!x) return; if (!confirm('Delete client profile "' + x.name + '"?')) return; db.clientProfiles = clientProfiles().filter(c => c.id !== v); save(); toast('Client deleted.'); render(); return; }

  // --- staff management ---
  if (c === 'stf-add') { if (!hasPerm('staffmgmt.manage')) return toast('No permission.'); return stfForm(); }
  if (c === 'stf-edit') { if (!hasPerm('staffmgmt.manage') && v !== (admMe() || {}).id) return toast('No permission.'); return stfForm(v); }
  if (c === 'stf-perms') { if (!hasPerm('staffmgmt.manage')) return toast('No permission.'); return stfPerms(v); }
  if (c === 'stf-del') { if (!hasPerm('staffmgmt.manage')) return toast('No permission.'); const x = staffAll().find(s => s.id === v); if (!x) return; if (x.protected) return toast('This account cannot be deleted.'); if (!confirm('Permanently delete ' + x.name + '?')) return; db.staff = staffAll().filter(s => s.id !== v); save(); toast('Staff removed.'); render(); return; }

  // --- erp ---
  if (c === 'erp-addtx') { if (!erpCan('transactions')) return toast('No permission.'); return txForm(v); }
  if (c === 'erp-payroll-run') { if (!erpCan('payroll')) return toast('No permission.'); return runPayroll(); }
  if (c === 'erp-payslip') { if (!erpCan('payroll')) return toast('No permission.'); return payslip(v); }
  if (c === 'erp-payslip-pdf') { const p = acct().payroll.find(x => x.id === v); if (p) payslipPDF(p); return; }
  if (c === 'erp-pay-paid') { if (!erpCan('payroll')) return toast('No permission.'); const p = acct().payroll.find(x => x.id === v); if (p) { p.status = 'paid'; save(); toast('Payslip marked paid.'); closeModal(); render(); } return; }
  if (c === 'erp-petty-add') { if (!erpCan('petty')) return toast('No permission.'); return pettyForm(); }
  if (c === 'erp-float') { if (!erpCan('petty')) return toast('No permission.'); const f = prompt('Set petty cash float amount (USD):', acct().pettyFloat || 0); if (f === null) return; acct().pettyFloat = Number(f) || 0; save(); toast('Float updated.'); render(); return; }
  if (c.startsWith('erp-hr:')) {
    if (!erpCan('hr')) return toast('No permission.');
    const [, act, sid] = a.split(':'); const s = staffAll().find(x => x.id === sid); if (!s || s.protected) return;
    const today = new Date().toISOString().slice(0, 10);
    if (act === 'promote' || act === 'demote') {
      const i = ROLES.indexOf(s.role); const ni = act === 'promote' ? Math.min(ROLES.length - 1, i + 1) : Math.max(0, i - 1);
      if (ni === i) return toast(s.role + ' is already ' + (act === 'promote' ? 'the highest' : 'the lowest') + ' role.');
      acct().hrEvents.unshift({ id: 'HR-' + Date.now(), staffId: s.id, staffName: s.name, type: act === 'promote' ? 'promotion' : 'demotion', fromRole: s.role, toRole: ROLES[ni], date: today });
      s.role = ROLES[ni]; save(); toast(s.name + ' ' + (act === 'promote' ? 'promoted' : 'demoted') + ' to ' + s.role + '.'); render(); return;
    }
    if (act === 'suspend' || act === 'activate') { s.status = act === 'suspend' ? 'suspended' : 'active'; acct().hrEvents.unshift({ id: 'HR-' + Date.now(), staffId: s.id, staffName: s.name, type: act === 'suspend' ? 'expulsion' : 'activation', date: today }); save(); toast(s.name + (act === 'suspend' ? ' suspended.' : ' reactivated.')); render(); return; }
  }

  // --- import / export ---
  if (c === 'io-exp') { const [, ent, fmt] = a.split(':'); if (!ioAllowed(ent, 'exp')) return toast('No permission.'); doExport(ent, fmt); return; }
  if (c === 'io-imp') { const ent = v; if (!ioAllowed(ent, 'imp')) return toast('No permission.'); doImport(ent); return; }
});

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'usr-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (v.id) { const x = clientProfiles().find(c => c.id === v.id); if (x) Object.assign(x, { name: v.name, phone: v.phone, email: v.email, status: v.status, note: v.note }); toast('Client updated.'); }
    else { clientProfiles().push({ id: 'cli' + Date.now(), name: v.name, phone: v.phone, email: v.email, status: v.status, note: v.note, createdAt: new Date().toISOString().slice(0, 10) }); toast('Client added.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'stf-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const isAdmin = v.access === 'admin';
    const roleId = isAdmin ? '' : (v.roleId || '');
    const roleName = roleId ? ((db.roles || []).find(r => r.id === roleId) || {}).name || '' : '';
    let sid = v.id;
    if (v.id) { const x = staffAll().find(s => s.id === v.id); if (x) { Object.assign(x, { name: v.name, username: v.username, email: v.email.toLowerCase(), role: isAdmin ? 'Administrator' : (v.role || roleName), roleId, permissions: isAdmin ? '*' : (x.permissions === '*' ? [] : x.permissions), status: v.status }); } toast('Staff updated.'); }
    else { const rec = { id: 'staff' + Date.now(), username: v.username, name: v.name, email: v.email.toLowerCase(), role: isAdmin ? 'Administrator' : (v.role || roleName), roleId, permissions: isAdmin ? '*' : [], protected: false, status: v.status, createdAt: new Date().toISOString().slice(0, 10) }; staffAll().push(rec); sid = rec.id; toast(isAdmin ? 'Administrator added.' : 'Staff added — assign permissions from the Perms button.'); }
    if (v.password) fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'staff-credential', staffKey: sid, email: v.email, password: v.password }), credentials: 'same-origin' }).catch(() => {});
    save(); closeModal(); render(); return;
  }
  if (form.id === 'role-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form)); const fd = new FormData(form);
    const perms = fd.getAll('perm');
    if (v.id) { const r = (db.roles || []).find(x => x.id === v.id); if (r) { r.name = v.name; r.perms = perms; } toast('Role updated.'); }
    else { if (!(db.roles || []).some(r => r.name.toLowerCase() === v.name.toLowerCase())) (db.roles = db.roles || []).push({ id: 'rol' + Date.now(), name: v.name, perms, createdAt: new Date().toISOString().slice(0, 10) }); else return toast('A role with that name exists.'); toast('Role created.'); }
    save(); closeModal(); render(); return;
  }
  if (form.id === 'stf-perms-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form)); const fd = new FormData(form);
    const s = staffAll().find(x => x.id === v.id); if (!s || s.protected) return;
    s.permissions = fd.getAll('perm'); save(); toast('Permissions saved for ' + s.name + '.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-tx-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().transactions.push({ id: 'TX-' + Date.now().toString().slice(-6), type: v.type, category: v.category, amount: Number(v.amount) || 0, date: v.date, description: v.description || '', branch: v.branch || '' });
    db.notifications.unshift((v.type === 'income' ? 'Income' : 'Expense') + ' recorded: ' + money(v.amount) + ' — ' + (v.description || v.category));
    save(); toast(v.type === 'income' ? 'Income recorded.' : 'Expense recorded.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-petty-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().pettyCash.push({ id: 'PC-' + Date.now().toString().slice(-6), date: v.date, description: v.description, receivedBy: v.receivedBy || '', amount: Number(v.amount) || 0 });
    save(); toast('Petty cash voucher saved.'); closeModal(); render(); return;
  }
  if (form.id === 'erp-opening') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    acct().openingBalance = Number(v.opening) || 0; save(); toast('Opening balance updated.'); render(); return;
  }
  if (form.id === 'ai-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form)); const q = (v.q || '').trim(); if (!q) return;
    aiLog.push({ q, a: aiAnswer(q) }); save(); render();
    const log = document.getElementById('ai-log'); if (log) log.scrollTop = log.scrollHeight;
    return;
  }
});

// ---------- Payslip PDF ----------
async function payslipPDF(p) {
  await loadPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16); doc.text("The Gent's Barber & Gents Grooming Center", 14, 18);
  doc.setFontSize(11); doc.text('PAYSLIP — ' + p.month, 14, 26);
  doc.setFontSize(10);
  doc.text('Employee: ' + p.name + '  |  Role: ' + p.role + '  |  ID: ' + p.staffId, 14, 34);
  doc.text('Status: ' + p.status.toUpperCase(), 14, 40);
  doc.autoTable({
    startY: 48,
    head: [['Earnings', 'Amount (USD)'], ['Deductions', 'Amount (USD)']],
    body: [['Basic Salary', p.gross.toFixed(2)], ['Statutory / Other', (p.deductions || 0).toFixed(2)]],
    styles: { fontSize: 10 }, headStyles: { fillColor: [60, 45, 20] }
  });
  doc.setFontSize(12); doc.text('NET PAY: $' + Number(p.net).toFixed(2), 14, doc.lastAutoTable.finalY + 12);
  doc.setFontSize(8); doc.text('Generated ' + new Date().toLocaleString('en-ZW') + ' — system-generated document', 14, doc.lastAutoTable.finalY + 20);
  doc.save('Payslip-' + p.id + '.pdf');
  toast('Payslip PDF downloaded.');
}

// ===== The Gent's — Content & Media =====
// Injected inside app.js IIFE by _build.js. Adds the admin "Content & Media"
// tab: hero banner slides and gallery images, stored in db.hero / db.gallery
// and persisted through api/db.php like everything else.

// ---------- Shared upload helper ----------
async function ctUploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch('api/upload.php', { method: 'POST', body: fd, credentials: 'same-origin' });
  const j = await r.json().catch(() => null);
  if (!j || !j.ok) throw new Error((j && j.error) || 'Upload failed');
  return j.url;
}

function ctMediaField(label, name, value, placeholder) {
  return `<div class="form-group"><label class="form-label">${label}</label>
    <input class="field" name="${name}" value="${esc(value || '')}" placeholder="${placeholder || 'https://… or /uploads/…'}">
    <div class="ct-upload-row"><input type="file" id="ct-file-${name}" accept="image/*" data-target="${name}"><button type="button" class="btn btn-sm" data-action="ct-pick:${name}">Choose file</button><span class="small muted" id="ct-upstatus-${name}"></span></div>
    <div class="ct-preview" id="ct-preview-${name}">${value ? `<img src="${esc(value)}" alt="">` : ''}</div></div>`;
}

// ---------- Tab renderer (called by adminBody) ----------
function admContent(top) {
  return top + heroPanel() + galleryPanel();
}

// ---------- Hero banners ----------
function heroPanel() {
  const slides = db.hero && db.hero.length ? db.hero : HE;
  return `<div class="panel"><div class="panel-head"><h3>Hero Banners (${slides.length})</h3><div class="auth-actions">${hasPerm('content.manage') ? button('+ Add Slide', 'ct-hero-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <p class="muted small" style="margin-top:0">Slides appear in order on the homepage hero. The first slide shows on load.</p>
  <div class="ct-hero-list">${slides.map((s, i) => `<div class="ct-hero-item">
    <div class="ct-hero-img" style="background-image:url('${esc(s.photo || '')}')"></div>
    <div class="ct-hero-info"><strong>${esc(s.title || '(untitled)')}</strong><small class="muted">${esc(s.desc || '')}</small><small class="muted">Slide ${i + 1}</small></div>
    ${hasPerm('content.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="ct-hero-up:${i}" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn btn-sm" data-action="ct-hero-down:${i}" ${i === slides.length - 1 ? 'disabled' : ''}>↓</button><button class="btn btn-sm" data-action="ct-hero-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-hero-del:${i}">Del</button></div>` : ''}
  </div>`).join('')}</div></div>`;
}

function ctHeroForm(i) {
  const s = i >= 0 ? (db.hero || [])[i] : null;
  if (i >= 0 && !s) return;
  modal(i >= 0 ? 'Edit Hero Slide' : 'Add Hero Slide', `<form id="ct-hero-form"><input type="hidden" name="idx" value="${i}">
  <div class="form-group"><label class="form-label">Title</label><input class="field" required name="title" value="${esc(s ? s.title : '')}" placeholder="e.g. Made for the Modern Gent."></div>
  <div class="form-group"><label class="form-label">Subtitle / description</label><input class="field" name="desc" value="${esc(s ? s.desc : '')}"></div>
  ${ctMediaField('Banner image', 'photo', s ? s.photo : '', 'https://… or /uploads/…')}
  <button class="btn btn-gold">${i >= 0 ? 'Save Changes' : 'Add Slide'}</button></form>`);
}

// ---------- Gallery ----------
function galleryPanel() {
  const items = db.gallery && db.gallery.length ? db.gallery : GE;
  const cats = [...new Set(items.map(x => x.category).filter(Boolean))];
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Gallery (${items.length})</h3><div class="auth-actions">${hasPerm('content.manage') ? button('+ Add Image', 'ct-gal-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <p class="muted small" style="margin-top:0">Categories: ${cats.map(c => `<span class="badge status confirmed" style="margin-right:4px">${esc(c)}</span>`).join('') || '—'}</p>
  <div class="ct-gal-grid">${items.map((g, i) => `<div class="ct-gal-item">
    <img src="${esc(g.url)}" alt="${esc(g.alt || '')}" loading="lazy">
    <div class="ct-gal-info"><strong>${esc(g.alt || '(no caption)')}</strong><small class="muted">${esc(g.category || 'Uncategorised')}</small></div>
    ${hasPerm('content.manage') ? `<div class="row-actions"><button class="btn btn-sm" data-action="ct-gal-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-gal-del:${i}">Delete</button></div>` : ''}
  </div>`).join('')}</div></div>`;
}

function ctGalleryForm(i) {
  const g = i >= 0 ? (db.gallery || [])[i] : null;
  if (i >= 0 && !g) return;
  const cats = [...new Set(((db.gallery && db.gallery.length ? db.gallery : GE).map(x => x.category).filter(Boolean)))];
  modal(i >= 0 ? 'Edit Gallery Image' : 'Add Gallery Image', `<form id="ct-gal-form"><input type="hidden" name="idx" value="${i}">
  ${ctMediaField('Image', 'url', g ? g.url : '', 'https://… or /uploads/…')}
  <div class="form-group"><label class="form-label">Caption / alt text</label><input class="field" name="alt" value="${esc(g ? g.alt : '')}" placeholder="e.g. Barbershop interior"></div>
  <div class="form-group"><label class="form-label">Category</label><input class="field" name="category" list="ct-cats" value="${esc(g ? g.category : 'Grooming Center')}" placeholder="Grooming Center"><datalist id="ct-cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist></div>
  <button class="btn btn-gold">${i >= 0 ? 'Save Changes' : 'Add Image'}</button></form>`);
}

// Where an image URL is also used (for delete warnings)
function ctInUse(url) {
  const uses = [];
  (db.barbers || []).forEach(b => { if (b.photo === url) uses.push('barber photo: ' + b.name); });
  (db.branches || []).forEach(b => { if (b.photo === url) uses.push('branch photo: ' + b.name); });
  (db.services || []).forEach(s => { if (s.image === url) uses.push('service image: ' + s.name); });
  (db.hero || []).forEach((s, i) => { if (s.photo === url) uses.push('hero slide ' + (i + 1)); });
  return uses;
}

// ---------- Events ----------
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c.startsWith('ct-') && !hasPerm('content.manage')) return toast('No permission.');
  if (c === 'ct-pick') {
    e.preventDefault();
    const inp = document.getElementById('ct-file-' + v);
    if (inp) inp.click();
    return;
  }
  if (c === 'ct-hero-add') return ctHeroForm(-1);
  if (c === 'ct-hero-edit') return ctHeroForm(Number(v));
  if (c === 'ct-hero-del') {
    const s = (db.hero || [])[Number(v)]; if (!s) return;
    if (!confirm('Delete this hero slide?')) return;
    db.hero.splice(Number(v), 1); if (!db.hero.length) db.hero = HE.map(x => ({ ...x }));
    save(); toast('Slide deleted.'); render(); return;
  }
  if (c === 'ct-hero-up' || c === 'ct-hero-down') {
    const i = Number(v), d = c === 'ct-hero-up' ? -1 : 1, j = i + d;
    if (!db.hero || j < 0 || j >= db.hero.length) return;
    [db.hero[i], db.hero[j]] = [db.hero[j], db.hero[i]];
    save(); render(); return;
  }
  if (c === 'ct-gal-add') return ctGalleryForm(-1);
  if (c === 'ct-gal-edit') return ctGalleryForm(Number(v));
  if (c === 'ct-gal-del') {
    const g = (db.gallery || [])[Number(v)]; if (!g) return;
    const uses = ctInUse(g.url);
    if (uses.length && !confirm('This image is also used as ' + uses.join(', ') + '. Delete from gallery anyway?')) return;
    if (!confirm('Delete this gallery image?')) return;
    db.gallery.splice(Number(v), 1); if (!db.gallery.length) db.gallery = GE.map(x => ({ ...x }));
    save(); toast('Image deleted.'); render(); return;
  }
});

// File chosen → upload → fill the URL field + preview
document.addEventListener('change', async e => {
  const inp = e.target;
  if (!inp.id || !inp.id.startsWith('ct-file-') || !inp.files || !inp.files[0]) return;
  const name = inp.dataset.target || inp.id.slice(8);
  const status = document.getElementById('ct-upstatus-' + name);
  const urlInput = document.querySelector(`[name="${name}"]`);
  const preview = document.getElementById('ct-preview-' + name);
  try {
    if (status) status.textContent = 'Uploading…';
    const url = await ctUploadFile(inp.files[0]);
    if (urlInput) urlInput.value = url;
    if (preview) preview.innerHTML = `<img src="${esc(url)}" alt="">`;
    if (status) status.textContent = 'Uploaded ✓';
    toast('Image uploaded.');
  } catch (err) {
    if (status) status.textContent = err.message || 'Upload failed';
    toast('Upload failed: ' + (err.message || 'server error'));
  }
});

// Live preview while typing/pasting a URL
document.addEventListener('input', e => {
  const inp = e.target;
  if (!inp.name || (inp.name !== 'photo' && inp.name !== 'url' && inp.name !== 'image')) return;
  const preview = document.getElementById('ct-preview-' + inp.name);
  if (preview) preview.innerHTML = inp.value ? `<img src="${esc(inp.value)}" alt="">` : '';
});

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'ct-hero-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const item = { id: 'hero' + Date.now(), title: v.title, desc: v.desc || '', photo: v.photo || '' };
    const i = Number(v.idx);
    if (i >= 0 && db.hero && db.hero[i]) { const old = db.hero[i]; item.id = old.id || item.id; db.hero[i] = item; }
    else { if (!Array.isArray(db.hero)) db.hero = []; db.hero.push(item); }
    save(); closeModal(); toast('Hero slide saved.'); render(); return;
  }
  if (form.id === 'ct-gal-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (!v.url) { toast('Image URL is required.'); return; }
    const item = { id: 'gal' + Date.now(), url: v.url, alt: v.alt || '', category: v.category || 'Grooming Center' };
    const i = Number(v.idx);
    if (i >= 0 && db.gallery && db.gallery[i]) { const old = db.gallery[i]; item.id = old.id || item.id; db.gallery[i] = item; }
    else { if (!Array.isArray(db.gallery)) db.gallery = []; db.gallery.push(item); }
    save(); closeModal(); toast('Gallery image saved.'); render(); return;
  }
});

// ===== The Gent's — Membership & Wallet (admin) =====
// Injected inside app.js IIFE by _build.js. Adds the admin "Membership" tab:
// tier plans, member directory, wallet balances/top-ups, gift cards.

const memTiers = () => (db.membershipTiers && db.membershipTiers.length ? db.membershipTiers : (db.membershipTiers = structuredClone(TIERS)));
const memMembers = () => db.members || (db.members = []);
const memWallets = () => { if (!Array.isArray(db.wallets)) db.wallets = Object.entries(db.wallets || {}).map(([email, x]) => ({ email, balance: (x && x.balance) || 0 })); return db.wallets; };
const memGiftCards = () => db.giftCards || (db.giftCards = []);
const memTxns = () => db.walletTxns || (db.walletTxns = []);
const tierOf = id => memTiers().find(t => t.id === id) || { name: id, color: '#9aa3ad' };
const walletOf = email => memWallets().find(w => String(w.email || '').toLowerCase() === String(email || '').toLowerCase()) || { email: String(email || '').toLowerCase(), balance: 0 };
const walletEnsure = email => { const em = String(email || '').toLowerCase(); let w = memWallets().find(x => String(x.email || '').toLowerCase() === em); if (!w) { w = { email: em, balance: 0 }; memWallets().push(w); } return w; };
const nextMemberNo = () => 'GT-M-' + String(memMembers().length + 1).padStart(4, '0');

function admMembership(top) {
  return top
    + (hasPerm('membership.tiers') ? memTiersPanel() : '')
    + (hasPerm('membership.members') || hasPerm('membership.view') ? memMembersPanel() : '')
    + (hasPerm('membership.wallets') ? memWalletPanel() : '')
    + (hasPerm('membership.giftcards') ? memGiftPanel() : '')
    + (hasPerm('membership.rewards') ? memRewardsPanel() : '');
}

// ---------- Tiers ----------
function memTiersPanel() {
  return `<div class="panel"><div class="panel-head"><h3>Membership Tiers</h3>${button('+ Add Tier', 'adm-tier-add', 'btn btn-gold btn-sm')}</div>
  <p class="muted small" style="margin-top:0">Levels members can hold. Price = monthly fee shown on the card.</p>
  <div class="table-wrap"><table><thead><tr><th>Tier</th><th>Monthly</th><th>Color</th><th>Perks</th><th></th></tr></thead><tbody>
  ${memTiers().map(t => `<tr><td><span class="mem-tier" style="--tc:${esc(t.color || '#9aa3ad')}">${esc(t.name)}</span></td><td>$${Number(t.price || 0).toFixed(2)}</td><td><span class="mem-swatch" style="background:${esc(t.color || '#9aa3ad')}"></span></td><td class="small muted">${esc(t.perks || '')}</td><td><div class="row-actions">${button('Edit', 'adm-tier-edit:' + t.id, 'btn btn-sm')}${button('Delete', 'adm-tier-del:' + t.id, 'btn btn-sm')}</div></td></tr>`).join('')}
  </tbody></table></div></div>`;
}

function admTierForm(id) {
  const t = id ? memTiers().find(x => x.id === id) : null;
  if (id && !t) return;
  modal(id ? 'Edit Tier' : 'Add Tier', `<form id="adm-tier-form"><input type="hidden" name="id" value="${esc(t ? t.id : '')}">
  <div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(t ? t.name : '')}" placeholder="e.g. Gold"></div>
  <div class="form-group"><label class="form-label">Monthly price ($)</label><input class="field" type="number" step="0.01" min="0" required name="price" value="${t ? t.price : ''}"></div>
  <div class="form-group"><label class="form-label">Card color</label><input class="field" type="color" name="color" value="${esc(t ? t.color : '#d4af37')}"></div>
  <div class="form-group"><label class="form-label">Perks (shown on card back)</label><input class="field" name="perks" value="${esc(t ? t.perks : '')}" placeholder="e.g. 10% off retail · priority booking"></div>
  <button class="btn btn-gold">${id ? 'Save Changes' : 'Add Tier'}</button></form>`);
}

// ---------- Members ----------
function memMembersPanel() {
  const canManage = hasPerm('membership.members');
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Members (${memMembers().length})</h3><div class="auth-actions">${canManage ? button('+ Enrol Member', 'adm-mem-add', 'btn btn-gold btn-sm') : ''}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Card</th><th>Member</th><th>Pseudonym</th><th>Tier</th><th>Branch</th><th>Profession</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>
  ${memMembers().map(m => { const t = tierOf(m.tier); return `<tr>
    <td><span class="mem-no">${esc(m.memberNo || '—')}</span></td>
    <td><strong>${esc(m.name || '')}</strong><br><span class="muted small">${esc(m.email || '')}</span></td>
    <td>"${esc(m.pseudo || '')}"</td>
    <td><span class="mem-tier" style="--tc:${esc(t.color || '#9aa3ad')}">${esc(t.name || m.tier)}</span></td>
    <td>${esc(branch(m.branch).name)}</td><td>${esc(m.profession || '—')}</td><td>${esc(m.joined || '—')}</td>
    <td>${badge(m.status === 'suspended' ? 'Cancelled' : 'Confirmed')}</td>
    <td>${canManage ? `<div class="row-actions">${button('Edit', 'adm-mem-edit:' + m.id, 'btn btn-sm')}${button(m.status === 'suspended' ? 'Activate' : 'Suspend', 'adm-mem-status:' + m.id, 'btn btn-sm')}${button('Delete', 'adm-mem-del:' + m.id, 'btn btn-sm')}</div>` : ''}</td></tr>`; }).join('')}
  </tbody></table></div></div>`;
}

function admMemberForm(id) {
  const m = id ? memMembers().find(x => x.id === id) : null;
  if (id && !m) return;
  modal(id ? 'Edit Member' : 'Enrol Member', `<form id="adm-mem-form"><input type="hidden" name="id" value="${esc(m ? m.id : '')}">
  <div class="form-grid">
    <div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(m ? m.name : '')}"></div>
    <div class="form-group"><label class="form-label">Nickname / pseudonym</label><input class="field" name="pseudo" value="${esc(m ? m.pseudo : '')}" placeholder="e.g. TM"></div>
    <div class="form-group"><label class="form-label">Email (links to client account)</label><input class="field" type="email" name="email" value="${esc(m ? m.email : '')}"></div>
    <div class="form-group"><label class="form-label">Profession</label><input class="field" name="profession" value="${esc(m ? m.profession : '')}" placeholder="e.g. Engineer"></div>
    <div class="form-group"><label class="form-label">Home branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}" ${(m ? m.branch : '') === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Membership tier</label><select class="field" name="tier">${memTiers().map(t => `<option value="${t.id}" ${(m ? m.tier : 'basic') === t.id ? 'selected' : ''}>${esc(t.name)} — $${Number(t.price || 0).toFixed(2)}/mo</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Date joined</label><input class="field" type="date" name="joined" value="${esc(m ? m.joined : new Date().toISOString().slice(0, 10))}"></div>
    <div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${(m ? m.status : 'active') === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${(m && m.status) === 'suspended' ? 'selected' : ''}>Suspended</option></select></div>
  </div>
  <button class="btn btn-gold">${id ? 'Save Changes' : 'Enrol Member'}</button></form>`);
}

// ---------- Wallets & top-ups ----------
function memWalletPanel() {
  const pending = memTxns().filter(t => t.status === 'pending');
  const bals = memWallets().filter(w => w.email);
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Wallets & Top-ups</h3></div>
  ${pending.length ? `<h3 style="font-size:16px;margin:0 0 10px">Pending top-up requests (${pending.length})</h3>${pending.map(t => `<div class="appointment"><div><strong>$${Number(t.amount).toFixed(2)} · ${esc(t.email)}</strong><small>${esc(t.created || '').slice(0, 16).replace('T', ' ')}</small></div><div class="row-actions">${button('Approve', 'adm-txn-ok:' + t.id, 'btn btn-sm btn-gold')}${button('Decline', 'adm-txn-no:' + t.id, 'btn btn-sm')}</div></div>`).join('')}` : '<p class="muted small">No pending top-up requests.</p>'}
  <h3 style="font-size:16px;margin:18px 0 10px">Balances (${bals.length})</h3>
  <div class="table-wrap"><table><thead><tr><th>Account</th><th>Balance</th><th>Member</th><th></th></tr></thead><tbody>
  ${bals.map(w => { const email = w.email; const m = memMembers().find(x => (x.email || '').toLowerCase() === email); return `<tr><td>${esc(email)}</td><td><strong>$${Number(w.balance || 0).toFixed(2)}</strong></td><td>${m ? esc(m.name) + ' · ' + esc(tierOf(m.tier).name) : '<span class="muted">—</span>'}</td><td><div class="row-actions">${button('Adjust', 'adm-bal:' + encodeURIComponent(email), 'btn btn-sm')}</div></td></tr>`; }).join('') || '<tr><td colspan="4" class="muted">No wallet balances yet.</td></tr>'}
  </tbody></table></div></div>`;
}

// ---------- Gift cards ----------
function memGiftPanel() {
  const cards = memGiftCards();
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Gift Cards (${cards.length})</h3></div>
  <div class="table-wrap"><table><thead><tr><th>Code</th><th>From → To</th><th>Value</th><th>Remaining</th><th>Uses</th><th>Status</th><th></th></tr></thead><tbody>
  ${cards.slice().reverse().map(g => { const cons = [g.serviceId ? 'Only: ' + esc(service(g.serviceId).name) : '', g.expiresAt ? 'Exp ' + esc(g.expiresAt) : ''].filter(Boolean).join(' · '); const expired = g.expiresAt && g.expiresAt < new Date().toISOString().slice(0, 10); return `<tr>
    <td><code>${esc(g.code)}</code>${cons ? `<br><span class="muted small">${cons}</span>` : ''}</td>
    <td>${esc(g.fromName || g.fromEmail || '')} → ${esc(g.toName || g.toEmail || '—')}</td>
    <td>$${Number(g.amount || 0).toFixed(2)}</td><td><strong>$${Number(g.remaining || 0).toFixed(2)}</strong></td>
    <td>${g.uses || 0}${g.maxUses ? ' / ' + g.maxUses : ' / ∞'}</td>
    <td>${badge(expired ? 'Cancelled' : g.status === 'active' ? 'Confirmed' : g.status === 'depleted' ? 'Completed' : 'Cancelled')}${expired ? '<br><span class="muted small">expired</span>' : ''}</td>
    <td>${g.status === 'active' && !expired ? button('Redeem', 'adm-gc-redeem:' + g.code, 'btn btn-sm') : ''}</td></tr>`; }).join('') || '<tr><td colspan="7" class="muted">No gift cards issued yet.</td></tr>'}
  </tbody></table></div></div>`;
}

function admGcRedeem(code) {
  const g = memGiftCards().find(x => x.code === code);
  if (!g) return;
  if (g.expiresAt && g.expiresAt < new Date().toISOString().slice(0, 10)) return toast('This gift card has expired.');
  const cons = [g.serviceId ? 'Restricted to: ' + service(g.serviceId).name : 'Any service', g.expiresAt ? 'Valid until ' + g.expiresAt : 'No expiry'].join(' · ');
  modal('Redeem ' + esc(g.code), `<p class="muted">Issued by ${esc(g.fromName || g.fromEmail)} to ${esc(g.toName || g.toEmail || 'recipient')}. Remaining: <b>$${Number(g.remaining).toFixed(2)}</b>${g.maxUses ? ' · ' + (g.maxUses - (g.uses || 0)) + ' use(s) left' : ''}.</p><p class="small" style="margin-top:-8px">${esc(cons)}</p>
  <form id="adm-gc-form"><input type="hidden" name="code" value="${esc(g.code)}">
  <div class="form-group"><label class="form-label">Amount to redeem ($)</label><input class="field" type="number" step="0.01" min="0.01" max="${g.remaining}" required name="amount" value="${Number(g.remaining).toFixed(2)}"></div>
  <p class="muted small">The recipient may redeem any service worth up to the remaining balance.</p>
  <button class="btn btn-gold">Apply Redemption</button></form>`);
}

// ---------- Client rewards ----------
const rwTier = pts => pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
function memRewardRows() {
  const cfg = db.rewardConfig || (db.rewardConfig = { perVisit: 100 });
  const emails = new Set();
  memMembers().forEach(m => m.email && emails.add(String(m.email).toLowerCase()));
  memWallets().forEach(w => w.email && emails.add(String(w.email).toLowerCase()));
  (db.bookings || []).forEach(b => b.clientEmail && emails.add(String(b.clientEmail).toLowerCase()));
  return [...emails].map(em => {
    const m = memMembers().find(x => String(x.email || '').toLowerCase() === em);
    const done = (db.bookings || []).filter(b => String(b.clientEmail || '').toLowerCase() === em && b.status === 'Completed').length;
    const base = done * (cfg.perVisit || 100);
    const ov = (db.rewards || {})[em];
    const eff = ov && ov.points != null ? Number(ov.points) : base;
    return { em, name: m ? m.name : em, done, base, eff, ov };
  }).sort((a, b) => b.eff - a.eff);
}
function memRewardsPanel() {
  const cfg = db.rewardConfig || (db.rewardConfig = { perVisit: 100 });
  const rows = memRewardRows();
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Client Rewards</h3><div class="auth-actions">${button('Points per visit: ' + (cfg.perVisit || 100), 'adm-rw-cfg', 'btn btn-sm')}</div></div>
  <p class="muted small" style="margin-top:0">Points are earned automatically per completed visit — override any client below. Admin changes are audit-logged.</p>
  <div class="table-wrap"><table><thead><tr><th>Client</th><th>Completed</th><th>Base</th><th>Points</th><th>Tier</th><th></th></tr></thead><tbody>
  ${rows.map(r => `<tr><td><strong>${esc(r.name)}</strong><br><span class="muted small">${esc(r.em)}</span></td><td>${r.done}</td><td>${r.base}${r.ov && r.ov.points != null ? ' <span class="muted">(auto)</span>' : ''}</td><td><strong style="color:var(--gold)">${r.eff}</strong>${r.ov && r.ov.points != null ? ' <span class="badge status confirmed">adjusted</span>' : ''}</td><td>${rwTier(r.eff)}</td>
  <td><div class="row-actions">${button('+100', 'adm-rw-adj:' + encodeURIComponent(r.em) + ':100', 'btn btn-sm')}${button('−100', 'adm-rw-adj:' + encodeURIComponent(r.em) + ':-100', 'btn btn-sm')}${button('Set', 'adm-rw-set:' + encodeURIComponent(r.em), 'btn btn-sm')}${r.ov && r.ov.points != null ? button('Auto', 'adm-rw-auto:' + encodeURIComponent(r.em), 'btn btn-sm') : ''}</div></td></tr>`).join('') || '<tr><td colspan="6" class="muted">No client reward records yet.</td></tr>'}
  </tbody></table></div></div>`;
}
function rwSet(em, points, reason) {
  if (!db.rewards) db.rewards = {};
  const cur = db.rewards[em] || { points: null, history: [] };
  cur.history = cur.history || [];
  cur.history.push({ points, reason: reason || 'manual', by: (admMe() || {}).name || 'admin', at: new Date().toISOString() });
  if (cur.history.length > 50) cur.history = cur.history.slice(-50);
  cur.points = points; cur.updated = new Date().toISOString();
  db.rewards[em] = cur;
}
function admRwSet(email) {
  const em = decodeURIComponent(email);
  const row = memRewardRows().find(r => r.em === em) || { eff: 0 };
  modal('Set reward points — ' + esc(em), `<p class="muted">Current: <b>${row.eff} pts</b>${row.ov && row.ov.points != null ? ' (admin override)' : ' (auto)'}</p>
  <form id="adm-rw-form"><input type="hidden" name="email" value="${esc(em)}">
  <div class="form-group"><label class="form-label">Points</label><input class="field" type="number" required name="points" value="${row.eff}"></div>
  <div class="form-group"><label class="form-label">Reason (audit log)</label><input class="field" name="reason" placeholder="e.g. Loyalty bonus, complaint compensation"></div>
  <button class="btn btn-gold">Apply</button></form>`);
}

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  const need = c.startsWith('adm-tier') ? 'membership.tiers' : c.startsWith('adm-mem') ? 'membership.members' : (c.startsWith('adm-txn') || c === 'adm-bal') ? 'membership.wallets' : c === 'adm-gc-redeem' ? 'membership.giftcards' : c.startsWith('adm-rw') ? 'membership.rewards' : null;
  if (need && !hasPerm(need)) return toast('No permission.');
  if (c === 'adm-tier-add') return admTierForm(null);
  if (c === 'adm-tier-edit') return admTierForm(v);
  if (c === 'adm-tier-del') { const t = memTiers().find(x => x.id === v); if (!t) return; if (memMembers().some(m => m.tier === v)) return toast('Tier is assigned to members — reassign them first.'); if (!confirm('Delete tier "' + t.name + '"?')) return; db.membershipTiers = memTiers().filter(x => x.id !== v); save(); toast('Tier deleted.'); render(); return; }
  if (c === 'adm-mem-add') return admMemberForm(null);
  if (c === 'adm-mem-edit') return admMemberForm(v);
  if (c === 'adm-mem-del') { const m = memMembers().find(x => x.id === v); if (!m) return; if (!confirm('Delete member ' + m.name + '?')) return; db.members = memMembers().filter(x => x.id !== v); save(); toast('Member removed.'); render(); return; }
  if (c === 'adm-mem-status') { const m = memMembers().find(x => x.id === v); if (!m) return; m.status = m.status === 'suspended' ? 'active' : 'suspended'; save(); toast(m.name + (m.status === 'active' ? ' reactivated.' : ' suspended.')); render(); return; }
  if (c === 'adm-txn-ok') {
    const t = memTxns().find(x => x.id === v); if (!t || t.status !== 'pending') return;
    const w = walletEnsure(t.email);
    w.balance = Number(w.balance || 0) + Number(t.amount);
    memTxns().push({ id: 'AUD-' + Date.now().toString(36).toUpperCase(), email: String(t.email).toLowerCase(), kind: 'topup', amount: Number(t.amount), balanceAfter: w.balance, ref: t.id, by: (admMe() || {}).name || 'admin', status: 'completed', created: new Date().toISOString() });
    t.status = 'approved'; save(); toast('Top-up approved — $' + Number(t.amount).toFixed(2) + ' credited.'); render(); return;
  }
  if (c === 'adm-txn-no') { const t = memTxns().find(x => x.id === v); if (!t) return; t.status = 'declined'; save(); toast('Top-up declined.'); render(); return; }
  if (c === 'adm-bal') { const em = decodeURIComponent(v); admBalForm(em); return; }
  if (c === 'adm-gc-redeem') return admGcRedeem(v);
  if (c === 'adm-rw-cfg') return modal('Reward settings', `<form id="adm-rwc-form"><div class="form-group"><label class="form-label">Points per completed visit</label><input class="field" type="number" min="0" required name="perVisit" value="${(db.rewardConfig || {}).perVisit ?? 100}"></div><button class="btn btn-gold">Save</button></form>`);
  if (c === 'adm-rw-set') return admRwSet(v);
  if (c === 'adm-rw-adj') { const [em, dlt] = v.split(':'); const row = memRewardRows().find(r => r.em === decodeURIComponent(em)); if (!row) return; rwSet(decodeURIComponent(em), Math.max(0, row.eff + Number(dlt)), 'adjust ' + dlt); save(); toast('Points updated.'); render(); return; }
  if (c === 'adm-rw-auto') { const em = decodeURIComponent(v); if (db.rewards && db.rewards[em]) { delete db.rewards[em].points; save(); toast('Reverted to automatic points.'); render(); } return; }
});

function admBalForm(email) {
  const w = walletOf(email);
  modal('Adjust balance — ' + esc(email), `<p class="muted">Current balance: <b>$${Number(w.balance || 0).toFixed(2)}</b></p>
  <form id="adm-bal-form"><input type="hidden" name="email" value="${esc(email)}">
  <div class="form-group"><label class="form-label">Adjustment ($, negative to deduct)</label><input class="field" type="number" step="0.01" required name="delta" placeholder="e.g. 20 or -5"></div>
  <button class="btn btn-gold">Apply</button></form>`);
}

document.addEventListener('submit', e => {
  const form = e.target;
  if (form.id === 'adm-tier-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const data = { name: v.name, price: Number(v.price) || 0, color: v.color || '#d4af37', perks: v.perks || '' };
    const i = memTiers().findIndex(x => x.id === v.id);
    if (i >= 0) Object.assign(memTiers()[i], data); else memTiers().push({ id: 'tier' + Date.now().toString(36), ...data });
    save(); closeModal(); toast('Tier saved.'); render(); return;
  }
  if (form.id === 'adm-mem-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const data = { name: v.name, pseudo: v.pseudo || '', email: (v.email || '').toLowerCase(), profession: v.profession || '', branch: v.branch, tier: v.tier, joined: v.joined || new Date().toISOString().slice(0, 10), status: v.status || 'active' };
    const i = memMembers().findIndex(x => x.id === v.id);
    if (i >= 0) Object.assign(memMembers()[i], data);
    else memMembers().push({ id: 'm' + Date.now().toString(36), memberNo: nextMemberNo(), ...data });
    save(); closeModal(); toast('Member saved.'); render(); return;
  }
  if (form.id === 'adm-gc-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const g = memGiftCards().find(x => x.code === v.code); if (!g) return;
    const amt = Math.min(Number(v.amount), Number(g.remaining));
    if (!(amt > 0)) { toast('Invalid amount.'); return; }
    g.remaining = Number(g.remaining) - amt; g.uses = (g.uses || 0) + 1;
    if (g.remaining <= 0.004 || (g.maxUses && g.uses >= g.maxUses)) g.status = 'depleted';
    save(); closeModal(); toast('Redeemed $' + amt.toFixed(2) + ' from ' + g.code + '.'); render(); return;
  }
  if (form.id === 'adm-rw-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    rwSet(String(v.email).toLowerCase(), Math.max(0, Number(v.points) || 0), v.reason || 'manual');
    save(); closeModal(); toast('Reward points updated.'); render(); return;
  }
  if (form.id === 'adm-rwc-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    if (!db.rewardConfig) db.rewardConfig = {};
    db.rewardConfig.perVisit = Math.max(0, Number(v.perVisit) || 0);
    save(); closeModal(); toast('Reward settings saved.'); render(); return;
  }
  if (form.id === 'adm-bal-form') {
    e.preventDefault(); const v = Object.fromEntries(new FormData(form));
    const w = walletEnsure(v.email);
    w.balance = Math.max(0, Number(w.balance || 0) + Number(v.delta));
    memTxns().push({ id: 'AUD-' + Date.now().toString(36).toUpperCase(), email: String(v.email).toLowerCase(), kind: 'adjust', amount: Number(v.delta), balanceAfter: w.balance, ref: '', by: (admMe() || {}).name || 'admin', status: 'completed', created: new Date().toISOString() });
    save(); closeModal(); toast('Balance updated.'); render(); return;
  }
});

document.addEventListener('submit',e=>{let form=e.target;if(!['contact-form','walkin-form','branch-form','barber-form','service-form','edit-service-form','login-form'].includes(form.id))return;e.preventDefault();let v=Object.fromEntries(new FormData(form));if(form.id==='login-form'){try{sessionStorage.setItem('gents_auth',form.dataset.role==='admin'?'admin':'client')}catch(e){}location.href=form.dataset.role==='admin'?'admin':'client';return}if(form.id==='contact-form'){db.contacts.push(v);save();form.reset();return toast('Message saved locally. Branch email notification simulated.')}if(form.id==='walkin-form'){let b=db.barbers.find(x=>x.branch===v.branch&&x.services.includes(v.service));if(!b)return toast('No eligible barber found in this branch.');if(db.bookings.some(x=>x.branch===v.branch&&x.barber===b.id&&x.date===v.date&&x.time===v.time&&['Pending','Confirmed'].includes(x.status)))return toast('This appointment conflicts with an existing booking.');db.bookings.push({id:'GT-'+(1050+db.bookings.length)+'-'+Math.random().toString(36).slice(2,6),name:v.name,phone:'Walk-in',email:'—',branch:v.branch,service:v.service,barber:b.id,date:v.date,time:v.time,status:'Confirmed',source:'Walk-in'});toast('Walk-in registered and calendar updated.')}if(form.id==='branch-form'){let id=v.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now().toString().slice(-4);db.branches.push({id,name:v.name,place:v.place,photo:IM.salon,hours:'Mon–Sat · 09:00–18:00'});toast('New branch created.')}if(form.id==='barber-form'){db.barbers.push({id:'barber'+Date.now(),name:v.name,branch:v.branch,role:'Barber',photo:IM.barber1,services:db.services.map(x=>x.id)});toast('Barber added to the team.')}if(form.id==='service-form'){db.services.push({id:'srv'+Date.now(),name:v.name,desc:'Grooming service',icon:'✂',duration:Number(v.duration),price:Number(v.price),branches:db.branches.map(x=>x.id)});toast('Service added.')}if(form.id==='edit-service-form'){let s=service(v.id);s.name=v.name;s.price=Number(v.price);toast('Service updated.')}save();closeModal();render()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
async function verifySession(){if(!/^https?:$/.test(location.protocol))return true;let a=null;try{a=sessionStorage.getItem('gents_auth')}catch(e){}if(a!=='admin'&&a!=='client')return true;try{const r=await fetch('api/auth.php',{credentials:'same-origin'});if(r.status===401){try{sessionStorage.removeItem('gents_auth');sessionStorage.removeItem('gents_staff');sessionStorage.removeItem('gents_client')}catch(e){}if(page==='admin'){toast('Session expired — please sign in again.');location.href='login'}else if(page==='client'){location.href='login'}return false}return true}catch(e){return true}}
async function bootRender(){const prot=(page==='admin'||page==='client');let a=null;try{a=sessionStorage.getItem('gents_auth')}catch(e){}const vs=verifySession();if(prot&&a){if(!await vs)return}try{await remoteReady}catch(e){}render()}
if(page==='branch'){const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));if(!h){page='home';location.replace('index')}else page='branch:'+h}try{const fp2=(location.pathname.split('/').pop()||'');const bp=fp2==='booking'&&sessionStorage.getItem('gents_booking_preset');if(bp){sessionStorage.removeItem('gents_booking_preset');resetBooking(JSON.parse(bp))}}catch(e){}bootRemote();bootRender();
})();
