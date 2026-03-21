import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const logs = [];

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ikfuutfkrdjabmcvrcia.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZnV1dGZrcmRqYWJtY3ZyY2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNjk1ODEsImV4cCI6MjA4OTY0NTU4MX0.IJTvEV0qdOX1xL3avZer5ubf6p2WR8CwIOq_qM5d5-U';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyUsers = [
  { email: 'fizz@quickserve.com', role: 'waiter' }
];

async function setupUsers() {
  console.log('Generating dummy accounts via Supabase API...');
  
  for (const user of dummyUsers) {
    console.log(`\nCreating ${user.email} (Role: ${user.role})...`);
    
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: 'password123',
      options: {
        data: {
          name: user.role.charAt(0).toUpperCase() + user.role.slice(1), // e.g. "Waiter"
          role: user.role
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
         logs.push(`✅ ${user.email} already exists in authentication.`);
      } else {
         logs.push(`❌ Failed to create ${user.email}: ${error.message} - ${JSON.stringify(error)}`);
      }
    } else {
      logs.push(`✅ ${user.email} account successfully created!`);
    }
  }
  
  logs.push('\n🎉 ALL Dummy accounts completely registered!');
  fs.writeFileSync('output.json', JSON.stringify(logs, null, 2), 'utf8');
}

setupUsers();
