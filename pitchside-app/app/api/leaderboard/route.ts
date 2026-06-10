import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Bracket Points Configuration
const POINTS = {
  R32: 10,
  R16: 20,
  QF: 40,
  SF: 80,
  FINALIST: 160,
  CHAMPION: 320,
};

// Helper to count matches in a round
const countMatches = (userPicks: any, officialPicks: any, pointsPerMatch: number) => {
  if (!userPicks || !officialPicks) return 0;
  let score = 0;
  // Official picks has the truth. For each match in official picks, see if user guessed the same winner.
  for (const matchId in officialPicks) {
    if (officialPicks[matchId] && userPicks[matchId] === officialPicks[matchId]) {
      score += pointsPerMatch;
    }
  }
  return score;
};

export async function GET() {
  try {
    // We only need the prediction fields to calculate score, and public info to display.
    // Exclude TESTER99 from public leaderboard
    const { data: entries, error } = await supabase
      .from('pitchside_entries')
      .select('id, nick, final_pick, r32_picks, r16_picks, qf_picks, sf_picks, submitted_at')
      .not('nick', 'ilike', 'TESTER99%');

    if (error) throw error;
    if (!entries) return NextResponse.json([]);

    // Find the master results entry
    const officialEntry = entries.find((e) => e.nick === 'OFFICIAL_RESULTS');

    // Score all entries
    const leaderboard = entries
      .filter((e) => e.nick !== 'OFFICIAL_RESULTS')
      .map((entry) => {
        let score = 0;

        if (officialEntry) {
          score += countMatches(entry.r32_picks, officialEntry.r32_picks, POINTS.R32);
          score += countMatches(entry.r16_picks, officialEntry.r16_picks, POINTS.R16);
          score += countMatches(entry.qf_picks, officialEntry.qf_picks, POINTS.QF);
          score += countMatches(entry.sf_picks, officialEntry.sf_picks, POINTS.SF);
          
          // Finalist check (the winners of the SF)
          // Wait, the finals picks are basically just checking if they picked the correct champion.
          if (entry.final_pick && officialEntry.final_pick && entry.final_pick === officialEntry.final_pick) {
            score += POINTS.CHAMPION;
          }

          // To check finalists, we look at the SF winners. 
          // officialEntry.sf_picks contains the two finalists.
          if (officialEntry.sf_picks) {
            const trueFinalists = Object.values(officialEntry.sf_picks);
            const userFinalists = Object.values(entry.sf_picks || {});
            
            // Give 160 pts for each correct finalist
            trueFinalists.forEach((tf) => {
              if (tf && userFinalists.includes(tf)) {
                score += POINTS.FINALIST;
              }
            });
          }
        }

        const sfWinners = Object.values(entry.sf_picks || {}) as string[];
        const runnerUp = sfWinners.find(team => team && team !== entry.final_pick) || null;

        return {
          id: entry.id,
          nick: entry.nick,
          champion: entry.final_pick,
          runnerUp,
          submittedAt: entry.submitted_at,
          score,
        };
      });

    // Sort by score DESC, then by earliest submitted_at ASC
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });

    // Add Rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json(rankedLeaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
