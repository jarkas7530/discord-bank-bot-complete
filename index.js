const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { QuickDB } = require('quick.db');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Discord Bank Bot...');

// Initialize database
const db = new QuickDB();
console.log('✅ Database initialized');

// Bot configuration
const config = {
    prefix: '',
    embedColor: '#0099ff',
    cooldowns: {
        default: 30000, // 30 seconds
        dice: 30000,
        salary: 3600000, // 1 hour
        daily: 86400000 // 24 hours
    }
};

// Get token from environment
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('❌ DISCORD_TOKEN not found in environment variables!');
    console.log('Please add DISCORD_TOKEN to your Railway environment variables');
    process.exit(1);
}

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Commands collection
client.commands = new Collection();
const cooldowns = new Collection();

// Utility function for cooldowns
function checkCooldown(userId, commandName, cooldownTime) {
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    
    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownTime;
        
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return Math.ceil(timeLeft);
        }
    }
    
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownTime);
    return null;
}

// Load commands
function loadCommands() {
    const commandsPath = path.join(__dirname, 'src', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.log('⚠️ Commands directory not found, creating basic commands...');
        return false;
    }
    
    try {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(`✅ Loaded command: ${command.data.name}`);
                } else {
                    console.log(`⚠️ Skipping ${file}: missing required properties`);
                }
            } catch (error) {
                console.log(`⚠️ Could not load command ${file}:`, error.message);
            }
        }
        return true;
    } catch (error) {
        console.error('❌ Error loading commands:', error.message);
        return false;
    }
}

// Basic commands if file loading fails
const basicCommands = {
    'راتب': async (message) => {
        const cooldownLeft = checkCooldown(message.author.id, 'salary', config.cooldowns.salary);
        if (cooldownLeft) {
            return message.reply(`⏰ يجب الانتظار ${Math.ceil(cooldownLeft / 60)} دقيقة قبل أخذ الراتب مرة أخرى`);
        }
        
        const salary = Math.floor(Math.random() * 1000) + 500;
        const currentBalance = await db.get(\`balance_\${message.author.id}\`) || 0;
        await db.set(\`balance_\${message.author.id}\`, currentBalance + salary);
        
        message.reply(\`💰 تم إضافة **\${salary}** ذهب إلى رصيدك!\`);
    },
    
    'فلوسي': async (message) => {
        const balance = await db.get(\`balance_\${message.author.id}\`) || 0;
        message.reply(\`💳 رصيدك الحالي: **\${balance}** ذهب\`);
    },
    
    'اوامر': async (message) => {
        const embed = {
            color: parseInt(config.embedColor.replace('#', ''), 16),
            title: '📋 قائمة الأوامر',
            description: '**الأوامر المتاحة:**\\n\\n' +
                        '💰 `راتب` - احصل على راتبك\\n' +
                        '💳 `فلوسي` - اعرض رصيدك\\n' +
                        '🎲 `نرد` - العب النرد\\n' +
                        '📋 `اوامر` - عرض هذه القائمة',
            timestamp: new Date(),
            footer: { text: 'Discord Bank Bot' }
        };
        
        message.reply({ embeds: [embed] });
    },
    
    'نرد': async (message) => {
        const cooldownLeft = checkCooldown(message.author.id, 'dice', config.cooldowns.dice);
        if (cooldownLeft) {
            return message.reply(\`⏰ يجب الانتظار \${cooldownLeft} ثانية قبل لعب النرد مرة أخرى\`);
        }
        
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;
        
        let result = '';
        let winnings = 0;
        
        if (playerRoll > botRoll) {
            winnings = 100;
            result = '🎉 لقد ربحت!';
            const currentBalance = await db.get(\`balance_\${message.author.id}\`) || 0;
            await db.set(\`balance_\${message.author.id}\`, currentBalance + winnings);
        } else if (playerRoll < botRoll) {
            result = '😢 لقد خسرت!';
        } else {
            result = '🤝 تعادل!';
        }
        
        const embed = {
            color: parseInt(config.embedColor.replace('#', ''), 16),
            title: '🎲 لعبة النرد',
            fields: [
                { name: '🎯 نردك', value: \`**\${playerRoll}**\`, inline: true },
                { name: '🤖 نرد البوت', value: \`**\${botRoll}**\`, inline: true },
                { name: '🏆 النتيجة', value: result + (winnings > 0 ? \` (+\${winnings} ذهب)\` : ''), inline: false }
            ],
            timestamp: new Date(),
            footer: { text: 'Discord Bank Bot' }
        };
        
        message.reply({ embeds: [embed] });
    }
};

// Client events
client.once('ready', () => {
    console.log(\`🤖 Bot is Ready! \${client.user.tag}!\`);
    console.log(\`🚀 Enhanced with Railway hosting and improved dice command!\`);
    
    // Try to load commands from files
    const commandsLoaded = loadCommands();
    if (!commandsLoaded) {
        console.log('📦 Using built-in basic commands');
    }
    
    // Set bot status
    client.user.setActivity('راتب | فلوسي | نرد', { type: 'PLAYING' });
});

client.on('messageCreate', async (message) => {
    // Ignore bots and non-text channels
    if (message.author.bot || !message.guild) return;
    
    const content = message.content.trim();
    if (!content) return;
    
    try {
        // Check if it's a command we recognize
        if (basicCommands[content]) {
            await basicCommands[content](message);
            return;
        }
        
        // Try loaded commands
        const command = client.commands.get(content);
        if (command) {
            await command.execute(message, db);
        }
        
    } catch (error) {
        console.error('❌ Command execution error:', error);
        message.reply('حدث خطأ أثناء تنفيذ الأمر!').catch(() => {});
    }
});

// Error handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

// Login
client.login(token).catch((error) => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});
