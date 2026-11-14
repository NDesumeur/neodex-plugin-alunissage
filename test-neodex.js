// lancé par le test « local » de NeoDex : vérification interne, un atterrissage par monde, la glace qui fait glisser, un crash qui coûte une vie, la plateforme volante
// (avec NEO_SHOTS, une image de chaque monde est enregistrée)
module.exports = async ({ pj, sleep }) => {
  const fs = require('fs'), path = require('path');
  const sc = await pj(`document.getElementById('gc').dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  const st = () => pj(`document.getElementById('gc').__al()`), run = c => pj(`(document.getElementById('gc').${c}, 0)`);
  const shot = async name => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); fs.writeFileSync(path.join(process.env.NEO_SHOTS, 'alunissage-' + name + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const out = [];
  for (const [lv, name] of [[1, 'LUNE'], [6, 'MARS'], [11, 'EUROPE'], [16, 'ASTÉROÏDE']]) {
    await run(`__over(${lv}, 2)`); await sleep(500); await shot(name.toLowerCase().replace('é', 'e').replace('ï', 'i')); await sleep(1800);
    const s = await st(); if (s.world !== name || s.mode !== 'won') throw new Error(name + ' : ' + JSON.stringify(s)); out.push(name);
  }
  await run(`__over(11, 3, 7)`); await run(`__set({vx: .12})`); await sleep(350);
  let s = await st(); if (!s.slide) throw new Error('la glace ne fait pas glisser : ' + JSON.stringify(s)); await shot('glisse');
  await sleep(3000); s = await st(); if (s.mode !== 'over' || !/Glissé/.test(s.why)) throw new Error('glisse : ' + JSON.stringify(s));
  const lives = s.lives;
  await run(`__over(2, 2, 40)`); await run(`__set({vy: 3})`); await sleep(1000); s = await st();
  if (s.mode !== 'over' || s.lives !== lives - 1) throw new Error('crash : ' + JSON.stringify(s));
  await run(`__over(19, 5, 6.5)`); await sleep(300); await shot('volante'); await sleep(1500); s = await st();
  if (s.mode !== 'won') throw new Error('plateforme volante : ' + JSON.stringify(s));
  await run(`__over(17, 3, 60)`); await sleep(900); await shot('meteores');
  return 'posé sur ' + out.join(', ') + ' ; la glace fait glisser ; un crash coûte une vie ; posé sur la plateforme volante';
};
