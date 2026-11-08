
(()=>{
'use strict';
const IM={hero:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85',salon:'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80',salon2:'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80',salon3:'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=80',barber1:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80',barber2:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=620&q=80',barber3:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=620&q=80',barber4:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=620&q=80',equipment:'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=700&q=80'};
const HE=[{title:'Modern Grooming for the Gentleman',desc:'Precision cuts, expert grooming and a premium lounge experience.',photo:IM.hero},{title:'Your Style. Our Craft.',desc:'Thoughtful details and precision barbering for every gentleman.',photo:IM.salon3},{title:'A Cut Above the Ordinary.',desc:'A relaxed space, skilled hands and a fresh look.',photo:IM.salon2},{title:'Made for the Modern Gent.',desc:'Discover signature haircuts, shaves and personal grooming.',photo:IM.salon},{title:'Find Your Perfect Barber.',desc:'Choose your branch, barber and preferred time in minutes.',photo:IM.equipment}];
const GE=[{url:IM.salon,alt:'Barbershop interior',category:'Salon'},{url:IM.salon2,alt:'Professional styling',category:'Salon'},{url:IM.hero,alt:'Barber grooming a client',category:'Haircuts'},{url:IM.salon3,alt:'Classic grooming',category:'Grooming'},{url:IM.equipment,alt:'Barbershop grooming equipment',category:'Grooming'},{url:IM.barber1,alt:'Barber portrait',category:'Haircuts'},{url:IM.salon2,alt:'Grooming stations',category:'Salon'},{url:IM.barber3,alt:'Professional barber',category:'Haircuts'}];
const initial={branches:[{id:'borrowdale',name:'Borrowdale',place:'Borrowdale, Harare',hours:'Mon–Sat · 08:00–19:00',photo:IM.salon},{id:'fife',name:'Fife Avenue',place:'Fife Avenue, Harare',hours:'Mon–Sat · 08:00–18:00',photo:IM.salon2}],services:[{id:'cut',name:'Precision Haircut',desc:'A clean, refined cut tailored to your style.',price:12,duration:30,icon:'✂',branches:['borrowdale','fife']},{id:'beard',name:'Beard Grooming',desc:'Shape, trim and maintain a well-groomed beard.',price:8,duration:20,icon:'♜',branches:['borrowdale','fife']},{id:'shave',name:'Classic Shave',desc:'A close shave with a polished finish.',price:10,duration:30,icon:'⌁',branches:['borrowdale','fife']},{id:'facial',name:'Facial Treatment',desc:'A refreshing skin care treatment.',price:25,duration:45,icon:'✧',branches:['borrowdale','fife']},{id:'package',name:'The Signature',desc:'Haircut, beard grooming and facial.',price:40,duration:90,icon:'✦',branches:['borrowdale','fife']}],barbers:[{id:'tawanda',name:'Tawanda M.',role:'Senior Barber',branch:'borrowdale',photo:IM.barber1,services:['cut','beard','shave','package']},{id:'prince',name:'Prince C.',role:'Master Barber',branch:'fife',photo:IM.barber2,services:['cut','beard','facial','package']},{id:'kuda',name:'Kuda N.',role:'Barber',branch:'fife',photo:IM.barber3,services:['cut','beard','shave','package']},{id:'brian',name:'Brian T.',role:'Grooming Specialist',branch:'borrowdale',photo:IM.barber4,services:['cut','facial','package']}],bookings:[],contacts:[],notifications:[],membership:false,hero:HE.map(x=>({...x})),gallery:GE.map(x=>({...x})),settings:{name:'The Gent’s',phone:'+263 77 601 1938',email:'admin@thegents.co.zw',whatsapp:'+263776011938',address:'Fife Avenue & Borrowdale, Harare'},clientProfile:{name:'T. Moyo',phone:'+263771234567',email:'tmoyo@example.com',favBranch:'',favBarber:''}};
const storage={getItem(k){try{return window.localStorage.getItem(k)}catch(e){return null}},setItem(k,v){try{window.localStorage.setItem(k,v)}catch(e){}},removeItem(k){try{window.localStorage.removeItem(k)}catch(e){}}};
const KEY='gents_prototype_v5';let db;try{db=JSON.parse(storage.getItem(KEY))||structuredClone(initial)}catch{db=structuredClone(initial)};if(!db.branches||!db.bookings)db=structuredClone(initial);
const today=new Date();today.setHours(12,0,0,0);const dateOffset=(n)=>{let d=new Date(today);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
if(!db.seeded){db.bookings=[{id:'GT-1042',name:'T. Moyo',phone:'+263771234567',email:'tmoyo@example.com',branch:'borrowdale',service:'cut',barber:'tawanda',date:dateOffset(1),time:'10:00',status:'Confirmed',source:'Online'},{id:'GT-1043',name:'C. Dube',phone:'+263772234567',email:'cdube@example.com',branch:'fife',service:'beard',barber:'prince',date:dateOffset(2),time:'11:30',status:'Pending',source:'Online'},{id:'GT-1044',name:'R. Chikomo',phone:'+263773234567',email:'rchikomo@example.com',branch:'fife',service:'cut',barber:'kuda',date:dateOffset(3),time:'13:00',status:'Pending',source:'Online'},{id:'GT-1045',name:'N. Sibanda',phone:'+263774234567',email:'nsibanda@example.com',branch:'borrowdale',service:'package',barber:'brian',date:dateOffset(-2),time:'14:00',status:'Completed',source:'Walk-in'}];db.seeded=true}
if(!Array.isArray(db.hero)||!db.hero.length)db.hero=HE.map(x=>({...x}));if(!Array.isArray(db.gallery)||!db.gallery.length)db.gallery=GE.map(x=>({...x}));if(!db.settings)db.settings={name:'The Gent’s',phone:'+263 77 601 1938',email:'admin@thegents.co.zw',whatsapp:'+263 77 601 1938',address:'Fife Avenue & Borrowdale, Harare'};
let remoteTimer=null,remoteDirty=false;
const adoptRemote=d=>{if(!d)return;for(const k in db)delete db[k];Object.assign(db,d);syncHero();storage.setItem(KEY,JSON.stringify(db))};
const gentsRole=()=>{try{return sessionStorage.getItem('gents_auth')==='admin'?'admin':'guest'}catch(e){return 'guest'}};
const remoteSave=()=>{if(!/^https?:$/.test(location.protocol))return;remoteDirty=true;clearTimeout(remoteTimer);remoteTimer=setTimeout(async()=>{try{const r=await fetch('api/db.php',{method:'POST',headers:{'Content-Type':'application/json','X-Gents-Role':gentsRole()},body:JSON.stringify(db),credentials:'same-origin'});if(r.status===401||r.status===403){toast('Your session expired — please sign in again.');return}const j=await r.json();if(j&&j.data)adoptRemote(j.data)}catch(e){}remoteDirty=false},400)};
window.addEventListener('pagehide',()=>{if(remoteDirty&&/^https?:$/.test(location.protocol)){try{navigator.sendBeacon('api/db.php',JSON.stringify(db))}catch(e){}}});
async function bootRemote(){if(!/^https?:$/.test(location.protocol))return;try{const r=await fetch('api/db.php',{credentials:'same-origin'});if(!r.ok)return;const j=await r.json();if(!j||!j.ok)return;if(j.data){if(!remoteDirty)adoptRemote(j.data)}else remoteSave();if(gentsRole()==='admin'){const ar=await fetch('api/auth.php',{credentials:'same-origin'});const aj=await ar.json().catch(()=>null);if(!aj||!aj.ok){try{sessionStorage.removeItem('gents_auth');sessionStorage.removeItem('gents_staff')}catch(e){}if(page==='admin')render()}}}catch(e){}}
const save=(push=true)=>{storage.setItem(KEY,JSON.stringify(db));if(push)remoteSave()};save(false);
let page=document.body.dataset.page||'home',dark=storage.getItem('gents_theme')==='dark',dashboardTab='overview',clientTab='upcoming',branchFilter='all',barberFilter='all',galleryFilter='all',bookingStep=0,booking={},selectedImage='',dateStart=1;
if(dark)document.documentElement.classList.add('dark');
const auth=(r)=>{try{return sessionStorage.getItem('gents_auth')===r}catch(e){return false}};const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const branch=(id)=>db.branches.find(x=>x.id===id)||{name:id,place:''};const service=(id)=>db.services.find(x=>x.id===id)||{name:id,price:0,duration:30};const barber=(id)=>db.barbers.find(x=>x.id===id)||{name:id};const money=(x)=>'$'+Number(x||0).toFixed(2);
const fmt=(s)=>s?new Date(s+'T12:00:00').toLocaleDateString('en-ZW',{day:'numeric',month:'short',year:'numeric'}):'—';const badge=(s)=>`<span class="status ${esc((s||'').toLowerCase().replace(/\s/g,''))}">${esc(s)}</span>`;
const button=(text,act,klass='btn')=>`<button class="${klass}" data-action="${act}">${text}</button>`;
function header(){return `<header class="nav"><div class="shell"><button class="icon-btn menu-toggle" data-action="menu">☰</button><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS SALON</div></div></a><nav id="links" class="links">${[['home','Home'],['services','Services'],['barbers','Barbers'],['gallery','Gallery'],['contact','Contact']].map(([k,t])=>`<button data-page="${k}" class="navlink ${page===k?'active':''}">${t}</button>`).join('')}</nav><div class="nav-actions"><button class="icon-btn" data-action="theme" title="Toggle dark mode">${dark?'☀':'☾'}</button><button class="btn" data-page="login">Login</button><button class="btn btn-gold" data-action="start-booking">Book Now</button></div></div></header>`}
function footer(){const s=db.settings||{};const ph=s.phone||'+263 77 601 1938',em=s.email||'admin@thegents.co.zw',ad=s.address||'Fife Avenue & Borrowdale, Harare',wa=(s.whatsapp||ph).replace(/[^0-9]/g,'');return `<footer class="footer"><div class="shell footer-grid"><div class="footer-col"><a class="brand" data-page="home"><span class="brand-icon">⚒</span><span><span class="brand-title">The Gent’s</span><div class="brand-sub">BARBER & GENTS SALON</div></span></a><p class="footer-about">Precision cuts, expert grooming and a premium lounge experience — Harare’s destination for the modern gentleman.</p><div class="footer-social"><a class="footer-icon" href="https://wa.me/${wa}" target="_blank" rel="noopener" title="WhatsApp us">✆</a><a class="footer-icon" href="mailto:${esc(em)}" title="Email us">✉</a><a class="footer-icon" href="tel:${esc(ph.replace(/[^0-9+]/g,''))}" title="Call us">☎</a></div></div><div class="footer-col"><h4>Quick Links</h4><a class="flink" data-page="home">Home</a><a class="flink" data-page="services">Services</a><a class="flink" data-page="barbers">Our Barbers</a><a class="flink" data-page="gallery">Gallery</a><a class="flink" data-page="contact">Contact Us</a></div><div class="footer-col fcontact"><h4>Get in Touch</h4><div><span class="fi">☎</span><a href="tel:${esc(ph.replace(/[^0-9+]/g,''))}">${esc(ph)}</a></div><div><span class="fi">✉</span><a href="mailto:${esc(em)}">${esc(em)}</a></div><div><span class="fi">⌖</span><span>${esc(ad)}</span></div><div><span class="fi">◷</span><span>Mon–Sat · 08:00–19:00</span></div></div><div class="footer-col"><h4>Opening Hours</h4><div class="fhours">${db.branches.map(b=>`<div class="fh"><b>${esc(b.name)}</b><span>${esc(b.hours||'')}</span></div>`).join('')}</div><div class="footer-cta">${button('Book Appointment →','start-booking','btn btn-gold')}</div></div></div><div class="shell footer-bottom"><small>© 2026 The Gent’s · Interactive concept only · Developed and Powered By <a href="https://www.globalspaceweb.co.zw" target="_blank" rel="noopener" style="color:var(--gold)">Global Space Web</a></small></div></footer>`}
const heading=(k,h,sub='')=>`<div class="heading-row"><div><div class="eyebrow">${k}</div><h2>${h}</h2>${sub?`<p class="muted">${sub}</p>`:''}</div></div>`;
const branchTiles=()=>db.branches.map(x=>`<button data-action="open-branch:${x.id}" class="card tile"><span class="tile-icon">⌖</span><span><strong>${esc(x.name)}</strong><small>${esc(x.place)}</small></span><span class="arrow">→</span></button>`).join('');
const heroSlides=[];
let slideIndex=0;
const syncHero=()=>{const s=db.hero&&db.hero.length?db.hero:HE;heroSlides.splice(0,heroSlides.length,...s);if(slideIndex>=heroSlides.length)slideIndex=0};
syncHero();
function heroMarkup(){return `<section class="slider-hero" aria-label="The Gent’s featured highlights"><div class="slider-visual">${heroSlides.map((x,i)=>`<div class="hero-slide ${i===slideIndex?'active':''}" style="background-image:url('${x.photo}')"></div>`).join('')}<div class="hero-glass"></div></div><div class="slider-content"><div class="eyebrow">PREMIUM BARBER & GENTS SALON</div><h1 id="slide-title">${heroSlides[slideIndex].title}</h1><p id="slide-desc">${heroSlides[slideIndex].desc}</p><div class="hero-actions">${button('Book Appointment →','start-booking','btn btn-gold')}${button('Explore Services','go:services','btn btn-hero-outline')}</div></div><div class="slider-bottom"><div class="slider-dots">${heroSlides.map((x,i)=>`<button class="slider-dot ${i===slideIndex?'active':''}" aria-label="Slide ${i+1}" data-action="slide:${i}"></button>`).join('')}</div><div class="slider-arrows"><button class="slider-arrow" aria-label="Previous slide" data-action="slide-prev">←</button><button class="slider-arrow" aria-label="Next slide" data-action="slide-next">→</button></div></div></section>`}
function serviceCard(x){return `<article class="card service-card">${x.image?`<img class="service-img" src="${esc(x.image)}" alt="${esc(x.name)}">`:''}<div class="service-card-icon">${x.icon}</div><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><div class="service-card-bottom"><span>${x.duration} min <b>· ${money(x.price)}</b></span><button class="service-book" data-action="book-service:${x.id}">Book ↗</button></div></article>`}

const STATS=[['✂','1,200+','Happy Clients'],['♛','8+','Years of Craft'],['⌖','2','Prime Locations'],['★','4.9','Average Rating']];
const WHY=[['✂','Premium Tools & Products','Professional-grade equipment and products for every service on the menu.'],['♛','Expert Barbers','Skilled, vetted professionals who take genuine pride in their work.'],['⌖','Two Convenient Locations','Borrowdale and Fife Avenue — choose the branch closest to you.'],['◷','Effortless Booking','Reserve online in minutes or walk in during opening hours.']];
const TESTIMONIALS=[{name:'T. Moyo',role:'Loyal Client · Borrowdale',text:'Best fade in Harare. The attention to detail is unreal — I haven’t missed an appointment in months.',rating:5},{name:'C. Dube',role:'Client · Fife Avenue',text:'Booked online in two minutes and the whole experience felt premium from start to finish.',rating:5},{name:'R. Chikomo',role:'Client · Borrowdale',text:'The Signature package is worth every cent. My beard has never looked this sharp.',rating:5}];
function statsStrip(){return `<section class="section-tight" style="padding-top:8px"><div class="stat-grid">${STATS.map(([i,n,t])=>`<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div></section>`}
function whyUs(){return `<section class="section-tight">${heading('WHY CHOOSE US','The Gent’s Difference','More than a haircut — a complete grooming experience.')}${`<div class="grid grid-4">${WHY.map(([i,t,d])=>`<div class="card why-card"><div class="why-icon">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`}</section>`}
function testimonials(){return `<section class="section-tight">${heading('WALK-IN REVIEWS','Client Stories','Don’t just take our word for it.')}${`<div class="grid grid-3">${TESTIMONIALS.map(t=>`<div class="card testi-card"><div class="testi-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div><p class="testi-quote">“${t.text}”</p><div class="testi-author"><strong>${esc(t.name)}</strong><span class="muted small">${esc(t.role)}</span></div></div>`).join('')}</div><div class="section-foot">${button('Book Your Appointment →','start-booking','btn btn-gold')}</div>`}</section>`}
function home(){return `${heroMarkup()}<div class="shell">${statsStrip()}<section class="section-tight">${heading('FIND YOUR LOCATION','Our Branches','Choose a location to explore its team and services.')}<div class="grid grid-4 branch-grid">${branchTiles()}</div></section><section class="section-tight">${heading('WHAT WE DO','Our Services','Simple, expert grooming.')}<div class="grid grid-4 service-grid">${db.services.slice(0,4).map(serviceCard).join('')}</div><div class="section-foot">${button('View All Services →','go:services')}</div></section>${whyUs()}<section class="section-tight">${heading('MEET THE TEAM','Our Barbers')}<div class="grid grid-4 barber-row">${db.barbers.map(x=>barberCard(x)).join('')}</div></section><section class="section-tight">${heading('BEHIND THE CHAIR','Gallery')}<div class="grid grid-4">${galleryImages().slice(0,4).map(x=>`<div class="card"><img class="gallery-img" data-action="image:${x.url}" src="${x.url}" alt="${x.alt}"></div>`).join('')}</div></section>${testimonials()}</div>`}

function services(){return `<div class="shell"><div class="page-head"><div class="eyebrow">OUR EXPERTISE</div><h1>Our Services</h1><p>Expert grooming services tailored for the modern gentleman. Select a card to book.</p></div><div class="grid grid-4 service-grid">${db.services.map(serviceCard).join('')}</div></div>`}
function barberCard(x){return `<div class="card"><img class="barber-photo" src="${x.photo}" alt="${esc(x.name)}" loading="lazy"><div class="barber-info"><h3>${esc(x.name)}</h3><p>${esc(x.role)} · ${esc(branch(x.branch).name)}</p>${x.bio?`<p class="small muted" style="margin:2px 0 8px">${esc(x.bio)}</p>`:''}${button('Book with '+esc(x.name.split(' ')[0])+' →','book-barber:'+x.id,'btn btn-sm')}</div></div>`}
function barbers(){let list=db.barbers.filter(x=>barberFilter==='all'||x.branch===barberFilter);return `<div class="shell"><div class="page-head"><div class="eyebrow">THE TEAM</div><h1>Our Barbers</h1><p>Meet our skilled and experienced barbers.</p></div><div class="segmented" style="margin-bottom:22px">${[{id:'all',name:'All Branches'},...db.branches].map(x=>`<button class="pill ${barberFilter===x.id?'active':''}" data-action="barber-filter:${x.id}">${esc(x.name)}</button>`).join('')}</div><div class="grid grid-4">${list.map(barberCard).join('')}</div></div>`}
function galleryImages(){return (db.gallery&&db.gallery.length?db.gallery:GE).map(x=>({url:x.url,alt:x.alt||'Gallery image',category:x.category||'Salon'}))}
function gallery(){const all=galleryImages(),cats=['all',...new Set(all.map(x=>x.category))],imgs=all.filter(x=>galleryFilter==='all'||x.category===galleryFilter);return `<div class="shell"><div class="page-head"><div class="eyebrow">OUR WORK</div><h1>Gallery</h1><p>A look inside The Gent’s experience.</p></div><div class="segmented" style="margin-bottom:23px">${cats.map(x=>`<button data-action="gallery-filter:${x}" class="pill ${galleryFilter===x?'active':''}">${x==='all'?'All':esc(x)}</button>`).join('')}</div><div class="grid grid-4">${imgs.map(x=>`<div class="card"><img loading="lazy" class="gallery-img" data-action="image:${x.url}" src="${x.url}" alt="${x.alt}"></div>`).join('')}</div></div>`}

function contact(){const s=db.settings||{};const ph=s.phone||'+263 77 601 1938',em=s.email||'admin@thegents.co.zw',ad=s.address||'Fife Avenue & Borrowdale, Harare';return `<div class="shell"><div class="page-head"><div class="eyebrow">SAY HELLO</div><h1>Get in Touch</h1><p>We’re here to assist you.</p></div><div class="contact-grid"><form class="page-panel" id="contact-form"><h3>Send a message</h3><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" placeholder="Your name"></div><div class="form-group"><label class="form-label">Email</label><input class="field" required type="email" name="email" placeholder="you@example.com"></div></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Message</label><textarea required class="field" name="message" placeholder="How can we help?"></textarea></div><button type="submit" class="btn btn-gold">Send Message →</button></form><div class="page-panel"><h3>Contact details</h3><div class="info-list"><div class="info-item"><span class="gold">☎</span><div><b>Phone</b><span class="muted">${esc(ph)}</span></div></div><div class="info-item"><span class="gold">✉</span><div><b>Email</b><span class="muted">${esc(em)}</span></div></div><div class="info-item"><span class="gold">⌖</span><div><b>Locations</b><span class="muted">${esc(ad)}</span></div></div></div><div style="margin-top:28px">${button('WhatsApp enquiry ↗','whatsapp-demo')}</div><div style="background:var(--soft);border:1px solid var(--line);padding:28px;text-align:center;border-radius:12px;margin-top:22px;color:var(--muted)">⌖ &nbsp; Branch directions available on each branch page</div></div></div></div>`}
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
function client(){if(!auth('client')){location.replace('login.html');return''}let list=db.bookings.filter(x=>x.phone==='+263771234567'||x.clientCreated);let upcoming=list.filter(x=>x.status!=='Completed'&&x.status!=='Cancelled'&&x.status!=='Declined');let past=list.filter(x=>!upcoming.includes(x));return dashboardFrame('client',`<div class="dash-top"><div><div class="eyebrow">YOUR ACCOUNT</div><h1>My Bookings</h1><p class="muted">View and manage your appointments.</p></div>${button('Book New Appointment →','start-booking','btn btn-gold')}</div><div class="segmented" style="margin-bottom:22px"><button class="pill ${clientTab==='upcoming'?'active':''}" data-action="client-tab:upcoming">Upcoming (${upcoming.length})</button><button class="pill ${clientTab==='past'?'active':''}" data-action="client-tab:past">Past (${past.length})</button></div>${(clientTab==='upcoming'?upcoming:past).map(b=>`<div class="appointment" style="margin-bottom:12px"><div><strong>${esc(service(b.service).name)}</strong><small>⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</small></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${badge(b.status)}<button class="btn btn-sm" data-action="view-booking:${b.id}">Details</button>${b.status==='Confirmed'||b.status==='Pending'?`<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>`:''}${b.status==='Completed'?`<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>`:''}</div></div>`).join('')||`<div class="empty card">No ${clientTab} bookings yet. Try booking an appointment to add one.</div>`}`)}
function dashboardFrame(role,content){const admin=role==='admin';let items=admin?[["overview","Dashboard","⌂"],["bookings","Bookings","▢"],["calendar","Calendar","▦"],["branches","Branches","⌖"],["barbers","Barbers","✂"],["services","Services","✧"],["clients","Clients","♧"],["reports","Reports","▥"],["settings","Settings","⚙"]]:[["mybookings","My Bookings","▢"],["profile","Profile","♙"]];const selected=admin?dashboardTab:'mybookings';let nav=items.map(([key,title,ico])=>`<button class="${selected===key?'active':''}" data-action="${admin?'admin-tab':'client-side'}:${key}">${ico} &nbsp; ${title}</button>`).join('');return `<div class="dashboard"><aside class="side"><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS SALON</div></div></a><div class="side-nav">${nav}<button data-page="home">↗ &nbsp; Visit Website</button></div></aside><div><div class="dash-mobile">${nav}</div><main class="dash-main">${content}</main></div></div>`}
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
function login(){return loginCard('client')}function loginCard(role){const admin=role==='admin';return `<div class="shell" style="max-width:560px"><div class="page-panel" style="margin:60px auto"><div class="eyebrow">${admin?'ADMIN PORTAL':'CLIENT PORTAL'}</div><h2 style="margin:12px 0 6px">Sign In</h2><p class="muted">${admin?'Sign in to the management dashboard.':'Sign in to view and manage your bookings.'}</p><form id="login-form" data-role="${role}"><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" placeholder="you@example.com"></div><div class="form-group"><label class="form-label">Password</label><input class="field" type="password" required name="password" placeholder="Enter your password"></div><button class="btn btn-gold" type="submit" style="width:100%">Sign In →</button></form><p class="muted small" style="margin-top:20px;text-align:center">${admin?'Client? <a href="login.html" style="color:var(--gold)">Go to client login</a> · <a href="index.html" style="color:var(--gold)">Back to site</a>':'New here? <a href="booking.html" style="color:var(--gold)">Book an appointment</a> · <a href="#" data-action="cl-register" style="color:var(--gold)">Create account</a>'}</p></div></div>`}function confirmPage(){return `<div class="shell" style="max-width:740px;text-align:center"><div class="section"><div style="display:inline-grid;place-items:center;background:var(--gold-soft);color:var(--gold);width:72px;height:72px;border-radius:50%;font-size:29px;margin-bottom:20px">✓</div><div class="eyebrow">REQUEST SUBMITTED</div><h1>Booking Request Received</h1><p class="muted">Your request has been sent to the branch receptionist for review. Notifications are simulated.</p><div class="page-panel" style="margin:25px auto;max-width:540px;text-align:left">${[['Booking reference',booking.id],['Branch',branch(booking.branch).name],['Service',service(booking.service).name],['Date',fmt(booking.date)],['Time',booking.time],['Status','Pending approval']].map(([k,v])=>`<div class="summary-row"><span>${k}</span><strong>${esc(v)}</strong></div>`).join('')}</div>${button('My Bookings','go:client','btn btn-gold')} ${button('Back to Home','go:home')}</div></div>`}
function render(){syncHero();let body;if(page.startsWith('branch:'))body=branchPage(page.slice(7));else body=({home,services,barbers,gallery,contact,booking:bookingPage,client,admin,login,confirmation:confirmPage})[page]?.()||home();document.getElementById('app').innerHTML=header()+`<div class="page">${body}</div>`+(page==='admin'||page==='client'?'':footer());document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)}`;document.querySelector('meta[name=theme-color]').content=dark?'#111111':'#ffffff';}
function navigate(p){if(p.startsWith('branch:')){location.href='branch.html#'+p.slice(7);return}const f={home:'index.html',services:'services.html',barbers:'barbers.html',gallery:'gallery.html',contact:'contact.html',login:'login.html',booking:'booking.html',client:'client.html',admin:'admin.html',confirmation:'booking.html'}[p]||'index.html';const fp=(location.pathname.split('/').pop()||'index.html');if(f===fp){page=p;window.scrollTo({top:0,behavior:'instant'});render()}else location.href=f}
function toast(message){document.getElementById('toast-root').innerHTML=`<div class="toast"><b>Notification</b><br>${esc(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>document.getElementById('toast-root').innerHTML='',3500)}
function modal(title,content){document.getElementById('modal-root').innerHTML=`<div class="overlay" id="overlay"><div class="modal"><div class="modal-top"><h3>${title}</h3><button data-action="close-modal" class="icon-btn">×</button></div>${content}</div></div>`}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function showSlide(n){slideIndex=(n+heroSlides.length)%heroSlides.length;const slides=document.querySelectorAll('.hero-slide');slides.forEach((el,i)=>el.classList.toggle('active',i===slideIndex));document.querySelectorAll('.slider-dot').forEach((el,i)=>el.classList.toggle('active',i===slideIndex));const title=document.getElementById('slide-title'),desc=document.getElementById('slide-desc');if(title)title.innerHTML=heroSlides[slideIndex].title;if(desc)desc.textContent=heroSlides[slideIndex].desc;}
setInterval(()=>{if(page==='home'&&!document.hidden)showSlide(slideIndex+1)},6500);
function handle(action){let [cmd,...parts]=action.split(':'),val=parts.join(':');if(cmd==='slide')return showSlide(Number(val));if(cmd==='slide-next')return showSlide(slideIndex+1);if(cmd==='slide-prev')return showSlide(slideIndex-1);if(cmd==='go')return navigate(val);if(cmd==='theme'){dark=!dark;document.documentElement.classList.toggle('dark',dark);storage.setItem('gents_theme',dark?'dark':'light');render();return}if(cmd==='menu'){document.getElementById('links').classList.toggle('open');return}if(cmd==='start-booking'){try{sessionStorage.removeItem('gents_booking_preset')}catch(e){}location.href='booking.html';return};if(cmd==='open-branch')return navigate('branch:'+val);if(cmd==='book-branch'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:val}))}catch(e){}location.href='booking.html';return};if(cmd==='book-service'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({service:val}))}catch(e){}location.href='booking.html';return};if(cmd==='book-barber'){let b=barber(val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,barber:val}))}catch(e){}location.href='booking.html';return}if(cmd==='barber-filter'){barberFilter=val;return render()}if(cmd==='gallery-filter'){galleryFilter=val;return render()}if(cmd==='image'){return modal('Gallery',`<img style="width:100%;border-radius:10px" src="${val}" alt="Gallery preview">`)}if(cmd==='close-modal')return closeModal();if(cmd==='join-membership'){db.membership=true;save();toast('Membership interest recorded locally. No payment has been taken.');return render()}if(cmd==='whatsapp-demo'){const w=(db.settings&&db.settings.whatsapp)||'+263 77 601 1938';window.open('https://wa.me/'+w.replace(/[^0-9]/g,''),'_blank');return}
if(cmd==='book-choose-branch'){booking.branch=val;booking.barber='';if(booking.service&&!service(booking.service).branches.includes(val))booking.service='';booking.date='';booking.time='';return render()}if(cmd==='book-choose-service'){booking.service=val;booking.barber='';booking.date='';booking.time='';return render()}if(cmd==='book-choose-barber'){booking.barber=val;booking.date='';booking.time='';return render()}if(cmd==='book-choose-date'){booking.date=val;booking.time='';return render()}if(cmd==='book-choose-time'){booking.time=val;return render()};if(cmd==='book-back'){bookingStep=Math.max(0,bookingStep-1);return render()}if(cmd==='book-next'){if(bookingStep===0&&!booking.branch||bookingStep===1&&!booking.service||bookingStep===2&&!booking.barber||bookingStep===3&&(!booking.date||!booking.time))return toast('Please make a selection before continuing.');if(bookingStep===4){booking.name=document.getElementById('bk-name').value.trim();booking.phone=document.getElementById('bk-phone').value.trim();booking.email=document.getElementById('bk-email').value.trim();booking.notes=document.getElementById('bk-notes').value.trim();if(!booking.name||!booking.phone||!/^\S+@\S+\.\S+$/.test(booking.email))return toast('Please enter a name, phone number and valid email.')}bookingStep++;return render()}
if(cmd==='book-submit'){const assigned=booking.barber==='any'?(db.barbers.find(x=>x.branch===booking.branch&&x.services.includes(booking.service))||{}).id:booking.barber;if(!assigned)return toast('No available barber for this selection.');if(db.bookings.some(x=>x.branch===booking.branch&&x.barber===assigned&&x.date===booking.date&&x.time===booking.time&&['Pending','Confirmed'].includes(x.status)))return toast('This slot has just been taken. Please choose another.');booking.id='GT-'+(1050+db.bookings.length)+'-'+Math.random().toString(36).slice(2,6);db.bookings.push({...booking,barber:assigned,status:'Pending',source:'Online',clientCreated:true,clientEmail:clEmail()});db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);try{sessionStorage.setItem('gents_auth','client')}catch(e){}save();return navigate('confirmation')}
if(cmd==='admin-tab'){dashboardTab=val;return render()}if(cmd==='client-tab'){clientTab=val;return render()}if(cmd==='client-side'){if(val==='profile')return toast('Profile changes are not enabled yet.');return render()}
if(cmd==='approve'||cmd==='decline'||cmd==='client-cancel'){let b=db.bookings.find(x=>x.id===val);if(!b)return;if(cmd==='client-cancel'&&!confirm('Cancel this booking?'))return;b.status=cmd==='approve'?'Confirmed':cmd==='decline'?'Declined':'Cancelled';db.notifications.unshift(`Booking ${b.id} ${b.status}. Email and WhatsApp confirmation simulated.`);save();toast(`Booking ${b.id} ${b.status.toLowerCase()}. Email and WhatsApp notices simulated.`);return render()}
if(cmd==='view-booking'){let b=db.bookings.find(x=>x.id===val);return modal('Appointment '+esc(val),[['Customer',b.name],['Branch',branch(b.branch).name],['Service',service(b.service).name],['Barber',barber(b.barber).name],['Date & time',fmt(b.date)+' · '+b.time],['Status',b.status]].map(([k,v])=>`<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('')+(b.status==='Pending'?`<div class="auth-actions" style="margin-top:20px"><button class="btn btn-gold" data-action="approve:${b.id}">Approve</button><button class="btn" data-action="decline:${b.id}">Decline</button></div>`:''))}
if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,service:b.service,barber:b.barber}))}catch(e){}location.href='booking.html';return}
if(cmd==='walkin')return modal('Register Walk-in',`<form id="walkin-form"><div class="form-group"><label class="form-label">Client name</label><input name="name" required class="field" placeholder="Customer name"></div><div class="form-group"><label class="form-label">Branch</label><select name="branch" required class="field">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Service</label><select name="service" required class="field">${db.services.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Date & time</label><input type="date" name="date" class="field" required min="${dateOffset(0)}" value="${dateOffset(1)}"><select name="time" class="field" style="margin-top:9px">${['09:00','10:00','11:00','12:00','13:00','14:00','15:00'].map(x=>`<option>${x}</option>`).join('')}</select></div><button class="btn btn-gold" type="submit">Register Walk-in</button></form>`)
if(cmd==='add-branch')return modal('Add Branch',`<form id="branch-form"><div class="form-group"><label class="form-label">Branch name</label><input name="name" required class="field" placeholder="New location"></div><div class="form-group"><label class="form-label">Address</label><input name="place" required class="field" placeholder="Location, city"></div><button class="btn btn-gold">Add Branch</button></form>`)
if(cmd==='add-barber')return modal('Add Barber',`<form id="barber-form"><div class="form-group"><label class="form-label">Name</label><input name="name" required class="field" placeholder="Barber name"></div><div class="form-group"><label class="form-label">Branch</label><select name="branch" class="field">${db.branches.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div><button class="btn btn-gold">Add Barber</button></form>`)
if(cmd==='add-service')return modal('Add Service',`<form id="service-form"><div class="form-group"><label class="form-label">Service name</label><input class="field" required name="name"></div><div class="form-group"><label class="form-label">Price (USD)</label><input class="field" type="number" min="0" required name="price"></div><div class="form-group"><label class="form-label">Duration (minutes)</label><input class="field" type="number" min="5" required name="duration" value="30"></div><button class="btn btn-gold">Add Service</button></form>`)
if(cmd==='edit-service'){let x=service(val);return modal('Edit Service',`<form id="edit-service-form"><input type="hidden" name="id" value="${esc(x.id)}"><div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(x.name)}"></div><div class="form-group"><label class="form-label">Price</label><input class="field" type="number" min="0" required name="price" value="${x.price}"></div><button class="btn btn-gold">Save Changes</button></form>`)}
if(cmd==='reset'){if(!confirm('Reset all data, bookings and changes?'))return;fetch('api/db.php',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"__reset":true}',credentials:'same-origin'}).catch(()=>{}).finally(()=>{storage.removeItem(KEY);location.reload()});return}
}
document.addEventListener('click',e=>{let el=e.target.closest('[data-action],[data-page]');if(!el||el===document.body)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}});
document.addEventListener('change',e=>{if(e.target.id==='admin-branch'){branchFilter=e.target.value;render()}});
// ===== The Gent's — Admin portal =====
// Injected inside app.js IIFE by _build.js. Overrides adminBody/dashboardFrame
// (later function declarations win) and adds adm-* actions/listeners.

let admQ = '', admStatusF = 'all', admCalOff = 0, admCQ = '', admRange = 30;

const admF = () => {
  let l = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  if (admStatusF !== 'all') l = l.filter(b => b.status === admStatusF);
  if (admQ) l = l.filter(b => (b.name + ' ' + b.phone + ' ' + (b.email || '')).toLowerCase().includes(admQ));
  return l;
};

function adminBody() {
  const titles = { overview: 'Dashboard', bookings: 'Bookings', calendar: 'Calendar', branches: 'Branches', barbers: 'Barbers', services: 'Services', content: 'Content & Media', clients: 'Clients', reports: 'Reports', users: 'User Management', staff: 'Staff Management', erp: 'Accounting & ERP', settings: 'Settings' };
  const f = branchFilter === 'all' ? db.bookings : db.bookings.filter(b => b.branch === branchFilter);
  const top = `<div class="dash-top"><div><div class="eyebrow">THE GENT’S · MANAGEMENT</div><h1>${titles[dashboardTab] || 'Dashboard'}</h1><p class="muted">All changes are saved locally.</p></div><select id="admin-branch" class="field" style="width:205px"><option value="all">All Branches</option>${db.branches.map(b => `<option value="${b.id}" ${branchFilter === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>`;
  if (!admCan(dashboardTab)) return top + `<div class="panel"><p class="muted">You don’t have permission to access this section. Contact your administrator.</p></div>`;
  if (dashboardTab === 'overview') return admOverview(f, top);
  if (dashboardTab === 'bookings') return admBookings(top);
  if (dashboardTab === 'calendar') return admCalendar(f, top);
  if (dashboardTab === 'branches') return admBranches(top);
  if (dashboardTab === 'barbers') return admBarbers(top);
  if (dashboardTab === 'services') return admServices(top);
  if (dashboardTab === 'content') return admContent(top);
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
    ? [["overview", "Dashboard", "⌂"], ["bookings", "Bookings", "▢"], ["calendar", "Calendar", "▦"], ["branches", "Branches", "⌖"], ["barbers", "Barbers", "✂"], ["services", "Services", "✧"], ["content", "Content & Media", "◈"], ["clients", "Clients", "♧"], ["reports", "Reports", "▥"], ["users", "User Management", "♟"], ["staff", "Staff Management", "⚑"], ["erp", "Accounting & ERP", "¤"], ["settings", "Settings", "⚙"]]
    : [["overview", "Overview", "⌂"], ["bookings", "My Bookings", "▢"], ["rewards", "Rewards", "★"], ["notifications", "Alerts", "◔"], ["profile", "Profile", "♙"]];
  const selected = admin ? dashboardTab : (typeof clientView !== 'undefined' ? clientView : 'overview');
  const navItems = admin ? items.filter(([key]) => admCan(key)) : items;
  const nav = navItems.map(([key, title, ico]) => `<button class="${selected === key ? 'active' : ''}" data-action="${admin ? 'admin-tab' : 'client-side'}:${key}">${ico} &nbsp; ${title}</button>`).join('');
  const out = `<button data-action="adm-logout">⇥ &nbsp; Sign Out</button>`;
  return `<div class="dashboard"><aside class="side"><a class="brand" data-page="home"><div class="brand-icon">⚒</div><div><div class="brand-title">The Gent’s</div><div class="brand-sub">BARBER & GENTS SALON</div></div></a><div class="side-nav">${nav}${out}<button data-page="home">↗ &nbsp; Visit Website</button></div></aside><div><div class="dash-mobile">${nav}${out}</div><main class="dash-main">${content}</main></div></div>`;
}

// ---------- Overview ----------
function admOverview(f, top) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = f.filter(b => b.date === todayISO);
  const pending = f.filter(b => b.status === 'Pending');
  const rev = f.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((s, b) => s + Number(service(b.service).price || 0), 0);
  const stats = [['▢', f.length, 'Total Bookings'], ['◷', today.length, 'Today'], ['✓', pending.length, 'Pending'], ['$', money(rev), 'Revenue']];
  let h = top + `<div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number">${n}</div><div class="small">${t}</div></div>`).join('')}</div>`;
  h += `<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Pending Approvals</h3>${button('View all', 'admin-tab:bookings', 'btn btn-sm')}</div>${pending.slice(0, 6).map(b => `<div class="appointment"><div><strong>${esc(b.name)}</strong><small>${esc(service(b.service).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} ${esc(b.time)}</small></div><div class="row-actions"><button class="btn btn-sm" data-action="approve:${b.id}">✓</button><button class="btn btn-sm" data-action="decline:${b.id}">×</button></div></div>`).join('') || '<p class="muted">Nothing pending.</p>'}</div>`;
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
  return top + `<div class="panel"><div class="panel-head"><h3>All Bookings (${list.length})</h3><div class="auth-actions">${button('+ Walk-in', 'walkin', 'btn btn-gold btn-sm')}${ioButtons('bookings', true)}${button('Reset Data', 'reset', 'btn btn-sm')}</div></div>
  <div class="adm-filters"><input id="adm-q" class="field" style="max-width:260px" placeholder="Search name, phone, email…" value="${esc(admQ)}"><div class="segmented">${statuses.map(s => `<button class="pill ${admStatusF === s ? 'active' : ''}" data-action="adm-status:${s}">${s === 'all' ? 'All' : s}</button>`).join('')}</div></div>${admTable(list)}</div>`;
}

function admTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Date & Time</th><th>Client</th><th>Contact</th><th>Service</th><th>Barber</th><th>Branch</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(b => `<tr><td>${fmt(b.date)}<br><span class="muted">${esc(b.time)}</span></td><td>${esc(b.name)}</td><td class="small muted">${esc(b.phone)}<br>${esc(b.email || '')}</td><td>${esc(service(b.service).name)}</td><td>${esc(barber(b.barber).name)}</td><td>${esc(branch(b.branch).name)}</td><td class="small">${esc(b.source || '—')}</td><td>${badge(b.status)}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="adm-view-booking:${b.id}">View</button>${b.status === 'Pending' ? `<button class="btn btn-sm" data-action="approve:${b.id}">✓</button><button class="btn btn-sm" data-action="decline:${b.id}">×</button>` : ''}${b.status === 'Confirmed' ? `<button class="btn btn-sm" data-action="adm-complete:${b.id}">Done</button>` : ''}<button class="btn btn-sm" data-action="adm-del-booking:${b.id}">Del</button></div></td></tr>`).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No bookings match.</div>'}</div>`;
}

function admViewBooking(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Client', b.name], ['Phone', b.phone], ['Email', b.email || '—'], ['Branch', branch(b.branch).name], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status], ['Source', b.source || '—'], ['Notes', b.notes || '—']];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:20px;flex-wrap:wrap">${b.status === 'Pending' ? `<button class="btn btn-gold" data-action="approve:${b.id}">Approve</button><button class="btn" data-action="decline:${b.id}">Decline</button>` : ''}${b.status === 'Confirmed' ? `<button class="btn" data-action="adm-complete:${b.id}">Mark Completed</button>` : ''}<button class="btn" data-action="adm-cancel-booking:${b.id}">Cancel Booking</button><button class="btn" data-action="adm-del-booking:${b.id}">Delete</button></div>`);
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
  return top + `<div class="panel"><div class="panel-head"><h3>Branch Directory</h3><div class="auth-actions">${ioButtons('branches', true)}${button('+ Add Branch', 'adm-add-branch', 'btn btn-gold btn-sm')}</div></div><div class="grid grid-3">${db.branches.map(x => { const n = db.bookings.filter(b => b.branch === x.id).length; return `<div class="card"><img class="branch-photo" src="${esc(x.photo)}"><div class="card-pad"><h3>${esc(x.name)}</h3><p class="muted small">${esc(x.place)}<br>${esc(x.hours)}<br>${n} booking${n === 1 ? '' : 's'}</p><div class="row-actions" style="margin-top:10px"><button class="btn btn-sm" data-action="open-branch:${x.id}">View</button><button class="btn btn-sm" data-action="adm-edit-branch:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-branch:${x.id}">Delete</button></div></div></div>`; }).join('')}</div></div>`;
}

function admBranchForm(id) {
  const x = id ? db.branches.find(b => b.id === id) : { name: '', place: '', hours: 'Mon–Sat · 09:00–18:00', photo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80' };
  if (!x) return;
  modal(id ? 'Edit Branch' : 'Add Branch', `<form id="adm-branch-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Branch name</label><input class="field" required name="name" value="${esc(x.name)}"></div><div class="form-group"><label class="form-label">Address / area</label><input class="field" required name="place" value="${esc(x.place || '')}"></div><div class="form-group"><label class="form-label">Opening hours</label><input class="field" name="hours" value="${esc(x.hours || '')}"></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Branch'}</button></form>`);
}

// ---------- Barbers ----------
function admBarbers(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Team (${db.barbers.length})</h3><div class="auth-actions">${ioButtons('barbers', true)}${button('+ Add Barber', 'adm-add-barber', 'btn btn-gold btn-sm')}</div></div><div class="grid grid-4">${db.barbers.map(x => `<div class="card"><img class="barber-photo" src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy"><div class="barber-info"><h3>${esc(x.name)}</h3><p>${esc(x.role)} · ${esc(branch(x.branch).name)}</p><p class="small muted">${x.services.map(s => esc(service(s).name)).join(' · ')}</p>${x.bio ? `<p class="small muted">${esc(x.bio)}</p>` : ''}<div class="row-actions" style="margin-top:8px"><button class="btn btn-sm" data-action="adm-edit-barber:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-barber:${x.id}">Delete</button></div></div></div>`).join('')}</div></div>`;
}

function admBarberForm(id) {
  const x = id ? barber(id) : { name: '', role: 'Barber', branch: db.branches[0] ? db.branches[0].id : '', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=620&q=80', services: db.services.map(s => s.id) };
  if (id && !db.barbers.find(b => b.id === id)) return;
  modal(id ? 'Edit Barber' : 'Add Barber', `<form id="adm-barber-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-group"><label class="form-label">Name</label><input class="field" required name="name" value="${esc(id ? x.name : '')}"></div><div class="form-group"><label class="form-label">Role</label><input class="field" name="role" value="${esc(id ? x.role : 'Barber')}"></div><div class="form-group"><label class="form-label">Branch</label><select class="field" name="branch">${db.branches.map(b => `<option value="${b.id}" ${x.branch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Photo URL</label><input class="field" name="photo" value="${esc(x.photo || '')}"></div><div class="form-group"><label class="form-label">Bio (shown on profile cards)</label><textarea class="field" name="bio" rows="2" placeholder="e.g. 8 years of precision cutting">${esc(x.bio || '')}</textarea></div><div class="form-group"><label class="form-label">Services</label><div style="display:grid;gap:6px">${db.services.map(s => `<label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="services" value="${s.id}" ${(x.services || []).includes(s.id) ? 'checked' : ''}> ${esc(s.name)}</label>`).join('')}</div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Barber'}</button></form>`);
}

// ---------- Services ----------
function admServices(top) {
  return top + `<div class="panel"><div class="panel-head"><h3>Services & Pricing</h3><div class="auth-actions">${ioButtons('services', true)}${button('+ Add Service', 'adm-add-service', 'btn btn-gold btn-sm')}</div></div>${db.services.map(x => `<div class="service-row">${x.image ? `<img class="service-thumb" src="${esc(x.image)}" alt="">` : `<span class="service-icon">${x.icon}</span>`}<div class="service-text"><strong>${esc(x.name)}</strong><small>${esc(x.desc || '')} · ${x.duration} min · ${x.branches.map(b => esc(branch(b).name)).join(', ') || 'all branches'}</small></div><b>${money(x.price)}</b><div class="row-actions"><button class="btn btn-sm" data-action="adm-edit-service:${x.id}">Edit</button><button class="btn btn-sm" data-action="adm-del-service:${x.id}">Delete</button></div></div>`).join('')}</div>`;
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
  return top + `<div class="panel" style="max-width:640px"><div class="panel-head"><h3>Business Profile</h3></div><form id="adm-settings-form"><div class="form-grid"><div class="form-group"><label class="form-label">Salon name</label><input class="field" name="name" value="${esc(s.name || 'The Gent’s')}"></div><div class="form-group"><label class="form-label">Phone</label><input class="field" name="phone" value="${esc(s.phone || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">WhatsApp number</label><input class="field" name="whatsapp" value="${esc(s.whatsapp || '+263 77 601 1938')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" name="email" value="${esc(s.email || 'admin@thegents.co.zw')}"></div><div class="form-group"><label class="form-label">Address</label><input class="field" name="address" value="${esc(s.address || 'Fife Avenue & Borrowdale, Harare')}"></div></div><button class="btn btn-gold">Save Settings</button></form>
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
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'adm-logout') { try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {} location.href = page === 'admin' ? 'admin.html' : 'login.html'; return; }
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
  if (c === 'adm-range') { admRange = v === 'all' ? 'all' : Number(v); return render(); }
  if (c === 'adm-complete') { const b = db.bookings.find(x => x.id === v); if (b) { b.status = 'Completed'; db.notifications.unshift('Booking ' + b.id + ' completed.'); save(); toast('Booking marked completed.'); render(); } return; }
  if (c === 'adm-cancel-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Cancel this booking?')) return; b.status = 'Cancelled'; save(); toast('Booking cancelled.'); closeModal(); render(); return; }
  if (c === 'adm-del-booking') { const b = db.bookings.find(x => x.id === v); if (!b) return; if (!confirm('Permanently delete booking ' + b.id + '?')) return; db.bookings = db.bookings.filter(x => x.id !== v); save(); toast('Booking deleted.'); closeModal(); render(); return; }
  if (c === 'adm-del-branch') { const x = db.branches.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.branch === v)) return toast('Cannot delete: this branch has bookings.'); if (db.barbers.some(b => b.branch === v)) return toast('Cannot delete: this branch still has barbers.'); if (!confirm('Delete branch "' + x.name + '"?')) return; db.branches = db.branches.filter(b => b.id !== v); save(); toast('Branch deleted.'); render(); return; }
  if (c === 'adm-del-barber') { const x = db.barbers.find(b => b.id === v); if (!x) return; if (db.bookings.some(b => b.barber === v)) return toast('Cannot delete: this barber has bookings.'); if (!confirm('Delete ' + x.name + '?')) return; db.barbers = db.barbers.filter(b => b.id !== v); save(); toast('Barber removed.'); render(); return; }
  if (c === 'adm-del-service') { const x = db.services.find(s => s.id === v); if (!x) return; if (db.bookings.some(b => b.service === v)) return toast('Cannot delete: this service has bookings.'); if (!confirm('Delete service "' + x.name + '"?')) return; db.services = db.services.filter(s => s.id !== v); save(); toast('Service deleted.'); render(); return; }
  if (c === 'adm-export') return admExportCSV();
  if (c === 'adm-export-json') return admExportJSON();
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
  if (form.id === 'login-form') {
    e.preventDefault(); e.stopImmediatePropagation();
    const fd = new FormData(form); const em = (fd.get('email') || '').trim(); const pw = fd.get('password') || '';
    const role = form.dataset.role === 'admin' ? 'admin' : 'client';
    if (role === 'client') {
      // Client login — verify against the PHP/MySQL clients table
      try {
        const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'client-login', email: em, password: pw }), credentials: 'same-origin' });
        const j = await r.json();
        if (j && j.ok) { try { sessionStorage.setItem('gents_auth', 'client'); sessionStorage.setItem('gents_client', JSON.stringify(j.client)); sessionStorage.removeItem('gents_staff') } catch (x) {} location.href = 'client.html'; return; }
        if (r.status === 401) { toast('Invalid email or password.'); return; }
      } catch (x) { toast('Sign-in service unavailable — check your connection.'); return; }
    }
    // Admin login — verify against the PHP/MySQL backend (falls back to local check offline)
    try {
      const r = await fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, password: pw }), credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok) {
        try { sessionStorage.setItem('gents_auth', 'admin'); sessionStorage.setItem('gents_staff', j.staff && j.staff.id || '') } catch (x) {}
        bootRemote(); location.href = 'admin.html'; return;
      }
      if (r.status === 401) { toast('Invalid admin credentials.'); return; }
    } catch (x) { /* backend unreachable — fall through to local check */ }
    const s = staffAll().find(x => (x.email || '').toLowerCase() === em.toLowerCase());
    if (!s || s.password !== pw || s.status === 'suspended') { toast('Invalid admin credentials.'); return; }
    try { sessionStorage.setItem('gents_auth', 'admin'); sessionStorage.setItem('gents_staff', s.id) } catch (x) {}
    location.href = 'admin.html'; return;
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
    db.settings = { name: v.name, phone: v.phone, whatsapp: v.whatsapp || v.phone, email: v.email, address: v.address };
    save(); toast('Settings saved.'); return;
  }
});

// ===== The Gent's — Client portal =====
// Injected inside app.js IIFE by _build.js. Overrides client() and adds
// cl-* actions + a capture-phase listener for client-side tab switching.

let clientView = 'overview';
const cp = () => db.clientProfile || (db.clientProfile = { name: 'T. Moyo', phone: '+263771234567', email: 'tmoyo@example.com', favBranch: '', favBarber: '' });
function clClient() { try { return JSON.parse(sessionStorage.getItem('gents_client') || 'null') } catch (e) { return null } }
function clEmail() { const c = clClient(); return (c && c.email) || '' }
const myBookings = () => { const em = clEmail(); return db.bookings.filter(b => em ? ((b.clientEmail && b.clientEmail === em) || (!b.clientEmail && cp().phone && b.phone === cp().phone)) : (b.clientCreated || (cp().phone && b.phone === cp().phone))) };
const clPoints = list => (list || myBookings()).filter(b => b.status === 'Completed').length * 100;

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
  ${show.map(b => `<div class="card" style="padding:20px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap"><div><div class="eyebrow" style="font-size:10px">${esc(b.id)}</div><h3 style="margin:6px 0 4px">${esc(service(b.service).name)}</h3><p class="muted small" style="margin:0">⌖ ${esc(branch(b.branch).name)} · ${esc(barber(b.barber).name)} · ${fmt(b.date)} at ${esc(b.time)}</p></div><div style="text-align:right"><div style="font-size:17px;font-weight:700;color:var(--gold)">${money(service(b.service).price)}</div><div style="margin:8px 0">${badge(b.status)}</div></div></div><div class="row-actions" style="margin-top:14px"><button class="btn btn-sm" data-action="cl-details:${b.id}">Details</button>${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn btn-sm" data-action="client-cancel:${b.id}">Cancel</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-sm" data-action="rebook:${b.id}">Rebook</button>` : ''}</div></div>`).join('') || `<div class="empty card">No ${clientTab === 'all' ? '' : clientTab} bookings yet. <a href="booking.html" style="color:var(--gold)">Book an appointment</a>.</div>`}`;
}

function clDetails(id) {
  const b = db.bookings.find(x => x.id === id); if (!b) return;
  const rows = [['Reference', b.id], ['Service', service(b.service).name + ' · ' + service(b.service).duration + ' min'], ['Price', money(service(b.service).price)], ['Branch', branch(b.branch).name], ['Barber', barber(b.barber).name], ['Date', fmt(b.date)], ['Time', b.time], ['Status', b.status]];
  modal('Appointment ' + esc(b.id), rows.map(([k, v]) => `<div class="data-line"><span class="muted">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="auth-actions" style="margin-top:18px">${b.status === 'Confirmed' || b.status === 'Pending' ? `<button class="btn" data-action="client-cancel:${b.id}">Cancel Booking</button>` : ''}${b.status === 'Completed' ? `<button class="btn btn-gold" data-action="rebook:${b.id}">Book Again</button>` : ''}</div>`);
}

// ---------- Rewards ----------
function clRewards(list) {
  const done = list.filter(b => b.status === 'Completed').sort((a, b) => a.date.localeCompare(b.date));
  const pts = done.length * 100;
  const tier = pts >= 800 ? 'Gold' : pts >= 300 ? 'Silver' : 'Bronze';
  const nextAt = pts >= 800 ? null : pts >= 300 ? 800 : 300;
  const pct = nextAt ? Math.min(100, Math.round(pts / nextAt * 100)) : 100;
  const perks = [['Bronze', '100 points per completed visit'], ['Silver', '10% off retail · priority booking'], ['Gold', 'Free beard trim monthly · early access']];
  const marks = ['◌', '◑', '●'];
  return `<div class="dash-top"><div><div class="eyebrow">LOYALTY</div><h1>Rewards</h1><p class="muted">Earn points every time you visit.</p></div></div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Your Tier · ${tier}</h3></div><div style="font-size:34px;font-weight:700;color:var(--gold)">${pts}<span class="small muted"> pts</span></div><div class="progress-row" style="margin-top:14px"><span>${nextAt ? nextAt + ' pts for ' + (pts >= 300 ? 'Gold' : 'Silver') : 'Top tier reached'}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><b>${pct}%</b></div><p class="muted small" style="margin-top:14px">100 points per completed appointment.</p></div>
  <div class="panel"><div class="panel-head"><h3>Perks</h3></div>${perks.map(([t, d], i) => `<div class="progress-row"><span>${marks[i]} ${t}</span><b class="small muted" style="font-weight:500">${d}</b></div>`).join('')}</div></div>
  <div class="panel"><div class="panel-head"><h3>Points History</h3></div>${done.map(b => `<div class="data-line"><span class="muted">${fmt(b.date)} · ${esc(service(b.service).name)}</span><b>+100 pts</b></div>`).join('') || '<p class="muted">Complete an appointment to start earning.</p>'}</div>`;
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
    <div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" placeholder="you@example.com"></div>
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

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, [c, ...p] = a.split(':'), v = p.join(':');
  if (c === 'cl-auth-mode') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = v; return clAuthModal(); }
  if (c === 'cl-register') { e.preventDefault(); e.stopImmediatePropagation(); clAuthMode = 'register'; return clAuthModal(); }
  if (c === 'cl-logout') {
    e.preventDefault(); e.stopImmediatePropagation();
    try { sessionStorage.removeItem('gents_auth'); sessionStorage.removeItem('gents_client'); sessionStorage.removeItem('gents_staff'); fetch('api/auth.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"logout"}', credentials: 'same-origin' }).catch(() => {}); } catch (x) {}
    location.href = 'login.html'; return;
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

// ---------- Permissions ----------
const PERM_LABELS = {
  dashboard: 'Dashboard', bookings: 'Bookings', calendar: 'Calendar',
  branches: 'Branches', staff_data: 'Barbers & Services', content: 'Content & Media',
  clients: 'Clients', reports: 'Reports', settings: 'Settings',
  usermgmt: 'User Management', staffmgmt: 'Staff Management', erp: 'Accounting & ERP'
};
const PERM_MAP = {
  overview: 'dashboard', bookings: 'bookings', calendar: 'calendar',
  branches: 'branches', barbers: 'staff_data', services: 'staff_data',
  content: 'content', clients: 'clients', reports: 'reports', settings: 'settings',
  users: 'usermgmt', staff: 'staffmgmt', erp: 'erp'
};
const STAFF_SEED = [{ id: 'admin1', username: 'Munyah', name: 'Munyah', email: 'munyah777@gmail.com', password: '@@Griezmann177#$', role: 'Super Admin', permissions: '*', protected: true, status: 'active', salary: 0, createdAt: '2026-01-01' }];
const ROLES = ['Receptionist', 'Manager', 'Super Admin'];

function safeSS(k) { try { return sessionStorage.getItem(k) } catch (e) { return null } }
function staffAll() { if (!Array.isArray(db.staff)) db.staff = JSON.parse(JSON.stringify(STAFF_SEED)); return db.staff; }
function admMe() { const l = staffAll(); return l.find(s => s.id === safeSS('gents_staff')) || l[0] || null; }
function myPerms() { const m = admMe(); if (!m) return []; return m.permissions === '*' ? ['*'] : (m.permissions || []); }
function admCan(tab) { const p = myPerms(); if (p.includes('*')) return true; const need = PERM_MAP[tab]; return need ? p.includes(need) : false; }
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
  return top + `<div class="panel"><div class="panel-head"><h3>Client Profiles (${list.length})</h3><div class="auth-actions">${ioButtons('clients', true)}${button('+ Add Client', 'usr-add', 'btn btn-gold btn-sm')}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Total Spend</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(c => { const bk = db.bookings.filter(b => (b.phone || b.email || b.name) === (c.phone || c.email || c.name)); const sp = spend[c.phone || c.email || c.name] || 0; const plat = sp >= 100; return `<tr><td><strong>${esc(c.name)}</strong>${plat ? ' <span class="badge status completed" style="font-size:9px">PLATINUM</span>' : ''}</td><td>${esc(c.phone || '—')}</td><td>${esc(c.email || '—')}</td><td>${bk.length}</td><td>${money(sp)}</td><td>${c.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="usr-edit:${c.id}">Edit</button><button class="btn btn-sm" data-action="usr-del:${c.id}">Del</button></div></td></tr>`; }).join('')}</tbody></table>${list.length ? '' : '<div class="empty">No client profiles yet.</div>'}</div></div>`;
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
  const permCount = s => s.permissions === '*' ? Object.keys(PERM_LABELS).length : (s.permissions || []).length;
  return top + `<div class="panel"><div class="panel-head"><h3>Staff & Admins (${list.length})</h3><div class="auth-actions">${ioButtons('staff', admMe() && (admMe().permissions === '*' || myPerms().includes('staffmgmt'))) }${button('+ Add Staff', 'stf-add', 'btn btn-gold btn-sm')}</div></div>
  <div class="table-wrap"><table><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Salary</th><th>Permissions</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(s => `<tr><td><strong>${esc(s.name)}</strong>${s.protected ? ' <span class="badge status confirmed" style="font-size:9px">OWNER</span>' : ''}</td><td>${esc(s.username)}</td><td>${esc(s.email)}</td><td>${esc(s.role)}</td><td>${money(s.salary || 0)}</td><td>${s.permissions === '*' ? 'All' : permCount(s) + ' modules'}</td><td>${s.status === 'active' ? '<span class="badge status completed">Active</span>' : '<span class="badge status cancelled">Suspended</span>'}</td><td><div class="row-actions"><button class="btn btn-sm" data-action="stf-edit:${s.id}">Edit</button>${s.protected ? '' : `<button class="btn btn-sm" data-action="stf-perms:${s.id}">Perms</button><button class="btn btn-sm" data-action="stf-del:${s.id}">Del</button>`}</div></td></tr>`).join('')}</tbody></table></div></div>`;
}

function stfForm(id) {
  const x = id ? staffAll().find(s => s.id === id) : { username: '', name: '', email: '', role: 'Receptionist', password: '', salary: 0, status: 'active' };
  if (id && !x) return;
  modal(id ? 'Edit Staff' : 'Add Staff', `<form id="stf-form"><input type="hidden" name="id" value="${esc(id || '')}"><div class="form-grid"><div class="form-group"><label class="form-label">Full name</label><input class="field" required name="name" value="${esc(x.name || '')}"></div><div class="form-group"><label class="form-label">Username</label><input class="field" required name="username" value="${esc(x.username || '')}"></div><div class="form-group"><label class="form-label">Email</label><input class="field" type="email" required name="email" value="${esc(x.email || '')}"></div><div class="form-group"><label class="form-label">Role</label><select class="field" name="role">${ROLES.map(r => `<option ${x.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">${id ? 'New password (blank = keep)' : 'Password'}</label><input class="field" type="password" name="password" ${id ? '' : 'required'}></div><div class="form-group"><label class="form-label">Monthly salary (USD)</label><input class="field" type="number" min="0" step="0.01" name="salary" value="${x.salary || 0}"></div><div class="form-group"><label class="form-label">Status</label><select class="field" name="status"><option value="active" ${x.status === 'active' ? 'selected' : ''}>Active</option><option value="suspended" ${x.status === 'suspended' ? 'selected' : ''}>Suspended</option></select></div></div><button class="btn btn-gold">${id ? 'Save Changes' : 'Add Staff'}</button></form>`);
}

function stfPerms(id) {
  const s = staffAll().find(x => x.id === id); if (!s || s.protected) return;
  const cur = s.permissions === '*' ? Object.keys(PERM_LABELS) : (s.permissions || []);
  modal('Permissions — ' + esc(s.name), `<form id="stf-perms-form"><input type="hidden" name="id" value="${esc(id)}"><p class="muted small" style="margin-top:0">Select which modules this staff member can access.</p><div style="display:grid;gap:8px;margin:14px 0">${Object.entries(PERM_LABELS).map(([k, label]) => `<label class="small" style="display:flex;gap:10px;align-items:center"><input type="checkbox" name="perm" value="${k}" ${cur.includes(k) ? 'checked' : ''}> <b>${label}</b></label>`).join('')}</div><button class="btn btn-gold">Save Permissions</button></form>`);
}

// =====================================================================
//  ACCOUNTING & ERP
// =====================================================================
function admErp(top) {
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
  <div class="segmented" style="margin-bottom:20px">${ERPTABS.map(([k, t]) => `<button class="pill ${erpTab === k ? 'active' : ''}" data-action="erp-tab:${k}">${t}</button>`).join('')}</div>
  <div class="stat-grid">${stats.map(([i, n, t]) => `<div class="stat"><span class="stat-icon">${i}</span><div class="number" style="font-size:20px">${n}</div><div class="small">${t}</div></div>`).join('')}</div>
  <div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Income vs Expenses · 6 months</h3><span class="small muted"><i style="display:inline-block;width:9px;height:9px;background:var(--gold);border-radius:2px"></i> income &nbsp;<i style="display:inline-block;width:9px;height:9px;background:#c0392b;border-radius:2px"></i> expense</span></div><div class="chart">${chart}</div></div>
  <div class="panel"><div class="panel-head"><h3>Opening Balance & Quick Actions</h3></div><form id="erp-opening" class="form-group" style="display:flex;gap:8px;align-items:end;margin-bottom:14px"><input class="field" type="number" step="0.01" name="opening" value="${a.openingBalance || 0}" style="max-width:160px"><button class="btn btn-sm">Set</button></form><div class="grid grid-3">${button('+ Income', 'erp-addtx:income', 'btn')}${button('+ Expense', 'erp-addtx:expense', 'btn')}${button('Run Payroll', 'erp-payroll-run', 'btn')}</div></div></div>
  <div class="panel"><div class="panel-head"><h3>Recent Transactions</h3><button class="btn btn-sm" data-action="erp-tab:transactions">View all</button></div>${recent.map(t => `<div class="data-line"><span class="muted">${esc(t.date)} · ${esc(t.description || t.category)}</span><b style="color:${t.type === 'income' ? 'var(--gold)' : '#e08a8a'}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</b></div>`).join('') || '<p class="muted">No transactions yet.</p>'}</div>`;
}

function erpTransactions(top) {
  const list = txList().slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const cats = [...new Set(txList().map(t => t.category).filter(Boolean))];
  return top + `<div class="panel"><div class="panel-head"><h3>Transactions (${list.length})</h3><div class="auth-actions">${button('+ Income', 'erp-addtx:income', 'btn btn-gold btn-sm')}${button('+ Expense', 'erp-addtx:expense', 'btn btn-sm')}${ioButtons('transactions', true)}</div></div>
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
  return top + `<div class="panel"><div class="panel-head"><h3>Payroll</h3><div class="auth-actions">${button('Run Payroll', 'erp-payroll-run', 'btn btn-gold btn-sm')}${ioButtons('payroll', true)}</div></div>
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
  modal('Payslip ' + esc(p.id), `<div class="payslip"><div class="payslip-head"><div><div class="eyebrow">THE GENT’S BARBER & GENTS SALON</div><h3>Payslip</h3></div><div class="small muted" style="text-align:right">${esc(p.month)}<br>${p.status === 'paid' ? 'PAID' : 'PENDING'}</div></div>
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

function ioButtons(entity, canImport) { const d = IO[entity]; if (!d) return ''; return `<span class="io-bar">${button('CSV', 'io-exp:' + entity + ':csv', 'btn btn-sm')}${button('Excel', 'io-exp:' + entity + ':xlsx', 'btn btn-sm')}${button('PDF', 'io-exp:' + entity + ':pdf', 'btn btn-sm')}${canImport && d.imp ? button('Import', 'io-imp:' + entity, 'btn btn-sm') : ''}</span>`; }

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
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action, parts = a.split(':'), c = parts[0];
  if (!['erp-', 'usr-', 'stf-', 'io-'].some(p => c.startsWith(p))) return;
  e.stopImmediatePropagation();
  const v = parts.slice(1).join(':');

  // --- tab switching ---
  if (c === 'erp-tab') { erpTab = v; return render(); }
  if (c === 'erp-cat') { admTxCat = v; return render(); }

  // --- user management ---
  if (c === 'usr-add') return usrForm();
  if (c === 'usr-edit') return usrForm(v);
  if (c === 'usr-del') { const x = clientProfiles().find(c => c.id === v); if (!x) return; if (!confirm('Delete client profile "' + x.name + '"?')) return; db.clientProfiles = clientProfiles().filter(c => c.id !== v); save(); toast('Client deleted.'); render(); return; }

  // --- staff management ---
  if (c === 'stf-add') return stfForm();
  if (c === 'stf-edit') return stfForm(v);
  if (c === 'stf-perms') return stfPerms(v);
  if (c === 'stf-del') { const x = staffAll().find(s => s.id === v); if (!x) return; if (x.protected) return toast('This account cannot be deleted.'); if (!confirm('Permanently delete ' + x.name + '?')) return; db.staff = staffAll().filter(s => s.id !== v); save(); toast('Staff removed.'); render(); return; }

  // --- erp ---
  if (c === 'erp-addtx') return txForm(v);
  if (c === 'erp-payroll-run') return runPayroll();
  if (c === 'erp-payslip') return payslip(v);
  if (c === 'erp-payslip-pdf') { const p = acct().payroll.find(x => x.id === v); if (p) payslipPDF(p); return; }
  if (c === 'erp-pay-paid') { const p = acct().payroll.find(x => x.id === v); if (p) { p.status = 'paid'; save(); toast('Payslip marked paid.'); closeModal(); render(); } return; }
  if (c === 'erp-petty-add') return pettyForm();
  if (c === 'erp-float') { const f = prompt('Set petty cash float amount (USD):', acct().pettyFloat || 0); if (f === null) return; acct().pettyFloat = Number(f) || 0; save(); toast('Float updated.'); render(); return; }
  if (c.startsWith('erp-hr:')) {
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
  if (c === 'io-exp') { const [, ent, fmt] = a.split(':'); doExport(ent, fmt); return; }
  if (c === 'io-imp') { const ent = v; doImport(ent); return; }
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
    if (v.id) { const x = staffAll().find(s => s.id === v.id); if (x) { Object.assign(x, { name: v.name, username: v.username, email: v.email.toLowerCase(), role: v.role, status: v.status, salary: Number(v.salary) || 0 }); if (v.password) x.password = v.password; } toast('Staff updated.'); }
    else { staffAll().push({ id: 'staff' + Date.now(), username: v.username, name: v.name, email: v.email.toLowerCase(), password: v.password, role: v.role, permissions: [], protected: false, status: v.status, salary: Number(v.salary) || 0, createdAt: new Date().toISOString().slice(0, 10) }); toast('Staff added — assign permissions from the Perms button.'); }
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
  doc.setFontSize(16); doc.text("The Gent's Barber & Gents Salon", 14, 18);
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

// ---------- Hero banners ----------
function heroPanel() {
  const slides = db.hero && db.hero.length ? db.hero : HE;
  return `<div class="panel"><div class="panel-head"><h3>Hero Banners (${slides.length})</h3><div class="auth-actions">${button('+ Add Slide', 'ct-hero-add', 'btn btn-gold btn-sm')}</div></div>
  <p class="muted small" style="margin-top:0">Slides appear in order on the homepage hero. The first slide shows on load.</p>
  <div class="ct-hero-list">${slides.map((s, i) => `<div class="ct-hero-item">
    <div class="ct-hero-img" style="background-image:url('${esc(s.photo || '')}')"></div>
    <div class="ct-hero-info"><strong>${esc(s.title || '(untitled)')}</strong><small class="muted">${esc(s.desc || '')}</small><small class="muted">Slide ${i + 1}</small></div>
    <div class="row-actions"><button class="btn btn-sm" data-action="ct-hero-up:${i}" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn btn-sm" data-action="ct-hero-down:${i}" ${i === slides.length - 1 ? 'disabled' : ''}>↓</button><button class="btn btn-sm" data-action="ct-hero-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-hero-del:${i}">Del</button></div>
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
  return `<div class="panel" style="margin-top:24px"><div class="panel-head"><h3>Gallery (${items.length})</h3><div class="auth-actions">${button('+ Add Image', 'ct-gal-add', 'btn btn-gold btn-sm')}</div></div>
  <p class="muted small" style="margin-top:0">Categories: ${cats.map(c => `<span class="badge status confirmed" style="margin-right:4px">${esc(c)}</span>`).join('') || '—'}</p>
  <div class="ct-gal-grid">${items.map((g, i) => `<div class="ct-gal-item">
    <img src="${esc(g.url)}" alt="${esc(g.alt || '')}" loading="lazy">
    <div class="ct-gal-info"><strong>${esc(g.alt || '(no caption)')}</strong><small class="muted">${esc(g.category || 'Uncategorised')}</small></div>
    <div class="row-actions"><button class="btn btn-sm" data-action="ct-gal-edit:${i}">Edit</button><button class="btn btn-sm" data-action="ct-gal-del:${i}">Delete</button></div>
  </div>`).join('')}</div></div>`;
}

function ctGalleryForm(i) {
  const g = i >= 0 ? (db.gallery || [])[i] : null;
  if (i >= 0 && !g) return;
  const cats = [...new Set(((db.gallery && db.gallery.length ? db.gallery : GE).map(x => x.category).filter(Boolean)))];
  modal(i >= 0 ? 'Edit Gallery Image' : 'Add Gallery Image', `<form id="ct-gal-form"><input type="hidden" name="idx" value="${i}">
  ${ctMediaField('Image', 'url', g ? g.url : '', 'https://… or /uploads/…')}
  <div class="form-group"><label class="form-label">Caption / alt text</label><input class="field" name="alt" value="${esc(g ? g.alt : '')}" placeholder="e.g. Barbershop interior"></div>
  <div class="form-group"><label class="form-label">Category</label><input class="field" name="category" list="ct-cats" value="${esc(g ? g.category : 'Salon')}" placeholder="Salon"><datalist id="ct-cats">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist></div>
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
    const item = { id: 'gal' + Date.now(), url: v.url, alt: v.alt || '', category: v.category || 'Salon' };
    const i = Number(v.idx);
    if (i >= 0 && db.gallery && db.gallery[i]) { const old = db.gallery[i]; item.id = old.id || item.id; db.gallery[i] = item; }
    else { if (!Array.isArray(db.gallery)) db.gallery = []; db.gallery.push(item); }
    save(); closeModal(); toast('Gallery image saved.'); render(); return;
  }
});

document.addEventListener('submit',e=>{let form=e.target;if(!['contact-form','walkin-form','branch-form','barber-form','service-form','edit-service-form','login-form'].includes(form.id))return;e.preventDefault();let v=Object.fromEntries(new FormData(form));if(form.id==='login-form'){try{sessionStorage.setItem('gents_auth',form.dataset.role==='admin'?'admin':'client')}catch(e){}location.href=form.dataset.role==='admin'?'admin.html':'client.html';return}if(form.id==='contact-form'){db.contacts.push(v);save();form.reset();return toast('Message saved locally. Branch email notification simulated.')}if(form.id==='walkin-form'){let b=db.barbers.find(x=>x.branch===v.branch&&x.services.includes(v.service));if(!b)return toast('No eligible barber found in this branch.');if(db.bookings.some(x=>x.branch===v.branch&&x.barber===b.id&&x.date===v.date&&x.time===v.time&&['Pending','Confirmed'].includes(x.status)))return toast('This appointment conflicts with an existing booking.');db.bookings.push({id:'GT-'+(1050+db.bookings.length)+'-'+Math.random().toString(36).slice(2,6),name:v.name,phone:'Walk-in',email:'—',branch:v.branch,service:v.service,barber:b.id,date:v.date,time:v.time,status:'Confirmed',source:'Walk-in'});toast('Walk-in registered and calendar updated.')}if(form.id==='branch-form'){let id=v.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Date.now().toString().slice(-4);db.branches.push({id,name:v.name,place:v.place,photo:IM.salon,hours:'Mon–Sat · 09:00–18:00'});toast('New branch created.')}if(form.id==='barber-form'){db.barbers.push({id:'barber'+Date.now(),name:v.name,branch:v.branch,role:'Barber',photo:IM.barber1,services:db.services.map(x=>x.id)});toast('Barber added to the team.')}if(form.id==='service-form'){db.services.push({id:'srv'+Date.now(),name:v.name,desc:'Grooming service',icon:'✂',duration:Number(v.duration),price:Number(v.price),branches:db.branches.map(x=>x.id)});toast('Service added.')}if(form.id==='edit-service-form'){let s=service(v.id);s.name=v.name;s.price=Number(v.price);toast('Service updated.')}save();closeModal();render()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});if(page==='branch'){const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));if(!h){page='home';location.replace('index.html')}else page='branch:'+h}try{const fp2=(location.pathname.split('/').pop()||'');const bp=fp2==='booking.html'&&sessionStorage.getItem('gents_booking_preset');if(bp){sessionStorage.removeItem('gents_booking_preset');resetBooking(JSON.parse(bp))}}catch(e){}bootRemote();render();
})();
