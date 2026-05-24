# Deployment Guide

## Production Checklist

Before deploying to production, ensure:

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] HTTPS enabled
- [ ] NEXTAUTH_SECRET generated
- [ ] DATABASE_URL points to production DB
- [ ] Email configuration ready (future feature)
- [ ] Monitoring/logging configured
- [ ] Security headers enabled
- [ ] Database migration tested in staging
- [ ] Load testing completed

## Vercel Deployment (Recommended)

### 1. Prerequisites

- GitHub account with repository
- Vercel account (free tier available)
- PostgreSQL database (managed service)

### 2. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the timesheet-app folder (if monorepo)

### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/timesheet_prod

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generated-secret>

# App
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Database Setup

**Option A: Vercel Postgres (Easiest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Create Postgres database
vercel postgres create
```

**Option B: External PostgreSQL**
- AWS RDS
- Railway
- Supabase
- DigitalOcean Managed Database
- Azure Database for PostgreSQL

### 5. Deploy

```bash
# Option 1: Automatic (GitHub push)
git push origin main
# Vercel auto-deploys

# Option 2: Manual
vercel --prod
```

### 6. Run Migrations

After first deployment:

```bash
# Via Vercel CLI
vercel env pull .env.local
npm run db:push

# OR SSH into production and run
npm run db:migrate
```

### 7. Seed Production Data (Optional)

```bash
# Create initial admin user
npm run db:seed
```

**Change default admin password immediately:**
1. Log in with `admin@example.com / Admin@123456`
2. Go to Settings
3. Change password

## Docker Deployment

For non-Vercel deployment:

### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build Image

```bash
docker build -t timesheet-app:latest .
```

### 3. Run Container

```bash
docker run -d \
  --name timesheet-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="..." \
  timesheet-app:latest
```

### 4. Production Considerations

- Use managed PostgreSQL (not SQLite)
- Configure reverse proxy (Nginx)
- Set up SSL/TLS certificates
- Enable security headers
- Configure logging
- Set up monitoring

## AWS Deployment (EC2/ECS)

### Using ECS (Recommended)

1. **Push image to ECR:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag timesheet-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/timesheet-app:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/timesheet-app:latest
```

2. **Create ECS task definition:**
```json
{
  "family": "timesheet-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "timesheet-app",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/timesheet-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:db-url"
        }
      ]
    }
  ]
}
```

3. **Create ECS service**
4. **Configure load balancer (ALB)**
5. **Set up auto-scaling**

## Google Cloud Run

```bash
# 1. Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/timesheet-app

# 2. Deploy
gcloud run deploy timesheet-app \
  --image gcr.io/PROJECT_ID/timesheet-app \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL="postgresql://...",NEXTAUTH_SECRET="..." \
  --allow-unauthenticated
```

## DigitalOcean App Platform

1. Connect GitHub repository
2. Configure:
   ```yaml
   databases:
   - name: postgres
     engine: PG
     version: "14"
   services:
   - name: timesheet-app
     build:
       source_dir: /
     envs:
     - key: DATABASE_URL
       scope: RUN_TIME
       value: ${databases[0].connection_details.connection_string}
     - key: NEXTAUTH_URL
       value: https://${app.live_url}
   ```

## Staging Environment

### Separate Staging Deployment

1. Create staging branch: `staging`
2. Deploy to staging URL: `staging.yourdomain.com`
3. Sync staging DB weekly from production

```bash
# Backup production DB
pg_dump postgresql://prod... > backup.sql

# Restore to staging
psql postgresql://staging... < backup.sql
```

### Environment Variables per Stage

```env
# .env.development
DATABASE_URL=postgresql://localhost/timesheet_dev

# .env.staging (Vercel Env Vars)
DATABASE_URL=postgresql://staging...
NEXTAUTH_URL=https://staging.yourdomain.com

# .env.production (Vercel Env Vars)
DATABASE_URL=postgresql://prod...
NEXTAUTH_URL=https://yourdomain.com
```

## Monitoring & Alerts

### Vercel Analytics

1. Enable in Vercel dashboard
2. Monitor:
   - Response times
   - Error rates
   - Build times

### Logging

**Option 1: Vercel Logs**
```bash
vercel logs --prod
```

**Option 2: External Logging (Sentry, LogRocket)**
```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring

- PostgreSQL logs
- Connection pool monitoring
- Query performance analysis
- Backup verification

## Scaling

### Horizontal Scaling

With Next.js on Vercel, automatic:
- Auto-scaling
- Load balancing
- Global CDN

### Database Scaling

1. **Read Replicas** (for reporting)
```prisma
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL") // Primary
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // For migrations
}
```

2. **Connection Pooling**
- Use PgBouncer
- Enable in managed DB settings
- Configure pool size

3. **Caching Layer**
```typescript
// Redis cache for frequently accessed data
import { redis } from '@/lib/redis';

export async function getCachedProjects() {
  const cached = await redis.get('projects');
  if (cached) return JSON.parse(cached);
  
  const projects = await prisma.project.findMany();
  await redis.setex('projects', 3600, JSON.stringify(projects));
  return projects;
}
```

## Backup & Recovery

### Automated Backups

1. **Enable in database provider:**
   - Daily automated backups
   - 7-day retention
   - Test restore monthly

2. **Manual Backup:**
```bash
pg_dump \
  postgresql://user:password@host:5432/timesheet_prod \
  > backup-$(date +%Y%m%d).sql

# Restore
psql postgresql://... < backup-20240115.sql
```

### Disaster Recovery Plan

1. Database failure → Restore from latest backup (< 24h RPO)
2. Application failure → Automatic re-deployment on Vercel
3. Data corruption → Restore from backup to point-in-time

## SSL/HTTPS

### Vercel (Automatic)
- Free SSL certificate via Let's Encrypt
- Auto-renewal
- HSTS headers enabled

### Custom Domain
1. Update DNS:
   ```dns
   yourdomain.com  CNAME  cname.vercel.sh
   ```
2. Configure in Vercel dashboard
3. Verify in 24-48 hours

## Security Hardening

### Production Checklist

- [ ] HTTPS enabled
- [ ] HSTS headers set
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation strict
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React)
- [ ] CSRF protection (NextAuth)
- [ ] Secrets in environment only
- [ ] Regular security updates
- [ ] Database encryption at rest
- [ ] Database encryption in transit
- [ ] Regular security audits

### Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

## Post-Deployment

### Verification

1. **Health Check:**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Functional Test:**
   - Log in with admin credentials
   - Create test timesheet
   - Verify calculations
   - Test approval workflow

3. **Performance Check:**
   - Page load time < 2s
   - API response < 500ms
   - Database query < 100ms

### First Week Monitoring

- Monitor error logs daily
- Check database performance
- Verify backup completion
- Review user feedback
- Monitor costs

## Rollback Procedure

```bash
# Revert to previous version
vercel rollback

# OR manually deploy specific commit
git checkout <commit-hash>
git push origin main
```

## Cost Optimization

### Vercel
- Free tier: 100 deployments/month
- Pro: $20/month per user
- Enterprise: Custom pricing

### Database
- Managed service (~$50-200/month)
- Backups included
- Multi-region replication (extra)

### Tips
- Use staging environment efficiently
- Enable caching
- Optimize images
- Monitor bandwidth usage

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Deployment Status**: Production-ready
