import logo from '../assets/brand/oraclepay-04-transparent.png';

/** Approved 04 lockup, shared by both themes. The viewBox trims transparent margin only. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="88 104 2000 513" width="180" height="46.17" role="img" aria-label="OraclePay" focusable="false">
      <image href={logo} width="2172" height="724" />
    </svg>
  );
}
