import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="PitchSide TV" style={{ height: '28px', objectFit: 'contain' }} />
      </Link>
      <div className="nav-prize">🏆 iPhone 17 Pro Prize</div>
    </nav>
  );
}
