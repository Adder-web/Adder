import type { ScentBalance } from "../../api/perfumeApi";

type ScentRadarChartProps = {
  data: ScentBalance[];
};

export default function ScentRadarChart({ data }: ScentRadarChartProps) {
  const size = 320;
  const center = size / 2;
  const maxRadius = 108;
  const sides = data.length;

  const getPoint = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;
    const radius = (value / 100) * maxRadius;

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const getGridPoint = (index: number, radius: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const polygonPoints = data
    .map((item, index) => {
      const point = getPoint(index, item.value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="mx-auto h-[21.25rem] w-full max-w-[20rem]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full overflow-visible"
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const points = data
            .map((_, index) => {
              const point = getGridPoint(index, maxRadius * scale);
              return `${point.x},${point.y}`;
            })
            .join(" ");

          return (
            <polygon
              key={scale}
              points={points}
              fill="none"
              stroke="rgba(75,63,140,0.14)"
              strokeWidth="1"
            />
          );
        })}

        {data.map((_, index) => {
          const point = getGridPoint(index, maxRadius);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(75,63,140,0.1)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(139,125,235,0.42)"
          stroke="#8B7DEB"
          strokeWidth="2"
        />

        {data.map((item, index) => {
          const point = getPoint(index, item.value);
          const labelPoint = getGridPoint(index, maxRadius + 34);

          return (
            <g key={item.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#8B7DEB"
                strokeWidth="2"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#4B3F8C"
                fontSize="11"
                fontWeight="700"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
