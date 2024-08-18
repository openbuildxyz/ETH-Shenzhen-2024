/**
 * @name 千分位分隔符
 */
export default function thousandsSeparator(
  value: number | string | bigint | undefined | null,
) {
  if (!value) return 0;
  return Number(value).toLocaleString("en-US");
}
