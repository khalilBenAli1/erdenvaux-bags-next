import type { Product } from '@/domain/types';
import { comparisonScale, comparisonBaseline } from '@/domain/comparison';
export function BagDrawing({ product, x }: { product: Product; x: number }) {
  const w = product.widthCm;
  const h = product.heightCm;
  const color = product.variants[0]!.hex;
  const y = comparisonBaseline - h * comparisonScale;
  const rounded =
    product.category === 'Shoulder' ||
    product.category === 'Crossbody' ||
    product.category === 'Weekender';
  const path =
    product.category === 'Top handle'
      ? `M ${w * 0.12} 0 H ${w * 0.88} L ${w} ${h * 0.17} L ${w * 0.93} ${h} H ${w * 0.07} L 0 ${h * 0.17} Z`
      : product.category === 'Bucket'
        ? `M 0 0 H ${w} L ${w * 0.82} ${h} H ${w * 0.18} Z`
        : product.category === 'Clutch'
          ? `M 0 0 H ${w} V ${h} H 0 Z`
          : `M 0 0 H ${w} V ${h} H 0 Z`;
  return (
    <g>
      <g transform={`translate(${x},${y}) scale(${comparisonScale})`}>
        <path
          d={`M ${w * 0.25} 0 V -2 Q ${w * 0.5} -12 ${w * 0.75} -2 V 0`}
          fill="none"
          stroke={color}
          strokeWidth=".8"
        />
        <g
          data-comparison-body={product.id}
          data-width-cm={w}
          data-height-cm={h}
          fill={color}
          stroke="var(--ink)"
          strokeWidth=".15"
        >
          {product.category === 'Satchel' ? (
            <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} />
          ) : rounded ? (
            <rect
              width={w}
              height={h}
              rx={product.category === 'Weekender' ? 4 : 2}
            />
          ) : (
            <path d={path} />
          )}
        </g>
        {product.category === 'Top handle' && (
          <path
            d={`M ${w * 0.5} 0 L ${w * 0.42} ${h} M ${w * 0.5} 0 L ${w * 0.58} ${h}`}
            stroke="#ffffff65"
            strokeWidth=".2"
            fill="none"
          />
        )}
        {product.category === 'Clutch' && (
          <path
            d={`M 0 0 L ${w * 0.5} ${h * 0.62} L ${w} 0`}
            fill="none"
            stroke="#ffffff75"
            strokeWidth=".2"
          />
        )}
      </g>
      <g fill="none" stroke="var(--muted)" strokeWidth=".8">
        <path
          d={`M ${x} ${comparisonBaseline + 10} v 6 h ${w * comparisonScale} v -6`}
        />
        <path d={`M ${x - 10} ${y} h -6 v ${h * comparisonScale} h 6`} />
      </g>
      <text
        x={x + (w * comparisonScale) / 2}
        y={comparisonBaseline + 34}
        textAnchor="middle"
        fill="var(--ink)"
        fontSize="12"
      >
        {w} cm
      </text>
      <text
        x={x - 26}
        y={y + (h * comparisonScale) / 2}
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="11"
        transform={`rotate(-90 ${x - 26} ${y + (h * comparisonScale) / 2})`}
      >
        {h} cm
      </text>
    </g>
  );
}
