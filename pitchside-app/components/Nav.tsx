import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        PITCHSIDE<span>.</span>PREDICTOR
      </Link>
      <div className="nav-prize">🏆 iPhone 17 Pro Prize</div>
    </nav>
  );
}
