# بوت البنك العربي - Discord Bank Bot

بوت اقتصادي عربي لديسكورد مع نظام مصرفي متكامل، مصمم للنشر على Railway.

## المميزات

- **نظام الرصيد**: تحقق من رصيد الذهب
- **الراتب**: احصل على راتب كل ساعة
- **المكافأة اليومية**: مكافأة يومية (24 ساعة)
- **لعبة النرد**: قامر بذهبك في ألعاب النرد
- **نظام المقامرة**: قامر للفوز بأموال أكثر
- **أوامر المساعدة**: عرض جميع الأوامر المتاحة

## الأوامر

- `/فلوسي` - تحقق من رصيدك الحالي
- `/راتب` - احصل على راتب كل ساعة
- `/يومي` - احصل على المكافأة اليومية
- `/نرد <رهان>` - العب النرد وقامر
- `/قمار <مبلغ>` - قامر برصيدك
- `/اوامر` - عرض جميع الأوامر

## النشر على Railway

هذا البوت مصمم للعمل على Railway.app مع المتطلبات التالية:

1. أضف متغير البيئة `DISCORD_TOKEN`
2. Railway سيقوم بتثبيت التبعيات وتشغيل البوت تلقائياً

## التفاصيل التقنية

- **بيئة التشغيل**: Node.js 18
- **قاعدة البيانات**: QuickDB (SQLite)
- **إطار العمل**: Discord.js v14
- **الأوامر**: أوامر مائلة (Slash Commands) فقط

## متغيرات البيئة

- `DISCORD_TOKEN` - رمز بوت الديسكورد الخاص بك (مطلوب)

البوت سيقوم بتسجيل الأوامر المائلة تلقائياً عند بدء التشغيل.

## Arabic Discord Bank Bot

An Arabic economy Discord bot with banking features, built for Railway deployment.

### Features

- Balance system with gold currency
- Hourly salary collection
- Daily rewards
- Dice gambling game
- General gambling system
- Help command system

All commands are in Arabic for Arabic-speaking Discord communities.
