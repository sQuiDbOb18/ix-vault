"use client";

export function Sparkline({ data, color, width, height }: { data: number[]; color: string; width: number; height: number }) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const normalized = (value - min) / range;
    const y = height - normalized * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const linePath = points.reduce<string[]>((acc, point, index) => {
    const [x, y] = point.split(",").map(Number);
    if (index === 0) return [`M ${x.toFixed(2)} ${y.toFixed(2)}`];

    const previous = acc[acc.length - 1] ?? "";
    const prevPoint = previous.replace(/^M\s*/, "").split(" ").map(Number);
    const prevX = prevPoint[0];
    const prevY = prevPoint[1];
    const controlX = (prevX + x) / 2;
    const controlY = (prevY + y) / 2;

    acc.push(`Q ${controlX.toFixed(2)} ${prevY.toFixed(2)} ${(prevX + x) / 2} ${(prevY + y) / 2}`);
    acc.push(`T ${x.toFixed(2)} ${y.toFixed(2)}`);
    return acc;
  }, []);

  const fillPath = `${linePath.join(" ")} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, "")})`} />
      <path d={linePath.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
