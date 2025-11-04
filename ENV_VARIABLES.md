# Environment Variables Reference

This document explains all available environment variables for IremeCorner Academy backend.

## Required Variables (Must Set)

### Server Configuration
- `PORT` - Server port number (default: 5001)
- `NODE_ENV` - Environment: `development`, `production`, or `test`

### Database
- `DB_USER` - MongoDB Atlas database username (required)
- `DB_PASS` - MongoDB Atlas database password (required)
- `DB_NAME` - Database name (default: `Academy`)

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED - use strong random string)
- `JWT_EXPIRE` - Token expiration time (default: `7d`)

### Frontend
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:3000`)

## Optional Variables (Highly Recommended)

### File Upload
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 100MB)
- `UPLOAD_PATH` - Upload directory path (default: `./uploads`)
- `ALLOWED_FILE_TYPES` - Comma-separated allowed file extensions
- `MAX_VIDEO_SIZE` - Maximum video file size in bytes

### Email Notifications
- `ENABLE_EMAIL` - Enable email functionality (`true`/`false`)
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER` - Email account username
- `EMAIL_PASS` - Email account password/app password
- `EMAIL_FROM` - Sender email address
- `EMAIL_FROM_NAME` - Sender display name
- `PASSWORD_RESET_URL` - URL for password reset links

### Site Configuration
- `SITE_NAME` - Site name (default: "IremeCorner Academy")
- `SITE_URL` - Base site URL
- `ADMIN_EMAIL` - Admin contact email

### Security
- `PASSWORD_RESET_EXPIRE` - Password reset token expiration in minutes (default: 10)

## Optional Advanced Variables

### Performance
- `USE_REDIS` - Enable Redis caching
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `CACHE_TTL` - Cache time-to-live in seconds

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Logging
- `LOG_LEVEL` - Log level: `error`, `warn`, `info`, `debug`
- `ENABLE_FILE_LOGGING` - Enable file-based logging
- `LOG_FILE_PATH` - Path to log file

### Cloud Storage (AWS S3)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket name
- `USE_CLOUD_STORAGE` - Enable cloud storage

### AI Assistant
- `OPENAI_API_KEY` - OpenAI API key for enhanced AI features
- `ENABLE_AI_ASSISTANT` - Enable AI assistant

### Certificates
- `CERTIFICATE_TEMPLATE_PATH` - Path to certificate template
- `CERTIFICATE_STORAGE_PATH` - Path to store certificates

### Production
- `TRUST_PROXY` - Trust proxy headers (for load balancers)
- `MAINTENANCE_MODE` - Enable maintenance mode
- `HOST` - Server host address

## Quick Setup

### Minimum Required `.env` File:

```env
PORT=5001
NODE_ENV=development
# MongoDB Atlas credentials
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Recommended `.env` File:

```env
# Server
PORT=5001
NODE_ENV=development
HOST=localhost

# Database - MongoDB Atlas Cluster (REQUIRED)
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy

# Auth
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
PASSWORD_RESET_EXPIRE=10

# Frontend
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpeg,jpg,png,gif,pdf,doc,docx,ppt,pptx,mp4,webm,mov
MAX_VIDEO_SIZE=524288000

# Email (Optional)
ENABLE_EMAIL=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@iremecorner.com

# Site
SITE_NAME=IremeCorner Academy
SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@iremecorner.com

# Security
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Logging
LOG_LEVEL=info
```

## Generating Secure Secrets

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Session Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Environment-Specific Examples

### Development
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
TRUST_PROXY=true
ENABLE_SECURITY_HEADERS=true
```

### Testing
```env
NODE_ENV=test
# Use test database credentials
DB_USER=test_user
DB_PASS=test_password
DB_NAME=Academy_test
```

## Notes

- Never commit `.env` file to version control
- Use different secrets for each environment
- In production, use strong, randomly generated secrets
- Keep sensitive credentials secure
- Use environment-specific `.env` files (`.env.development`, `.env.production`)


This document explains all available environment variables for IremeCorner Academy backend.

## Required Variables (Must Set)

### Server Configuration
- `PORT` - Server port number (default: 5001)
- `NODE_ENV` - Environment: `development`, `production`, or `test`

### Database
- `DB_USER` - MongoDB Atlas database username (required)
- `DB_PASS` - MongoDB Atlas database password (required)
- `DB_NAME` - Database name (default: `Academy`)

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED - use strong random string)
- `JWT_EXPIRE` - Token expiration time (default: `7d`)

### Frontend
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:3000`)

## Optional Variables (Highly Recommended)

### File Upload
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 100MB)
- `UPLOAD_PATH` - Upload directory path (default: `./uploads`)
- `ALLOWED_FILE_TYPES` - Comma-separated allowed file extensions
- `MAX_VIDEO_SIZE` - Maximum video file size in bytes

### Email Notifications
- `ENABLE_EMAIL` - Enable email functionality (`true`/`false`)
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER` - Email account username
- `EMAIL_PASS` - Email account password/app password
- `EMAIL_FROM` - Sender email address
- `EMAIL_FROM_NAME` - Sender display name
- `PASSWORD_RESET_URL` - URL for password reset links

### Site Configuration
- `SITE_NAME` - Site name (default: "IremeCorner Academy")
- `SITE_URL` - Base site URL
- `ADMIN_EMAIL` - Admin contact email

### Security
- `PASSWORD_RESET_EXPIRE` - Password reset token expiration in minutes (default: 10)

## Optional Advanced Variables

### Performance
- `USE_REDIS` - Enable Redis caching
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `CACHE_TTL` - Cache time-to-live in seconds

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Logging
- `LOG_LEVEL` - Log level: `error`, `warn`, `info`, `debug`
- `ENABLE_FILE_LOGGING` - Enable file-based logging
- `LOG_FILE_PATH` - Path to log file

### Cloud Storage (AWS S3)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket name
- `USE_CLOUD_STORAGE` - Enable cloud storage

### AI Assistant
- `OPENAI_API_KEY` - OpenAI API key for enhanced AI features
- `ENABLE_AI_ASSISTANT` - Enable AI assistant

### Certificates
- `CERTIFICATE_TEMPLATE_PATH` - Path to certificate template
- `CERTIFICATE_STORAGE_PATH` - Path to store certificates

### Production
- `TRUST_PROXY` - Trust proxy headers (for load balancers)
- `MAINTENANCE_MODE` - Enable maintenance mode
- `HOST` - Server host address

## Quick Setup

### Minimum Required `.env` File:

```env
PORT=5001
NODE_ENV=development
# MongoDB Atlas credentials
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Recommended `.env` File:

```env
# Server
PORT=5001
NODE_ENV=development
HOST=localhost

# Database - MongoDB Atlas Cluster (REQUIRED)
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy

# Auth
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
PASSWORD_RESET_EXPIRE=10

# Frontend
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpeg,jpg,png,gif,pdf,doc,docx,ppt,pptx,mp4,webm,mov
MAX_VIDEO_SIZE=524288000

# Email (Optional)
ENABLE_EMAIL=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@iremecorner.com

# Site
SITE_NAME=IremeCorner Academy
SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@iremecorner.com

# Security
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Logging
LOG_LEVEL=info
```

## Generating Secure Secrets

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Session Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Environment-Specific Examples

### Development
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
TRUST_PROXY=true
ENABLE_SECURITY_HEADERS=true
```

### Testing
```env
NODE_ENV=test
# Use test database credentials
DB_USER=test_user
DB_PASS=test_password
DB_NAME=Academy_test
```

## Notes

- Never commit `.env` file to version control
- Use different secrets for each environment
- In production, use strong, randomly generated secrets
- Keep sensitive credentials secure
- Use environment-specific `.env` files (`.env.development`, `.env.production`)


This document explains all available environment variables for IremeCorner Academy backend.

## Required Variables (Must Set)

### Server Configuration
- `PORT` - Server port number (default: 5001)
- `NODE_ENV` - Environment: `development`, `production`, or `test`

### Database
- `DB_USER` - MongoDB Atlas database username (required)
- `DB_PASS` - MongoDB Atlas database password (required)
- `DB_NAME` - Database name (default: `Academy`)

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED - use strong random string)
- `JWT_EXPIRE` - Token expiration time (default: `7d`)

### Frontend
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:3000`)

## Optional Variables (Highly Recommended)

### File Upload
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 100MB)
- `UPLOAD_PATH` - Upload directory path (default: `./uploads`)
- `ALLOWED_FILE_TYPES` - Comma-separated allowed file extensions
- `MAX_VIDEO_SIZE` - Maximum video file size in bytes

### Email Notifications
- `ENABLE_EMAIL` - Enable email functionality (`true`/`false`)
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER` - Email account username
- `EMAIL_PASS` - Email account password/app password
- `EMAIL_FROM` - Sender email address
- `EMAIL_FROM_NAME` - Sender display name
- `PASSWORD_RESET_URL` - URL for password reset links

### Site Configuration
- `SITE_NAME` - Site name (default: "IremeCorner Academy")
- `SITE_URL` - Base site URL
- `ADMIN_EMAIL` - Admin contact email

### Security
- `PASSWORD_RESET_EXPIRE` - Password reset token expiration in minutes (default: 10)

## Optional Advanced Variables

### Performance
- `USE_REDIS` - Enable Redis caching
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `CACHE_TTL` - Cache time-to-live in seconds

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Logging
- `LOG_LEVEL` - Log level: `error`, `warn`, `info`, `debug`
- `ENABLE_FILE_LOGGING` - Enable file-based logging
- `LOG_FILE_PATH` - Path to log file

### Cloud Storage (AWS S3)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket name
- `USE_CLOUD_STORAGE` - Enable cloud storage

### AI Assistant
- `OPENAI_API_KEY` - OpenAI API key for enhanced AI features
- `ENABLE_AI_ASSISTANT` - Enable AI assistant

### Certificates
- `CERTIFICATE_TEMPLATE_PATH` - Path to certificate template
- `CERTIFICATE_STORAGE_PATH` - Path to store certificates

### Production
- `TRUST_PROXY` - Trust proxy headers (for load balancers)
- `MAINTENANCE_MODE` - Enable maintenance mode
- `HOST` - Server host address

## Quick Setup

### Minimum Required `.env` File:

```env
PORT=5001
NODE_ENV=development
# MongoDB Atlas credentials
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Recommended `.env` File:

```env
# Server
PORT=5001
NODE_ENV=development
HOST=localhost

# Database - MongoDB Atlas Cluster (REQUIRED)
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy

# Auth
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
PASSWORD_RESET_EXPIRE=10

# Frontend
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpeg,jpg,png,gif,pdf,doc,docx,ppt,pptx,mp4,webm,mov
MAX_VIDEO_SIZE=524288000

# Email (Optional)
ENABLE_EMAIL=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@iremecorner.com

# Site
SITE_NAME=IremeCorner Academy
SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@iremecorner.com

# Security
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Logging
LOG_LEVEL=info
```

## Generating Secure Secrets

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Session Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Environment-Specific Examples

### Development
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
TRUST_PROXY=true
ENABLE_SECURITY_HEADERS=true
```

### Testing
```env
NODE_ENV=test
# Use test database credentials
DB_USER=test_user
DB_PASS=test_password
DB_NAME=Academy_test
```

## Notes

- Never commit `.env` file to version control
- Use different secrets for each environment
- In production, use strong, randomly generated secrets
- Keep sensitive credentials secure
- Use environment-specific `.env` files (`.env.development`, `.env.production`)

