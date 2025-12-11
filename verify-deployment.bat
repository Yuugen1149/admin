@echo off
echo ========================================
echo Vercel Deployment Setup Checker
echo ========================================
echo.

echo Checking local environment file...
if exist .env.local (
    echo [OK] .env.local file exists
    findstr "NEXT_PUBLIC_SUPABASE_URL" .env.local >nul
    if %errorlevel% equ 0 (
        echo [OK] NEXT_PUBLIC_SUPABASE_URL is set
    ) else (
        echo [ERROR] NEXT_PUBLIC_SUPABASE_URL is missing
    )
    
    findstr "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local >nul
    if %errorlevel% equ 0 (
        echo [OK] NEXT_PUBLIC_SUPABASE_ANON_KEY is set
    ) else (
        echo [ERROR] NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
    )
) else (
    echo [ERROR] .env.local file not found!
    echo.
    echo Please create .env.local with:
    echo NEXT_PUBLIC_SUPABASE_URL=your-url
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
)

echo.
echo ========================================
echo Git Status
echo ========================================
git status --short

echo.
echo ========================================
echo Next Steps for Vercel Deployment:
echo ========================================
echo 1. Ensure .env.local has Supabase credentials
echo 2. Go to Vercel Dashboard
echo 3. Settings -^> Environment Variables
echo 4. Add NEXT_PUBLIC_SUPABASE_URL
echo 5. Add NEXT_PUBLIC_SUPABASE_ANON_KEY
echo 6. Redeploy your application
echo.
echo Vercel Dashboard: https://vercel.com/dashboard
echo Supabase Dashboard: https://supabase.com/dashboard
echo ========================================
pause
