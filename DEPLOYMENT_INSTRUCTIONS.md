# Discord Bank Bot - Railway Deployment Instructions

## Quick Deployment Steps

### 1. Upload to GitHub
1. Delete all old files from your GitHub repository
2. Upload all files from this folder to your GitHub repository
3. Make sure to include the dice_assets folder and src folder with all subfiles

### 2. Deploy on Railway
1. Go to Railway.app and sign in
2. Create New Project → Deploy from GitHub repo
3. Select your repository
4. Railway will automatically start building

### 3. Add Environment Variable
1. After deployment starts, go to your Railway project dashboard
2. Go to Variables tab
3. Add a new variable:
   - Key: `DISCORD_TOKEN`
   - Value: Your Discord bot token

### 4. Wait for Deployment
Railway will automatically build and deploy your bot. The process takes 2-3 minutes.

## Bot Features
- Arabic economy bot with banking system
- Dice game with image generation
- Investment and trading commands
- Company system
- Daily rewards and salary system

## Support
If you encounter any issues, check the Railway logs in your project dashboard.
