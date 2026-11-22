// Original poster studies illustrate the distinctions in lecture 1.
const title = (text, x, y, size, family = "Georgia", fill = "#272426") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-family="${family}">${text}</text>`;
const studies = [
  [
    "Viktoriaanlik stiil",
    "46–49",
    "Tihedalt raamitud kuulutus. Pealkirjad vahelduvad mitmes kirjas ning kesktelje ümber on lilleornamendid.",
    '<rect width="360" height="170" fill="#f2deb9"/><g stroke="#704833" fill="none"><rect x="8" y="8" width="344" height="154"/><rect x="13" y="13" width="334" height="144" stroke-width="3"/><ellipse cx="180" cy="86" rx="118" ry="60"/></g>' +
      [32, 328]
        .map((x) =>
          [36, 62, 87, 112, 136]
            .map(
              (y) =>
                `<g transform="translate(${x},${y})" fill="#96674e"><path d="M0 10Q-22-11-4-5L0 1Q12-18 15-6Q14 1 2 5z"/><circle r="3"/></g>`,
            )
            .join(""),
        )
        .join("") +
      '<g text-anchor="middle">' +
      title("SUUR", 180, 53, 16, "serif") +
      title("Lillenäitus", 180, 96, 44) +
      title("MUUSIKA  ✦  AED  ✦  KUNST", 180, 121, 10, "monospace") +
      "</g>",
    "Tsentraalne kompositsioon, rikkalik kaunistus ja eri kirjade kuhjamine viitavad viktoriaanlikule reklaamile.",
  ],
  [
    "Juugend",
    "50–54",
    "Murtud rohelisel taustal kaarduvad pikad varred õite ja voolavateks ornamentideks stiliseeritud lehtedeni.",
    '<rect width="360" height="170" fill="#e7d9ac"/><path d="M0 161C103 174 37 52 118 29S180 91 143 74C109 59 160 38 167 13M16 170C86 135 74 83 113 71M30 170C6 98 57 20 54 73S83 56 85 13" stroke="#425d4a" fill="none" stroke-width="4"/><g fill="#899668" stroke="#425d4a" stroke-width="2"><path d="M50 137Q18 75 55 70Q79 89 50 137ZM94 49Q62 21 80 11Q102 19 94 49ZM113 71Q128 35 143 49Q143 69 113 71Z"/></g><g fill="#c77e67" stroke="#61473b"><path d="M162 22Q141 9 151 4L164 13Q165-3 174 3L170 16Q189 9 187 19L167 27z"/></g>' +
      title("Iirised", 177, 107, 51, "Georgia", "#495a46") +
      title("KEVADINE NÄITUS", 183, 132, 12, "serif", "#495a46"),
    "Loodusmotiiv ja piitsalöögina kaarduv pidev joon on juugendile omased.",
  ],
  [
    "Art déco",
    "58–62",
    "Tume kuldsete koonduvate valguskiirte, astmelise silueti ning paralleelsete triipudega plakat.",
    '<rect width="360" height="170" fill="#273f48"/><g fill="#b18a55"><path d="M176 146 0 5v37zM176 146 52 0h27zM176 146 121 0h18zM176 146 219 0h18zM176 146 295 0h27zM176 146 360 25v29z"/></g><path d="M70 142v-17h35v-16h23V83h20V63h16V45l15-25 15 25v18h16v20h20v26h23v16h35v17z" fill="#e9c895" stroke="#493a33" stroke-width="2"/><g stroke="#684833" stroke-width="2"><path d="M174 50v83m5-92v92m5-83v83"/></g>' +
      title("L U M E N", 126, 161, 20, "sans-serif", "#eddbb7"),
    "Astmelised vormid, metallikmulje, paralleelsed triibud ja valguskiired seovad geomeetria linliku glamuuriga.",
  ],
  [
    "Modernism",
    "55–57, 65–66",
    "Selge vasakjoondatud seriifideta kiri, avar valge pind, üks punane ring ja mustad jooned.",
    '<rect width="360" height="170" fill="#f2eee6"/><circle cx="259" cy="82" r="57" fill="#be3630"/><path d="M24 26h155m-155 103h155" stroke="#252723" stroke-width="2"/>' +
      title("vorm", 22, 91, 55, "Arial") +
      title("näitus", 25, 119, 23, "Arial") +
      title("10.05 — 22.06", 24, 149, 11, "monospace"),
    "Puhtad geomeetrilised pinnad ja loetav vasakjoondatud grotesk on omased modernismile, eriti Šveitsi tüpograafilisele stiilile.",
  ],
  [
    "Postmodernism",
    "72–75",
    "Tüpograafiline kollaaž. Katkised paberiribad, pööratud tähed ja vabakäeline joon kattuvad.",
    '<rect width="360" height="170" fill="#ded7cf"/><path d="m0 40 127-29 8 8 106-19 13 36-194 57-9-4-51 19z" fill="#ee8290"/><path d="m144 119 174-70 42 2v83l-173 34z" fill="#77acc4"/><g transform="rotate(-14 151 82)">' +
      title("KAT", 38, 96, 81, "Arial Black") +
      '</g><path d="m136 39 104-15 7 49-99 24z" fill="#f7e397"/><g transform="rotate(17 220 104)">' +
      title("ke", 171, 122, 96, "Georgia", "#7a373f") +
      '</g><path d="M16 121q70-50 131 4t101-14 88 21" fill="none" stroke="#222" stroke-width="4"/>' +
      title("näitus", 274, 153, 17, "monospace"),
    "Kihiline kollaaž, vabakäejoon ja tüpograafiline eksperiment painutavad tavapärast kujundusruudustikku.",
  ],
];
export default studies.map(([answer, pages, alt, body, explanation], i) => ({
  id: "visual-style-" + (i + 1),
  origin: "visual",
  lecture: 1,
  topic: "Disainivoolud",
  original: "Millise ajastu võtteid kasutab see näituseplakati kavand?",
  prompt: "Millise ajastu võtteid kasutab see näituseplakati kavand?",
  short: answer,
  explanation,
  keywords: ["Disainivoolud", answer],
  tip: "",
  options: studies.map((s) => s[0]),
  correct: [i],
  needsReview: false,
  sources: ["01 GDA 2026.pdf, lk " + pages],
  visual: `<svg role="img" aria-label="${alt}" viewBox="0 0 360 170" xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
}));
