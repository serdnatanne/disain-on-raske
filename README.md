# Vormikool · GDA 2026

Mobiilikeskne eestikeelne veebirakendus graafilise disaini aluste eksamiks. Avalehe **Jätka õppimist** avab pooleli oleva testi, kordamisjärje või viie küsimusega kiirtesti.

## Käivitamine

Kasuta Node.js 24 ja npm-i. Käivita projekti kaustas järgmised käsud. Kui sõltuvused on juba paigaldatud, piisab viimasest käsust.

```powershell
npm.cmd ci
npm.cmd run dev
```

Ava terminali väljastatud **Local** aadress. Telefonist sama Wi-Fi kaudu avamiseks käivita `npm.cmd run dev -- --host 0.0.0.0` ja kasuta terminali **Network** aadressi. Kasuta seda üksnes oma usaldatud võrgus.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

## Õppimine

- **Harjutamine** sisaldab 52 eksamiküsimust. Vali loeng, teema ja testi pikkus. Proovieksam kasutab kogu valitud komplekti ning näitab vastuseid lõpus. Kõigi 52 küsimusega eksamiks jäta koguks „Eksamiküsimused” ja filtriteks „Kõik”.
- **Küsimustik** säilitab originaaljärjestuse ja täieliku algsõnastuse. Enne vastuse avamist proovi seda ise sõnastada. Ava selgitus, mälunipp või sama teadmise valikvastustega harjutus. Kiirkordamine jätab ekraanile lühivastuse. Kontrastiülesande juures saab proovida kahte värvi kalkulaatoris.
- **Piltküsimused** sisaldavad 18 hinnatavat ülesannet. 11 on iseseisvad harjutused ning 7 kasutavad Moodle’i komplektist samu küsimusi ja sama vastamisajalugu. Stiiliajaloo plakatikavandid on selle rakenduse jaoks joonistatud.
- **Moodle’i enesekontrollis** on 14 küsimust loengutest 1–3 ja 15 küsimust loengutest 4–6. Ühe küsimuse vastus vajab kontrollimist. Seda saab küsimustikust lugeda. Kombineeritud test ühendab eksami- ja Moodle’i küsimused.
- **Vajan kordamist** näitab käsitsi raskeks märgitud ja tähtajaks kordamisele jõudnud küsimusi. Viga nullib järjestikuste õigete vastuste astme. Õigete vastuste kordamisvahed on 1, 3, 7, 14 ja 30 päeva. Kolm järjestikust õiget märgivad küsimuse omandatuks. Enesehinnangu kolm valikut annavad järgmise kordamise vastavalt kohe, ühe või seitsme päeva pärast.
- Arvutis saab testis valida variandi numbriklahviga. Küsimustikus liiguvad vasak- ja paremnool eelmisele ning järgmisele kaardile.

## Salvestamine

Õppeandmed, pooleli olev test ja teemavalik salvestatakse brauseri kohalikku salvestusruumi. Harjutuses läheb vastus ajalukku kinnitamisel. Proovieksami vastused püsivad pooleli oleva testi sees ja tulemused avanevad lõpus. Seadetes saab eksportida ja importida versioonitud JSON-varukoopia. Teise brauseri, seadme või veebiaadressi puhul kasuta andmete ülekandmiseks varukoopiat. Juba laaditud rakenduses toimib õppimine võrguühenduseta. Uue brauseriava võrguühenduseta käivitamiseks puudub paigaldatav PWA.

## GitHub Pages

1. Lisa projekti kood GitHubi repositooriumi harusse `main`. Lähtefailide kaitseks on projektis `.gitignore`. Kontrolli enne esimest commit'i käsuga `git status --short`, millised failid lähevad repositooriumisse.
2. Vali repositooriumis **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Lükka muudatus harusse `main` või käivita Actionsi vaates töövoog **Avalda GitHub Pagesis** käsitsi.
4. Töövoog käivitab testid, ehitab projekti ja avaldab ainult kausta `dist/`. Avaldatud aadress ilmub töövoo keskkonna `github-pages` juurde.

Vite’i suhteline `base: "./"` töötab nii domeeni juurkaustas kui ka repositooriumi alamteel. Räsi kaudu liikuvad vaated (näiteks `/#read`) säilivad värskendamisel. Privaatne analüüsikaust ja algmaterjalid jäävad Gitist välja. Vite'i avaliku kausta kopeerimine on välja lülitatud.

## Failid ja sisu uuendamine

| Fail | Otstarve |
| --- | --- |
| `src/exam-first.js`, `src/exam-last.js` | Originaalsed eksamiteemad, lühivastused, täpsustused, testid ja leheküljeviited |
| `src/moodle.js` | Enesekontroll, algne sõnastus ja kohandatud näidised |
| `src/visuals.js`, `src/style-studies.js` | Originaalsed joonised ja stiiliajaloo plakatinäited |
| `src/app.js` | Õppelaud, küsimustik, testide koostamine, tulemused, statistika ja seaded |
| `src/engine.js` | Hindamine, segamine, kordamine, statistika ja varukoopia valideerimine |
| `src/contrast.js` | Kontrasti arvutamine ja värvide katsetamine |
| `src/art.js`, `src/style.css` | Ikoonid, avalehe graafika, kohanduv paigutus ja teemad |
| `tests/study.test.js` | Sisu, algjärjestuse ja õppimisloogika automaatkontrollid |
| `vite.config.js`, `.github/workflows/pages.yml` | Production-build ja Pagesi avaldamine |

Igal küsimusel on püsiv ID. `original` säilitab lähteülesande, `prompt` sõnastab konkreetse harjutuse. `correct` sisaldab õige variandi algset nullist algavat indeksit. Segamisel muutub ainult näitamise järjekord. Ebakindlale kirjele lisa `needsReview: true` ning täida `reason`. Olemasolevate variantide järjestuse või sisu sisulisel muutmisel säilita ajalooliste valikute tähendus või tee andmemigratsioon. Salvestusvormingu versioon on 1.

Materjalide katvus ja lahtise küsimuse põhjendus on failis [SISUKONTROLL.md](./SISUKONTROLL.md).

