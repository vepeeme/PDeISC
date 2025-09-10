import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnplcertgjvycsvsbitl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucGxjZXJ0Z2p2eWNzdnNiaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTY5MzEsImV4cCI6MjA3MjMzMjkzMX0.SqmeXqWtLG1T_N9x-LMVNxdBvO8g5k5Z-Cm5y0AFSaQ';

export const supabase = createClient(supabaseUrl, supabaseKey);