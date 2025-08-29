const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { QuickDB } = require('quick.db');
const path = require('path');
const fs = require('fs');
const cooldownUtil = require('./src/utils/cooldown.js');
const companies = require('./src/commands/companiesData');
const jobCommand = require('./src/commands/job.js');

// Initialize configuration
let config;
try {
    config = require('./config.js');
    console.log('✅ Loaded config.js');
} catch (error) {
    console.log('⚠️ config.js not found, using template...');
    try {
        config = require('./config.js.template');
        console.log('✅ Loaded config template');
    } catch (templateError) {
        console.error('❌ Could not load config template:', templateError);
        process.exit(1);
    }
}

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message]
});

// Initialize database
const db = new QuickDB();

// Create temp directories
const tempDirs = ['temp_dice_images', 'dice_assets'];
tempDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        } catch (error) {
            console.error(`❌ Failed to create directory ${dir}:`, error);
        }
    }
});

// Bot ready event
client.once('ready', async () => {
    try {
        // Initialize company data from database
        for (const company of companies) {
            company.owner = await db.get(`company_${company.id}_owner`) || null;
            company.price = await db.get(`company_${company.id}_price`) || company.price;
        }

        // ASCII Art Logo
        console.log(`
██╗ ██╗██╗ ██████╗██╗ ██╗ ███████╗████████╗██╗ ██╗██████╗ ██╗ ██████╗
██║ ██║██║██╔════╝██║ ██╔╝ ██╔════╝╚══██╔══╝██║ ██║██╔══██╗██║██╔═══██╗
██║ █╗ ██║██║██║ █████╔╝ ███████╗ ██║ ██║ ██║██║ ██║██║██║ ██║
██║███╗██║██║██║ ██╔═██╗ ╚════██║ ██║ ██║ ██║██║ ██║██║██║ ██║
╚███╔███╔╝██║╚██████╗██║ ██╗ ███████║ ██║ ╚██████╔╝██████╔╝██║╚██████╔╝
 ╚══╝╚══╝ ╚═╝ ╚═════╝╚═╝ ╚═╝ ╚══════╝ ╚═╝  ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
        `);
        
        console.log(`🤖 Bot is Ready! ${client.user.tag}!`);
        console.log(`🌍 Serving ${client.guilds.cache.size} guilds`);
        console.log(`📊 Code by Wick Studio`);
        console.log(`🔗 discord.gg/wicks`);
        console.log(`🚀 Enhanced with Railway hosting and improved dice command!`);
        
        // Set bot status
        client.user.setActivity('بنك العرب | Bank Commands', { type: 0 });
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});

// Initialize commands collection
client.commands = new Map();

// Load job command first
client.commands.set(jobCommand.name, jobCommand);

// Load all commands from src/commands directory
try {
    const commandsPath = path.join(__dirname, 'src', 'commands');
    if (fs.existsSync(commandsPath)) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = require(`./src/commands/${file}`);
                if (command.name && command.execute) {
                    client.commands.set(command.name, command);
                    console.log(`✅ Loaded command: ${command.name}`);
                } else {
                    console.log(`⚠️ Command ${file} missing name or execute function`);
                }
            } catch (error) {
                console.error(`❌ Error loading command ${file}:`, error);
            }
        }
    }
} catch (error) {
    console.error('❌ Error loading commands directory:', error);
}

// Message handler
client.on('messageCreate', async message => {
    // Ignore bots
    if (message.author.bot) return;
    
    // Check if message is in allowed channel (if configured)
    if (config.allowedChannelId && message.channel.id !== config.allowedChannelId) {
        return;
    }
    
    // Parse command
    const args = message.content.trim().split(/ +/);
    const commandName = args.shift();
    
    console.log(`📝 Received command: "${commandName}" from ${message.author.username}`);
    console.log(`📋 Args: [${args.join(', ')}]`);
    
    // Check if command exists
    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        
        try {
            // Check cooldown
            if (cooldownUtil.isInCooldown(command.name, message.author.id, config)) {
                const cooldownTime = config.cooldowns[command.name] || 5;
                return message.reply(`⏰ يرجى الانتظار ${cooldownTime} ثانية قبل استخدام أمر ${command.name} مرة أخرى.`);
            }
            
            // Execute command
            await command.execute(message, db, config, args);
            
            // Set cooldown
            const cooldownTime = config.cooldowns[command.name] || 5;
            cooldownUtil.setCooldown(command.name, message.author.id, cooldownTime);
            
            console.log(`✅ Executed command: ${command.name}`);
            
        } catch (error) {
            console.error(`❌ Error executing command ${command.name}:`, error);
            message.reply('❌ حدث خطأ أثناء تنفيذ هذا الأمر.');
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('🚨 Discord client error:', error);
});

client.on('warn', warn => {
    console.warn('⚠️ Discord client warning:', warn);
});

// Graceful shutdown handlers
process.on('unhandledRejection', error => {
    console.error('💥 Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('💥 Uncaught exception:', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

// Login to Discord
const token = process.env.DISCORD_TOKEN || config.token;
if (!token) {
    console.error('❌ DISCORD_TOKEN environment variable or config.token is required!');
    console.error('💡 Add your bot token to Railway environment variables or config.js');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('❌ Failed to login to Discord:', error);
    console.error('💡 Check your bot token and make sure it\'s valid');
    process.exit(1);
});

console.log('🚀 Starting Complete Discord Bank Bot...');
console.log('🔄 Loading all commands and features...');
