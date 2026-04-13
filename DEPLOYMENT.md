# 🚀 CEAM VR Lab Dashboard - Deployment Guide

## Quick Start Deployment

This guide covers deploying the CEAM VR Lab Dashboard to Cloudflare Pages.

---

## Prerequisites

✅ Node.js 16+ installed locally  
✅ GitHub account  
✅ Cloudflare account  
✅ Repository: `https://github.com/ImMrHh/react-dashboard`

---

## Step 1: Prepare Repository

### Clone or Create Repository
```bash
# If starting fresh:
git clone https://github.com/ImMrHh/react-dashboard
cd react-dashboard

# Or initialize new repo:
git init
git remote add origin https://github.com/ImMrHh/react-dashboard
```

### Add All Project Files
Copy the entire `vr-lab-dashboard/` folder contents to the repository root:

```
react-dashboard/
├── src/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── .gitignore
```

### Install Dependencies
```bash
npm install
```

### Verify Builds Locally
```bash
npm run build
npm run preview
```

### Push to GitHub
```bash
git add .
git commit -m "Initial commit: CEAM VR Lab Dashboard"
git branch -M main
git push -u origin main
```

---

## Step 2: Configure Cloudflare Pages

### Connect GitHub to Cloudflare Pages

1. **Log in to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com
   - Navigate to **Pages**

2. **Create New Project**
   - Click **Create a project**
   - Select **Connect to Git**
   - Choose **GitHub**
   - Authorize Cloudflare access to your GitHub account

3. **Select Repository**
   - Find and select: `ImMrHh/react-dashboard`
   - Click **Begin setup**

### Configure Build Settings

4. **Build Configuration**
   - **Project name**: `ceam-vr-lab` (or similar)
   - **Production branch**: `main`
   - **Build command**: 
     ```
     npm install && npm run build
     ```
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)

5. **Environment Variables** (if needed)
   - Leave empty for this project (tokens are handled client-side)

6. **Deploy**
   - Click **Save and Deploy**
   - Wait for initial build to complete (2-5 minutes)

---

## Step 3: Verify Deployment

### Check Deployment Status
1. Go to **Pages** → **ceam-vr-lab**
2. View **Deployments** tab
3. Most recent should show ✅ **Success**

### Access Your Dashboard
- **URL**: `https://ceam-vr-lab.pages.dev`
- Test PIN login with valid credentials
- Verify all tabs load correctly

### Custom Domain (Optional)
1. In Pages project settings
2. Click **Custom domains**
3. Add your custom domain (e.g., `vr-lab.ceam.edu.mx`)
4. Configure DNS records as shown

---

## Step 4: Continuous Deployment Setup

### Automatic Deployments

Every push to `main` branch automatically triggers:
1. ✅ GitHub receives push
2. ✅ Cloudflare detects change
3. ✅ Build starts automatically
4. ✅ Tests run
5. ✅ Deploy to production

### Monitor Deployments

```bash
# View deployment logs in Cloudflare Dashboard:
# Pages → ceam-vr-lab → Deployments → [Build] → View Build Log
```

### Rollback Deployment

If needed to revert:
1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **Rollback** button
4. Confirm

---

## Step 5: Security & Environment

### API Endpoints
The dashboard connects to:
- Auth: `https://vr-lab-auth.6z5fznmp4m.workers.dev/auth`
- Data: `https://vr-lab-auth.6z5fznmp4m.workers.dev/data`

These endpoints should be HTTPS in production.

### CORS Configuration
If CORS issues occur, verify Cloudflare Worker has:
```javascript
// In Worker script
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}
```

### Sensitive Data
- ✅ PINs never logged
- ✅ Tokens in `sessionStorage` only
- ✅ Clear console logs in production
- ✅ Use HTTPS everywhere

---

## Development Workflow

### Local Development
```bash
npm run dev
# Opens http://localhost:3000
```

### Before Pushing
```bash
npm run build
npm run preview
# Test the built version locally
```

### Making Changes
```bash
# Create feature branch (optional)
git checkout -b feature/analytics-improvement

# Make changes and test
npm run dev
npm run build

# Commit and push
git add .
git commit -m "Add analytics improvements"
git push origin main  # or feature branch
```

### Testing Cycle
1. Develop locally with `npm run dev`
2. Build with `npm run build`
3. Preview with `npm run preview`
4. Push to GitHub
5. Monitor Cloudflare build
6. Test live at: https://ceam-vr-lab.pages.dev

---

## Troubleshooting

### Build Fails
**Error**: "npm: command not found"
- **Solution**: Cloudflare uses Node 16+ by default. Check build log.

**Error**: "Vite: module not found"
- **Solution**: Run `npm install` before build. Check `package.json` dependencies.

### Site Won't Load
**Error**: "404 Not Found"
- **Solution**: Verify `dist/` folder exists and `index.html` is present.
- **Check**: Build command output in logs

**Error**: "CORS error from API"
- **Solution**: Verify Cloudflare Worker CORS headers
- **Contact**: Check API endpoint status

### Dashboard Loads But No Data
**Error**: "No data in dashboard"
- **Possible causes**:
  - Invalid PIN
  - Incorrect API endpoint
  - Cloudflare Worker down
- **Solution**: Check browser console (F12) for error messages

### Styling Issues
**Error**: "Tailwind CSS not applied"
- **Solution**: Tailwind build included in Vite. Check `npm run build` output.
- **Verify**: `dist/` contains `index.html` with compiled CSS

---

## Performance Optimization

### Current Setup
- ✅ Vite for fast builds
- ✅ Recharts for optimized charts
- ✅ Tailwind for minimal CSS
- ✅ CDN delivery via Cloudflare

### Monitor Performance
1. **Cloudflare Dashboard** → **Analytics**
2. Check:
   - Page load times
   - Cache hit ratio
   - Error rates

### Speed Tips
- Minimize chart data points
- Use pagination for large tables
- Enable Cloudflare cache rules
- Compress images (if added)

---

## Maintenance

### Regular Tasks

**Weekly**
- Monitor Cloudflare Analytics
- Check error logs
- Verify API responsiveness

**Monthly**
- Review performance metrics
- Update dependencies: `npm update`
- Test all features

**Quarterly**
- Major version updates
- Security audit
- Feature reviews

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Major updates (use with caution)
npm install react@latest
npm run build
npm run preview
# Test thoroughly before pushing
```

### Logs & Monitoring

**Cloudflare Pages Logs**
```
Dashboard → Pages → ceam-vr-lab → Deployments → [Build] → Logs
```

**Real User Monitoring (RUM)**
```
Dashboard → Pages → ceam-vr-lab → Analytics
```

---

## Rollback Procedure

If something breaks:

```bash
# Option 1: Use Cloudflare UI
# 1. Go to Deployments
# 2. Click "Rollback" on previous working version
# 3. Confirm

# Option 2: Via Git
git revert HEAD  # Reverts last commit
git push origin main  # Triggers new deploy
```

---

## Custom Domain Setup

### Option A: Use Cloudflare DNS

1. In Cloudflare Pages project
2. **Custom Domains** → **Add Custom Domain**
3. Enter: `dashboard.ceam.edu.mx`
4. Add CNAME record to your DNS:
   ```
   Name: dashboard
   Type: CNAME
   Value: ceam-vr-lab.pages.dev
   TTL: 3600
   ```

### Option B: External DNS Provider

1. In Cloudflare Pages: **Custom Domains** → Add domain
2. In your DNS provider add:
   ```
   Host: dashboard
   Type: CNAME
   Value: ceam-vr-lab.pages.dev
   ```

---

## Backup & Disaster Recovery

### Code Backup
- ✅ Automatic via GitHub (distributed version control)
- ✅ All commits preserved in repository history

### Database Backup
Not applicable (all data fetched from API)

### Configuration Backup
Store in secure location:
- API endpoints
- PIN credentials
- Cloudflare Worker code

---

## Support & Resources

### Documentation
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Contact
- 🔧 Developer: See repository
- 📧 CEAM Support: [contact info]
- 🐛 Report Issues: GitHub Issues

---

## Success Checklist

After deployment, verify:

- [ ] Dashboard loads at `ceam-vr-lab.pages.dev`
- [ ] PIN login works correctly
- [ ] All 6 tabs render data properly
- [ ] Charts display correctly
- [ ] Filters work as expected
- [ ] API calls succeed (check Network tab)
- [ ] No console errors (F12)
- [ ] Mobile/iPad view works
- [ ] Logout clears session
- [ ] Performance is acceptable (<3s load time)

---

## FAQ

**Q: How often does it update?**  
A: Automatic redeploy on every git push to main branch. Data refreshes when page loads.

**Q: Can I have multiple environments?**  
A: Yes! Create branches like `staging` and `production` with different Cloudflare projects.

**Q: What if the API goes down?**  
A: Dashboard will show error. Contact Cloudflare Worker team.

**Q: Can I test locally first?**  
A: Yes! Use `npm run dev` for local development with hot reload.

**Q: Is my data secure?**  
A: Yes. HTTPS only, tokens in sessionStorage, no external logging.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Ready for Production
