// PingUp Diamond Logo Icon
export default function PingUpLogo({ size = 28, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinejoin="round"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gem shape */}
      <polygon points="50,4 80,22 88,55 80,88 50,116 20,88 12,55 20,22" />
      {/* Horizontal middle band top line */}
      <line x1="12" y1="45" x2="88" y2="45" />
      {/* Horizontal middle band bottom line */}
      <line x1="20" y1="70" x2="80" y2="70" />
      {/* Left facet lines - top */}
      <line x1="20" y1="22" x2="12" y2="45" />
      {/* Right facet lines - top */}
      <line x1="80" y1="22" x2="88" y2="45" />
      {/* Inner top-left to center */}
      <line x1="20" y1="22" x2="50" y2="45" />
      {/* Inner top-right to center */}
      <line x1="80" y1="22" x2="50" y2="45" />
      {/* Center top to top peak */}
      <line x1="50" y1="4" x2="50" y2="45" />
      {/* Inner bottom-left */}
      <line x1="20" y1="70" x2="12" y2="55" />
      {/* Inner bottom-right */}
      <line x1="80" y1="70" x2="88" y2="55" />
      {/* Center bottom to bottom peak */}
      <line x1="50" y1="70" x2="50" y2="116" />
      {/* Bottom-left to base */}
      <line x1="20" y1="70" x2="50" y2="116" />
      {/* Bottom-right to base */}
      <line x1="80" y1="70" x2="50" y2="116" />
      {/* Middle vertical divider */}
      <line x1="50" y1="45" x2="50" y2="70" />
    </svg>
  );
}
