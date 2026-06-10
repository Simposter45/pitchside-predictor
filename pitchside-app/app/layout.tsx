import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import FingerprintProvider from '@/components/FingerprintProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://pitchsidepredictor.com'),
  title: 'PitchSide Predictor — Free World Cup 2026 Bracket Predictor | Win iPhone 17 Pro',
  description:
    'Predict the full FIFA World Cup 2026 path for free. Pick every group winner and knockout match. Fastest correct prediction wins an iPhone 17 Pro. Enter now.',
  keywords: [
    'World Cup 2026 predictor', 'FIFA World Cup 2026 prediction game', 'World Cup 2026 bracket predictor', 
    'WC 2026 winner predictor', 'World Cup 2026 free predictor', 'FIFA 2026 bracket challenge', 
    'World Cup 2026 prediction contest', 'World Cup 2026 group stage predictor', 'World Cup 2026 giveaway', 
    'FIFA 2026 iPhone giveaway', 'World Cup prediction win prize', 'football prediction contest 2026', 
    'World Cup 2026 competition free entry', 'win iPhone World Cup 2026', 'World Cup 2026 contest', 
    'World Cup 2026 bracket challenge', 'FIFA 2026 knockout bracket', 'World Cup 2026 full bracket prediction', 
    'predict World Cup 2026 winner', 'World Cup 2026 path to the final', 'World Cup 2026 knockout predictor', 
    'who will win World Cup 2026', 'World Cup 2026 champion prediction', 'World Cup 2026 finalist prediction', 
    'World Cup 2026 group stage predictions', 'FIFA 2026 group winners prediction', 'World Cup 2026 group A predictions', 
    'World Cup 2026 group stage table predictor', 'predict group stage World Cup 2026', 'World Cup 2026 which teams advance', 
    '48 team World Cup 2026 predictor', 'will Argentina win World Cup 2026', 'will Brazil win World Cup 2026', 
    'will France win World Cup 2026', 'will England win World Cup 2026', 'will Germany win World Cup 2026', 
    'will Spain win World Cup 2026', 'Messi World Cup 2026 prediction', 'Ronaldo World Cup 2026 prediction', 
    'Mbappe World Cup 2026 prediction', 'Mexico vs South Africa prediction', 'USA vs Paraguay prediction', 
    'World Cup 2026 opening match prediction', 'World Cup 2026 quarter final predictions', 'World Cup 2026 semi final predictions', 
    'World Cup 2026 final prediction', 'World Cup 2026 MetLife Stadium final', 'football prediction game 2026', 
    'free football bracket predictor', 'soccer World Cup predictor 2026', 'football contest 2026 free', 
    'online World Cup predictor game', 'best World Cup 2026 prediction site', 'World Cup 2026 prediction website', 
    'FIFA 2026 prediction platform', 'World Cup sweepstake 2026', 'World Cup 2026 sweepstake generator', 
    'how to predict World Cup 2026 winner', 'who is going to win the 2026 World Cup', 'best team to win World Cup 2026', 
    'World Cup 2026 dark horse prediction', 'World Cup 2026 upset predictions', 'can USA win World Cup 2026', 
    'which country will win FIFA 2026', 'World Cup 2026 predictions expert', 'World Cup 2026 predictions today', 
    'World Cup 2026 latest predictions'
  ],
  openGraph: {
    title: 'PitchSide Predictor — Free World Cup 2026 Bracket Predictor',
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
        <FingerprintProvider />
        <Nav />
        <div className="page-shell">{children}</div>
        <div className="pitch-watermark">PITCHSIDE TV</div>
      </body>
    </html>
  );
}
