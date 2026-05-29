import { createClient } from '@supabase/supabase-js'

const SB_URL = 'https://qtunqfselgbxypfimzwe.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dW5xZnNlbGdieHlwZmltendlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTEyODcsImV4cCI6MjA5MDgyNzI4N30.7B7nfAeTM50xRCe0vqB6SGo-YolikHQNcqVq0vpMPck'

export const supabase = createClient(SB_URL, SB_KEY)
