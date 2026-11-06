import logo from '../assets/brand/oraclepay-04-transparent.png';

/** Approved 04 artwork, with a smaller mark and unchanged wordmark scale in both themes. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 2000 513" width="180" height="46.17" role="img" aria-label="OraclePay" focusable="false">
      <svg x="0" y="85.5" width="360" height="342" viewBox="88 104 540 513" overflow="hidden" aria-hidden="true">
        <image href={logo} width="2172" height="724" />
      </svg>
      <svg x="440" y="0" width="1438" height="513" viewBox="650 104 1438 513" overflow="hidden" aria-hidden="true">
        <image href={logo} width="2172" height="724" />
      </svg>
    </svg>
  );
}
