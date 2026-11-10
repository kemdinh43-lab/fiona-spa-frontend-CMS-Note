import { useSiteContent } from "../hooks/useSiteContent";
import { formatVnd } from "../utils/formatCurrency";

interface PriceTextProps {
  priceVnd: number;
  priceUsd?: number;
  originalPriceVnd?: number;
  priceFromVnd?: number;
  priceFromUsd?: number;
  compact?: boolean;
}

function formatUsd(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} USD`;
}

export function PriceText({
  priceVnd,
  priceUsd,
  originalPriceVnd,
  priceFromVnd,
  priceFromUsd,
  compact = false
}: PriceTextProps) {
  const { t } = useSiteContent();
  const hasFromPrice = priceFromVnd !== undefined || priceFromUsd !== undefined;
  const displayedPriceVnd = priceFromVnd ?? priceVnd;
  const displayedPriceUsd = priceFromUsd ?? priceUsd;

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {!hasFromPrice && originalPriceVnd ? (
        <p className="text-sm font-semibold text-taupe line-through">
          {formatVnd(originalPriceVnd)}
        </p>
      ) : null}
      <p className="text-xl font-bold text-terracotta">
        {hasFromPrice
          ? t("common.priceFromVnd", "From {price}", {
              price: formatVnd(displayedPriceVnd)
            })
          : formatVnd(priceVnd)}
      </p>
      <p className="text-xs font-semibold text-taupe">
        {hasFromPrice
          ? displayedPriceUsd
            ? t("common.priceFromUsd", "From {price}", {
                price: formatUsd(displayedPriceUsd)
              })
            : null
          : displayedPriceUsd
            ? formatUsd(displayedPriceUsd)
            : null}
      </p>
    </div>
  );
}
