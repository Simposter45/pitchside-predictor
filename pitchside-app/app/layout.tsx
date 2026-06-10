import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'PitchSide Predictor — Win an iPhone 17 Pro',
  description:
    'Predict every FIFA World Cup 2026 match winner from group stage to the final. The earliest correct prediction wins an iPhone 17 Pro. Free entry.',
  openGraph: {
    title: 'PitchSide Predictor — Win an iPhone 17 Pro',
    description:
      'Pick every WC 2026 winner. Earliest correct path wins. Free entry.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className="page-shell">{children}</div>
        <div className="pitch-watermark">PITCHSIDE TV</div>
      </body>
    </html>
  );
}
