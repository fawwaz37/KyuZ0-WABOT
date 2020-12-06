const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')
const { premiUser } = require('./config.json')

const start = async (client = new Client()) => {
    console.log('[SERVER] Server Started!')
    // Force it to keep the current session
    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
    // listening on message
    client.onMessage((async (message) => {
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 1500) {
                    client.cutMsgCache()
                }
            })
        msgHandler(client, message)
    }))

    client.onGlobalParicipantsChanged((async (heuh) => {
        await welcome(client, heuh)
        //left(client, heuh)
    }))

    client.onAddedToGroup((async (chat) => {

        let totalMem = chat.groupMetadata.participants.length
        let groupName = chat.contact.name
        const ownerNumber = '6282255304881@c.us'
        const getAllMembers = await client.getGroupMembersId(chat.groupMetadata.id)

        if (totalMem < 300 && !getAllMembers.includes(ownerNumber)) {
            client.sendText(chat.id, `Upss...\n\nUntuk bisa mengundang bot kedalam grup *${groupName}*. Diwajibkan untuk donasi dulu yah ^^\n\n10K = 1 Minggu\n20K = 1 Bulan\n50K = Forever\n\nJika berminat, langsung chat contact admin dengan cara ketik: *$owners*`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
        } else {
            client.sendText(chat.groupMetadata.id, `Halo *${groupName}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *$help* dan jangan lupa bantu owner untuk bisa memperbesar server agar bot ini tidak suspend/slow respon dengan cara kirim *$donasi*`)
        }
    }))

    /*client.onAck((x => {
        const { from, to, ack } = x
        if (x !== 3) client.sendSeen(to)
    }))*/

    // listening on Incoming Call
    client.onIncomingCall((async (call) => {
        await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!')
            .then(() => client.contactBlock(call.peerJid))
    }))
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))