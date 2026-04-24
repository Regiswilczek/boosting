/**
 * boosting.tech — Page Recorder
 *
 * Abre a landing page em um browser headless, faz scroll suave por todas
 * as seções capturando frames e monta o vídeo final com ffmpeg.
 *
 * Uso:
 *   npm install puppeteer   (primeira vez)
 *   node record.js
 *
 * Saída: boosting_demo.mp4 (na mesma pasta)
 */

const puppeteer  = require('puppeteer');
const http       = require('http');
const path       = require('path');
const fs         = require('fs');
const { execSync } = require('child_process');

/* ─── Configurações ──────────────────────────────────────────────────── */
const CFG = {
  width:     1440,
  height:    900,
  fps:       30,
  output:    path.join(__dirname, 'boosting_demo.mp4'),
  framesDir: path.join(__dirname, '_frames'),
  port:      4321,
};

/* ─── Servidor de arquivos estáticos ────────────────────────────────── */
function startServer() {
  const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.gif':  'image/gif',
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath  = req.url.split('?')[0];
      const filePath = decodeURIComponent(
        path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath)
      );
      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.listen(CFG.port, '127.0.0.1', () => {
      console.log(`  Servidor: http://localhost:${CFG.port}`);
      resolve(server);
    });
  });
}

/* ─── Easing ─────────────────────────────────────────────────────────── */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ─── Captura de frames ──────────────────────────────────────────────── */
async function record() {
  /* Limpar pasta de frames anteriores */
  if (fs.existsSync(CFG.framesDir)) fs.rmSync(CFG.framesDir, { recursive: true });
  fs.mkdirSync(CFG.framesDir);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${CFG.width},${CFG.height}`,
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: CFG.width, height: CFG.height, deviceScaleFactor: 1 });

  /* Desativar prefers-reduced-motion para ver todas as animações */
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

  console.log('  Carregando página...');
  await page.goto(`http://localhost:${CFG.port}`, {
    waitUntil: 'networkidle0',
    timeout: 30_000,
  });

  /* Altura real da página */
  const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`  Altura total: ${pageH}px\n`);

  let frameIdx = 0;

  /* Captura um frame e salva em disco */
  async function snap() {
    await page.screenshot({
      path: path.join(CFG.framesDir, `f${String(frameIdx).padStart(6, '0')}.png`),
      type: 'png',
    });
    frameIdx++;
  }

  /* Fica parado em determinada posição por N segundos */
  async function hold(seconds) {
    const n = Math.round(seconds * CFG.fps);
    for (let i = 0; i < n; i++) await snap();
  }

  /* Scroll suave de scrollY atual até targetY em durationSec segundos */
  async function scrollTo(targetY, durationSec) {
    const startY  = await page.evaluate(() => window.scrollY);
    const frames  = Math.round(durationSec * CFG.fps);
    for (let i = 0; i <= frames; i++) {
      const y = Math.round(startY + (targetY - startY) * easeInOutCubic(i / frames));
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await snap();
    }
  }

  /* ── Roteiro de gravação ─────────────────────────────────────────── */
  /*
   * Cada linha: [targetY, holdSec, scrollSec, 'label']
   * targetY null = não rola, só segura
   */
  const MAX = pageH - CFG.height;

  const scenes = [
    //  Y          hold   scroll   label
    [null,         4.5,   0,       '🎬  Hero — entrada'],
    [280,          0.8,   1.4,     '📊  Hero stats chips'],
    [680,          1.0,   1.2,     '🏷️   Clients marquee'],
    [1180,         1.4,   1.2,     '📈  About / contador'],
    [1820,         1.6,   1.2,     '⭐  Diferenciais'],
    [2500,         1.8,   1.4,     '🛠️   Serviços ovals'],
    [3220,         1.6,   1.2,     '🌍  Segmentos typewriter'],
    [3780,         1.0,   1.0,     '🔄  Processo'],
    [4480,         2.2,   1.4,     '📝  Formulário contato'],
    [5180,         1.2,   1.2,     '🤝  Parceiros'],
    [MAX,          2.5,   1.8,     '🚀  CTA final + footer'],
    [null,         2.0,   0,       '🎬  Fim'],
  ];

  for (const [y, holdSec, scrollSec, label] of scenes) {
    console.log(`  ${label}`);
    await hold(holdSec);
    if (y !== null && scrollSec > 0) await scrollTo(y, scrollSec);
  }

  await browser.close();

  console.log(`\n  Frames capturados: ${frameIdx}`);
  console.log(`  Duração estimada:  ${(frameIdx / CFG.fps).toFixed(1)}s\n`);
  return frameIdx;
}

/* ─── Encode com ffmpeg ──────────────────────────────────────────────── */
function encode() {
  const input  = path.join(CFG.framesDir, 'f%06d.png');
  const cmd = [
    'ffmpeg -y',
    `-framerate ${CFG.fps}`,
    `-i "${input}"`,
    '-c:v libx264',
    '-preset slow',
    '-crf 16',
    '-pix_fmt yuv420p',
    `-vf scale=${CFG.width}:${CFG.height}`,
    `"${CFG.output}"`,
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'inherit' });
    const mb = (fs.statSync(CFG.output).size / 1024 / 1024).toFixed(1);
    console.log(`\n✅ Vídeo salvo: ${CFG.output} (${mb} MB)`);
  } catch {
    console.error('\n❌ ffmpeg falhou — verifique se está no PATH');
    console.log(`   Frames mantidos em: ${CFG.framesDir}`);
    process.exit(1);
  }
}

/* ─── Limpeza ────────────────────────────────────────────────────────── */
function cleanup() {
  if (fs.existsSync(CFG.framesDir)) {
    fs.rmSync(CFG.framesDir, { recursive: true });
    console.log('🗑️  Frames temporários removidos');
  }
}

/* ─── Main ───────────────────────────────────────────────────────────── */
(async () => {
  console.log('\n🎥  boosting.tech — Page Recorder');
  console.log(`    ${CFG.width}×${CFG.height} · ${CFG.fps}fps\n`);

  /* Verificar puppeteer */
  try { require.resolve('puppeteer'); } catch {
    console.error('❌ puppeteer não instalado. Execute:\n   npm install puppeteer\n');
    process.exit(1);
  }

  const server = await startServer();

  try {
    await record();
    encode();
    cleanup();
  } catch (err) {
    console.error('\n❌ Erro:', err.message);
    server.close();
    process.exit(1);
  }

  server.close();
  console.log('\n🎉  Pronto! Abra boosting_demo.mp4 para ver o resultado.\n');
})();
