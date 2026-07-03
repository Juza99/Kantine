// A light hand-drawn doodle sheet (camera, star, heart, cassette) tiled subtly
// behind every screen, echoing the scribbled-illustration cover art style.
const DOODLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <g fill="none" stroke="#fbf1d9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.07">
    <path d="M40 46 L40 18 M26 32 L54 32 M30 22 L50 42 M50 22 L30 42" />
    <rect x="150" y="30" width="46" height="34" rx="6" />
    <path d="M164 30 L172 20 L184 20 L192 30" />
    <circle cx="173" cy="47" r="9" />
    <path d="M46 176 C46 164 62 164 62 176 C62 188 46 196 46 202 C46 196 30 188 30 176 C30 164 46 164 46 176 Z" />
    <circle cx="152" cy="180" r="16" />
    <circle cx="200" cy="180" r="16" />
    <rect x="152" y="164" width="48" height="32" rx="4" />
    <path d="M164 180 L188 180" />
  </g>
</svg>
`.trim()

export const doodleBackgroundImage = `url("data:image/svg+xml,${encodeURIComponent(DOODLE_SVG)}")`
