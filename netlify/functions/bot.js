const { Telegraf, Markup } = require('telegraf');
const { app } = require('../../config/firebase');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Get the relays from the database
const db = app.firestore();
const relaysCollection = db.collection('relays')

bot.start((ctx) => ctx.reply('Welcome!, I am SmartHome Bot!. Send /relays to see the relays lists'));

bot.command("relays", ctx => {
    const relays = relaysCollection.get();
    if (relays.empty) {
        console.log('No matching documents.');
        return;
    }

    relays.docs.map(relay => {
        try {
            ctx.reply(
                relay.data().name,
                Markup.inlineKeyboard([
                    Markup.button.callback("ON", relay.data().id + "_on"),
                    Markup.button.callback("OFF", relay.data().id + "_off"),
                ]),
            );
        }
        catch {
            console.log("error in relays command")
            ctx.reply("error in relays command")
        }
    })
});

bot.action(/.+/, ctx => {
    setRelayStatus(ctx)
});

const setRelayStatus = (context) => {
    const relays = relaysCollection.get();
    let id = context.callbackQuery.data.match(/(\d+)/i)[0];
    let status = context.callbackQuery.data.match(/on|off/i)[0];
    let relayId = `relay_${id}`;

    relays.docs.map(relay => {
        if (relay.data().id === relayId) {
            if (relay.data().status === status) {
                context.answerCbQuery(`${relay.data().name} sudah ${status == 'on' ? 'dinyalakan' : 'dimatikan'}`);
            }

            if (relay.data().status !== status) {
                context.answerCbQuery(`Oke, ${context.callbackQuery.message.text} ${status == 'on' ? 'dinyalakan' : 'dimatikan'}`);
                relay.data().status = status;
            }
        }
    })

    relaysCollection.doc(relayId).update({
        status: status
    })
}

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