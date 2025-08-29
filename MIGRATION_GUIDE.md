# 🚀 Complete Railway Migration Guide

> **Step-by-Step Guide to Deploy Your Discord Bank Bot on Railway**

## 🎯 What You'll Achieve

✅ **24/7 Bot Hosting** - No more keeping your computer on!  
✅ **All Original Commands** - Every feature from your GitHub repo  
✅ **Enhanced Dice Command** - Beautiful visual dice battles  
✅ **Automatic Deployments** - Push to GitHub = Auto-deploy  
✅ **Free Hosting** - Railway's generous free tier  

---

## 📋 Pre-Migration Checklist

### 🔑 Required Information
- [ ] Discord Bot Token
- [ ] Discord Bot Client ID (Application ID)
- [ ] Channel ID where bot should work (optional)
- [ ] GitHub account
- [ ] Railway account (free sign-up)

### 🔍 Get Your Bot Info

#### Discord Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click your bot application
3. Go to "Bot" section
4. Click "Reset Token" → Copy the new token
5. **Save this token securely!**

#### Application ID (Client ID)
1. Same Developer Portal
2. Go to "General Information"
3. Copy "APPLICATION ID"
4. **Save this ID!**

#### Channel ID (Optional)
1. Enable Developer Mode in Discord
2. Right-click the channel where bot should work
3. Click "Copy Channel ID"
4. **Save this ID!**

---

## 🗃️ Step 1: Prepare Your Repository

### Option A: Fork This Repository (Recommended)

1. **Fork this repository** to your GitHub account
2. **Clone your fork** to your computer:
   ```bash
   git clone https://github.com/YOUR_USERNAME/discord-bank-bot-complete.git
   cd discord-bank-bot-complete
   ```

3. **Add your dice assets** (copy from your original project):
   ```bash
   # Copy your dice images to dice_assets/
   cp your_images/1.jpg dice_assets/
   cp your_images/2.jpg dice_assets/
   cp your_images/3.jpg dice_assets/
   cp your_images/4.jpg dice_assets/
   cp your_images/5.jpg dice_assets/
   cp your_images/6.jpg dice_assets/
   cp your_images/red_background_700x250.png dice_assets/
   ```

4. **Create config.js from template**:
   ```bash
   cp config.js.template config.js
   ```

5. **Edit config.js** with your specific settings (channel IDs, etc.)

6. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Added my bot configuration and assets"
   git push origin main
   ```

### Option B: Create New Repository

1. **Download this complete migration folder**
2. **Create new GitHub repository**:
   - Name: `discord-bank-bot-complete`
   - Visibility: Public (for Railway free tier)
   - Don't add README, .gitignore (we have our own)

3. **Upload all files** to your new repository
4. **Follow steps 3-6 from Option A**

---

## 🚂 Step 2: Deploy to Railway

### Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Deploy Your Bot
1. **Click "Deploy from GitHub repo"**
2. **Select your repository**: `discord-bank-bot-complete`
3. **Railway auto-detects**: Node.js project with Python support
4. **Click "Deploy"**

### Configure Environment Variables
1. **In Railway dashboard**, click your project
2. **Go to "Variables" tab**
3. **Add these variables**:

   | Variable Name | Value | Required |
   |---------------|-------|----------|
   | `DISCORD_TOKEN` | Your bot token | ✅ Required |
   | `ALLOWED_CHANNEL_ID` | Your channel ID | ⚠️ Optional |
   | `NODE_ENV` | `production` | ⚠️ Optional |

4. **Click "Save"** - Railway will auto-redeploy!

---

## ✅ Step 3: Test Your Deployment

### Check Railway Logs
1. **Go to Railway dashboard** → Your project
2. **Click "Deployments"** → Latest deployment
3. **Look for success indicators**:
   ```
   ✅ Loaded command: نرد
   ✅ Loaded command: راتب
   ✅ Loaded command: فلوسي
   🤖 Bot is Ready! YourBot#1234!
   🚀 Enhanced with Railway hosting and improved dice command!
   ```

### Test in Discord
1. **Go to your Discord server**
2. **Try these commands**:
   - `راتب` (salary)
   - `فلوسي` (balance)
   - `نرد` (dice - should generate beautiful image!)
   - `اوامر` (commands list)

### Verify Bot Status
- **Bot should appear online** in your server
- **Commands should respond** within seconds
- **Dice command should generate images** (or fallback to text)

---

## 🎯 Step 4: Enjoy 24/7 Hosting!

### 🎉 Congratulations! Your bot is now:
- **Running 24/7** on Railway cloud
- **Auto-deploying** when you push to GitHub
- **Enhanced** with visual dice battles
- **Monitoring** resource usage automatically

### 📊 Management Dashboard
- **Railway Dashboard**: Monitor uptime, logs, resource usage
- **GitHub Repository**: Make changes, auto-deploy
- **Discord Server**: Bot stays online 24/7

### 🔄 Making Updates
1. **Edit files locally** or on GitHub
2. **Commit and push** changes
3. **Railway auto-deploys** within 2-3 minutes
4. **Changes appear** in Discord immediately

---

## 🛠️ Troubleshooting Guide

### ❌ Bot Won't Start

**Check Railway Logs for errors:**

#### Error: "DISCORD_TOKEN is required"
- **Solution**: Add `DISCORD_TOKEN` in Railway variables
- **Verify**: Token is correct and not expired

#### Error: "Failed to login to Discord"
- **Solution**: Generate new token in Discord Developer Portal
- **Add**: New token to Railway environment variables

#### Error: Command loading failures
- **Solution**: Check file syntax in affected commands
- **Look**: For missing commas, brackets, or syntax errors

### ⚠️ نرد Command Issues

#### Images Not Generating
- **Expected**: Bot falls back to text mode automatically
- **Check**: Railway logs for Python errors
- **Verify**: All dice assets are in `dice_assets/` folder

#### "Python dice generator not found"
- **Solution**: Files are in wrong location
- **Fix**: Ensure `generate_improved_dice_image.py` is in root directory

### 🔇 Commands Not Responding

#### Bot Online But Ignoring Commands
- **Check**: `ALLOWED_CHANNEL_ID` in environment variables
- **Remove**: Variable if you want bot to work in all channels
- **Verify**: Bot has permission to read/send messages

#### Cooldown Messages
- **Normal**: Commands have cooldown periods (30s for نرد)
- **Wait**: For cooldown to expire
- **Check**: `config.js` cooldown settings if needed

### 📈 Performance Issues

#### Bot Slow or Timing Out
- **Check**: Railway resource usage
- **Upgrade**: To paid plan if hitting limits
- **Optimize**: Database queries if needed

#### High Memory Usage
- **Normal**: Image generation uses memory
- **Cleanup**: Temp images are auto-deleted after 1 minute
- **Monitor**: Railway dashboard for alerts

---

## 💡 Pro Tips

### 🔧 Optimization
- **Monitor Railway dashboard** for resource usage
- **Keep dice assets optimized** (smaller file sizes)
- **Enable cleanup** in dice command (already configured)

### 🔒 Security
- **Never share your bot token** publicly
- **Use environment variables** for all secrets
- **Regenerate token** if accidentally exposed

### 📊 Monitoring
- **Check logs regularly** for errors
- **Monitor bot uptime** in Discord
- **Watch Railway resource usage**

### 🚀 Scaling
- **Railway free tier**: 500 hours/month + $5 credit
- **Upgrade to Pro**: For unlimited usage
- **Multiple bots**: Deploy each as separate project

---

## 📞 Getting Help

### 🆘 If You're Still Stuck:

1. **Check Railway logs** first - most issues show up there
2. **Verify environment variables** are set correctly  
3. **Test locally** using `npm start` to isolate Railway issues
4. **Review this guide** - solution is usually here
5. **Contact support** - Railway has excellent documentation

### 📚 Useful Resources:
- [Railway Documentation](https://docs.railway.app/)
- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/)
- [Wick Studio Discord](https://discord.gg/wicks)

---

## 🎯 Success Checklist

- [ ] Bot appears online in Discord
- [ ] Commands respond correctly (`راتب`, `فلوسي`, etc.)
- [ ] Enhanced `نرد` command generates images
- [ ] Railway logs show successful startup
- [ ] No error messages in console
- [ ] Bot has been running for 24+ hours
- [ ] Auto-deployment works when pushing to GitHub

---

**🎉 Congratulations! Your Discord Bank Bot is now running 24/7 on Railway with enhanced features!**

*Need help? The bot includes comprehensive error handling and will fallback gracefully if anything goes wrong.*
