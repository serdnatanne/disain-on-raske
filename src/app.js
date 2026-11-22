import { contrastDemo, updateContrast } from "./contrast.js";
import "./style.css";
import first from "./exam-first.js";
import last from "./exam-last.js";
import moodle from "./moodle.js";
import visuals from "./visuals.js";
import { icon, poster, rosette } from "./art.js";
import {
  fresh,
  emptyRecord,
  shuffled,
  grade,
  recordAnswer,
  percent,
  stats,
  due,
  makeSession,
  validateSave,
  DAY,
} from "./engine.js";
const exam = [...first, ...last],
  all = [...exam, ...visuals, ...moodle],
  bank = new Map(all.map((q) => [q.id, q]));
const key = "vormikool.gda.1",
  main = document.querySelector("main"),
  safe = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const names = [
  "",
  "Disaini alused",
  "Visuaalne taju",
  "Disainiprintsiibid",
  "Tüpograafia",
  "Värviõpetus",
  "Kujutis ja kasutajaliides",
];
let state = fresh(),
  loadError = false;
try {
  const raw = localStorage.getItem(key);
  if (raw) {
    const saved = JSON.parse(raw);
    if (validateSave(saved, bank)) state = saved;
    else if (saved.active && validateSave({ ...saved, active: null }, bank)) {
      state = { ...saved, active: null };
      queueMicrotask(() =>
        notice(
          "Küsimused on muutunud. Varasem statistika on alles, alusta uut testi.",
        ),
      );
    } else loadError = true;
  }
} catch {
  loadError = true;
}
let config = {
    pool: "exam",
    lecture: "",
    topic: "",
    count: "5",
    filter: "all",
    mode: "practice",
  },
  reader = {
    origin: "exam",
    text: "",
    lecture: "",
    filter: "all",
    index: 0,
    open: false,
    quick: false,
  },
  resultIndex = null;
try {
  Object.assign(
    reader,
    JSON.parse(localStorage.getItem(key + ".reader") || "{}"),
  );
} catch {}
const rec = (q) => state.records[q.id],
  mastered = (q) => !!rec(q)?.mastered,
  eligible = (qs) => qs.filter((q) => !q.needsReview);
const pct = (n) => n + "%",
  date = (n) =>
    new Date(n).toLocaleString("et-EE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
const btn = (text, action, cls = "button", ico = "") =>
  `<button class="${cls}" data-act="${action}">${ico ? icon(ico) : ""}${text}</button>`;
const tag = (text, ico = "") =>
  `<span class="tag">${ico ? icon(ico, 14) : ""}${text}</span>`;
const opts = (items, v) =>
  items
    .map(
      ([k, l]) =>
        `<option value="${safe(k)}" ${String(k) === String(v) ? "selected" : ""}>${safe(l)}</option>`,
    )
    .join("");
const select = (label, id, items, v) =>
  `<label>${label}<select data-field="${id}">${opts(items, v)}</select></label>`;
const topics = [
  ["", "Kõik loengud"],
  ...names.slice(1).map((n, i) => [i + 1, i + 1 + ". " + n]),
];
const filterOptions = [
  ["all", "Kõik küsimused"],
  ["wrong", "Viimati valesti vastatud"],
  ["hard", "Raskeks märgitud"],
  ["new", "Veel omandamata"],
  ["due", "Vajan kordamist"],
];
function fits(q, f) {
  const r = rec(q);
  return (
    f === "all" ||
    (f === "wrong" && r?.events.at(-1)?.ok === false) ||
    (f === "hard" && r?.hard) ||
    (f === "new" && !r?.mastered) ||
    (f === "due" && due(r))
  );
}
function save() {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    notice("Brauser ei saanud edenemist salvestada. Ekspordi andmed seadetes.");
  }
}
let timer;
function notice(text) {
  const el = document.querySelector("#notice");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove("show"), 4200);
}
const routes = {
  home: "Õppelaud",
  practice: "Harjutamine",
  read: "Küsimustik",
  stats: "Statistika",
  settings: "Seaded",
};
function go(page) {
  if (location.hash === "#" + page) render();
  else location.hash = page;
}
const route = () => location.hash.slice(1) || "home";
function theme() {
  document.documentElement.dataset.theme =
    state.theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : state.theme;
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", theme);
const navicons = {
  home: "grid",
  practice: "practice",
  read: "book",
  stats: "stats",
  settings: "settings",
};
function nav(mobile = false) {
  const active =
    { quiz: "practice", result: "stats", repeat: "practice" }[route()] ||
    route();
  return Object.entries(routes)
    .filter(([k]) => (mobile ? k !== "settings" : k !== "settings"))
    .map(
      ([k, l]) =>
        `<a class="${active === k ? "current" : ""}" href="#${k}" ${k === active ? 'aria-current="page"' : ""}>${icon(navicons[k], 18)}${mobile && k === "practice" ? "Harjuta" : l}</a>`,
    )
    .join("");
}
function layout() {
  theme();
  document.querySelector("#header").innerHTML =
    `<div class="headinner"><a class="brand" href="#home">${rosette()}Vormikool</a><span class="brandcourse">GDA 2026</span><nav aria-label="Põhinavigatsioon">${nav()}</nav><a class="setting" href="#settings" aria-label="Seaded">${icon("settings")}</a></div>`;
  document.querySelector("#mobile").innerHTML = nav(true);
}
const heading = (title, sub) =>
  `<div class="heading"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>`;
function performance() {
  return names
    .slice(1)
    .map((name, i) => {
      const rs = all
        .filter((q) => q.lecture === i + 1)
        .map(rec)
        .filter(Boolean);
      const sum = (k) => rs.reduce((n, r) => n + r[k], 0);
      return {
        name,
        id: i + 1,
        total: sum("attempts"),
        score: percent(sum("right"), sum("attempts")),
      };
    })
    .filter((x) => x.total)
    .sort((a, b) => a.score - b.score);
}
function topicPerformance() {
  const map = new Map();
  for (const q of all) {
    const r = rec(q);
    if (!r?.attempts) continue;
    const t = map.get(q.topic) || { name: q.topic, total: 0, right: 0 };
    t.right += r.right;
    t.total += r.attempts;
    map.set(q.topic, t);
  }
  return [...map.values()]
    .map((t) => ({ ...t, score: percent(t.right, t.total) }))
    .sort((a, b) => a.score - b.score || b.total - a.total);
}
function home() {
  const done = exam.filter(mastered).length,
    p = percent(done, exam.length),
    attempts = Object.values(state.records),
    num = attempts.reduce((n, r) => n + r.attempts, 0),
    acc = percent(
      attempts.reduce((n, r) => n + r.right, 0),
      num,
    ),
    weak = topicPerformance()[0],
    review = eligible(all).filter((q) => due(rec(q))).length;
  const active = state.active;
  const cards = [
    ["practice", "practice", "Testi teadmisi", "Eksamiküsimused", "pink"],
    ["read", "book", "Loe ja meenuta", "Vastused ja selgitused", "lavender"],
    ["visual", "visual", "Piltküsimused", "Harjuta visuaalset taju", "sage"],
    ["moodle", "layers", "Enesekontroll", "Moodle’i küsimused", "peach"],
  ];
  return `<div class="dashboard-title">${heading("Minu õppelaud", "Graafilise disaini alused")}</div><div class="dashboard"><section class="hero"><div class="herotext"><span class="eyebrow">${icon("spark", 16)} ${active ? "Pooleli olev test" : "Soovitatud harjutus"}</span><h2>${active ? safe(active.label) : review ? "Korda nõrku kohti" : "Päeva kiirtest"}</h2><p>${active ? "Jätka küsimusest " + (active.index + 1) + " / " + active.items.length : review ? "Kinnista teadmisi küsimustega, mis vajavad uut katset." : "Meenuta õpitut viie eksamiküsimusega ja saa kohe tagasisidet."}</p>${btn("Jätka õppimist", "continue", "primary", "play")}</div>${poster}</section>
 <section class="progress card"><h3>Sinu edenemine</h3><div class="progressbody"><div class="ring" style="--p:${p}%"><b>${p}<small>%</small></b></div><div><strong>${done} / ${exam.length}</strong><span>omandatud küsimust</span></div></div><div class="metricrow"><span>Õigeid vastuseid</span><b>${num ? pct(acc) : "—"}</b></div><div class="metricrow"><span>Lõpetatud teste</span><b>${state.history.length}</b></div></section></div>
 <div class="sectionhead"><h2>Õppimisviisid</h2></div><div class="modes">${cards.map(([a, i, t, s, c]) => `<button class="mode card" data-act="${a}"><span class="tile ${c}">${icon(i, 24)}</span><strong>${t}</strong><small>${s}</small></button>`).join("")}</div>
 <div class="lower"><section><div class="sectionhead"><h2>Loengute ülevaade</h2></div><div class="card lectures">${names
   .slice(1)
   .map((name, i) => {
     const qs = exam.filter((q) => q.lecture === i + 1),
       d = qs.filter(mastered).length;
     return `<button class="lect" data-act="lecture-${i + 1}"><span class="lectno n${i}">0${i + 1}</span><span><strong>${name}</strong><small>${qs.length} eksamiküsimust</small></span><span class="minibar"><i style="width:${percent(d, qs.length)}%"></i></span>${icon("next", 16)}</button>`;
   })
   .join(
     "",
   )}</div></section><section><div class="sectionhead"><h2>Kordamine</h2></div><div class="card panel"><span class="tile sage">${icon("repeat")}</span><h3>Vajan kordamist</h3><p>${review ? review + " küsimust ootab kordamist." : "Siia kogunevad rasked küsimused ja saabunud kordamised."}</p>${weak ? `<p>Kordamist vajav teema · ${safe(weak.name)} (${weak.score}%)</p>` : ""}${btn("Vaata kordamisjärge", "repeat", "subtle")}</div><div class="sectionhead"><h2>Viimased testid</h2></div>${recent(3)}</section></div>`;
}
function recent(limit = Infinity) {
  return state.history.length
    ? `<div class="card">${state.history
        .map((h, i) => ({ h, i }))
        .reverse()
        .slice(0, limit)
        .map(
          ({ h, i }) =>
            `<button class="lect" data-act="history-${i}"><span><strong>${safe(h.label)}</strong><small>${date(h.end)} · ${h.items.length} küsimust</small></span><b>${pct(percent(h.right, h.items.length))}</b></button>`,
        )
        .join("")}</div>`
    : '<div class="card panel muted">Tulemused ilmuvad pärast esimest lõpetatud testi.</div>';
}
function sourcePool() {
  const groups = {
    exam,
    visual: all.filter((q) => q.visual),
    m13: moodle.filter((q) => q.group === "1–3"),
    m46: moodle.filter((q) => q.group === "4–6"),
    combined: [...exam, ...moodle],
    repeat: all,
  };
  return eligible(groups[config.pool] || exam).filter(
    (q) => !config.lecture || q.lecture === +config.lecture,
  );
}
function pool() {
  return sourcePool().filter(
    (q) =>
      (!config.topic || q.topic === config.topic) && fits(q, config.filter),
  );
}
function practice() {
  const qs = pool(),
    mock = config.mode === "mock",
    n =
      mock || config.count === "all"
        ? qs.length
        : Math.min(+config.count, qs.length);
  return (
    heading("Harjutamine", "Vali küsimuste kogu ja testi pikkus.") +
    `<section class="card panel form"><h2>Koosta test</h2>${select(
      "Küsimuste kogu",
      "pool",
      [
        ["exam", "Eksamiküsimused"],
        ["visual", "Piltküsimused"],
        ["m13", "Moodle · loengud 1–3"],
        ["m46", "Moodle · loengud 4–6"],
        ["combined", "Eksamiküsimused ja Moodle"],
        ["repeat", "Kõik kogud"],
      ],
      config.pool,
    )}${select(
      "Testi tüüp",
      "mode",
      [
        ["practice", "Harjutus · kohene tagasiside"],
        ["mock", "Proovieksam · vastused testi lõpus"],
      ],
      config.mode,
    )}${select("Loeng", "lecture", topics, config.lecture)}${select(
      "Teema",
      "topic",
      [
        ["", "Kõik teemad"],
        ...Array.from(new Set(sourcePool().map((q) => q.topic)))
          .sort((a, b) => a.localeCompare(b, "et"))
          .map((t) => [t, t]),
      ],
      config.topic,
    )}${select("Küsimuste valik", "filter", filterOptions, config.filter)}${
      !mock
        ? select(
            "Testi pikkus",
            "count",
            [5, 10, 20, "all"].map((n) => [
              n,
              n === "all" ? "Kõik sobivad küsimused" : n + " küsimust",
            ]),
            config.count,
          )
        : ""
    }<p>${n ? n + " küsimust juhuslikus järjekorras." : "Selle valikuga harjutatavaid küsimusi veel pole."}</p>${n ? btn("Alusta testi", "start", "primary", "play") : ""}${state.active ? btn("Jätka pooleli testi", "resume", "button") : ""}</section>`
  );
}
function start(qs, label, mode = "practice") {
  if (!qs.length) return;
  if (
    state.active &&
    !confirm(
      "Alustada uut testi ja asendada pooleli olev test? Senine vastamisajalugu säilib.",
    )
  )
    return;
  if (state.active?.mode === "mock") {
    for (const i of state.active.items.filter((i) => i.locked))
      state.records[i.id] = recordAnswer(state.records[i.id], i.ok);
  }
  state.active = makeSession(qs, mode, label);
  save();
  go("quiz");
}
function sources(q) {
  return `<div class="sources">${icon("book", 16)}<span>${q.sources.map(safe).join(" · ")}</span></div>`;
}
function quiz() {
  const a = state.active;
  if (!a) return practice();
  const item = a.items[a.index],
    q = bank.get(item.id),
    multi = q.correct.length > 1,
    feedback = item.locked && a.mode !== "mock";
  return `<div class="study"><div class="kicker">${safe(a.label)}<span>${a.index + 1} / ${a.items.length}</span></div><progress max="${a.items.length}" value="${a.index + 1}"></progress><section class="card question"><div class="kicker">${tag("Loeng " + q.lecture + " · " + safe(q.topic))}${btn(rec(q)?.hard ? "Raske ✓" : "Märgi raskeks", "hard", "subtle", "flag")}</div><h1>${safe(q.prompt)}</h1>${q.visual || ""}<p>${multi ? "Vali kõik sobivad vastused ja kinnita." : "Vali üks vastus."}</p><div class="answers">${item.order.map((v, i) => `<button class="answer ${item.selected.includes(v) ? "selected" : ""} ${feedback && q.correct.includes(v) ? "correct" : ""} ${feedback && item.selected.includes(v) && !q.correct.includes(v) ? "wrong" : ""}" data-act="option-${v}" aria-pressed="${item.selected.includes(v)}" ${item.locked ? "disabled" : ""}><span>${String.fromCharCode(65 + i)}</span>${safe(q.options[v])}${feedback && q.correct.includes(v) ? icon("check") : ""}</button>`).join("")}</div>${feedback ? `<div class="feedback ${item.ok ? "yes" : "no"}" role="status"><b>${item.ok ? "Õige vastus" : "Vastus vajab kordamist"}</b><p>${safe(q.short)}</p><details><summary>Täpsem selgitus</summary><p>${safe(q.explanation)}</p></details>${sources(q)}</div>` : ""}${item.locked ? btn(a.index === a.items.length - 1 ? "Vaata tulemust" : "Järgmine küsimus", "next", "primary") : multi && item.selected.length ? btn("Kinnita vastus", "lock", "primary") : ""}</section>${btn("Jätan praegu pooleli", "home", "subtle")}</div>`;
}
function lock() {
  const a = state.active,
    item = a.items[a.index];
  if (item.locked || !item.selected.length) return;
  item.locked = true;
  item.ok = grade(bank.get(item.id).correct, item.selected);
  // Defer mock statistics until the exam ends, including dashboard disclosures.
  if (a.mode !== "mock")
    state.records[item.id] = recordAnswer(state.records[item.id], item.ok);
  save();
  if (a.mode === "mock") advance();
  else {
    render();
    main.querySelector('[data-act="next"]')?.focus({ preventScroll: true });
  }
}
function advance() {
  const a = state.active;
  if (!a?.items[a.index].locked) return;
  if (a.index < a.items.length - 1) {
    a.index++;
    save();
    render();
  } else {
    if (a.mode === "mock")
      for (const i of a.items)
        state.records[i.id] = recordAnswer(state.records[i.id], i.ok);
    state.history.push({
      ...a,
      end: Date.now(),
      right: a.items.filter((x) => x.ok).length,
    });
    resultIndex = state.history.length - 1;
    state.active = null;
    save();
    go("result");
  }
  window.scrollTo(0, 0);
}
function results() {
  const h = state.history[resultIndex ?? state.history.length - 1];
  if (!h) return statistics();
  return (
    heading("Testi tulemus", safe(h.label) + " · " + date(h.end)) +
    `<section class="card panel"><h2>${pct(percent(h.right, h.items.length))} õigesti</h2><p>${h.right} õiget · ${h.items.length - h.right} valet · ${Math.max(1, Math.round((h.end - h.start) / 60000))} min</p><div class="actions">${btn("Korda sama testi", "retry", "primary")}${h.right < h.items.length ? btn("Korda minu vigu", "mistakes") : ""}</div></section><div class="sectionhead"><h2>Vastuste ülevaade</h2></div><div class="card panel">${h.items
      .map((item) => {
        const q = bank.get(item.id);
        return q
          ? `<details><summary>${item.ok ? "✓" : "×"} &nbsp; ${safe(q.prompt)}</summary><p>Sinu valik · ${item.selected.map((i) => safe(q.options[i])).join(" / ")}</p><p><b>Õige · ${q.correct.map((i) => safe(q.options[i])).join(" / ")}</b></p><p>${safe(q.explanation)}</p>${sources(q)}</details>`
          : "";
      })
      .join("")}</div>`
  );
}

function readPool() {
  const term = reader.text.toLocaleLowerCase("et");
  return (reader.origin === "moodle" ? moodle : exam).filter(
    (q) =>
      (!reader.lecture || q.lecture === +reader.lecture) &&
      fits(q, reader.filter) &&
      [q.original, q.topic, ...q.keywords]
        .join(" ")
        .toLocaleLowerCase("et")
        .includes(term),
  );
}
function reading() {
  const qs = readPool();
  reader.index = Math.max(0, Math.min(reader.index, qs.length - 1));
  const q = qs[reader.index];
  return (
    heading("Küsimustik", "Meenuta vastust enne kaardi avamist.") +
    `<section class="card panel readfilters"><label>Otsing<input id="search" type="search" value="${safe(reader.text)}" placeholder="Otsi küsimust või märksõna"></label>${select(
      "Kogu",
      "r-origin",
      [
        ["exam", "Eksamiküsimused"],
        ["moodle", "Moodle’i enesekontroll"],
      ],
      reader.origin,
    )}${select("Loeng", "r-lecture", topics, reader.lecture)}${select("Küsimused", "r-filter", filterOptions, reader.filter)}</section><div id="readcard">${readcard(q, qs)}</div>`
  );
}
function readcard(q, qs) {
  if (!q)
    return '<section class="card panel">Ühtegi sobivat küsimust ei leitud.</section>';
  const r = rec(q) || emptyRecord();
  return `<div class="readerhead"><span>${reader.index + 1} / ${qs.length} küsimust</span>${btn(reader.quick ? "Ava täisvaade" : "Kiirkordamine", "quick", "subtle", "practice")}</div><article class="card question"><div class="kicker">${tag("Loeng " + q.lecture + " · " + safe(q.topic))}${btn(r.hard ? "Raske ✓" : "Märgi raskeks", "hard", "subtle", "flag")}</div><h2>${safe(q.original)}</h2>${q.visual || ""}${q.original !== q.prompt && q.origin === "moodle" ? `<p>${safe(q.prompt)}</p>` : ""}${btn(reader.open ? "Peida vastus" : "Näita vastust", "reveal", "button", "book")}${reader.open ? `<div class="reading-answer"><h3>${q.needsReview ? "Vajab kontrollimist" : "Lühivastus"}</h3><p>${safe(q.short)}</p>${q.reason ? `<p>${safe(q.reason)}</p>` : ""}${!reader.quick ? `<details><summary>Selgitus ja mälunipp</summary><p>${safe(q.explanation)}</p>${q.tip ? `<p><b>Jäta meelde</b> · ${safe(q.tip)}</p>` : ""}<div class="tags">${q.keywords.map((k) => tag(safe(k))).join("")}</div></details><details><summary>Valikvastused</summary><p>${safe(q.prompt)}</p>${q.options.map((o, i) => `<p>${q.correct.includes(i) ? "✓ " : ""}${safe(o)}</p>`).join("")}</details>${q.id === "exam-52" ? contrastDemo() : ""}${sources(q)}` : ""}</div>` : ""}${!reader.quick && !q.needsReview ? `<div class="rating"><strong>Kui hästi oskad?</strong><div class="actions">${["Ei oska", "Natuke oskan", "Oskan hästi"].map((x, i) => btn(x, "rate-" + i, "button" + (r.rating === i ? " chosen" : ""))).join("")}</div>${btn(r.mastered ? "Omandatud ✓" : "Märgi omandatuks", "master", "subtle", "check")}</div>` : ""}<div class="readerfoot"><button class="button" data-act="prevread" ${reader.index === 0 ? "disabled" : ""}>Eelmine</button><button class="primary" data-act="nextread" ${reader.index + 1 === qs.length ? "disabled" : ""}>Järgmine</button></div></article>`;
}
function repetition() {
  const qs = eligible(all)
    .filter((q) => due(rec(q)))
    .sort((a, b) => (rec(a)?.due || 0) - (rec(b)?.due || 0));
  return (
    heading(
      "Vajan kordamist",
      "Rasked küsimused ja tänaseks saabunud kordamised.",
    ) +
    `<div class="card panel"><h2>${qs.length} küsimust kordamiseks</h2><p>Vea järel saad kohe uuesti proovida. Järjestikuste õigete vastuste järel kordad 1, 3, 7, 14 ja 30 päeva pärast. Kolm järjestikust õiget vastust märgivad küsimuse omandatuks. Raskeks märgitud küsimus püsib selles vaates kuni märgise eemaldamiseni.</p>${qs.length ? btn("Harjuta kuni 10 küsimust", "review-now", "primary") : btn("Harjuta eksamiküsimusi", "practice", "primary")}</div>${qs.length ? `<div class="card panel spaced">${qs.map((q) => `<details><summary>${safe(q.prompt)}</summary><p>${safe(q.short)}</p>${sources(q)}${rec(q).hard ? btn("Eemalda raske märge", "unflag-" + q.id, "button") : ""}</details>`).join("")}</div>` : ""}`
  );
}
function statistics() {
  const ranked = topicPerformance();
  const s = stats(state.history),
    rs = Object.values(state.records),
    attempts = rs.reduce((n, r) => n + r.attempts, 0),
    acc = percent(
      rs.reduce((n, r) => n + r.right, 0),
      attempts,
    ),
    perf = performance();
  return (
    heading("Statistika", "Sinu õppimise areng selles brauseris.") +
    `<div class="numbers">${[
      ["Lõpetatud teste", s.count],
      ["Keskmine tulemus", s.count ? pct(s.average) : "—"],
      ["Parim tulemus", s.count ? pct(s.best) : "—"],
      ["Viimane tulemus", s.count ? pct(s.last) : "—"],
    ]
      .map(
        ([k, v]) =>
          `<div class="card panel"><small>${k}</small><strong>${v}</strong></div>`,
      )
      .join(
        "",
      )}</div><div class="sectionhead"><h2>Viimaste testide tulemused</h2></div><div class="card panel">${
      s.count
        ? `<div class="chart">${state.history
            .slice(-8)
            .map((h, i) => {
              const p = percent(h.right, h.items.length);
              return `<div aria-label="${date(h.end)} · ${p}%"><b>${p}%</b><i style="height:${Math.max(2, p)}px"></i><small>${s.count - Math.min(8, s.count) + i + 1}</small></div>`;
            })
            .join("")}</div><small>Testid ajalises järjekorras</small>`
        : "Graafik tekib pärast esimese testi lõpetamist."
    }</div><div class="lower"><section><div class="sectionhead"><h2>Teadmised loenguti</h2></div><div class="card panel"><p>Õigeid vastuseid kokku · <b>${attempts ? pct(acc) : "—"}</b><br>Omandatud · <b>${exam.filter(mastered).length} / ${exam.length}</b></p>${perf.length ? `<p>Nõrgim teema · ${safe(ranked[0].name)} (${ranked[0].score}%)<br>Tugevaim teema · ${safe(ranked.at(-1).name)} (${ranked.at(-1).score}%)</p>${perf.map((t) => `<div class="metricrow"><span>${t.name}</span><b>${t.score}%</b></div>`).join("")}` : "Loengute võrdlemiseks vasta mõnele küsimusele."}</div></section><section><div class="sectionhead"><h2>Testide ajalugu</h2></div>${recent()}</section></div>`
  );
}
function settings() {
  return (
    heading("Seaded", "Välimus ja kohalikud õppeandmed.") +
    `<section class="card panel form">${select(
      "Värviteema",
      "theme",
      [
        ["system", "Järgi süsteemi"],
        ["light", "Hele"],
        ["dark", "Tume"],
      ],
      state.theme,
    )}<h2>Õppeandmed</h2><p>Edenemine säilib selles seadmes ja brauseris. Brauseri andmete kustutamisel kaob ka ajalugu. Teise brauserisse kolimiseks ekspordi varukoopia.</p><div class="actions">${btn("Ekspordi JSON", "export")}${btn("Impordi JSON", "import")}</div><input type="file" id="file" accept=".json,application/json" hidden>${btn("Lähtesta statistika", "reset", "danger")}</section><section class="card panel form spaced"><h2>Allikate kontroll</h2><p>${exam.length} eksamiteemat · ${moodle.length} Moodle’i küsimust. Vastuste juures on loengufail ja PDF-i lehekülg.</p>${all
      .filter((q) => q.needsReview)
      .map(
        (q) =>
          `<p><b>${safe(q.id)} · ${safe(q.prompt)}</b><br>${safe(q.reason)}</p>`,
      )
      .join("")}</section>`
  );
}
const pages = {
  home,
  practice,
  quiz,
  read: reading,
  repeat: repetition,
  stats: statistics,
  settings,
  result: results,
};
function render() {
  const field = document.activeElement?.dataset.field;
  const action = document.activeElement?.dataset.act;
  layout();
  main.innerHTML = (pages[route()] || home)();
  updateContrast();
  if (field || action) {
    const selector = field
      ? `[data-field="${CSS.escape(field)}"]`
      : `[data-act="${CSS.escape(action)}"]:not(:disabled)`;
    main.querySelector(selector)?.focus({ preventScroll: true });
  }
  rememberReader();
}
function rememberReader() {
  try {
    localStorage.setItem(key + ".reader", JSON.stringify(reader));
  } catch {}
}
function setup(poolName, lecture = "") {
  config = {
    pool: poolName,
    lecture,
    topic: "",
    count: "5",
    filter: "all",
    mode: "practice",
  };
  go("practice");
}
function recommended() {
  if (state.active) {
    go("quiz");
    return;
  }
  const reviews = eligible(all).filter((q) => due(rec(q)));
  start(
    (reviews.length
      ? shuffled(reviews)
      : shuffled(eligible(exam).filter((q) => !mastered(q))).concat(
          shuffled(eligible(exam).filter(mastered)),
        )
    ).slice(0, 5),
    reviews.length ? "Nõrkade kohtade kordamine" : "Eksamiküsimuste kiirtest",
  );
}
function download() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "vormikool-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act,
    [verb, ...parts] = act.split("-"),
    arg = parts.join("-");
  const q =
    route() === "read"
      ? readPool()[reader.index]
      : route() === "quiz" && state.active
        ? bank.get(state.active.items[state.active.index].id)
        : null;
  if (verb === "option") {
    const a = state.active;
    if (!a) return;
    const it = a.items[a.index],
      cur = bank.get(it.id);
    if (it.locked) return;
    if (cur.correct.length > 1) {
      it.selected = it.selected.includes(+arg)
        ? it.selected.filter((n) => n !== +arg)
        : [...it.selected, +arg];
      save();
      render();
    } else {
      it.selected = [+arg];
      lock();
    }
    return;
  }
  if (verb === "lecture") {
    setup("exam", arg);
    return;
  }
  if (verb === "history") {
    resultIndex = +arg;
    go("result");
    return;
  }
  if (verb === "unflag") {
    state.records[arg].hard = false;
    save();
    render();
    return;
  }
  if (verb === "rate" && q) {
    const r = (state.records[q.id] ??= emptyRecord());
    r.rated = true;
    r.rating = +arg;
    r.due = Date.now() + [0, 1, 7][+arg] * DAY;
    if (+arg < 2) {
      r.mastered = false;
      r.level = Math.min(r.level, +arg);
    }
    save();
    notice("Enesehinnang salvestatud");
    render();
    return;
  }
  const actions = {
    home: () => go("home"),
    practice: () => setup("exam"),
    read: () => go("read"),
    visual: () => setup("visual"),
    moodle: () => setup("m13"),
    repeat: () => go("repeat"),
    continue: recommended,
    resume: () => go("quiz"),
    start: () => {
      const qs = shuffled(pool()),
        mock = config.mode === "mock";
      start(
        mock || config.count === "all" ? qs : qs.slice(0, +config.count),
        mock
          ? "Proovieksam"
          : {
              exam: "Eksamiküsimused",
              visual: "Piltküsimused",
              m13: "Moodle · loengud 1–3",
              m46: "Moodle · loengud 4–6",
              combined: "Kombineeritud test",
              repeat: "Kordamine",
            }[config.pool],
        config.mode,
      );
    },
    "review-now": () =>
      start(
        shuffled(eligible(all).filter((q) => due(rec(q)))).slice(0, 10),
        "Vajan kordamist",
      ),
    lock,
    next: advance,
    retry: () => repeatTest(false),
    mistakes: () => repeatTest(true),
    reveal: () => {
      reader.open = !reader.open;
      render();
    },
    quick: () => {
      reader.quick = !reader.quick;
      reader.open = false;
      render();
    },
    prevread: () => moveReader(-1),
    nextread: () => moveReader(1),
    hard: () => {
      const r = (state.records[q.id] ??= emptyRecord());
      r.hard = !r.hard;
      render();
      save();
    },
    master: () => {
      const r = (state.records[q.id] ??= emptyRecord());
      r.mastered = !r.mastered;
      r.rated = true;
      r.due = Date.now() + (r.mastered ? 7 : 0) * DAY;
      save();
      render();
    },
    export: download,
    import: () => document.querySelector("#file").click(),
    reset: () => {
      if (
        confirm(
          "Kustutada kõik selle brauseri vastused, tulemused ja pooleli olev test?",
        )
      ) {
        state = { ...fresh(), theme: state.theme };
        save();
        render();
        notice("Statistika on lähtestatud.");
      }
    },
  };
  actions[act]?.();
});
function repeatTest(wrongOnly) {
  const h = state.history[resultIndex ?? state.history.length - 1];
  start(
    h.items
      .filter((i) => !wrongOnly || !i.ok)
      .map((i) => bank.get(i.id))
      .filter((q) => q && !q.needsReview),
    wrongOnly ? "Minu vead" : h.label,
    wrongOnly ? "practice" : h.mode,
  );
}
function moveReader(delta) {
  reader.index += delta;
  reader.open = false;
  render();
  document.querySelector("#readcard")?.scrollIntoView({ block: "start" });
}
document.addEventListener("change", async (e) => {
  const el = e.target,
    k = el.dataset.field;
  if (el.id === "file") {
    const file = el.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!validateSave(parsed, bank)) throw Error();
      if (confirm("Asendada kohalikud õppeandmed varukoopia andmetega?")) {
        state = parsed;
        resultIndex = null;
        save();
        render();
        notice("Andmed imporditud.");
      }
    } catch {
      notice(
        "Import ebaõnnestus. Kontrolli faili vormingut ja andmeversiooni.",
      );
    }
    el.value = "";
    return;
  }
  if (!k) return;
  if (k === "theme") {
    state.theme = el.value;
    save();
  } else if (k.startsWith("r-")) {
    reader[k.slice(2)] = el.value;
    reader.index = 0;
    reader.open = false;
  } else {
    config[k] = el.value;
    if (k === "lecture" || k === "pool") config.topic = "";
  }
  render();
});
document.addEventListener("input", (e) => {
  if (e.target.id === "fg" || e.target.id === "bg") updateContrast();
  if (e.target.id === "search") {
    reader.text = e.target.value;
    reader.index = 0;
    reader.open = false;
    const qs = readPool();
    document.querySelector("#readcard").innerHTML = readcard(qs[0], qs);
    rememberReader();
  }
});
document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
  )
    return;
  if (route() === "quiz" && /^[1-9]$/.test(e.key))
    document.querySelectorAll(".answer")[+e.key - 1]?.click();
  if (route() === "read" && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    document
      .querySelector(
        '[data-act="' +
          (e.key === "ArrowLeft" ? "prevread" : "nextread") +
          '"]',
      )
      ?.click();
  }
});
window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});
window.addEventListener("storage", (e) => {
  if (e.key !== key || !e.newValue) return;
  try {
    const next = JSON.parse(e.newValue);
    if (validateSave(next, bank)) {
      state = next;
      render();
    }
  } catch {}
});
render();
if (loadError) notice("Salvestatud andmeid ei saanud avada.");
