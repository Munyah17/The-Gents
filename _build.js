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
   "function navigate(p){if(p.startsWith('branch:')){location.href='branch#'+p.slice(7);return}const f={home:'index',services:'services',barbers:'barbers',gallery:'gallery',membership:'membership',contact:'contact',login:'login',booking:'booking',client:'client',admin:'admin',confirmation:'booking'}[p]||'index';const fp=(location.pathname.split('/').pop()||'index');if(f===fp){page=p;window.scrollTo({top:0,behavior:'instant'});render()}else location.href=f}"],

  // booking presets cross pages via sessionStorage
  ["if(cmd==='start-booking')return resetBooking()",
   "if(cmd==='start-booking'){try{sessionStorage.removeItem('gents_booking_preset')}catch(e){}location.href='booking';return}"],
  ["if(cmd==='book-branch')return resetBooking({branch:val})",
   "if(cmd==='book-branch'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:val}))}catch(e){}location.href='booking';return}"],
  ["if(cmd==='book-service')return resetBooking({service:val})",
   "if(cmd==='book-service'){try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({service:val}))}catch(e){}location.href='booking';return}"],
  ["if(cmd==='book-barber'){let b=barber(val);return resetBooking({branch:b.branch,barber:val})}",
   "if(cmd==='book-barber'){let b=barber(val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,barber:val}))}catch(e){}location.href='booking';return}"],
  ["if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);return resetBooking({branch:b.branch,service:b.service,barber:b.barber})}",
   "if(cmd==='rebook'){let b=db.bookings.find(x=>x.id===val);try{sessionStorage.setItem('gents_booking_preset',JSON.stringify({branch:b.branch,service:b.service,barber:b.barber}))}catch(e){}location.href='booking';return}"],

  // --- auth helper (session flag per role) ---
  ["const esc=(s)=>String(s??'')",
   "const auth=(r)=>{try{return sessionStorage.getItem('gents_auth')===r}catch(e){return false}};const esc=(s)=>String(s??'')"],

  // Login becomes a button next to Book Now (nav-actions)
  ["<button class=\"btn btn-gold\" data-action=\"start-booking\">Book Now</button>",
   "<button class=\"btn\" data-page=\"login\">Login</button><button class=\"btn btn-gold\" data-action=\"start-booking\">Book Now</button>"],
  ["<button data-page=\"client\" class=\"navlink ${page==='client'?'active':''}\">My Bookings</button><button data-page=\"admin\" class=\"navlink ${page==='admin'?'active':''}\">Admin Demo</button>", ""],

  // --- footer: 4-column widget layout (markup lives in prototype.html footer()) ---

  // --- render map: keep membership, add login ---
  ["({home,services,barbers,gallery,membership,contact,booking:bookingPage,client,admin,confirmation:confirmPage})",
   "({home,services,barbers,gallery,membership,contact,booking:bookingPage,client,admin,login,confirmation:confirmPage})"],

  // --- page title: drop (Demo) suffix ---
  ["document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)} (Demo)`;",
   "document.title=`The Gent’s · ${page.charAt(0).toUpperCase()+page.slice(1)}`;"],

  // --- login + loginCard functions (inserted before confirmPage) ---
  ["function confirmPage(){",
   "function login(){if(auth('admin')){location.replace('admin');return''}if(auth('client')){location.replace('client');return''}return loginCard('client')}function loginCard(role){const admin=role==='admin';return `<div class=\"shell\" style=\"max-width:560px\"><div class=\"page-panel\" style=\"margin:60px auto\"><div class=\"eyebrow\">${admin?'ADMIN PORTAL':'CLIENT PORTAL'}</div><h2 style=\"margin:12px 0 6px\">Sign In</h2><p class=\"muted\">${admin?'Sign in to the management dashboard.':'Sign in to view and manage your bookings.'}</p><form id=\"login-form\" data-role=\"${role}\"><div class=\"form-group\"><label class=\"form-label\">${admin?'Email or username':'Email, name or pseudonym'}</label><input class=\"field\" type=\"text\" required name=\"email\" placeholder=\"you@example.com · Alex Demo · AD\"></div><div class=\"form-group\"><label class=\"form-label\">Password</label><input class=\"field\" type=\"password\" required name=\"password\" placeholder=\"Enter your password\"></div><button class=\"btn btn-gold\" type=\"submit\" style=\"width:100%\">Sign In →</button></form><p class=\"muted small\" style=\"margin-top:20px;text-align:center\">${admin?'<a href=\"login\" style=\"color:var(--gold)\">Client sign in</a>':'<a href=\"admin\" style=\"color:var(--gold)\">Staff / Admin sign in</a><br><br>New here? <a href=\"booking\" style=\"color:var(--gold)\">Book an appointment</a>'}</p></div></div>`}function confirmPage(){"],

  // --- client portal: auth gate, drop membership bits, de-demo ---
  ["function client(){let list=", "function client(){if(!auth('client')){location.replace('login');return''}let list="],
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
   "gallery:GE.map(x=>({...x})),settings:{name:'The Gent’s',phone:'+263 79 052 0449',email:'admin@thegents.co.zw',whatsapp:'+263 79 052 0449',address:'Kudu Corner & Five Avenue, Harare',logo:'/uploads/logo-the-gents.jpg',social:{facebook:'https://www.facebook.com/share/1E9i4XqKWj/',instagram:'https://www.instagram.com/gents_cut_and_shaves',tiktok:'https://www.tiktok.com/@thegentscutandshaves'}}}"],

  // --- de-demo remaining labels ---
  ["This is a demo: notifications are simulated.", "Notifications are simulated."],
  ["'Interactive demo · changes are saved in your browser.'", "'Changes are saved in your browser.'"],
  ["button('Reset Demo','reset','btn btn-sm')", "button('Reset Data','reset','btn btn-sm')"],
  ["<h3>Demo Settings</h3>", "<h3>Settings</h3>"],
  ["Add Demo Branch", "Add Branch"],
  ["Add Demo Barber", "Add Barber"],

  // --- footer credit: link to Global Space Web ---
  ["<small>© 2026 The Gents Cut & Shave. All Rights Reserved.</small>",
   "<small>© 2026 The Gents Cut & Shave. All Rights Reserved. Developed and Powered By <a href=\"https://www.globalspaceweb.co.zw\" target=\"_blank\" rel=\"noopener\" style=\"color:var(--gold)\">Global Space Web</a>. <a href=\"tel:+263773909307\" style=\"color:var(--gold)\">+263773909307</a></small>"],

  // --- remaining visible 'demo' strings ---
  ["Available times are illustrative and reflect demo bookings.", "Available times are illustrative."],
  ["'Actual demo bookings'", "'Actual bookings'"],
  ["bookings reflect the interactive demo.", "bookings reflect actual data."],
  ["<b>Demo action</b>", "<b>Notification</b>"],
  ["Cancel this booking in the demo?", "Cancel this booking?"],
  ["Reset all demo data, bookings and changes?", "Reset all data, bookings and changes?"],

  // --- booking submit signs the client in so 'My Bookings' works ---
  ["db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);save();return navigate('confirmation')",
   "db.notifications.unshift('New booking '+booking.id+' for '+branch(booking.branch).name);try{sessionStorage.setItem('gents_auth','client')}catch(e){}save();return navigate('confirmation')"],

  // --- loginCard: add Create account link for clients ---
  ["Book an appointment</a>'}", "Book an appointment</a> · <a href=\"#\" data-action=\"cl-register\" style=\"color:var(--gold)\">Create account</a>'}"],

  // --- client profile in seed data ---
  ["tiktok:'https://www.tiktok.com/@thegentscutandshaves'}}",
   "tiktok:'https://www.tiktok.com/@thegentscutandshaves'},clientProfile:{name:'',phone:'',email:'',favBranch:'',favBarber:''}}"],

  // --- fix: closest() matched <body data-page> on every click, causing a full
  // re-render that wiped form fields. Exclude document.body from matches. ---
  ["if(!el)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}",
   "if(!el||el===document.body)return;if(el.dataset.action){e.preventDefault();handle(el.dataset.action)}else if(el.dataset.page){e.preventDefault();navigate(el.dataset.page)}"],

  // init: resolve branch hash + pending booking preset + session check before first render
  ["bootRender();",
   "if(page==='branch'){const h=decodeURIComponent(location.hash.replace(/^#\\/?/,''));if(!h){page='home';location.replace('index')}else page='branch:'+h}try{const fp2=(location.pathname.split('/').pop()||'');const bp=fp2==='booking'&&sessionStorage.getItem('gents_booking_preset');if(bp){sessionStorage.removeItem('gents_booking_preset');resetBooking(JSON.parse(bp))}}catch(e){}bootRemote();bootRender();"]
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
const membershipExtra = fs.readFileSync(path.join(ROOT, 'src', 'membership-extra.js'), 'utf8');
const adminCss = fs.readFileSync(path.join(ROOT, 'src', 'admin.css'), 'utf8');
js = js.replace("document.addEventListener('submit',e=>{", () => adminExtra + "\n" + clientExtra + "\n" + erpExtra + "\n" + contentExtra + "\n" + membershipExtra + "\n" + "document.addEventListener('submit',e=>{");
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
// Auto-version assets by content hash so browsers never serve stale bundles
const crypto = require('crypto');
const V = crypto.createHash('md5').update(css + js).digest('hex').slice(0, 8);
const tpl = (dp, title) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>The Gent’s · ${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
</head>
<body data-page="${dp}">
<div id="app"></div><div id="modal-root"></div><div id="toast-root"></div>
<script src="assets/js/app.js?v=${V}"></script>
</body>
</html>
`;

const pages = [
  ['index.html', 'home', 'Home'],
  ['services.html', 'services', 'Services'],
  ['barbers.html', 'barbers', 'Barbers'],
  ['gallery.html', 'gallery', 'Gallery'],
  ['membership.html', 'membership', 'Membership'],
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
