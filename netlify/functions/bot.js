const { Telegraf, Markup } = require('telegraf');
const { app } = require('../../config/firebase');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.command("relays", async ctx => {
    const db = app.firestore();
    const docRef = db.collection('relays')
    const snapshot = await docRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    ctx.reply(snapshot.docs.map(doc => doc.data()));
});

exports.handler = async (event, context) => {
    bot.launch();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello World' })
    }
}