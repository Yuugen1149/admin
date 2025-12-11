# Vercel Deployment Setup Script
# This script helps you verify your deployment is configured correctly

Write-Host "🚀 Vercel Deployment Setup Checker" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Check if .env.local exists
Write-Host "📁 Checking local environment file..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    # Check if it has content
    $content = Get-Content .env.local -Raw
    if ($content -match "NEXT_PUBLIC_SUPABASE_URL") {
        Write-Host "✅ NEXT_PUBLIC_SUPABASE_URL is set" -ForegroundColor Green
    } else {
        Write-Host "❌ NEXT_PUBLIC_SUPABASE_URL is missing" -ForegroundColor Red
    }
    
    if ($content -match "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        Write-Host "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set" -ForegroundColor Green
    } else {
        Write-Host "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creating .env.local template..." -ForegroundColor Yellow
    
    $template = @"
# Supabase Configuration
# Get these values from: https://supabase.com/dashboard → Your Project → Settings → API

NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
"@
    
    Set-Content -Path .env.local -Value $template
    Write-Host "✅ Created .env.local template" -ForegroundColor Green
    Write-Host "📝 Please edit .env.local and add your Supabase credentials" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=" * 60
Write-Host ""

# Check Git status
Write-Host "📦 Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
} else {
    Write-Host "✅ All changes committed" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 60
Write-Host ""

# Vercel deployment checklist
Write-Host "📋 Vercel Deployment Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Local Setup:" -ForegroundColor Yellow
Write-Host "  [ ] .env.local file exists with Supabase credentials"
Write-Host "  [ ] npm run dev works locally"
Write-Host "  [ ] Login works at http://localhost:3000/login"
Write-Host ""
Write-Host "Supabase Setup:" -ForegroundColor Yellow
Write-Host "  [ ] Supabase project is active"
Write-Host "  [ ] Database tables exist (run supabase-schema.sql)"
Write-Host "  [ ] Users table has data (run insert-users.sql)"
Write-Host "  [ ] Row Level Security is configured or disabled"
Write-Host ""
Write-Host "Vercel Setup:" -ForegroundColor Yellow
Write-Host "  [ ] GitHub repository is up to date"
Write-Host "  [ ] Vercel project is connected to GitHub"
Write-Host "  [ ] Environment variables are set in Vercel:"
Write-Host "      - NEXT_PUBLIC_SUPABASE_URL"
Write-Host "      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "  [ ] Latest deployment is successful"
Write-Host ""
Write-Host "=" * 60
Write-Host ""

Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "  Supabase Dashboard: https://supabase.com/dashboard"
Write-Host "  Vercel Dashboard: https://vercel.com/dashboard"
Write-Host "  GitHub Repository: https://github.com/Yuugen1149/ADMIN"
Write-Host ""

Write-Host "📚 Next Steps:" -ForegroundColor Green
Write-Host "1. Ensure .env.local has correct Supabase credentials"
Write-Host "2. Test locally: npm run dev"
Write-Host "3. Push to GitHub: git push origin main"
Write-Host "4. Go to Vercel Dashboard"
Write-Host "5. Add environment variables (same as .env.local)"
Write-Host "6. Redeploy or wait for auto-deploy"
Write-Host "7. Test login on production URL"
Write-Host ""
Write-Host "=" * 60
