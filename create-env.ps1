# PowerShell script to create .env file with MongoDB credentials

$envContent = @"
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# MongoDB Atlas credentials
DB_USER=ishimwediane400
DB_PASS=dbUserPassword
DB_NAME=Academy
"@

$envPath = Join-Path $PSScriptRoot ".env"

# Write the .env file
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "✅ .env file created/updated successfully!" -ForegroundColor Green
Write-Host "📁 Location: $envPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Content written:" -ForegroundColor Yellow
Write-Host $envContent
Write-Host ""
Write-Host "Now test the connection with: node test-db-connection.js" -ForegroundColor Green




$envContent = @"
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# MongoDB Atlas credentials
DB_USER=ishimwediane400
DB_PASS=dbUserPassword
DB_NAME=Academy
"@

$envPath = Join-Path $PSScriptRoot ".env"

# Write the .env file
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "✅ .env file created/updated successfully!" -ForegroundColor Green
Write-Host "📁 Location: $envPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Content written:" -ForegroundColor Yellow
Write-Host $envContent
Write-Host ""
Write-Host "Now test the connection with: node test-db-connection.js" -ForegroundColor Green




$envContent = @"
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# MongoDB Atlas credentials
DB_USER=ishimwediane400
DB_PASS=dbUserPassword
DB_NAME=Academy
"@

$envPath = Join-Path $PSScriptRoot ".env"

# Write the .env file
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "✅ .env file created/updated successfully!" -ForegroundColor Green
Write-Host "📁 Location: $envPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Content written:" -ForegroundColor Yellow
Write-Host $envContent
Write-Host ""
Write-Host "Now test the connection with: node test-db-connection.js" -ForegroundColor Green










































