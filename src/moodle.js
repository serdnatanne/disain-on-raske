const pdfNames = [
  "01 GDA 2026.pdf",
  "02 GDA 2026.pdf",
  "03_GDA_2026.pdf",
  "04_GDA_2026.pdf",
  "05_GDA_2026.pdf",
  "06_GDA_2026.pdf",
];
const truth = ["Tõene", "Väär"];
const sampleLabels = ["Näidis A", "Näidis B", "Näidis C", "Näidis D"];
const harmony = [
  "Monokroomia",
  "Komplementaarne",
  "Jaotuv komplementaarne",
  "Analoogia",
  "Kolmkõla",
];

function item(
  n,
  lecture,
  topic,
  pages,
  original,
  options,
  answer,
  explanation,
  extra = {},
) {
  const first = n <= 14;
  const local = first ? n : n - 14;
  const screen = first
    ? "001"
    : local <= 5
      ? "002"
      : local <= 12
        ? "003"
        : "004";
  return {
    id: "moodle-" + String(n).padStart(2, "0"),
    origin: "moodle",
    group: first ? "1–3" : "4–6",
    lecture,
    topic,
    original,
    prompt: original,
    short: options[answer] || "",
    explanation,
    keywords: [topic],
    tip: "",
    options,
    correct: Number.isInteger(answer) ? [answer] : [],
    sources: [
      `Moodle’i kuvatõmmis ${screen}, küsimus ${local}`,
      `${pdfNames[lecture - 1]}, lk ${pages}`,
    ],
    needsReview: false,
    ...extra,
  };
}

function diagram(content, alt, height = 90) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 ${height}" role="img" aria-label="${alt}"><title>${alt}</title><rect width="320" height="${height}" rx="10" fill="#faf7f2"/>${content}</svg>`;
}

function palette(colors, description) {
  const width = 280 / colors.length;
  const chips = colors.map(
    (color, i) =>
      `<rect x="${20 + i * width}" y="18" width="${width + 0.1}" height="54" fill="${color}"/>`,
  );
  return diagram(chips.join(""), description);
}

// Hand-drawn “Hi” letterforms make the sample independent of installed fonts.
const strokes = {
  script:
    '<path d="M3 27C12 12 19 7 18 15L11 39C20 21 33 4 30 17L24 36Q23 42 33 31L39 24L35 36Q35 40 44 32M40 17l2 -3" fill="none" stroke="#222" stroke-width="2.4" stroke-linecap="round"/>',
  serif:
    '<path d="M5 8h12v2l-4 1v11h14V11l-4-1V8h12v2l-4 1v24l4 1v2H23v-2l4-1V25H13v10l4 1v2H5v-2l4-1V11l-4-1zm33 12 7-1v16l3 1v2H35v-2l5-1V23l-2-1z"/><circle cx="42" cy="12" r="2.6"/>',
  sans: '<path d="M6 8h5v13h16V8h5v30h-5V26H11v12H6zm32 11h5v19h-5zm0-10h5v5h-5z"/>',
  geometric:
    '<path d="M7 8v30m18-30v30M7 22h18m9-14v30" fill="none" stroke="#222" stroke-width="2"/>',
  display:
    '<path d="m3 9 10-3-2 15 14-3 3-10 9 2-8 27-8 2 3-15-14 3-1 11-8 1zm38 11 8-2-5 19-8 2z"/><path d="m43 9 4-4 4 4-4 4z"/>',
  slab: '<path d="M3 8h17v5h-4v7h11v-7h-4V8h17v5h-6v20h6v5H22v-5h5v-8H16v8h5v5H3v-5h6V13H3z"/>',
};
const descriptions = {
  script: "ühendatud kaldus sulejooned",
  serif: "peenikesed jalakesed põhikriipsude otstes",
  sans: "ühtlase jämedusega sirged kandita kriipsud",
  geometric: "peened lihtsad sirgjooned",
  display: "kaldu lõigatud ebatavalised jämedad vormid",
  slab: "jämedad kandilised jalakesed",
};

function typeSamples(styles) {
  const drawings = styles
    .map(
      (name, i) =>
        `<g transform="translate(${13 + i * 77},8)" fill="#222">${strokes[name]}</g><text x="${36 + i * 77}" y="76" fill="#222" font-family="sans-serif" text-anchor="middle" font-size="14">${"ABCD"[i]}</text>`,
    )
    .join("");
  return diagram(
    drawings,
    styles.map((s, i) => `${"ABCD"[i]} – ${descriptions[s]}`).join(". "),
  );
}
const poster = (prompt) => ({
  prompt: prompt + " Vali plakati kirjelduse järgi.",
});

export default [
  item(
    1,
    2,
    "Gestalt",
    "21–23",
    "Mis on Gestalt põhiprintsiip?",
    [
      "Tervik on mõistetav iga üksikosa kaudu.",
      "Tervik on üksikosade summa.",
      "Tervik on suurem kui üksikosade summa.",
      "Tervik avaldub üksikosade korduses.",
    ],
    2,
    "Punktide rühmas võid näha nägu, kuigi ükski punkt eraldi ei kujuta nägu. Tähenduse loob osade paigutus.",
  ),
  item(
    2,
    2,
    "Kolmandike reegel",
    "55–56",
    "Kolmandike reegli alusel tuleks kompositsiooni kõige olulisemad elemendid paigutada",
    [
      "kolme kaupa grupeerituna.",
      "kolmnurkselt.",
      "pinna mõttelistele kolmandikjaotustele.",
      "pinna keskmesse.",
    ],
    2,
    "Jaga laius ja kõrgus kolmeks. Aseta põhielement mõttelisele jaotusjoonele või kahe joone ristumisse.",
  ),
  item(
    3,
    2,
    "Pilgu trajektoor",
    "12–13",
    "Vastavalt Z-trajektoorile peatub pilk kujutist vaadates kõige pikemalt",
    [
      "all paremas nurgas.",
      "üleval vasakul nurgas.",
      "üleval paremas nurgas.",
      "all vasakul nurgas.",
    ],
    1,
    "Vasakult paremale lugedes algab Z-kujuline liikumine vasakust ülanurgast. Loengu skeemis saab see punkt kõige kauem tähelepanu.",
  ),
  item(
    4,
    2,
    "Figuur ja foon",
    "19, 24",
    "Reversioon on",
    [
      "optiline fenomen, milles üks värv mõjutab teise tajumist.",
      "kahe värviringi vastandvärvi vaheline harmoonia.",
      "järelkujutis, mis tekib silma võrkkestale intensiivse stiimuli järelmõjuna.",
      "figuuri ja fooni ehk esiplaani ja tausta vahetumine kujutise vaatamisel.",
    ],
    3,
    "Sama ala võib alguses paista taustana ja järgmisel vaatamisel äratuntava kujutisena. Nii vahetuvad plaanide rollid.",
  ),
  item(
    5,
    1,
    "Disainivoolud",
    "46–54",
    "Milline kujutis pole juugend?",
    [
      "Kalender põimuvate taimevarte ja lilledega",
      "Fleischmanni küpsetisereklaam realistliku portree, kaarkirjade ja rohkete väikeste piltidega",
      "Cycles Légia ratturiplakat stiliseeritud rõivaste ja voogava kirjaga",
      "E. Grasset’ näituseplakat voogavate juuste ja lilli hoidva naisega",
    ],
    1,
    "Fleischmanni reklaami keskne realistlik portree, kirjatüüpide rohkus ja tihedalt raamitud pildid vastavad viktoriaanliku reklaami tunnustele. Teistes näidetes on esil juugendi voogav joon.",
    poster("Milline kujutis pole juugend?"),
  ),
  item(
    6,
    1,
    "Disainivoolud",
    "58–59, 65–66",
    "Milline kujutis pole modernism?",
    [
      "Öland 72 plakat lamedate ringide ja lihtsustatud sillaga",
      "Daylighti rongireklaam madala vaatepunkti, läikiva veduri ja kiirust rõhutavate triipudega",
      "Gymnaestrada Zürich plakat lihtsate korduvate värviliste kujundite ja selge groteskkirjaga",
      "Beethoveni kontserdi plakat oranžide ristkülikute ja vasakjoondatud tekstiga",
    ],
    1,
    "Daylighti plakat ülistab kiirust ja masinat. Metallikläige, dramaatiline vaatenurk ja voolujooneline vedur on siinses kursusejaotuses art déco tunnused.",
    poster("Milline kujutis pole modernism?"),
  ),
  item(
    7,
    1,
    "Disainivoolud",
    "55–57, 72–74",
    "Milline kujutis pole postmodernism?",
    [
      "You are not yourself – killustatud foto ja väljalõigatud tähed",
      "Bauhausi 1923. aasta näituseplakat selgete geomeetriliste vormidega",
      "V&A plakat eri tehnikates näofragmentide kollaažiga",
      "Thome filmiplakat värviliste kihtide ja katkestatud portreega",
    ],
    1,
    "Bauhaus kuulub varasesse modernismi. Geomeetriliste vormide korrastatud asetus erineb teistes kirjeldustes nähtavast tehnikate ja pildikihtide segamisest.",
    poster("Milline kujutis pole postmodernism?"),
  ),
  item(
    8,
    1,
    "Disainivoolud",
    "58–59",
    "Millise disaini stiili või ajastuga on tegu?",
    ["Postmodernism", "Art déco", "Modernism", "Juugend", "Viktoriaanlik"],
    1,
    "Normandie laevaplakati madal vaatenurk, tugevad valguse ja varju kontrastid ning laevakere geomeetriline stiliseering rõhutavad tehnika võimsust.",
    {
      prompt:
        "Normandie plakatil kõrgub vaataja kohal ookeanilaeva läikiv geomeetriline vöör. Millise disainistiiliga on tegu?",
    },
  ),
  item(
    9,
    3,
    "Joon",
    "41–42",
    "Horisontaalsed jooned seostuvad stabiilsuse ja rahuga, vertikaalsed jooned aktiivsuse ja kasvuga.",
    truth,
    0,
    "Horisontaal meenutab puhkavat pinda või silmapiiri. Vertikaal juhib pilgu üles ja tekitab kasvu mulje.",
  ),
  item(
    10,
    3,
    "Disainiprintsiibid",
    "64, 69, 72",
    "Kontrastid aitavad saavutada kujunduses rahu, rütmi ja harmooniat.",
    truth,
    1,
    "Loeng seob rütmi ja harmoonia korduvusega. Kontrasti ülesanne on rõhutada erinevust ja juhtida tähelepanu.",
  ),
  item(
    11,
    3,
    "Lähedus",
    "76",
    "Lähedus on kõige jõulisem disainiprintsiip, mis domineerib kujunduses teiste üle.",
    truth,
    0,
    "Loengu neljast põhiprintsiibist on lähedusel suurim mõju rühmitamisele. Lähestikku paigutatud eri värvi elemendid võivad ikkagi paista ühe rühmana.",
  ),
  item(
    12,
    3,
    "Punkt",
    "38",
    "Pinna keskmesse jääv täpp on aktiivne, tasakaalutu. Pinna äärde jääv täpp on passiivne, tasakaalus.",
    truth,
    1,
    "Keskel paikneva täpi ümber on ruumi ühtlaselt ja ta mõjub rahulikult. Serva läheduses tekib asümmeetria ning pinge.",
  ),
  item(
    13,
    3,
    "Vaba ruum",
    "58–61",
    "Vähe vaba ruumi põhjustab visuaalset müra.",
    truth,
    0,
    "Kui kõik elemendid on tihedalt koos, jäävad rühmade piirid ebaselgeks. Tühi pind eraldab rühmi ja annab silmale puhkust.",
  ),
  item(
    14,
    3,
    "Visuaalne tasakaal",
    "17, 21–23",
    "Milline kujutis kasutab dünaamilist e asümmeetrilist tasakaalu?",
    [
      "Naine keskel, tänava mõlemad servad koonduvad tema poole.",
      "Esiplaanil paremal on terav maleratsu, vasakul tasakaalustab seda kaugem hägune malend.",
      "Järve kaldal kasvav puu peegeldub vees.",
      "Ukseava mõlemal poolel seisavad paarikaupa vastastikku tasakaalustavad inimfiguurid.",
    ],
    1,
    "Malendite foto pooltel on erinev ülesehitus. Eri kaugusel ja fookuses kujundite visuaalsed kaalud tasakaalustavad teineteist.",
    {
      prompt:
        "Milline Moodle’i fotodest kasutab dünaamilist ehk asümmeetrilist tasakaalu? Vali kompositsiooni kirjelduse järgi.",
    },
  ),
  item(
    15,
    4,
    "Antiikva",
    "11, 16, 32",
    "Märgi variant, kus on tegu antiikvaga!",
    sampleLabels,
    1,
    "B-tähega märgitud näites lõpevad tähe põhikriipsud väikeste jalakestega. Need on seriifid.",
    { visual: typeSamples(["script", "serif", "display", "geometric"]) },
  ),
  item(
    16,
    4,
    "Grotesk",
    "11, 22, 25",
    "Märgi variant, kus on tegu groteskiga!",
    sampleLabels,
    0,
    "Näidis A on lihtsate ühtlaste põhikriipsudega. Nende otstes pole seriife.",
    { visual: typeSamples(["sans", "display", "serif", "slab"]) },
  ),
  item(
    17,
    4,
    "Ehiskiri",
    "11, 27–29",
    "Märgi variant, kus on tegu ehiskirjaga!",
    sampleLabels,
    0,
    "A vabalt ühenduvad kaldjooned meenutavad käsitsi kirjutamist. Kursuse jaotuses kuulub kirjutuskiri ehiskirjade hulka.",
    { visual: typeSamples(["script", "sans", "serif", "geometric"]) },
  ),
  item(
    18,
    4,
    "Kirja ajalugu",
    "2, 11, 15",
    "Kui trükikunst leiutati, oli esmalt kasutusel",
    ["gooti kiri.", "grotesk.", "antiikva.", "ehiskiri."],
    0,
    "Küsimus käsitleb Euroopa 15. sajandi trükikunsti. Varased trükitüübid järgisid gooti käsikirjade tihedaid tumedaid tähevorme.",
    {
      prompt:
        "Milline kiri oli esmalt kasutusel Euroopa 15. sajandi trükikunstis?",
      sources: [
        "Moodle’i kuvatõmmis 002, küsimus 4",
        "04_GDA_2026.pdf, lk 2, 11, 15",
        "USA Kongressi Raamatukogu, Gutenbergi piibli kirjanäide (1455): https://www.loc.gov/exhibits/bibles/the-gutenberg-bible.html",
      ],
    },
  ),
  item(
    19,
    4,
    "Kirjade kombineerimine",
    "56–58",
    "Kirjade kombineerimisel tuleks valida kaks kirjatüüpi, mis",
    [
      "on võimalikult erinevad nii välistelt tunnustelt kui iseloomult.",
      "on teineteisele võimalikult sarnased nii välistelt tunnustelt kui iseloomult.",
      "on välistelt tunnustelt selgelt erinevad, kuid omavahel harmoneeruva iseloomuga.",
      "on võrdse või ligilähedase kirjaperekonna suurusega.",
    ],
    2,
    "Selgelt eristuvad vormid aitavad eristada pealkirja ja põhiteksti. Nende iseloom peab sobima sama sõnumi ja meeleoluga.",
  ),
  item(
    20,
    5,
    "Värviharmooniad",
    "39–40",
    "Millist värviharmooniat on kasutatud?",
    harmony,
    3,
    "Näites liigub palett sinakasvioletsest lillaka roosani. Kõrvuti asuvate värvitoonide kombinatsiooni nimetatakse analoogiaks.",
    {
      prompt:
        "Millist harmooniat näitab Moodle’i lillaka veebikujunduse põhjal koostatud palett?",
      visual: palette(
        ["#332660", "#642e88", "#a43794", "#d63f88"],
        "Sinakasvioletne, violetne, punakasvioletne ja lillakasroosa",
      ),
    },
  ),
  item(
    21,
    5,
    "Värviharmooniad",
    "41, 45, 47",
    "Millist värviharmooniat on kasutatud?",
    harmony,
    null,
    "Akua lehel on türkiis, tumesinine, korallpunane ja kollakasoranž. Otsus sõltub sellest, kas väikseid aktsente käsitleda omaette põhitoonidena.",
    {
      prompt:
        "Millist harmooniat kasutab Akua veebileht? Vaata algse kujunduse põhitoone.",
      visual: palette(
        ["#d5f1eb", "#07979b", "#075477", "#f15963", "#ffd16c"],
        "Heleroheline taust, türkiis, tumesinine, korallpunane ja kollakasoranž",
      ),
      short: "Õige variant vajab kinnitamist.",
      needsReview: true,
      reason:
        "Kuvatõmmisel puudub vastusevõti. Loengus kirjeldatud harmooniatest ei saa selle mitme aktsendiga paleti puhul ühte vastust üheselt kinnitada.",
    },
  ),
  item(
    22,
    5,
    "Värviharmooniad",
    "35, 47–48",
    "Millist värviharmooniat on kodulehe värvilistes elementides kasutatud?",
    harmony,
    4,
    "Oranž, roheline ja violetne on kursuse värviringi sekundaarsed värvid. Nende kolm asukohta moodustavad võrdkülgse kolmnurga.",
    {
      prompt:
        "Millist harmooniat kasutavad Moodle’i näites Operation XCELi kolm värvilist kaarti?",
      visual: palette(
        ["#f17b26", "#2cc365", "#85278f"],
        "Oranž, roheline, violetne",
      ),
    },
  ),
  item(
    23,
    5,
    "Värviharmooniad",
    "35, 41–42",
    "Millist värviharmooniat on liidese loomisel kasutatud?",
    harmony,
    1,
    "Sinine ja oranž asuvad kursuse värviringis vastakuti. Nende kõrvutamine muudab aktsendi põhitaustal silmatorkavaks.",
    {
      prompt:
        "Millist harmooniat näitavad MECO veebilehe kaks põhilist värvipinda?",
      visual: palette(["#243e88", "#f89320"], "Sügavsinine ja oranž"),
    },
  ),
  item(
    24,
    5,
    "Värviharmooniad",
    "37–38",
    "Millist värviharmooniat on kasutatud?",
    harmony,
    0,
    "Dreamteami näide varieerib sama sinakasrohelise tooni heledust ja küllastust. Hele neutraalne kiri sobib monokroomsesse paletti.",
    {
      prompt:
        "Millist harmooniat näitab Dreamteami kujunduse toonidest koostatud palett?",
      visual: palette(
        ["#006673", "#137988", "#acc2c5", "#e7ebeb"],
        "Tume sinakasroheline, keskmine sinakasroheline ja selle heledad hallikad varjundid",
      ),
    },
  ),
  item(
    25,
    5,
    "Komplementaarvärvid",
    "35, 41",
    "Komplementaarvärv on",
    [
      "värvi vahetu naaber värviringis.",
      "värvi otsene vastand värviringis.",
      "värv, mis tekib kahe põhivärvi segunemisel.",
      "värv, millel on teise värviga sama heletumedus.",
    ],
    1,
    "Alusta ühest värvist ja liigu läbi ringi keskpunkti vastasserva. Kollase vastast leiad nii violetse.",
  ),
  item(
    26,
    5,
    "Värvitaju",
    "3–4",
    "Kõige paremini tajub inimsilm värvivarjundeid spektri",
    ["punases osas.", "rohelises osas.", "kollases osas.", "sinises osas."],
    1,
    "Loengu spektriskeem märgib enim eristatavaid varjundeid rohelisse alasse. See on teine omadus kui üksiku värvi intensiivsus.",
  ),
  item(
    27,
    6,
    "Liidese värvikasutus",
    "24, 59, 62–64",
    "Milline väide pole tõene?",
    [
      "Hinnang veebiliidesele antakse vaid mõne sekundiga ning saadud mulje mõjutab edasist kasutuskogemust.",
      "Veebiliideses tuleks kasutada minimaalselt 3 värvitooni lisaks puhtale valgele ja mustale.",
      "Vastavalt F-trajektoorile saavad kõrgendatud tähelepanu liidese vasak äär ja ülaserv.",
      "Veebiliideses ei sõltu kindla elemendi efektiivsus mitte tema asetusest ekraani suhtes, vaid tema asetusest teiste elementide suhtes.",
    ],
    1,
    "Fikseeritud kolme tooni miinimumi pole. Loengus soovitatakse alustada neutraalidest ja lisada värv sinna, kus see aitab märgata olulist.",
  ),
  item(
    28,
    6,
    "Kasutajakesksus",
    "27–30, 54–55",
    "Kasutajaliidese disainis tuleb tagada, et",
    [
      "kõik võimaldatud toimingud tõuseks alati võrdselt esile.",
      "liides püüaks originaalsete ja atraktiivsete lahendustega kasutaja tähelepanu.",
      "kasutaja oleks kognitiivselt e vaimselt pidevalt stimuleeritud.",
      "kasutaja tunneks end informeerituna ja enesekindlana.",
    ],
    3,
    "Näita kasutajale süsteemi olekut ja paku tuttavaid toiminguid. Näiteks pärast salvestamist kuvatud kinnitus aitab tal mõista, mis juhtus.",
  ),
  item(
    29,
    6,
    "Kognitiivne koormus",
    "30–37",
    "Milline väide pole tõene?",
    [
      "Kasutajatele ei tohi anda liiga palju valikuid korraga, kuna tähelepanu ja mälu on piiratud.",
      "Sisuliselt seotud toiminguid tuleks hoida sarnastena ja lähestikku.",
      "Liidese vaade tuleks täita mitmete konkureerivate fookuspunktidega.",
      "Liidesest tuleks eemaldada kõik ebavajalikud elemendid, et vähendada kognitiivset koormust.",
    ],
    2,
    "Mitu üksteisega võistlevat rõhuasetust raskendab valikut. Selge hierarhia tõstab esile parajasti tähtsaima tegevuse.",
  ),
];
