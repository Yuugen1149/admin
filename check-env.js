/**
 * Environment Variables Checker
 * Run this to verify your Supabase configuration
 * 
 * Usage: node check-env.js
 */

console.log('🔍 Checking Environment Variables...\n');

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

let allPresent = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
        allPresent = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
    console.log('✅ All required environment variables are set!');
    console.log('\n📝 Next steps:');
    console.log('1. Ensure these same variables are set in Vercel');
    console.log('2. Go to: Vercel Dashboard → Settings → Environment Variables');
    console.log('3. Add both variables for Production, Preview, and Development');
    console.log('4. Redeploy your application');
} else {
    console.log('❌ Missing environment variables!');
    console.log('\n📝 To fix:');
    console.log('1. Create/edit .env.local file in the root directory');
    console.log('2. Add the following lines:');
    console.log('');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key');
    console.log('');
    console.log('3. Get these values from: Supabase Dashboard → Settings → API');
    console.log('4. Restart your dev server: npm run dev');
}

console.log('='.repeat(50) + '\n');
