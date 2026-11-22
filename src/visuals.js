import styleStudies from "./style-studies.js";
const frame = (label, body) =>
  `<svg role="img" aria-label="${label}" viewBox="0 0 360 152" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="152" rx="12" fill="#f4eee2"/>${body}</svg>`;
const dot = (x, y, r = 10, color = "#493c82") =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
function visual(
  n,
  lecture,
  topic,
  prompt,
  body,
  alt,
  answer,
  others,
  explanation,
  source,
) {
  return {
    id: "visual-" + n,
    origin: "visual",
    lecture,
    topic,
    original: prompt,
    prompt,
    visual: frame(alt, body),
    short: answer,
    options: [answer, ...others],
    correct: [0],
    explanation,
    sources: [source],
    needsReview: false,
    keywords: [topic],
    tip: "",
  };
}
export default [
  visual(
    1,
    2,
    "Kompositsioon",
    "Millise kompositsioonivõtte järgi on ketas paigutatud?",
    '<path d="M120 0v152m120-152v152M0 51h360M0 101h360" fill="none" stroke="#928b81" stroke-dasharray="5 3"/>' +
      dot(240, 51, 19, "#bb4c32"),
    "Kolm korda kolm ruudustik. Ketas asub ülemisel parempoolsel ristumisel.",
    "Kolmandike reegel",
    [
      "Tsentraalne sümmeetria",
      "Figuuri ja fooni vahetumine",
      "Diagonaalne peegeldus",
    ],
    "Pind jaguneb mõlemas suunas kolmeks. Ketas langeb kahele kolmandikjoonele korraga.",
    "02 GDA 2026.pdf, lk 55",
  ),
  visual(
    2,
    2,
    "Gestalt",
    "Miks tajume neid täppe kahe rühmana?",
    [70, 95, 120, 240, 265, 290].map((x) => dot(x, 76)).join(""),
    "Kuus identset täppi ühel joonel. Keskmine vahe on teistest palju suurem.",
    "Lähedus",
    ["Suuruse kontrast", "Ühine piirjoon", "Värvi muutumine"],
    "Ühe kolmiku sees on vahed väiksemad kui kolmikute vahel. Vahekaugus annab rühmitamise vihje.",
    "02 GDA 2026.pdf, lk 29",
  ),
  visual(
    3,
    2,
    "Gestalt",
    "Milline Gestalti printsiip aitab siin tajuda tervet kolmnurka?",
    '<path d="m166 49 14-24 17 29m12 21 25 43h-40m-27 0h-41l25-43" stroke="#873d66" stroke-width="6" fill="none"/>',
    "Kolm nurgakujulist joont, mille vahele jäävad lüngad.",
    "Suletus",
    ["Lähedus", "Muutumatus", "Telgsümmeetria"],
    "Pilguga täidame piirjoone lüngad. Tajutud pind on terviklik, kuigi selle kontuur katkeb.",
    "02 GDA 2026.pdf, lk 27–28",
  ),
  visual(
    4,
    4,
    "Tüpograafia",
    "Mis eristab parempoolset tähte vasakpoolsest?",
    '<text x="73" y="113" font-family="Arial,sans-serif" font-size="108" fill="#353136">H</text><text x="220" y="113" font-family="Georgia,serif" font-size="108" fill="#353136">H</text>',
    "Kaks H-tähte. Parema tähe püstjoonte otstes on väikesed ristijooned.",
    "Parempoolsel tähel on seriifid.",
    [
      "Parempoolne täht on käsitsi ühendatud.",
      "Vasakpoolsel tähel on seriifid.",
      "Parempoolne täht on väiketäht.",
    ],
    "Seriif on tähejoone otsas asuv väike lõpetav joon. Võrdle mõlema H üla- ja alaserva.",
    "04_GDA_2026.pdf, lk 32–37",
  ),
  visual(
    5,
    5,
    "Värviharmoonia",
    "Millist harmooniat näitab palett?",
    ["#443062", "#6c508d", "#9273ae", "#c5b2d4"]
      .map(
        (c, i) =>
          `<rect x="${42 + 69 * i}" y="32" width="69" height="88" fill="${c}"/>`,
      )
      .join(""),
    "Neli lilla varjundit tumedast heledani.",
    "Monokroomne harmoonia",
    [
      "Komplementaarne harmoonia",
      "Kolmkõla",
      "Jaotuv komplementaarne harmoonia",
    ],
    "Kõik toonid pärinevad ühest värviperest. Vaheldus tekib heletumedusest ja küllastusest.",
    "05_GDA_2026.pdf, lk 35–47",
  ),
  visual(
    6,
    2,
    "Gestalt",
    "Miks tajume joont ristküliku taga jätkuvana?",
    '<path d="M64 119 296 33" stroke="#633d80" stroke-width="8"/><rect x="143" y="23" width="74" height="107" fill="#e9ad57"/>',
    "Sirge diagonaali keskosa on kaetud läbipaistmatu ristkülikuga.",
    "Mõlemad jooneosad järgivad sama trajektoori.",
    [
      "Mõlemad pinnad on võrdse heledusega.",
      "Taust ja figuur vahetavad rolli.",
      "Ristkülik on diagonaaliga sama värvi.",
    ],
    "Jätkuvuse tõttu seostame samal rajal olevaid lõike ka siis, kui osa joonest on varjatud.",
    "02 GDA 2026.pdf, lk 31–32",
  ),
  ...styleStudies,
];
