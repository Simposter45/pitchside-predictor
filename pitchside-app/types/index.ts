export interface Team {
  f: string; // flag emoji
  n: string; // name
  r: number | null; // FIFA rank
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface User {
  name: string;
  nick: string;
  insta: string;
  email: string;
  phone: string;
}

export interface KnockoutMatchup {
  id: string;
  label: string;
  team1: string;
  team2: string;
  flag1: string;
  flag2: string;
  date?: string;
}

export interface PredictionState {
  user: User | null;
  groupPicks: Record<string, string[]>; // groupName -> [winner, runnerup, third]
  thirdPicks: string[];                 // 8 chosen third-place teams
  r32Picks: Record<string, string>; // matchId -> teamName
  r16Picks: Record<string, string>;
  qfPicks: Record<string, string>;
  sfPicks: Record<string, string>;
  finalPick: string | null;
  entryTime: string | null;
  submitted: boolean;
  fingerprint: string | null; // FingerprintJS visitor ID
}

export interface SubmitPayload {
  user: User;
  groupPicks: Record<string, string[]>;
  thirdPicks: string[];
  r32Picks: Record<string, string>;
  r16Picks: Record<string, string>;
  qfPicks: Record<string, string>;
  sfPicks: Record<string, string>;
  finalPick: string;
  entryTime: string;
  fingerprint: string | null;
}
