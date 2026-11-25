// Alunissage : Pose le module lunaire en douceur sur une plateforme, avec peu de carburant. Plus la plateforme est petite, plus elle rapporte.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Alunissage</span><span class="hint">↑ : moteur · ← → : propulseurs · clic maintenu : moteur · P : pause · manette</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="220"></canvas><button class="btn gFs" id="gFs">PLEIN ÉCRAN</button></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button></div>
      
      <div class="hint">Une partie : 3 vies, le score s'additionne de mission en mission. Les vitesses passent au vert quand l'atterrissage est sans danger.</div><div class="hint">Tous les 5 missions, un nouveau monde (et une vie en plus) : la Lune, Mars et son vent, Europe et sa glace, un astéroïde et ses météores, Titan et son air épais. Chaque astre a sa vraie gravité : sur Mars le module tombe plus de deux fois plus vite que sur la Lune, mais le moteur y pousse plus fort.</div><div class="hint">Chaque atterrissage est noté sur 12 : vitesse au contact, angle du module, centrage sur la plateforme et carburant restant (3 chacun). Note D à A, ou PARFAIT ; une bonne note ajoute des points.</div><div class="hint">Manette : A ou gâchette droite pour le moteur, croix ou stick pour les propulseurs, Start pour la pause.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(300px,calc((100vh - 210px) * 320 / 220)));aspect-ratio:320/220}
.gFs{position:absolute;top:14px;right:14px;opacity:.85}
.gameBox:fullscreen{padding:0;background:#05010b}
.gameBox:fullscreen .gFs{display:none}
.gameBox:fullscreen canvas{max-width:none;width:auto;height:100vh}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "ALUNISSAGE", T: {"k": "#0a0814", "k2": "#141024", "fill": "#1e1834", "fillOn": "#2a2246", "hl": "#362c58", "line": "#544680", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#362c58", "btnHi": "#6a5aa0", "btnLo": "#141024", "btnHov": "#463a70", "btnHovHi": "#8a7ac0", "text": "#f4f0ff", "muted": "#b8b0d8", "acc2": "#5fdf6a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#0c0a18", "bgDot": "#1e1834", "bgDot2": "#141024", "spark": "#544680", "spark2": "#5fdf6a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkkk....", "...kwwwwk...", "..kwbbbbwk..", "..kwbwbbwk..", "..kwwwwwwk..", ".kkggggggkk.", ".kgggggggk..", ".kkkkkkkkkk.", ".k.k....k.k.", "k..k....k..k", "....kook....", ".....kk....."],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; alEngine(false, false); return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 220, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
/* ---------- Alunissage : poser le module en douceur sur une plateforme, avec peu de carburant. Une partie : 3 vies, le score s'additionne de mission en mission.
   Cinq mondes de 5 missions chacun (Lune, Mars et son vent, Europe et sa glace, un astéroïde et ses météores, Titan et son air épais), avec la vraie gravité de chaque astre, puis ils reviennent, plus durs.
   Chaque atterrissage est noté : vitesse, angle, centrage et carburant restant.
   Dans chaque monde : un canyon autour de la plateforme ×3 à partir de la 3e mission, une plateforme ×5 qui flotte et bouge à partir de la 4e. ---------- */
const AL = {G: .012, THR: .032, SIDE: .016, SAFE_VY: .75, SAFE_VX: .45};
const AL_PAL = {k: '#05010b', w: '#e8e8f0', W: '#a8a8c0', g: '#ffd84a', G: '#b08a10', b: '#3fa0ff', r: '#ff4a5a', o: '#ffa030', y: '#fff4a0'};
const AL_SHIP = spr(['....kkk....', '...kwwwk...', '..kwbbbwk..', '..kwbwbwk..', '..kwwwwwk..', '.kkgggggkk.', '.kgGgGgGgk.', '.kkkkkkkkk.', '.k.k...k.k.', 'k..k...k..k', 'kk.......kk'], AL_PAL);
const AL_FLAME = [spr(['.kok.', 'koyok', '.kok.', '..k..'], AL_PAL), spr(['.kok.', 'koyok', 'koyok', '.kok.', '..k..'], AL_PAL)];
// les mondes : gravité, couleurs du sol (arête, bord, trame, ombre, fond), ciel, et ce qui les rend différents
const AL_WORLDS = [
  {name: 'LUNE', ms2: 1.62, g: 1, ground: ['#c8c8d8', '#8a8aa0', '#5a5a70', '#3a3a50', '#4a4a60'], sky: '#04030c'},
  {name: 'MARS', ms2: 3.71, g: 2.29, ground: ['#ffb08a', '#d0704a', '#a04a30', '#5a2418', '#7a3424'], sky: '#1a0806', wind: true},
  {name: 'EUROPE', ms2: 1.31, g: .81, ground: ['#ffffff', '#c8e8ff', '#8ab8e0', '#4a7aa8', '#6a9ac8'], sky: '#02060e', ice: true},
  {name: 'ASTÉROÏDE', ms2: .25, g: .154, ground: ['#a89880', '#7a6a58', '#5a4a3a', '#2a2018', '#3e3226'], sky: '#05020a', meteors: true},  // la gravité de Vesta
  {name: 'TITAN', ms2: 1.35, g: .83, ground: ['#e8b86a', '#c08a40', '#8a5a2a', '#4a2a14', '#6a3e1e'], sky: '#2a1806', drag: true},
];
const alWorld = lv => ({w: AL_WORLDS[Math.floor((lv - 1) / 5) % AL_WORLDS.length], step: (lv - 1) % 5, loop: Math.floor((lv - 1) / (5 * AL_WORLDS.length))});
const als = gstore('alunissage', {games: 0, landed: 0, level: 1, top: 1}); als.perfect ??= 0; als.grades ??= {};
// la note d'un atterrissage : 0 à 3 pour la vitesse, l'angle, le centrage et le carburant
const AL_GRADE = [[12, 'PARFAIT'], [10, 'A'], [7, 'B'], [4, 'C'], [0, 'D']];
function alNotes(t, pad, fuel) {
  const step = (v, a, b, c) => v <= a ? 3 : v <= b ? 2 : v <= c ? 1 : 0, sp = Math.max(t.vy / AL.SAFE_VY, Math.abs(t.vx) / AL.SAFE_VX), deg = Math.abs(t.tilt) * 180 / Math.PI;
  const n = [step(sp, .3, .55, .8), step(deg, 3, 8, 15), step(Math.abs(t.off) / Math.max(1, pad.w / 2 - 5), .2, .5, .8), fuel >= 60 ? 3 : fuel >= 35 ? 2 : fuel >= 15 ? 1 : 0];
  const s = n[0] + n[1] + n[2] + n[3]; return {n, s, grade: AL_GRADE.find(([m]) => s >= m)[1], deg: Math.round(deg)};
}
let al = null;
function alTerrain(level) {  // un sol de collines, avec 3 plateformes plates : large ×2, moyenne ×3, étroite ×5
  const r = seeded(level * 6007), {step} = alWorld(level), pts = [], pads = [], spots = [[30 + r() * 40, 30, 2], [130 + r() * 30, 20, 3], [220 + r() * 50, 12, 5]].map(([a, w, m]) => [Math.round(a), w, m]);
  let x = 0, y = H - 40 - r() * 30;
  while (x <= W) {
    const pad = spots.find(([px0, w]) => x >= px0 && x < px0 + w);
    if (pad && !pad.done) { pad.done = true; x = Math.round(x); pads.push({x0: x, xr: x, w: pad[1], mult: pad[2], y}); pts.push([x, y]); x += pad[1]; pts.push([x, y]); continue; }
    pts.push([x, y]); const nx = x + 6 + r() * 8, skip = spots.find(q => !q.done && q[0] > x && q[0] < nx); x = skip ? skip[0] : nx; y = Math.max(120, Math.min(H - 12, y + (r() - .5) * (18 + level % 20 * 4)));
  }
  const p3 = pads.find(p => p.mult === 3);
  if (step >= 2) {  // un canyon : deux parois raides de part et d'autre de la plateforme ×3
    const top = Math.max(70, p3.y - 42 - step * 4);
    for (const q of pts) if ((q[0] >= p3.xr - 18 && q[0] < p3.xr) || (q[0] > p3.xr + p3.w && q[0] <= p3.xr + p3.w + 18)) q[1] = Math.min(q[1], top);
    pts.push([p3.xr - 4, top], [p3.xr + p3.w + 4, top]); pts.sort((a, b) => a[0] - b[0]); p3.canyon = true;
  }
  if (step >= 3) {  // la plateforme ×5 décolle : elle flotte au-dessus du sol et va et vient
    const p5 = pads.find(p => p.mult === 5); p5.float = true; p5.w = 18; p5.base = Math.min(W - 56, Math.max(150, p5.x0)); p5.y = 92 + r() * 20; p5.amp = 18 + step * 4; p5.sp = .008 + step * .002;
  }
  return {pts, pads};
}
const alGround = x => { const p = al.pts; for (let i = 1; i < p.length; i++) if (x <= p[i][0]) { const [x0, y0] = p[i - 1], [x1, y1] = p[i]; return y0 + (y1 - y0) * (x - x0) / Math.max(1e-6, x1 - x0); } return H; };
const alPadX = p => p.float ? p.base + Math.sin(al.tick * p.sp) * p.amp : p.x0;  // où est la plateforme maintenant
// une nouvelle partie : mission 1, 3 vies, score à zéro
function alStart() { als.games++; saveGames(); al = Object.assign(al || {tick: 0, raf: 0}, {run: {score: 0, lives: 3}}); alNew(1); }
function alNew(level) {
  als.level = level; saveGames(); const t = alTerrain(level), {w, step, loop} = alWorld(level);
  al = Object.assign(al, {mode: 'ready', ...t, world: w, step, grav: AL.G * w.g * (1 + step * .05 + loop * .15), thr: AL.THR * Math.max(.5, w.g), touch: null, x: 40, y: 24, vx: .6, vy: 0, fuel: 100, keys: {}, why: '', score: 0, endAt: 0,
    bg: null, ground: null, tilt: 0, squash: 0, dust: [], fx: [], meteors: [], warn: [], slide: null, ride: null, flame: false, side: false, wind: 0, windPh: level * 1.7, newWorld: step === 0 && level > 1});
  if (al.newWorld && al.run.lives < 5) { al.run.lives++; al.lifeUp = true; } else al.lifeUp = false;  // un nouveau monde rend une vie
  alInfo();
}
function alLand(pad) {  // posé : les points s'ajoutent à la partie, la fête
  al.mode = 'won'; al.endAt = al.tick; al.slide = null; al.y = pad.y - 6; al.squash = 10;
  const t = al.touch || {vy: al.vy, vx: al.vx, tilt: al.tilt, off: al.x - (alPadX(pad) + pad.w / 2)}; al.notes = alNotes(t, pad, al.fuel);
  if (al.notes.s > (als.grades[als.level] ?? -1)) als.grades[als.level] = al.notes.s; if (al.notes.s === 12) als.perfect++;
  al.score = Math.round((50 + al.fuel * 5 + al.notes.s * 25) * pad.mult); al.mult = pad.mult; al.run.score += al.score; als.landed++; if (als.level >= als.top) als.top = als.level + 1;
  if (pad.float) al.ride = al.x - alPadX(pad);
  const X = alPadX(pad) + pad.w / 2;
  for (let i = 0; i < 40; i++) { const a = -Math.PI * Math.random(), v = 1 + Math.random() * 2.2; al.fx.push({x: X, y: pad.y - 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 50 + Math.random() * 30, c: ['#ffd84a', '#5fdf6a', '#ffffff', '#3fa0ff'][i % 4]}); }
  best('alunissage', al.run.score); saveGames(); alInfo();
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .16, 'triangle'), i * 110));
  if (al.notes.s === 12) setTimeout(() => [1046, 1318, 1568, 2093].forEach((f, i) => setTimeout(() => beep(f, .12, 'square', 0, .05), i * 70)), 500);  // PARFAIT : une petite fanfare de plus
}
function alCrash(why) {
  al.mode = 'over'; al.endAt = al.tick; al.why = why; al.slide = null; al.boom = []; al.run.lives--;
  for (let i = 0; i < 30; i++) al.boom.push({x: al.x, y: al.y, vx: (Math.random() - .5) * 3, vy: -Math.random() * 2.5, c: ['#ffa030', '#ff4a5a', '#e8e8f0'][i % 3]});
  beep(90, .6, 'sawtooth', 40, .12); if (!al.run.lives) best('alunissage', al.run.score); saveGames(); alInfo();
}
function alUpdate() {
  const k = al.keys, up = k.up && al.fuel > 0 && !al.slide, left = k.left && al.fuel > 0, right = k.right && al.fuel > 0;
  if (al.world.wind) { al.wind = Math.sin(al.tick * .008 + al.windPh) * (.6 + al.step * .15) + Math.sin(al.tick * .031) * .25; if (!al.slide) al.vx += al.wind * .0045; }
  if (left) { al.vx -= AL.SIDE; al.fuel -= .1; } if (right) { al.vx += AL.SIDE; al.fuel -= .1; }
  al.side = left || right; al.tilt += (((right ? 1 : 0) - (left ? 1 : 0)) * .28 + al.vx * .2 - al.tilt) * .15;
  if (al.slide) {  // sur la glace d'Europe : le module glisse, les propulseurs freinent
    const p = al.slide; al.vx *= .992; al.x += al.vx; al.fuel = Math.max(0, al.fuel);
    if (al.x - 5 < p.x0 - 1 || al.x + 5 > p.x0 + p.w + 1) return alCrash('Glissé hors de la plateforme');
    if (Math.abs(al.vx) < .03) alLand(p); return;
  }
  al.vy += al.grav; if (up) { al.vy -= al.thr; al.fuel -= .22; }
  if (al.world.drag) { al.vx *= .985; al.vy *= .99; }  // l'air épais de Titan : on ne tombe jamais très vite, mais le vent de côté s'arrête vite aussi
  al.fuel = Math.max(0, al.fuel); const prevFoot = al.y + 6; al.x += al.vx; al.y += al.vy; al.flame = up;
  if (al.x < 6) { al.x = 6; al.vx = 0; } if (al.x > W - 6) { al.x = W - 6; al.vx = 0; }
  const foot = al.y + 6, gl = Math.min(alGround(al.x - 5), alGround(al.x + 5)), soft = al.vy <= AL.SAFE_VY && Math.abs(al.vx) <= AL.SAFE_VX;
  if (up && gl - foot < 46) for (let i = 0; i < 2; i++) { const s = Math.random() < .5 ? -1 : 1; al.dust.push({x: al.x + s * Math.random() * 4, y: gl - 1, vx: s * (.6 + Math.random() * 1.4) * (1 - (gl - foot) / 50), vy: -Math.random() * .5, t: 30 + Math.random() * 20}); }
  for (const p of al.pads) if (p.float) {  // la plateforme volante : on s'y pose par le dessus
    const X = alPadX(p); if (prevFoot <= p.y && foot >= p.y && al.x + 5 > X && al.x - 5 < X + p.w) {
      if (al.x - 5 < X - 1 || al.x + 5 > X + p.w + 1) return alCrash('Pas sur une plateforme');
      const rel = al.vx - p.amp * p.sp * Math.cos(al.tick * p.sp);
      if (al.vy > AL.SAFE_VY) return alCrash('Trop vite vers le bas'); if (Math.abs(rel) > AL.SAFE_VX) return alCrash('Trop vite de côté');
      al.x = Math.max(X + 5, Math.min(X + p.w - 5, al.x)); al.touch = {vy: al.vy, vx: rel, tilt: al.tilt, off: al.x - (X + p.w / 2)}; return alLand(p);
    }
  }
  if (al.world.meteors) {  // les météores : un « ! » prévient d'où ils arrivent
    if (al.tick % Math.max(28, 70 - al.step * 9) === 0) al.warn.push({x: 20 + Math.random() * (W - 40), vx: (Math.random() - .5) * 1.6, t: 45});
    for (const w of al.warn) if (--w.t <= 0) al.meteors.push({x: w.x, y: -4, vx: w.vx, vy: 1.3 + Math.random() * .6 + al.step * .1});
    al.warn = al.warn.filter(w => w.t > 0);
    for (const m of al.meteors) { m.x += m.vx; m.y += m.vy; if (Math.hypot(m.x - al.x, m.y - al.y) < 6) return alCrash('Touché par un météore');
      if (m.y >= alGround(m.x)) { m.dead = true; for (let i = 0; i < 6; i++) al.dust.push({x: m.x, y: m.y - 1, vx: (Math.random() - .5) * 2, vy: -Math.random() * 1.2, t: 25}); beep(70, .12, 'square', 40, .03); } }
    al.meteors = al.meteors.filter(m => !m.dead && m.x > -10 && m.x < W + 10);
  }
  if (foot >= gl) {
    const pad = al.pads.find(p => !p.float && al.x - 5 >= p.x0 - 1 && al.x + 5 <= p.x0 + p.w + 1);
    if (!pad) return alCrash('Pas sur une plateforme');
    if (!soft) return alCrash(al.vy > AL.SAFE_VY ? 'Trop vite vers le bas' : 'Trop vite de côté');
    al.touch = {vy: al.vy, vx: al.vx, tilt: al.tilt, off: al.x - (pad.x0 + pad.w / 2)};
    if (al.world.ice && Math.abs(al.vx) >= .03) { al.slide = pad; al.y = pad.y - 6; al.vy = 0; al.squash = 6; beep(1200, .2, 'triangle', 600, .04); return; }
    return alLand(pad);
  }
}
// le son du moteur : un souffle continu (bruit filtré), plus aigu pour les propulseurs latéraux
let eng = null;
function alEngine(main, side) {
  if (!actx && !main && !side) return;
  try { actx ??= new AudioContext(); } catch { return; }
  if (!eng) { const b = actx.createBuffer(1, actx.sampleRate, actx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), gn = actx.createGain(); s.buffer = b; s.loop = true; f.type = 'lowpass'; gn.gain.value = 0; s.connect(f).connect(gn).connect(actx.destination); s.start(); eng = {f, gn}; }
  const t = actx.currentTime; eng.gn.gain.setTargetAtTime(main ? .1 : side ? .035 : 0, t, .04); eng.f.frequency.setTargetAtTime(main ? 340 + Math.random() * 80 : 1500, t, .04);
}
document.addEventListener('visibilitychange', () => document.hidden && alEngine(false, false));
// le décor : le ciel et son astre, les étoiles en trois couches qui défilent, le sol tramé
function alPlanet(b, w) {
  const disc = (cx, cy, R, f) => { for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) { const d = Math.hypot(x, y); if (d <= R) { const c = f(x, y, d); if (c) px(b, c, cx + x, cy + y); } } };
  if (w.name === 'LUNE') {  // la Terre : océans, continents, nuages, et la nuit sur un côté
    const n = (x, y) => Math.sin(x * .55 + Math.sin(y * .4) * 2) + Math.sin(y * .62 - x * .21) * .9 + Math.sin((x + y) * .9) * .35;
    disc(246, 74, 13, (x, y, d) => { const night = x + y * .3 > 5, c = (Math.sin(x * 1.3 + y * 2.1) > .85 || Math.sin(x * .8 - y * 1.7 + 1) > .93) ? '#ffffff' : n(x, y) > .9 ? (y < -9 || y > 10 ? '#e8f4ff' : n(x, y) > 1.6 ? '#9a8a4a' : '#4aa04a') : '#2a6ad8';
      return d > 12.2 ? '#7ab8ff' : night ? ({'#ffffff': '#5a6a8a', '#e8f4ff': '#5a6a8a', '#9a8a4a': '#3a3420', '#4aa04a': '#1e3a24', '#2a6ad8': '#0e2050'})[c] : c; });
  } else if (w.name === 'MARS') {  // Phobos et un soleil pâle dans la poussière
    disc(236, 70, 5, (x, y) => Math.sin(x * 2 + y) > .6 ? '#5a4a40' : x + y > 3 ? '#4a3a32' : '#8a7a6a'); disc(150, 60, 3, () => '#ffe8c0');
  } else if (w.name === 'EUROPE') {  // Jupiter, énorme, avec ses bandes et sa tache
    disc(292, 78, 34, (x, y, d) => { const sp = Math.hypot((x + 10) / 1.6, y - 9) < 4; const band = ['#e8d0a8', '#c89a6a', '#f4e4c8', '#a8744a', '#e0c49a', '#b8845a'][Math.floor((y + 34 + Math.sin(x * .2) * 1.5) / 6) % 6]; return sp ? '#c8503a' : x + y * .2 > 18 ? '#4a3420' : band; });
  } else if (w.name === 'TITAN') {  // Saturne et ses anneaux, à peine visibles dans la brume orange
    disc(250, 64, 20, (x, y) => (Math.floor((y + 20) / 5) % 2 ? '#c8a060' : '#b08850'));
    for (let x = -36; x <= 36; x++) { const y = Math.round(x * .18); if (Math.abs(x) > 19 || y > 1) px(b, '#d8c090', 250 + x, 64 + y, 1, 1); }
    for (let y = 0; y < 150; y++) { b.globalAlpha = .55 * (1 - y / 150) + .15; px(b, '#a86a2a', 0, y, W, 1); } b.globalAlpha = 1;
  } else {  // l'astéroïde : un soleil lointain et une nébuleuse
    for (let x = 0; x < W; x++) for (let y = 0; y < 110; y++) { const v = Math.sin(x * .03 + y * .05) + Math.sin(x * .011 - y * .07) - Math.abs(y - 40 - x * .15) * .03; if (v > 1.2 && (x + y) % 2) px(b, v > 1.6 ? '#3a1a4a' : '#24102e', x, y); }
    disc(196, 62, 6, (x, y, d) => d > 5 ? '#ffa030' : '#fff4a0');
  }
}
const alStars = lv => { const r = seeded(lv * 31 + 7), s = []; for (let i = 0; i < 110; i++) s.push({x: r() * W, y: r() * 150, l: i % 3}); return s; };
function alDraw() {
  const w = al.world, G = w.ground, playing = al.mode === 'play';
  if (!al.bg) { al.bg = cnv(W, H, b => { px(b, w.sky, 0, 0, W, H); for (let y = 0; y < 150; y += 2) px(b, w.sky === '#1a0806' ? '#24100a' : '#080614', 0, y + Math.floor(y / 30) * 2, W, 1); }); al.planet = cnv(W, H, b => alPlanet(b, w)); al.stars = alStars(als.level); }
  if (!al.ground) al.ground = cnv(W, H, b => { for (let x = 0; x < W; x++) { const top = Math.round(alGround(x)); for (let y = top; y < H; y++) { const d = y - top; px(b, d < 1 ? G[0] : d < 3 ? G[1] : (x + y) % 2 && d < 8 ? G[2] : (x * 7 + y * 3) % 13 === 0 ? G[3] : G[4], x, y); } }
    for (const p of al.pads) if (!p.float) { px(b, '#05010b', Math.floor(p.x0), p.y - 1, p.w + 1, 3); px(b, '#ffd84a', p.x0 + 1, p.y - 1, p.w - 2, 1); } });
  g.drawImage(al.bg, 0, 0);
  for (const s of al.stars) { const sp = [.03, .08, .16][s.l]; px(g, ['#3a3a5a', '#7a7aa0', '#ffffff'][s.l], (s.x - al.tick * sp % W + W) % W, s.y, 1, 1); }
  g.drawImage(al.planet, 0, 0); g.drawImage(al.ground, 0, 0);
  // les plateformes : feux qui clignotent, drapeau qui montre le vent sur Mars, la volante avec ses réacteurs
  for (const p of al.pads) { const X = alPadX(p), blink = Math.floor(al.tick / 20) % 2, lit = al.mode === 'won' && al.mult === p.mult && blink;
    if (p.float) { px(g, '#05010b', X - 1, p.y - 1, p.w + 2, 4); px(g, lit ? '#ffffff' : '#ffd84a', X, p.y - 1, p.w, 1); px(g, '#6a6a8a', X, p.y, p.w, 2); g.drawImage(AL_FLAME[al.tick % 6 < 3 ? 0 : 1], Math.round(X + p.w / 2) - 2, p.y + 2); }
    else if (lit) px(g, '#ffffff', p.x0 + 1, p.y - 1, p.w - 2, 1);
    px(g, blink ? '#ff4a5a' : '#7a1a24', X, p.y - 3, 1, 2); px(g, blink ? '#ff4a5a' : '#7a1a24', X + p.w - 1, p.y - 3, 1, 2);
    if (w.wind) { const fx = X + p.w - 1, len = Math.round(Math.abs(al.wind) * 6) + 1, dir = Math.sign(al.wind) || 1; px(g, '#c8c8d8', fx, p.y - 11, 1, 9); for (let i = 0; i < len; i++) px(g, i % 2 ? '#ff4a5a' : '#ffffff', fx + dir * (i + 1), p.y - 11 + (Math.sin(al.tick * .3 + i) > .6 ? 1 : 0), 1, 2); }
    pxFont(g, '×' + p.mult, X + p.w / 2, p.y + 12, blink ? '#ffd84a' : '#fff4a0', 6, 'center'); }
  // poussière, vent, météores
  for (const d of al.dust) { if (playing) { d.x += d.vx; d.y += d.vy; d.vy += .02; d.t--; } px(g, d.t > 20 ? G[1] : G[2], d.x, d.y, 1, 1); } al.dust = al.dust.filter(d => d.t > 0);
  if (w.wind) for (let i = 0; i < 26; i++) { const sp = 1 + (i % 4) * .6, x = ((i * 53 + al.tick * al.wind * sp * 1.4) % W + W) % W, y = 40 + (i * 37) % 150; px(g, i % 3 ? '#a0603a' : '#d0906a', x, y + Math.sin(al.tick * .05 + i) * 2, 2, 1); }
  if (w.drag) for (let i = 0; i < 40; i++) { const x = ((i * 47 + al.tick * 1.2) % (W + 40)) - 20, y = ((i * 71 + al.tick * 2.2) % 200); px(g, '#d89a4a', x, y, 1, 2); }  // la bruine de méthane
  for (const m of al.warn) if (m.t % 10 < 6) pxFont(g, '!', m.x, 10, '#ff4a5a', 8, 'center');
  for (const m of al.meteors) { for (let i = 1; i < 6; i++) px(g, i < 3 ? '#ffa030' : '#7a3a10', m.x - m.vx * i * 1.5, m.y - m.vy * i * 1.5, 2, 2); px(g, '#ffffff', m.x - 1, m.y - 1, 3, 3); px(g, '#ffd84a', m.x, m.y, 2, 2); }
  // le module : il penche, ses pieds s'écrasent au contact, flammes et petits jets
  const ride = al.ride != null ? al.pads.find(p => p.float && p.mult === al.mult) : null; if (ride) al.x = alPadX(ride) + al.ride;
  if (al.mode !== 'over') {
    const sq = al.squash > 0 ? Math.sin(al.squash / 10 * Math.PI) * 2 : 0; if (al.squash > 0) al.squash -= .5;
    const gl = Math.min(alGround(al.x - 5), alGround(al.x + 5)), alt = gl - al.y - 6;
    if (playing && alt > 6 && alt < 120) for (let x = -4; x <= 4; x += 2) px(g, 'rgba(0,0,0,.35)', al.x + x * (1 - alt / 140), gl - 1, 1, 1);  // l'ombre au sol
    g.save(); g.translate(Math.round(al.x), Math.round(al.y)); g.rotate(playing ? al.tilt : 0);
    if (al.flame && playing) g.drawImage(AL_FLAME[Math.floor(al.tick / 3) % 2], -2, 6);
    g.drawImage(AL_SHIP, -5, -5 + sq, 11, 11 - sq);
    if (playing && al.fuel > 0) { if (al.keys.left) px(g, '#ffa030', 5 + (al.tick % 2), 0, 2, 1); if (al.keys.right) px(g, '#ffa030', -7 - (al.tick % 2), 0, 2, 1); }
    g.restore();
  } else for (const b of al.boom) { b.vy += .06; b.x += b.vx; b.y += b.vy; px(g, b.c, b.x, b.y, 2, 2); }
  for (const f of al.fx) { f.x += f.vx; f.y += f.vy; f.vy += .05; f.t--; px(g, f.c, f.x, f.y, f.t > 30 ? 2 : 1, f.t > 30 ? 2 : 1); } al.fx = al.fx.filter(f => f.t > 0);
  // le tableau de bord : carburant, vitesses (vertes quand elles sont sûres), altitude, vies, score de la partie
  px(g, '#05010b', 4, 4, 82, 30); px(g, '#141428', 5, 5, 80, 28);
  pxFont(g, 'CARBURANT', 8, 12, '#a8a8c0', 6); px(g, '#2a2a40', 8, 15, 72, 4); px(g, al.fuel > 25 ? '#5fdf6a' : '#ff4a5a', 8, 15, Math.round(72 * al.fuel / 100), 4);
  const okV = al.vy <= AL.SAFE_VY, okH = Math.abs(al.vx) <= AL.SAFE_VX;
  pxFont(g, '↓ ' + (al.vy * 10).toFixed(0), 8, 29, okV ? '#5fdf6a' : '#ff4a5a', 6); pxFont(g, '→ ' + (Math.abs(al.vx) * 10).toFixed(0), 46, 29, okH ? '#5fdf6a' : '#ff4a5a', 6);
  const alt = Math.max(0, Math.round(Math.min(alGround(al.x - 5), alGround(al.x + 5)) - al.y - 6)), ah = Math.min(1, alt / 180);
  px(g, '#05010b', 4, 38, 14, 70); px(g, '#141428', 5, 39, 12, 68); px(g, alt < 30 ? '#ffa030' : '#3fa0ff', 8, 104 - Math.round(52 * ah), 6, Math.max(1, Math.round(52 * ah))); pxFont(g, 'ALT', 11, 47, '#a8a8c0', 6, 'center'); pxFont(g, String(alt), 21, 47, alt < 30 ? '#ffa030' : '#c8c8e0', 6);
  pxFont(g, w.name + ' · MISSION ' + als.level, W - 6, 12, '#c8c8e0', 6, 'right');
  pxFont(g, String(al.run.score), W - 6, 26, '#ffffff', 8, 'right');
  for (let i = 0; i < al.run.lives; i++) g.drawImage(AL_SHIP, W - 16 - i * 13, 31);
  pxFont(g, 'g ' + w.ms2.toFixed(2).replace('.', ',') + ' m/s²', W - 6, 64, '#8a8aa8', 6, 'right');
  if (playing) { const deg = Math.round(Math.abs(al.tilt) * 180 / Math.PI); pxFont(g, 'angle ' + deg + '°', W - 6, 74, deg <= 3 ? '#5fdf6a' : deg <= 8 ? '#ffd84a' : '#ffa030', 6, 'right'); }
  if (w.wind) pxFont(g, 'VENT ' + (al.wind < 0 ? '←' : '→') + ' ' + Math.round(Math.abs(al.wind) * 10), 92, 12, '#d0906a', 6);
  if (al.slide) pxFont(g, 'ÇA GLISSE ! FREINE ← →', W / 2, 60, al.tick % 20 < 12 ? '#c8e8ff' : '#ffffff', 8, 'center');
  const T = 30;  // les messages, en haut du ciel : ils ne cachent jamais les plateformes
  if (al.mode === 'ready') gameText(g, W, al.newWorld ? [['NOUVEAU MONDE : ' + w.name, '#ffd84a', 12], [AL_TIP[AL_WORLDS.indexOf(w)], '#ffffff'], [al.lifeUp ? 'Une vie en plus !' : 'Mission ' + als.level, '#5fdf6a'], ['Espace, ↑ ou clic pour partir', '#ffd84a']]
    : als.level === 1 ? [['ALUNISSAGE', '#ffd84a', 14], ['↑ pousse, ← → glissent', '#ffffff'], ['Arrive lentement sur une plateforme', '#a8a8c0'], ['Espace, ↑ ou clic pour partir', '#ffd84a']]
    : [['MISSION ' + als.level, '#ffd84a', 12], [AL_STEP[al.step], '#ffffff'], ['Espace, ↑ ou clic pour partir', '#ffd84a']], T);
  if (al.mode === 'won' && al.tick - al.endAt > 30) { const N = al.notes, gc = {PARFAIT: '#ffd84a', A: '#5fdf6a', B: '#8ad8ff', C: '#ffa030', D: '#ff4a5a'}[N.grade];
    gameText(g, W, [['POSÉ ×' + al.mult + ' · ' + (N.s === 12 ? 'PARFAIT !' : 'NOTE ' + N.grade), gc, 12], ['Vitesse ' + N.n[0] + ' · Angle ' + N.n[1] + ' · Centre ' + N.n[2] + ' · Carburant ' + N.n[3] + ' sur 3', '#c8c8e0'], ['+' + al.score + ' · total ' + al.run.score, '#ffffff'], ['Clic : mission suivante', '#ffd84a']], T); }
  if (al.mode === 'over' && al.tick - al.endAt > 40) gameText(g, W, al.run.lives ? [['CRASH', '#ff4a5a', 12], [al.why, '#ffffff'], [al.run.lives + (al.run.lives > 1 ? ' vies restantes' : ' vie restante') + ' · clic pour réessayer', '#ffd84a']]
    : [['PARTIE FINIE', '#ff4a5a', 12], [al.why, '#ffffff'], [al.run.score + ' points · mission ' + als.level, '#ffffff'], ['Clic : nouvelle partie', '#ffd84a']], T);
  if (al.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['P pour reprendre', '#ffffff']], T);
  alEngine(playing && al.flame, playing && al.side && al.fuel > 0);
}
const AL_TIP = ['Gravité de la Lune : 1,62 m/s²', 'Gravité 3,71 : ça tombe vite, et le vent pousse', 'La glace glisse : freine avec ← → une fois posé', 'Presque pas de gravité, attention aux météores', 'L’air épais freine tout : profite-en pour viser'];
const AL_STEP = ['', 'La gravité augmente', 'Un canyon autour de la plateforme ×3', 'La plateforme ×5 flotte et bouge', 'Canyon et plateforme mobile'];
const alKey = (e, down) => {
  if (!keyOk(e) || !al) return; const m = {ArrowUp: 'up', z: 'up', w: 'up', ArrowLeft: 'left', q: 'left', a: 'left', ArrowRight: 'right', d: 'right'}[e.key.length === 1 ? e.key.toLowerCase() : e.key];
  if (m) { e.preventDefault(); al.keys[m] = down; if (down && m === 'up' && !e.repeat && al.mode !== 'play' && al.mode !== 'pause') alGo(); }
  if (down && (e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); alGo(); }
  if (down && e.key.toLowerCase() === 'p' && al.mode === 'play') al.mode = 'pause'; else if (down && e.key.toLowerCase() === 'p' && al.mode === 'pause') al.mode = 'play';
};
function alGo() {
  if (al.mode === 'ready') al.mode = 'play';
  else if (al.mode === 'won' && al.tick - al.endAt > 30) alNew(als.level + 1);
  else if (al.mode === 'over' && al.tick - al.endAt > 40) { if (al.run.lives) alNew(als.level); else alStart(); }
}
document.addEventListener('keydown', e => alKey(e, true)); document.addEventListener('keyup', e => alKey(e, false));
cv.onpointerdown = e => { e.preventDefault(); if (!al) return; if (al.mode === 'play') { al.keys.up = true; cv.setPointerCapture(e.pointerId); } else alGo(); };
cv.onpointerup = () => { if (al) al.keys.up = false; };
{  // la manette envoie les touches du clavier : A ou la gâchette droite = moteur, croix et stick = propulseurs, Start = pause
  const KEY = {0: 'ArrowUp', 7: 'ArrowUp', 12: 'ArrowUp', 14: 'ArrowLeft', 15: 'ArrowRight', 9: 'p'}, held = new Set();
  const send = (k, type) => document.dispatchEvent(new KeyboardEvent(type, {key: k, bubbles: true}));
  const loop = () => {
    requestAnimationFrame(loop); if (!view.classList.contains('on') || !navigator.getGamepads) return;
    const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
    const down = new Set(), [ax = 0, ay = 0] = p.axes;
    for (const [i, k] of Object.entries(KEY)) if (p.buttons[i]?.pressed) down.add(k);
    if (ax < -.4) down.add('ArrowLeft'); if (ax > .4) down.add('ArrowRight'); if (ay < -.5) down.add('ArrowUp');
    for (const k of down) if (!held.has(k)) { held.add(k); send(k, 'keydown'); }
    for (const k of [...held]) if (!down.has(k)) { held.delete(k); send(k, 'keyup'); }
  };
  requestAnimationFrame(loop);
}
$('gFs').onclick = () => { $('gFs').blur(); if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); };
function alInfo() {
  setTimeout(alTrophies); showStats([['Meilleure partie', games.best.alunissage || 0], ['Partie en cours', al?.run ? al.run.score + ' · ' + al.run.lives + (al.run.lives > 1 ? ' vies' : ' vie') : '—'], ['Mission la plus loin', als.top], ['Atterrissages', als.landed], ['Parfaits', als.perfect], ['Note de cette mission', als.grades[als.level] != null ? AL_GRADE.find(([m]) => als.grades[als.level] >= m)[1] + ' · ' + als.grades[als.level] + '/12' : '—']]); }
$('gNew').onclick = () => { alStart(); $('gNew').blur(); };
{  // vérification : trois plateformes à chaque mission, le canyon laisse la place de se poser sur la ×3, un module qui tombe s'écrase, un bon atterrissage compte, une partie a 3 vies
  let ok = true; const keep = al, ks = {...als, grades: {...als.grades}}, kb = games.best.alunissage;
  al = {tick: 0, raf: 0, run: {score: 0, lives: 3}};
  for (let lv = 1; lv <= 60; lv++) { const t = alTerrain(lv); ok &&= t.pads.length === 3 && t.pads.every(p => p.w >= 12);
    al.pts = t.pts; for (const p of t.pads) if (!p.float) for (const c of [p.x0 + 5, p.x0 + p.w / 2, p.x0 + p.w - 5]) ok &&= Math.abs(Math.min(alGround(c - 5), alGround(c + 5)) - p.y) < .5; }
  alNew(1); al.mode = 'play'; al.x = 100; al.vy = 2; for (let i = 0; i < 400 && al.mode === 'play'; i++) alUpdate(); const crashed = al.mode === 'over' && al.run.lives === 2;
  alNew(1); const p2 = al.pads.find(p => p.mult === 2); al.mode = 'play'; al.x = p2.x0 + p2.w / 2; al.y = p2.y - 20; al.vx = 0; al.vy = 0; al.keys = {}; for (let i = 0; i < 400 && al.mode === 'play'; i++) { al.keys.up = al.vy > .4; alUpdate(); }
  const landed = al.mode === 'won' && al.run.score > 0;
  const pad = {w: 30}, perf = alNotes({vy: .1, vx: 0, tilt: 0, off: 1}, pad, 80), bad = alNotes({vy: .7, vx: .1, tilt: .3, off: 9}, pad, 10);
  ok &&= perf.grade === 'PARFAIT' && perf.s === 12 && bad.grade === 'D' && bad.n.join() === '0,0,0,0';
  alNew(6); ok &&= Math.abs(al.grav / al.thr - AL.G / AL.THR) < 1e-9 && al.world.name === 'MARS';  // sur Mars : plus lourd, mais le moteur suit
  alNew(21); ok &&= al.world.name === 'TITAN' && al.world.drag; al.mode = 'play'; al.x = 150; al.y = 30; al.vy = 0; for (let i = 0; i < 200; i++) { al.vy += al.grav; al.vy *= .99; } ok &&= al.vy < 1.1;
  ok &&= alWorld(26).loop === 1 && alWorld(26).w.name === 'LUNE';
  cv.dataset.selfcheck = ok && crashed && landed ? 'ok' : 'raté ' + JSON.stringify({ok, crashed, landed, mode: al.mode});
  al = keep; Object.assign(als, ks); if (kb === undefined) delete games.best.alunissage; else games.best.alunissage = kb;
}
// pour le test de NeoDex : l'état de la partie, et un module posé juste au-dessus d'une plateforme d'une mission choisie
cv.__al = () => ({mode: al.mode, level: als.level, world: al.world.name, score: al.run.score, lives: al.run.lives, why: al.why, slide: !!al.slide, grade: al.notes?.grade, stars: al.notes?.s});
cv.__set = o => { Object.assign(al, o); };
cv.__over = (lv, mult, dy = 16) => { alNew(lv); const p = al.pads.find(q => q.mult === mult); al.mode = 'play'; al.x = alPadX(p) + p.w / 2; al.y = p.y - dy; al.vx = p.float ? p.amp * p.sp * Math.cos(al.tick * p.sp) : 0; al.vy = 0; al.fuel = 100; al.meteors = []; al.warn = []; al.world = {...al.world, meteors: false, wind: false}; };
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function alTrophies() {
  const b = games.best.alunissage, t = als.landed ? als.top : 0, sig = [b, als.landed, t, als.perfect].join(); if (sig === alTrophies.sig) return; alTrophies.sig = sig;
  trophyRecord('score', b || null); trophyRecord('mission', t || null);
  if (als.landed >= 1) trophy('premier'); if (t >= 5) trophy('m5'); if (t >= 10) trophy('m10'); if (t >= 20) trophy('m20'); if (als.landed >= 50) trophy('cinquante');
  if (als.perfect >= 1) trophy('parfait'); if (als.perfect >= 10) trophy('parfaits10'); if (b >= 5000) trophy('s5000');
}
ctx.onOpen(() => { if (!al) alStart(); gameLoop(al, 'alunissage', alUpdate, alDraw); alInfo(); });
}
