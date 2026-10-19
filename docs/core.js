/* Baille — núcleo (dados, armazenamento e motor de áudio) */
window.__mkD = function (__PAGE) {
return (function () {
const IMG = {
aurora: 'assets/img/d813e62d5c8b66d6fa6ec0c37661c22c.jpg',
concert: 'assets/img/512173f320a962dd6231e8ccf43557cc.jpg',
dunes: 'assets/img/11cf6664d3d1f7fa0dcbb08098062e81.jpg',
forest: 'assets/img/b3d1a6fd3111318d4ebfa2eeddcfe0f3.jpg',
mesh: 'assets/img/0fa9fdc5f97bc211e09a5a3799ab9d15.jpg',
moon: 'assets/img/c3199d77a11783e6a78ec720fa6bf07c.jpg',
mountains: 'assets/img/26342e7a23d5546bb7eb29b812b221a4.jpg',
neoncity: 'assets/img/bdd37665b9e1c4b97d8b059e4ae4eedf.jpg',
ocean: 'assets/img/272bb6da656926663d339c4c4c4e6936.jpg',
palms: 'assets/img/241e6e7b669dd71115f601ca339bbea3.jpg',
clouds: 'assets/img/0f65c4968c16ff1a50fe2bd5861f14d8.jpg',
rain: 'assets/img/63063adb99a9161be2a5387c9b0fa08e.jpg',
smoke: 'assets/img/7ef6f21b90cfeb98e0cf085369a828c4.jpg',
sunset: 'assets/img/704e9d0575715279495d1fddc9366f12.jpg',
trails: 'assets/img/2911cab02adf9285e5501648e0710819.jpg',
vinyl: 'assets/img/b13c397a85297c353da79005a2d4586d.jpg'
};
const imgSrc = (v, fb) => { if (!v) return IMG[fb || 'mesh']; if (String(v).indexOf('data:') === 0) return v; return IMG[v] || IMG[fb || 'mesh']; };
const PAGE = __PAGE;
const DATA_V = '4';
try { const ls = window.localStorage; if (ls.getItem('baille:dataV') !== DATA_V) { const ks = []; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.indexOf('baille:') === 0) ks.push(k); } ks.forEach((k) => ls.removeItem(k)); ls.setItem('baille:dataV', DATA_V); } } catch (e) {}
const STORE = {
get(k, d) { try { const v = window.localStorage.getItem('baille:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
set(k, v) { try { window.localStorage.setItem('baille:' + k, JSON.stringify(v)); window.localStorage.setItem('baille:rev', JSON.stringify({ t: Date.now() + Math.random(), by: PAGE, k })); } catch (e) {} },
watch(fn) { let last = null; try { last = window.localStorage.getItem('baille:rev'); } catch (e) {} return setInterval(() => { let v = null; try { v = window.localStorage.getItem('baille:rev'); } catch (e) { return; } if (v !== last) { last = v; let by = ''; try { by = JSON.parse(v).by; } catch (e) {} if (by !== PAGE) fn(); } }, 400); }
};
const plan = () => STORE.get('plan', { pro: false }) || { pro: false };
const isPro = () => !!plan().pro;
const today = () => new Date().toISOString().slice(0, 10);
const created = () => { const c = STORE.get('created', null); return c && c.day === today() ? c.n : 0; };
const FREE_DAILY = 2;
const canCreate = () => isPro() || created() < FREE_DAILY;
const countCreate = () => { STORE.set('created', { day: today(), n: created() + 1 }); };
const createLabel = () => isPro() ? 'Pro · sem limite' : Math.min(created(), FREE_DAILY) + ' de ' + FREE_DAILY + ' hoje';
const maxDur = () => isPro() ? 600 : 300;
const favs = () => STORE.get('favPacks', []) || [];
const toggleFav = (id) => { const f = favs(); const on = f.includes(id); STORE.set('favPacks', on ? f.filter((x) => x !== id) : [id, ...f]); return !on; };
const PRO_TXT = {
voice: ['Gravar sua voz é do Pro', 'Cante, fale ou faça sons e coloque na sua música.'],
pack: ['Modelo exclusivo do Pro', 'Modelos Pro têm arranjos maiores e sons exclusivos.'],
fx: ['Efeito exclusivo do Pro', 'Afinador, reverso, stutter e freio de fita ficam liberados no Pro.'],
limit: ['Você usou as 2 criações de hoje', 'No Pro você cria quantas músicas quiser, todos os dias.'],
cover: ['Efeito de capa do Pro', 'Duotone, VHS e glitch deixam a capa com a sua cara.'],
mark: ['Tirar a marca d’água é do Pro', 'Publique sem o selo Baille na capa e no nome.'],
dur: ['Músicas maiores no Pro', 'No gratuito a música vai até 5:00. No Pro, até 10:00.']
};
const ME_DEFAULT = { name: 'Novo usuário', handle: 'novo.usuario', bio: '', color: '#8B7BFF', avatar: null, cover: 'mesh' };
const follows = () => STORE.get('follows', {}) || {};
const getMe = () => { const m = { ...ME_DEFAULT, ...(STORE.get('me', {}) || {}) }; if (m.avatar && String(m.avatar).indexOf('data:') !== 0) m.avatar = null; return m; };
const avatarSrc = (v) => (v && String(v).indexOf('data:') === 0 ? v : '');
const initials = (n) => String(n || '?').trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
const FONTS = [
{ id: 'unbounded', name: 'Unbounded', css: 'Unbounded, sans-serif', w: '800', scale: 1 },
{ id: 'bebas', name: 'Bebas', css: '"Bebas Neue", Impact, sans-serif', w: '400', scale: 1.35 },
{ id: 'playfair', name: 'Playfair', css: '"Playfair Display", Georgia, serif', w: '700', scale: 1.1 },
{ id: 'marker', name: 'Marker', css: '"Permanent Marker", cursive', w: '400', scale: 1.05 },
{ id: 'mono', name: 'Mono', css: '"Space Mono", monospace', w: '700', scale: 0.95 },
{ id: 'pacifico', name: 'Pacifico', css: 'Pacifico, cursive', w: '400', scale: 1 },
{ id: 'anton', name: 'Anton', css: 'Anton, Impact, sans-serif', w: '400', scale: 1.2 },
{ id: 'caveat', name: 'Caveat', css: 'Caveat, cursive', w: '700', scale: 1.4 }
];
const INST = {
beat: { name: 'Bateria', color: '#FF7A3D', icon: 'M4 10c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 10v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M9 13v6M15 13v6M6 2l5 6M18 2l-5 6' },
sub: { name: '808', color: '#E0643A', icon: 'M5 3h14v18H5zM12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 7h.01' },
bass: { name: 'Baixo', color: '#8B7BFF', icon: 'M20 2l2 2-1.5 1.5-2-2zM18.5 3.5l-7 7M11.5 10.5c-1.8-1.3-4.3-.9-5.5.9-.5.8-1.5 1-2.4 1.3C2.3 13.1 1.8 15 2.6 16.6c.7 1.4 2.4 3.3 4.1 4 1.6.7 3.4-.1 3.8-1.7.3-1 .6-2 1.3-2.5 1.8-1.2 2.2-3.8.9-5.6zM6 15l2 2' },
keys: { name: 'Piano', color: '#EDE7FF', icon: 'M3 5h18v14H3zM9 19v-5M15 19v-5M7 5v9h4V5M13 5v9h4V5' },
organ: { name: 'Órgão', color: '#D9B3FF', icon: 'M4 21V10M8 21V6M12 21V3M16 21V6M20 21V10M2 21h20M4 10h0M12 8h0' },
guitar: { name: 'Guitarra', color: '#FF4D8D', icon: 'M19 2l3 3-1.2 1.2-3-3zM17.8 3.2L12 9M12 9c-1.6-1.2-3.8-1.1-5 .3-.6.7-.8 1.6-1.6 2-1.1.6-2.8.5-3.3 2.1-.6 2 1.6 5.5 4.5 6.3 1.6.4 2.7-.7 3.2-1.9.3-.8.2-1.8 1-2.4 1.5-1.1 2.3-3.6 1.2-6.4zM7 14l3 3M9.5 11.5l3 3' },
acoustic: { name: 'Violão', color: '#F2A65A', icon: 'M18.5 2.5l3 3M20 4l-6 6M14 10c-1.2-1.5-3.2-1.8-4.6-.7-.6.4-1.3.5-2 .4-2-.2-3.9 1.4-4.1 3.5-.3 3.2 3.4 7.2 6.8 6.6 2.1-.3 3.4-2.3 3.1-4.3-.1-.7.1-1.3.5-1.9 1-1.2.8-2.8.3-3.6zM8.5 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
synth: { name: 'Synth', color: '#3DD9F0', icon: 'M2 5h20v14H2zM2 12h20M6 12v7M10 12v7M14 12v7M18 12v7M6 8.5h.01M10 8.5h3M17 8.5h.01' },
strings: { name: 'Violino', color: '#FFB36B', icon: 'M20 2l2 2M21 3l-7 7M14 10c-1-1.3-2.9-1.3-4 0-.4.5-1 .7-1.6.6-1.6-.2-3 .9-3.2 2.5-.2 1.1.3 2.1 1.1 2.7-.6.8-.7 1.9-.2 2.8.9 1.6 3.1 2 4.5.9.7.8 1.8 1.1 2.8.8 1.6-.5 2.4-2.3 1.8-3.8.8-.5 1.2-1.4 1-2.4-.1-.6.1-1.3.6-1.7 1.2-1 1.2-3.4-.1-4.5zM9 17l3-3M4 22l3-3' },
brass: { name: 'Trompete', color: '#FFD23F', icon: 'M2 10h3v4H2zM5 11h10l5-4v10l-5-4H5M8 11V7h2v4M11 11V7h2v4' },
sax: { name: 'Sax', color: '#E6C24A', icon: 'M9 2h4M11 2v11a3 3 0 0 0 6 0v-2h3l-2 5a6 6 0 0 1-11 0M11 6h2M11 9h2' },
flute: { name: 'Flauta', color: '#9BE7D8', icon: 'M2 20L19 3l2 2L4 22zM8 14l1 1M11 11l1 1M14 8l1 1' },
mallets: { name: 'Marimba', color: '#FF9F6B', icon: 'M4 6l2 12M8.5 5l1 14M14 5l-.5 14M19.5 6L18 18M3 10h18M3 15h18' },
perc: { name: 'Percussão', color: '#FF8A8A', icon: 'M7 3h10l-1.5 18h-7zM7 3c0 1.1 2.2 2 5 2s5-.9 5-2M8 10h8M8.5 15h7' },
vocals: { name: 'Vocais', color: '#B6F09C', icon: 'M4 4h16v11h-8l-5 4v-4H4zM10 12V8l5-1v4M10 12a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM15 11a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z' },
fx: { name: 'Efeitos', color: '#B6A8FF', icon: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z' },
voice: { name: 'Sua voz', color: '#FFD23F', icon: 'M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8', pro: true }
};
const PACKS = [
{ id: 'neon', name: 'Drop das 3h', genre: 'Eletrônica/EDM', mood: 'Animado', bpm: 124, key: 'Lá menor', img: 'neoncity', tag: 'Novo', inst: ['beat', 'bass', 'synth', 'vocals', 'fx'], prog: [0, 5, 2, 6], v: { beat: 'four', bass: 'pulsante', synth: 'supersaw', vocals: 'picotado', fx: 'subida' }, desc: 'Bumbo reto, supersaw e um drop pra pista.' },
{ id: 'sol', name: 'Refrão de Verão', genre: 'Pop', mood: 'Animado', bpm: 118, key: 'Dó maior', img: 'sunset', tag: 'Em alta', inst: ['beat', 'bass', 'synth', 'guitar'], prog: [0, 4, 5, 3], v: { beat: 'pop', bass: 'pulsante', synth: 'pluck', guitar: 'limpa' }, desc: 'Pop solar com pluck e guitarra limpa.' },
{ id: 'garagem', name: 'Palheta Suja', genre: 'Rock', mood: 'Intenso', bpm: 132, key: 'Mi menor', img: 'concert', tag: '', inst: ['beat', 'bass', 'guitar', 'perc'], prog: [0, 5, 6, 3], v: { beat: 'rock', bass: 'rock', guitar: 'power', perc: 'shaker' }, desc: 'Power chords, baixo reto e bateria aberta.' },
{ id: 'mare', swing: 0.15, name: 'Groove de Maré', genre: 'R&B/Soul', mood: 'Relaxante', bpm: 92, key: 'Ré menor', img: 'ocean', tag: '', inst: ['beat', 'bass', 'keys', 'strings'], prog: [0, 3, 6, 2], sev: true, v: { beat: 'boombap', bass: 'slap', keys: 'eletrico', strings: 'orquestra' }, desc: 'Piano elétrico com acordes de sétima.' },
{ id: 'chuva', swing: 0.3, name: 'Lo-fi de Janela', genre: 'Lo-fi', mood: 'Relaxante', bpm: 82, key: 'Fá maior', img: 'rain', tag: 'Favorito', inst: ['beat', 'keys', 'bass', 'fx'], prog: [1, 4, 0, 5], sev: true, v: { beat: 'lofi', keys: 'rhodes', bass: 'walking', fx: 'chuva' }, desc: 'Rhodes abafado, batida lenta e chuva lá fora.' },
{ id: 'lua', swing: 0.6, name: 'Jazz da Meia-Noite', genre: 'Jazz', mood: 'Relaxante', bpm: 96, key: 'Si♭ maior', img: 'moon', tag: '', inst: ['beat', 'bass', 'keys', 'brass'], prog: [1, 4, 0, 5], sev: true, v: { beat: 'jazz', bass: 'walking', keys: 'cauda', brass: 'trompete' }, desc: 'Walking bass, vassourinha e trompete.' },
{ id: 'vinil', swing: 0.22, name: 'Sample de Domingo', genre: 'Hip-hop/Rap', mood: 'Animado', bpm: 90, key: 'Sol menor', img: 'vinyl', tag: '', inst: ['beat', 'bass', 'keys', 'vocals'], prog: [0, 5, 3, 4], sev: true, v: { beat: 'boombap', bass: 'pulsante', keys: 'rhodes', vocals: 'adlibs' }, desc: 'Boom bap com swing e acordes de disco antigo.' },
{ id: 'rastro', name: '808 em Movimento', genre: 'Trap', mood: 'Intenso', bpm: 140, key: 'Dó# menor', img: 'trails', tag: 'Novo', inst: ['beat', 'sub', 'synth', 'perc'], prog: [0, 0, 5, 4], v: { beat: 'trap', sub: 'slide', synth: 'arpejo', perc: 'chimbal' }, desc: '808 deslizando e chimbal picotado.' },
{ id: 'palmeiras', name: 'Dembow Tropical', genre: 'Reggaeton', mood: 'Animado', bpm: 96, key: 'Lá menor', img: 'palms', tag: '', inst: ['beat', 'perc', 'bass', 'mallets'], prog: [0, 5, 2, 6], v: { beat: 'dembow', perc: 'shaker', bass: 'pulsante', mallets: 'marimba' }, desc: 'Dembow com marimba e shaker.' },
{ id: 'baile', name: 'Tamborzão Solar', genre: 'Funk BR', mood: 'Animado', bpm: 130, key: 'Fá menor', img: 'mesh', tag: 'Em alta', inst: ['beat', 'perc', 'sub', 'vocals'], prog: [0, 0, 3, 3], v: { beat: 'tamborzao', perc: 'agogo', sub: 'baile', vocals: 'hey' }, desc: 'Tamborzão, agogô e grave de paredão.' },
{ id: 'deserto', name: 'Tambores do Deserto', genre: 'Afrobeat', mood: 'Animado', bpm: 104, key: 'Mi♭ maior', img: 'dunes', tag: 'Pro', pro: true, inst: ['perc', 'beat', 'bass', 'guitar', 'brass'], prog: [0, 3, 4, 3], v: { perc: 'congas', beat: 'afro', bass: 'slap', guitar: 'highlife', brass: 'festa' }, desc: 'Congas, guitarra highlife e metais.' },
{ id: 'aurora', name: 'Synth da Aurora', genre: 'Eletrônica/EDM', mood: 'Relaxante', bpm: 118, key: 'Ré maior', img: 'aurora', tag: '', inst: ['beat', 'synth', 'strings', 'fx'], prog: [0, 4, 5, 3], v: { beat: 'four', synth: 'pad', strings: 'epicos', fx: 'varredura' }, desc: 'Pad espacial, cordas e bumbo suave.' },
{ id: 'fumaca', name: 'Slow Jam Roxa', genre: 'R&B/Soul', mood: 'Intenso', bpm: 72, key: 'Sol# menor', img: 'smoke', tag: 'Pro', pro: true, inst: ['beat', 'sub', 'keys', 'vocals'], prog: [0, 5, 3, 4], sev: true, v: { beat: 'boombap', sub: 'longo', keys: 'eletrico', vocals: 'etereas' }, desc: 'R&B lento com 808 longo e vozes etéreas.' },
{ id: 'serra', name: 'Violão na Serra', genre: 'Pop', mood: 'Relaxante', bpm: 100, key: 'Sol maior', img: 'mountains', tag: '', inst: ['beat', 'acoustic', 'strings', 'bass'], prog: [0, 4, 5, 3], v: { beat: 'pop', acoustic: 'dedilhado', strings: 'cello', bass: 'pulsante' }, desc: 'Violão dedilhado com cello grave.' },
{ id: 'floresta', name: 'Kalimba na Floresta', genre: 'Lo-fi', mood: 'Relaxante', bpm: 76, key: 'Mi maior', img: 'forest', tag: '', inst: ['beat', 'mallets', 'fx', 'strings'], prog: [3, 0, 4, 5], sev: true, v: { beat: 'lofi', mallets: 'kalimba', fx: 'vinil', strings: 'pizz' }, desc: 'Kalimba, pizzicato e chiado de vinil.' },
{ id: 'nuvens', name: 'Coro nas Nuvens', genre: 'Pop', mood: 'Relaxante', bpm: 108, key: 'Lá maior', img: 'clouds', tag: '', inst: ['beat', 'bass', 'keys', 'vocals'], prog: [0, 5, 3, 4], v: { beat: 'pop', bass: 'pulsante', keys: 'pop', vocals: 'coro' }, desc: 'Piano pop arpejado e coro de “ohh”.' },
{ id: 'disco', name: 'Globo de Espelhos', genre: 'Disco', mood: 'Animado', bpm: 116, key: 'Lá menor', img: 'neoncity', tag: 'Novo', inst: ['beat', 'bass', 'guitar', 'strings', 'brass'], prog: [0, 3, 6, 5], sev: true, v: { beat: 'disco', bass: 'disco', guitar: 'funk', strings: 'staccato', brass: 'anos70' }, desc: 'Baixo de oitavas, cordas picotadas e metais.' },
{ id: 'reggae', swing: 0.15, name: 'Reggae na Laje', genre: 'Reggae', mood: 'Relaxante', bpm: 78, key: 'Sol maior', img: 'palms', tag: '', inst: ['beat', 'bass', 'guitar', 'organ', 'perc'], prog: [0, 3, 4, 3], v: { beat: 'reggae', bass: 'dub', guitar: 'skank', organ: 'skank', perc: 'bongo' }, desc: 'One drop, baixo grave e guitarra no contratempo.' },
{ id: 'bossa', name: 'Bossa no Apartamento', genre: 'Bossa Nova', mood: 'Relaxante', bpm: 126, key: 'Ré maior', img: 'moon', tag: '', inst: ['beat', 'acoustic', 'bass', 'flute'], prog: [1, 4, 0, 3], sev: true, v: { beat: 'bossa', acoustic: 'bossa', bass: 'bossa', flute: 'doce' }, desc: 'Violão sincopado, acordes de sétima e flauta.' },
{ id: 'samba', name: 'Samba de Quintal', genre: 'Samba', mood: 'Animado', bpm: 100, key: 'Dó maior', img: 'sunset', tag: '', inst: ['beat', 'perc', 'acoustic', 'bass', 'brass'], prog: [0, 5, 1, 4], sev: true, v: { beat: 'samba', perc: 'pandeiro', acoustic: 'batida', bass: 'bossa', brass: 'trompete' }, desc: 'Surdo, pandeiro, cavaquinho no violão e trompete.' },
{ id: 'baiao', name: 'Baião Elétrico', genre: 'Forró', mood: 'Animado', bpm: 112, key: 'Sol maior', img: 'dunes', tag: 'Novo', inst: ['beat', 'perc', 'bass', 'flute', 'acoustic'], prog: [0, 4, 3, 0], v: { beat: 'baiao', perc: 'triangulo', bass: 'bossa', flute: 'pifano', acoustic: 'dedilhado' }, desc: 'Zabumba, triângulo e pífano elétrico.' },
{ id: 'dnb', name: 'Drum & Bass Noturno', genre: 'Drum & Bass', mood: 'Intenso', bpm: 172, key: 'Fá menor', img: 'trails', tag: '', inst: ['beat', 'bass', 'synth', 'vocals', 'fx'], prog: [0, 5, 2, 6], v: { beat: 'dnb', bass: 'reese', synth: 'pad', vocals: 'etereas', fx: 'reverso' }, desc: 'Quebrada rápida, reese grave e pad no fundo.' },
{ id: 'chip', name: 'Fliperama 8-bit', genre: 'Chiptune', mood: 'Animado', bpm: 150, key: 'Mi menor', img: 'mesh', tag: '', inst: ['beat', 'synth', 'bass', 'mallets'], prog: [0, 5, 6, 4], v: { beat: 'breakbeat', synth: 'chip', bass: 'acid', mallets: 'xilofone' }, desc: 'Arpejos de videogame, breakbeat e baixo ácido.' },
{ id: 'blues', swing: 0.6, name: 'Blues da Estrada', genre: 'Blues', mood: 'Intenso', bpm: 96, key: 'Mi maior', img: 'concert', tag: 'Pro', pro: true, inst: ['beat', 'bass', 'guitar', 'organ', 'sax'], prog: [0, 3, 0, 4], sev: true, v: { beat: 'shuffle', bass: 'walking', guitar: 'blues', organ: 'gospel', sax: 'rua' }, desc: 'Shuffle, riff de blues e sax rasgado.' },
{ id: 'wobble', name: 'Grave Tremendo', genre: 'Dubstep', mood: 'Intenso', bpm: 140, key: 'Ré menor', img: 'smoke', tag: '', inst: ['beat', 'synth', 'sub', 'fx'], prog: [0, 0, 5, 6], v: { beat: 'halftime', synth: 'wobble', sub: 'longo', fx: 'impacto' }, desc: 'Meio tempo pesado com wobble e impacto.' },
{ id: 'kpop', name: 'Coreografia Neon', genre: 'K-pop', mood: 'Animado', bpm: 126, key: 'Fá# menor', img: 'clouds', tag: 'Novo', inst: ['beat', 'bass', 'synth', 'vocals', 'strings'], prog: [5, 3, 0, 4], v: { beat: 'kpop', bass: 'pulsante', synth: 'supersaw', vocals: 'picotado', strings: 'staccato' }, desc: 'Refrão grudento, synths brilhantes e batida pra coreografia.' },
];
const packById = (id) => PACKS.find((p) => p.id === id) || null;
const packByImg = (img) => PACKS.find((p) => p.img === img) || PACKS[1];
const VAR = {
beat: [['four', 'Four on the floor', 'neon', 'EDM'], ['kpop', 'K-pop', 'kpop', 'K-pop'], ['boombap', 'Boom bap', 'vinil', 'Hip-hop'], ['trap', 'Trap', 'rastro', 'Trap'], ['tamborzao', 'Tamborzão', 'baile', 'Funk BR'], ['dembow', 'Dembow', 'palmeiras', 'Reggaeton'], ['lofi', 'Poeira lo-fi', 'chuva', 'Lo-fi'], ['rock', 'Rock reto', 'garagem', 'Rock'], ['afro', 'Afro groove', 'deserto', 'Afrobeat'], ['pop', 'Pop moderno', 'sol', 'Pop'], ['jazz', 'Vassourinha jazz', 'lua', 'Jazz'], ['disco', 'Disco', 'disco', 'Disco'], ['dnb', 'Drum & bass', 'dnb', 'DnB'], ['reggae', 'One drop', 'reggae', 'Reggae'], ['samba', 'Samba de roda', 'samba', 'Samba'], ['bossa', 'Bossa nova', 'bossa', 'Bossa'], ['drill', 'Drill', 'rastro', 'Drill'], ['baiao', 'Zabumba de baião', 'baiao', 'Forró'], ['halftime', 'Meio tempo', 'wobble', 'Dubstep'], ['shuffle', 'Shuffle', 'blues', 'Blues'], ['breakbeat', 'Breakbeat', 'chip', 'Breaks']],
sub: [['longo', '808 longo', 'fumaca', 'R&B'], ['slide', '808 deslizando', 'rastro', 'Trap'], ['baile', 'Grave de paredão', 'baile', 'Funk BR'], ['kick', 'Kick grave', 'neon', 'EDM']],
bass: [['pulsante', 'Pulsante', 'sol', 'Pop'], ['reese', 'Reese', 'neon', 'EDM'], ['walking', 'Walking', 'lua', 'Jazz'], ['slap', 'Slap funkeado', 'mare', 'R&B'], ['rock', 'Baixo rock', 'garagem', 'Rock'], ['disco', 'Oitavas disco', 'disco', 'Disco'], ['dub', 'Dub grave', 'reggae', 'Reggae'], ['bossa', 'Bossa', 'bossa', 'Bossa'], ['acid', 'Ácido 303', 'chip', 'Eletrônica']],
keys: [['eletrico', 'Piano elétrico', 'mare', 'R&B'], ['cauda', 'Piano de cauda', 'lua', 'Jazz'], ['rhodes', 'Rhodes lo-fi', 'chuva', 'Lo-fi'], ['house', 'Acordes house', 'aurora', 'EDM'], ['pop', 'Piano pop', 'nuvens', 'Pop'], ['skank', 'Skank reggae', 'reggae', 'Reggae'], ['classico', 'Arpejo clássico', 'aurora', 'Cinema']],
organ: [['gospel', 'Órgão gospel', 'fumaca', 'Soul'], ['rock', 'Órgão rock', 'garagem', 'Rock'], ['igreja', 'Órgão de igreja', 'aurora', 'Cinema'], ['skank', 'Órgão bubble', 'reggae', 'Reggae']],
guitar: [['distorcido', 'Riff distorcido', 'garagem', 'Rock'], ['funk', 'Guitarra funk', 'mare', 'R&B'], ['power', 'Power chords', 'garagem', 'Rock'], ['highlife', 'Highlife', 'deserto', 'Afrobeat'], ['limpa', 'Guitarra limpa', 'sol', 'Pop'], ['skank', 'Contratempo reggae', 'reggae', 'Reggae'], ['blues', 'Riff de blues', 'blues', 'Blues'], ['dedilhada', 'Dedilhado 16', 'sol', 'Pop']],
acoustic: [['dedilhado', 'Violão dedilhado', 'serra', 'Pop'], ['batida', 'Batida de violão', 'nuvens', 'Pop'], ['bossa', 'Bossa', 'lua', 'Jazz'], ['lofi', 'Violão lo-fi', 'floresta', 'Lo-fi']],
synth: [['lead', 'Lead serrote', 'neon', 'EDM'], ['pad', 'Pad espacial', 'aurora', 'EDM'], ['arpejo', 'Arpejo neon', 'rastro', 'Trap'], ['pluck', 'Pluck tropical', 'sol', 'Pop'], ['supersaw', 'Supersaw', 'neon', 'EDM'], ['chip', 'Chiptune 8-bit', 'chip', 'Games'], ['wobble', 'Wobble', 'wobble', 'Dubstep'], ['acid', 'Ácido', 'chip', 'Eletrônica']],
strings: [['epicos', 'Violinos épicos', 'aurora', 'Cinema'], ['pizz', 'Pizzicato', 'floresta', 'Lo-fi'], ['cello', 'Cello grave', 'serra', 'Pop'], ['orquestra', 'Orquestra', 'mare', 'Soul'], ['staccato', 'Staccato', 'disco', 'Disco'], ['tremolo', 'Trêmolo', 'aurora', 'Cinema']],
brass: [['festa', 'Metais de festa', 'deserto', 'Afrobeat'], ['trompete', 'Trompete jazz', 'lua', 'Jazz'], ['trombone', 'Trombone funk', 'baile', 'Funk BR'], ['anos70', 'Metais anos 70', 'disco', 'Disco']],
sax: [['suave', 'Sax suave', 'lua', 'Jazz'], ['anos80', 'Sax anos 80', 'sol', 'Pop'], ['rua', 'Sax de rua', 'vinil', 'Hip-hop']],
flute: [['doce', 'Flauta doce', 'floresta', 'Lo-fi'], ['trap', 'Flauta trap', 'rastro', 'Trap'], ['pifano', 'Pífano', 'deserto', 'Afrobeat']],
mallets: [['marimba', 'Marimba', 'palmeiras', 'Reggaeton'], ['xilofone', 'Xilofone', 'nuvens', 'Pop'], ['kalimba', 'Kalimba', 'floresta', 'Lo-fi'], ['vibrafone', 'Vibrafone', 'lua', 'Jazz']],
perc: [['palmas', 'Palmas', 'sol', 'Pop'], ['congas', 'Congas', 'deserto', 'Afrobeat'], ['shaker', 'Shaker', 'palmeiras', 'Reggaeton'], ['agogo', 'Agogô', 'baile', 'Funk BR'], ['chimbal', 'Chimbal rápido', 'rastro', 'Trap'], ['pandeiro', 'Pandeiro', 'lua', 'Samba'], ['cowbell', 'Cowbell', 'disco', 'Disco'], ['triangulo', 'Triângulo', 'baiao', 'Forró'], ['surdo', 'Surdo', 'samba', 'Samba'], ['bongo', 'Bongô', 'reggae', 'Reggae']],
vocals: [['coro', 'Coro “ohh”', 'nuvens', 'Pop'], ['picotado', 'Vocal picotado', 'neon', 'EDM'], ['hey', 'Grito “hey”', 'baile', 'Funk BR'], ['adlibs', 'Ad-libs', 'vinil', 'Hip-hop'], ['etereas', 'Vozes etéreas', 'fumaca', 'R&B'], ['scat', 'Scat', 'lua', 'Jazz'], ['harmonia', 'Harmonia “aah”', 'disco', 'Disco']],
fx: [['subida', 'Subida', 'neon', 'EDM'], ['queda', 'Queda', 'aurora', 'EDM'], ['vinil', 'Vinil chiando', 'chuva', 'Lo-fi'], ['chuva', 'Chuva', 'floresta', 'Ambiente'], ['sirene', 'Sirene', 'baile', 'Funk BR'], ['varredura', 'Varredura', 'rastro', 'Trap'], ['impacto', 'Impacto', 'wobble', 'Dubstep'], ['reverso', 'Prato reverso', 'dnb', 'DnB']],
voice: [['gravada', 'Sua gravação', '', 'Voz']]
};
const varName = (type, id) => { const v = (VAR[type] || []).find((x) => x[0] === id); return v ? v[1] : ''; };
const defVar = (type, pack) => (pack && pack.v && pack.v[type]) || ((VAR[type] || [])[0] || [''])[0];
const PROGS = [
{ id: 'pop', name: 'Pop feliz', minor: false, p: [0, 4, 5, 3] }, { id: 'emo', name: 'Emotiva', minor: false, p: [5, 3, 0, 4] }, { id: 'sonho', name: 'Sonhadora', minor: false, p: [3, 4, 2, 5], sev: true },
{ id: 'jazz', name: 'Jazz ii-V-I', minor: false, p: [1, 4, 0, 5], sev: true }, { id: 'bossa', name: 'Bossa', minor: false, p: [1, 4, 0, 3], sev: true }, { id: 'blues', name: 'Blues', minor: false, p: [0, 3, 0, 4], sev: true },
{ id: 'rock', name: 'Rock de estrada', minor: false, p: [0, 3, 4, 3] }, { id: 'nordeste', name: 'Nordeste', minor: false, p: [0, 4, 3, 0] },
{ id: 'sombria', name: 'Sombria', minor: true, p: [0, 5, 2, 6] }, { id: 'tensa', name: 'Tensa', minor: true, p: [0, 0, 5, 4] }, { id: 'andaluza', name: 'Andaluza', minor: true, p: [0, 6, 5, 4] },
{ id: 'epica', name: 'Épica', minor: true, p: [5, 6, 0, 0] }, { id: 'grave', name: 'Grave e reta', minor: true, p: [0, 0, 3, 3] }, { id: 'soul', name: 'Soul', minor: true, p: [0, 3, 6, 2], sev: true }, { id: 'disco', name: 'Disco', minor: true, p: [0, 3, 6, 5], sev: true }
];
const KITS = [
{ id: 'pop', name: 'Pop', bpm: 118, swing: 0, prog: 'pop', color: '#FF4D8D', v: { beat: 'pop', bass: 'pulsante', keys: 'pop', synth: 'pluck', guitar: 'limpa', acoustic: 'batida', strings: 'pizz', perc: 'palmas', vocals: 'coro', sub: 'kick', mallets: 'xilofone', brass: 'festa', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'subida' } },
{ id: 'house', name: 'House', bpm: 124, swing: 0, prog: 'emo', color: '#3DD9F0', v: { beat: 'four', bass: 'pulsante', keys: 'house', synth: 'supersaw', guitar: 'funk', acoustic: 'batida', strings: 'epicos', perc: 'shaker', vocals: 'picotado', sub: 'kick', mallets: 'marimba', brass: 'festa', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'subida' } },
{ id: 'disco', name: 'Disco', bpm: 116, swing: 0, prog: 'disco', color: '#FFD23F', v: { beat: 'disco', bass: 'disco', keys: 'eletrico', synth: 'arpejo', guitar: 'funk', acoustic: 'batida', strings: 'staccato', perc: 'cowbell', vocals: 'harmonia', sub: 'kick', mallets: 'vibrafone', brass: 'anos70', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'varredura' } },
{ id: 'trap', name: 'Trap', bpm: 140, swing: 0, prog: 'sombria', color: '#8B7BFF', v: { beat: 'trap', bass: 'reese', keys: 'eletrico', synth: 'arpejo', guitar: 'dedilhada', acoustic: 'dedilhado', strings: 'epicos', perc: 'chimbal', vocals: 'adlibs', sub: 'slide', mallets: 'kalimba', brass: 'trombone', organ: 'igreja', sax: 'rua', flute: 'trap', fx: 'varredura' } },
{ id: 'drill', name: 'Drill', bpm: 142, swing: 0, prog: 'andaluza', color: '#B6A8FF', v: { beat: 'drill', bass: 'reese', keys: 'classico', synth: 'lead', guitar: 'dedilhada', acoustic: 'dedilhado', strings: 'staccato', perc: 'chimbal', vocals: 'etereas', sub: 'slide', mallets: 'xilofone', brass: 'trombone', organ: 'igreja', sax: 'rua', flute: 'trap', fx: 'impacto' } },
{ id: 'funk', name: 'Funk BR', bpm: 130, swing: 0, prog: 'grave', color: '#FF5ACD', v: { beat: 'tamborzao', bass: 'pulsante', keys: 'eletrico', synth: 'lead', guitar: 'funk', acoustic: 'batida', strings: 'staccato', perc: 'agogo', vocals: 'hey', sub: 'baile', mallets: 'marimba', brass: 'trombone', organ: 'gospel', sax: 'rua', flute: 'trap', fx: 'sirene' } },
{ id: 'reggaeton', name: 'Reggaeton', bpm: 96, swing: 0, prog: 'sombria', color: '#FF7A3D', v: { beat: 'dembow', bass: 'pulsante', keys: 'house', synth: 'pluck', guitar: 'dedilhada', acoustic: 'dedilhado', strings: 'pizz', perc: 'shaker', vocals: 'picotado', sub: 'kick', mallets: 'marimba', brass: 'festa', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'varredura' } },
{ id: 'reggae', name: 'Reggae', bpm: 78, swing: 0.15, prog: 'rock', color: '#C8FF3E', v: { beat: 'reggae', bass: 'dub', keys: 'skank', synth: 'pad', guitar: 'skank', acoustic: 'batida', strings: 'cello', perc: 'bongo', vocals: 'harmonia', sub: 'longo', mallets: 'marimba', brass: 'festa', organ: 'skank', sax: 'suave', flute: 'doce', fx: 'impacto' } },
{ id: 'rock', name: 'Rock', bpm: 132, swing: 0, prog: 'rock', color: '#FF4D6D', v: { beat: 'rock', bass: 'rock', keys: 'cauda', synth: 'lead', guitar: 'power', acoustic: 'batida', strings: 'epicos', perc: 'shaker', vocals: 'coro', sub: 'kick', mallets: 'xilofone', brass: 'festa', organ: 'rock', sax: 'rua', flute: 'pifano', fx: 'subida' } },
{ id: 'blues', name: 'Blues', bpm: 96, swing: 0.6, prog: 'blues', color: '#3D8BFF', v: { beat: 'shuffle', bass: 'walking', keys: 'cauda', synth: 'lead', guitar: 'blues', acoustic: 'batida', strings: 'cello', perc: 'shaker', vocals: 'scat', sub: 'longo', mallets: 'vibrafone', brass: 'trompete', organ: 'gospel', sax: 'rua', flute: 'doce', fx: 'vinil' } },
{ id: 'lofi', name: 'Lo-fi', bpm: 82, swing: 0.3, prog: 'jazz', color: '#D9A3B8', v: { beat: 'lofi', bass: 'walking', keys: 'rhodes', synth: 'pad', guitar: 'limpa', acoustic: 'lofi', strings: 'pizz', perc: 'shaker', vocals: 'etereas', sub: 'longo', mallets: 'kalimba', brass: 'trompete', organ: 'igreja', sax: 'suave', flute: 'doce', fx: 'vinil' } },
{ id: 'jazz', name: 'Jazz', bpm: 112, swing: 0.6, prog: 'jazz', color: '#FFB36B', v: { beat: 'jazz', bass: 'walking', keys: 'cauda', synth: 'pad', guitar: 'limpa', acoustic: 'bossa', strings: 'orquestra', perc: 'shaker', vocals: 'scat', sub: 'longo', mallets: 'vibrafone', brass: 'trompete', organ: 'gospel', sax: 'suave', flute: 'doce', fx: 'vinil' } },
{ id: 'bossa', name: 'Bossa Nova', bpm: 126, swing: 0, prog: 'bossa', color: '#9BE7D8', v: { beat: 'bossa', bass: 'bossa', keys: 'eletrico', synth: 'pad', guitar: 'limpa', acoustic: 'bossa', strings: 'orquestra', perc: 'shaker', vocals: 'coro', sub: 'longo', mallets: 'vibrafone', brass: 'trompete', organ: 'gospel', sax: 'suave', flute: 'doce', fx: 'chuva' } },
{ id: 'samba', name: 'Samba', bpm: 100, swing: 0.08, prog: 'jazz', color: '#FFD23F', v: { beat: 'samba', bass: 'bossa', keys: 'cauda', synth: 'pluck', guitar: 'dedilhada', acoustic: 'batida', strings: 'pizz', perc: 'pandeiro', vocals: 'coro', sub: 'kick', mallets: 'marimba', brass: 'trompete', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'subida' } },
{ id: 'baiao', name: 'Baião', bpm: 112, swing: 0, prog: 'nordeste', color: '#F2A65A', v: { beat: 'baiao', bass: 'bossa', keys: 'cauda', synth: 'pluck', guitar: 'dedilhada', acoustic: 'dedilhado', strings: 'pizz', perc: 'triangulo', vocals: 'coro', sub: 'kick', mallets: 'xilofone', brass: 'festa', organ: 'rock', sax: 'anos80', flute: 'pifano', fx: 'subida' } },
{ id: 'afro', name: 'Afrobeat', bpm: 104, swing: 0.05, prog: 'pop', color: '#FF9F6B', v: { beat: 'afro', bass: 'slap', keys: 'eletrico', synth: 'pluck', guitar: 'highlife', acoustic: 'dedilhado', strings: 'staccato', perc: 'congas', vocals: 'harmonia', sub: 'kick', mallets: 'marimba', brass: 'festa', organ: 'gospel', sax: 'anos80', flute: 'pifano', fx: 'subida' } },
{ id: 'dnb', name: 'Drum & Bass', bpm: 172, swing: 0, prog: 'sombria', color: '#3DD9F0', v: { beat: 'dnb', bass: 'reese', keys: 'eletrico', synth: 'pad', guitar: 'dedilhada', acoustic: 'dedilhado', strings: 'epicos', perc: 'shaker', vocals: 'etereas', sub: 'longo', mallets: 'kalimba', brass: 'festa', organ: 'igreja', sax: 'suave', flute: 'doce', fx: 'reverso' } },
{ id: 'dubstep', name: 'Meio tempo', bpm: 140, swing: 0, prog: 'tensa', color: '#8B7BFF', v: { beat: 'halftime', bass: 'reese', keys: 'eletrico', synth: 'wobble', guitar: 'distorcido', acoustic: 'dedilhado', strings: 'epicos', perc: 'chimbal', vocals: 'picotado', sub: 'longo', mallets: 'kalimba', brass: 'trombone', organ: 'igreja', sax: 'rua', flute: 'trap', fx: 'impacto' } },
{ id: 'chip', name: '8-bit', bpm: 150, swing: 0, prog: 'epica', color: '#C8FF3E', v: { beat: 'breakbeat', bass: 'acid', keys: 'classico', synth: 'chip', guitar: 'power', acoustic: 'dedilhado', strings: 'staccato', perc: 'cowbell', vocals: 'picotado', sub: 'kick', mallets: 'xilofone', brass: 'festa', organ: 'rock', sax: 'anos80', flute: 'pifano', fx: 'subida' } },
{ id: 'kpop', name: 'K-pop', bpm: 126, swing: 0, prog: 'emo', color: '#FF7AD9', v: { beat: 'kpop', bass: 'pulsante', keys: 'house', synth: 'supersaw', guitar: 'funk', acoustic: 'batida', strings: 'staccato', perc: 'palmas', vocals: 'picotado', sub: 'kick', mallets: 'xilofone', brass: 'anos70', organ: 'gospel', sax: 'anos80', flute: 'doce', fx: 'subida' } },
{ id: 'rnb', name: 'R&B', bpm: 88, swing: 0.2, prog: 'soul', color: '#B6F09C', v: { beat: 'boombap', bass: 'slap', keys: 'eletrico', synth: 'pad', guitar: 'funk', acoustic: 'dedilhado', strings: 'orquestra', perc: 'palmas', vocals: 'etereas', sub: 'longo', mallets: 'vibrafone', brass: 'festa', organ: 'gospel', sax: 'suave', flute: 'doce', fx: 'vinil' } }
];
const progById = (id) => PROGS.find((x) => x.id === id) || PROGS[0];
const keyRoot = (k) => String(k || 'Dó maior').split(' ')[0];
const applyKit = (p, kitId) => {
const kit = KITS.find((k) => k.id === kitId) || KITS[0]; const pr = progById(kit.prog);
const f = (p.bpm || kit.bpm) / kit.bpm;
const tracks = (p.tracks || []).map((t) => { const vid = kit.v[t.type] || t.variant; const I = INST[t.type] || INST.beat; return { ...t, variant: vid, sub: 'A', loop: I.name + ' · ' + (varName(t.type, vid) || ''), clips: (t.clips || []).map((c) => ({ ...c, start: c.start * f, len: c.len * f })) }; });
return { ...p, tracks, bpm: kit.bpm, swing: kit.swing, prog: pr.p, sev: !!pr.sev, key: keyRoot(p.key) + (pr.minor ? ' menor' : ' maior'), kit: kit.id, progId: pr.id, dur: (p.dur || 60) * f };
};
const applyProg = (p, progId) => { const pr = progById(progId); return { ...p, prog: pr.p, sev: !!pr.sev, key: keyRoot(p.key) + (pr.minor ? ' menor' : ' maior'), progId: pr.id }; };
const PATTERNS = {
beat: [0, 1, 1, 1, 1, 0, 1, 1], sub: [0, 1, 1, 1, 1, 0, 1, 1], bass: [0, 0, 1, 1, 1, 0, 1, 1], keys: [1, 1, 1, 1, 1, 1, 1, 0], organ: [1, 1, 0, 1, 1, 1, 1, 0],
guitar: [0, 1, 1, 1, 0, 1, 1, 1], acoustic: [1, 1, 1, 1, 1, 1, 1, 0], synth: [1, 0, 1, 1, 1, 1, 1, 1], strings: [1, 0, 0, 1, 1, 1, 1, 1], brass: [0, 0, 1, 0, 1, 0, 1, 1],
sax: [0, 0, 1, 1, 0, 1, 1, 0], flute: [1, 0, 0, 1, 0, 1, 1, 0], mallets: [1, 1, 0, 1, 1, 1, 0, 1], perc: [0, 0, 1, 1, 1, 0, 1, 1], vocals: [0, 0, 0, 1, 1, 0, 1, 1], fx: [1, 0, 0, 1, 0, 1, 0, 0], voice: [0, 0, 1, 1, 0, 0, 1, 1]
};
const partSec = (bpm) => 960 / bpm;
const numParts = (dur, bpm) => Math.max(2, Math.ceil(dur / partSec(bpm)));
const fitParts = (arr, n, type) => { const p = PATTERNS[type] || [1]; const out = []; for (let i = 0; i < n; i++) out.push(i < arr.length ? arr[i] : p[i % p.length]); return out; };
const fmt = (sec) => { const s = Math.max(0, Math.floor(sec)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
let uid = 1;
const cid = () => 'c' + Date.now().toString(36) + (uid++);
const partsToClips = (parts, ps, end) => { const out = []; let i = 0; while (i < parts.length) { if (parts[i]) { let j = i; while (j < parts.length && parts[j]) j++; const start = i * ps; let len = (j - i) * ps; if (end) len = Math.min(len, end - start); if (len > 0.05) out.push({ id: cid(), start, len }); i = j; } else i++; } return out; };
const clipsFor = (type, dur, bpm) => { const ps = partSec(bpm); return partsToClips(fitParts([], numParts(dur, bpm), type), ps, dur); };
const makeTrack = (type, loopName, variant) => { const I = INST[type]; return { id: 't' + Date.now().toString(36) + (uid++), type, name: I.name, color: I.color, variant: variant || defVar(type), sub: 'A', tune: 0, rate: '1x', loop: loopName || (I.name + ' · ' + varName(type, variant || defVar(type))), clips: [], vol: 80, muted: false, solo: false, fx: { id: 'nenhum', amount: 40, a: 50, b: 50 }, filter: { id: 'nenhum', amount: 50, cut: 50 } }; };
const buildProject = (pack, title, o) => {
o = o || {};
const dur = o.dur || 60;
const ps = partSec(pack.bpm);
const n = numParts(dur, pack.bpm);
const grid = pack.inst.map((t, ti) => { const g = fitParts([], n, t); return o.arr ? g.map((v, i) => o.arr(t, i, ti, v)) : g; });
if (!grid.some((g) => g[0])) grid[0][0] = 1;
const tracks = pack.inst.map((t, ti) => { const vid = defVar(t, pack); const tr = makeTrack(t, INST[t].name + ' · ' + varName(t, vid), vid); tr.clips = partsToClips(grid[ti], ps, dur); return tr; });
return { pid: 'p' + Date.now().toString(36) + (uid++), title: title || pack.name, packId: pack.id, packName: pack.name, genre: pack.genre, img: pack.img, bpm: pack.bpm, key: pack.key, prog: pack.prog, sev: !!pack.sev, swing: pack.swing || 0, kit: pack.kit || null, seed: pack.id + (o.seed || ''), dur, pitch: 0, tracks };
};
const demoSong = (packId, dur, seed) => { const pk = packById(packId) || PACKS[1]; return buildProject(pk, pk.name, { dur: dur || 60, seed: seed || '' }); };
const songOf = (x) => { if (x && x.project && x.project.tracks) return x.project; const pk = (x && x.pack && packById(x.pack)) || packByImg(x && x.img); return demoSong(pk.id, (x && x.dur) || 60, (x && x.title) || ''); };
const STYLES = [{ id: 'classico', name: 'Clássico' }, { id: 'negrito', name: 'Negrito' }, { id: 'neon', name: 'Neon' }, { id: 'minimal', name: 'Minimal' }, { id: 'carimbo', name: 'Carimbo' }];
const coverText = (style, size, accent, fontId, o) => {
o = o || {};
const F = FONTS.find((f) => f.id === fontId) || FONTS[0];
const sc = (o.scale || 1) * F.scale;
const px = (f) => Math.round(size * f * sc) + 'px';
const base = { ff: F.css, fw: F.w, l: 'auto', r: 'auto', t: 'auto', b: 'auto', align: 'left', fs: px(0.11), color: '#FFFFFF', shadow: '0 2px 14px rgba(0,0,0,.55)', bg: 'transparent', pad: '0', rad: '0', tf: 'none', tt: 'none', ls: '-0.01em', shade: 'none' };
let r;
if (style === 'negrito') r = { ...base, l: '7%', r: '7%', t: '7%', fs: px(0.15), tt: 'uppercase', ls: '-0.03em', shade: 'linear-gradient(180deg, rgba(0,0,0,.5), transparent 60%)' };
else if (style === 'neon') r = { ...base, l: '6%', r: '6%', t: '38%', align: 'center', fs: px(0.12), shadow: `0 0 6px ${o.color || accent}, 0 0 18px ${o.color || accent}, 0 0 42px ${o.color || accent}`, shade: 'rgba(8,6,16,.35)' };
else if (style === 'minimal') r = { ...base, l: '10%', r: '10%', b: '8%', align: 'center', fs: px(0.06), color: '#0D0C12', shadow: 'none', bg: 'rgba(255,255,255,.9)', pad: Math.max(4, Math.round(size * 0.02)) + 'px ' + Math.max(8, Math.round(size * 0.04)) + 'px', rad: '999px' };
else if (style === 'carimbo') r = { ...base, l: '8%', b: '10%', fs: px(0.075), color: '#0D0C12', shadow: 'none', bg: '#FFD23F', pad: Math.max(4, Math.round(size * 0.02)) + 'px ' + Math.max(6, Math.round(size * 0.035)) + 'px', rad: '6px', tf: 'rotate(-6deg)', tt: 'uppercase' };
else r = { ...base, l: '8%', r: '8%', b: '8%', shade: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,.7))' };
if (o.color && style !== 'minimal' && style !== 'carimbo') r.color = o.color;
if (o.color && (style === 'minimal' || style === 'carimbo')) r.bg = o.color;
if (o.align) r.align = o.align;
if (o.pos === 'top') { r.t = '8%'; r.b = 'auto'; }
else if (o.pos === 'middle') { r.t = '40%'; r.b = 'auto'; }
else if (o.pos === 'bottom') { r.t = 'auto'; r.b = '8%'; }
return r;
};
const USERS = {
'@nina.wav': { name: 'Nina', ini: 'NW', color: '#FF4D8D', genre: 'Pop · Eletrônica/EDM', followers: 8420, following: 215, plays: '96,3 mil', bio: 'Beats feitos no ônibus e finalizados no quarto. Pop com cara de pista.', pro: true, followsYou: true, songs: [['Pulsa', 'neoncity', 'negrito', '12,1 mil'], ['Neon na chuva', 'rain', 'neon', '8,7 mil'], ['Sexta 23h', 'smoke', 'classico', '5,2 mil'], ['Vidro', 'aurora', 'minimal', '3,9 mil']] },
'@mari.loops': { name: 'Mariana', ini: 'MR', color: '#3DD9F0', genre: 'Hip-hop/Rap · Jazz', followers: 3104, following: 480, plays: '31,8 mil', bio: 'Loops de jazz com batida pesada. Café sempre.', pro: false, followsYou: true, songs: [['Café às 7', 'rain', 'classico', '4,8 mil'], ['Lua de sábado', 'moon', 'carimbo', '2,2 mil'], ['Vinil velho', 'vinyl', 'minimal', '1,9 mil']] },
'@joao.fx': { name: 'João', ini: 'JF', color: '#FFD23F', genre: 'Rock', followers: 1920, following: 301, plays: '14,2 mil', bio: 'Guitarra suja e bateria alta. Garagem é meu estúdio.', pro: true, followsYou: true, songs: [['Garagem', 'concert', 'negrito', '2,7 mil'], ['Estrada', 'trails', 'classico', '1,4 mil']] },
'@dudu.bpm': { name: 'Eduardo', ini: 'DB', color: '#8B7BFF', genre: 'Eletrônica/EDM · Trap', followers: 940, following: 122, plays: '6,1 mil', bio: 'Grave no talo. 140 BPM ou nada.', pro: false, followsYou: false, songs: [['Rua 9', 'trails', 'neon', '1,1 mil'], ['Fumaça', 'smoke', 'negrito', '870']] },
'@lia.sol': { name: 'Lia', ini: 'LS', color: '#C8FF3E', genre: 'Pop · R&B/Soul', followers: 2410, following: 350, plays: '18,9 mil', bio: 'Músicas pra ouvir olhando o mar.', pro: false, followsYou: true, songs: [['Maré alta', 'ocean', 'minimal', '3,2 mil'], ['Palmeiras', 'palms', 'classico', '2,4 mil'], ['Nuvem', 'clouds', 'carimbo', '1,3 mil']] },
'@rafa.drum': { name: 'Rafael', ini: 'RD', color: '#FF7A3D', genre: 'Rock · Funk BR', followers: 410, following: 280, plays: '2,3 mil', bio: 'Baterista.', pro: false, followsYou: false, priv: true, songs: [] },
'@bia.moraes': { name: 'Bia Moraes', ini: 'BM', color: '#FFD23F', genre: 'Jazz', followers: 310, following: 190, plays: '1,1 mil', bio: '', pro: false, followsYou: false, priv: true, songs: [] },
'@teo_sons': { name: 'Téo', ini: 'TS', color: '#3DD9F0', genre: 'Pop', followers: 120, following: 98, plays: '640', bio: 'Começando!', pro: false, followsYou: false, songs: [['Primeira', 'mountains', 'classico', '320']] }
};
const getDrafts = () => STORE.get('drafts', []) || [];
const draftProject = (d) => { if (d.project && d.project.tracks) return { ...d.project, title: d.title, draftId: d.id }; const pk = packById(d.packId) || PACKS[1]; const p = buildProject({ ...pk, bpm: d.bpm || pk.bpm }, d.title, { dur: d.dur || 60, seed: d.id }); return { ...p, draftId: d.id }; };
const AUDIO = (function () {
const W = typeof window !== 'undefined' ? window : null;
if (W && W.__bailleAudio) return W.__bailleAudio;
const E = { l808: {}, id: 'e' + Math.random().toString(36).slice(2), ctx: null, song: null, playing: false, owner: null, marks: [], nextK: 0, nextT: 0, loop: false, loopStart: 0, loopEnd: 0, end: 0, stopAt: 0, timer: null, chains: {}, live: [], vs: {}, bufs: {}, loading: {}, onEnd: null, run: 0, last: 0 };
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const NOTE = { 'Dó': 0, 'Dó#': 1, 'Ré♭': 1, 'Ré': 2, 'Ré#': 3, 'Mi♭': 3, 'Mi': 4, 'Fá': 5, 'Fá#': 6, 'Sol♭': 6, 'Sol': 7, 'Sol#': 8, 'Lá♭': 8, 'Lá': 9, 'Lá#': 10, 'Si♭': 10, 'Si': 11 };
const parseKey = (k) => { const p = String(k || 'Dó maior').split(' '); return { root: NOTE[p[0]] != null ? NOTE[p[0]] : 0, minor: /menor/.test(String(k)) }; };

function init() {
if (!W) return null;
if (!E.ctx) {
const C = W.AudioContext || W.webkitAudioContext;
if (!C) return null;
let ctx; try { ctx = new C({ latencyHint: 'playback' }); } catch (e) { ctx = new C(); }
E.ctx = ctx; E.imp = {};
E.master = ctx.createGain(); E.master.gain.value = 0.54;
const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 26; hp.Q.value = 0.7;
const glue = ctx.createDynamicsCompressor(); glue.threshold.value = -18; glue.knee.value = 12; glue.ratio.value = 3; glue.attack.value = 0.012; glue.release.value = 0.25;
const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.12;
E.an = ctx.createAnalyser(); E.an.fftSize = 256; E.an.smoothingTimeConstant = 0.78;
const sc = ctx.createWaveShaper(); const cv = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i * 2 / 2047 - 1; cv[i] = Math.tanh(1.4 * x) / Math.tanh(1.4); } sc.curve = cv; sc.oversample = '2x'; const pre = ctx.createGain(); pre.gain.value = 0.92;
E.master.connect(hp); hp.connect(glue); glue.connect(lim); lim.connect(pre); pre.connect(sc); sc.connect(E.an); E.an.connect(ctx.destination);
const len = ctx.sampleRate * 2;
const nb = ctx.createBuffer(1, len, ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < len; i++) nd[i] = Math.random() * 2 - 1; E.noiseBuf = nb;
const cb = ctx.createBuffer(1, len, ctx.sampleRate); const cd = cb.getChannelData(0); for (let i = 0; i < len; i++) cd[i] = Math.random() < 0.0008 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.012; E.crackBuf = cb;
E.rev = ctx.createConvolver(); E.rev.buffer = impulse(2.2); const rlp = ctx.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 5200; const rhp = ctx.createBiquadFilter(); rhp.type = 'highpass'; rhp.frequency.value = 180; const rg = ctx.createGain(); rg.gain.value = 0.9;
E.rev.connect(rlp); rlp.connect(rhp); rhp.connect(rg); rg.connect(E.master);
try { W.addEventListener('storage', (e) => { if (e.key === 'baille:audio' && E.playing) { let v = null; try { v = JSON.parse(e.newValue); } catch (err) {} if (!v || v.by !== E.id) stop(); } }); } catch (e) {}
}
if (E.ctx.state === 'suspended') { try { E.ctx.resume(); } catch (e) {} }
return E.ctx;
}
function bus() { if (!E.out) { E.out = G(1); E.out.connect(E.master); E.rvIn = G(1); E.rvIn.connect(E.rev); } return E.out; }
const G = (v) => { const g = E.ctx.createGain(); g.gain.value = v; return g; };
const F = (type, f, q) => { const n = E.ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q != null) n.Q.value = q; return n; };
const keep = (s, e) => { E.live.push({ s, e }); if (E.live.length > 600) { const now = E.ctx.currentTime; E.live = E.live.filter((x) => x.e > now); } };
function curve(k) { const n = 1024, c = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); } return c; }
function crush(bits) { const n = 2048, c = new Float32Array(n), st = Math.pow(2, bits); for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; c[i] = Math.round(x * st) / st; } return c; }
function impulse(sec, rev) {
const key = sec.toFixed(1) + (rev ? 'r' : '');
if (E.imp[key]) return E.imp[key];
const ctx = E.ctx; const n = Math.max(1, Math.floor(ctx.sampleRate * sec)); const b = ctx.createBuffer(2, n, ctx.sampleRate);
for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) { const x = i / n; const env = rev ? Math.pow(x, 2.2) : Math.pow(1 - x, 2.6); d[i] = (Math.random() * 2 - 1) * env; } }
E.imp[key] = b; return b;
}

/* ---------- síntese ---------- */
function tone(dst, t, f, dur, o, vel) {
const ctx = E.ctx; vel = vel == null ? 1 : vel;
const a = o.a != null ? o.a : 0.005, d = o.d != null ? o.d : 0.3, s = o.s != null ? o.s : 0.6, r = o.r != null ? o.r : 0.2;
const peak = Math.max(0.0002, (o.g != null ? o.g : 0.3) * vel);
const atk = Math.max(0.002, Math.min(a, Math.max(0.003, dur)));
const rel = Math.max(t + atk, t + dur);
const rr = Math.max(0.012, r);
const end = rel + rr + 0.03;
const amp = G(0); amp.connect(dst);
const sus = Math.max(0.0001, peak * Math.min(1, s));
amp.gain.setValueAtTime(0, t);
amp.gain.linearRampToValueAtTime(peak, t + atk);
const dEnd = t + atk + Math.max(0.01, d);
if (sus >= peak * 0.999) amp.gain.setValueAtTime(peak, rel);
else if (dEnd < rel) { amp.gain.exponentialRampToValueAtTime(sus, dEnd); amp.gain.setValueAtTime(sus, rel); }
else { const fr = (rel - t - atk) / Math.max(0.01, d); amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * Math.pow(sus / peak, fr)), rel); }
amp.gain.linearRampToValueAtTime(0, rel + rr);
let head = amp;
if (o.lp) { const fl = F('lowpass', o.lp, o.q != null ? o.q : 0.8); if (o.env) { fl.frequency.setValueAtTime(Math.min(18000, o.lp + o.env), t); fl.frequency.exponentialRampToValueAtTime(o.lp, t + 0.004 + (o.fd != null ? o.fd : 0.2) * 1.4); } fl.connect(head); head = fl; }
if (o.hp) { const h = F('highpass', o.hp, 0.7); h.connect(head); head = h; }
if (o.dist) { const ws = ctx.createWaveShaper(); ws.curve = curve(o.dist); ws.oversample = '4x'; ws.connect(head); head = ws; }
if (o.fmt) { const fm = G(1); o.fmt.forEach((x) => { const bp = F('bandpass', x[0], x[1]); const gn = G(x[2] * 3); fm.connect(bp); bp.connect(gn); gn.connect(head); }); head = fm; }
const mix = G(1); mix.connect(head);
let vg = null;
if (o.vib) { const l = ctx.createOscillator(); l.frequency.value = o.vib[0]; vg = G(0); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(o.vib[1], t + (o.vib[2] || 0) + 0.05); l.connect(vg); l.start(t); l.stop(end + 0.05); keep(l, end); }
let fg = null;
if (o.fm) { const m = ctx.createOscillator(); m.frequency.value = f * o.fm[0]; fg = G(0); fg.gain.setValueAtTime(Math.max(0.01, f * o.fm[1] * vel), t); fg.gain.exponentialRampToValueAtTime(Math.max(0.01, f * o.fm[1] * 0.12), t + (o.fm[2] || 0.3) * 2.5); m.connect(fg); m.start(t); m.stop(end + 0.05); keep(m, end); }
(o.w || [['sawtooth', 0, 1]]).forEach((w) => {
const os = ctx.createOscillator();
os.type = w[0];
const ff = f * Math.pow(2, w[3] || 0);
if (o.glide) { os.frequency.setValueAtTime(ff * o.glide[0], t); os.frequency.exponentialRampToValueAtTime(ff, t + o.glide[1]); } else os.frequency.setValueAtTime(ff, t);
os.detune.value = w[1] || 0;
if (vg) vg.connect(os.detune);
if (fg) fg.connect(os.frequency);
const og = G(w[2] != null ? w[2] : 1); os.connect(og); og.connect(mix);
os.start(t); os.stop(end + 0.05); keep(os, end);
});
if (o.nz) { const n = ctx.createBufferSource(); n.buffer = E.noiseBuf; const bp = F('bandpass', o.nz[1] || 2000, o.nz[2] || 1); const ng = G(o.nz[0]); n.connect(bp); bp.connect(ng); ng.connect(mix); n.start(t, Math.random()); n.stop(end); keep(n, end); }
return end;
}
function nz(dst, t, dur, f, type, q, g, f2) {
const ctx = E.ctx; const n = ctx.createBufferSource(); n.buffer = E.noiseBuf;
const fl = F(type, f, q); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
const a = G(0); a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + 0.001); a.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.004, dur));
n.connect(fl); fl.connect(a); a.connect(dst); n.start(t, Math.random() * 1.5); n.stop(t + dur + 0.02); keep(n, t + dur);
}
function osc(dst, t, type, f0, f1, dur, g, pd) {
const ctx = E.ctx; const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + (pd || dur * 0.5));
const a = G(0); a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + 0.002); a.gain.exponentialRampToValueAtTime(0.001, t + dur);
o.connect(a); a.connect(dst); o.start(t); o.stop(t + dur + 0.02); keep(o, t + dur);
}
function sweep(d, t, dur, f0, f1, g, q, down, flat) {
const ctx = E.ctx; const n = ctx.createBufferSource(); n.buffer = E.noiseBuf; n.loop = true;
const bp = F('bandpass', f0, q || 2); bp.frequency.setValueAtTime(f0, t); if (f1 !== f0) bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
const a = G(0);
if (flat) { a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + 0.2); a.gain.setValueAtTime(g, t + dur - 0.2); a.gain.linearRampToValueAtTime(0, t + dur); }
else if (down) { a.gain.setValueAtTime(g, t); a.gain.exponentialRampToValueAtTime(0.001, t + dur); }
else { a.gain.setValueAtTime(0.0005, t); a.gain.exponentialRampToValueAtTime(g, t + dur * 0.92); a.gain.linearRampToValueAtTime(0, t + dur); }
n.connect(bp); bp.connect(a); a.connect(d); n.start(t, Math.random()); n.stop(t + dur + 0.05); keep(n, t + dur);
}
function metal(d, t, dur, g, base, hpf) {
const ctx = E.ctx; const bp = F('bandpass', 9500, 0.9); const h = F('highpass', hpf || 7000, 0.7); const a = G(0);
a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + 0.0015); a.gain.exponentialRampToValueAtTime(0.0008, t + dur);
bp.connect(h); h.connect(a); a.connect(d);
[2, 3, 4.16, 5.43, 6.79, 8.21].forEach((r) => { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = (base || 40) * r; const og = G(0.16); o.connect(og); og.connect(bp); o.start(t); o.stop(t + dur + 0.03); keep(o, t + dur); });
}
const DR = {
kick: (d, t, v, o) => { o = o || {}; osc(d, t, 'sine', o.f0 || 150, o.f1 || 46, o.dur || 0.42, 0.95 * v, o.pd || 0.09); osc(d, t, 'sine', 1200, 300, 0.012, 0.18 * v, 0.01); nz(d, t, 0.008, 4000, 'highpass', 0.7, 0.12 * v); },
snare: (d, t, v, o) => { o = o || {}; osc(d, t, 'triangle', o.f || 185, 140, 0.11, 0.32 * v, 0.04); osc(d, t, 'sine', (o.f || 185) * 1.78, 250, 0.06, 0.16 * v, 0.03); nz(d, t, o.dur || 0.19, o.nf || 1900, 'bandpass', 0.7, 0.5 * v); nz(d, t, 0.07, 7000, 'highpass', 0.7, 0.16 * v); },
clap: (d, t, v) => { [0, 0.01, 0.021].forEach((x) => nz(d, t + x, 0.025, 1300, 'bandpass', 1.4, 0.55 * v)); nz(d, t + 0.03, 0.18, 1250, 'bandpass', 1.2, 0.4 * v); },
hat: (d, t, v, open) => metal(d, t, open ? 0.28 : 0.05, (open ? 0.18 : 0.22) * v, 40, open ? 6500 : 7500),
ride: (d, t, v) => { metal(d, t, 0.7, 0.13 * v, 58, 4500); osc(d, t, 'sine', 3100, 3100, 0.5, 0.02 * v); },
crash: (d, t, v) => { metal(d, t, 1.5, 0.14 * v, 47, 4000); nz(d, t, 0.9, 6000, 'highpass', 0.5, 0.06 * v); },
rim: (d, t, v) => { osc(d, t, 'triangle', 1700, 1700, 0.03, 0.28 * v); nz(d, t, 0.018, 3000, 'bandpass', 3, 0.25 * v); },
tom: (d, t, v, f) => osc(d, t, 'sine', f * 1.6, f, 0.32, 0.7 * v, 0.06),
conga: (d, t, v, f) => { osc(d, t, 'sine', f * 1.25, f, 0.22, 0.6 * v, 0.03); nz(d, t, 0.012, 2500, 'bandpass', 1, 0.16 * v); },
shaker: (d, t, v) => nz(d, t, 0.055, 7000, 'bandpass', 1.2, 0.2 * v),
agogo: (d, t, v, hi) => { const f = hi ? 1250 : 880; osc(d, t, 'sine', f, f, 0.25, 0.26 * v); osc(d, t, 'sine', f * 2.7, f * 2.7, 0.12, 0.07 * v); },
bell: (d, t, v) => { const bp = F('bandpass', 2400, 2); const a = G(0); a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(0.35 * v, t + 0.002); a.gain.exponentialRampToValueAtTime(0.001, t + 0.28); bp.connect(a); a.connect(d); [587, 845].forEach((f) => { const o = E.ctx.createOscillator(); o.type = 'square'; o.frequency.value = f; o.connect(bp); o.start(t); o.stop(t + 0.3); keep(o, t + 0.3); }); },
tri: (d, t, v, open) => { osc(d, t, 'sine', 4200, 4200, open ? 0.7 : 0.09, 0.07 * v); osc(d, t, 'sine', 6150, 6150, open ? 0.5 : 0.07, 0.04 * v); },
brush: (d, t, v) => nz(d, t, 0.14, 3500, 'bandpass', 0.6, 0.18 * v, 1500),
pand: (d, t, v, low) => { if (low) osc(d, t, 'sine', 180, 120, 0.15, 0.45 * v); metal(d, t, 0.06, 0.12 * v, 70, 6000); nz(d, t, 0.05, 9000, 'bandpass', 2, 0.12 * v); }
};
const P = {
bass: { w: [['sawtooth', 0, 0.7], ['square', -5, 0.3]], a: 0.004, d: 0.25, s: 0.5, r: 0.08, lp: 300, env: 1400, fd: 0.18, q: 3, g: 0.5 },
reese: { w: [['sawtooth', -14, 0.5], ['sawtooth', 14, 0.5]], a: 0.02, d: 0.5, s: 0.9, r: 0.15, lp: 500, env: 300, fd: 0.4, q: 2, g: 0.42 },
upright: { w: [['triangle', 0, 1], ['sine', 0, 0.6, -1]], a: 0.004, d: 0.35, s: 0.25, r: 0.1, lp: 900, env: 600, fd: 0.1, g: 0.6 },
slap: { w: [['square', 0, 0.6], ['sawtooth', 3, 0.4]], a: 0.002, d: 0.18, s: 0.3, r: 0.06, lp: 900, env: 3000, fd: 0.08, q: 4, g: 0.42 },
rockb: { w: [['sawtooth', 0, 1]], a: 0.004, d: 0.3, s: 0.6, r: 0.08, lp: 700, env: 1200, fd: 0.15, dist: 3, g: 0.38 },
sub: { w: [['sine', 0, 1], ['triangle', 0, 0.12]], a: 0.004, d: 1, s: 0.8, r: 0.12, dist: 0.6, g: 0.72 },
piano: { w: [['triangle', 0, 0.8], ['sine', 1200, 0.25], ['square', 0, 0.06]], a: 0.002, d: 1.1, s: 0.05, r: 0.4, lp: 2400, env: 3000, fd: 0.35, g: 0.22 },
ep: { w: [['sine', 0, 1]], fm: [1, 1.1, 0.25], a: 0.003, d: 1.3, s: 0.2, r: 0.4, g: 0.22, vib: [5, 6] },
rhodes: { w: [['sine', 0, 1], ['sine', 1200, 0.12]], fm: [1, 0.7, 0.3], a: 0.004, d: 1.4, s: 0.3, r: 0.5, lp: 1800, g: 0.22, vib: [4.5, 9] },
stab: { w: [['sawtooth', 0, 0.5], ['square', 5, 0.3]], a: 0.003, d: 0.14, s: 0.1, r: 0.08, lp: 1200, env: 2500, fd: 0.08, g: 0.2 },
organ: { w: [['sine', 0, 1], ['sine', 1200, 0.5], ['sine', 1902, 0.3], ['sine', 2400, 0.2]], a: 0.01, d: 0.2, s: 1, r: 0.1, g: 0.12, vib: [6, 7] },
church: { w: [['sine', 0, 1], ['sine', 1200, 0.6], ['sine', 2400, 0.4], ['triangle', -1200, 0.4]], a: 0.15, d: 0.3, s: 1, r: 0.6, g: 0.1 },
dguit: { w: [['sawtooth', 0, 0.7], ['sawtooth', 7, 0.5]], a: 0.004, d: 0.4, s: 0.7, r: 0.12, dist: 14, lp: 2200, q: 0.9, g: 0.11 },
cguit: { w: [['triangle', 0, 0.8], ['sawtooth', 0, 0.25]], a: 0.002, d: 0.35, s: 0.12, r: 0.12, lp: 1800, env: 2800, fd: 0.07, g: 0.2 },
funkg: { w: [['sawtooth', 0, 0.6], ['square', 0, 0.3]], a: 0.002, d: 0.06, s: 0.02, r: 0.03, lp: 1400, env: 3000, fd: 0.03, q: 5, g: 0.18 },
acou: { w: [['triangle', 0, 0.7], ['sawtooth', 0, 0.25], ['sine', 1200, 0.2]], a: 0.002, d: 0.7, s: 0.05, r: 0.2, lp: 2200, env: 3500, fd: 0.12, g: 0.18 },
lead: { w: [['sawtooth', -6, 0.55], ['sawtooth', 6, 0.55]], a: 0.01, d: 0.3, s: 0.7, r: 0.12, lp: 2200, env: 2000, fd: 0.2, q: 2, g: 0.15, vib: [5.5, 10, 0.15] },
pad: { w: [['sawtooth', -9, 0.4], ['sawtooth', 9, 0.4], ['triangle', 0, 0.5, 1]], a: 0.6, d: 1, s: 0.8, r: 0.9, lp: 1100, q: 0.6, g: 0.075 },
arp: { w: [['square', 0, 0.5], ['sawtooth', 8, 0.3]], a: 0.002, d: 0.12, s: 0.1, r: 0.08, lp: 1600, env: 3500, fd: 0.06, q: 4, g: 0.12 },
pluck: { w: [['triangle', 0, 0.8], ['sawtooth', 0, 0.3]], a: 0.002, d: 0.2, s: 0, r: 0.1, lp: 1500, env: 4000, fd: 0.05, g: 0.2 },
ssaw: { w: [['sawtooth', -22, 0.3], ['sawtooth', 0, 0.3], ['sawtooth', 22, 0.3]], a: 0.01, d: 0.3, s: 0.6, r: 0.15, lp: 2800, env: 2200, fd: 0.15, g: 0.08 },
str: { w: [['sawtooth', -8, 0.5], ['sawtooth', 8, 0.5]], a: 0.35, d: 0.5, s: 0.85, r: 0.5, lp: 2000, q: 0.6, g: 0.09, vib: [5, 12, 0.3] },
pizz: { w: [['triangle', 0, 1], ['sawtooth', 0, 0.2]], a: 0.002, d: 0.15, s: 0, r: 0.08, lp: 2000, env: 2000, fd: 0.05, g: 0.25 },
cello: { w: [['sawtooth', 0, 1]], a: 0.15, d: 0.6, s: 0.8, r: 0.4, lp: 900, q: 1, g: 0.14, vib: [5, 14, 0.25] },
brass: { w: [['sawtooth', 0, 0.7], ['sawtooth', 5, 0.5]], a: 0.03, d: 0.25, s: 0.7, r: 0.1, lp: 800, env: 2400, fd: 0.12, q: 1.5, g: 0.13 },
tpt: { w: [['sawtooth', 0, 0.8], ['square', 0, 0.2]], a: 0.03, d: 0.2, s: 0.75, r: 0.08, lp: 1300, env: 1800, fd: 0.1, q: 2, g: 0.12, vib: [5.5, 15, 0.2] },
tbn: { w: [['sawtooth', 0, 1]], a: 0.04, d: 0.2, s: 0.8, r: 0.1, lp: 700, env: 1200, fd: 0.12, q: 1.2, g: 0.14, glide: [0.94, 0.06] },
sax: { w: [['sawtooth', 0, 0.6], ['square', 0, 0.35]], a: 0.03, d: 0.2, s: 0.8, r: 0.1, lp: 1700, env: 900, fd: 0.15, q: 2, g: 0.12, vib: [5, 18, 0.2], nz: [0.015, 2200, 1.4] },
flute: { w: [['sine', 0, 1], ['sine', 1200, 0.08]], a: 0.05, d: 0.2, s: 0.85, r: 0.12, g: 0.2, vib: [5, 10, 0.18], nz: [0.02, 2600, 1.5] },
marimba: { w: [['sine', 0, 1], ['sine', 3986, 0.15]], a: 0.002, d: 0.35, s: 0, r: 0.1, g: 0.35 },
xylo: { w: [['sine', 1200, 0.9], ['triangle', 2400, 0.25]], a: 0.001, d: 0.2, s: 0, r: 0.06, g: 0.25 },
kalimba: { w: [['sine', 0, 1], ['sine', 1900, 0.1], ['triangle', 0, 0.3]], a: 0.002, d: 0.6, s: 0, r: 0.2, g: 0.3 },
choir: { w: [['sawtooth', -7, 0.5], ['sawtooth', 7, 0.5]], a: 0.25, d: 0.5, s: 0.9, r: 0.5, fmt: [[400, 8, 1], [800, 8, 0.6], [2600, 10, 0.2]], g: 0.3, vib: [5, 12, 0.2] },
chop: { w: [['sawtooth', 0, 1]], a: 0.005, d: 0.12, s: 0.4, r: 0.05, fmt: [[700, 8, 1], [1200, 9, 0.7], [2800, 10, 0.3]], g: 0.4 },
hey: { w: [['sawtooth', 0, 1]], a: 0.005, d: 0.1, s: 0.5, r: 0.06, fmt: [[600, 6, 1], [1800, 7, 0.8], [2700, 9, 0.4]], nz: [0.1, 1800, 1.2], g: 0.42, glide: [1.3, 0.08] },
dub: { w: [['sine', 0, 1], ['triangle', 0, 0.35]], a: 0.006, d: 0.5, s: 0.7, r: 0.12, lp: 420, g: 0.75 },
acid: { w: [['sawtooth', 0, 1]], a: 0.003, d: 0.14, s: 0.25, r: 0.05, lp: 280, env: 2600, fd: 0.12, q: 13, g: 0.28 },
chip: { w: [['square', 0, 1]], a: 0.001, d: 0.08, s: 0.55, r: 0.03, g: 0.06 },
vibes: { w: [['sine', 0, 1], ['sine', 2400, 0.25]], a: 0.002, d: 1.4, s: 0.15, r: 0.5, g: 0.2, vib: [5.5, 5] },
airy: { w: [['sawtooth', -5, 0.4], ['sawtooth', 5, 0.4]], a: 0.4, d: 0.5, s: 0.8, r: 0.8, fmt: [[300, 10, 0.8], [2300, 10, 1], [3000, 10, 0.5]], nz: [0.035, 3000, 1.2], g: 0.3, vib: [4, 10] }
};
/* ---------- amostras reais (bibliotecas livres: VCSL CC0, VSCO2 CE, Univ. Iowa MIS, Karoryfer) ---------- */
const SMP = { url: {acou: 'assets/sons/b_acou.js', cello: 'assets/sons/b_cello.js', drums: 'assets/sons/b_drums.js', ebass: 'assets/sons/b_ebass.js', egtr: 'assets/sons/b_egtr.js', flute: 'assets/sons/b_flute.js', horn: 'assets/sons/b_horn.js', kalimba: 'assets/sons/b_kalimba.js', marimba: 'assets/sons/b_marimba.js', nylon: 'assets/sons/b_nylon.js', piano: 'assets/sons/b_piano.js', sax: 'assets/sons/b_sax.js', tbn: 'assets/sons/b_tbn.js', tpt: 'assets/sons/b_tpt.js', vibes: 'assets/sons/b_vibes.js', violin: 'assets/sons/b_violin.js', xylo: 'assets/sons/b_xylo.js'}, buf: {}, st: {}, rr: {} };
const SUS = { violin: 1, cello: 1, sax: 1, flute: 1, tpt: 1, tbn: 1, horn: 1 };
const SG = { piano: 0.37, acou: 0.25, nylon: 0.32, egtr: 0.2, ebass: 0.95, violin: 0.15, cello: 0.24, sax: 0.28, flute: 0.38, tpt: 0.23, tbn: 0.45, horn: 0.24, marimba: 0.23, xylo: 0.23, kalimba: 0.5, vibes: 0.55 };
const DG = { kick: 0.95, snare: 0.62, snareg: 0.4, rim: 0.5, clap: 0.55, hat: 0.26, hato: 0.2, crash: 0.26, ride: 0.2, tom: 0.62, congah: 0.5, congal: 0.55, bongoh: 0.8, bongol: 0.85, agogoh: 0.6, agogol: 0.6, cowbell: 0.42, shaker: 0.2, tamb: 0.22, tri: 0.2, trim: 0.2, surdo: 0.62 };
function smpLead(b) { const d = b.getChannelData(0); const lim = Math.min(d.length, Math.floor(b.sampleRate * 0.08)); for (let i = 0; i < lim; i++) if (Math.abs(d[i]) > 0.004) return Math.max(0, i - 8) / b.sampleRate; return 0; }
function smpSet(name, map) {
if (name === 'drums') { const o = {}; Object.keys(map).forEach((k) => { const base = k.replace(/\d+$/, ''); (o[base] = o[base] || []).push([map[k], smpLead(map[k])]); }); SMP.buf.drums = o; }
else SMP.buf[name] = Object.keys(map).map((k) => [+k, map[k], smpLead(map[k])]).sort((a, b) => a[0] - b[0]);
SMP.st[name] = 2;
}
function smpDecode(name, obj) {
const ks = Object.keys(obj || {}); if (!ks.length || !E.ctx) { SMP.st[name] = 3; return; }
const out = {}; let left = ks.length;
const fin = () => { if (--left === 0) { if (Object.keys(out).length) smpSet(name, out); else SMP.st[name] = 3; } };
ks.forEach((k) => {
let ab; try { const bin = W.atob(obj[k]); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); ab = u.buffer; } catch (e) { fin(); return; }
try { const p = E.ctx.decodeAudioData(ab, (b) => { if (!out[k]) { out[k] = b; fin(); } }, () => fin()); if (p && p.catch) p.catch(() => {}); } catch (e) { fin(); }
});
}
function need(name) {
if (!W || !E.ctx || SMP.st[name] || !SMP.url[name]) return;
SMP.st[name] = 1;
const url = SMP.url[name];
const viaScript = () => { try { const d = W.document; if (!d) { SMP.st[name] = 3; return; } const s = d.createElement('script'); s.src = url; s.async = true; s.onload = () => smpDecode(name, W.__bsmp && W.__bsmp[name]); s.onerror = () => { SMP.st[name] = 3; }; (d.head || d.body || d.documentElement).appendChild(s); } catch (e) { SMP.st[name] = 3; } };
if (typeof W.fetch !== 'function') { viaScript(); return; }
W.fetch(url).then((r) => { if (!r.ok) throw new Error('http'); return r.text(); }).then((tx) => { const a = tx.indexOf('={"'); const b = tx.lastIndexOf('}'); smpDecode(name, JSON.parse(tx.slice(a + 1, b + 1))); }).catch(viaScript);
}
const smpOk = (name) => SMP.st[name] === 2;
const SP = {
piano: (m) => ['piano', m], acou: (m) => ['acou', m], cguit: (m) => ['nylon', m], funkg: (m) => ['egtr', m], dguit: (m) => ['egtr', m, { dist: 1 }],
bass: (m) => ['ebass', m], rockb: (m) => ['ebass', m, { lp: 1600 }], slap: (m) => ['ebass', m, { lp: 2400 }], upright: (m) => ['ebass', m, { lp: 700 }], dub: (m) => ['ebass', m, { lp: 700, gm: 1.9 }],
str: (m) => m < 57 ? ['cello', m] : ['violin', m], cello: (m) => ['cello', m],
brass: (m) => m < 62 ? ['horn', m] : ['tpt', m], tpt: (m) => ['tpt', m], tbn: (m) => ['tbn', m], sax: (m) => ['sax', m], flute: (m) => ['flute', m],
marimba: (m) => ['marimba', m], xylo: (m) => ['xylo', m + 12], kalimba: (m) => ['kalimba', m], vibes: (m) => ['vibes', m]
};
const INSMP = { beat: ['drums'], perc: ['drums'], bass: ['ebass'], keys: ['piano'], guitar: ['nylon', 'egtr'], acoustic: ['acou'], strings: ['violin', 'cello'], brass: ['tpt', 'tbn', 'horn'], sax: ['sax'], flute: ['flute'], mallets: ['marimba', 'xylo', 'kalimba', 'vibes'] };
function sNote(dst, t, name, m, dur, vel, o) {
const L = SMP.buf[name]; if (!L || !L.length) return false;
let best = L[0]; for (const x of L) if (Math.abs(x[0] - m) < Math.abs(best[0] - m)) best = x;
const buf = best[1], ofs = best[2], rate = Math.pow(2, (m - best[0]) / 12);
const ctx = E.ctx; o = o || {};
let head = dst;
if (o.dist) { const ws = ctx.createWaveShaper(); ws.curve = curve(6); ws.oversample = '2x'; const lp = F('lowpass', 3200, 0.7); const pg = G(0.5); ws.connect(lp); lp.connect(pg); pg.connect(head); head = ws; }
if (o.lp) { const lp = F('lowpass', o.lp, 0.7); lp.connect(head); head = lp; }
const peak = Math.max(0.0002, (SG[name] || 0.35) * Math.pow(Math.max(0.05, vel == null ? 1 : vel), 1.2) * (o.gm || 1));
const atk = Math.max(0.003, Math.min(o.a || 0.003, 0.6));
const rel = Math.max(0.06, Math.min(o.r != null ? o.r : 0.18, 1.2));
const endHold = Math.max(t + atk + 0.005, t + dur);
const amp = G(0); amp.connect(head);
amp.gain.setValueAtTime(0, t); amp.gain.linearRampToValueAtTime(peak, t + atk);
amp.gain.setValueAtTime(peak, endHold); amp.gain.linearRampToValueAtTime(0, endHold + rel);
const stopAt = endHold + rel + 0.03;
const tail = 0.36; const usable = Math.max(0.05, buf.duration - ofs - tail);
const play1 = usable / rate;
if (!SUS[name] || stopAt - t <= play1 + 0.02) {
const s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate; s.connect(amp);
s.start(t, ofs); s.stop(Math.min(stopAt, t + (buf.duration - ofs) / rate)); keep(s, stopAt); return true;
}
// nota longa: emenda trechos do meio da amostra com crossfade
const xf = 0.16; const L0 = ofs + usable * 0.45; const L1 = ofs + usable; const segT = (L1 - L0) / rate;
let tc = t, off = ofs, len = play1, first = true, guard = 0;
while (tc < stopAt && guard++ < 40) {
const s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = rate;
const g = G(first ? 1 : 0); s.connect(g); g.connect(amp);
const segEnd = tc + len;
if (!first) { g.gain.setValueAtTime(0, tc); g.gain.linearRampToValueAtTime(1, tc + xf); }
if (segEnd < stopAt) { g.gain.setValueAtTime(1, Math.max(tc + xf + 0.001, segEnd - xf)); g.gain.linearRampToValueAtTime(0, segEnd); }
s.start(tc, off); s.stop(Math.min(segEnd, stopAt) + 0.01); keep(s, segEnd);
tc = segEnd - xf; off = L0; len = segT; first = false;
}
return true;
}
function sHit(d, t, key, v, rate) {
if (!smpOk('drums')) return false;
const arr = SMP.buf.drums[key]; if (!arr || !arr.length) return false;
const i = (SMP.rr[key] = ((SMP.rr[key] || 0) + 1) % arr.length); const x = arr[i];
const s = E.ctx.createBufferSource(); s.buffer = x[0]; s.playbackRate.value = rate || 1;
const pk = Math.max(0.0002, (DG[key] || 0.4) * Math.pow(Math.max(0.05, v), 1.15)); const g = G(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk, t + 0.0015); s.connect(g); g.connect(d);
s.start(t, x[1]); keep(s, t + (x[0].duration - x[1]) / (rate || 1)); return true;
}
const DRS = Object.assign({}, DR);
const ACOU = { rock: 1, jazz: 1, bossa: 1, samba: 1, reggae: 1, shuffle: 1, afro: 1, baiao: 1, boombap: 1, lofi: 1, breakbeat: 1, dnb: 1 };
DR.kick = (d, t, v, o) => { if (E.acou && sHit(d, t, 'kick', v)) return; DRS.kick(d, t, v, o); };
DR.snare = (d, t, v, o) => { const g = v < 0.4; if (sHit(d, t, g ? 'snareg' : 'snare', g ? Math.min(1, v * 2) : v)) return; DRS.snare(d, t, v, o); };
DR.clap = (d, t, v) => { if (!sHit(d, t, 'clap', v)) DRS.clap(d, t, v); };
DR.hat = (d, t, v, open) => { if (!sHit(d, t, open ? 'hato' : 'hat', v)) DRS.hat(d, t, v, open); };
DR.ride = (d, t, v) => { if (!sHit(d, t, 'ride', v)) DRS.ride(d, t, v); };
DR.crash = (d, t, v) => { if (!sHit(d, t, 'crash', v)) DRS.crash(d, t, v); };
DR.rim = (d, t, v) => { if (!sHit(d, t, 'rim', v)) DRS.rim(d, t, v); };
DR.tom = (d, t, v, f) => { if (!(f < 80 ? sHit(d, t, 'surdo', v, f / 66) : sHit(d, t, 'tom', v, Math.max(0.6, Math.min(1.5, f / 110))))) DRS.tom(d, t, v, f); };
DR.conga = (d, t, v, f) => { const k = f >= 450 ? ['bongoh', f / 480] : f >= 330 ? ['bongol', f / 340] : f >= 250 ? ['congah', f / 290] : ['congal', f / 190]; if (!sHit(d, t, k[0], v, Math.max(0.7, Math.min(1.35, k[1])))) DRS.conga(d, t, v, f); };
DR.shaker = (d, t, v) => { if (!sHit(d, t, 'shaker', v)) DRS.shaker(d, t, v); };
DR.agogo = (d, t, v, hi) => { if (!sHit(d, t, hi ? 'agogoh' : 'agogol', v)) DRS.agogo(d, t, v, hi); };
DR.bell = (d, t, v) => { if (!sHit(d, t, 'cowbell', v)) DRS.bell(d, t, v); };
DR.tri = (d, t, v, open) => { if (!sHit(d, t, open ? 'tri' : 'trim', v)) DRS.tri(d, t, v, open); };
DR.pand = (d, t, v, low) => { if (!sHit(d, t, 'tamb', v)) { DRS.pand(d, t, v, low); return; } if (low) sHit(d, t, 'congal', v * 0.7, 0.8); };
const BEATS = {
four: { k: 'x...x...x...x...', s: '....c.......c...', h: '..o...o...o...o.', hh: 'x.o.x.o.x.o.x.o.', crash: 1, kick: { f0: 160, f1: 48, dur: 0.38 } },
boombap: { k: 'x.........x.x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.', hh: 'xxxxxxxxxxxxxxxx', sw: 0.12, kick: { f0: 120, f1: 50, dur: 0.5 }, snare: { nf: 1500, dur: 0.22 } },
trap: { k: 'x.....x.......x.', s: '........c.......', h: 'x.x.x.x.x.x.x.x.', hh: 'xxxxxxxxxxxxxxxx', roll: 1, kick: { f0: 170, f1: 45, dur: 0.5 } },
tamborzao: { k: 'x..x..x...x..x..', s: '....c.......c...', h: '..x...x...x...x.', hh: 'x.x.x.x.x.x.x.x.', t: '..l.....l..l....', kick: { f0: 140, f1: 55, dur: 0.3 } },
dembow: { k: 'x...x...x...x...', s: '...x..x....x..x.', h: '..x...x...x...x.', hh: 'x.x.x.x.x.x.x.x.', snare: { f: 260, nf: 2500, dur: 0.12 } },
lofi: { k: 'x......x..x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.xxx.xxx.xx', sw: 0.16, kv: 0.8, sv: 0.7, hv: 0.6, kick: { f0: 110, f1: 48, dur: 0.35 }, snare: { nf: 1200, dur: 0.16 }, fill: false },
rock: { k: 'x.......x.x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.', hh: 'xxxxxxxxxxxxxxxx', crash: 1, snare: { f: 190, nf: 2000, dur: 0.24 } },
afro: { k: 'x.....x...x.....', s: '....r..r....r...', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.xxx.xxx.xx', t: '..m..l....m..l..', crash: 1 },
pop: { k: 'x.......x.x.....', s: '....c.......c...', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.xxx.xxx.xx', crash: 1 },
jazz: { k: 'x.........x.....', s: '......b.......b.', h: 'd...d.d.d...d.d.', hh: 'd...d.ddd...d.dd', f: '....x.......x...', sw8: 0.66, kv: 0.55, fill: false },
kpop: { k: 'x...x...x.x.x...', s: '....c.......c...', h: 'x.xxx.xxx.xxx.xx', hh: 'xxxxxxxxxxxxxxxx', roll: 1, crash: 1, kick: { f0: 165, f1: 48, dur: 0.36 } },
disco: { k: 'x...x...x...x...', s: '....c.......c...', h: 'x.o.x.o.x.o.x.o.', hh: 'xxoxxxoxxxoxxxox', crash: 1, kick: { f0: 150, f1: 50, dur: 0.34 } },
dnb: { k: 'x.........x.....', s: '....x..g.g..x..g', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.x.x.xxx.x.', crash: 1, snare: { f: 230, nf: 2300, dur: 0.17 }, kick: { f0: 170, f1: 52, dur: 0.3 } },
reggae: { k: '........x.......', s: '........r.......', h: 'x.x.x.x.x.x.x.x.', hh: 'x.x.x.x.x.x.x.o.', kv: 0.9, fill: false },
samba: { k: 'x.......x.......', s: 'r.rr.r.rr.r.rr.r', h: 'xxxxxxxxxxxxxxxx', hh: 'xxxxxxxxxxxxxxxx', t: '.......l.......l', kv: 0.6, sv: 0.45, hv: 0.45, fill: false },
bossa: { k: 'x..x....x..x....', s: 'r..r..r...r..r..', h: 'xxxxxxxxxxxxxxxx', hh: 'xxxxxxxxxxxxxxxx', kv: 0.65, sv: 0.75, hv: 0.3, fill: false },
drill: { k: 'x.....x...x..x..', s: '........x.....x.', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.x.xx.xx.x.', roll: 1, kick: { f0: 175, f1: 42, dur: 0.55 } },
baiao: { k: 'x..x...xx..x....', s: '...r......r...r.', h: 'x.o.x.o.x.o.x.o.', hh: 'xxoxxxoxxxoxxxox', hv: 0.55, kick: { f0: 115, f1: 58, dur: 0.3 }, t: 'l..l...ll..l....', fill: false },
halftime: { k: 'x.......x.....x.', s: '........c.......', h: 'x.x.x.x.x.x.x.x.', hh: 'x.xxx.xxx.xxx.xx', crash: 1, kick: { f0: 160, f1: 40, dur: 0.6 } },
shuffle: { k: 'x.....x.x.......', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.', hh: 'x.x.x.x.x.x.x.x.', sw8: 0.6, crash: 1 },
breakbeat: { k: 'x.x.......xx....', s: '....x..g.g..x..g', h: 'x.x.x.x.x.x.x.x.', hh: 'xxxxxxxxxxxxxxxx', crash: 1 }
};
const up = (m, lo) => { while (m < lo) m += 12; while (m >= lo + 12) m -= 12; return m; };
const lenTo = (pat, s) => { let L = 1; while (s + L < 16 && pat[s + L] !== 'x') L++; return L; };
const vary = (pat, sub) => sub === 1 ? pat.slice(2) + pat.slice(0, 2) : sub === 2 ? pat.split('').map((ch, i) => (i % 2 === 0 ? 'x' : ch)).join('') : sub === 3 ? 'x...............' : pat;
function harmony(song, bar) {
const K = song.K;
const sc = K.minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
const prog = song.prog && song.prog.length ? song.prog : (K.minor ? [0, 5, 2, 6] : [0, 4, 5, 3]);
const L = prog.length;
const deg = prog[((bar % L) + L) % L];
const next = prog[(((bar + 1) % L) + L) % L];
const tr = song.pitch || 0;
const note = (d, oct) => { const o = Math.floor(d / 7); const i = ((d % 7) + 7) % 7; return 12 * (oct + 1 + o) + K.root + sc[i] + tr; };
return { deg, next, note, sc, sev: !!song.sev, ch: (i, oct) => note(deg + 2 * i, oct) };
}
const voicing = (H, lo, n) => { const out = []; for (let i = 0; i < n; i++) out.push(up(H.ch(i, 4), lo)); return out.sort((a, b) => a - b); };
const N = (c, patch, m, len, vel, dl, over) => { const sp = SP[patch]; if (sp) { const r = sp(m + (c.tune || 0)); if (over && over.dist && r[0] === 'nylon') r[0] = 'egtr'; if (smpOk(r[0])) { const o = Object.assign({}, r[2] || {}, over && over.lp ? { lp: Math.min(over.lp, (r[2] && r[2].lp) || 20000) } : null, over && over.dist ? { dist: 1 } : null, over && over.a ? { a: over.a } : null, over && over.r ? { r: over.r } : null, over && over.g && P[patch] && P[patch].g ? { gm: over.g / P[patch].g } : null); if (sNote(c.d, c.t + (dl || 0), r[0], r[1], Math.max(0.03, len * c.st), vel, o)) return; } } tone(c.d, c.t + (dl || 0), mtof(m + (c.tune || 0)), Math.max(0.03, len * c.st), over ? Object.assign({}, P[patch], over) : P[patch], vel); };
const CH = (c, patch, notes, len, vel, strum, over) => notes.forEach((m, i) => N(c, patch, m, len, vel, (strum || 0) * i, over));
function mel(c, patch, reg, dens, over) {
const H = c.H, s = c.step, seed = (c.song.seed || '') + '|' + (c.v || '') + '|' + c.sub;
const motif = c.pb % 2, answer = (c.pb % 4) >= 2;
const r = rng(hash(seed + '|m' + motif));
const RH = [['x.......x...x...', 'x...x.....x.....', 'x.......x.......', 'x.....x.x.......'], ['x..x..x.x...x.x.', 'x.x...x.x..x....', '..x.x.x...x.x.x.', 'x..x..x...x.x...'], ['x.xxx.x.x.xxx.x.', 'xxx.x.xxx.x.x.xx', 'x.x.xxx.x.x.xxx.']];
const lvl = Math.max(0, Math.min(2, dens + (c.sub === 2 ? 1 : 0) - (c.sub === 3 ? 1 : 0)));
let pat = RH[lvl][Math.floor(r() * RH[lvl].length)];
if (c.sub === 1) pat = pat.slice(2) + pat.slice(0, 2);
if (answer && c.e >= 4 && lvl < 2) pat = pat.slice(0, 8) + RH[Math.min(2, lvl + 1)][0].slice(8);
if (pat[s] !== 'x') return;
const r2 = rng(hash(seed + '|' + motif + '|' + s + (answer ? 'b' : 'a')));
let off = [0, 2, 4, 2, 4, 0][Math.floor(r2() * 6)];
if (s % 4 !== 0 && r2() < 0.45) off += r2() < 0.5 ? 1 : -1;
if (answer && s >= 12) off = r2() < 0.5 ? 0 : 7;
const m = H.note(H.deg + off, reg);
N(c, patch, m, Math.max(0.8, lenTo(pat, s) - 0.3), s % 4 === 0 ? 0.9 : 0.75, 0, over);
}
function wob(c, m, dur, rate) {
const ctx = E.ctx, t = c.t, f = mtof(m + (c.tune || 0));
const lp = F('lowpass', 400, 9); const a = G(0); a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(0.32, t + 0.01); a.gain.setValueAtTime(0.32, t + Math.max(0.02, dur - 0.04)); a.gain.linearRampToValueAtTime(0, t + dur);
const ws = ctx.createWaveShaper(); ws.curve = curve(3); ws.oversample = '4x';
lp.connect(ws); ws.connect(a); a.connect(c.d);
const l = ctx.createOscillator(); l.type = 'sine'; l.frequency.value = rate; const lg = G(1300); l.connect(lg); lg.connect(lp.frequency); lp.frequency.setValueAtTime(1500, t);
[['sawtooth', -8], ['square', 8], ['sine', 0, -1]].forEach((w) => { const o = ctx.createOscillator(); o.type = w[0]; o.frequency.value = f * Math.pow(2, w[2] || 0); o.detune.value = w[1]; const g = G(w[0] === 'sine' ? 0.9 : 0.5); o.connect(g); g.connect(w[0] === 'sine' ? a : lp); o.start(t); o.stop(t + dur + 0.05); keep(o, t + dur); });
l.start(t); l.stop(t + dur + 0.05); keep(l, t + dur);
}
const INS = {
beat(c) {
const B = BEATS[c.v] || BEATS.pop, s = c.step, d = c.d, t = c.t, e = c.e, sub = c.sub;
E.acou = !!ACOU[c.v];
let t2 = t; const sw8 = c.song.swing || B.sw8 || 0; if (B.sw && s % 2 === 1) t2 += B.sw * c.st; if (sw8 && s % 4 === 2) t2 += sw8 * c.st;
let kk = B.k[s] === 'x';
if ((sub === 1 || (c.alt && sub === 0)) && c.pb % 2 === 1 && (s === 14 || s === 7)) kk = true;
if (sub === 3) kk = kk && s % 8 === 0;
if (kk) DR.kick(d, t, B.kv || 1, B.kick);
const sn = B.s[s];
if (sn !== '.') { if (sn === 'c') DR.clap(d, t2, 0.9); else if (sn === 'g') DR.snare(d, t2, 0.28, B.snare); else if (sn === 'r') DR.rim(d, t2, 0.9 * (B.sv || 1)); else if (sn === 'b') DR.brush(d, t2, 1); else DR.snare(d, t2, B.sv || 1, B.snare); }
else if (sub === 2 && (s === 7 || s === 15)) DR.snare(d, t2, 0.22, B.snare);
let h = ((sub === 2 || (e >= 4 && sub !== 3) || (c.alt && e >= 2 && sub === 0)) ? B.hh : B.h)[s];
if (sub === 3 && s % 4 !== 2) h = '.';
if (e <= 1 && h === 'x' && s % 2 === 1 && c.v !== 'trap') h = '.';
if (h === 'x') DR.hat(d, t2, (s % 4 === 0 ? 0.9 : 0.6) * (B.hv || 1), false);
else if (h === 'o') DR.hat(d, t2, 0.8 * (B.hv || 1), true);
else if (h === 'd') DR.ride(d, t2, s % 4 === 0 ? 1 : 0.7);
if (B.f && B.f[s] === 'x') DR.hat(d, t, 0.35, false);
if (B.roll && c.pb % 2 === 1 && s >= 12) { DR.hat(d, t2 + c.st / 2, 0.45, false); if (s >= 14) { DR.hat(d, t2 + c.st / 4, 0.35, false); DR.hat(d, t2 + 3 * c.st / 4, 0.35, false); } }
if (B.t) { const x = B.t[s]; if (x === 'l') DR.tom(d, t, 0.9, 90); else if (x === 'm') DR.conga(d, t2, 0.7, 260); }
if (e >= 4 && B.fill !== false && c.pb % 4 === 3 && s >= 12) DR.snare(d, t, 0.3 + (s - 12) * 0.15, B.snare);
if (B.crash && e >= 3 && c.pb % 8 === 0 && s === 0 && c.k > 0) DR.crash(d, t, 0.8);
},
sub(c) {
const pats = { longo: 'x.........x.....', slide: 'x......x..x...x.', baile: 'x..x..x...x..x..', kick: 'x...x...x...x...' };
let pat = pats[c.v] || pats.longo;
if (c.sub === 2) pat = 'x..x..x.x.x..x..'; else if (c.sub === 3) pat = 'x.......x.......';
const s = c.step; if (pat[s] !== 'x') return;
let m = up(c.H.ch(0, 1), 28);
if (c.sub === 1 && s >= 12) m += 12;
const len = lenTo(pat, s);
let o = P.sub, dur = len;
const prev = E.l808[c.tr.id]; E.l808[c.tr.id] = m;
if (c.v === 'slide' && prev && prev !== m) o = Object.assign({}, P.sub, { glide: [Math.pow(2, (prev - m) / 12), 0.09] });
if (c.v === 'kick') { o = Object.assign({}, P.sub, { d: 0.3, s: 0, glide: [3, 0.03] }); dur = 1.5; }
if (c.v === 'baile') dur = Math.min(len, 2.5);
tone(c.d, c.t, mtof(m + (c.tune || 0)), dur * c.st, o, 1);
},
bass(c) {
const H = c.H, s = c.step, root = up(H.ch(0, 2), 36);
let pat, note = root, len = 1.6, patch = 'bass', vel = 1;
if (c.v === 'reese') { pat = 'x.......x.......'; len = 7.6; patch = 'reese'; }
else if (c.v === 'walking') { pat = 'x...x...x...x...'; patch = 'upright'; const nx = up(H.note(H.next, 2), 36); const seq = [root, up(H.ch(1, 2), 36), up(H.ch(2, 2), 36), nx + (nx > root ? -1 : 1)]; note = seq[Math.floor(s / 4)]; len = 3.6; }
else if (c.v === 'slap') { pat = 'x..x..x.x.x..x..'; patch = 'slap'; if (s === 3 || s === 13) note = root + 12; len = 1.2; }
else if (c.v === 'rock') { pat = 'x.x.x.x.x.x.x.x.'; patch = 'rockb'; if (s >= 12) note = up(H.ch(2, 2), 36); }
else if (c.v === 'disco') { pat = 'x.x.x.x.x.x.x.x.'; patch = 'slap'; if (s % 4 === 2) note = root + 12; len = 1.1; }
else if (c.v === 'dub') { pat = 'x.....x.x.......'; patch = 'dub'; if (s === 6) note = up(H.ch(2, 1), 31); if (s === 8) note = up(H.ch(1, 1), 31); else if (s === 0) note = up(H.ch(0, 1), 31); len = s === 0 ? 5.5 : 1.8; }
else if (c.v === 'bossa') { pat = 'x.....x.x.....x.'; patch = 'upright'; const fifth = up(H.ch(2, 2), 31); note = (s === 6 || s === 8) ? fifth : root; len = s === 0 || s === 8 ? 5.5 : 1.8; }
else if (c.v === 'acid') { const r = rng(hash((c.song.seed || '') + 'acid' + (c.pb % 2) + c.sub)); pat = 'x.xxx.xx.xx.x.xx'; patch = 'acid'; const rs = rng(hash((c.song.seed || '') + 'acidn' + s + (c.pb % 2))); const off = [0, 0, 7, 12, 3, 10, 5, 0][Math.floor(rs() * 8)]; note = root + off; len = s % 4 === 3 ? 0.6 : 0.9; if (pat[s] === 'x' && rs() < 0.25) { N(c, 'acid', note, len * 1.6, 1, 0, { glide: [Math.pow(2, -5 / 12), 0.06], env: 3600 }); return; } r(); }
else { pat = 'x.x.x.x.x.x.x.x.'; vel = s % 4 === 2 ? 1 : 0.72; len = 1.5; }
if (c.v !== 'walking' && c.v !== 'acid' && c.v !== 'dub') pat = vary(pat, c.sub === 3 ? 0 : c.sub);
if (c.sub === 3) pat = 'x.......x.......';
if (pat[s] !== 'x') return;
if ((c.sub === 1 || (c.alt && c.sub === 0 && c.v === 'pulsante')) && s % 8 === 6) note += 12;
N(c, patch, note, c.sub === 3 ? 7.5 : len, vel);
},
keys(c) {
const s = c.step, H = c.H;
if (c.v === 'skank') { const pat = vary('....x.......x...', c.sub === 2 ? 0 : c.sub); const p2 = c.sub === 2 ? '..x.x.x...x.x.x.' : pat; if (p2[s] !== 'x') return; CH(c, 'stab', voicing(H, 64, 3), 0.55, 0.8, 0.004, { lp: 2600, env: 1500 }); return; }
if (c.v === 'classico') { const vo = voicing(H, 55, 3); const seq = [0, 2, 1, 2]; const pat = c.sub === 3 ? 'x...x...x...x...' : 'xxxxxxxxxxxxxxxx'; if (pat[s] !== 'x') return; const m = vo[seq[s % 4]] + (c.sub === 1 && s >= 8 ? 12 : 0); N(c, 'piano', m, 1.3, s % 4 === 0 ? 0.8 : 0.55); if (s === 0) N(c, 'piano', up(H.ch(0, 2), 36), 15, 0.55); return; }
const V = { eletrico: ['ep', 'x.........x.....', [9, 5]], cauda: ['piano', 'x.......x.......', [7.5, 7.5]], rhodes: ['rhodes', 'x......x........', [6.5, 8.5]], house: ['stab', '..x...x...x...x.', [1, 1]], pop: ['piano', 'x.x.x.x.x.x.x.x.', null] };
const def = V[c.v] || V.cauda;
const patch = def[0];
let pat = def[1];
const arp = c.v === 'pop' || c.sub === 2;
if (c.sub === 1) pat = c.v === 'house' ? '..x..x...x..x...' : 'x..x..x...x..x..';
if (c.sub === 3) pat = 'x...............';
if (arp) pat = 'x.x.x.x.x.x.x.x.';
if (c.e >= 5 && !arp && c.sub !== 3) pat = pat.split('').map((ch, i) => (i % 8 === 0 ? ch : '.')).join('');
if (pat[s] !== 'x') return;
const vo = voicing(H, 57, H.sev || patch !== 'piano' ? 4 : 3);
if (arp) { const idx = [0, 1, 2, 1, 0, 2, 1, 2]; const m = vo[idx[Math.floor(s / 2) % 8] % vo.length] + (s % 8 >= 4 ? 12 : 0); N(c, patch, m, 1.7, 0.75); if (s % 8 === 0) N(c, patch, up(H.ch(0, 3), 45), 7, 0.55); return; }
const len = c.sub === 3 ? 15 : (def[2] && pat === def[1]) ? (s === 0 ? def[2][0] : def[2][1]) : lenTo(pat, s) - 0.3;
CH(c, patch, vo, len, 0.75, 0.008);
if (patch === 'piano' && s === 0) N(c, patch, up(H.ch(0, 2), 40), 7, 0.6);
},
organ(c) {
const s = c.step; if (c.v === 'skank') { const pat = '..xx..xx..xx..xx'; if (pat[s] !== 'x') return; CH(c, 'organ', voicing(c.H, 60, 3), 0.7, s % 2 ? 0.45 : 0.7); return; }
const V = { gospel: ['organ', 'x.........x...x.'], rock: ['organ', 'x.......x.......'], igreja: ['church', 'x...............'] };
const def = V[c.v] || V.gospel; const pat = vary(def[1], c.sub === 3 ? 3 : c.sub === 2 ? 0 : c.sub);
if (pat[s] !== 'x') return;
CH(c, def[0], voicing(c.H, 55, c.v === 'igreja' ? 4 : 3), lenTo(pat, s) - 0.2, 0.7);
if (c.v === 'igreja' || s === 0) N(c, def[0], up(c.H.ch(0, 2), 36), lenTo(pat, s) - 0.2, 0.5);
},
guitar(c) {
const s = c.step, H = c.H, v = c.v;
const r = up(H.ch(0, 2), 40);
if (v === 'distorcido' || v === 'power') {
const pat = vary(v === 'power' ? 'x.....x.x.....x.' : 'x.x.x.xxx.x.x.x.', c.sub);
if (pat[s] !== 'x') return;
let root = r; if (v === 'distorcido' && (s === 6 || s === 7)) root = up(H.note(H.deg + (s === 6 ? 2 : 3), 2), 40);
const L = v === 'power' ? lenTo(pat, s) - 0.2 : (s % 8 === 0 ? 1.8 : 0.7);
CH(c, 'dguit', [root, root + 7, root + 12], L, s % 8 === 0 ? 1 : 0.8, 0.004);
return;
}
if (v === 'skank') { const pat = c.sub === 2 ? '....x.x.....x.x.' : '....x.......x...'; if (pat[s] !== 'x') return; CH(c, 'funkg', voicing(H, 67, 3), 0.7, 0.85, 0.003, { lp: 2400 }); return; }
if (v === 'blues') { const pat = 'x.x.x.x.x.x.x.x.'; if (pat[s] !== 'x') return; const rr = up(H.ch(0, 2), 40); const seq = [0, 7, 0, 9, 0, 10, 0, 9]; const i = (s >> 1) % 8; CH(c, 'cguit', [rr, rr + seq[i]], 1.6, i % 2 ? 0.7 : 0.9, 0.006, { dist: 5, lp: 2200 }); return; }
if (v === 'dedilhada') { const vo = voicing(H, 55, 4); const seq = [0, 1, 2, 3, 2, 1]; if (c.sub === 3 && s % 2) return; N(c, 'cguit', vo[seq[s % 6]] + (s >= 8 && c.sub === 1 ? 12 : 0), 1.4, s % 4 === 0 ? 0.75 : 0.5); return; }
if (v === 'funk') { const pat = vary('x.xx.x.xx.xx.x.x', c.sub); if (pat[s] !== 'x') return; CH(c, 'funkg', voicing(H, 64, 3), 0.5, s % 4 === 0 ? 1 : 0.55, 0.003); return; }
const vo = voicing(H, v === 'highlife' ? 67 : 60, 3);
const pat = vary(v === 'highlife' ? 'x.xxx.xxx.xxx.xx' : 'x.x.x.x.x.x.x.x.', c.sub);
if (pat[s] !== 'x') return;
const seq = v === 'highlife' ? [2, 1, 0, 1, 2, 1, 0, 2] : [0, 1, 2, 1];
const m = vo[seq[s % seq.length] % vo.length] + (v !== 'highlife' && s % 8 >= 4 ? 12 : 0);
N(c, 'cguit', m, v === 'highlife' ? 0.9 : 1.8, 0.8);
},
acoustic(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'batida') {
const pat = vary('x.xx.xx.x.xx.xx.', c.sub); if (pat[s] !== 'x') return;
const r = up(H.ch(0, 3), 45); let notes = [r, up(H.ch(2, 3), r + 1), r + 12, up(H.ch(1, 4), r + 13), up(H.ch(2, 4), r + 14)];
const upStroke = s % 2 === 1; if (upStroke) notes = notes.slice(2).reverse();
CH(c, 'acou', notes, 1.6, upStroke ? 0.55 : 0.85, 0.012);
return;
}
if (v === 'bossa') {
const pat = vary('x..x..x...x..x..', c.sub); if (pat[s] === 'x') CH(c, 'acou', voicing(H, 57, 4), 1.4, 0.7, 0.006);
if (s === 0) N(c, 'acou', up(H.ch(0, 2), 43), 3, 0.8); if (s === 8) N(c, 'acou', up(H.ch(2, 2), 43), 3, 0.7);
return;
}
const pat = vary(v === 'lofi' ? 'x.....x...x.....' : 'x.x.x.x.x.x.x.x.', c.sub); if (pat[s] !== 'x') return;
if (s % 8 === 0) { N(c, 'acou', up(H.ch(0, 2), 43), 3.5, 0.8); return; }
if (s % 8 === 4) { N(c, 'acou', up(H.ch(2, 2), 43), 3.5, 0.7); return; }
const vo = voicing(H, 60, 3); N(c, 'acou', vo[(s >> 1) % 3] + (v === 'lofi' ? 0 : 12), 2, 0.6, 0, v === 'lofi' ? { lp: 1200 } : null);
},
synth(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'lead') return mel(c, 'lead', 5, 1);
if (v === 'chip') { const pat = vary('x.xxx.xxx.xxx.xx', c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 72, 3); const seq = [0, 1, 2, 1, 2, 0]; N(c, 'chip', vo[seq[s % 6]] + (s % 8 === 0 ? 12 : 0), 0.8, 0.8); if (s === 0) N(c, 'chip', up(H.ch(0, 3), 48), 3, 0.6, 0, { g: 0.05 }); return; }
if (v === 'acid') { const rs = rng(hash((c.song.seed || '') + 'sa' + s + (c.pb % 2) + c.sub)); if (s % 2 && rs() < 0.5) return; const off = [0, 3, 7, 10, 12, 7, 5, 0][Math.floor(rs() * 8)]; N(c, 'acid', up(H.ch(0, 3), 48) + off, 0.8, s % 4 === 0 ? 1 : 0.7, 0, { q: 16, env: 4000 }); return; }
if (v === 'wobble') { const hits = c.sub === 2 ? [[0, 4, 2], [4, 4, 3], [8, 6, 4], [14, 2, 6]] : c.sub === 1 ? [[0, 6, 3], [6, 2, 6], [8, 8, 2]] : [[0, 8, 2], [8, 6, 3], [14, 2, 6]]; const hh = hits.find((x) => x[0] === s); if (!hh) return; wob(c, up(H.ch(0, 2), 33), hh[1] * c.st, hh[2] / (60 / c.song.bpm)); return; }
if (v === 'pad') { if (s !== 0 && !(c.sub === 1 && s === 8)) return; CH(c, 'pad', voicing(H, 60, 4), c.sub === 1 ? 7.6 : 15.6, 0.8); N(c, 'pad', up(H.ch(0, 3), 48), 15.6, 0.6); return; }
if (v === 'arpejo') { const pat = vary('xxxxxxxxxxxxxxxx', c.sub === 2 ? 0 : c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 60, 3); const seq = [vo[0], vo[1], vo[2], vo[0] + 12, vo[2], vo[1]]; N(c, 'arp', seq[s % 6] + (c.sub === 2 && s >= 8 ? 12 : 0), 0.8, s % 4 === 0 ? 0.9 : 0.6); return; }
if (v === 'pluck') { const pat = vary('x..x..x.x..x..x.', c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 64, 3); N(c, 'pluck', vo[s % 3], 1.2, 0.8); if (s === 0) N(c, 'pluck', vo[2] + 12, 1.2, 0.5); return; }
const pat = vary('x..x..x...x.....', c.sub); if (pat[s] !== 'x') return;
const vo = voicing(H, 60, 3); CH(c, 'ssaw', [...vo, vo[0] + 12], c.e >= 4 ? 1.8 : lenTo(pat, s) - 0.3, 0.85);
},
strings(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'pizz') { const pat = vary('x.x.x.x.x.x.x.x.', c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 60, 3); N(c, 'pizz', vo[[0, 1, 2, 1][(s >> 1) % 4]] + (s % 8 >= 4 ? 12 : 0), 1, 0.8); return; }
if (v === 'staccato') { const pat = vary('x.x.x.x.x.x.x.x.', c.sub); if (pat[s] !== 'x') return; CH(c, 'str', voicing(H, 57, 3), 0.7, s % 4 === 0 ? 0.9 : 0.65, 0, { a: 0.008, r: 0.08, vib: null }); return; }
if (v === 'tremolo') { if (c.sub === 3 && s % 2) return; CH(c, 'str', voicing(H, 60, 3), 0.85, 0.5 + 0.1 * (s % 2), 0, { a: 0.01, r: 0.05, vib: null, g: 0.07 }); return; }
if (v === 'cello') { if (s !== 0 && s !== 8) return; N(c, 'cello', up(s === 0 ? H.ch(0, 2) : H.ch(2, 2), 38), 7.6, 0.8); return; }
if (s === 0) { const vo = voicing(H, 55, 3); CH(c, 'str', [...vo, vo[vo.length - 1] + 12 > 84 ? vo[0] + 12 : vo[0] + 12], c.sub === 3 ? 15.6 : 15.6, 0.8); }
if (v === 'orquestra') mel(c, 'str', 5, 0, { a: 0.08, g: 0.07 });
},
brass(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'trompete') return mel(c, 'tpt', 4, 1);
if (v === 'anos70') { const pat = vary('x......x..x.....', c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 60, 3); CH(c, 'brass', [...vo, vo[0] + 12], s === 0 ? 2.5 : 1.2, 0.9, 0, { lp: 1400 }); return; }
if (v === 'trombone') { const pat = vary('x.......x.....x.', c.sub); if (pat[s] !== 'x') return; N(c, 'tbn', up(s === 8 ? H.ch(2, 3) : H.ch(0, 3), 46), s === 14 ? 1.5 : 3, 0.9); return; }
const pat = vary('x..x......x.x...', c.sub); if (pat[s] !== 'x') return;
CH(c, 'brass', voicing(H, 60, 3), s === 0 ? 2 : 1, 0.9);
},
sax(c) { const o = { suave: [4, 0, { lp: 1300 }], anos80: [5, 1, { lp: 2600 }], rua: [4, 2, { dist: 4 }] }[c.v] || [4, 0, null]; mel(c, 'sax', o[0], o[1], o[2]); },
flute(c) { const o = { doce: [5, 0], trap: [5, 1], pifano: [6, 2] }[c.v] || [5, 0]; mel(c, 'flute', o[0], o[1]); },
mallets(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'xilofone') return mel(c, 'xylo', 5, 1);
if (v === 'vibrafone') { const pat = vary('x.....x...x.....', c.sub); if (pat[s] !== 'x') return; CH(c, 'vibes', voicing(H, 60, 4), lenTo(pat, s) - 0.2, 0.7, 0.01); return; }
const pat = vary(v === 'kalimba' ? 'x..x..x.x..x..x.' : 'x.xx.xx.x.xx.xx.', c.sub); if (pat[s] !== 'x') return;
const vo = voicing(H, v === 'kalimba' ? 67 : 64, 3); const seq = [0, 1, 2, 1, 2, 0];
N(c, v === 'kalimba' ? 'kalimba' : 'marimba', vo[seq[s % 6]] + (s % 16 >= 12 ? 12 : 0), 1.2, s % 4 === 0 ? 0.9 : 0.65);
},
perc(c) {
const s = c.step, d = c.d, t = c.t, v = c.v, sub = c.sub;
if (v === 'congas') { const pat = vary('l..m.lm.l..m.lm.', sub === 3 ? 0 : sub); const x = pat[s]; if (x === 'l') DR.conga(d, t, 0.9, 190); else if (x === 'm' || x === 'x') DR.conga(d, t, 0.8, 290); if (sub === 2 && s % 4 === 3) DR.conga(d, t, 0.5, 380); return; }
if (v === 'shaker') { if (sub === 3 && s % 2) return; DR.shaker(d, t, s % 2 ? 1 : 0.55); return; }
if (v === 'agogo') { const pat = vary('h.l.h..lh.l.h...', sub === 3 ? 0 : sub); const x = pat[s]; if (x === 'h' || x === 'x') DR.agogo(d, t, 0.9, true); else if (x === 'l') DR.agogo(d, t, 0.8, false); return; }
if (v === 'chimbal') { DR.hat(d, t, s % 4 === 0 ? 0.8 : 0.5, false); const roll = sub === 2 ? s % 4 === 3 : (s === 6 || s === 14 || (sub === 1 && s === 11)); if (roll) { DR.hat(d, t + c.st / 3, 0.4, false); DR.hat(d, t + 2 * c.st / 3, 0.4, false); } return; }
if (v === 'cowbell') { const pat = vary('x.x.x.x.x.x.x.x.', sub); if (pat[s] === 'x') DR.bell(d, t, s % 4 === 0 ? 0.9 : 0.55); return; }
if (v === 'triangulo') { if (sub === 3 && s % 2) return; DR.tri(d, t, s % 4 === 0 ? 1 : 0.6, s % 4 === 2); return; }
if (v === 'surdo') { if (s === 4 || s === 12) DR.tom(d, t, 1, 62); else if ((s === 0 || s === 8) && sub !== 3) DR.tom(d, t, 0.45, 70); if (sub === 2 && (s === 14 || s === 15)) DR.tom(d, t, 0.6, 66); return; }
if (v === 'bongo') { const pat = vary('h.lh.hl.h.lh.hl.', sub === 3 ? 0 : sub); const x = pat[s]; if (x === 'h' || x === 'x') DR.conga(d, t, 0.7, 480); else if (x === 'l') DR.conga(d, t, 0.7, 340); return; }
if (v === 'pandeiro') { const low = s % 8 === 0 || (sub === 1 && s % 8 === 5); DR.pand(d, t, s % 4 === 3 ? 1 : 0.55, low); return; }
const pat = vary('....x.......x.x.', sub); if (pat[s] === 'x' || (c.pb % 2 === 1 && s === 15)) DR.clap(d, t, 0.8);
},
vocals(c) {
const s = c.step, H = c.H, v = c.v;
if (v === 'coro' || v === 'etereas') { if (s !== 0 && !(c.sub === 1 && s === 8)) return; const vo = voicing(H, v === 'etereas' ? 64 : 57, 3); CH(c, v === 'etereas' ? 'airy' : 'choir', vo, c.sub === 1 ? 7.6 : 15.6, 0.7); return; }
if (v === 'scat') return mel(c, 'chop', 5, 2, { fmt: [[500, 7, 1], [1500, 8, 0.6], [2600, 9, 0.3]] });
if (v === 'harmonia') { const pat = vary('....x.......x.x.', c.sub); if (pat[s] !== 'x') return; CH(c, 'choir', voicing(H, 60, 3), s === 14 ? 1.5 : 2.5, 0.8, 0, { a: 0.03, r: 0.25 }); return; }
if (v === 'hey') { if (c.pb % 2 !== 1 || (s !== 4 && s !== 12 && !(c.sub === 2 && s === 14))) return; N(c, 'hey', up(H.ch(0, 4), 57), 1.2, 1); return; }
if (v === 'adlibs') { const r = rng(hash((c.song.seed || '') + 'ad' + c.pb + c.sub)); const a = Math.floor(r() * 4) * 4 + 2, b = Math.floor(r() * 3) * 4 + 7; if (s !== a && s !== b) return; N(c, r() < 0.5 ? 'hey' : 'chop', up(H.ch(Math.floor(r() * 3), 4), 60), 1.5, 0.8, 0, { glide: [r() < 0.5 ? 1.25 : 0.8, 0.12] }); return; }
const pat = vary('x..x..x...x.x...', c.sub); if (pat[s] !== 'x') return; const vo = voicing(H, 64, 3); N(c, 'chop', vo[(s * 7 + c.pb) % 3] + (s >= 10 ? 12 : 0), 0.9, 0.9);
},
fx(c) {
const s = c.step, d = c.d, t = c.t, bs = c.st * 16, v = c.v;
if (v === 'queda') { if (s === 0 && c.pb % 4 === 0) { sweep(d, t, bs, 5000, 200, 0.15, 1.5, true); tone(d, t, 110, bs * 0.8, { w: [['sine', 0, 1]], a: 0.005, d: 1, s: 1, r: 0.1, g: 0.08, glide: [8, bs * 0.8] }); } return; }
if (v === 'vinil') { if (s === 0) sweep(d, t, bs, 1800, 1800, 0.012, 0.5, false, true); if (hash(c.k + 'v') % 7 === 0) nz(d, t + c.st * 0.3, 0.008, 2500, 'bandpass', 1, 0.12); return; }
if (v === 'chuva') { if (s === 0) sweep(d, t, bs, 900, 900, 0.045, 0.4, false, true); const h = hash(c.k + 'r'); if (h % 3 === 0) tone(d, t + (h % 100) / 100 * c.st, 1600 + (h % 1400), 0.03, { w: [['sine', 0, 1]], a: 0.001, d: 0.03, s: 0, r: 0.02, g: 0.03, glide: [1.6, 0.02] }); return; }
if (v === 'sirene') { if (s === 0 && c.pb % 2 === 0) tone(d, t, 820, bs * 2 - 0.2, { w: [['sine', 0, 1], ['triangle', 0, 0.3]], a: 0.2, d: 1, s: 1, r: 0.3, g: 0.05, vib: [0.9, 500] }); return; }
if (v === 'impacto') { if (s === 0 && c.pb % 4 === 0) { osc(d, t, 'sine', 90, 28, 2.2, 0.8, 0.6); sweep(d, t, 1.6, 2500, 120, 0.14, 0.8, true); } return; }
if (v === 'reverso') { if (c.pb % 4 === 3 && s === 8) { const du = 8 * c.st; const n = E.ctx.createBufferSource(); n.buffer = E.noiseBuf; n.loop = true; const hpf = F('highpass', 3500, 0.7); const a = G(0.0005); a.gain.exponentialRampToValueAtTime(0.1, t + du - 0.01); a.gain.linearRampToValueAtTime(0, t + du); n.connect(hpf); hpf.connect(a); a.connect(d); n.start(t, Math.random()); n.stop(t + du + 0.02); keep(n, t + du); } return; }
if (v === 'varredura') { if (s === 0 && c.pb % 2 === 1) sweep(d, t, bs / 2, 400, 5000, 0.07, 4); if (s === 8 && c.pb % 2 === 1) sweep(d, t, bs / 2, 5000, 400, 0.06, 4, true); return; }
if (s === 0 && c.pb % 4 === 2) { sweep(d, t, bs * 2, 250, 6500, 0.12, 2.5); tone(d, t, 220, bs * 2, { w: [['sawtooth', 0, 1]], a: bs, d: 1, s: 1, r: 0.05, g: 0.035, lp: 2500, glide: [0.5, bs * 2] }); }
}
};
const TG = { beat: 0.85, sub: 0.7, bass: 0.74, keys: 0.75, organ: 0.6, guitar: 0.7, acoustic: 0.75, synth: 0.65, strings: 0.7, brass: 0.7, sax: 0.75, flute: 0.65, mallets: 0.65, perc: 0.75, vocals: 0.65, fx: 0.6, voice: 1.4 };
const PAN = { guitar: -0.25, acoustic: 0.2, perc: 0.3, mallets: -0.2, strings: 0.15, brass: -0.15, sax: 0.1, flute: 0.25, keys: -0.1, organ: 0.1, vocals: 0.05 };
const COLOR = { lofi: 3800, rhodes: 3200, jazz: 6500, bossa: 7000 };
const SEND = { keys: 0.18, organ: 0.14, guitar: 0.12, acoustic: 0.16, synth: 0.16, strings: 0.3, brass: 0.16, sax: 0.2, flute: 0.25, mallets: 0.22, vocals: 0.3, fx: 0.1, perc: 0.08, beat: 0.05, voice: 0.16 };

/* ---------- cadeia de efeitos por camada ---------- */
function build(tr) {
const ctx = E.ctx; const inp = G(0.5); const out = G(1); const srcs = []; let node = inp; let tape = null;
const ins = (n) => { node.connect(n); node = n; return n; };
const col = COLOR[tr.variant]; if (col) ins(F('lowpass', col, 0.7));
const fl = tr.filter || {}; const am = (fl.amount != null ? fl.amount : 50) / 100; const cu = (fl.cut != null ? fl.cut : 50) / 100;
const shp = (k) => { const w = ctx.createWaveShaper(); w.curve = curve(k); w.oversample = '4x'; return w; };
switch (fl.id) {
case 'abafado': ins(F('lowpass', 250 + (1 - am) * 1400 + cu * 900, 0.9)); break;
case 'brilhante': { const h = F('highshelf', 2500 + (1 - cu) * 2000); h.gain.value = 4 + am * 10; ins(h); break; }
case 'radio': ins(F('highpass', 350 + cu * 300, 0.8)); ins(F('lowpass', 3200 + cu * 1500, 0.9)); ins(shp(2 + am * 12)); break;
case 'telefone': { ins(F('highpass', 600 + cu * 300, 1)); ins(F('lowpass', 2600 + cu * 800, 1.2)); const pk = F('peaking', 1400, 1.5); pk.gain.value = 6 + am * 6; ins(pk); break; }
case 'lofi': ins(F('lowpass', 1500 + (1 - am) * 3000 + cu * 1000, 0.7)); ins(F('highpass', 80 + am * 120, 0.7)); ins(shp(1 + am * 3)); break;
case 'espacial': ins(F('highpass', 150 + cu * 300, 0.7)); break;
case 'subaquatico': ins(F('lowpass', 200 + cu * 500, 6 + am * 10)); break;
case 'megafone': ins(F('bandpass', 1200 + cu * 1200, 1.5 + am * 2)); ins(shp(8 + am * 30)); break;
case 'vintage': { ins(F('highpass', 200 + cu * 200, 0.7)); ins(F('lowpass', 4500 + cu * 3000, 0.7)); const pk = F('peaking', 900, 0.8); pk.gain.value = 3 + am * 5; ins(pk); break; }
case 'grave': { const f = F('lowshelf', 120 + cu * 250); f.gain.value = 4 + am * 12; ins(f); break; }
case 'agudo': { const f = F('highshelf', 2000 + cu * 3000); f.gain.value = 4 + am * 12; ins(f); break; }
default: break;
}
const fx = tr.fx || {}; const wet = (fx.amount != null ? fx.amount : 40) / 100; const a = (fx.a != null ? fx.a : 50) / 100, b = (fx.b != null ? fx.b : 50) / 100;
const pre = node; const dry = G(1); pre.connect(dry); dry.connect(out);
const wetG = G(wet); wetG.connect(out);
const st = 60 / E.song.bpm / 4, beat = 60 / E.song.bpm;
const lfo = (rate, depth, target, type) => { const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = rate; const g = G(depth); o.connect(g); g.connect(target); o.start(); srcs.push(o); return o; };
switch (fx.id) {
case 'eco': { const dl = ctx.createDelay(2); dl.delayTime.value = 0.12 + a * 0.5; const fb = G(0.15 + b * 0.65); pre.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wetG); break; }
case 'delay': { const steps = [1, 2, 3, 4, 8][Math.min(4, Math.floor(a * 5))]; const L = ctx.createDelay(4), R = ctx.createDelay(4); L.delayTime.value = steps * st; R.delayTime.value = steps * st; const pl = ctx.createStereoPanner(); pl.pan.value = -b; const pr = ctx.createStereoPanner(); pr.pan.value = b; const fb = G(0.45); pre.connect(L); L.connect(pl); pl.connect(wetG); L.connect(R); R.connect(pr); pr.connect(wetG); R.connect(fb); fb.connect(L); break; }
case 'reverb': { const cv = ctx.createConvolver(); cv.buffer = impulse(0.6 + a * 4); const lp = F('lowpass', 1500 + b * 12000, 0.5); pre.connect(cv); cv.connect(lp); lp.connect(wetG); wetG.gain.value = wet * 1.3; break; }
case 'reverso': { const cv = ctx.createConvolver(); cv.buffer = impulse(0.5 + a * 2.5, true); pre.connect(cv); cv.connect(wetG); wetG.gain.value = wet * 1.5; dry.gain.value = 1 - b * 0.7; break; }
case 'distorcao': { const w = shp(3 + a * 80); const lp = F('lowpass', 1200 + b * 9000, 0.7); const mk = G(0.45); pre.connect(w); w.connect(lp); lp.connect(mk); mk.connect(wetG); dry.gain.value = 1 - wet; break; }
case 'chorus': { const dl = ctx.createDelay(0.1); dl.delayTime.value = 0.018; lfo(0.3 + a * 3, 0.002 + b * 0.008, dl.delayTime); pre.connect(dl); dl.connect(wetG); break; }
case 'flanger': { const dl = ctx.createDelay(0.05); dl.delayTime.value = 0.004; lfo(0.08 + a * 1.2, 0.003, dl.delayTime); const fb = G(0.3 + b * 0.6); pre.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wetG); break; }
case 'phaser': { let n = pre; for (let i = 0; i < 4; i++) { const ap = F('allpass', 400 + b * 1500 + i * 300, 1); n.connect(ap); n = ap; lfo(0.2 + a * 3, 300 + b * 800, ap.frequency); } n.connect(wetG); break; }
case 'bitcrush': { const w = ctx.createWaveShaper(); w.oversample = '2x'; w.curve = crush(Math.max(1, Math.round(8 - a * 6))); const lp = F('lowpass', 1200 + (1 - b) * 8000, 0.7); pre.connect(w); w.connect(lp); lp.connect(wetG); dry.gain.value = 1 - wet; break; }
case 'wah': { const bp = F('bandpass', 1000, 4 + b * 10); lfo(0.5 + a * 6, 700, bp.frequency); pre.connect(bp); bp.connect(wetG); wetG.gain.value = wet * 2; dry.gain.value = 1 - wet * 0.8; break; }
case 'stutter': case 'gate': { const vca = G(1); const rate = (fx.id === 'gate' ? [2, 4, 8] : [4, 8, 16])[Math.min(2, Math.floor(a * 3))]; vca.gain.value = 1 - wet / 2; lfo(rate / beat, wet / 2, vca.gain, 'square'); dry.gain.value = 0; wetG.gain.value = 0; pre.connect(vca); vca.connect(out); break; }
case 'tapestop': { const lp = F('lowpass', 18000, 0.7); const vca = G(1); pre.connect(lp); lp.connect(vca); vca.connect(out); dry.gain.value = 0; wetG.gain.value = 0; tape = { lp, vca, amt: wet, len: 0.25 + a * 0.75 }; break; }
case 'vinil': { const s = ctx.createBufferSource(); s.buffer = E.crackBuf; s.loop = true; const bp = F('bandpass', 2500, 0.5); const g = G(wet * 0.9 * (0.5 + a)); s.connect(bp); bp.connect(g); g.connect(out); s.start(); srcs.push(s); const lp = F('lowpass', 7000 - b * 4000, 0.7); pre.connect(lp); lp.connect(wetG); dry.gain.value = 1 - wet; break; }
case 'autotune': { const dl = ctx.createDelay(0.05); dl.delayTime.value = 0.003 + a * 0.008; const fb = G(0.4 + b * 0.5); pre.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wetG); lfo(6, 0.0004, dl.delayTime); break; }
default: wetG.gain.value = 0;
}
if (fl.id === 'espacial') { const cv = ctx.createConvolver(); cv.buffer = impulse(3.5); const g = G(0.2 + am * 0.6); pre.connect(cv); cv.connect(g); g.connect(out); }
const dest = bus(); if (ctx.createStereoPanner) { const pan = ctx.createStereoPanner(); pan.pan.value = PAN[tr.type] || 0; out.connect(pan); pan.connect(dest); } else out.connect(dest);
const sd = SEND[tr.type]; if (sd && E.rvIn) { const sg = G(sd); out.connect(sg); sg.connect(E.rvIn); }
return { inp, out, srcs, v: -1, tape };
}
function kill(ch, slow) { try { const n0 = E.ctx.currentTime; ch.out.gain.cancelScheduledValues(n0); ch.out.gain.setValueAtTime(1, n0 + (slow ? 1.2 : 0)); ch.out.gain.linearRampToValueAtTime(0, n0 + (slow ? 2.4 : 0.06)); } catch (e) {} setTimeout(() => { ch.srcs.forEach((s) => { try { s.stop(); } catch (e) {} }); try { ch.out.disconnect(); } catch (e) {} }, slow ? 3500 : 250); }
function chain(tr) {
const sig = JSON.stringify([tr.fx || null, tr.filter || null, tr.type, tr.variant, Math.round(E.song.bpm)]);
let ch = E.chains[tr.id];
if (ch && ch.sig !== sig) { kill(ch, true); ch = null; }
if (!ch) { ch = build(tr); ch.sig = sig; E.chains[tr.id] = ch; }
const v = ((tr.vol != null ? tr.vol : 80) / 100) * (TG[tr.type] != null ? TG[tr.type] : 0.6);
if (Math.abs(ch.v - v) > 0.001) { if (ch.v < 0) ch.inp.gain.value = v; else { const n0 = E.ctx.currentTime; ch.inp.gain.cancelScheduledValues(n0); ch.inp.gain.setValueAtTime(ch.v, n0); ch.inp.gain.linearRampToValueAtTime(v, n0 + 0.06); } ch.v = v; }
return ch;
}

/* ---------- voz gravada ---------- */
function loadVoice(id) {
if (!id || E.loading[id] || E.bufs[id] || !E.ctx) return;
E.loading[id] = 1;
let url = null; try { url = JSON.parse(W.localStorage.getItem('baille:voice:' + id)); } catch (e) {}
if (!url) return;
fetch(url).then((r) => r.arrayBuffer()).then((ab) => new Promise((res, rej) => { const p = E.ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); })).then((b) => { E.bufs[id] = b; }).catch(() => { E.loading[id] = 0; });
}
function voiceAt(tr, cl, T, t, d) {
const key = cl.id + ':' + E.run; if (E.vs[key]) return;
const buf = E.bufs[tr.voiceId]; if (!buf) { loadVoice(tr.voiceId); return; }
E.vs[key] = 1;
const off = Math.max(0, T - cl.start) + (cl.off || 0); const dur = cl.start + cl.len - T;
if (off >= buf.duration - 0.02 || dur <= 0.02) return;
const src = E.ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = Math.pow(2, (tr.tune || 0) / 12);
const g = G(1); g.gain.setValueAtTime(1, t + Math.max(0.02, dur - 0.03)); g.gain.linearRampToValueAtTime(0, t + dur);
src.connect(g); g.connect(d); src.start(t, off, Math.min(dur, buf.duration - off)); keep(src, t + dur);
}

/* ---------- agendador ---------- */
function smpWant(song) { const o = {}; (song.tracks || []).forEach((tr) => { if (tr.muted) return; (INSMP[tr.type] || []).forEach((n) => { if (SMP.url[n]) o[n] = 1; }); }); return Object.keys(o); }
function prep(s) {
const pk = (typeof packById === 'function' && s.packId) ? packById(s.packId) : null;
const K = s.key && typeof s.key === 'object' ? s.key : parseKey(s.key || (pk && pk.key) || (s.genre && /Trap|Rock|R&B/.test(s.genre) ? 'Lá menor' : 'Dó maior'));
const bpm = Math.max(40, Math.min(220, s.bpm || 110));
return Object.assign({}, s, { swing: s.swing || (pk && pk.swing) || 0, K, bpm, prog: s.prog || (pk && pk.prog) || null, sev: s.sev != null ? s.sev : !!(pk && pk.sev), seed: s.seed || s.packId || 'baille', tracks: (s.tracks || []).map((t) => Object.assign({}, t, { clips: t.clips || (typeof partsToClips === 'function' ? partsToClips(t.parts || [], 960 / bpm) : []), variant: t.variant || (typeof defVar === 'function' ? defVar(t.type, pk) : '') })) });
}
function songAt(time) { let m = E.marks[0]; if (!m) return 0; for (const x of E.marks) if (x.t <= time) m = x; return m.p + (time - m.t); }
function playStep(k, t) {
const song = E.song; const st = 60 / song.bpm / 4; const T = k * st;
const anySolo = song.tracks.some((x) => x.solo);
const act = [];
for (const tr of song.tracks) { if (anySolo ? !tr.solo : tr.muted) continue; const cl = (tr.clips || []).find((c) => T >= c.start - 1e-3 && T < c.start + c.len - 1e-3); if (cl) act.push([tr, cl]); }
const e = act.filter((x) => x[0].type !== 'fx').length; const bar = Math.floor(k / 16);
const H = harmony(song, bar);
for (const [tr, cl] of act) {
let ch; try { ch = chain(tr); } catch (err) { continue; }
const d = ch.inp;
if (ch.tape) { const tp = ch.tape; if (k % 16 === 0) { tp.lp.frequency.cancelScheduledValues(t); tp.lp.frequency.setValueAtTime(18000, t); tp.vca.gain.cancelScheduledValues(t); tp.vca.gain.setValueAtTime(1, t); } const n = Math.max(1, Math.round(tp.len * 8)); if (bar % 2 === 1 && k % 16 === 16 - n) { const du = n * st; tp.lp.frequency.setValueAtTime(18000, t); tp.lp.frequency.exponentialRampToValueAtTime(250, t + du); tp.vca.gain.setValueAtTime(1, t); tp.vca.gain.linearRampToValueAtTime(Math.max(0.02, 1 - tp.amt), t + du); } }
if (tr.type === 'voice') { voiceAt(tr, cl, T, t, d); continue; }
const f = INS[tr.type]; if (!f) continue;
const rate = tr.rate === '½x' ? 0.5 : tr.rate === '2x' ? 2 : 1;
const base = { tr, v: tr.variant, sub: Math.max(0, 'ABCD'.indexOf(tr.sub || 'A')), H, e, d, bar, song, tune: tr.tune || 0, k, alt: (bar % 16) >= 8 };
const sw = song.swing || 0; const tt = sw && k % 4 === 2 && tr.type !== 'beat' ? t + sw * st : t;
try {
if (rate === 0.5) { if (k % 2) continue; const kk = k / 2; f(Object.assign({}, base, { step: kk % 16, pb: Math.floor(kk / 16), t, st: st * 2 })); }
else if (rate === 2) { for (let j = 0; j < 2; j++) { const kk = k * 2 + j; f(Object.assign({}, base, { step: kk % 16, pb: Math.floor(kk / 16), t: t + j * st / 2, st: st / 2 })); } }
else f(Object.assign({}, base, { step: k % 16, pb: bar, t: tt, st }));
} catch (err) { if (W && W.console) W.console.warn('baille audio', tr.type, err); }
}
}
function tick() {
const ctx = E.ctx; if (!ctx || !E.song || !E.playing) return;
if (E.hold) { if (Date.now() < E.hold && E.holdS.some((n) => SMP.st[n] === 1)) return; E.hold = 0; const st0 = 60 / E.song.bpm / 4; const t0 = ctx.currentTime + 0.06; E.nextT = t0 + (E.nextK * st0 - E.holdFrom); E.marks = [{ t: t0, p: E.holdFrom }]; }
const st = 60 / E.song.bpm / 4; let guard = 0;
if (E.nextT < ctx.currentTime - 0.02) { const skip = Math.ceil((ctx.currentTime + 0.04 - E.nextT) / st); E.nextK += skip; E.nextT += skip * st; }
while (E.nextT < ctx.currentTime + 0.32 && guard++ < 96) {
const T = E.nextK * st;
if (E.loop && T >= E.loopEnd - 1e-4) { E.nextK = Math.max(0, Math.ceil(E.loopStart / st - 1e-6)); E.marks.push({ t: E.nextT, p: E.nextK * st }); E.run++; E.vs = {}; continue; }
if (!E.loop && T >= E.end - 1e-4) { if (!E.stopAt) E.stopAt = E.nextT; break; }
playStep(E.nextK, E.nextT);
E.nextK++; E.nextT += st;
}
const now = ctx.currentTime; let li = 0; E.marks.forEach((m, i) => { if (m.t <= now) li = i; }); if (li > 0) E.marks = E.marks.slice(li);
if (E.stopAt && now >= E.stopAt) { const cb = E.onEnd; E.last = E.end; stop(); if (cb) try { cb(); } catch (err) {} }
}
function play(song, o) {
o = o || {}; const ctx = init(); if (!ctx) return false;
if (E.playing) stop(true);
E.song = prep(song); E.owner = o.owner || null; E.loop = !!o.loop;
E.end = o.end != null ? o.end : (song.dur || 30);
E.loopStart = o.loopStart || 0; E.loopEnd = o.loopEnd || E.end; E.onEnd = o.onEnd || null; E.stopAt = 0; E.run++; E.vs = {};
const from = Math.max(0, Math.min(o.from || 0, Math.max(0, E.end - 0.05)));
bus(); const st = 60 / E.song.bpm / 4; const t0 = ctx.currentTime + 0.08;
E.nextK = Math.ceil(from / st - 1e-6); E.nextT = t0 + (E.nextK * st - from);
E.marks = [{ t: t0, p: from }];
E.song.tracks.forEach((tr) => { if (tr.type === 'voice') loadVoice(tr.voiceId); });
const wantS = smpWant(E.song); wantS.forEach(need);
E.hold = wantS.some((n) => SMP.st[n] === 1) ? Date.now() + 2500 : 0; E.holdFrom = from; E.holdS = wantS;
if (E.hold) E.marks = [{ t: ctx.currentTime + 999, p: from }];
E.playing = true; clearInterval(E.timer); E.timer = setInterval(tick, 30); tick();
try { W.localStorage.setItem('baille:audio', JSON.stringify({ by: E.id, t: Date.now() })); } catch (e) {}
return true;
}
function update(song, o) {
if (!E.playing || !song) return;
o = o || {};
const ns = prep(song);
smpWant(ns).forEach(need);
if (ns.bpm !== E.song.bpm) { const p = songAt(E.nextT); const st = 60 / ns.bpm / 4; const nk = Math.ceil(p / st - 1e-6); E.marks.push({ t: E.nextT, p }); E.nextT += nk * st - p; E.nextK = nk; }
E.song = ns;
if (o.end != null) E.end = o.end; else if (song.dur && !o.keepEnd) E.end = song.dur;
if (o.loop != null) E.loop = o.loop;
if (o.loopEnd != null) E.loopEnd = o.loopEnd; else if (E.loop && !o.keepEnd) E.loopEnd = E.end;
}
function stop(quiet) {
const was = E.playing;
if (was && E.ctx) E.last = songAt(E.ctx.currentTime);
E.playing = false; clearInterval(E.timer); E.timer = null;
const ctx = E.ctx;
if (ctx) {
const now = ctx.currentTime;
const o = E.out, r = E.rvIn; E.out = null; E.rvIn = null;
[o, r].forEach((g) => { if (!g) return; try { g.gain.cancelScheduledValues(now); g.gain.setValueAtTime(g.gain.value, now); g.gain.linearRampToValueAtTime(0, now + 0.07); } catch (e) {} });
E.live.forEach((x) => { try { x.s.stop(now + 0.1); } catch (e) {} });
const chs = Object.keys(E.chains).map((k) => E.chains[k]);
setTimeout(() => { chs.forEach((ch) => { ch.srcs.forEach((s2) => { try { s2.stop(); } catch (e) {} }); }); try { if (o) o.disconnect(); if (r) r.disconnect(); } catch (e) {} }, 300);
}
E.live = []; E.chains = {}; E.l808 = {};
E.owner = null; E.stopAt = 0;
}
function pos() { if (!E.playing || !E.ctx) return E.last || 0; return Math.max(0, songAt(E.ctx.currentTime)); }
function bands(n) {
if (!E.an || !E.playing) return null;
const a = new Uint8Array(E.an.frequencyBinCount); E.an.getByteFrequencyData(a);
const out = []; const L = a.length;
for (let i = 0; i < n; i++) { const lo = Math.floor(Math.pow(L, i / n)); const hi = Math.max(lo + 1, Math.floor(Math.pow(L, (i + 1) / n))); let m = 0; for (let j = lo; j < hi && j < L; j++) m = Math.max(m, a[j]); out.push(m / 255); }
return out;
}
function saveVoice(id, dataUrl) { try { W.localStorage.setItem('baille:voice:' + id, JSON.stringify(dataUrl)); } catch (e) { return false; } delete E.bufs[id]; E.loading[id] = 0; return true; }
function preload(types) { if (!init()) return; (types || []).forEach((ty) => (INSMP[ty] || [ty]).forEach(need)); }
const api = { preload, smpSet, smpState: () => Object.assign({}, SMP.st), play, update, stop: () => stop(), pos, bands, isOn: (o) => E.playing && E.owner === o, playing: () => E.playing, owner: () => E.owner, saveVoice, loadVoice, init, parseKey, _E: E };
if (W) W.__bailleAudio = api;
return api;
})();

return { follows, PROGS, KITS, progById, applyKit, applyProg, keyRoot, PAGE, IMG, imgSrc, STORE, plan, isPro, canCreate, countCreate, createLabel, created, FREE_DAILY, maxDur, favs, toggleFav, PRO_TXT, ME_DEFAULT, getMe, avatarSrc, initials, FONTS, INST, PACKS, packById, packByImg, VAR, varName, defVar, PATTERNS, partSec, numParts, fitParts, fmt, cid, partsToClips, clipsFor, makeTrack, buildProject, demoSong, songOf, getDrafts, draftProject, STYLES, coverText, USERS, AUDIO };

})();
};
