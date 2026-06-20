/* ===========================================================================
   Graphiques de l'espace Comptabilité — SVG pur (aucune dépendance).
   Donut, histogramme groupé (Entrées vs Dépenses) et courbe d'aire (solde).
   --------------------------------------------------------------------------- */
import { formatNombre } from "./data";

/* --- Échelle « jolie » pour les axes (0, ¼, ½, ¾, max arrondi) ----------- */
function niceMax(value: number, steps = 4) {
  if (value <= 0) return steps;
  const rough = value / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * mag * steps;
}

const kLabel = (n: number) =>
  n >= 1000 ? `${formatNombre(n / 1000)}k` : formatNombre(n);

/* ==========================================================================
   Donut (anneau) — segments proportionnels
   ========================================================================== */
export function Donut({
  data,
  size = 190,
  thickness = 30,
}: {
  data: { value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg
      className="cc-donut"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label="Répartition des dépenses"
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#efe7dc"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const frac = d.value / total;
          const seg = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${frac * c} ${c}`}
              strokeDashoffset={-acc * c}
            />
          );
          acc += frac;
          return seg;
        })}
      </g>
    </svg>
  );
}

/* ==========================================================================
   Histogramme groupé — Entrées (vert) vs Dépenses (rouge) par mois
   ========================================================================== */
export function GroupedBars({
  labels,
  entrees,
  depenses,
}: {
  labels: string[];
  entrees: number[];
  depenses: number[];
}) {
  const W = 720;
  const H = 300;
  const padL = 52;
  const padR = 12;
  const padT = 12;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(1, ...entrees, ...depenses));
  const n = labels.length;
  const groupW = plotW / n;
  const barW = Math.min(14, (groupW - 8) / 2);
  const ticks = 4;

  const y = (v: number) => padT + plotH - (v / max) * plotH;

  return (
    <svg
      className="cc-bars"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Entrées et dépenses par mois"
    >
      {/* grille + axe Y */}
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (max / ticks) * i;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="#eee3d6" strokeWidth={1} />
            <text x={padL - 8} y={yy + 4} textAnchor="end" className="cc-axis">
              {kLabel(v)}
            </text>
          </g>
        );
      })}

      {/* barres */}
      {labels.map((lab, i) => {
        const gx = padL + groupW * i + groupW / 2;
        const x1 = gx - barW - 2;
        const x2 = gx + 2;
        return (
          <g key={lab}>
            <rect x={x1} y={y(entrees[i])} width={barW} height={padT + plotH - y(entrees[i])} rx={2} fill="#16a34a" />
            <rect x={x2} y={y(depenses[i])} width={barW} height={padT + plotH - y(depenses[i])} rx={2} fill="#dc2626" />
            <text x={gx} y={H - 12} textAnchor="middle" className="cc-axis">{lab}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ==========================================================================
   Courbe d'aire — évolution du solde (fin de chaque mois)
   ========================================================================== */
export function AreaCurve({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const W = 720;
  const H = 300;
  const padL = 52;
  const padR = 14;
  const padT = 14;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(1, ...values));
  const n = values.length;
  const ticks = 4;
  const x = (i: number) => padL + (plotW / (n - 1)) * i;
  const y = (v: number) => padT + plotH - (v / max) * plotH;

  const pts = values.map((v, i) => `${x(i)},${y(v)}`);
  const line = `M ${pts.join(" L ")}`;
  const area = `${line} L ${x(n - 1)},${padT + plotH} L ${x(0)},${padT + plotH} Z`;

  return (
    <svg
      className="cc-area"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Évolution du solde"
    >
      <defs>
        <linearGradient id="cc-area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b4513" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#8b4513" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (max / ticks) * i;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="#eee3d6" strokeWidth={1} />
            <text x={padL - 8} y={yy + 4} textAnchor="end" className="cc-axis">{kLabel(v)}</text>
          </g>
        );
      })}

      <path d={area} fill="url(#cc-area-fill)" />
      <path d={line} fill="none" stroke="#8b4513" strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={3} fill="#8b4513" />
      ))}
      {labels.map((lab, i) => (
        <text key={lab} x={x(i)} y={H - 12} textAnchor="middle" className="cc-axis">{lab}</text>
      ))}
    </svg>
  );
}

/* ==========================================================================
   Mini barres (récapitulatif) — barre horizontale relative à un max
   ========================================================================== */
export function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <span className="cc-minibar" title={formatNombre(value)}>
      <span className="cc-minibar__fill" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}