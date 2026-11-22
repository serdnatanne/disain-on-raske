// Relative sRGB luminance. Inputs are six-digit HTML colour-picker values.
export function contrastRatio(a, b) {
  const luminance = (hex) => {
    const rgb = hex
      .slice(1)
      .match(/../g)
      .map((s) => parseInt(s, 16) / 255);
    const [r, g, b] = rgb.map((v) =>
      v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function contrastDemo() {
  return `<details><summary>Proovi kontrastikalkulaatorit</summary><div class="colorinputs"><label>Tekst<input id="fg" type="color" value="#817483"></label><label>Taust<input id="bg" type="color" value="#ffffff"></label></div><div id="sample">Näidistekst</div><output id="ratio"></output></details>`;
}
export function updateContrast() {
  const output = document.querySelector("#ratio");
  if (!output) return;
  const fg = document.querySelector("#fg").value,
    bg = document.querySelector("#bg").value;
  const ratio = contrastRatio(fg, bg),
    sample = document.querySelector("#sample");
  sample.style.color = fg;
  sample.style.background = bg;
  output.textContent =
    ratio.toLocaleString("et-EE", { maximumFractionDigits: 2 }) +
    " : 1 · " +
    (ratio >= 4.5
      ? "Sobib ka väikesele tekstile."
      : ratio >= 3
        ? "Sobib suurele tekstile ja olulisele ikoonile. Väike tekst vajab suuremat kontrasti."
        : "Jääb alla nii 3 : 1 kui ka 4,5 : 1 piiri.");
}
