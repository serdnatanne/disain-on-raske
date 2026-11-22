const paths = {
  home: "M3 10l9-7 9 7v10h-6v-6H9v6H3z",
  book: "M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 1-4-3-9-1zM12 5v15",
  practice: "m13 2-9 12h7l-1 8 10-13h-8z",
  stats: "M4 4v16h17M8 16v-5m5 5V6m5 10v-7",
  settings:
    "M3 7h5m5 0h8M3 17h10m5 0h3M13 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0m5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0",
  visual: "M3 4h18v16H3zM4 18l6-7 4 4 3-3 4 4M16 8h.01",
  layers: "m3 7 9-4 9 4-9 5zM3 12l9 5 9-5M3 17l9 5 9-5",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2",
  repeat: "M4 10a8 8 0 1 1 1 8M4 4v6h6",
  flag: "M5 21V3q4-2 8 0t7 0v10q-4 2-7 0t-8 0",
  target:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  play: "m8 4 12 8-12 8z",
  check: "m4 12 5 5L20 6",
  next: "m9 5 7 7-7 7",
  spark: "m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M4 6h2m4 0h11M4 12h2m4 0h11M4 18h2m4 0h11",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 1 1 8 0M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
  back: "m14 5-7 7 7 7",
  close: "m5 5 14 14M19 5 5 19",
};
export const icon = (name, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="${paths[name] || paths.book}"/></svg>`;
export function rosette() {
  return `<svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<ellipse cx="24" cy="14" rx="6.5" ry="12" transform="rotate(${i * 36} 24 24)" fill="currentColor"/>`).join("")}<circle cx="24" cy="24" r="5" fill="var(--bg)"/></svg>`;
}
export const poster = `<svg class="poster" viewBox="0 0 270 212" role="img" aria-label="Graafiline värviuuring. Üksteise peal on kolm trükikaarti, pealmisel tähega a ja rosetiga kompositsioon."><defs><pattern id="lines" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0v7" stroke="#284641" stroke-width="2"/></pattern><filter id="paper" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-opacity=".2"/></filter></defs><g filter="url(#paper)"><g transform="translate(102 34) rotate(19 65 80)"><rect width="128" height="160" rx="4" fill="#b4bd9f"/><rect x="10" y="12" width="108" height="136" fill="url(#lines)"/></g><g transform="translate(76 23) rotate(5 65 80)"><rect width="128" height="163" rx="4" fill="#f6b266"/><circle cx="78" cy="92" r="41" fill="#9c3e33"/></g><g transform="translate(39 24) rotate(-13 67 81)"><rect width="136" height="166" rx="4" fill="#fff9e8"/><text x="10" y="17" font-size="7" letter-spacing="1.2" font-weight="700" fill="#322c2a">VORMIUURING</text><path d="M10 23h116" stroke="#594e45"/><text x="8" y="102" font-family="Georgia,serif" font-size="99" fill="#382a34">a</text><g transform="translate(89 86)">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-15" rx="7" ry="18" transform="rotate(${i * 30})" fill="#af4c54"/>`).join("")}<circle r="6" fill="#e9b672"/></g><path d="M10 129h116" stroke="#594e45"/><text x="10" y="147" font-size="8" fill="#312c2b" font-family="monospace">Aa / 01</text><g transform="translate(83 138)"><path d="M0 0h13v10H0" fill="#382a34"/><path d="M14 0h13v10H14" fill="#af4c54"/><path d="M28 0h13v10H28" fill="#efb664"/></g></g></g></svg>`;
