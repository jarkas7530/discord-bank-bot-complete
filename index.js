const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');

console.log('🚀 Starting Discord Bank Bot (Arabic Version)...');

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
    
    const timestamps = cooldowns.get(commandName);
    
    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownTime;
        if (Date.now() < expirationTime) {
            const timeLeft = (expirationTime - Date.now()) / 1000;
            return Math.ceil(timeLeft);
        }
    }
    
    timestamps.set(userId, Date.now());
    setTimeout(() => timestamps.delete(userId), cooldownTime);
    return null;
}

// Arabic commands
const commands = new Collection();

// Balance command - فلوسي
const balanceCommand = {
    data: new SlashCommandBuilder()
        .setName('فلوسي')
        .setDescription('تحقق من رصيدك الحالي'),
    async execute(interaction) {
        const balance = await db.get(`balance_${interaction.user.id}`) || 0;
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('💳 رصيدك')
            .setDescription(`رصيدك الحالي: **${balance}** ذهب`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};

// Salary command - راتب
const salaryCommand = {
    data: new SlashCommandBuilder()
        .setName('راتب')
        .setDescription('احصل على راتبك كل ساعة'),
    async execute(interaction) {
        const cooldownLeft = checkCooldown(interaction.user.id, 'salary', config.cooldowns.salary);
        if (cooldownLeft) {
            return interaction.reply(`⏰ يجب الانتظار ${Math.ceil(cooldownLeft / 60)} دقيقة قبل أخذ الراتب مرة أخرى`);
        }
        
        const salary = Math.floor(Math.random() * 1000) + 500;
        const currentBalance = await db.get(`balance_${interaction.user.id}`) || 0;
        await db.set(`balance_${interaction.user.id}`, currentBalance + salary);
        
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('💰 تم استلام الراتب')
            .setDescription(`لقد حصلت على **${salary}** ذهب!`)
            .addFields({ name: 'الرصيد الجديد', value: `${currentBalance + salary} ذهب`, inline: true })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

// Daily command - يومي
const dailyCommand = {
    data: new SlashCommandBuilder()
        .setName('يومي')
        .setDescription('احصل على مكافأتك اليومية'),
    async execute(interaction) {
        const cooldownLeft = checkCooldown(interaction.user.id, 'daily', config.cooldowns.daily);
        if (cooldownLeft) {
            const hours = Math.ceil(cooldownLeft / 3600);
            return interaction.reply(`⏰ يجب الانتظار ${hours} ساعة قبل الحصول على المكافأة اليومية مرة أخرى`);
        }
        
        const reward = Math.floor(Math.random() * 2000) + 1000;
        const currentBalance = await db.get(`balance_${interaction.user.id}`) || 0;
        await db.set(`balance_${interaction.user.id}`, currentBalance + reward);
        
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🎁 المكافأة اليومية')
            .setDescription(`لقد حصلت على **${reward}** ذهب!`)
            .addFields({ name: 'الرصيد الجديد', value: `${currentBalance + reward} ذهب`, inline: true })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

// Dice command - نرد
const diceCommand = {
    data: new SlashCommandBuilder()
        .setName('نرد')
        .setDescription('العب النرد واربح الذهب')
        .addIntegerOption(option =>
            option.setName('رهان')
                .setDescription('مبلغ الرهان')
                .setRequired(true)
                .setMinValue(10)),
    async execute(interaction) {
        const bet = interaction.options.getInteger('رهان');
        const userBalance = await db.get(`balance_${interaction.user.id}`) || 0;
        
        if (bet > userBalance) {
            return interaction.reply('❌ الرصيد غير كافي!');
        }
        
        const cooldownLeft = checkCooldown(interaction.user.id, 'dice', config.cooldowns.dice);
        if (cooldownLeft) {
            return interaction.reply(`⏰ يجب الانتظار ${cooldownLeft} ثانية قبل لعب النرد مرة أخرى`);
        }
        
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        let winnings = 0;
        let result = '';
        
        if (total === 7 || total === 11) {
            winnings = bet * 2;
            result = 'فوز! 🎉';
        } else if (total === 2 || total === 3 || total === 12) {
            winnings = -bet;
            result = 'خسارة! 😢';
        } else {
            winnings = Math.floor(bet * 0.5);
            result = 'فوز صغير! 😊';
        }
        
        const newBalance = userBalance + winnings;
        await db.set(`balance_${interaction.user.id}`, newBalance);
        
        const embed = new EmbedBuilder()
            .setColor(winnings > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎲 لعبة النرد')
            .setDescription(`رميت: **${dice1}** + **${dice2}** = **${total}**`)
            .addFields(
                { name: 'النتيجة', value: result, inline: true },
                { name: 'الأرباح', value: `${winnings > 0 ? '+' : ''}${winnings} ذهب`, inline: true },
                { name: 'الرصيد الجديد', value: `${newBalance} ذهب`, inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

// Gambling command - قمار
const gamblingCommand = {
    data: new SlashCommandBuilder()
        .setName('قمار')
        .setDescription('اقامر برصيدك')
        .addIntegerOption(option =>
            option.setName('مبلغ')
                .setDescription('المبلغ للمقامرة')
                .setRequired(true)
                .setMinValue(50)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('مبلغ');
        const userBalance = await db.get(`balance_${interaction.user.id}`) || 0;
        
        if (amount > userBalance) {
            return interaction.reply('❌ الرصيد غير كافي للمقامرة!');
        }
        
        const cooldownLeft = checkCooldown(interaction.user.id, 'gambling', config.cooldowns.default);
        if (cooldownLeft) {
            return interaction.reply(`⏰ يجب الانتظار ${cooldownLeft} ثانية قبل المقامرة مرة أخرى`);
        }
        
        const chance = Math.random();
        let winnings = 0;
        let result = '';
        
        if (chance < 0.45) { // 45% chance to win
            winnings = Math.floor(amount * (1.5 + Math.random())); // 1.5x to 2.5x
            result = `فوز كبير! 🎉`;
        } else if (chance < 0.65) { // 20% chance for small win
            winnings = Math.floor(amount * 0.5);
            result = 'فوز صغير! 😊';
        } else { // 35% chance to lose
            winnings = -amount;
            result = 'خسارة! 😢';
        }
        
        const newBalance = userBalance + winnings;
        await db.set(`balance_${interaction.user.id}`, newBalance);
        
        const embed = new EmbedBuilder()
            .setColor(winnings > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎰 المقامرة')
            .setDescription(`قامرت بـ **${amount}** ذهب`)
            .addFields(
                { name: 'النتيجة', value: result, inline: true },
                { name: 'الأرباح/الخسائر', value: `${winnings > 0 ? '+' : ''}${winnings} ذهب`, inline: true },
                { name: 'الرصيد الجديد', value: `${newBalance} ذهب`, inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

// Help command - اوامر
const helpCommand = {
    data: new SlashCommandBuilder()
        .setName('اوامر')
        .setDescription('عرض جميع الأوامر المتاحة'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('📚 أوامر البوت')
            .setDescription('إليك جميع الأوامر المتاحة:')
            .addFields(
                { name: '/فلوسي', value: 'تحقق من رصيدك الحالي', inline: false },
                { name: '/راتب', value: 'احصل على راتب كل ساعة', inline: false },
                { name: '/يومي', value: 'احصل على مكافأة يومية (24 ساعة)', inline: false },
                { name: '/نرد <رهان>', value: 'العب النرد وقامر بذهبك', inline: false },
                { name: '/قمار <مبلغ>', value: 'قامر برصيدك لفرصة الفوز بأكثر', inline: false },
                { name: '/اوامر', value: 'عرض هذه الرسالة', inline: false }
            )
            .setFooter({ text: 'بوت البنك العربي' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

// Register commands
commands.set('فلوسي', balanceCommand);
commands.set('راتب', salaryCommand);
commands.set('يومي', dailyCommand);
commands.set('نرد', diceCommand);
commands.set('قمار', gamblingCommand);
commands.set('اوامر', helpCommand);

client.commands = commands;

// Bot ready event
client.once('ready', async () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    
    try {
        console.log('🔄 Registering Arabic slash commands...');
        await client.application.commands.set(Array.from(commands.values()).map(cmd => cmd.data));
        console.log('✅ Arabic slash commands registered successfully');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
});

// Interaction handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
        return interaction.reply({ content: '❌ الأمر غير موجود!', ephemeral: true });
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Command execution error:', error);
        const reply = { content: '❌ حدث خطأ أثناء تنفيذ هذا الأمر!', ephemeral: true };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Start bot
client.login(token).catch(error => {
    console.error('❌ Failed to login:', error);
    process.exit(1);
});
