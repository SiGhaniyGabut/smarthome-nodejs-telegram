const { Telegraf, Markup, Context } = require('telegraf');
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

bot.command("relay", async ctx => {
    const db = app.firestore();
    const docRef = db.collection('relays').doc(ctx.message.text.split(" ")[1]);
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No matching documents.');
        return;
    }

    ctx.reply(doc.data());
});

// bot.webhookCallback('/.netlify/functions/bot');

exports.handler = async (event, context) => {
    // const path = event.path;
    // const body = event.body;
    // const method = event.httpMethod;

    // if (path === '/.netlify/functions/bot' && method === 'POST') {
    //     return bot.handleUpdate(JSON.parse(body), context);
    // }

    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: 'Hello World' })
    // }
    try {
        await bot.handleUpdate(JSON.parse(event.body))
        return {
            statusCode: 200,
            body: ""
        }
    } catch (e) {
        console.error("error in handler:", e)
        return {
            statusCode: 400,
            body: "This endpoint is meant for bot and telegram communication"
        }
    }
}