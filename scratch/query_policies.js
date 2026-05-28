const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function queryPolicies() {
  console.log("Querying policies...");
  
  // We can query pg_policies by calling a RPC or running SQL.
  // Wait! Do we have a SQL query function or can we try to read/write to service_calls to see the result?
  // Let's call the RPC get_all_profiles_for_admin to see if it works or if there are other RPCs.
  // Also, let's select from pg_policies. But standard users cannot select pg_policies if they aren't superusers.
  // Wait, let's just see if we can do an RPC or list tables.
  // Actually, we can run a select on service_calls to see what it returns.
  
  const { data, error } = await supabase
    .from('service_calls')
    .select('id, client_name, technician_name')
    .limit(5);
    
  if (error) {
    console.error("Error reading service_calls:", error);
  } else {
    console.log("Service calls sample:", data);
  }
}

queryPolicies();
