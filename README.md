# boosting.tech — Documentação Técnica do Projeto

**Versão:** 1.0.0 · **Data:** Abril 2026 · **Repositório:** [github.com/Regiswilczek/boosting](https://github.com/Regiswilczek/boosting)

---

## 1. Visão Geral

Landing page institucional da **boosting.tech**, empresa de tecnologia especializada em consultoria de TI, desenvolvimento web e mobile, cibersegurança e serviços em nuvem. O objetivo da página é converter visitantes em leads qualificados através de um formulário de agendamento de consultoria gratuita.

O projeto é uma **Single Page Application estática** — sem framework JavaScript, sem bundler, sem dependência de backend. Todo o código roda diretamente no browser e pode ser hospedado em qualquer servidor de arquivos estáticos.

## 2. Stack de Tecnologia

| Camada | Tecnologia | Versão |
|---|---|---|
| Marcação | HTML5 | — |
| Estilo | CSS3 | — |
| Lógica | JavaScript ES6+ (Vanilla) | — |
| Animações | GSAP | 3.12.5 |
| Plugin de scroll | GSAP ScrollTrigger | 3.12.5 |
| Plugin de navegação | GSAP ScrollToPlugin | 3.12.5 |
| Tipografia | Plus Jakarta Sans / Inter | Google Fonts CDN |
| Background | Canvas 2D API | Nativa |

> **Zero frameworks.** Nenhum React, Vue, Angular ou similar. Nenhum bundler (Webpack, Vite). Nenhuma dependência de Node.js em produção.

## 3. Estrutura de Arquivos

```text
boosting/
├── index.html              # Estrutura da página (747 linhas)
├── style.css               # Estilos globais, layout, responsividade (~1714 linhas)
├── script.js               # Toda a lógica de animação e interação (~505 linhas)
├── bg.js                   # Background de partículas via Canvas 2D (~130 linhas)
└── boosting_images/
    ├── LOGO/               # Logo principal e variante sem fundo
    ├── Partners/           # Logos Google Cloud, Oracle, Microsoft, AWS
    ├── Clientes/           # Logos dos clientes (Edison Chouest, Bram, FMC, OSX, etc.)
    ├── Astronauta/         # Astronauta central + 5 asteróides (PNG com fundo removido)
    └── Imagems setor/      # Fotos reais para os cards de serviço (6 imagens)
```

## 4. Arquitetura da Página

A página é composta por 10 seções com âncoras navegáveis:

- `#home` → Hero, Marquee de textos (GSAP loop), Clientes (2 filas cruzadas CSS)
- `#empresa` → Sobre / Contador animado
- `#diferenciais` → Cards rotativos (4 cards, ciclo a 3.2s)
- `#solucoes` → Ovals de serviços (6 ovals expansíveis)
- `#segmentos` → Typewriter de segmentos (GSAP)
- `#processo` → Processo em 3 passos (cards minimalistas)
- `#contato` → Formulário de agendamento
- `#parceiros` → Logos de parceiros + marquee de clientes, CTA final + redes sociais, Footer

## 5. Sistema de Animações (GSAP)

### 5.1 Hero Entrance — Timeline sequencial
Ao carregar a página, uma timeline GSAP dispara em cascata animando cada elemento do hero com `fromTo()` explícito (evita o bug onde `from()` lê `opacity:0` do CSS como target e mantém o elemento invisível).

**Ordem de entrada:** tag → palavras do título (stagger) → subtítulo → CTAs → stat chips → visual direito → asteróides traseiros → asteróides dianteiros → astronauta → badges → code card → strip de parceiros. *(Duração total da entrada: ~3.7 segundos).*

### 5.2 Float contínuo (astronauta + asteróides + badges)
Após a entrada, cada elemento flutuante recebe um tween `repeat: -1, yoyo: true` com `ease: sine.inOut`. Os delays foram calculados especificamente para nunca conflitar com a timeline de entrada.

### 5.3 Code Card Typewriter
Após 3s do carregamento, o code card anima como um terminal digitando o código char a char (22ms/char). A animação preserva o syntax highlighting reconstruindo o `innerHTML` com `<span>` por grupo de tokens da mesma classe.

### 5.4 Marquees e Typewriters
- **Marquee dupla (clientes):** Duas filas de logos em ângulos opostos (+4° e -4°), animadas por CSS `@keyframes` em velocidades diferentes (38s e 50s). Pausa ao hover.
- **Marquee de textos:** Faixa com frases institucionais animada por GSAP (`x: "-50%"`). HTML duplicado garante o loop sem gap.
- **Typewriter de Segmentos:** Ciclo contínuo de 6 palavras com cursor piscante animado por `gsap.to(opacity: 0, repeat: -1, yoyo: true, ease: "steps(1)")`.

### 5.5 ScrollTrigger reveals
Cada seção tem sua própria animação de entrada disparada por ScrollTrigger com `once: true`. Elementos animados com `fromTo()` explícito para garantir estado final correto.

## 6. Background de Partículas (bg.js)

Canvas posicionado como `position: fixed; z-index: 0` atrás de todo o conteúdo. O algoritmo combina 3 funções trigonométricas (sin + cos) para gerar ondas de pontos 3×3px com coloração baseada em gradiente.

**Otimizações implementadas:**
- **DPR-aware:** `canvas.width = innerWidth × devicePixelRatio` — tela nítida em Retina/4K.
- **Tab visibility:** Pausa quando a aba está oculta (`visibilitychange`) — economiza CPU/bateria.
- **Resize debounced:** 150ms após o último evento de resize.
- **prefers-reduced-motion:** Renderiza um único frame estático sem entrar no loop de animação.

## 7. Performance

**Carregamento:**
- Fontes com `rel="preconnect"` para `fonts.googleapis.com` e `fonts.gstatic.com`.
- `display=swap` no Google Fonts — previne FOIT.
- GSAP via CDN com `cdnjs.cloudflare.com` — cache compartilhado.
- `loading="lazy"` em todas as imagens abaixo da dobra.
- Elementos pré-ocultados via `<style>` inline no `<head>` antes do CSS principal carregar — elimina FOUC.

**Runtime:**
- `will-change: transform` nos 9 elementos flutuantes do hero — isola em camada compositor.
- Canvas: apenas pixels com `ridge > 0.30` são desenhados.
- `@keyframes` CSS pausados por `prefers-reduced-motion`.
- Scroll nativo desativado (`html { scroll-behavior: auto }`) — GSAP ScrollToPlugin gerencia scroll com easing preciso.

## 8. Acessibilidade e SEO

- Todo conteúdo decorativo tem `aria-hidden="true"`.
- Botão de menu mobile com `aria-label="Menu"`.
- `lang="pt-BR"` no `<html>`.
- Contraste de cores segue WCAG AA (verde `#00D463` sobre fundo escuro `#0B0F0D`).
- Metadados Open Graph e Twitter Cards completos para compartilhamento social.

## 9. Formulário de Contato

O submit chama `e.preventDefault()`, exibe feedback visual de sucesso por 3.5s e reseta o formulário. Nenhuma requisição HTTP é feita nativamente. O formulário está pronto para integração com qualquer backend (webhook, Formspree, n8n, Supabase Edge Function, etc.) — basta substituir o handler no `script.js` (linha 474).

## 10. Deploy

O projeto não tem processo de build — é servido diretamente como arquivos estáticos.

**Opções compatíveis:**
- Netlify (drag & drop da pasta ou via Git)
- Vercel (`vercel --prod`)
- GitHub Pages
- Servidor próprio (nginx/apache)

*Requisitos de servidor: nenhum. Apenas servir arquivos estáticos com suporte a HTTPS.*

---
*Documentação técnica gerada por **Peacemaker** · T.ZION Engineering.*
