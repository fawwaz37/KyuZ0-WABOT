const fs = require('fs-extra')

module.exports = welcome = async (client, event) => {
    const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
    const isWelkom = welkom.includes(event.chat)
    try {
        if (event.action == 'add' && isWelkom) {
            const gChat = await client.getChatById(event.chat)
            const pChat = await client.getContact(event.who)
            const { contact, groupMetadata, name } = gChat
            const gcDesc = groupMetadata.desc
            const pepe = await client.getProfilePicFromServer(event.who)
            if (gcDesc === undefined) {
                var capt = `Halo *${pChat.pushname}*👋, Selamat datang di *${name}* have fun with us yaa^^`
            } else {
                var capt = `Halo *${pChat.pushname}*👋, Selamat datang di *${name}* have fun with us yaa^^\n\n*GROUP DESCRIPTION:*\n${gcDesc}`
            }
            if (pepe == '' || pepe == undefined) {
                await client.sendFileFromUrl(event.chat, 'https://s.itl.cat/pngfile/s/66-668242_awalnya-ambisi-menjadi-pengusaha-adalah-tujuan-hidup-no.jpg', 'profile.jpg', capt)
            } else {
                await client.sendFileFromUrl(event.chat, pepe, 'profile.jpg', capt)
            }

        }
    } catch (err) {
        console.log(err)
    }
}
