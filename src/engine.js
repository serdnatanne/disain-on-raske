export const DAY = 86400000;
export const fresh = () => ({
  version: 1,
  records: {},
  history: [],
  active: null,
  theme: "system",
});
export const emptyRecord = () => ({
  attempts: 0,
  right: 0,
  wrong: 0,
  level: 0,
  due: 0,
  last: 0,
  hard: false,
  mastered: false,
  events: [],
});
export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function grade(correct, selected) {
  return (
    correct.length === selected.length &&
    new Set(selected).size === selected.length &&
    correct.every((n) => selected.includes(n))
  );
}
export function recordAnswer(old, ok, time = Date.now()) {
  const r = { ...(old || emptyRecord()) };
  r.attempts++;
  r[ok ? "right" : "wrong"]++;
  r.last = time;
  r.level = ok ? Math.min(5, r.level + 1) : 0;
  r.mastered = ok && (r.mastered || r.level >= 3);
  r.due = time + [0, 1, 3, 7, 14, 30][r.level] * DAY;
  r.events = [...r.events, { time, ok }];
  return r;
}
export const percent = (n, d) => (d ? Math.round((100 * n) / d) : 0);
export function stats(history) {
  const scores = history.map((h) => percent(h.right, h.items.length));
  return {
    count: scores.length,
    average: scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0,
    best: scores.length ? Math.max(...scores) : 0,
    last: scores.at(-1) || 0,
  };
}
export function due(r, now = Date.now()) {
  return !!r && (r.hard || ((r.attempts > 0 || r.rated) && r.due <= now));
}
export function makeSession(questions, mode, label) {
  return {
    mode,
    label,
    start: Date.now(),
    index: 0,
    items: questions.map((q) => ({
      id: q.id,
      order: shuffled(q.options.map((_, i) => i)),
      selected: [],
      locked: false,
    })),
  };
}
export function validateSave(s, bank) {
  const obj = (x) => x && typeof x === "object" && !Array.isArray(x);
  const int = (n) => Number.isSafeInteger(n) && n >= 0;
  const bool = (b) => typeof b === "boolean";
  const hasId = (k) =>
    typeof k === "string" &&
    /^[a-z][\w-]*$/i.test(k) &&
    !Object.hasOwn(Object.prototype, k);
  const item = (x) =>
    obj(x) &&
    hasId(x.id) &&
    Array.isArray(x.order) &&
    x.order.every(int) &&
    new Set(x.order).size === x.order.length &&
    Array.isArray(x.selected) &&
    x.selected.every((n) => x.order.includes(n)) &&
    new Set(x.selected).size === x.selected.length &&
    bool(x.locked);
  const session = (x) =>
    obj(x) &&
    ["practice", "mock"].includes(x.mode) &&
    typeof x.label === "string" &&
    int(x.start) &&
    Array.isArray(x.items) &&
    x.items.length > 0 &&
    x.items.every(item) &&
    int(x.index) &&
    x.index < x.items.length;
  if (
    !obj(s) ||
    s.version !== 1 ||
    !["system", "dark", "light"].includes(s.theme) ||
    !obj(s.records) ||
    !Array.isArray(s.history)
  )
    return false;
  for (const [key, r] of Object.entries(s.records)) {
    if (
      !hasId(key) ||
      !obj(r) ||
      ![r.attempts, r.right, r.wrong, r.level, r.last, r.due].every(int) ||
      r.level > 5 ||
      r.right + r.wrong !== r.attempts ||
      !bool(r.hard) ||
      !bool(r.mastered) ||
      !Array.isArray(r.events) ||
      !r.events.every((e) => obj(e) && int(e.time) && bool(e.ok))
    )
      return false;
  }
  if (
    !s.history.every(
      (h) =>
        session(h) &&
        int(h.end) &&
        int(h.right) &&
        h.right <= h.items.length &&
        h.items.every((i) => i.locked && bool(i.ok)),
    )
  )
    return false;
  return (
    s.active === null ||
    (session(s.active) &&
      s.active.items.every((i, n) => {
        const q = bank.get(i.id);
        return (
          q &&
          !q.needsReview &&
          i.order.length === q.options.length &&
          i.order.every((v) => v < q.options.length) &&
          (n >= s.active.index || i.locked) &&
          (!i.locked || bool(i.ok))
        );
      }))
  );
}
