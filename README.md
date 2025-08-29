# 🏦 Complete Discord Bank Bot with Railway Hosting

> **Enhanced Arabic Discord Bank Bot with Visual Dice Battle System**  
> **✨ Ready for 24/7 deployment on Railway**

## 🎯 What's New in This Version?

✅ **All Original Features** - Every command from your original bot  
✅ **Enhanced نرد Command** - Custom visual dice battles with user avatars  
✅ **Railway Ready** - Complete deployment configuration included  
✅ **Multi-Language Support** - Node.js + Python working together  
✅ **Robust Error Handling** - Enhanced logging and fallback systems  

---

## 🎮 Features

### 💰 Economy System
- **راتب** - Get your salary
- **فلوسي** - Check your balance
- **تحويل** - Transfer money
- **يومي** - Daily bonus
- **حظ** - Lucky money
- **قرض** - Take a loan
- **تسديد** - Pay back loan

### 🏢 Business & Investment
- **استثمار** - Investment system
- **تداول** - Trading system
- **شراء** - Buy items
- **منازل** - House system
- **شركات** - Companies list
- **شراء_شركة** - Buy company
- **بيع_شركة** - Sell company

### 🎲 Games & Fun
- **نرد** - Enhanced visual dice battles 🎯
- **قمار** - Gambling game
- **نهب** - Rob other players
- **حماية** - Protection system

### 📊 Information
- **اوامر** - Commands list
- **توب** - Top richest players
- **حساب** - Account info
- **وقت** - Current time

### 💼 Jobs System
- **job** - Job management
- Multiple job titles with different salaries

---

## 🎲 Enhanced Dice Command (نرد)

The **نرد** command has been completely redesigned with:

- 🎨 **Custom Visual Battle Images**
- 👤 **User & Bot Avatars**
- 🎲 **Animated Dice Results**
- ✨ **Winner Highlighting Effects**
- 📱 **Fallback Text Mode** (if image generation fails)

### How It Works:
1. User types `نرد`
2. Bot generates random dice rolls (1-6)
3. Python script creates custom battle image
4. Result posted with winner announcement

---

## 🚀 Railway Deployment

### Prerequisites
- GitHub account
- Railway account (free)
- Discord bot token

### Quick Deploy
1. Fork/clone this repository
2. Connect to Railway
3. Set environment variables
4. Deploy automatically!

### Environment Variables
```
DISCORD_TOKEN=your_bot_token_here
ALLOWED_CHANNEL_ID=your_channel_id (optional)
NODE_ENV=production
```

---

## 📁 Project Structure

```
.
├── index.js                     # Main bot file
├── package.json                 # Dependencies
├── config.js.template          # Configuration template
├── nixpacks.toml              # Railway build config
├── railway.toml               # Railway deploy config
├── requirements.txt           # Python dependencies
├── improved_dice_generator.py # Core image generator
├── generate_improved_dice_image.py # CLI wrapper
├── dice_assets/               # Dice images & backgrounds
│   ├── 1.jpg - 6.jpg         # Dice face images
│   └── red_background_700x250.png
├── temp_dice_images/          # Temporary generated images
└── src/
    ├── commands/              # All bot commands
    │   ├── نرد.js            # Enhanced dice command
    │   ├── راتب.js           # Salary command
    │   ├── فلوسي.js          # Balance command
    │   └── ... (all other commands)
    └── utils/
        ├── cooldown.js        # Cooldown management
        └── houses.js          # House utilities
```

---

## 🛠️ Development

### Local Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd discord-bank-bot-complete

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Copy config template
cp config.js.template config.js
# Edit config.js with your settings

# Create temp directory
mkdir temp_dice_images

# Run the bot
npm start
```

### Adding Commands
1. Create new `.js` file in `src/commands/`
2. Follow the command template structure
3. Export with `name` and `execute` function
4. Bot will auto-load on restart

---

## 📚 Command Template

```javascript
module.exports = {
    name: 'command_name',
    description: 'Command description',
    async execute(message, db, config, args) {
        // Command logic here
        message.reply('Response');
    }
};
```

---

## 🔧 Configuration

All bot settings are in `config.js`:
- Command cooldowns
- Economic settings
- Job definitions
- House prices
- And more!

---

## 🐛 Troubleshooting

### Bot Won't Start
- Check `DISCORD_TOKEN` is set correctly
- Verify bot has necessary permissions
- Check Railway logs for errors

### Dice Images Not Working
- Python dependencies may be missing
- Bot will fallback to text mode
- Check `dice_assets/` folder has all images

### Commands Not Responding
- Verify `allowedChannelId` in config
- Check bot has message permissions
- Look for cooldown restrictions

---

## 📈 Monitoring

### Railway Dashboard
- View deployment logs
- Monitor resource usage
- Check uptime statistics
- Manage environment variables

### Bot Health Indicators
- Startup ASCII art logo
- Command execution logs
- Error reporting
- Graceful shutdown handling

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - feel free to modify and distribute!

---

## 💖 Credits

- **Original Bot**: Wick Studio
- **Enhanced Features**: MiniMax Agent
- **Hosting**: Railway Platform
- **Community**: discord.gg/wicks

---

**🎯 Ready to deploy? Check out the [Migration Guide](MIGRATION_GUIDE.md) for step-by-step instructions!**
