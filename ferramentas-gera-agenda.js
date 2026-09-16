// Gera o agenda.json do site: so as 3 proximas datas livres, sem nenhum dado de cliente.
// Uso: node gera-agenda.js <pasta-do-site> <hoje-ISO> <dias-ocupados-separados-por-virgula>
// Ex:  node gera-agenda.js ...\site 2026-09-16 2026-09-19,2026-09-20,2026-09-22,2026-09-29
const fs = require('fs');
const [dirSite, hojeISO, ocupadosArg] = process.argv.slice(2);
const ocupados = new Set((ocupadosArg || '').split(',').filter(Boolean));
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const hoje = new Date(hojeISO + 'T12:00:00');
const livres = [];
for (let i = 1; i <= 45 && livres.length < 3; i++) {   // comeca amanha
  const d = new Date(hoje); d.setDate(d.getDate() + i);
  const iso = d.toISOString().slice(0, 10);
  if (ocupados.has(iso)) continue;
  livres.push({ iso, dia: DIAS[d.getDay()], numero: d.getDate(), mes: MESES[d.getMonth()] });
}
const saida = { atualizado: hojeISO, datas: livres };
fs.writeFileSync(dirSite + '\\agenda.json', JSON.stringify(saida, null, 1) + '\n', 'utf8');
console.log(JSON.stringify(saida));
