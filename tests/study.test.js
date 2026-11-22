import { test } from "node:test";
import { contrastRatio } from "../src/contrast.js";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import first from "../src/exam-first.js";
import last from "../src/exam-last.js";
import moodle from "../src/moodle.js";
import visuals from "../src/visuals.js";
import {
  grade,
  shuffled,
  makeSession,
  recordAnswer,
  emptyRecord,
  stats,
  due,
  percent,
  DAY,
  fresh,
  validateSave,
} from "../src/engine.js";
const exam = [...first, ...last],
  all = [...exam, ...moodle, ...visuals],
  bank = new Map(all.map((q) => [q.id, q]));
test("Kogu on terviklik ning hinnatavad võtmed ja allikad kehtivad", () => {
  assert.equal(exam.length, 52);
  assert.equal(all.length, bank.size);
  assert.equal(moodle.length, 29);
  assert.equal(all.filter((q) => q.needsReview).length, 1);
  for (const [i, q] of exam.entries())
    assert.equal(q.id, "exam-" + String(i + 1).padStart(2, "0"));
  for (const q of all) {
    assert.ok(
      q.original && q.prompt && q.explanation && q.short && q.keywords.length,
    );
    assert.ok(q.sources.some((s) => /pdf, lk \d/.test(s)));
    assert.ok(q.lecture >= 1 && q.lecture <= 6);
    assert.equal(new Set(q.options).size, q.options.length);
    if (q.needsReview) {
      assert.ok(q.reason);
      continue;
    }
    assert.ok(q.options.length >= 2);
    assert.equal(q.correct.length, 1);
    assert.ok(q.options[q.correct[0]]);
    if (q.visual) assert.match(q.visual, /aria-label=/);
  }
});
test(
  "Algfaili kõik küsimused on muutmata sõnastuses ja samas järjekorras",
  { skip: !existsSync("eksamiküsimused.txt") },
  () => {
    const rows = readFileSync("eksamiküsimused.txt", "utf8")
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((s) => s.trim());
    rows[0] += " " + rows.splice(1, 1)[0];
    assert.deepEqual(
      exam.map((q) => q.original),
      rows,
    );
  },
);
test("Segamine säilitab vastuste identiteedi ja algse järjekorra andmetes", () => {
  const a = [0, 1, 2, 3],
    b = shuffled(a, () => 0);
  assert.deepEqual(a, [0, 1, 2, 3]);
  assert.deepEqual(b, [1, 2, 3, 0]);
  assert.ok(grade([0], [b[3]]));
  assert.ok(!grade([0], [b[0]]));
});
test("Mitmikvalikus peab kattuma kogu hulk", () => {
  assert.ok(grade([0, 2], [2, 0]));
  for (const a of [[2], [0, 1, 2], [0, 0], [1, 2]])
    assert.ok(!grade([0, 2], a));
});
test("Üks õige ei anna omandamist, viga toob küsimuse kohe tagasi", () => {
  let r = recordAnswer(null, true, 100);
  assert.equal(r.mastered, false);
  assert.equal(r.due, 100 + DAY);
  assert.ok(!due(r, 100));
  r = recordAnswer(r, true, 200);
  r = recordAnswer(r, true, 300);
  assert.ok(r.mastered);
  assert.equal(r.due, 300 + 7 * DAY);
  r = recordAnswer(r, false, 400);
  assert.equal(r.mastered, false);
  assert.ok(due(r, 400));
  assert.equal(r.right, 3);
  assert.equal(r.wrong, 1);
  assert.equal(r.attempts, r.events.length);
  assert.ok(due({ ...emptyRecord(), hard: true }));
});
test("Tulemused ja nende keskmine arvestavad iga testi pikkust", () => {
  assert.deepEqual(stats([]), { count: 0, average: 0, best: 0, last: 0 });
  assert.deepEqual(
    stats([
      { right: 1, items: [1, 2] },
      { right: 4, items: [1, 2, 3, 4] },
    ]),
    { count: 2, average: 75, best: 100, last: 100 },
  );
  assert.equal(percent(2, 3), 67);
});
test("Varukoopia säilitab pooleli testi, vigased andmed lükatakse tagasi", () => {
  const s = fresh();
  s.active = makeSession([first[0]], "practice", "Test");
  s.records[first[0].id] = recordAnswer(null, true);
  assert.ok(validateSave(JSON.parse(JSON.stringify(s)), bank));
  s.active.items[0].order = [1, 1, 2, 3];
  assert.ok(!validateSave(s, bank));
  s.active = null;
  s.records[first[0].id].wrong = -1;
  assert.ok(!validateSave(s, bank));
  assert.ok(!validateSave({ ...fresh(), version: 2 }, bank));
});

test("Kontrastisuhe arvestab heledust mõlemas suunas", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#117744", "#117744"), 1);
  assert.equal(
    contrastRatio("#ffffff", "#767676"),
    contrastRatio("#767676", "#ffffff"),
  );
  assert.ok(contrastRatio("#767676", "#ffffff") >= 4.5);
  assert.ok(contrastRatio("#777777", "#ffffff") < 4.5);
});
