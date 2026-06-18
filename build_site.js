/* ============================================================
   タブチ神経整体院 HP（強化版）マルチページ・ジェネレーター
   - ヘッダー/フッターを共通化し、メニューごとに専用ページを出力
   - 修正はこのファイルを直して  node build_site.js  で全ページ再生成
   ============================================================ */
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

const TEL = '0798-31-3703';
const LINE = 'https://lin.ee/Or1Urb0';

/* ナビ項目（= それぞれ専用ページ） */
const NAV = [
  { href: 'about.html',   label: '当院について' },
  { href: 'method.html',  label: '神経整体とは' },
  { href: 'reasons.html', label: '選ばれる理由' },
  { href: 'price.html',   label: '料金' },
  { href: 'flow.html',    label: 'ご来院の流れ' },
  { href: 'access.html',  label: 'アクセス' },
  { href: 'faq.html',     label: 'よくある質問' },
];

/* ---------- 共通パーツ ---------- */
function head(title, desc) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${desc}">
<title>${title}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>`;
}

function header(active) {
  const links = NAV.map(n =>
    `      <a href="${n.href}"${active === n.href ? ' aria-current="page"' : ''}>${n.label}</a>`
  ).join('\n');
  return `
<!-- ========== HEADER ========== -->
<header class="site-header" id="siteHeader">
  <div class="container header-inner">
    <a href="index.html" class="logo">
      <span class="logo-text">
        <span class="logo-name">タブチ神経整体院</span>
        <span class="logo-sub">TABUCHI NEURO SEITAI</span>
      </span>
    </a>
    <nav class="nav" id="siteNav" aria-label="メインナビ">
${links}
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="メニューを開く" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
    </button>
    <div class="header-cta">
      <a href="tel:${TEL}" class="hcta hcta-tel" aria-label="電話する">
        <span class="hcta-icon">📞</span>
        <span class="hcta-text"><span class="hcta-label">お電話</span><span class="hcta-num">${TEL}</span></span>
      </a>
      <a href="${LINE}" class="hcta hcta-line" target="_blank" rel="noopener">
        <span class="hcta-icon">💬</span>
        <span class="hcta-text"><span class="hcta-label">かんたん予約</span><span class="hcta-num">公式LINE</span></span>
      </a>
    </div>
  </div>
</header>`;
}

function footer() {
  const links = NAV.map(n => `      <a href="${n.href}">${n.label}</a>`).join('\n');
  return `
<!-- ========== FOOTER ========== -->
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <p class="footer-name">タブチ神経整体院</p>
      <p class="footer-sub">TABUCHI NEURO SEITAI</p>
      <p class="footer-addr">〒662-0918<br>兵庫県西宮市六湛寺町 9-25</p>
      <p class="footer-tel"><a href="tel:${TEL}">📞 ${TEL}</a></p>
    </div>
    <nav class="footer-nav" aria-label="フッターナビ">
${links}
    </nav>
  </div>
  <p class="footer-copy">© 2026 タブチ神経整体院 All Rights Reserved.</p>
</footer>

<!-- ========== FIXED MOBILE CTA BAR ========== -->
<div class="mobile-cta" aria-label="お問い合わせ">
  <a href="tel:${TEL}" class="mcta mcta-tel">
    <span class="mcta-icon">📞</span>
    <span>お電話</span>
  </a>
  <a href="${LINE}" class="mcta mcta-line" target="_blank" rel="noopener">
    <span class="mcta-icon">💬</span>
    <span>LINE予約</span>
  </a>
</div>

<script src="script.js"></script>
</body>
</html>`;
}

function page({ title, desc, active, main }) {
  return head(title, desc) + header(active) + '\n\n<main id="top">\n' + main + '\n</main>\n' + footer() + '\n';
}

/* 下層ページ用の小ヒーロー（帯） */
function pageHero(en, title, lead) {
  return `
  <section class="page-hero">
    <div class="page-hero-media" aria-hidden="true"></div>
    <div class="container">
      <p class="ph-en reveal">${en}</p>
      <h1 class="reveal">${title}</h1>
      ${lead ? `<p class="ph-lead reveal">${lead}</p>` : ''}
    </div>
  </section>`;
}

/* ---------- コンテンツ・ブロック ---------- */
const blocks = {};

blocks.hero = `
  <!-- HERO -->
  <section class="hero">
    <div class="hero-media" aria-hidden="true"></div>
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="container hero-inner">
      <p class="hero-tag reveal">兵庫県西宮市 ／ 阪神西宮駅すぐ</p>
      <h1 class="hero-title reveal">
        <span class="ja">強く押さない、ボキボキしない。</span>
        <span class="ja em">眠っている神経を、<br>呼び覚ます。</span>
      </h1>
      <p class="hero-lead reveal">
        ソフトなタッチで身体の奥にアプローチする、独自の神経整体。<br>
        あなたが本来持っている力を、引き出すために。
      </p>
      <div class="hero-cta reveal">
        <a href="${LINE}" class="btn btn-primary" target="_blank" rel="noopener">公式LINEで予約する <span class="arrow" aria-hidden="true">→</span></a>
        <a href="tel:${TEL}" class="btn btn-ghost">お電話 ${TEL}</a>
      </div>
      <div class="hero-meta reveal">
        <div><dt>営業時間</dt><dd>平日 13:00 – 19:00</dd></div>
        <div><dt>定休日</dt><dd>日・祝</dd></div>
        <div><dt>駐車場</dt><dd>完備</dd></div>
        <div><dt>開業</dt><dd>2019年2月</dd></div>
      </div>
    </div>
    <a href="#troubles" class="hero-scroll" aria-label="下へスクロール">SCROLL</a>
  </section>`;

blocks.offer = `
  <!-- OFFER -->
  <section class="offer">
    <div class="container offer-inner reveal">
      <div class="offer-badge">初回限定</div>
      <div class="offer-body">
        <p class="offer-lead">はじめての方は、半額でお試しいただけます。</p>
        <p class="offer-price">
          <span class="offer-was">通常 ¥10,000</span>
          <span class="offer-arrow">→</span>
          <span class="offer-now">¥5,000<span class="offer-now-tax">（税込）</span></span>
        </p>
      </div>
      <a href="${LINE}" class="btn btn-gold" target="_blank" rel="noopener">この特典を使う <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </section>`;

blocks.troubles = `
  <!-- TROUBLES -->
  <section class="troubles" id="troubles">
    <div class="container">
      <header class="section-head reveal">
        <p class="sec-en">CONCERN</p>
        <h2 class="sec-title">こんなお悩み、<br>ありませんか。</h2>
      </header>
      <ul class="trouble-list">
        <li class="reveal"><span class="t-mark">✦</span>肩や首の重さが、なかなか抜けない</li>
        <li class="reveal"><span class="t-mark">✦</span>腰に張りを感じる日が、増えてきた</li>
        <li class="reveal"><span class="t-mark">✦</span>眠りが浅く、朝すっきりしない</li>
        <li class="reveal"><span class="t-mark">✦</span>マッサージに行っても、すぐ戻ってしまう</li>
        <li class="reveal"><span class="t-mark">✦</span>強い刺激の施術は、できれば避けたい</li>
        <li class="reveal"><span class="t-mark">✦</span>自分のからだと、ちゃんと向き合いたい</li>
      </ul>
      <p class="trouble-bridge reveal">
        ひとつでも当てはまる方は、<br class="sp-only">
        ぜひ一度、当院の<strong>神経整体</strong>を体感してください。
      </p>
    </div>
  </section>`;

blocks.band = `
  <!-- CONCEPT BAND -->
  <section class="band" aria-label="コンセプト">
    <div class="band-media" aria-hidden="true"></div>
    <div class="band-inner reveal">
      <p class="band-en">CONCEPT</p>
      <h2 class="band-title">がんばらなくていい。<br>からだは、ゆるめば応えてくれる。</h2>
      <p class="band-text">
        強い力で押し込むのではなく、指先でそっと触れる。<br>
        あなたのからだが本来持っているリズムに、静かに寄り添う時間です。
      </p>
    </div>
  </section>`;

blocks.about = `
  <!-- ABOUT -->
  <section class="about" id="about">
    <div class="container about-inner">
      <figure class="ph ph-4x5 about-photo reveal" data-label="院内写真&#10;（images/about-clinic.jpg）">
        <img src="images/about-clinic.jpg" alt="タブチ神経整体院の院内" onerror="this.closest('.ph').classList.add('is-empty')">
      </figure>
      <div class="about-body">
        <p class="sec-en reveal">ABOUT</p>
        <h2 class="sec-title reveal">西宮で唯一の、<br>神経整体院。</h2>
        <p class="about-lead reveal">タブチ神経整体院は、2019年に兵庫県西宮市に開業した<strong>神経整体専門</strong>の整体院です。</p>
        <p class="about-text reveal">一般的な整体やマッサージのように、強く押したり、ボキボキと骨を鳴らすことはいたしません。指先のソフトなタッチで、身体の奥に眠っている<strong>神経</strong>に働きかけ、あなたが本来持っている力を呼び覚ましていきます。</p>
        <p class="about-text reveal">「強い刺激が苦手な方」「他院で満足できなかった方」「丁寧に向き合ってほしい方」に、選んでいただいています。</p>
      </div>
    </div>
  </section>`;

blocks.director = `
  <!-- DIRECTOR -->
  <section class="director" id="director">
    <div class="container director-inner">
      <figure class="ph ph-3x4 director-photo reveal" data-label="院長写真&#10;（images/director.jpg）">
        <img src="images/director.jpg" alt="タブチ神経整体院 院長" onerror="this.closest('.ph').classList.add('is-empty')">
      </figure>
      <div class="director-body">
        <p class="sec-en reveal">DIRECTOR</p>
        <h2 class="sec-title reveal">院長ごあいさつ。</h2>
        <p class="director-text reveal">「強く押されるのが苦手。」「ボキボキはちょっと怖い。」<br>そんな声に、寄り添える整体院でありたい。その一心で、2019年にこの院を始めました。</p>
        <p class="director-text reveal">神経整体は、派手な技術ではありません。けれど、あなたのからだの声を、いちばん丁寧に聴ける技術だと信じています。</p>
        <p class="director-sign reveal">院長 <span>※ お名前ご提供後に差し替え</span></p>
      </div>
    </div>
  </section>`;

blocks.method = `
  <!-- METHOD -->
  <section class="method" id="method">
    <div class="container">
      <header class="section-head center reveal">
        <p class="sec-en">METHOD</p>
        <h2 class="sec-title">神経整体とは。</h2>
        <p class="sec-lead">骨や筋肉ではなく、<strong>「神経」</strong>に着目した独自の整体技術です。</p>
      </header>
      <div class="method-grid">
        <article class="method-card reveal"><span class="m-num">01</span><h3>ソフトな<br>タッチ</h3><p>強い圧は加えません。指先で羽根のように触れ、神経のリズムに寄り添います。</p></article>
        <article class="method-card reveal"><span class="m-num">02</span><h3>ボキボキ<br>しない</h3><p>関節を無理に動かす矯正はいたしません。お子さま・ご高齢の方にも安心です。</p></article>
        <article class="method-card reveal"><span class="m-num">03</span><h3>眠った神経を<br>呼び覚ます</h3><p>身体の奥に眠っている神経に働きかけ、本来の状態を引き出していきます。</p></article>
        <article class="method-card reveal"><span class="m-num">04</span><h3>オーダー<br>メイド</h3><p>お一人ずつ状態は異なります。マニュアル施術ではなく、毎回お身体に合わせて。</p></article>
      </div>
    </div>
  </section>`;

blocks.reasons = `
  <!-- REASONS -->
  <section class="reasons" id="reasons">
    <div class="container">
      <header class="section-head reveal">
        <p class="sec-en">REASONS</p>
        <h2 class="sec-title">選ばれる、<br>4つの理由。</h2>
      </header>
      <div class="reason-list">
        <article class="reason-card reveal"><div class="r-num">REASON / 01</div><h3>独自の「神経整体」技術</h3><p>骨や筋肉ではなく神経に働きかける独自技術。ソフトなタッチで、奥深くまでアプローチします。</p></article>
        <article class="reason-card reveal"><div class="r-num">REASON / 02</div><h3>強い刺激が苦手な方も安心</h3><p>強く押す・ボキボキする施術は一切いたしません。痛みに敏感な方、ご高齢の方、お子さまにも対応できます。</p></article>
        <article class="reason-card reveal"><div class="r-num">REASON / 03</div><h3>阪神西宮駅すぐ／駐車場完備</h3><p>電車でも、お車でも通いやすい立地。仕事帰りや、お買い物ついでにも立ち寄りやすい環境です。</p></article>
        <article class="reason-card reveal"><div class="r-num">REASON / 04</div><h3>2019年開業／確かな実績</h3><p>2019年の開業以来、地域のみなさまに支えていただいています。じっくりと向き合う施術が、私たちの誇りです。</p></article>
      </div>
    </div>
  </section>`;

blocks.price = `
  <!-- PRICE -->
  <section class="price" id="price">
    <div class="container">
      <header class="section-head center reveal">
        <p class="sec-en">PRICE</p>
        <h2 class="sec-title">施術料金。</h2>
        <p class="sec-lead">明朗な料金設定。表示はすべて税込です。</p>
      </header>
      <div class="price-grid">
        <article class="price-card highlight reveal">
          <p class="p-badge">はじめての方</p>
          <h3>初回限定コース</h3>
          <p class="p-desc">通常コースを半額でご体験いただけます</p>
          <p class="p-amount"><span class="p-was">¥10,000</span><span class="p-now">¥5,000</span></p>
          <ul><li>カウンセリング込み</li><li>神経整体施術</li><li>アフターアドバイス</li><li>所要 約60分</li></ul>
          <a href="${LINE}" class="btn btn-primary" target="_blank" rel="noopener">LINEで予約する <span class="arrow" aria-hidden="true">→</span></a>
        </article>
        <article class="price-card reveal">
          <h3>通常コース</h3>
          <p class="p-desc">2回目以降のお客様</p>
          <p class="p-amount"><span class="p-now">¥10,000</span></p>
          <ul><li>カウンセリング</li><li>神経整体施術</li><li>アフターアドバイス</li><li>所要 約60分</li></ul>
          <a href="${LINE}" class="btn btn-ghost" target="_blank" rel="noopener">LINEで予約する <span class="arrow" aria-hidden="true">→</span></a>
        </article>
      </div>
      <p class="price-note reveal">お支払方法：<strong>現金 / クレジットカード / PayPay</strong> がご利用いただけます。</p>
    </div>
  </section>`;

blocks.flow = `
  <!-- FLOW -->
  <section class="flow" id="flow">
    <div class="container">
      <header class="section-head reveal">
        <p class="sec-en">FLOW</p>
        <h2 class="sec-title">ご来院の流れ。</h2>
      </header>
      <ol class="flow-list">
        <li class="reveal"><span class="f-num">01</span><h3>ご予約</h3><p>公式LINE または お電話より、ご希望のお日にちをお知らせください。</p></li>
        <li class="reveal"><span class="f-num">02</span><h3>ご来院・受付</h3><p>はじめての方は、お名前・お悩みなどを簡単にうかがいます。</p></li>
        <li class="reveal"><span class="f-num">03</span><h3>カウンセリング</h3><p>お身体の状態、生活習慣、ご希望をていねいにお聴きします。</p></li>
        <li class="reveal"><span class="f-num">04</span><h3>神経整体</h3><p>その日のお身体に合わせて、ソフトなタッチで施術いたします。</p></li>
        <li class="reveal"><span class="f-num">05</span><h3>アフターアドバイス</h3><p>施術後のお身体の感覚を確認し、次回までのケアをお伝えします。</p></li>
      </ol>
    </div>
  </section>`;

blocks.voice = `
  <!-- VOICE -->
  <section class="voice" id="voice">
    <div class="container">
      <header class="section-head center reveal">
        <p class="sec-en">VOICE</p>
        <h2 class="sec-title">お客様の声。</h2>
        <p class="sec-lead">※ 実際のお声をいただき次第、こちらに掲載いたします。</p>
      </header>
      <div class="voice-grid">
        <article class="voice-card reveal"><p class="v-quote">「強く押されないのに、身体が軽くなったのが不思議でした。」</p><p class="v-author">— 40代女性・西宮市</p></article>
        <article class="voice-card reveal"><p class="v-quote">「ボキボキされる施術が苦手で、こちらに伺いました。安心して通えています。」</p><p class="v-author">— 60代男性・芦屋市</p></article>
        <article class="voice-card reveal"><p class="v-quote">「丁寧に話を聴いてくださるので、安心してお任せできます。」</p><p class="v-author">— 30代女性・尼崎市</p></article>
      </div>
      <p class="voice-disclaimer reveal">※ お声は個人の感想です。お身体の感覚には個人差があります。</p>
    </div>
  </section>`;

blocks.access = `
  <!-- ACCESS -->
  <section class="access" id="access">
    <div class="container">
      <header class="section-head reveal">
        <p class="sec-en">ACCESS</p>
        <h2 class="sec-title">アクセス。</h2>
      </header>
      <div class="access-grid">
        <div class="access-info reveal">
          <dl>
            <dt>院名</dt><dd>タブチ神経整体院</dd>
            <dt>住所</dt><dd>〒662-0918<br>兵庫県西宮市六湛寺町 9-25</dd>
            <dt>最寄駅</dt><dd>阪神本線 西宮駅</dd>
            <dt>駐車場</dt><dd>完備</dd>
            <dt>営業時間</dt><dd>平日 13:00 – 19:00</dd>
            <dt>定休日</dt><dd>日曜・祝日</dd>
            <dt>電話</dt><dd><a href="tel:${TEL}">${TEL}</a></dd>
            <dt>LINE</dt><dd><a href="${LINE}" target="_blank" rel="noopener">公式LINEを開く →</a></dd>
          </dl>
        </div>
        <div class="access-map reveal">
          <iframe src="https://www.google.com/maps?q=%E5%85%B5%E5%BA%AB%E7%9C%8C%E8%A5%BF%E5%AE%AE%E5%B8%82%E5%85%AD%E6%B9%9B%E5%AF%BA%E7%94%BA9-25&output=embed" width="100%" height="360" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="タブチ神経整体院 地図"></iframe>
        </div>
      </div>
    </div>
  </section>`;

blocks.faq = `
  <!-- FAQ -->
  <section class="faq" id="faq">
    <div class="container">
      <header class="section-head center reveal">
        <p class="sec-en">FAQ</p>
        <h2 class="sec-title">よくあるご質問。</h2>
      </header>
      <div class="faq-list">
        <details class="faq-item reveal"><summary>強く押されるのが苦手ですが、大丈夫ですか？</summary><p>はい、ご安心ください。当院の神経整体は、ソフトなタッチでおこないます。強い圧は一切加えませんので、痛みに敏感な方こそ向いている施術です。</p></details>
        <details class="faq-item reveal"><summary>ボキボキされるのが怖いのですが…</summary><p>関節を鳴らすような矯正は一切いたしません。お子さま・ご高齢の方でも、安心して受けていただけます。</p></details>
        <details class="faq-item reveal"><summary>どのくらいの間隔で通えばいいですか？</summary><p>お身体の状態によって、最適な間隔は異なります。初回のカウンセリング時に、お一人ずつご案内いたします。</p></details>
        <details class="faq-item reveal"><summary>妊娠中でも受けられますか？</summary><p>お身体の状況により対応が異なります。ご予約前に、LINE またはお電話で一度ご相談ください。</p></details>
        <details class="faq-item reveal"><summary>健康保険は使えますか？</summary><p>当院は自由施術となりますため、健康保険はご利用いただけません。あらかじめご了承ください。</p></details>
        <details class="faq-item reveal"><summary>子ども連れでも大丈夫ですか？</summary><p>事前にお知らせいただけましたら、できる限り対応いたします。ご予約時にご相談ください。</p></details>
        <details class="faq-item reveal"><summary>支払方法は何が使えますか？</summary><p>現金・クレジットカード・PayPay がご利用いただけます。</p></details>
      </div>
    </div>
  </section>`;

blocks.cta = `
  <!-- CTA -->
  <section class="cta" id="contact">
    <div class="cta-media" aria-hidden="true"></div>
    <div class="container cta-inner">
      <p class="cta-en reveal">RESERVATION</p>
      <h2 class="cta-title reveal">まずは、お気軽に<br>ご相談ください。</h2>
      <p class="cta-lead reveal">はじめての方は、初回限定 <strong>¥5,000</strong> でご体験いただけます。<br>ご予約・ご相談は、公式LINE または お電話で。</p>
      <div class="cta-btns reveal">
        <a href="${LINE}" class="btn btn-gold btn-lg" target="_blank" rel="noopener">公式LINEで予約する <span class="arrow" aria-hidden="true">→</span></a>
        <a href="tel:${TEL}" class="btn btn-ghost-light btn-lg">📞 ${TEL}</a>
      </div>
    </div>
  </section>`;

/* ---------- 各ページ定義 ---------- */
const pages = [
  {
    file: 'index.html', active: 'index.html',
    title: 'タブチ神経整体院｜西宮市・阪神西宮駅すぐ｜ソフトタッチの神経整体',
    desc: '兵庫県西宮市の神経整体院。強く押さない、ボキボキしない。眠っている神経を呼び覚ます、ソフトタッチの神経整体。初回限定5,000円。阪神西宮駅すぐ・駐車場完備。',
    main: [blocks.hero, blocks.offer, blocks.troubles, blocks.band, blocks.voice, blocks.cta].join('\n'),
  },
  {
    file: 'about.html', active: 'about.html',
    title: '当院について｜タブチ神経整体院',
    desc: '西宮市の神経整体専門院、タブチ神経整体院について。強く押さず、ボキボキしない、指先のソフトなタッチの神経整体。院長ごあいさつ。',
    main: [pageHero('ABOUT', '当院について。', '西宮で唯一の、神経整体専門院です。'), blocks.about, blocks.director, blocks.cta].join('\n'),
  },
  {
    file: 'method.html', active: 'method.html',
    title: '神経整体とは｜タブチ神経整体院',
    desc: '骨や筋肉ではなく「神経」に着目した独自の整体技術、神経整体について。ソフトなタッチで、強い刺激が苦手な方も安心です。',
    main: [pageHero('METHOD', '神経整体とは。', '骨や筋肉ではなく、「神経」に着目した独自の整体技術です。'), blocks.method, blocks.band, blocks.cta].join('\n'),
  },
  {
    file: 'reasons.html', active: 'reasons.html',
    title: '選ばれる理由｜タブチ神経整体院',
    desc: 'タブチ神経整体院が選ばれる4つの理由。独自の神経整体技術、強い刺激が苦手な方も安心、阪神西宮駅すぐ・駐車場完備、2019年開業の実績。',
    main: [pageHero('REASONS', '選ばれる理由。', '数ある整体院の中で、私たちが大切にしていること。'), blocks.reasons, blocks.cta].join('\n'),
  },
  {
    file: 'price.html', active: 'price.html',
    title: '料金｜タブチ神経整体院',
    desc: 'タブチ神経整体院の施術料金。初回限定5,000円（通常10,000円）。表示はすべて税込。現金・クレジットカード・PayPay対応。',
    main: [pageHero('PRICE', '施術料金。', 'はじめての方は、初回限定 ¥5,000 でご体験いただけます。'), blocks.price, blocks.cta].join('\n'),
  },
  {
    file: 'flow.html', active: 'flow.html',
    title: 'ご来院の流れ｜タブチ神経整体院',
    desc: 'ご予約からアフターアドバイスまで、タブチ神経整体院のご来院の流れを5ステップでご案内します。',
    main: [pageHero('FLOW', 'ご来院の流れ。', 'ご予約から施術後まで、5つのステップでご案内します。'), blocks.flow, blocks.cta].join('\n'),
  },
  {
    file: 'access.html', active: 'access.html',
    title: 'アクセス｜タブチ神経整体院',
    desc: '兵庫県西宮市六湛寺町9-25。阪神本線 西宮駅すぐ、駐車場完備。営業時間 平日13:00-19:00、定休日 日曜・祝日。',
    main: [pageHero('ACCESS', 'アクセス。', '阪神本線 西宮駅すぐ。駐車場も完備しています。'), blocks.access, blocks.cta].join('\n'),
  },
  {
    file: 'faq.html', active: 'faq.html',
    title: 'よくあるご質問｜タブチ神経整体院',
    desc: '強い刺激が苦手・ボキボキが怖い・通う間隔・妊娠中・保険・子連れ・支払方法など、タブチ神経整体院へよくいただくご質問にお答えします。',
    main: [pageHero('FAQ', 'よくあるご質問。', '気になることは、お気軽にお問い合わせください。'), blocks.faq, blocks.cta].join('\n'),
  },
];

/* ---------- 出力 ---------- */
pages.forEach(p => {
  const html = page(p);
  fs.writeFileSync(path.join(OUT, p.file), html, 'utf8');
  console.log('written:', p.file, '(' + html.length + ' bytes)');
});
console.log('done. ' + pages.length + ' pages.');
