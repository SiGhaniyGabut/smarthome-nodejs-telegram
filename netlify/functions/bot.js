const { Telegraf, Markup } = require('telegraf');
const { app } = require('../../config/firebase');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Get the relays from the database
const db = app.firestore();
const docRef = db.collection('relays')

bot.start((ctx) => ctx.reply('Welcome!, I am SmartHome Bot!. Send /relays to see the relays lists'));

bot.command("relays", async ctx => {
    const snapshot = await docRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    ctx.reply(snapshot.docs.map(doc => doc.data()));
    snapshot.docs.map(doc => {
        try {
            ctx.reply(
                doc.data().name,
                Markup.inlineKeyboard([
                    Markup.button.callback("ON", doc.data().id + "_on"),
                    Markup.button.callback("OFF", doc.data().id + "_off"),
                ]),
            );
        }
        catch {
            console.log("error in relays command")
            ctx.reply("error in relays command")
        }
    })
});

exports.handler = async (event, context) => {
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
            body: JSON.stringify({ error: "This endpoint is meant for bot and telegram communication" })
        }
    }
}