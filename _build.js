const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'prototype.html');
const html = fs.readFileSync(SRC, 'utf8');

// --- Extract CSS and JS ---
const cssReps = [
  // full-width hero: no side gap, no top gap, taller, centered content
  ['.slider-hero{position:relative;min-height:440px;margin:30px 0 28px;border-radius:16px;overflow:hidden;background:#242322;color:#fff;isolation:isolate}',
   '.slider-hero{position:relative;min-height:560px;margin:0 0 28px;border-radius:0;overflow:hidden;background:#242322;color:#fff;isolation:isolate;display:flex;align-items:center;justify-content:center}'],
  ['.slider-content{position:relative;z-index:2;padding:73px 68px 95px;max-width:750px}',
   '.slider-content{position:relative;z-index:2;padding:73px 68px 95px;max-width:750px;width:100%;text-align:center}'],
  ['.slider-content p{font-size:16px;max-width:480px;color:#f5f3ee;line-height:1.6}',
   '.slider-content p{font-size:16px;max-width:480px;color:#f5f3ee;line-height:1.6;margin-left:auto;margin-right:auto}'],
  ['.slider-content .hero-actions{margin:26px 0 0}',
   '.slider-content .hero-actions{margin:26px 0 0;justify-content:center}'],
  ['.slider-hero{min-height:460px;margin:15px 0 20px}',
   '.slider-hero{min-height:540px;margin:0 0 20px}'],
];
let css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
for (const [a, b] of cssReps) {
  if (!css.includes(a)) throw new Error('CSS pattern not found: ' + a.slice(0, 60));
  css = css.replace(a, b);
}
let js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// --- Adapt JS for multipage ---
const reps = [
  // page comes from each file's <body data-page="...">
  ["let page='home',dark=", "let page=document.body.dataset.page||'home',dark="],

  // hero slider spans full viewport width (outside .shell container)
  ["function home(){return `<div class=\"shell\">${heroMarkup()}", "function home(){return `${heroMarkup()}<div class=\"shell\">"],

  // real navigation: map page names to files; branch pages use hash
  ["function navigate(p){page=p;window.scrollTo({top:0,behavior:'instant'});render()}",
   "function navigate(p){if(p.startsWith('branch:')){location.href='branch.html#'+p.slice(7);return}const f={home:'index.html',services:'services.html',barbers:'barbers.html',gallery:'gallery.html',contact:'contact.html',login:'login.html',booking:'booking.html',client:'client.html',admin:'admin.html',confirmation:'booking.html'}[p]||'index.html';const fp=(location.pathname.split('/').pop()||'index.html');if(f===fp){page=p;window.scrollTo({top:0,behavior:'instant'});render()}else location.href=f}"],

  // booking presets cross pages via sessionStorage
  ["if(cmd==='start-booking')return resetBooking()",
   "if(cmd==='start-booking'){try{sessionStorage.removeItem('gents_booking_preset')}catch(e){}location.href='booking.html';return}"],
  ["if(cmd==='book-branch')return resetBooking({branch:val})",
   "if(cmd==='book-branch'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:val}))}catch(e){}location.href='booking.html';return}"],
  ["if(cmd==='book-service')return resetBooking({service:val})",
   "if(cmd==='book-service'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({service:val}))}catch(e){}location.href='booking.html';return}"],
  ["if(cmd==='book-barber'){let b=barber(val);return resetBooking({branch:b.branch,barber:val})}",
   "if(cmd==='book-barber'){let b=barber(val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,barber:val}))}catch(e){}location.href='booking.html';return}"],
  ["if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);return resetBooking({branch:b.branch,service:b.service,barber:b.barber})}",
   "if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,service:b.service,barber:b.barber}))}catch(e){}location.href='booking.html';return}"],

  // --- auth helper (session flag per role) ---
  ["const esc=(s)=>String(s??'')",
   "const auth=(r)=>{try{return sessionStorage.getItem('gents_auth')===r}catch(e){return false}};const esc=(s)=>String(s??'')"],

  // --- header: drop Membership/My Bookings/Admin Demo, add Login ---
  ["['gallery','Gallery'],['membership','Membership'],['contact','Contact']]",
   "['gallery','Gallery'],['contact','Contact']]"],
  // Login becomes a button next to Book Now (nav-actions)
  ["<button class=\"btn btn-gold\" data-action=\"start-booking\">Book Now</button>",
   "<button class=\"btn\" data-page=\"login\">Login</button><button class=\"btn btn-gold\" data-action=\"start-booking\">Book Now</button>"],
  ["<button data-page=\"client\" class=\"navlink ${page==='client'?'active':''}\">My Bookings</button><button data-page=\"admin\" class=\"navlink ${page==='admin'?'active':''}\">Admin Demo</button>", ""],

  // --- footer: 4-column widget layout (markup lives in prototype.html footer()) ---

  // --- home: remove membership promo section ---
  ["<section class=\"section-tight\"><div class=\"member-section\"><div class=\"member-section-copy\"><div class=\"eyebrow\">THE GENT’S MEMBERSHIP</div><h2>More than a haircut.</h2><p>Exclusive benefits, priority booking and a better grooming experience.</p>${button('Explore Membership →','go:membership','btn btn-gold')}</div>${membershipCard()}</div></section>", ""],

  // --- remove membership() page function ---
  ["function membership(){return `<div class=\"shell\"><div class=\"page-head\"><div class=\"eyebrow\">THE GENT’S CLUB</div><h1>Membership</h1><p>Exclusive benefits for our loyal clients.</p></div><div class=\"member-section member-page-section\"><div class=\"member-section-copy\"><div class=\"eyebrow\">A LITTLE SOMETHING EXTRA</div><h2>More than a haircut.</h2><p>A premium experience, with benefits worth coming back for.</p><div class=\"member-benefits\"><span>✓ Member-only offers</span><span>✓ Priority booking</span><span>✓ Exclusive experiences</span><span>✓ Early access to new services</span></div>${button(db.membership?'Membership Requested ✓':'Join Membership →','join-membership','btn btn-gold')}<p class=\"muted small\" style=\"margin-top:18px\">Illustrative card and demo enquiry. Actual plans will be defined by The Gent’s.</p></div>${membershipCard()}</div></div>`}", ""],

  // --- render map: drop membership, add login ---
  ["({home,services,barbers,gallery,membership,contact,booking:bookingPage,client,admin,confirmation:confirmPage})",
   "({home,services,barbers,gallery,contact,booking:bookingPage,client,admin,login,confirmation:confirmPage})"],

  // --- page title: drop (Demo) suffix ---
  ["document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)} (Demo)`;",
   "document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)}`;"],

  // --- login + loginCard functions (inserted before confirmPage) ---
  ["function confirmPage(){",
   "function login(){return loginCard('client')}function loginCard(role){const admin=role==='admin';return `<div class=\"shell\" style=\"max-width:560px\"><div class=\"page-panel\" style=\"margin:60px auto\"><div class=\"eyebrow\">${admin?'ADMIN PORTAL':'CLIENT PORTAL'}</div><h2 style=\"margin:12px 0 6px\">Sign In</h2><p class=\"muted\">${admin?'Sign in to the management dashboard.':'Sign in to view and manage your bookings.'}</p><form id=\"login-form\" data-role=\"${role}\"><div class=\"form-group\"><label class=\"form-label\">Email</label><input class=\"field\" type=\"email\" required name=\"email\" placeholder=\"you@example.com\"></div><div class=\"form-group\"><label class=\"form-label\">Password</label><input class=\"field\" type=\"password\" required name=\"password\" placeholder=\"Enter your password\"></div><button class=\"btn btn-gold\" type=\"submit\" style=\"width:100%\">Sign In →</button></form><p class=\"muted small\" style=\"margin-top:20px;text-align:center\">${admin?'Client? <a href=\"login.html\" style=\"color:var(--gold)\">Go to client login</a> · <a href=\"index.html\" style=\"color:var(--gold)\">Back to site</a>':'New here? <a href=\"booking.html\" style=\"color:var(--gold)\">Book an appointment</a>'}</p></div></div>`}function confirmPage(){"],

  // --- client portal: auth gate, drop membership bits, de-demo ---
  ["function client(){let list=", "function client(){if(!auth('client')){location.replace('login.html');return''}let list="],
  [" Demo account: T. Moyo.", ""],
  ["Try the booking demo to add one.", "Try booking an appointment to add one."],
  ["<div class=\"page-panel\" style=\"margin-top:30px\"><h3>Membership</h3><p class=\"muted\">${db.membership?'Your membership enquiry has been recorded.':'Discover The Gent’s membership benefits.'}</p>${button('Explore Membership','go:membership')}</div>", ""],
  ["[[\"mybookings\",\"My Bookings\",\"▢\"],[\"membership\",\"Membership\",\"♛\"],[\"profile\",\"Profile\",\"♙\"]]",
   "[[\"mybookings\",\"My Bookings\",\"▢\"],[\"profile\",\"Profile\",\"♙\"]]"],
  ["if(cmd==='client-side'){if(val==='membership')return navigate('membership');if(val==='profile')return toast('Demo profile: T. Moyo. Changes to profile are not enabled in this prototype.');return render()}",
   "if(cmd==='client-side'){if(val==='profile')return toast('Profile changes are not enabled yet.');return render()}"],

  // --- admin: auth gate before dashboard ---
  ["function admin(){return dashboardFrame('admin',adminBody())}",
   "function admin(){return auth('admin')?dashboardFrame('admin',adminBody()):loginCard('admin')}"],

  // --- business settings in seed data ---
  ["gallery:GE.map(x=>({...x}))}",
   "gallery:GE.map(x=>({...x})),settings:{name:'The Gent’s',phone:'+263 77 601 1938',email:'admin@thegents.co.zw',whatsapp:'+263776011938',address:'Fife Avenue & Borrowdale, Harare'}}"],

  // --- de-demo remaining labels ---
  ["This is a demo: notifications are simulated.", "Notifications are simulated."],
  ["'Interactive demo · changes are saved in your browser.'", "'Changes are saved in your browser.'"],
  ["button('Reset Demo','reset','btn btn-sm')", "button('Reset Data','reset','btn btn-sm')"],
  ["<h3>Demo Settings</h3>", "<h3>Settings</h3>"],
  ["Add Demo Branch", "Add Branch"],
  ["Add Demo Barber", "Add Barber"],

  // --- footer credit: link to Global Space Web ---
  ["<small>© 2026 The Gent’s · Interactive concept only</small>",
   "<small>© 2026 The Gent’s · Interactive concept only · Developed and Powered By <a href=\"https://www.globalspaceweb.co.zw\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--gold)\">Global Space Web</a></small>"],

  // --- remaining visible 'demo' strings ---
  ["Available times are illustrative and reflect demo bookings.", "Available times are illustrative."],
  ["'Actual demo bookings'", "'Actual bookings'"],
  ["bookings reflect the interactive demo.", "bookings reflect actual data."],
  ["<b>Demo action</b>", "<b>Notification</b>"],
  ["Cancel this booking in the demo?", "Cancel this booking?"],
  ["Reset all demo data, bookings and changes?", "Reset all data, bookings and changes?"],

  // --- dead membership card helper (page removed) ---
  ["function membershipCard(){return `<div class=\"membership-card\" role=\"img\" aria-label=\"Illustration of The Gent’s membership card\"><div class=\"member-card-glow\"></div><div class=\"member-card-top\"><span class=\"member-card-mark\">✂</span><span>MEMBER</span></div><div class=\"member-card-brand\">The Gent’s</div><div class=\"member-card-caption\">BARBER & GENTS SALON</div><div class=\"member-card-bottom\"><span>THE GENT’S CLUB</span><span>✦ ✦ ✦</span></div></div>`}", ""],

  // --- booking submit signs the client in so 'My Bookings' works ---
  ["db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);save();return navigate('confirmation')",
   "db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);try{sessionStorage.setItem('gents_auth','client')}catch(e){}save();return navigate('confirmation')"],

  // --- login form handling ---
  ["['contact-form','walkin-form','branch-form','barber-form','service-form','edit-service-form']",
   "['contact-form','walkin-form','branch-form','barber-form','service-form','edit-service-form','login-form']"],
  ["if(form.id==='contact-form'){db.contacts.push(v)",
   "if(form.id==='login-form'){try{sessionStorage.setItem('gents_auth',form.dataset.role==='admin'?'admin':'client')}catch(e){}location.href=form.dataset.role==='admin'?'admin.html':'client.html';return}if(form.id==='contact-form'){db.contacts.push(v)"],

  // --- loginCard: add Create account link for clients ---
  ["Book an appointment</a>'}", "Book an appointment</a> · <a href=\"#\" data-action=\"cl-register\" style=\"color:var(--gold)\">Create account</a>'}"],

  // --- client profile in seed data ---
  ["address:'Fife Avenue & Borrowdale, Harare'}}",
   "address:'Fife Avenue & Borrowdale, Harare'},clientProfile:{name:'T. Moyo',phone:'+263771234567',email:'tmoyo@example.com',favBranch:'',favBarber:''}}"],

  // --- fix: closest() matched <body data-page> on every click, causing a full
  // re-render that wiped form fields. Exclude document.body from matches. ---
  ["if(!el)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}",
   "if(!el||el===document.body)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}"],

  // init: resolve branch hash + pending booking preset before first render
  ["document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});render();",
   "document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});if(page==='branch'){const h=decodeURIComponent(location.hash.replace(/^#\\/?/,''));if(!h){page='home';location.replace('index.html')}else page='branch:'+h}try{const fp2=(location.pathname.split('/').pop()||'');const bp=fp2==='booking.html'&&sessionStorage.getItem('gents_booking_preset');if(bp){sessionStorage.removeItem('gents_booking_preset');resetBooking(JSON.parse(bp))}}catch(e){}bootRemote();render();"]
];

for (const [a, b] of reps) {
  if (!js.includes(a)) throw new Error('Pattern not found: ' + a.slice(0, 70));
  js = js.replace(a, b);
}

// --- Inject admin portal code + styles ---
const adminExtra = fs.readFileSync(path.join(ROOT, 'src', 'admin-extra.js'), 'utf8');
const clientExtra = fs.readFileSync(path.join(ROOT, 'src', 'client-extra.js'), 'utf8');
const erpExtra = fs.readFileSync(path.join(ROOT, 'src', 'erp-extra.js'), 'utf8');
const contentExtra = fs.readFileSync(path.join(ROOT, 'src', 'content-extra.js'), 'utf8');
const adminCss = fs.readFileSync(path.join(ROOT, 'src', 'admin.css'), 'utf8');
js = js.replace("document.addEventListener('submit',e=>{", () => adminExtra + "\n" + clientExtra + "\n" + erpExtra + "\n" + contentExtra + "\n" + "document.addEventListener('submit',e=>{");
css += '\n' + adminCss;
// Hero slide titles: single row, scales with viewport width
css += '\n.slider-content h1{white-space:nowrap;font-size:clamp(15px,4.6vw,44px)}\n';
// Mobile responsiveness pass (loaded last so it wins)
css += '\n' + fs.readFileSync(path.join(ROOT, 'src', 'mobile.css'), 'utf8');

// --- Write assets ---
fs.mkdirSync(path.join(ROOT, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'assets', 'js'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets', 'css', 'style.css'), css.trim() + '\n');
fs.writeFileSync(path.join(ROOT, 'assets', 'js', 'app.js'), js);

// --- Generate pages ---
const tpl = (dp, title) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>The Gent’s · ${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="${dp}">
<div id="app"></div><div id="modal-root"></div><div id="toast-root"></div>
<script src="assets/js/app.js"></script>
</body>
</html>
`;

const pages = [
  ['index.html', 'home', 'Home'],
  ['services.html', 'services', 'Services'],
  ['barbers.html', 'barbers', 'Barbers'],
  ['gallery.html', 'gallery', 'Gallery'],
  ['contact.html', 'contact', 'Contact'],
  ['login.html', 'login', 'Login'],
  ['booking.html', 'booking', 'Book Appointment'],
  ['client.html', 'client', 'My Bookings'],
  ['admin.html', 'admin', 'Admin'],
  ['branch.html', 'branch', 'Branch'],
];

for (const [file, dp, title] of pages) {
  fs.writeFileSync(path.join(ROOT, file), tpl(dp, title));
  console.log('wrote', file);
}
console.log('done');
