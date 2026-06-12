import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lrvoozapyzupkduwvsrt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxydm9vemFweXp1cGtkdXd2c3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTExMTI0OCwiZXhwIjoyMDk2Njg3MjQ4fQ.KnSMObJdSEnkt-MuA6KPSahD1tqV2eQTPfx2-SLLKus';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('pitchside_entries').select('id, nick, email, created_at');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
