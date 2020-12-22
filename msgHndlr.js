const nsfwgrp = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const antilink = JSON.parse(fs.readFileSync('./lib/antilink.json'))
const antitoxic = JSON.parse(fs.readFileSync('./lib/antitoxic.json'))
const simichat = JSON.parse(fs.readFileSync('./lib/simi.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
const { prefix, iTechApi, keepSave, mhankBB, vhTear, VIP } = require('./config.json');
const m = require("moment-duration-format");
const os = require("os");
const cpuStats = require("cpu-stat");
const request = require('request-promise');
const serp = require("serp");
const mysql = require('mysql2');
const { uploadImages } = require('./utils/fetcher');
const { processTime } = require('./utils');
const {
    cekResi,
    translate,
    meme
} = require('./lib')
var cron = require('node-cron');
const fetch = require('node-fetch');
global.fetch = fetch;
const PornHub = require('pornhub.js')
const pornhub = new PornHub()
const ytdl = require('ytdl-core');
const ytmp3Downloader = require("youtube-mp3-downloader");

moment.tz.setDefault('Asia/Makassar').locale('id')

const con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'user',
    password: ''
});

process.setMaxListeners(0);
//set unlimited listener

// Limiter Reset
cron.schedule('0 1 * * *', () => {
    let sql = `UPDATE limiter SET limitnya='25'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
    console.log('[SYSTEM] ZCoins Has been reset!')
});

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args = commands.split(' ')
        const arg1 = commands.trim().substring(commands.indexOf(' ') + 1)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'

        const msgs = (message) => {
            if (command.startsWith(prefix)) {
                if (message.length >= 10) {
                    return `${message.substr(0, 15)}`
                } else {
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '_Please wait..._',
            error: {
                St: `Kirim gambar dengan caption *${prefix}sticker* atau balas gambar yang sudah dikirim`,
                Qm: 'Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: 'Maaf, tidak dapat meng konversi ke mp3!',
                Yt4: 'Maaf, error di yang disebabkan oleh sistem.',
                Ig: 'Maaf, mungkin karena akunnya private',
                Ki: 'Bot tidak bisa mengeluarkan admin group!',
                Ad: 'Maaf, tidak dapat menambahkan target!',
                Iv: 'Link yang anda kirim tidak valid!'
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = '6282255304881@c.us'
        const isOwner = sender.id === ownerNumber
        const isVIP = VIP.includes(sender.id)
        const allChatz = await client.getAllChats()
        const nomernya = sender.id
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = nsfwgrp.includes(chat.id)
        const isSimi = simichat.includes(chat.id)
        const isAntiLink = antilink.includes(chat.id)
        const isWelcome = welkom.includes(chat.id)
        const isAntiToxic = antitoxic.includes(chat.id)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith(prefix)) console.log('[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command.split(' ')[0])), 'from', color(pushname + ` (${sender.id})`))
        if (isGroupMsg && command.startsWith(prefix)) console.log('[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command.split(' ')[0])), 'from', color(pushname + ` (${sender.id})`), 'in', color(formattedTitle))
        // if (!isGroupMsg && !command.startsWith(prefix)) console.log('[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        // if (isGroupMsg && !command.startsWith(prefix)) console.log('[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        // if (!isOwner) return

        switch (command) {
            case `${prefix}mylimit`:
            case `${prefix}myinfo`:
                // if (!isOwner) return
                var pic = await client.getProfilePicFromServer(sender.id)
                if (pic === undefined) {
                    var pfp = 'https://s.itl.cat/pngfile/s/66-668242_awalnya-ambisi-menjadi-pengusaha-adalah-tujuan-hidup-no.jpg'
                } else {
                    var pfp = pic
                }
                sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length !== 1) {
                        saveNo(nomernya)
                        var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql1, function (err, result) {
                            if (err) throw err;
                            if (isVIP) {
                                client.sendFileFromUrl(from, pfp, 'UserInfo.jpg', `*Name:* ${pushname}\n*Banned:* ${blockNumber.includes(sender.id)}\n*VIP:* ${isVIP}\n*Limits:* Unlimited`, id)
                            } else {
                                var myLimits = result[0].limitnya
                                client.sendFileFromUrl(from, pfp, 'UserInfo.jpg', `*Name:* ${pushname}\n*Banned:* ${blockNumber.includes(sender.id)}\n*VIP:* ${isVIP}\n*Limits:* ${myLimits}`, id)
                            }
                        });
                    } else {
                        var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql1, function (err, result) {
                            if (err) throw err;
                            if (isVIP) {
                                client.sendFileFromUrl(from, pfp, 'UserInfo.jpg', `*Name:* ${pushname}\n*Banned:* ${blockNumber.includes(sender.id)}\n*VIP:* ${isVIP}\n*Limits:* Unlimited`, id)
                            } else {
                                var myLimits = result[0].limitnya
                                client.sendFileFromUrl(from, pfp, 'UserInfo.jpg', `*Name:* ${pushname}\n*Banned:* ${blockNumber.includes(sender.id)}\n*VIP:* ${isVIP}\n*Limits:* ${myLimits}`, id)
                            }
                        });
                    }
                });
                break
            case `${prefix}ping`:
            case `${prefix}speed`:
                await client.sendText(from, `My PING Speed: ${processTime(t, moment())} _Seconds_`)
                break
            case `${prefix}sticker`:
            case `${prefix}stiker`:
                if (isGroupMsg) {
                    if (isMedia && type === 'image') {
                        const mediaData = await decryptMedia(message, uaOverride)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (args.length === 2) {
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.reply(from, mess.error.Iv, id)
                        }
                    } else {
                        client.reply(from, mess.error.St, id)
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia && type === 'image') {
                                            const mediaData = await decryptMedia(message, uaOverride)
                                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                            await client.sendImageAsSticker(from, imageBase64)
                                        } else if (quotedMsg && quotedMsg.type == 'image') {
                                            const mediaData = await decryptMedia(quotedMsg, uaOverride)
                                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                            await client.sendImageAsSticker(from, imageBase64)
                                        } else if (args.length === 2) {
                                            const url = args[1]
                                            if (url.match(isUrl)) {
                                                await client.sendStickerfromUrl(from, url, { method: 'get' })
                                                    .catch(err => console.log('Caught exception: ', err))
                                            } else {
                                                client.reply(from, mess.error.Iv, id)
                                            }
                                        } else {
                                            client.reply(from, mess.error.St, id)
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia && type === 'image') {
                                            const mediaData = await decryptMedia(message, uaOverride)
                                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                            await client.sendImageAsSticker(from, imageBase64)
                                        } else if (quotedMsg && quotedMsg.type == 'image') {
                                            const mediaData = await decryptMedia(quotedMsg, uaOverride)
                                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                            await client.sendImageAsSticker(from, imageBase64)
                                        } else if (args.length === 2) {
                                            const url = args[1]
                                            if (url.match(isUrl)) {
                                                await client.sendStickerfromUrl(from, url, { method: 'get' })
                                                    .catch(err => console.log('Caught exception: ', err))
                                            } else {
                                                client.reply(from, mess.error.Iv, id)
                                            }
                                        } else {
                                            client.reply(from, mess.error.St, id)
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if (isMedia && type === 'image') {
                            const mediaData = await decryptMedia(message, uaOverride)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64)
                        } else if (quotedMsg && quotedMsg.type == 'image') {
                            const mediaData = await decryptMedia(quotedMsg, uaOverride)
                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64)
                        } else if (args.length === 2) {
                            const url = args[1]
                            if (url.match(isUrl)) {
                                await client.sendStickerfromUrl(from, url, { method: 'get' })
                                    .catch(err => console.log('Caught exception: ', err))
                            } else {
                                client.reply(from, mess.error.Iv, id)
                            }
                        } else {
                            client.reply(from, mess.error.St, id)
                        }
                    }
                }
                break
            case `${prefix}stickergif`:
            case `${prefix}stikergif`:
            case `${prefix}sgif`:
                if (isGroupMsg) {
                    if (isMedia) {
                        if (mimetype === 'video/mp4' && message.duration <= 10 || mimetype === 'image/gif' && message.duration <= 10) {
                            const mediaData = await decryptMedia(message, uaOverride)
                            client.reply(from, '_Please wait..._', id)
                            const filename = `./media/aswu.${mimetype.split('/')[1]}`
                            await fs.writeFileSync(filename, mediaData)
                            await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                                const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                            })
                        } else {
                            client.reply(from, `Kirim video dengan caption *${prefix}stickerGif* max 10 sec!`, id)
                        }
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia) {
                                            if (mimetype === 'video/mp4' && message.duration <= 10 || mimetype === 'image/gif' && message.duration <= 10) {
                                                const mediaData = await decryptMedia(message, uaOverride)
                                                client.reply(from, '_Please wait..._', id)
                                                const filename = `./media/aswu.${mimetype.split('/')[1]}`
                                                await fs.writeFileSync(filename, mediaData)
                                                await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                                                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                                    await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                                                })
                                            } else {
                                                client.reply(from, `Kirim video dengan caption *${prefix}stickerGif* max 10 sec!`, id)
                                            }
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia) {
                                            if (mimetype === 'video/mp4' && message.duration <= 10 || mimetype === 'image/gif' && message.duration <= 10) {
                                                const mediaData = await decryptMedia(message, uaOverride)
                                                client.reply(from, '_Please wait..._', id)
                                                const filename = `./media/aswu.${mimetype.split('/')[1]}`
                                                await fs.writeFileSync(filename, mediaData)
                                                await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                                                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                                    await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                                                })
                                            } else {
                                                client.reply(from, `Kirim video dengan caption *${prefix}stickerGif* max 10 sec!`, id)
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if (isMedia) {
                            if (mimetype === 'video/mp4' && message.duration <= 10 || mimetype === 'image/gif' && message.duration <= 10) {
                                const mediaData = await decryptMedia(message, uaOverride)
                                client.reply(from, '_Please wait..._', id)
                                const filename = `./media/aswu.${mimetype.split('/')[1]}`
                                await fs.writeFileSync(filename, mediaData)
                                await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                                    await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                                })
                            } else {
                                client.reply(from, `Kirim video dengan caption *${prefix}stickerGif* max 10 sec!`, id)
                            }
                        }
                    }
                }
                break
            case `${prefix}meme`:
                if (isGroupMsg) {
                    if ((isMedia || isQuotedImage) && args.length >= 2) {
                        const top = arg1.split('|')[0]
                        const bottom = arg1.split('|')[1]
                        const encryptMedia = isQuotedImage ? quotedMsg : message
                        const mediaData = await decryptMedia(encryptMedia, uaOverride)
                        const getUrl = await uploadImages(mediaData, false)
                        const ImageBase64 = await meme.custom(getUrl, top, bottom)
                        client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    } else {
                        await client.reply(from, 'Tidak ada gambar! Gunakan perintah $meme bersamaan dengan mengirim gambar atau membalas gambar yang sudah ada!', id)
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if ((isMedia || isQuotedImage) && args.length >= 2) {
                                            const top = arg1.split('|')[0]
                                            const bottom = arg1.split('|')[1]
                                            const encryptMedia = isQuotedImage ? quotedMsg : message
                                            const mediaData = await decryptMedia(encryptMedia, uaOverride)
                                            const getUrl = await uploadImages(mediaData, false)
                                            const ImageBase64 = await meme.custom(getUrl, top, bottom)
                                            client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                                                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                                                .catch((err) => console.error(err))
                                        } else {
                                            await client.reply(from, 'Tidak ada gambar! Gunakan perintah $meme bersamaan dengan mengirim gambar atau membalas gambar yang sudah ada!', id)
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if ((isMedia || isQuotedImage) && args.length >= 2) {
                                            const top = arg1.split('|')[0]
                                            const bottom = arg1.split('|')[1]
                                            const encryptMedia = isQuotedImage ? quotedMsg : message
                                            const mediaData = await decryptMedia(encryptMedia, uaOverride)
                                            const getUrl = await uploadImages(mediaData, false)
                                            const ImageBase64 = await meme.custom(getUrl, top, bottom)
                                            client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                                                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                                                .catch((err) => console.error(err))
                                        } else {
                                            await client.reply(from, 'Tidak ada gambar! Gunakan perintah $meme bersamaan dengan mengirim gambar atau membalas gambar yang sudah ada!', id)
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if ((isMedia || isQuotedImage) && args.length >= 2) {
                            const top = arg1.split('|')[0]
                            const bottom = arg1.split('|')[1]
                            const encryptMedia = isQuotedImage ? quotedMsg : message
                            const mediaData = await decryptMedia(encryptMedia, uaOverride)
                            const getUrl = await uploadImages(mediaData, false)
                            const ImageBase64 = await meme.custom(getUrl, top, bottom)
                            client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                                .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                                .catch((err) => console.error(err))
                        } else {
                            await client.reply(from, 'Tidak ada gambar! Gunakan perintah $meme bersamaan dengan mengirim gambar atau membalas gambar yang sudah ada!', id)
                        }
                    }
                }
                break
            case `${prefix}stickernobg`:
                if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik: *$preminfo*\nUntuk mengetahui kelebihan user VIP!', id)
                if (isMedia === true) {
                    try {
                        var mediaData = await decryptMedia(message, uaOverride)
                        var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        var base64img = imageBase64
                        var outFile = './media/img/noBg.png'
                        //untuk api key kalian bisa dapatkan pada website remove.bg
                        var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'VLv8PE7axMpzyc1z9QLzrbdM', size: 'auto', type: 'auto', outFile })
                        await fs.writeFile(outFile, result.base64img)
                        await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                    } catch (err) {
                        console.log(err)
                    }
                }
                break
            case `${prefix}donasi`:
            case `${prefix}donate`:
                client.sendText(from, donate)
                break
            case `${prefix}tts`:
                if (isGroupMsg) {
                    if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}tts [id, en, jp, ar] [teks]*, contoh *${prefix}tts id halo semua*`)
                    const ttsId = require('node-gtts')('id')
                    const ttsEn = require('node-gtts')('en')
                    const ttsJp = require('node-gtts')('ja')
                    const ttsAr = require('node-gtts')('ar')
                    const dataText = body.slice(8)
                    // if (dataText === '') return client.reply(from, 'Baka?', id)
                    if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                    var dataBhs = body.slice(5, 7)
                    if (!dataBhs) {
                        ttsId.save('./media/tts/resId.mp3', dataText, function () {
                            client.sendPtt(from, './media/tts/resId.mp3', id)
                        })
                    } else if (dataBhs == 'id') {
                        ttsId.save('./media/tts/resId.mp3', dataText, function () {
                            client.sendPtt(from, './media/tts/resId.mp3', id)
                        })
                    } else if (dataBhs == 'en') {
                        ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                            client.sendPtt(from, './media/tts/resEn.mp3', id)
                        })
                    } else if (dataBhs == 'jp') {
                        ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                            client.sendPtt(from, './media/tts/resJp.mp3', id)
                        })
                    } else if (dataBhs == 'ar') {
                        ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                            client.sendPtt(from, './media/tts/resAr.mp3', id)
                        })
                    } else {
                        client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab.', id)
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}tts [id, en, jp, ar] [teks]*, contoh *${prefix}tts id halo semua*`)
                                        const ttsId = require('node-gtts')('id')
                                        const ttsEn = require('node-gtts')('en')
                                        const ttsJp = require('node-gtts')('ja')
                                        const ttsAr = require('node-gtts')('ar')
                                        const dataText = body.slice(8)
                                        // if (dataText === '') return client.reply(from, 'Baka?', id)
                                        if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                                        var dataBhs = body.slice(5, 7)
                                        if (!dataBhs) {
                                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resId.mp3', id)
                                            })
                                        } else if (dataBhs == 'id') {
                                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resId.mp3', id)
                                            })
                                        } else if (dataBhs == 'en') {
                                            ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resEn.mp3', id)
                                            })
                                        } else if (dataBhs == 'jp') {
                                            ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resJp.mp3', id)
                                            })
                                        } else if (dataBhs == 'ar') {
                                            ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resAr.mp3', id)
                                            })
                                        } else {
                                            client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab.', id)
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}tts [id, en, jp, ar] [teks]*, contoh *${prefix}tts id halo semua*`)
                                        const ttsId = require('node-gtts')('id')
                                        const ttsEn = require('node-gtts')('en')
                                        const ttsJp = require('node-gtts')('ja')
                                        const ttsAr = require('node-gtts')('ar')
                                        const dataText = body.slice(8)
                                        // if (dataText === '') return client.reply(from, 'Baka?', id)
                                        if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                                        var dataBhs = body.slice(5, 7)
                                        if (!dataBhs) {
                                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resId.mp3', id)
                                            })
                                        } else if (dataBhs == 'id') {
                                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resId.mp3', id)
                                            })
                                        } else if (dataBhs == 'en') {
                                            ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resEn.mp3', id)
                                            })
                                        } else if (dataBhs == 'jp') {
                                            ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resJp.mp3', id)
                                            })
                                        } else if (dataBhs == 'ar') {
                                            ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                                                client.sendPtt(from, './media/tts/resAr.mp3', id)
                                            })
                                        } else {
                                            client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab.', id)
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}tts [id, en, jp, ar] [teks]*, contoh *${prefix}tts id halo semua*`)
                        const ttsId = require('node-gtts')('id')
                        const ttsEn = require('node-gtts')('en')
                        const ttsJp = require('node-gtts')('ja')
                        const ttsAr = require('node-gtts')('ar')
                        const dataText = body.slice(8)
                        // if (dataText === '') return client.reply(from, 'Baka?', id)
                        if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang!', id)
                        var dataBhs = body.slice(5, 7)
                        if (!dataBhs) {
                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                client.sendPtt(from, './media/tts/resId.mp3', id)
                            })
                        } else if (dataBhs == 'id') {
                            ttsId.save('./media/tts/resId.mp3', dataText, function () {
                                client.sendPtt(from, './media/tts/resId.mp3', id)
                            })
                        } else if (dataBhs == 'en') {
                            ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                                client.sendPtt(from, './media/tts/resEn.mp3', id)
                            })
                        } else if (dataBhs == 'jp') {
                            ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                                client.sendPtt(from, './media/tts/resJp.mp3', id)
                            })
                        } else if (dataBhs == 'ar') {
                            ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                                client.sendPtt(from, './media/tts/resAr.mp3', id)
                            })
                        } else {
                            client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab.', id)
                        }
                    }
                }
                break
            case `${prefix}wait`:
                if (isGroupMsg) {
                    if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                        if (isMedia) {
                            var mediaData = await decryptMedia(message, uaOverride)
                        } else {
                            var mediaData = await decryptMedia(quotedMsg, uaOverride)
                        }
                        // const fetch = require('node-fetch')
                        const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        client.reply(from, 'Searching....', id)
                        fetch('https://trace.moe/api/search', {
                            method: 'POST',
                            body: JSON.stringify({ image: imgBS4 }),
                            headers: { "Content-Type": "application/json" }
                        })
                            .then(respon => respon.json())
                            .then(resolt => {
                                if (resolt.docs && resolt.docs.length <= 0) {
                                    client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                                }
                                const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                teks = ''
                                if (similarity < 0.92) {
                                    teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                                }
                                teks += ` *Title Japanese* : ${title}\n *Title chinese* : ${title_chinese}\n *Title Romaji* : ${title_romaji}\n *Title English* : ${title_english}\n`
                                teks += ` *Ecchi* : ${is_adult}\n`
                                teks += ` *Eps* : ${episode.toString()}\n`
                                teks += ` *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                                client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                                    client.reply(from, teks, id)
                                })
                            })
                            .catch(() => {
                                client.reply(from, 'Error !', id)
                            })
                    } else {
                        client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                                            if (isMedia) {
                                                var mediaData = await decryptMedia(message, uaOverride)
                                            } else {
                                                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                                            }
                                            // const fetch = require('node-fetch')
                                            const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                            client.reply(from, 'Searching....', id)
                                            fetch('https://trace.moe/api/search', {
                                                method: 'POST',
                                                body: JSON.stringify({ image: imgBS4 }),
                                                headers: { "Content-Type": "application/json" }
                                            })
                                                .then(respon => respon.json())
                                                .then(resolt => {
                                                    if (resolt.docs && resolt.docs.length <= 0) {
                                                        client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                                                    }
                                                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                                    teks = ''
                                                    if (similarity < 0.92) {
                                                        teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                                                    }
                                                    teks += ` *Title Japanese* : ${title}\n *Title chinese* : ${title_chinese}\n *Title Romaji* : ${title_romaji}\n *Title English* : ${title_english}\n`
                                                    teks += ` *Ecchi* : ${is_adult}\n`
                                                    teks += ` *Eps* : ${episode.toString()}\n`
                                                    teks += ` *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                                                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                                                        client.reply(from, teks, id)
                                                    })
                                                })
                                                .catch(() => {
                                                    client.reply(from, 'Error !', id)
                                                })
                                        } else {
                                            client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                                            if (isMedia) {
                                                var mediaData = await decryptMedia(message, uaOverride)
                                            } else {
                                                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                                            }
                                            // const fetch = require('node-fetch')
                                            const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                            client.reply(from, 'Searching....', id)
                                            fetch('https://trace.moe/api/search', {
                                                method: 'POST',
                                                body: JSON.stringify({ image: imgBS4 }),
                                                headers: { "Content-Type": "application/json" }
                                            })
                                                .then(respon => respon.json())
                                                .then(resolt => {
                                                    if (resolt.docs && resolt.docs.length <= 0) {
                                                        client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                                                    }
                                                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                                    teks = ''
                                                    if (similarity < 0.92) {
                                                        teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                                                    }
                                                    teks += ` *Title Japanese* : ${title}\n *Title chinese* : ${title_chinese}\n *Title Romaji* : ${title_romaji}\n *Title English* : ${title_english}\n`
                                                    teks += ` *Ecchi* : ${is_adult}\n`
                                                    teks += ` *Eps* : ${episode.toString()}\n`
                                                    teks += ` *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                                                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                                                        client.reply(from, teks, id)
                                                    })
                                                })
                                                .catch(() => {
                                                    client.reply(from, 'Error !', id)
                                                })
                                        } else {
                                            client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                            if (isMedia) {
                                var mediaData = await decryptMedia(message, uaOverride)
                            } else {
                                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                            }
                            // const fetch = require('node-fetch')
                            const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            client.reply(from, 'Searching....', id)
                            fetch('https://trace.moe/api/search', {
                                method: 'POST',
                                body: JSON.stringify({ image: imgBS4 }),
                                headers: { "Content-Type": "application/json" }
                            })
                                .then(respon => respon.json())
                                .then(resolt => {
                                    if (resolt.docs && resolt.docs.length <= 0) {
                                        client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                                    }
                                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                    teks = ''
                                    if (similarity < 0.92) {
                                        teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                                    }
                                    teks += ` *Title Japanese* : ${title}\n *Title chinese* : ${title_chinese}\n *Title Romaji* : ${title_romaji}\n *Title English* : ${title_english}\n`
                                    teks += ` *Ecchi* : ${is_adult}\n`
                                    teks += ` *Eps* : ${episode.toString()}\n`
                                    teks += ` *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                                        client.reply(from, teks, id)
                                    })
                                })
                                .catch(() => {
                                    client.reply(from, 'Error !', id)
                                })
                        } else {
                            client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Neh contoh mhank!', id)
                        }
                    }
                }
                break
            case `${prefix}ytmp3`:
                // if (!isOwner) return client.reply(from, 'Maaf, Fitur dalam perbaikan!', id)
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}ytmp3 [linkYt]*`)
                const isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinks) return client.reply(from, mess.error.Iv, id)
                if (!args[1].startsWith('https://')) return client.reply(from, 'Maaf link tidak valid!', id)
                client.reply(from, `Mohon Tunggu... Sedang dalam proses pencarian data!`, id)
                try {
                    if (isGroupMsg) {
                        if (args[1].startsWith('https://youtu.be/')) {
                            request.get({
                                url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                    client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                } else {
                                    const { imgUrl, size, UrlMp3, title } = data.result
                                    client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                }
                            })
                        } else if (args[1].startsWith('https://www.youtube.com/')) {
                            request.get({
                                url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${vhTear}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                    client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                } else {
                                    const { imgUrl, size, UrlMp3, title } = data.result
                                    client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                }
                            })
                        } else {
                            client.reply(from, 'Link Tidak Valid!!!', id)
                        }
                    } else {
                        if (!isVIP) {
                            sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql, async function (err, result) {
                                if (err) throw err;
                                if (result.length !== 1) {
                                    await saveNo(nomernya)
                                    var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql2, async function (err, result) {
                                            if (err) throw err;
                                            if (args[1].startsWith('https://youtu.be/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        const { imgUrl, size, UrlMp3, title } = data.result
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                                    }
                                                })
                                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        const { imgUrl, size, UrlMp3, title } = data.result
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                                    }
                                                })
                                            } else {
                                                client.reply(from, 'Link Tidak Valid!!!', id)
                                            }
                                        });
                                    });
                                } else {
                                    sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql1, async function (err, result) {
                                            if (err) throw err;
                                            if (args[1].startsWith('https://youtu.be/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        const { imgUrl, size, UrlMp3, title } = data.result
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                                    }
                                                })
                                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        const { imgUrl, size, UrlMp3, title } = data.result
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                                    }
                                                })
                                            } else {
                                                client.reply(from, 'Link Tidak Valid!!!', id)
                                            }
                                        });
                                    });
                                }
                            });
                        } else {
                            if (args[1].startsWith('https://youtu.be/')) {
                                request.get({
                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                    json: true,
                                    headers: {
                                        'User-Agent': 'request'
                                    }
                                }, (err, res, data) => {
                                    if (err) {
                                        console.log('Error : ', err);
                                    } else if (res.statusCode !== 200) {
                                        console.log('Status:', res.statusCode);
                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                    } else {
                                        const { imgUrl, size, UrlMp3, title } = data.result
                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                    }
                                })
                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                request.get({
                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${vhTear}`,
                                    json: true,
                                    headers: {
                                        'User-Agent': 'request'
                                    }
                                }, (err, res, data) => {
                                    if (err) {
                                        console.log('Error : ', err);
                                    } else if (res.statusCode !== 200) {
                                        console.log('Status:', res.statusCode);
                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                    } else {
                                        const { imgUrl, size, UrlMp3, title } = data.result
                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`))
                                    }
                                })
                            } else {
                                client.reply(from, 'Link Tidak Valid!!!', id)
                            }
                        }
                    }
                } catch (err) {
                    client.sendText(ownerNumber, 'Error ytmp3 : ' + err)
                    client.reply(from, mess.error.Yt3, id)
                }
                break
            case `${prefix}spotify`:
                if (!isOwner) return client.reply(from, 'Maaf, Fitur dalam perbaikan!', id)
                const spotiQuery = body.slice(9);
                if (isGroupMsg) {
                    if (!spotiQuery) return client.reply(from, `Maaf, Format salah!\n\n*Example:*\n${prefix}spotify Alan walker alone`, id)
                    request.get({
                        url: `https://api.vhtear.com/spotify?query=${spotiQuery}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                            client.reply(from, data.error, id)
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { title, duration, url, popularity, music_prev } = data.result.result[0]
                            if (!title) return client.reply(from, 'Maaf, music yang anda maksud tidak di temukan!', id)
                            client.reply(from, `*Title:* ${title}\n*Duration:* ${duration}\n*Popularity:* ${popularity}\n*Link:* ${url}`, id)
                            client.sendFileFromUrl(from, music_prev, `${title}.mp3`, ``, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (!spotiQuery) return client.reply(from, `Maaf, Format salah!\n\n*Example:*\n${prefix}spotify Alan walker alone`, id)
                                        request.get({
                                            url: `https://api.vhtear.com/spotify?query=${spotiQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, async (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                                client.reply(from, data.error, id)
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { title, duration, url, popularity, music_prev } = data.result.result[0]
                                                if (!title) return client.reply(from, 'Maaf, music yang anda maksud tidak di temukan!', id)
                                                client.reply(from, `*Title:* ${title}\n*Duration:* ${duration}\n*Popularity:* ${popularity}\n*Link:* ${url}`, id)
                                                client.sendFileFromUrl(from, music_prev, `${title}.mp3`, ``, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (!spotiQuery) return client.reply(from, `Maaf, Format salah!\n\n*Example:*\n${prefix}spotify Alan walker alone`, id)
                                        request.get({
                                            url: `https://api.vhtear.com/spotify?query=${spotiQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, async (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                                client.reply(from, data.error, id)
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { title, duration, url, popularity, music_prev } = data.result.result[0]
                                                if (!title) return client.reply(from, 'Maaf, music yang anda maksud tidak di temukan!', id)
                                                client.reply(from, `*Title:* ${title}\n*Duration:* ${duration}\n*Popularity:* ${popularity}\n*Link:* ${url}`, id)
                                                client.sendFileFromUrl(from, music_prev, `${title}.mp3`, ``, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        if (!spotiQuery) return client.reply(from, `Maaf, Format salah!\n\n*Example:*\n${prefix}spotify Alan walker alone`, id)
                        request.get({
                            url: `https://api.vhtear.com/spotify?query=${spotiQuery}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, async (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                                client.reply(from, data.error, id)
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { title, duration, url, popularity, music_prev } = data.result.result[0]
                                if (!title) return client.reply(from, 'Maaf, music yang anda maksud tidak di temukan!', id)
                                client.reply(from, `*Title:* ${title}\n*Duration:* ${duration}\n*Popularity:* ${popularity}\n*Link:* ${url}`, id)
                                client.sendFileFromUrl(from, music_prev, `${title}.mp3`, ``, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}unsplash`:
                const Unsplash = require('unsplash-js').default;
                const toJson = require('unsplash-js').toJson;
                const unsplash = new Unsplash({ accessKey: 'UBgnbgBEIRE2QXAWVl3fZZhV_3X5OIrHcjWeAWS5COQ' });
                const unsplashQuery = body.slice(10)
                if (isGroupMsg) {
                    unsplash.search.photos(unsplashQuery, 1, 10, { orientation: "portrait", color: "green" })
                        .then(toJson)
                        .then(json1 => {
                            var randomSplash = json1.results[Math.floor(Math.random() * json1.results.length)];
                            if (!randomSplash) return client.reply(from, 'Maaf, tidak ada foto yang di temukan!', id)
                            unsplash.photos.getPhoto(randomSplash.id)
                                .then(toJson)
                                .then(json => {
                                    client.sendFileFromUrl(from, json.urls.full, 'unsplash.jpg', '', id)
                                });
                        });
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        unsplash.search.photos(unsplashQuery, 1, 10, { orientation: "portrait", color: "green" })
                                            .then(toJson)
                                            .then(json1 => {
                                                var randomSplash = json1.results[Math.floor(Math.random() * json1.results.length)];
                                                if (!randomSplash) return client.reply(from, 'Maaf, tidak ada foto yang di temukan!', id)
                                                unsplash.photos.getPhoto(randomSplash.id)
                                                    .then(toJson)
                                                    .then(json => {
                                                        client.sendFileFromUrl(from, json.urls.full, 'unsplash.jpg', '', id)
                                                    });
                                            });
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        unsplash.search.photos(unsplashQuery, 1, 10, { orientation: "portrait", color: "green" })
                                            .then(toJson)
                                            .then(json1 => {
                                                var randomSplash = json1.results[Math.floor(Math.random() * json1.results.length)];
                                                if (!randomSplash) return client.reply(from, 'Maaf, tidak ada foto yang di temukan!', id)
                                                unsplash.photos.getPhoto(randomSplash.id)
                                                    .then(toJson)
                                                    .then(json => {
                                                        client.sendFileFromUrl(from, json.urls.full, 'unsplash.jpg', '', id)
                                                    });
                                            });
                                    });
                                });
                            }
                        });
                    } else {
                        unsplash.search.photos(unsplashQuery, 1, 10, { orientation: "portrait", color: "green" })
                            .then(toJson)
                            .then(json1 => {
                                var randomSplash = json1.results[Math.floor(Math.random() * json1.results.length)];
                                if (!randomSplash) return client.reply(from, 'Maaf, tidak ada foto yang di temukan!', id)
                                unsplash.photos.getPhoto(randomSplash.id)
                                    .then(toJson)
                                    .then(json => {
                                        client.sendFileFromUrl(from, json.urls.full, 'unsplash.jpg', '', id)
                                    });
                            });
                    }
                }
                break
            case `${prefix}ytmp4`:
                // if (!isOwner) return client.reply(from, 'Maaf, Fitur dalam perbaikan!', id)
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}ytmp4[linkYt]*, `)
                let isLin = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLin) return client.reply(from, mess.error.Iv, id)
                if (!args[1].startsWith('https://')) return client.reply(from, 'Maaf link tidak valid!', id)
                await client.reply(from, 'Mohon tunggu... Sedang mengambil data.', id);
                try {
                    if (isGroupMsg) {
                        if (args[1].startsWith('https://youtu.be/')) {
                            request.get({
                                url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, async (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                    client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                } else {
                                    // ! VHThears YTDL
                                    const { imgUrl, size, UrlVideo, title } = data.result
                                    if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                    client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                    // ! MBB YTDL
                                    // const { filesize, result, thumb, title } = data
                                    // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                    // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                    // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                }
                            })
                        } else if (args[1].startsWith('https://www.youtube.com/')) {
                            request.get({
                                url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${mhankBB}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, async (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                    client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                } else {
                                    // ! VHThears YTDL
                                    const { imgUrl, size, UrlVideo, title } = data.result
                                    if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                    client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                    // ! MBB YTDL
                                    // const { filesize, result, thumb, title } = data
                                    // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                    // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                    // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                }
                            })
                        } else {
                            client.reply(from, 'Link Tidak Valid!!!', id)
                        }
                    } else {
                        if (!isVIP) {
                            sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql, async function (err, result) {
                                if (err) throw err;
                                if (result.length !== 1) {
                                    await saveNo(nomernya)
                                    var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql2, async function (err, result) {
                                            if (err) throw err;
                                            if (args[1].startsWith('https://youtu.be/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, async (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        // ! VHThears YTDL
                                                        const { imgUrl, size, UrlVideo, title } = data.result
                                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                                        // ! MBB YTDL
                                                        // const { filesize, result, thumb, title } = data
                                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                                    }
                                                })
                                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${mhankBB}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, async (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        // ! VHThears YTDL
                                                        const { imgUrl, size, UrlVideo, title } = data.result
                                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                                        // ! MBB YTDL
                                                        // const { filesize, result, thumb, title } = data
                                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                                    }
                                                })
                                            } else {
                                                client.reply(from, 'Link Tidak Valid!!!', id)
                                            }
                                        });
                                    });
                                } else {
                                    sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql1, async function (err, result) {
                                            if (err) throw err;
                                            if (args[1].startsWith('https://youtu.be/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, async (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        // ! VHThears YTDL
                                                        const { imgUrl, size, UrlVideo, title } = data.result
                                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                                        // ! MBB YTDL
                                                        // const { filesize, result, thumb, title } = data
                                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                                    }
                                                })
                                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                                request.get({
                                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${mhankBB}`,
                                                    json: true,
                                                    headers: {
                                                        'User-Agent': 'request'
                                                    }
                                                }, async (err, res, data) => {
                                                    if (err) {
                                                        console.log('Error : ', err);
                                                    } else if (res.statusCode !== 200) {
                                                        console.log('Status:', res.statusCode);
                                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                                    } else {
                                                        // ! VHThears YTDL
                                                        const { imgUrl, size, UrlVideo, title } = data.result
                                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                                        // ! MBB YTDL
                                                        // const { filesize, result, thumb, title } = data
                                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                                    }
                                                })
                                            } else {
                                                client.reply(from, 'Link Tidak Valid!!!', id)
                                            }
                                        });
                                    });
                                }
                            });
                        } else {
                            if (args[1].startsWith('https://youtu.be/')) {
                                request.get({
                                    url: `https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhTear}`,
                                    json: true,
                                    headers: {
                                        'User-Agent': 'request'
                                    }
                                }, async (err, res, data) => {
                                    if (err) {
                                        console.log('Error : ', err);
                                    } else if (res.statusCode !== 200) {
                                        console.log('Status:', res.statusCode);
                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                    } else {
                                        // ! VHThears YTDL
                                        const { imgUrl, size, UrlVideo, title } = data.result
                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                        // ! MBB YTDL
                                        // const { filesize, result, thumb, title } = data
                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                    }
                                })
                            } else if (args[1].startsWith('https://www.youtube.com/')) {
                                request.get({
                                    url: `https://api.vhtear.com/ytdl?link=https://youtu.be/${args[1].split('v=')}&apikey=${mhankBB}`,
                                    json: true,
                                    headers: {
                                        'User-Agent': 'request'
                                    }
                                }, async (err, res, data) => {
                                    if (err) {
                                        console.log('Error : ', err);
                                    } else if (res.statusCode !== 200) {
                                        console.log('Status:', res.statusCode);
                                        client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                    } else {
                                        // ! VHThears YTDL
                                        const { imgUrl, size, UrlVideo, title } = data.result
                                        if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                        client.sendFileFromUrl(from, imgUrl, 'KZ0-YTDL.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id))

                                        // ! MBB YTDL
                                        // const { filesize, result, thumb, title } = data
                                        // if (Number(filesize.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                        // await client.sendFileFromUrl(from, thumb, `[DATA DITEMUKAN]\n\n${title}.jpg`, `*Title:* ${title}\n*Size:* ${filesize}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id)
                                        // await client.sendFileFromUrl(from, result, `${title}.mp4`, '', id)
                                    }
                                })
                            } else {
                                client.reply(from, 'Link Tidak Valid!!!', id)
                            }
                        }
                    }
                } catch (er) {
                    client.sendText(ownerNumber, 'Error ytmp4 : ' + er)
                    client.reply(from, 'Maaf, error di yang disebabkan oleh sistem.', id)
                }
                break
            case `${prefix}ytsearch`:
                // if (!isOwner) return client.reply(from, 'Maaf, Fitur dalam perbaikan!', id)
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}ytmp4 [linkYt]*,`)
                const ytTitle = body.slice(10)
                try {
                    client.reply(from, mess.wait, id)
                    request.get({
                        url: `https://api.i-tech.id/dl/yts?key=${iTechApi}&query=${ytTitle}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                            client.reply(from, data.error, id)
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { image, url, channel, duration, title } = data.result[0]
                            client.sendFileFromUrl(from, image, 'KYUZ0-YOUTUBE-SEARCH.jpg', `*Title:* ${title}\n*Channel:* ${channel}\n*Duration:* ${duration}\n*Link:* ${url}`, id)
                        }
                    })
                } catch (er) {
                    client.sendText(ownerNumber, 'Error ytsearch : ' + er)
                    client.reply(from, 'Maaf, error di yang disebabkan oleh sistem.', id)
                }
                break
            case `${prefix}ytplay`:
                // if (!isOwner) return client.reply(from, 'Maaf, Fitur dalam perbaikan!', id)
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}ytplay [title]*,`)
                const ytTitle2 = encodeURI(body.slice(8))
                if (!ytTitle2) return client.reply(from, 'Format salah! Silahkan cek *$menu* untuk melihat format yang benar!', id)
                await client.reply(from, 'Mohon tunggu... Sedang mengambil data!', id)
                try {
                    if (isGroupMsg) {
                        request.get({
                            url: `https://api.vhtear.com/ytmp3?query=${ytTitle2}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, async (err, res, data) => {
                            const { title, image, duration, size, mp3 } = data.result
                            if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                            client.sendFileFromUrl(from, image, 'KZ0-YTPLAY.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, mp3, `${title}.mp3`))
                        })
                    } else {
                        if (!isVIP) {
                            sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql, async function (err, result) {
                                if (err) throw err;
                                if (result.length !== 1) {
                                    await saveNo(nomernya)
                                    var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql2, async function (err, result) {
                                            if (err) throw err;
                                            request.get({
                                                url: `https://api.vhtear.com/ytmp3?query=${ytTitle2}&apikey=${vhTear}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, async (err, res, data) => {
                                                const { title, image, duration, size, mp3 } = data.result
                                                if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                client.sendFileFromUrl(from, image, 'KZ0-YTPLAY.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, mp3, `${title}.mp3`))
                                            })
                                        });
                                    });
                                } else {
                                    sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql1, async function (err, result) {
                                            if (err) throw err;
                                            request.get({
                                                url: `https://api.vhtear.com/ytmp3?query=${ytTitle2}&apikey=${vhTear}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, async (err, res, data) => {
                                                const { title, image, duration, size, mp3 } = data.result
                                                if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                                client.sendFileFromUrl(from, image, 'KZ0-YTPLAY.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, mp3, `${title}.mp3`))
                                            })
                                        });
                                    });
                                }
                            });
                        } else {
                            request.get({
                                url: `https://api.vhtear.com/ytmp3?query=${ytTitle2}&apikey=${vhTear}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, async (err, res, data) => {
                                const { title, image, duration, size, mp3 } = data.result
                                if (Number(size.split(' MB')[0] > 64)) return client.reply(from, 'Maaf, Ukuran file terlalu besar!', id)
                                client.sendFileFromUrl(from, image, 'KZ0-YTPLAY.jpg', `[DATA DITEMUKAN]\n\n*Title:* ${title}\n*Duration:* ${duration}\n*Size:* ${size}\n\nMohon tunggu beberapa saat, dalam proses pengiriman file!`, id).then(() => client.sendFileFromUrl(from, mp3, `${title}.mp3`))
                            })
                        }
                    }
                } catch (er) {
                    client.sendText(ownerNumber, 'Error ytsearch : ' + er)
                    client.reply(from, 'Maaf, error di yang disebabkan oleh sistem.', id)
                }
                break
            case `${prefix}wiki`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}wiki [query]*\nContoh : *${prefix}wiki asu*`, id)
                const query_ = body.slice(6)
                request.get({
                    url: `https://api.i-tech.id/tools/wiki?key=${iTechApi}&query=${query_}`,
                    json: true,
                    headers: {
                        'User-Agent': 'request'
                    }
                }, (err, res, data) => {
                    if (err) {
                        console.log('Error : ', err);
                    } else if (res.statusCode !== 200) {
                        console.log('Status:', res.statusCode);
                    } else {
                        if (data.result === undefined) return client.reply(from, 'Maaf, kata kunci yang anda masukan tidak tersedia di wikipedia!')
                        const wikiImage = 'https://spoonvision.files.wordpress.com/2018/09/wiki-image.jpg'
                        client.sendFileFromUrl(from, wikiImage, 'Wikipedia.jpg', `${data.result}`, id)
                    }
                })
                break
            case `${prefix}ptl`:
                if (args.length !== 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}ptl* untuk menggunakan perintah ini`, id)
                if (isGroupMsg) {
                    await client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://api.i-tech.id/tools/gambar?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                            client.sendFileFromUrl(from, data.result, 'ptl.jpg', '', id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        await client.reply(from, '_Please wait..._', id)
                                        request.get({
                                            url: `https://api.i-tech.id/tools/gambar?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.sendFileFromUrl(from, data.result, 'ptl.jpg', '', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        await client.reply(from, '_Please wait..._', id)
                                        request.get({
                                            url: `https://api.i-tech.id/tools/gambar?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.sendFileFromUrl(from, data.result, 'ptl.jpg', '', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        await client.reply(from, '_Please wait..._', id)
                        request.get({
                            url: `https://api.i-tech.id/tools/gambar?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                client.sendFileFromUrl(from, data.result, 'ptl.jpg', '', id)
                            }
                        })
                    }
                }
                break
            case `${prefix}tebakgambar`:
                if (args.length !== 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}ptl* untuk menggunakan perintah ini`, id)
                if (isGroupMsg) {
                    await client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://api.vhtear.com/tebakgambar&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { soalImg, jawaban } = data.result
                            if (!soalImg) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                            client.sendFileFromUrl(from, soalImg, 'KZ0-TEBAK-GAMBAr.jpg', `*Jawaban:* ${jawaban}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        await client.reply(from, '_Please wait..._', id)
                                        request.get({
                                            url: `https://api.vhtear.com/tebakgambar&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { soalImg, jawaban } = data.result
                                                if (!soalImg) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.sendFileFromUrl(from, soalImg, 'KZ0-TEBAK-GAMBAr.jpg', `*Jawaban:* ${jawaban}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        await client.reply(from, '_Please wait..._', id)
                                        request.get({
                                            url: `https://api.vhtear.com/tebakgambar&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { soalImg, jawaban } = data.result
                                                if (!soalImg) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.sendFileFromUrl(from, soalImg, 'KZ0-TEBAK-GAMBAr.jpg', `*Jawaban:* ${jawaban}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        await client.reply(from, '_Please wait..._', id)
                        request.get({
                            url: `https://api.vhtear.com/tebakgambar&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { soalImg, jawaban } = data.result
                                if (!soalImg) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                client.sendFileFromUrl(from, soalImg, 'KZ0-TEBAK-GAMBAr.jpg', `*Jawaban:* ${jawaban}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}nulis`:
                if (args.length === 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}nulis* _text_ untuk menggunakan perintah ini`, id)
                if (isGroupMsg) {
                    const textQuery = encodeURI(body.slice(7))
                    const textUrl = `https://api.vhtear.com/write?text=${textQuery}&apikey=KyuChingZeroBot`;
                    client.sendFileFromUrl(from, textUrl, 'nulis.jpg', '', id)
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        const textQuery = encodeURI(body.slice(7))
                                        const textUrl = `https://api.vhtear.com/write?text=${textQuery}&apikey=KyuChingZeroBot`;
                                        client.sendFileFromUrl(from, textUrl, 'nulis.jpg', '', id)
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        const textQuery = encodeURI(body.slice(7))
                                        const textUrl = `https://api.vhtear.com/write?text=${textQuery}&apikey=KyuChingZeroBot`;
                                        client.sendFileFromUrl(from, textUrl, 'nulis.jpg', '', id)
                                    });
                                });
                            }
                        });
                    } else {
                        const textQuery = encodeURI(body.slice(7))
                        const textUrl = `https://api.vhtear.com/write?text=${textQuery}&apikey=KyuChingZeroBot`;
                        client.sendFileFromUrl(from, textUrl, 'nulis.jpg', '', id)
                    }
                }
                break
            case `${prefix}hilih`:
                if (args.length === 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}hilih* _[text]_ untuk menggunakan perintah ini`, id)
                const hilihQuery = encodeURI(body.slice(7))
                if (!hilihQuery) return client.reply(from, `Maaf, Format yang anda masukan salah! Kirim perintah *${prefix}hilih* _[text]_ untuk menggunakan fitur ini!`)
                request.get({
                    url: `https://api.i-tech.id/tools/hilih?key=${iTechApi}&kata=${hilihQuery}`,
                    json: true,
                    headers: {
                        'User-Agent': 'request'
                    }
                }, (err, res, data) => {
                    if (err) {
                        console.log('Error : ', err);
                    } else if (res.statusCode !== 200) {
                        console.log('Status:', res.statusCode);
                    } else {
                        if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                        client.reply(from, data.result, id)
                    }
                })
                break
            case `${prefix}wallhaven`:
                if (args.length < 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}wallhaven* _[theme]_ untuk menggunakan perintah ini`, id)
                const whQuery = body.slice(11)
                if (!whQuery) return client.reply(from, `Format Salah! Hanya ketik *${prefix}wallhaven* _[theme]_ untuk menggunakan perintah ini`, id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://wallhaven.cc/api/v1/search?apikey=PEKuG0q480RO4bdUZfB1FUmiMHZkf0HO&q=${whQuery}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (!data) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                            var randomWall = data.data[Math.floor(Math.random() * data.data.length)];
                            const { resolution, created_at, path, category } = randomWall
                            client.sendFileFromUrl(from, path, 'WallHaven.jpg', `*Category:* ${category}\n*Resolution:* ${resolution}\n*Created At:* ${created_at}`)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://wallhaven.cc/api/v1/search?apikey=PEKuG0q480RO4bdUZfB1FUmiMHZkf0HO&q=${whQuery}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                var randomWall = data.data[Math.floor(Math.random() * data.data.length)];
                                                const { resolution, created_at, path, category } = randomWall
                                                client.sendFileFromUrl(from, path, 'WallHaven.jpg', `*Category:* ${category}\n*Resolution:* ${resolution}\n*Created At:* ${created_at}`)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://wallhaven.cc/api/v1/search?apikey=PEKuG0q480RO4bdUZfB1FUmiMHZkf0HO&q=${whQuery}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                var randomWall = data.data[Math.floor(Math.random() * data.data.length)];
                                                const { resolution, created_at, path, category } = randomWall
                                                client.sendFileFromUrl(from, path, 'WallHaven.jpg', `*Category:* ${category}\n*Resolution:* ${resolution}\n*Created At:* ${created_at}`)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://wallhaven.cc/api/v1/search?apikey=PEKuG0q480RO4bdUZfB1FUmiMHZkf0HO&q=${whQuery}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (!data) return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                var randomWall = data.data[Math.floor(Math.random() * data.data.length)];
                                const { resolution, created_at, path, category } = randomWall
                                client.sendFileFromUrl(from, path, 'WallHaven.jpg', `*Category:* ${category}\n*Resolution:* ${resolution}\n*Created At:* ${created_at}`)
                            }
                        })
                    }
                }
                break
            case `${prefix}alay`:
                if (args.length === 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}alay* _[text]_ untuk menggunakan perintah ini`, id)
                const alayQuery = encodeURI(body.slice(6))
                if (!alayQuery) return client.reply(from, `Maaf, Format yang anda masukan salah! Kirim perintah *${prefix}alay* _[text]_ untuk menggunakan fitur ini!`)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/alay?key=${iTechApi}&kata=${alayQuery}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                            client.reply(from, data.result, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/alay?key=${iTechApi}&kata=${alayQuery}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.reply(from, data.result, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/alay?key=${iTechApi}&kata=${alayQuery}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                                client.reply(from, data.result, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/alay?key=${iTechApi}&kata=${alayQuery}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.status === 'error') return client.reply(from, 'Maaf, perintah ini dalam perbaikan!', id);
                                client.reply(from, data.result, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}cuaca`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}cuaca [tempat]*\nContoh : *${prefix}cuaca tangerang`, id)
                const tempat = body.slice(7)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/cuaca?key=${iTechApi}&kota=${tempat}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                            if (!tempat) return client.reply(from, 'Maaf, lokasi yang anda maksud tidak tersedia!', id)
                            client.reply(from, `*Nama Kota:* ${tempat}\n*Cuaca:* ${cuaca}\n*Deskripsi:* ${deskripsi}\n*Suhu:* ${suhu}\n*Tingkat Kelembapan:* ${kelembapan}\n*Udara:* ${udara}\n*Angin:* ${angin}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/cuaca?key=${iTechApi}&kota=${tempat}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                                                if (!tempat) return client.reply(from, 'Maaf, lokasi yang anda maksud tidak tersedia!', id)
                                                client.reply(from, `*Nama Kota:* ${tempat}\n*Cuaca:* ${cuaca}\n*Deskripsi:* ${deskripsi}\n*Suhu:* ${suhu}\n*Tingkat Kelembapan:* ${kelembapan}\n*Udara:* ${udara}\n*Angin:* ${angin}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/cuaca?key=${iTechApi}&kota=${tempat}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                                                if (!tempat) return client.reply(from, 'Maaf, lokasi yang anda maksud tidak tersedia!', id)
                                                client.reply(from, `*Nama Kota:* ${tempat}\n*Cuaca:* ${cuaca}\n*Deskripsi:* ${deskripsi}\n*Suhu:* ${suhu}\n*Tingkat Kelembapan:* ${kelembapan}\n*Udara:* ${udara}\n*Angin:* ${angin}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/cuaca?key=${iTechApi}&kota=${tempat}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                                if (!tempat) return client.reply(from, 'Maaf, lokasi yang anda maksud tidak tersedia!', id)
                                client.reply(from, `*Nama Kota:* ${tempat}\n*Cuaca:* ${cuaca}\n*Deskripsi:* ${deskripsi}\n*Suhu:* ${suhu}\n*Tingkat Kelembapan:* ${kelembapan}\n*Udara:* ${udara}\n*Angin:* ${angin}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}artinama`:
                if (args.length < 2) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
                await client.reply(from, '_Please wait..._', id)
                const namaMu = body.slice(10).toUpperCase();
                const regex04 = / /gi;
                const iniNama = namaMu.replace(regex04, '+')
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/arti?key=${iTechApi}&nama=${iniNama}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.reply(from, `Arti dari *${namaMu}*:\n\n${data.arti}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/arti?key=${iTechApi}&nama=${iniNama}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `Arti dari *${namaMu}*:\n\n${data.arti}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/arti?key=${iTechApi}&nama=${iniNama}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `Arti dari *${namaMu}*:\n\n${data.arti}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/arti?key=${iTechApi}&nama=${iniNama}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.reply(from, `Arti dari *${namaMu}*:\n\n${data.arti}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}fb`:
            case `${prefix}facebook`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}fb [linkFb]*`, id)
                if (!args[1].includes('facebook.com')) return client.reply(from, mess.error.Iv, id)
                client.reply(from, mess.wait, id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/dl/fb?key=${iTechApi}&link=${args[1]}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                            client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                        } else {
                            if (!data.link) return client.reply(from, 'Maaf, data tidak di temukan! Mungkin link bersifat private', id)
                            const fbDataLink = data.link.slice(8, 13);
                            if (fbDataLink === 'video') {
                                client.sendFileFromUrl(from, data.link, `fbVideo.mp4`, '', id)
                            } else {
                                client.sendFileFromUrl(from, data.link, `fbImage.jpg`, '', id)
                            }
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/fb?key=${iTechApi}&link=${args[1]}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                                client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                            } else {
                                                if (!data.link) return client.reply(from, 'Maaf, data tidak di temukan! Mungkin link bersifat private', id)
                                                const fbDataLink = data.link.slice(8, 13);
                                                if (fbDataLink === 'video') {
                                                    client.sendFileFromUrl(from, data.link, `fbVideo.mp4`, '', id)
                                                } else {
                                                    client.sendFileFromUrl(from, data.link, `fbImage.jpg`, '', id)
                                                }
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/fb?key=${iTechApi}&link=${args[1]}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                                client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                                            } else {
                                                if (!data.link) return client.reply(from, 'Maaf, data tidak di temukan! Mungkin link bersifat private', id)
                                                const fbDataLink = data.link.slice(8, 13);
                                                if (fbDataLink === 'video') {
                                                    client.sendFileFromUrl(from, data.link, `fbVideo.mp4`, '', id)
                                                } else {
                                                    client.sendFileFromUrl(from, data.link, `fbImage.jpg`, '', id)
                                                }
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/dl/fb?key=${iTechApi}&link=${args[1]}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                                client.reply(from, 'Maaf link bermasalah yang di sebabkan post bersifat private!', id)
                            } else {
                                if (!data.link) return client.reply(from, 'Maaf, data tidak di temukan! Mungkin link bersifat private', id)
                                const fbDataLink = data.link.slice(8, 13);
                                if (fbDataLink === 'video') {
                                    client.sendFileFromUrl(from, data.link, `fbVideo.mp4`, '', id)
                                } else {
                                    client.sendFileFromUrl(from, data.link, `fbImage.jpg`, '', id)
                                }
                            }
                        })
                    }
                }
                break
            case `${prefix}ig`:
            case `${prefix}instagram`:
                if (args.length !== 2) return client.reply(from, `Kirim perintah *${prefix}ig [linkIg]*`, id)
                const igUrl = body.split(' ')[1]
                if (!igUrl.startsWith('https://www.instagram.com')) return client.reply(from, 'Maaf, ini bukan link instagram!')
                client.reply(from, mess.wait, id)
                if (isGroupMsg) {
                    request.get({
                        url: `http://keepsaveit.com/api?api_key=${keepSave}&url=${igUrl}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                            client.reply(from, data.msg, id)
                        } else {
                            const { title, links } = data.response
                            const { ext, url, size } = links
                            const regexIg = /\\\//gi;
                            const thisUrlIg = url.replace(regexIg, '/')
                            if (ext === 'mp4') {
                                client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp4', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                            } else {
                                client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp3', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                            }
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `http://keepsaveit.com/api?api_key=${keepSave}&url=${igUrl}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                                client.reply(from, data.msg, id)
                                            } else {
                                                const { title, links } = data.response
                                                const { ext, url, size } = links
                                                const regexIg = /\\\//gi;
                                                const thisUrlIg = url.replace(regexIg, '/')
                                                if (ext === 'mp4') {
                                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp4', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                                } else {
                                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp3', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                                }
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `http://keepsaveit.com/api?api_key=${keepSave}&url=${igUrl}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                                client.reply(from, data.msg, id)
                                            } else {
                                                const { title, links } = data.response
                                                const { ext, url, size } = links
                                                const regexIg = /\\\//gi;
                                                const thisUrlIg = url.replace(regexIg, '/')
                                                if (ext === 'mp4') {
                                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp4', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                                } else {
                                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp3', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                                }
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `http://keepsaveit.com/api?api_key=${keepSave}&url=${igUrl}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                                client.reply(from, data.msg, id)
                            } else {
                                const { title, links } = data.response
                                const { ext, url, size } = links
                                const regexIg = /\\\//gi;
                                const thisUrlIg = url.replace(regexIg, '/')
                                if (ext === 'mp4') {
                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp4', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                } else {
                                    client.sendFileFromUrl(from, thisUrlIg, 'KZ0-IGDL.mp3', `*From:* ${title.split(' on')[0]}\n*Size:* ${size}`, id)
                                }
                            }
                        })
                    }
                }
                break
            case `${prefix}tiktok`:
                if (args.length !== 2) return client.reply(from, `Kirim perintah *${prefix}tiktok [linkTiktok]*`, id)
                const tkLink = body.split(' ')[1]
                if (!tkLink.startsWith('https://www.tiktok.com/') && !tkLink.startsWith('https://vt.tiktok.com/')) return client.reply(from, 'Maaf, ini bukan link tiktok !', id)
                client.reply(from, mess.wait, id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/dl/tiktok?key=${iTechApi}&link=${tkLink}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { video, created_at, description, title } = data
                            client.sendFileFromUrl(from, video, `KZ0-Tiktok-Downloader.mp4`, `*From:* ${title.split(' on ')[0]}\n*Created At:* ${created_at}\n*Description:* ${description}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/tiktok?key=${iTechApi}&link=${tkLink}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { video, created_at, description, title } = data
                                                client.sendFileFromUrl(from, video, `KZ0-Tiktok-Downloader.mp4`, `*From:* ${title.split(' on ')[0]}\n*Created At:* ${created_at}\n*Description:* ${description}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/tiktok?key=${iTechApi}&link=${tkLink}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { video, created_at, description, title } = data
                                                client.sendFileFromUrl(from, video, `KZ0-Tiktok-Downloader.mp4`, `*From:* ${title.split(' on ')[0]}\n*Created At:* ${created_at}\n*Description:* ${description}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/dl/tiktok?key=${iTechApi}&link=${tkLink}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { video, created_at, description, title } = data
                                client.sendFileFromUrl(from, video, `KZ0-Tiktok-Downloader.mp4`, `*From:* ${title.split(' on ')[0]}\n*Created At:* ${created_at}\n*Description:* ${description}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}tkstalk`:
                if (args.length !== 2) return client.reply(from, `Kirim perintah *${prefix}tiktok [linkTiktok]*`, id)
                const tkUser = body.split(' ')[1]
                if (!tkUser.startsWith('@')) return client.reply(from, 'Maaf, tolong gunakan @ di awal usernam !', id)
                client.reply(from, mess.wait, id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/dl/tiktoks?key=${iTechApi}&query=${tkUser}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { pic, bio, post, verified, followers, following, username, name } = data
                            const tkFollowers = Number(followers)
                            const tkFollowing = Number(following)
                            if (data.name === 'undefined') {
                                client.reply(from, data.pesan, id)
                            } else {
                                client.sendFileFromUrl(from, pic, `${username.slice(1)}.jpg`, `*Name:* ${name.split(' on ')[0]}\n*Username:* ${username}\n*Followers:* ${intToString(tkFollowers)}\n*Following:* ${intToString(tkFollowing)}\n*Post Total:* ${post}\n*Verified Status:* ${verified}\n*Bio:*\n${bio}`)
                            }
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/tiktoks?key=${iTechApi}&query=${tkUser}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { pic, bio, post, verified, followers, following, username, name } = data
                                                const tkFollowers = Number(followers)
                                                const tkFollowing = Number(following)
                                                if (data.name === 'undefined') {
                                                    client.reply(from, data.pesan, id)
                                                } else {
                                                    client.sendFileFromUrl(from, pic, `${username.slice(1)}.jpg`, `*Name:* ${name.split(' on ')[0]}\n*Username:* ${username}\n*Followers:* ${intToString(tkFollowers)}\n*Following:* ${intToString(tkFollowing)}\n*Post Total:* ${post}\n*Verified Status:* ${verified}\n*Bio:*\n${bio}`)
                                                }
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/dl/tiktoks?key=${iTechApi}&query=${tkUser}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { pic, bio, post, verified, followers, following, username, name } = data
                                                const tkFollowers = Number(followers)
                                                const tkFollowing = Number(following)
                                                if (data.name === 'undefined') {
                                                    client.reply(from, data.pesan, id)
                                                } else {
                                                    client.sendFileFromUrl(from, pic, `${username.slice(1)}.jpg`, `*Name:* ${name.split(' on ')[0]}\n*Username:* ${username}\n*Followers:* ${intToString(tkFollowers)}\n*Following:* ${intToString(tkFollowing)}\n*Post Total:* ${post}\n*Verified Status:* ${verified}\n*Bio:*\n${bio}`)
                                                }
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/dl/tiktoks?key=${iTechApi}&query=${tkUser}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { pic, bio, post, verified, followers, following, username, name } = data
                                const tkFollowers = Number(followers)
                                const tkFollowing = Number(following)
                                if (data.name === 'undefined') {
                                    client.reply(from, data.pesan, id)
                                } else {
                                    client.sendFileFromUrl(from, pic, `${username.slice(1)}.jpg`, `*Name:* ${name.split(' on ')[0]}\n*Username:* ${username}\n*Followers:* ${intToString(tkFollowers)}\n*Following:* ${intToString(tkFollowing)}\n*Post Total:* ${post}\n*Verified Status:* ${verified}\n*Bio:*\n${bio}`)
                                }
                            }
                        })
                    }
                }
                break
            case `${prefix}creator`:
            case `${prefix}owners`:
            case `${prefix}owner`:
                client.sendContact(from, ownerNumber)
                break
            case `${prefix}simichat`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
                if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    simichat.push(chat.id)
                    fs.writeFileSync('./lib/simi.json', JSON.stringify(simichat))
                    client.reply(from, `Simi Mode has been enable in *${name}* !!!`, id)
                } else if (args[1].toLowerCase() === 'disable') {
                    let inx = ban.indexOf(from)
                    simichat.splice(inx, 1)
                    fs.writeFileSync('./lib/simi.json', JSON.stringify(simichat))
                    client.reply(from, `Simi Mode has been disable in *${name}* !!!`, id)
                } else {
                    client.reply(from, 'Pilih enable atau disable !', id)
                }
                break
            case `${prefix}nsfw`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
                if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    if (nsfwgrp.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah terdaftar pada data NSFW`, id)
                    nsfwgrp.push(chat.id)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfwgrp))
                    client.reply(from, `NSFW is now registered on *${name}*`, id)
                } else if (args[1].toLowerCase() === 'disable') {
                    if (!nsfwgrp.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah belum pada data NSFW`, id)
                    let inx = ban.indexOf(from)
                    nsfwgrp.splice(inx, 1)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfwgrp))
                    client.reply(from, `NSFW is now unregistered on *${name}*`, id)
                } else {
                    client.reply(from, 'Pilih enable atau disable !', id)
                }
                break
            case `${prefix}antilink`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
                if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    if (antilink.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah terdaftar pada data ANTI-LINK`, id)
                    antilink.push(chat.id)
                    fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink))
                    client.reply(from, `ANTI-LINK GROUP INVITATION HAS BEEN ENABLE ON *${name}*`, id)
                } else if (args[1].toLowerCase() === 'disable') {
                    if (!antilink.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah belum pada data ANTI-LINK`, id)
                    let inx = ban.indexOf(from)
                    antilink.splice(inx, 1)
                    fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink))
                    client.reply(from, `ANTI-LINK GROUP INVITATION HAS BEEN DISABLE ON *${name}*`, id)
                } else {
                    client.reply(from, 'Pilih enable atau disable !', id)
                }
                break
            case `${prefix}antitoxic`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
                if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    if (antitoxic.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah terdaftar pada data ANTI-TOXIC`, id)
                    antitoxic.push(chat.id)
                    fs.writeFileSync('./lib/antitoxic.json', JSON.stringify(antitoxic))
                    client.reply(from, `ANTI-TOXIC HAS BEEN ENABLE ON *${name}*`, id)
                } else if (args[1].toLowerCase() === 'disable') {
                    if (!antitoxic.includes(from)) return client.reply(from, `Grup ${formattedTitle} telah belum pada data ANTI-TOXIC`, id)
                    let inx = ban.indexOf(from)
                    antitoxic.splice(inx, 1)
                    fs.writeFileSync('./lib/antitoxic.json', JSON.stringify(antitoxic))
                    client.reply(from, `ANTI-LINK HAS BEEN DISABLE ON *${name}*`, id)
                } else {
                    client.reply(from, 'Pilih enable atau disable !', id)
                }
                break
            case `${prefix}welcome`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
                if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    if (isWelcome) return client.reply(from, `Grup ${formattedTitle} telah meng-aktifkan fitur ini!`, id)
                    welkom.push(chat.id)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                    client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
                } else if (args[1].toLowerCase() === 'disable') {
                    if (!isWelcome) return client.reply(from, `Grup ${formattedTitle} belum meng-aktifkan fitur ini!`, id)
                    welkom.splice(chat.id, 1)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                    client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
                } else {
                    client.reply(from, 'Pilih enable atau disable udin!', id)
                }
                break
            case `${prefix}igstalk`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}igStalk @username*\nConntoh *${prefix}igStalk @duar_amjay*`, id)
                if (!args[1].startsWith('@')) return client.reply(from, 'Maaf, username harus di awali "@" !!!', id);
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.vhtear.com/igprofile?query=${args[1].split('@')[1]}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                            client.reply(from, data.pesan, id)
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { username, full_name, follower, follow, biography, picture, post_count } = data.result
                            if (!username) return client.reply(from, 'Maaf, username tidak ditemukan! Periksa kembali username anda!', id)
                            const itsFollowers = intToString(Number(follower))
                            const itsFollowing = intToString(Number(follow))
                            client.sendFileFromUrl(from, picture, `KZ0-IGSTALK.jpg`, `*Full Name:* ${full_name}\n*Username:* ${username}\n*Followers:* ${itsFollowers}\n*Following:* ${itsFollowing}\n*Post Count:* ${post_count}\n*Link Profile:* https://www.instagram.com/${username}\n*Bio:*\n${biography}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/igprofile?query=${args[1].split('@')[1]}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                                client.reply(from, data.pesan, id)
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { username, full_name, follower, follow, biography, picture, post_count } = data.result
                                                if (!username) return client.reply(from, 'Maaf, username tidak ditemukan! Periksa kembali username anda!', id)
                                                const itsFollowers = intToString(Number(follower))
                                                const itsFollowing = intToString(Number(follow))
                                                client.sendFileFromUrl(from, picture, `KZ0-IGSTALK.jpg`, `*Full Name:* ${full_name}\n*Username:* ${username}\n*Followers:* ${itsFollowers}\n*Following:* ${itsFollowing}\n*Post Count:* ${post_count}\n*Link Profile:* https://www.instagram.com/${username}\n*Bio:*\n${biography}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/igprofile?query=${args[1].split('@')[1]}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                                client.reply(from, data.pesan, id)
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { username, full_name, follower, follow, biography, picture, post_count } = data.result
                                                if (!username) return client.reply(from, 'Maaf, username tidak ditemukan! Periksa kembali username anda!', id)
                                                const itsFollowers = intToString(Number(follower))
                                                const itsFollowing = intToString(Number(follow))
                                                client.sendFileFromUrl(from, picture, `KZ0-IGSTALK.jpg`, `*Full Name:* ${full_name}\n*Username:* ${username}\n*Followers:* ${itsFollowers}\n*Following:* ${itsFollowing}\n*Post Count:* ${post_count}\n*Link Profile:* https://www.instagram.com/${username}\n*Bio:*\n${biography}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.vhtear.com/igprofile?query=${args[1].split('@')[1]}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                                client.reply(from, data.pesan, id)
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { username, full_name, follower, follow, biography, picture, post_count } = data.result
                                if (!username) return client.reply(from, 'Maaf, username tidak ditemukan! Periksa kembali username anda!', id)
                                const itsFollowers = intToString(Number(follower))
                                const itsFollowing = intToString(Number(follow))
                                client.sendFileFromUrl(from, picture, `KZ0-IGSTALK.jpg`, `*Full Name:* ${full_name}\n*Username:* ${username}\n*Followers:* ${itsFollowers}\n*Following:* ${itsFollowing}\n*Post Count:* ${post_count}\n*Link Profile:* https://www.instagram.com/${username}\n*Bio:*\n${biography}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}infogempa`:
                if (args.length !== 1) return client.reply(from, 'Maaf, Format salah! Silahkan check *$menu*')
                request.get({
                    url: `https://api.i-tech.id/tools/bmkg?key=${iTechApi}`,
                    json: true,
                    headers: {
                        'User-Agent': 'request'
                    }
                }, async (err, res, data) => {
                    if (err) {
                        console.log('Error : ', err);
                    } else if (res.statusCode !== 200) {
                        console.log('Status:', res.statusCode);
                    } else {
                        const { Lintang, Tanggal, Jam, Bujur, Magnitude, Kedalaman, _syimbol, Potensi, Wilayah1 } = data.result.Infogempa.gempa
                        const { cordinates } = data.result.Infogempa.gempa.point
                        await client.reply(from, `*Tanggal:* ${Tanggal}\n*Jam:* ${Jam}\n*Kordinat:* ${cordinates}\n*Lintang:* ${Lintang}\n*Bujur:* ${Bujur}\n*Lokasi:* ${Wilayah1}\n*Magnitude:* ${Magnitude}\n*Kedalaman:* ${Kedalaman}\n*Potensi:* ${Potensi}\n`, id)
                        client.sendLocation(from, Lintang.split(' LS')[0], Bujur.split(' BT')[0], `${Wilayah1}`)
                    }
                })
                break
            case `${prefix}anime`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}anime [query]*\nContoh : *${prefix}anime darling in the franxx*`, id)
                const animeQuery = body.slice(7)
                if (!animeQuery) return client.reply(from, 'Format salah!! Silahkan cek menu untuk melihat format yang benar!!', id)
                if (isGroupMsg) {
                    request.get({
                        url: 'https://mhankbarbars.herokuapp.com/api/dewabatch?q=' + animeQuery + `&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.error) return client.reply(from, 'Maaf, sementara fitur di non-aktifkan!', id)
                            const res_animek = `${data.result}\n\n${data.sinopsis}`
                            client.sendFileFromUrl(from, data.thumb, 'dewabatch.jpg', res_animek, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: 'https://mhankbarbars.herokuapp.com/api/dewabatch?q=' + body.slice(7) + `&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, async (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.error) return client.reply(from, 'Maaf, sementara fitur di non-aktifkan!', id)
                                                const res_animek = `${data.result}\n\n${data.sinopsis}`
                                                client.sendFileFromUrl(from, data.thumb, 'dewabatch.jpg', res_animek, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: 'https://mhankbarbars.herokuapp.com/api/dewabatch?q=' + body.slice(7) + `&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, async (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.error) return client.reply(from, 'Maaf, sementara fitur di non-aktifkan!', id)
                                                const res_animek = `${data.result}\n\n${data.sinopsis}`
                                                client.sendFileFromUrl(from, data.thumb, 'dewabatch.jpg', res_animek, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: 'https://mhankbarbars.herokuapp.com/api/dewabatch?q=' + body.slice(7) + `&apiKey=${mhankBB}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, async (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.error) return client.reply(from, 'Maaf, sementara fitur di non-aktifkan!', id)
                                const res_animek = `${data.result}\n\n${data.sinopsis}`
                                client.sendFileFromUrl(from, data.thumb, 'dewabatch.jpg', res_animek, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}brainly`:
                if (args.length < 1) return client.reply(from, 'Usage :\n$brainly [pertanyaan] \n\nEx : \n$brainly NKRI', id)
                const bText = body.slice(9);
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/brainly?key=${iTechApi}&query=${bText}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const brainlyImage = 'https://datadome.co/wp-content/uploads/Brainly-logo-1.png'
                            client.sendFileFromUrl(from, brainlyImage, 'BrainlyImage.jpg', `*Hasil Pencarian Brainly:*\n
1. ${data.result[0].title}\nLink: ${data.result[0].url}\n
2. ${data.result[1].title}\nLink: ${data.result[1].url}\n
3. ${data.result[2].title}\nLink: ${data.result[2].url}\n
4. ${data.result[3].title}\nLink: ${data.result[3].url}\n
5. ${data.result[4].title}\nLink: ${data.result[4].url}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/brainly?key=${iTechApi}&query=${bText}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const brainlyImage = 'https://datadome.co/wp-content/uploads/Brainly-logo-1.png'
                                                client.sendFileFromUrl(from, brainlyImage, 'BrainlyImage.jpg', `*Hasil Pencarian Brainly:*\n
1. ${data.result[0].title}\nLink: ${data.result[0].url}\n
2. ${data.result[1].title}\nLink: ${data.result[1].url}\n
3. ${data.result[2].title}\nLink: ${data.result[2].url}\n
4. ${data.result[3].title}\nLink: ${data.result[3].url}\n
5. ${data.result[4].title}\nLink: ${data.result[4].url}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/brainly?key=${iTechApi}&query=${bText}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const brainlyImage = 'https://datadome.co/wp-content/uploads/Brainly-logo-1.png'
                                                client.sendFileFromUrl(from, brainlyImage, 'BrainlyImage.jpg', `*Hasil Pencarian Brainly:*\n
1. ${data.result[0].title}\nLink: ${data.result[0].url}\n
2. ${data.result[1].title}\nLink: ${data.result[1].url}\n
3. ${data.result[2].title}\nLink: ${data.result[2].url}\n
4. ${data.result[3].title}\nLink: ${data.result[3].url}\n
5. ${data.result[4].title}\nLink: ${data.result[4].url}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/brainly?key=${iTechApi}&query=${bText}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const brainlyImage = 'https://datadome.co/wp-content/uploads/Brainly-logo-1.png'
                                client.sendFileFromUrl(from, brainlyImage, 'BrainlyImage.jpg', `*Hasil Pencarian Brainly:*\n
1. ${data.result[0].title}\nLink: ${data.result[0].url}\n
2. ${data.result[1].title}\nLink: ${data.result[1].url}\n
3. ${data.result[2].title}\nLink: ${data.result[2].url}\n
4. ${data.result[3].title}\nLink: ${data.result[3].url}\n
5. ${data.result[4].title}\nLink: ${data.result[4].url}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}faktaunik`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/fakta?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.reply(from, `${data.result}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/fakta?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/fakta?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/fakta?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.reply(from, `${data.result}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}pinterest`:
                if (args.length === 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}pinterest* _textTheme_ atau _link_ untuk menggunakan perintah ini\nExample:\n*$pinterest* sunset\n*$pinterest* https://pin.it/20GowgH`, id)
                const pinQuery = encodeURI(body.slice(11))
                if (!pinQuery) return client.reply(from, `Format Salah! Hanya ketik *${prefix}pinterest* _theme_ untuk menggunakan perintah ini`, id)
                if (isGroupMsg) {
                    if (pinQuery.startsWith('https://pin.it') || pinQuery.startsWith('https://id.pinterest.com') || pinQuery.startsWith('https://pinterest.com')) {
                        client.reply(from, '_Please wait..._', id)
                        request.get({
                            url: `https://api.i-tech.id/dl/pin?key=${iTechApi}&link=${pinQuery}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { status, title } = data
                                const { ext, url, size } = data.link[0]
                                if (status === 'error') return (from, 'Maaf, maaf untuk saat perintah dalam perbaikan!')
                                client.sendFileFromUrl(from, url, `title.${ext}`, `*Title:* ${title}\n*Size:* ${size}`)
                            }
                        })
                    } else {
                        client.reply(from, 'Maaf, fitur dalam masalah. Silahkan gunakan link untuk mendownload gambar dari Pinterest !\n\nExample $pinterest https://id.pinterest.com/pin/400890804305520124/', id)
                        // client.reply(from, '_Please wait..._', id)
                        // request.get({
                        //     url: `http://api.fdci.se/sosmed/rep.php?gambar=${pinQuery}`,
                        //     json: true,
                        //     headers: {
                        //         'User-Agent': 'request'
                        //     }
                        // }, (err, res, data) => {
                        //     if (err) {
                        //         console.log('Error : ', err);
                        //     } else if (res.statusCode !== 200) {
                        //         console.log('Status:', res.statusCode);
                        //     } else {
                        //         var randomPin = data[Math.floor(Math.random() * data.length)];
                        //         client.sendFileFromUrl(from, randomPin, 'pinterest.jpg', '', id)
                        //     }
                        // })
                    }
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (pinQuery.startsWith('https://pin.it') || pinQuery.startsWith('https://id.pinterest.com') || pinQuery.startsWith('https://pinterest.com')) {
                                            client.reply(from, '_Please wait..._', id)
                                            request.get({
                                                url: `https://api.i-tech.id/dl/pin?key=${iTechApi}&link=${pinQuery}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, (err, res, data) => {
                                                if (err) {
                                                    console.log('Error : ', err);
                                                } else if (res.statusCode !== 200) {
                                                    console.log('Status:', res.statusCode);
                                                } else {
                                                    const { status, title } = data
                                                    const { ext, url, size } = data.link[0]
                                                    if (status === 'error') return (from, 'Maaf, maaf untuk saat perintah dalam perbaikan!')
                                                    client.sendFileFromUrl(from, url, `title.${ext}`, `*Title:* ${title}\n*Size:* ${size}`)
                                                }
                                            })
                                        } else {
                                            client.reply(from, 'Maaf, fitur dalam masalah. Silahkan gunakan link untuk mendownload gambar dari Pinterest !\n\nExample $pinterest https://id.pinterest.com/pin/400890804305520124/', id)
                                            // client.reply(from, '_Please wait..._', id)
                                            // request.get({
                                            //     url: `http://api.fdci.se/sosmed/rep.php?gambar=${pinQuery}`,
                                            //     json: true,
                                            //     headers: {
                                            //         'User-Agent': 'request'
                                            //     }
                                            // }, (err, res, data) => {
                                            //     if (err) {
                                            //         console.log('Error : ', err);
                                            //     } else if (res.statusCode !== 200) {
                                            //         console.log('Status:', res.statusCode);
                                            //     } else {
                                            //         var randomPin = data[Math.floor(Math.random() * data.length)];
                                            //         client.sendFileFromUrl(from, randomPin, 'pinterest.jpg', '', id)
                                            //     }
                                            // })
                                        }
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (pinQuery.startsWith('https://pin.it') || pinQuery.startsWith('https://id.pinterest.com') || pinQuery.startsWith('https://pinterest.com')) {
                                            client.reply(from, '_Please wait..._', id)
                                            request.get({
                                                url: `https://api.i-tech.id/dl/pin?key=${iTechApi}&link=${pinQuery}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, (err, res, data) => {
                                                if (err) {
                                                    console.log('Error : ', err);
                                                } else if (res.statusCode !== 200) {
                                                    console.log('Status:', res.statusCode);
                                                } else {
                                                    const { status, title } = data
                                                    const { ext, url, size } = data.link[0]
                                                    if (status === 'error') return (from, 'Maaf, maaf untuk saat perintah dalam perbaikan!')
                                                    client.sendFileFromUrl(from, url, `title.${ext}`, `*Title:* ${title}\n*Size:* ${size}`)
                                                }
                                            })
                                        } else {
                                            client.reply(from, 'Maaf, fitur dalam masalah. Silahkan gunakan link untuk mendownload gambar dari Pinterest !\n\nExample $pinterest https://id.pinterest.com/pin/400890804305520124/', id)
                                            // client.reply(from, '_Please wait..._', id)
                                            // request.get({
                                            //     url: `http://api.fdci.se/sosmed/rep.php?gambar=${pinQuery}`,
                                            //     json: true,
                                            //     headers: {
                                            //         'User-Agent': 'request'
                                            //     }
                                            // }, (err, res, data) => {
                                            //     if (err) {
                                            //         console.log('Error : ', err);
                                            //     } else if (res.statusCode !== 200) {
                                            //         console.log('Status:', res.statusCode);
                                            //     } else {
                                            //         var randomPin = data[Math.floor(Math.random() * data.length)];
                                            //         client.sendFileFromUrl(from, randomPin, 'pinterest.jpg', '', id)
                                            //     }
                                            // })
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        if (pinQuery.startsWith('https://pin.it') || pinQuery.startsWith('https://id.pinterest.com') || pinQuery.startsWith('https://pinterest.com')) {
                            client.reply(from, '_Please wait..._', id)
                            request.get({
                                url: `https://api.i-tech.id/dl/pin?key=${iTechApi}&link=${pinQuery}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                } else {
                                    const { status, title } = data
                                    const { ext, url, size } = data.link[0]
                                    if (status === 'error') return (from, 'Maaf, maaf untuk saat perintah dalam perbaikan!')
                                    client.sendFileFromUrl(from, url, `title.${ext}`, `*Title:* ${title}\n*Size:* ${size}`)
                                }
                            })
                        } else {
                            client.reply(from, 'Maaf, fitur dalam masalah. Silahkan gunakan link untuk mendownload gambar dari Pinterest !\n\nExample $pinterest https://id.pinterest.com/pin/400890804305520124/', id)
                            // client.reply(from, '_Please wait..._', id)
                            // request.get({
                            //     url: `http://api.fdci.se/sosmed/rep.php?gambar=${pinQuery}`,
                            //     json: true,
                            //     headers: {
                            //         'User-Agent': 'request'
                            //     }
                            // }, (err, res, data) => {
                            //     if (err) {
                            //         console.log('Error : ', err);
                            //     } else if (res.statusCode !== 200) {
                            //         console.log('Status:', res.statusCode);
                            //     } else {
                            //         var randomPin = data[Math.floor(Math.random() * data.length)];
                            //         client.sendFileFromUrl(from, randomPin, 'pinterest.jpg', '', id)
                            //     }
                            // })
                        }
                    }
                }
                break
            case `${prefix}pantunpucek`:
                request.get({
                    url: `https://api.i-tech.id/tools/pantun?key=${iTechApi}`,
                    json: true,
                    headers: {
                        'User-Agent': 'request'
                    }
                }, (err, res, data) => {
                    if (err) {
                        console.log('Error : ', err);
                        client.reply(from, `${data.pesan}`, id)
                    } else if (res.statusCode !== 200) {
                        console.log('Status:', res.statusCode);
                    } else {
                        client.reply(from, `${data.result}`, id)
                    }
                })
                break
            case `${prefix}quotemaker`:
            case `${prefix}quotesmaker`:
            case `${prefix}quotemarker`:
            case `${prefix}quotesmarker`:
                arg = body.trim().split('|')
                if (arg.length >= 4) {
                    client.reply(from, mess.wait, id)
                    const quotes = encodeURI(arg[1])
                    const author = encodeURI(arg[2])
                    const theme = arg[3]
                    if (!theme || !author || !quotes) return client.reply(from, 'Format salah! Silahkan cek *$menu* !!', id)
                    if (isGroupMsg) {
                        request.get({
                            url: `https://api.i-tech.id/tools/qtm?key=${iTechApi}&type=${theme}&author=${author}&text=${quotes}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                                client.reply(from, `${data.pesan}`, id)
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.sendFileFromUrl(from, data.result, 'KZ0-Quotes.jpg', '', id)
                            }
                        })
                    } else {
                        if (!isVIP) {
                            sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql, async function (err, result) {
                                if (err) throw err;
                                if (result.length !== 1) {
                                    await saveNo(nomernya)
                                    var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql2, async function (err, result) {
                                            if (err) throw err;
                                            request.get({
                                                url: `https://api.i-tech.id/tools/qtm?key=${iTechApi}&type=${theme}&author=${author}&text=${quotes}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, (err, res, data) => {
                                                if (err) {
                                                    console.log('Error : ', err);
                                                    client.reply(from, `${data.pesan}`, id)
                                                } else if (res.statusCode !== 200) {
                                                    console.log('Status:', res.statusCode);
                                                } else {
                                                    client.sendFileFromUrl(from, data.result, 'KZ0-Quotes.jpg', '', id)
                                                }
                                            })
                                        });
                                    });
                                } else {
                                    sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                    con.query(sql, async function (err, result) {
                                        const limitny = result[0].limitnya
                                        if (err) throw err;
                                        if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                        const newLimit = limitny - 1
                                        var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                        con.query(sql1, async function (err, result) {
                                            if (err) throw err;
                                            request.get({
                                                url: `https://api.i-tech.id/tools/qtm?key=${iTechApi}&type=${theme}&author=${author}&text=${quotes}`,
                                                json: true,
                                                headers: {
                                                    'User-Agent': 'request'
                                                }
                                            }, (err, res, data) => {
                                                if (err) {
                                                    console.log('Error : ', err);
                                                    client.reply(from, `${data.pesan}`, id)
                                                } else if (res.statusCode !== 200) {
                                                    console.log('Status:', res.statusCode);
                                                } else {
                                                    client.sendFileFromUrl(from, data.result, 'KZ0-Quotes.jpg', '', id)
                                                }
                                            })
                                        });
                                    });
                                }
                            });
                        } else {
                            request.get({
                                url: `https://api.i-tech.id/tools/qtm?key=${iTechApi}&type=${theme}&author=${author}&text=${quotes}`,
                                json: true,
                                headers: {
                                    'User-Agent': 'request'
                                }
                            }, (err, res, data) => {
                                if (err) {
                                    console.log('Error : ', err);
                                    client.reply(from, `${data.pesan}`, id)
                                } else if (res.statusCode !== 200) {
                                    console.log('Status:', res.statusCode);
                                } else {
                                    client.sendFileFromUrl(from, data.result, 'KZ0-Quotes.jpg', '', id)
                                }
                            })
                        }
                    }
                } else {
                    client.reply(from, 'Usage: \n$quotemaker |teks|watermark|theme\n\nEx :\n$quotemaker |ini contoh|bicit|random', id)
                }
                break
            case `${prefix}bc`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                let msg = body.slice(4)
                const chatz = await client.getAllChatIds()
                for (let ids of chatz) {
                    var cvk = await client.getChatById(ids)
                    if (!cvk.isReadOnly) await client.sendText(ids, `${msg}`)
                }
                client.reply(from, 'Broadcast Success!', id)
                break
            case `${prefix}adminlist`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                let mimin = ''
                for (let admon of groupAdmins) {
                    mimin += ` @${admon.replace(/@c.us/g, '')}\n`
                }
                await sleep(2000)
                await client.sendTextWithMentions(from, mimin)
                break
            case `${prefix}ownergroup`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                const Owner_ = chat.groupMetadata.owner
                await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
                break
            case `${prefix}mentionall`:
            case `${prefix}tagall`:
            case `${prefix}everyone`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                const groupMem = await client.getGroupMembers(groupId)
                let hehe = '╔══✪〘 Mention All 〙✪══\n'
                for (let i = 0; i < groupMem.length; i++) {
                    hehe += '╠➥'
                    hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehe += '╚═〘 KZ0 BOT 〙'
                await sleep(2000)
                await client.sendTextWithMentions(from, hehe)
                break
            case `${prefix}kickall`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                const isGroupOwner = sender.id === chat.groupMetadata.owner
                if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                const allMem = await client.getGroupMembers(groupId)
                for (let i = 0; i < allMem.length; i++) {
                    if (groupAdmins.includes(allMem[i].id)) {
                        console.log('Upss this is Admin group')
                    } else {
                        await client.removeParticipant(groupId, allMem[i].id)
                    }
                }
                client.reply(from, 'Succes kick all member', id)
                break
            case `${prefix}leaveall`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                const allChats = await client.getAllChatIds()
                const allGroups = await client.getAllGroups()
                for (let gclist of allGroups) {
                    await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}\n\nTunggu hingga 30 menit jika ingin mengundang bot masuk ke grup !!`)
                    await client.leaveGroup(gclist.contact.id)
                }
                client.reply(from, 'Succes leave all group!', id)
                break
            case `${prefix}clearall`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                // const allChatz = await client.getAllChats()
                for (let dchat of allChatz) {
                    await client.deleteChat(dchat.id)
                }
                client.reply(from, 'Succes clear all chat!', id)
                break
            case `${prefix}ownermenu`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                client.sendText(from, ownerMenu)
                break
            case `${prefix}add`:
                const orang = args[1]
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (args.length === 1) return client.reply(from, `Untuk menggunakan fitur ini, kirim perintah *${prefix}add* 628xxxxx`, id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                try {
                    await client.addParticipant(from, `${orang}@c.us`)
                } catch {
                    client.reply(from, mess.error.Ad, id)
                }
                break
            case `${prefix}kick`:
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, `Untuk menggunakan Perintah ini, kirim perintah *${prefix}kick* @tagmember`, id)
                await client.sendTextWithMentions(from, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                    await client.removeParticipant(groupId, mentionedJidList[i])
                }
                break
            case `${prefix}leave`:
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                await client.sendText(from, 'See you~').then(() => client.leaveGroup(groupId))
                break
            case `${prefix}promote`:
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, `Untuk menggunakan fitur ini, kirim perintah *${prefix}promote* @tagmember`, id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
                if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
                break
            case `${prefix}demote`:
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, `Untuk menggunakan fitur ini, kirim perintah *${prefix}demote* @tagadmin`, id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
                if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
                break
            case `${prefix}join`:
                if (!isOwner) return client.reply(from, 'Upss...\n\nUntuk bisa mengundang bot kedalam grup kamu. Diwajibkan untuk donasi dulu yah ^^\n\n10K = 1 Minggu\n20K = 1 Bulan\n50K = Forever\n\nJika berminat, langsung chat contact di bawah ini yah ^^').then(() => client.sendContact(from, ownerNumber))
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}join* linkgroup\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla`, id)
                const link = body.slice(6)
                const tGr = await client.getAllGroups()
                const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
                const check = await client.inviteInfo(link)
                if (!isLink) return client.reply(from, 'Invalid Link!', id)

                if (check.status === 200) {
                    await client.joinGroupViaLink(link).then(() => client.reply(from, 'Link diterima! Berhasil masuk kedalam grup!'))
                } else {
                    client.reply(from, 'Link group tidak valid!', id)
                }
                break
            case `${prefix}delete`:
            case `${prefix}del`:
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!quotedMsg) return client.reply(from, `Salah!!, kirim perintah *${prefix}delete [tagpesanbot]*`, id)
                if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                break
            case `${prefix}getses`:
            case `${prefix}getss`:
                const sesPic = await client.getSnapshot()
                client.sendFile(from, sesPic, 'session.png', '', id)
                break
            case `${prefix}lirik`:
            case `${prefix}lyrics`:
                if (args.length == 1) return client.reply(from, `Kirim perintah *${prefix}lirik [optional]*, contoh *${prefix}lirik aku bukan boneka*`, id)
                if (body.startsWith(`${prefix}lirik`)) {
                    var lagu = body.slice(7)
                } else if (body.startsWith(`${prefix}lyrics`)) {
                    var lagu = body.slice(8)
                }
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.vhtear.com/liriklagu?query=${lagu}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (!data.result || data.result.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                            client.reply(from, `Lirik *${lagu}*\n\n${data.result.result}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/liriklagu?query=${lagu}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data.result || data.result.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                                client.reply(from, `Lirik *${lagu}*\n\n${data.result.result}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/liriklagu?query=${lagu}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data.result || data.result.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                                client.reply(from, `Lirik *${lagu}*\n\n${data.result.result}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.vhtear.com/liriklagu?query=${lagu}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (!data.result || data.result.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                client.reply(from, `Lirik *${lagu}*\n\n${data.result.result}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}chord`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}chord [query]*, contoh *${prefix}chord aku bukan boneka*`, id)
                const query__ = body.slice(7)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/chord?key=${iTechApi}&query=${query__}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (!data.result || data.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                            client.reply(from, data.result, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/chord?key=${iTechApi}&query=${query__}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data.result || data.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                                client.reply(from, data.result, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/chord?key=${iTechApi}&query=${query__}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (!data.result || data.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                                client.reply(from, data.result, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/chord?key=${iTechApi}&query=${query__}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (!data.result || data.result === '') return client.reply(from, 'Maaf, Chord yang anda maksud tidak ditemukan!', id)
                                client.reply(from, data.result, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}listdaerah`:
                const listDaerah = await get('https://mhankbarbars.herokuapp.com/daerah').json()
                client.reply(from, listDaerah, id)
                break
            case `${prefix}listblock`:
                let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
                for (let i of blockNumber) {
                    hih += `> @${i.replace(/@c.us/g, '')}\n`
                }
                client.sendTextWithMentions(from, `${hih}\n\nJika ingin membuka block/ban silahkan hubungi owners!\nketik: *$owner*`, id)
                break
            case `${prefix}listchannel`:
                client.reply(from, listChannel, id)
                break
            case `${prefix}jadwaltv`:
                if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}jadwalTv [channel]*`, id)
                const query = body.slice(10).toLowerCase()
                const jadwal = await jadwalTv(query)
                client.reply(from, jadwal, id)
                break
            case `${prefix}jadwaltvnow`:
                const jadwalNow = await get.get('https://api.haipbis.xyz/jadwaltvnow').json()
                client.reply(from, `Jam : ${jadwalNow.jam}\n\nJadwalTV : ${jadwalNow.jadwalTV}`, id)
                break
            case `${prefix}loli`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/randomloli`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.sendFileFromUrl(from, data.result, 'loli.jpeg', 'Neehh... Dasar lolicon!', id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/randomloli`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.sendFileFromUrl(from, data.result, 'loli.jpeg', 'Neehh... Dasar lolicon!', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/randomloli`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.sendFileFromUrl(from, data.result, 'loli.jpeg', 'Neehh... Dasar lolicon!', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://mhankbarbars.herokuapp.com/api/randomloli`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.sendFileFromUrl(from, data.result, 'loli.jpeg', 'Neehh... Dasar lolicon!', id)
                            }
                        })
                    }
                }
                break
            case `${prefix}waifu`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://api-jojo.herokuapp.com/api/waifu`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.image.endsWith('.png')) {
                                var waifuExt = '.png'
                            } else {
                                var waifuExt = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.image, `Waifu.${waifuExt}`, `*Name :* ${data.name}\n*Description :* ${data.desc}\n\n*Source :* ${data.source}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api-jojo.herokuapp.com/api/waifu`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.image.endsWith('.png')) {
                                                    var waifuExt = '.png'
                                                } else {
                                                    var waifuExt = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.image, `Waifu.${waifuExt}`, `*Name :* ${data.name}\n*Description :* ${data.desc}\n\n*Source :* ${data.source}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api-jojo.herokuapp.com/api/waifu`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.image.endsWith('.png')) {
                                                    var waifuExt = '.png'
                                                } else {
                                                    var waifuExt = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.image, `Waifu.${waifuExt}`, `*Name :* ${data.name}\n*Description :* ${data.desc}\n\n*Source :* ${data.source}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api-jojo.herokuapp.com/api/waifu`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.image.endsWith('.png')) {
                                    var waifuExt = '.png'
                                } else {
                                    var waifuExt = '.jpg'
                                }
                                client.sendFileFromUrl(from, data.image, `Waifu.${waifuExt}`, `*Name :* ${data.name}\n*Description :* ${data.desc}\n\n*Source :* ${data.source}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}randomwibu`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/anim/wibu?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.sendFileFromUrl(from, data.foto, 'WaifuMu.jpg', `*Nama:* ${data.nama}\n*Deskripsi:* ${data.deskripsi}`)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/wibu?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.sendFileFromUrl(from, data.foto, 'WaifuMu.jpg', `*Nama:* ${data.nama}\n*Deskripsi:* ${data.deskripsi}`)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/wibu?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.sendFileFromUrl(from, data.foto, 'WaifuMu.jpg', `*Nama:* ${data.nama}\n*Deskripsi:* ${data.deskripsi}`)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/wibu?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.sendFileFromUrl(from, data.foto, 'WaifuMu.jpg', `*Nama:* ${data.nama}\n*Deskripsi:* ${data.deskripsi}`)
                            }
                        })
                    }
                }
                break
            case `${prefix}hentaihunter`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/hentai`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `Hentai${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/hentai`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `Hentai${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}nekohunter2`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/nsfwneko`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `Hentai${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/nsfwneko`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `Hentai${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}pornhub`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    const pHubQuery = body.slice(9)
                    if (!pHubQuery) return client.reply(from, 'Maaf, Format yang anda masukan salah!\nSilahkan cek *$menu*', id)
                    pornhub.search('Video', pHubQuery).then(res => {
                        var randomPh = res.data[Math.floor(Math.random() * res.data.length)];
                        const { title, url, duration, premium, preview, hd } = randomPh
                        client.sendFileFromUrl(from, preview, 'PornHub.jpg', `*Title:* ${title}\n*Duration:* ${duration}\n*Premium:* ${premium}\n*HD:* ${hd}\n*Links:* ${url}`)
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    const pHubQuery = body.slice(9)
                    if (!pHubQuery) return client.reply(from, 'Maaf, Format yang anda masukan salah!\nSilahkan cek *$menu*', id)
                    pornhub.search('Video', pHubQuery).then(res => {
                        var randomPh = res.data[Math.floor(Math.random() * res.data.length)];
                        const { title, url, duration, premium, preview, hd } = randomPh
                        client.sendFileFromUrl(from, preview, 'PornHub.jpg', `*Title:* ${title}\n*Duration:* ${duration}\n*Premium:* ${premium}\n*HD:* ${hd}\n*Links:* ${url}`)
                    })
                }
                break
            case `${prefix}cersex`:
                if (isGroupMsg === true) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                    if (args.length !== 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}cersex*`, id)
                    request.get({
                        url: `https://masgi.herokuapp.com/api/cersex1`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status !== true) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { judul, article } = data.data
                            client.reply(from, `*Judul:* ${judul}\n\n${article}`, id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    if (args.length !== 1) return client.reply(from, `Format Salah! Hanya ketik *${prefix}cersex*`, id)
                    request.get({
                        url: `https://masgi.herokuapp.com/api/cersex1`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status !== true) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { judul, article } = data.data
                            client.reply(from, `*Judul:* ${judul}\n\n${article}`, id)
                        }
                    })
                }
            case `${prefix}cersex2`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://masgi.herokuapp.com/api/cersex2`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status !== true) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { judul, article } = data.data
                            client.reply(from, `*Judul:* ${judul}\n\n${article}`, id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://masgi.herokuapp.com/api/cersex2`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status !== true) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { judul, article } = data.data
                            client.reply(from, `*Judul:* ${judul}\n\n${article}`, id)
                        }
                    })
                }
                break
            case `${prefix}xnxx`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    if (!args[1]) return client.reply(from, `Format yang anda masukan salah!\n\n*Example:*\n${prefix}xnxx https://www.xnxx.com/blablabla`, id)
                    if (!args[1].split('/')[2].startsWith('www.xnxx.com')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/xnxx?url=${args[1]}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { judul, thumb, desc, size, vid } = data.result
                            const xnxxResponse = await get.get(`https://api.vhtear.com/shortener?link=${vid}&apikey=${vhTear}`).json()
                            const { Short } = xnxxResponse.result
                            client.sendFileFromUrl(from, thumb, 'XNXX-DOWNLOADER-KyuZ0.jpg', `*Title:* ${judul}\n*Size:* ${size}\n*Description:* ${desc}\n*Link:* ${Short}`)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    if (!args[1]) return client.reply(from, `Format yang anda masukan salah!\n\n*Example:*\n${prefix}xnxx https://www.xnxx.com/blablabla`, id)
                    if (!args[1].split('/')[2].startsWith('www.xnxx.com')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/xnxx?url=${args[1]}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { judul, thumb, desc, size, vid } = data.result
                            const xnxxResponse = await get.get(`https://api.vhtear.com/shortener?link=${vid}&apikey=${vhTear}`).json()
                            const { Short } = xnxxResponse.result
                            client.sendFileFromUrl(from, thumb, 'XNXX-DOWNLOADER-KyuZ0.jpg', `*Title:* ${judul}\n*Size:* ${size}\n*Description:* ${desc}\n*Link:* ${Short}`)
                        }
                    })
                }
                break
            case `${prefix}nekopoi`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    if (!args[1]) return client.reply(from, `Format yang anda masukan salah! Silahkan ketik *$menu* untuk melihat format yang benar!`, id)
                    if (!args[1].split('/')[2].startsWith('www.nekopoi')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/nekopoi?url=${args[1]}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.error) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { info, thumbnail, judul, dilihat } = data.result
                            client.sendFileFromUrl(from, thumbnail, 'NEKOPOI-SCRAPER-KyuZ0.jpg', `*Title:* ${judul}\n*Views:* ${dilihat}\n${info}`, id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    if (!args[1]) return client.reply(from, `Format yang anda masukan salah! Silahkan ketik *$menu* untuk melihat format yang benar!`, id)
                    if (!args[1].split('/')[2].startsWith('www.nekopoi')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    client.reply(from, '_Please wait..._', id)
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/nekopoi?url=${args[1]}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.error) return client.reply(from, 'Maaf, terdapat masalah pada perintah ini! Silahkan lapor owner dengan cara SS pesan ini dan kirim ke contact Owners!\n\nKetik: *$owners*')
                            const { info, thumbnail, judul, dilihat } = data.result
                            client.sendFileFromUrl(from, thumbnail, 'NEKOPOI-SCRAPER-KyuZ0.jpg', `*Title:* ${judul}\n*Views:* ${dilihat}\n${info}`, id)
                        }
                    })
                }
                break
            case `${prefix}simi`:
            case `${prefix}s`:
                if (isGroupMsg === true) {
                    if (!isSimi) return client.reply(from, 'Command/Perintah SIMI CHAT belum di aktifkan di group ini!', id)
                    if (body.startsWith(`${prefix}s`)) {
                        var simiArgs = body.slice(3)
                    } else if (body.startsWith(`${prefix}simi`)) {
                        var simiArgs = body.slice(6)
                    }
                    if (!simiArgs) return client.reply(from, `Format yang anda masukan salah!\n\n*Example:*\n${prefix}simi hai`, id)
                    // if (!args[1].split('/')[2].startsWith('www.nekopoi')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    request.get({
                        url: `https://st4rz.herokuapp.com/api/simsimi?kata=${simiArgs}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.error) return client.reply(from, 'Maaf, simi sedang dalam perbaikan, coba lagi nanti yah xixixixi', id)
                            if (data.result === null) return client.reply(from, 'Maaf, simi sedang dalam perbaikan, coba lagi nanti yah xixixixi', id)
                            client.reply(from, data.result, id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP!', id)
                    if (body.startsWith(`${prefix}s`)) {
                        var simiArgs = body.slice(3)
                    } else if (body.startsWith(`${prefix}simi`)) {
                        var simiArgs = body.slice(6)
                    }
                    if (!simiArgs) return client.reply(from, `Format yang anda masukan salah!\n\n*Example:*\n${prefix}simi hai`, id)
                    // if (!args[1].split('/')[2].startsWith('www.nekopoi')) return client.reply(from, `Maaf, link yang anda masukan tidak valid!`, id)
                    request.get({
                        url: `https://st4rz.herokuapp.com/api/simsimi?kata=${simiArgs}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.sendText(from, data.result)
                        }
                    })
                }
                break
            case `${prefix}xxxvideo`:
                if (isGroupMsg === true) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                    const xxxQuery = body.slice(9)
                    if (!xxxQuery) return client.reply(from, 'Maaf, format yang anda masukan salah! Silahkan cek *$menu* !!', id)
                    request.get({
                        url: `https://api.vhtear.com/xxxvideo?query=${xxxQuery}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            var randomXXX = data.result[Math.floor(Math.random() * data.result.length)];
                            const { title, duration, image, video } = randomXXX
                            const xxxResponse = await get.get(`https://api.vhtear.com/shortener?link=${video}&apikey=${vhTear}`).json()
                            const { Short } = xxxResponse
                            client.sendFileFromUrl(from, image, 'XXX-VIDEOS-KyuZ0.jpg', `*Title:* ${title}\n*Duration:* ${duration}\n*Link:* ${Short}`)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    const xxxQuery = body.slice(9)
                    request.get({
                        url: `https://api.vhtear.com/xxxvideo?query=${xxxQuery}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, async (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            var randomXXX = data.result[Math.floor(Math.random() * data.result.length)];
                            const { title, duration, image, video } = randomXXX
                            const xxxResponse = await get.get(`https://api.vhtear.com/shortener?link=${video}&apikey=${vhTear}`).json()
                            const { Short } = xxxResponse
                            client.sendFileFromUrl(from, image, 'XXX-VIDEOS-KyuZ0.jpg', `*Title:* ${title}\n*Duration:* ${duration}\n*Link:* ${Short}`)
                        }
                    })
                    client.reply(from, 'Maaf, perintah ini hanya bisa digunakan di dalam grup!', id)
                }
                break
            case `${prefix}yuri`:
                if (isGroupMsg === true) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/yuri?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `Yuri${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/yuri?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `Yuri${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/yuri?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.result.endsWith('.png')) {
                                    var ext = '.png'
                                } else {
                                    var ext = '.jpg'
                                }
                                client.sendFileFromUrl(from, data.result, `Yuri${ext}`, '', id)
                            }
                        })
                    }
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://api.i-tech.id/anim/yuri?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `Yuri${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}dvanime`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/anim/dva?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `DvAnime${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/dva?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `DvAnime${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/dva?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `DvAnime${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/dva?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.result.endsWith('.png')) {
                                    var ext = '.png'
                                } else {
                                    var ext = '.jpg'
                                }
                                client.sendFileFromUrl(from, data.result, `DvAnime${ext}`, '', id)
                            }
                        })
                    }
                }
                break
            case `${prefix}hugnime`:
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/anim/hug?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `HugNime${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/hug?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `HugNime${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/hug?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `HugNime${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/hug?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.result.endsWith('.png')) {
                                    var ext = '.png'
                                } else {
                                    var ext = '.jpg'
                                }
                                client.sendFileFromUrl(from, data.result, `HugNime${ext}`, '', id)
                            }
                        })
                    }
                }
                break
            case `${prefix}baguette`:
                if (isGroupMsg) {
                    // CODE HERE!!!
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/baguette?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `Baguette${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/baguette?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.endsWith('.png')) {
                                                    var ext = '.png'
                                                } else {
                                                    var ext = '.jpg'
                                                }
                                                client.sendFileFromUrl(from, data.result, `Baguette${ext}`, '', id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/baguette?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.result.endsWith('.png')) {
                                    var ext = '.png'
                                } else {
                                    var ext = '.jpg'
                                }
                                client.sendFileFromUrl(from, data.result, `Baguette${ext}`, '', id)
                            }
                        })
                    }
                }
                break
            case `${prefix}nekohunter2`:
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://api.i-tech.id/anim/neko2?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `NekoHunter2${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://api.i-tech.id/anim/neko2?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `NekoHunter2${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}nekonime`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*', id)
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/nekonime`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `Nekonime${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/nekonime`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.result, `Nekonime${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}randomtrapnime`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*', id)
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id);
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/trap`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `TrapNime${ext}`, '', id)
                        }
                    })
                } else {
                    if (!isVIP) return client.reply(from, 'Maaf, Fitur ini hanya bisa digunakan oleh user VIP!\n\nKetik *$preminfo*\nUntuk mengetahui kelebihan user VIP atau invite BOT kedalam grup dan gunakan fitur NSFW!', id)
                    request.get({
                        url: `https://api.computerfreaker.cf/v1/trap`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.url.endsWith('.png')) {
                                var ext = '.png'
                            } else {
                                var ext = '.jpg'
                            }
                            client.sendFileFromUrl(from, data.url, `TrapNime${ext}`, '', id)
                        }
                    })
                }
                break
            case `${prefix}randomanime`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                const nime = await randomNimek('anime')
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.vhtear.com/randomnekonime&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                            client.reply(from, 'Maaf, fitur sedang pemulihan karna terlalu banyak request!!', id)
                        } else {
                            client.sendFileFromUrl(from, data.result.result, 'KZ0-RANDOM-ANIME.jpg', '', id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        if (nime.endsWith('.png')) {
                                            var ext = '.png'
                                        } else {
                                            var ext = '.jpg'
                                        }
                                        client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        if (nime.endsWith('.png')) {
                                            var ext = '.png'
                                        } else {
                                            var ext = '.jpg'
                                        }
                                        client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
                                    });
                                });
                            }
                        });
                    } else {
                        if (nime.endsWith('.png')) {
                            var ext = '.png'
                        } else {
                            var ext = '.jpg'
                        }
                        client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
                    }
                }
                break
            case `${prefix}quote`:
            case `${prefix}quotes`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/quotes?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.reply(from, `${data.result}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/quotes?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/quotes?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/quotes?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.reply(from, `${data.result}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}quote2`:
            case `${prefix}quotes2`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*', id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/quotes3?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.reply(from, `${data.result}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/quotes3?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/quotes3?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `${data.result}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/quotes3?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.reply(from, `${data.result}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}quote3`:
            case `${prefix}quotes3`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                if (!isVIP) {
                    sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                    con.query(sql, async function (err, result) {
                        if (err) throw err;
                        if (result.length !== 1) {
                            await saveNo(nomernya)
                            var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql1, async function (err, result) {
                                const limitny = result[0].limitnya
                                if (err) throw err;
                                if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                const newLimit = limitny - 1
                                var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                con.query(sql2, async function (err, result) {
                                    if (err) throw err;
                                    request.get({
                                        url: `https://api.i-tech.id/tools/quotes2?key=${iTechApi}`,
                                        json: true,
                                        headers: {
                                            'User-Agent': 'request'
                                        }
                                    }, (err, res, data) => {
                                        if (err) {
                                            console.log('Error : ', err);
                                        } else if (res.statusCode !== 200) {
                                            console.log('Status:', res.statusCode);
                                        } else {
                                            const { author, result, category } = data
                                            client.reply(from, `*${result}*\n\n*Author:* ${author}\n*Category:* ${category}`, id)
                                        }
                                    })
                                });
                            });
                        } else {
                            sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                            con.query(sql, async function (err, result) {
                                const limitny = result[0].limitnya
                                if (err) throw err;
                                if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                const newLimit = limitny - 1
                                var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    if (err) throw err;
                                    request.get({
                                        url: `https://api.i-tech.id/tools/quotes2?key=${iTechApi}`,
                                        json: true,
                                        headers: {
                                            'User-Agent': 'request'
                                        }
                                    }, (err, res, data) => {
                                        if (err) {
                                            console.log('Error : ', err);
                                        } else if (res.statusCode !== 200) {
                                            console.log('Status:', res.statusCode);
                                        } else {
                                            const { author, result, category } = data
                                            client.reply(from, `*${result}*\n\n*Author:* ${author}\n*Category:* ${category}`, id)
                                        }
                                    })
                                });
                            });
                        }
                    });
                } else {
                    request.get({
                        url: `https://api.i-tech.id/tools/quotes2?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { author, result, category } = data
                            client.reply(from, `*${result}*\n\n*Author:* ${author}\n*Category:* ${category}`, id)
                        }
                    })
                }
                break
            case `${prefix}rtt`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*', id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/twist?key=${iTechApi}&negara=id`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            client.reply(from, `*${data.result}*`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/twist?key=${iTechApi}&negara=id`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `*${data.result}*`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/twist?key=${iTechApi}&negara=id`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                client.reply(from, `*${data.result}*`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/twist?key=${iTechApi}&negara=id`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                client.reply(from, `*${data.result}*`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}ramal`:
                if (args.length === 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                const pas1 = body.split('&')[0].slice(7)
                const pas2 = body.split('&')[1]
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/tools/jodoh?key=${iTechApi}&p1=${pas1}&p2=${pas2}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            const { sisi, p1, p2, level, gambar } = data
                            const { positif, negatif } = sisi
                            client.sendFileFromUrl(from, gambar, 'jodohKZ0.png', `*Target:* ${p1}❤${p2}\n*Level:* ${level}\n\n*Positif:*\n${positif}\n\n*Negatif:*\n${negatif}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/jodoh?key=${iTechApi}&p1=${pas1}&p2=${pas2}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { sisi, p1, p2, level, gambar } = data
                                                const { positif, negatif } = sisi
                                                client.sendFileFromUrl(from, gambar, 'jodohKZ0.png', `*Target:* ${p1}❤${p2}\n*Level:* ${level}\n\n*Positif:*\n${positif}\n\n*Negatif:*\n${negatif}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/tools/jodoh?key=${iTechApi}&p1=${pas1}&p2=${pas2}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                const { sisi, p1, p2, level, gambar } = data
                                                const { positif, negatif } = sisi
                                                client.sendFileFromUrl(from, gambar, 'jodohKZ0.png', `*Target:* ${p1}❤${p2}\n*Level:* ${level}\n\n*Positif:*\n${positif}\n\n*Negatif:*\n${negatif}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/tools/jodoh?key=${iTechApi}&p1=${pas1}&p2=${pas2}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                const { sisi, p1, p2, level, gambar } = data
                                const { positif, negatif } = sisi
                                client.sendFileFromUrl(from, gambar, 'jodohKZ0.png', `*Target:* ${p1}❤${p2}\n*Level:* ${level}\n\n*Positif:*\n${positif}\n\n*Negatif:*\n${negatif}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}quotesnime`:
                if (args.length !== 1) return client.reply(from, 'Maaf format salah! ketik $menu untuk melihat format yang benar!', id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.i-tech.id/anim/quotes?key=${iTechApi}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                            const { anime, character, quotes } = data
                            client.reply(from, `*${quotes}*\n\n*Character:* ${character}\n*Anime:* ${anime}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/quotes?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { anime, character, quotes } = data
                                                client.reply(from, `*${quotes}*\n\n*Character:* ${character}\n*Anime:* ${anime}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.i-tech.id/anim/quotes?key=${iTechApi}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { anime, character, quotes } = data
                                                client.reply(from, `*${quotes}*\n\n*Character:* ${character}\n*Anime:* ${anime}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.i-tech.id/anim/quotes?key=${iTechApi}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                const { anime, character, quotes } = data
                                client.reply(from, `*${quotes}*\n\n*Character:* ${character}\n*Anime:* ${anime}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}komiku`:
                if (args.length === 1) return client.reply(from, 'Maaf format salah! ketik $menu untuk melihat format yang benar!')
                const komikuArgs = encodeURI(body.slice(8))
                if (isGroupMsg) {
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/komiku?q=${komikuArgs}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                            const { genre, info, link_dl, sinopsis, thumb } = data
                            client.sendFileFromUrl(from, thumb, 'komiku.jpg', `*${sinopsis}*\n\n${info}\n${genre}\nDownload:\n\n${link_dl}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/komiku?q=${komikuArgs}&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { genre, info, link_dl, sinopsis, thumb } = data
                                                client.sendFileFromUrl(from, thumb, 'komiku.jpg', `*${sinopsis}*\n\n${info}\n${genre}\nDownload:\n\n${link_dl}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/komiku?q=${komikuArgs}&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { genre, info, link_dl, sinopsis, thumb } = data
                                                client.sendFileFromUrl(from, thumb, 'komiku.jpg', `*${sinopsis}*\n\n${info}\n${genre}\nDownload:\n\n${link_dl}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://mhankbarbars.herokuapp.com/api/komiku?q=${komikuArgs}&apiKey=${mhankBB}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                const { genre, info, link_dl, sinopsis, thumb } = data
                                client.sendFileFromUrl(from, thumb, 'komiku.jpg', `*${sinopsis}*\n\n${info}\n${genre}\nDownload:\n\n${link_dl}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}kusonime`:
                if (args.length === 1) return client.reply(from, 'Maaf format salah! ketik $menu untuk melihat format yang benar!')
                const kusonimeArgs = encodeURI(body.slice(10))
                if (isGroupMsg) {
                    request.get({
                        url: `https://mhankbarbars.herokuapp.com/api/kuso?q=${kusonimeArgs}&apiKey=${mhankBB}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                            const { info, link_dl, sinopsis, thumb, title } = data
                            client.sendFileFromUrl(from, thumb, 'kusonime.jpg', `*${sinopsis}*\n\nTitle: ${title}\n${info}\nDownload:\n\n${link_dl}`, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/kuso?q=${kusonimeArgs}&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { info, link_dl, sinopsis, thumb, title } = data
                                                client.sendFileFromUrl(from, thumb, 'kusonime.jpg', `*${sinopsis}*\n\nTitle: ${title}\n${info}\nDownload:\n\n${link_dl}`, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://mhankbarbars.herokuapp.com/api/kuso?q=${kusonimeArgs}&apiKey=${mhankBB}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                                const { info, link_dl, sinopsis, thumb, title } = data
                                                client.sendFileFromUrl(from, thumb, 'kusonime.jpg', `*${sinopsis}*\n\nTitle: ${title}\n${info}\nDownload:\n\n${link_dl}`, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://mhankbarbars.herokuapp.com/api/kuso?q=${kusonimeArgs}&apiKey=${mhankBB}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.status === 'error') return client.reply(from, 'Maaf, fitur ini dalam perbaikan!', id)
                                const { info, link_dl, sinopsis, thumb, title } = data
                                client.sendFileFromUrl(from, thumb, 'kusonime.jpg', `*${sinopsis}*\n\nTitle: ${title}\n${info}\nDownload:\n\n${link_dl}`, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}wallpaper`:
                if (args.length === 1) return client.reply(from, 'Maaf format salah! ketik $menu untuk melihat format yang benar!')
                const wallpaperQuery = encodeURI(body.slice(11))
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.vhtear.com/walpaper?query=${wallpaperQuery}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.result.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                            var wallRandom = data.result[Math.floor(Math.random() * data.result.length)];
                            const { LinkImg } = wallRandom
                            client.sendFileFromUrl(from, LinkImg, 'kZ0-Wallpaper.jpg', ``, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/walpaper?query=${wallpaperQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                                var wallRandom = data.result[Math.floor(Math.random() * data.result.length)];
                                                const { LinkImg } = wallRandom
                                                client.sendFileFromUrl(from, LinkImg, 'kZ0-Wallpaper.jpg', ``, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/walpaper?query=${wallpaperQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.result.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                                var wallRandom = data.result[Math.floor(Math.random() * data.result.length)];
                                                const { LinkImg } = wallRandom
                                                client.sendFileFromUrl(from, LinkImg, 'kZ0-Wallpaper.jpg', ``, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.vhtear.com/walpaper?query=${wallpaperQuery}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.result.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                var wallRandom = data.result[Math.floor(Math.random() * data.result.length)];
                                const { LinkImg } = wallRandom
                                client.sendFileFromUrl(from, LinkImg, 'kZ0-Wallpaper.jpg', ``, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}gpict`:
                const gPictQuery = body.slice(7);
                if (!gPictQuery || gPictQuery.startsWith('https:')) return client.reply(from, 'Format Salah!!\n*Example:*\n     *$gpict* anime', id)
                if (isGroupMsg) {
                    request.get({
                        url: `https://api.vhtear.com/googleimg?query=${gPictQuery}&apikey=${vhTear}`,
                        json: true,
                        headers: {
                            'User-Agent': 'request'
                        }
                    }, (err, res, data) => {
                        if (err) {
                            console.log('Error : ', err);
                        } else if (res.statusCode !== 200) {
                            console.log('Status:', res.statusCode);
                        } else {
                            if (data.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                            const { result_search } = data.result
                            var googlePic = result_search[Math.floor(Math.random() * result_search.length)];
                            client.sendFileFromUrl(from, googlePic, 'KZ0-GoogleImage.jpg', ``, id)
                        }
                    })
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/googleimg?query=${gPictQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                                const { result_search } = data.result
                                                var googlePic = result_search[Math.floor(Math.random() * result_search.length)];
                                                client.sendFileFromUrl(from, googlePic, 'KZ0-GoogleImage.jpg', ``, id)
                                            }
                                        })
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        request.get({
                                            url: `https://api.vhtear.com/googleimg?query=${gPictQuery}&apikey=${vhTear}`,
                                            json: true,
                                            headers: {
                                                'User-Agent': 'request'
                                            }
                                        }, (err, res, data) => {
                                            if (err) {
                                                console.log('Error : ', err);
                                            } else if (res.statusCode !== 200) {
                                                console.log('Status:', res.statusCode);
                                            } else {
                                                if (data.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                                const { result_search } = data.result
                                                var googlePic = result_search[Math.floor(Math.random() * result_search.length)];
                                                client.sendFileFromUrl(from, googlePic, 'KZ0-GoogleImage.jpg', ``, id)
                                            }
                                        })
                                    });
                                });
                            }
                        });
                    } else {
                        request.get({
                            url: `https://api.vhtear.com/googleimg?query=${gPictQuery}&apikey=${vhTear}`,
                            json: true,
                            headers: {
                                'User-Agent': 'request'
                            }
                        }, (err, res, data) => {
                            if (err) {
                                console.log('Error : ', err);
                            } else if (res.statusCode !== 200) {
                                console.log('Status:', res.statusCode);
                            } else {
                                if (data.response === 403) return client.reply(from, 'Maaf, query yang anda maksud tidak di temukan!', id)
                                const { result_search } = data.result
                                var googlePic = result_search[Math.floor(Math.random() * result_search.length)];
                                client.sendFileFromUrl(from, googlePic, 'KZ0-GoogleImage.jpg', ``, id)
                            }
                        })
                    }
                }
                break
            case `${prefix}animeme`:
                const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
                const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
                if (isGroupMsg) {
                    client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                                    });
                                });
                            }
                        });
                    } else {
                        client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                    }
                }
                break
            case `${prefix}help`:
            case `${prefix}menu`:
                client.sendText(from, help)
                break
            case `${prefix}menu1`:
                client.sendText(from, mainMenu)
                break
            case `${prefix}menu2`:
                client.sendText(from, stickerMenu)
                break
            case `${prefix}menu3`:
                client.sendText(from, downloaderMenu)
                break
            case `${prefix}menu4`:
                client.sendText(from, animeMenu)
                break
            case `${prefix}menu5`:
                client.sendText(from, searchMenu)
                break
            case `${prefix}menu6`:
                client.sendText(from, nffMenu)
                break
            case `${prefix}menu7`:
                client.sendText(from, otherMenu)
                break
            case `${prefix}nsfwmenu`:
                if (!isNsfw) return client.reply(from, 'Fitur ini belum di aktifkan pada grup ini!', id)
                client.sendText(from, nsfwMenu)
                break
            case `${prefix}preminfo`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                // var totUser = result.length
                client.sendText(from, `${VIPInfo}`)
                break
            case `${prefix}jualbeli`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                client.sendText(from, mySeller)
                break
            case `${prefix}adminmenu`:
                if (!isGroupMsg) return client.reply(from, 'Maaf, Perintah hanya bisa di gunakan di dalam grup!', id)
                if (!isGroupAdmins) return client.reply(from, 'Maaf, Perintah hanya bisa di gunakan oleh Admin!', id)
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                client.sendText(from, adminMenu)
                break
            case `${prefix}readme`:
                client.reply(from, readme, id)
                break
            case `${prefix}info`:
            case `${prefix}about`:
                if (args.length !== 1) return client.reply(from, 'Format salah! Silahkan cek *$menu*')
                client.sendFileFromUrl(from, 'https://lh3.googleusercontent.com/pw/ACtC-3cil8hysxUupxnHJMe7vW3tQfqJ9dm7uqt4VvDa098RSBBD2dYH2NjgFN9V_WkFVrdt02Cbr4SrefUZylTohGyQ_3PE3Ct7_eDNskEtOZIuDt11tqyA3Yg--crGXrMDvrf9nLEEa1s7HNMJ7TGFFP94ew=w1180-h663-no?authuser=0', 'KYUZ0.jpg', info)
                break
            case `${prefix}snk`:
                client.reply(from, snk, id)
                break
            case `${prefix}google`:
                const googleImage = 'https://wallpaperaccess.com/full/839010.jpg';
                const googleQuery = body.slice(8)
                if (!googleQuery || googleQuery.startsWith('https:')) return client.reply(from, 'Maaf, Format salah!!\n\n*Format:*\n$google _[query]_\n\n*Example:*\n$google apa itu google?')
                var gOptions = {
                    host: "google.be",
                    qs: {
                        q: googleQuery,
                        filter: 0,
                        pws: 0
                    },
                    num: 5
                };
                const gSearch = await serp.search(gOptions);
                if (!gSearch[0].title) return client.reply(from, 'Maaf, Keyword atau kata kunci yang anda cari tidak dapat di temukan!', id)
                client.sendFileFromUrl(from, googleImage, 'googleImage', `*Berikut hasil pencarian dengan google:*\n
1. ${gSearch[0].title}\nLink: ${gSearch[0].url}\n
2. ${gSearch[1].title}\nLink: ${gSearch[1].url}\n
3. ${gSearch[2].title}\nLink: ${gSearch[2].url}\n
4. ${gSearch[3].title}\nLink: ${gSearch[3].url}\n
5. ${gSearch[4].title}\nLink: ${gSearch[4].url}\n
`)
                break
            case `${prefix}botstat`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                cpuStats.usagePercent(async function (error, percent) {
                    if (error) {
                        return console.log(error)
                    }
                    const cores = os.cpus().length
                    const cpuModel = os.cpus()[0].model
                    const usage = formatBytes(process.memoryUsage().heapUsed)
                    const Node = process.version
                    const CPU = percent.toFixed(2)
                    const loadedMsg = await client.getAmountOfLoadedMessages()
                    const chatIds = await client.getAllChatIds()
                    const groups = await client.getAllGroups()

                    function formatBytes(a, b) {
                        if (0 == a) return "0 Bytes";
                        let c = 1024,
                            d = b || 2,
                            e = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                            f = Math.floor(Math.log(a) / Math.log(c));
                        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
                    }

                    client.sendText(from, `*KZO WhatsApp BOT STATUS*\n
👤 *Personal Chat:* ${chatIds.length - groups.length}
👥 *Group:* ${groups.length}
💬 *Chatting:* ${loadedMsg}
🌎 *Total Chat:* ${chatIds.length}
💾 *Memory Usage:* ${usage}
📊 *CPU Usage:* ${CPU}%
🔧 *Node:* ${Node}
🖥️ *System Physical:* ${cores}Core - ${cpuModel}
==========================================`)
                })
                break
            case `${prefix}jadwal`:
            case `${prefix}matkul`:
                dSchedule()
                break

            case `${prefix}praktikum`:
                if (message.from === '6285899553614-1568599511@g.us') {
                    client.sendText(message.from, `
*Jadwal Praktikum*

*Senin*
\`\`\`TIDAK ADA PRAKTIKUM\`\`\`

*Selasa*
\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi & Komputasi - Kel.3)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi Professional - Kel.4)\n- Pitrasacha Adytia, ST., MT\`\`\`

*Rabu*
\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi & Komputasi - Kel.3)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi Professional - Kel.4)\n- Pitrasacha Adytia, ST., MT\`\`\`

*Kamis*
\`\`\`12.15 - 14.45 Pratikum IMK (Lab. Sistem Informasi - Kel.3)\n- Siti Qomariah, S.kom., M.Kom\`\`\`

\`\`\`12.00 - 14.45 Pratikum IMK (Lab. Jaringan Komputer - Kel.4)\n- Siti Qomariah, S.kom., M.Kom\`\`\`

*Jumat*
\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Aplikasi & Komputasi - Kel.3)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Sistem Informasi - Kel.4)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

*Sabtu*
\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Aplikasi & Komputasi - Kel.3)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Sistem Informasi - Kel.4)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`
            `)
                }
                break
            case `${prefix}fulljadwal`:
            case `${prefix}fullmatkul`:
                if (message.from === '6285899553614-1568599511@g.us') {
                    client.sendText(message.from, `
*Jadwal Mata Kuliah*

*Senin*
\`\`\`08.00 - 09.40 Pemograman Berorientasi Objek (R-15)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`10.00 - 11.40 Interaksi Manusia dan Komputer (R-1)\n- Siti Qomariah, S.kom., M.Kom\`\`\`

*Selasa*
\`\`\`10.00 - 11.40 MTK Infomatika 3 (R-2)\n- Hanifah Eka Wati, S.Pd., M.Pd\`\`\`

\`\`\`13.00 - 14.40 Teknologi Open Source (R-4/6)\n- Asep Nurhuda, S.Kom., M.Kom\`\`\`

*Rabu*
\`\`\`10.00 - 11.40 Sistem Basis Data 2 (R-4/6)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.00 - 14.40 Rekayasa Perangkat Lunak (R-1)\n- Eka Arriyanti, S.Pd., M.Kom\`\`\`

*Kamis*
\`\`\`08.00 - 09.40 Arsitektur dan Organisasi Komputer (R-2)\n- Vilianty Rafida, S.T., M.Kom\`\`\`

\`\`\`10.00 - 11.40 Ilmu Sosial Budaya Dasar (R-1)\n- Wiwik Widiyatmi, SP., M.SI\`\`\`

*Jumat*
\`\`\`TIDAK ADA PERKULIAHAN\`\`\`

*Sabtu*
\`\`\`TIDAK ADA PERKULIAHAN\`\`\`
            `)
                } else {
                    return
                }
                break
            case `${prefix}translate`:
                if (args.length !== 2) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
                if (quotedMsg === false) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
                const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
                if (isGroupMsg) {
                    translate(quoteText, args[1])
                        .then((result) => client.sendText(from, result))
                        .catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\nUntuk kode bahasa lebih lengkap bisa kunjungi link: https://bit.ly/2TChCUV'))
                } else {
                    if (!isVIP) {
                        sql = "SELECT id FROM limiter WHERE nouser='" + nomernya + "'"
                        con.query(sql, async function (err, result) {
                            if (err) throw err;
                            if (result.length !== 1) {
                                await saveNo(nomernya)
                                var sql1 = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql1, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql2 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql2, async function (err, result) {
                                        if (err) throw err;
                                        translate(quoteText, args[1])
                                            .then((result) => client.sendText(from, result))
                                            .catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\nUntuk kode bahasa lebih lengkap bisa kunjungi link: https://bit.ly/2TChCUV'))
                                    });
                                });
                            } else {
                                sql = "SELECT limitnya FROM limiter WHERE nouser='" + nomernya + "'"
                                con.query(sql, async function (err, result) {
                                    const limitny = result[0].limitnya
                                    if (err) throw err;
                                    if (limitny <= 0) return client.reply(from, 'Maaf, limit request anda telah mencapai batas! Silahkan upgrade ke USER VIP untuk dapat menggunakan fitur tanpa batasan limit!', id)
                                    const newLimit = limitny - 1
                                    var sql1 = "UPDATE limiter SET limitnya='" + newLimit + "' WHERE nouser='" + nomernya + "'"
                                    con.query(sql1, async function (err, result) {
                                        if (err) throw err;
                                        translate(quoteText, args[1])
                                            .then((result) => client.sendText(from, result))
                                            .catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\nUntuk kode bahasa lebih lengkap bisa kunjungi link: https://bit.ly/2TChCUV'))
                                    });
                                });
                            }
                        });
                    } else {
                        translate(quoteText, args[1])
                            .then((result) => client.sendText(from, result))
                            .catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\nUntuk kode bahasa lebih lengkap bisa kunjungi link: https://bit.ly/2TChCUV'))
                    }
                }
                break
            case `${prefix}cekresi`:
                if (args.length !== 3) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu.', id)
                const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
                if (!kurirs.includes(args[1])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
                console.log('Memeriksa No Resi', args[2], 'dengan ekspedisi', args[1])
                cekResi(args[1], args[2]).then((result) => client.sendText(from, result))
                break
            case `${prefix}bug`:
                const itsBug = body.slice(5);
                if (args.length === 1) return client.reply(from, `Format salah!!! \n\n Example: *$bug* fitur $help gak respon bro`)
                await client.sendText(ownerNumber, `*From:* ${sender.id.replace('@c.us', '')}\n*Report:*\n      ${itsBug}`)
                client.reply(from, `Laporan kamu sudah terkirim, Terimakasih sudah melaporkan bug ^-^`, id)
                break
            case `${prefix}unban`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                if (args.length !== 2) return client.reply(from, `Format salah!!! \n\n Example: *$unban* _08xxxxxxxxxx_ atau *$unban* _@tagNama_`, id)
                const getfromNumber = args[1];
                const itsNumber = getfromNumber.replace('0', '62') + '@c.us'
                if (mentionedJidList.length === 1) {
                    if (!blockNumber.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, tidak ada pada daftar banned !', id)
                    await client.contactUnblock(mentionedJidList[0]);
                    await client.reply(from, 'Berhasil membuka UnBan user!!', id)
                    client.sendText(mentionedJidList, 'Hi, Selamat blokir/banned kamu telah di buka oleh Admin ^-^')
                } else {
                    if (!args[1].startsWith('0')) return client.reply(from, `Format salah!!! \n\n Example: *$unban* _08xxxxxxxxxx_ atau *$unban* _@tagNama_`, id)
                    if (!blockNumber.includes(itsNumber)) return client.reply(from, 'Maaf, tidak ada pada daftar banned !', id)
                    await client.contactUnblock(itsNumber).then(() => client.sendText(itsNumber, 'Hi, Selamat blokir/banned kamu telah di buka oleh Admin ^-^'))
                    client.reply(from, 'Berhasil membuka UnBan user!!', id)
                }
                break
            case `${prefix}ban`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                if (args.length !== 2) return client.reply(from, `Format salah!!! \n\n Example: *$unban* _08xxxxxxxxxx_ atau *$unban* _@tagNama_`, id)
                const getfromNumber2 = args[1];
                const itsNumber2 = getfromNumber2.replace('0', '62') + '@c.us'
                if (mentionedJidList.length === 1) {
                    if (blockNumber.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, sudah ada pada daftar banned !')
                    await client.sendText(mentionedJidList, 'Hi, Maaf kamu telah di banned dengan Admin T-T')
                    client.contactBlock(mentionedJidList[0]);
                    client.reply(from, 'Berhasil Banned user!!', id)
                } else {
                    if (!args[1].startsWith('0')) return client.reply(from, `Format salah!!! \n\n Example: *$unban* _08xxxxxxxxxx_ atau *$unban* _@tagNama_`, id)
                    if (blockNumber.includes(itsNumber2)) return client.reply(from, 'Maaf, sudah ada pada daftar banned !')
                    await client.sendText(itsNumber2, 'Hi, Maaf kamu telah di banned dengan Admin T-T').then(() => client.contactBlock(itsNumber2))
                    await client.reply(from, 'Berhasil Banned user!!', id)
                }
                break
            case `${prefix}send`:
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                if (args.length === 1) return client.reply(from, `Format salah!!! \n\n Example: *$send* _08xxxxxxxxxx_ _isiPesan_`)
                const noTarget = body.split('|')[0].replace('0', '62').slice(6)
                const itsTarget = noTarget + '@c.us'
                // console.log(itsTarget)
                const itsPesanOwners = body.split('|')[1]
                await client.sendText(itsTarget, `*Hi kak, Kamu telah mendapat pesan dari owners ^-^*\n\n*Isi Pesan:*\n         ${itsPesanOwners}`)
                client.reply(from, 'Berhasil mengirim pesan!', id)
                break
        }

        if (!message.body) return
        const detectThis = message.body.toLowerCase().split(' ');
        // ! ANTI-LINK GROUP INVITATION
        if (detectThis.includes('https://chat.whatsapp.com/')) {
            if (!isAntiLink) return
            if (isGroupAdmins) return
            if (!isGroupMsg) return
            if (isOwner) return
            client.removeParticipant(from, sender.id).then(() => client.sendText(sender.id, `Anda telah di keluarkan dari *${formattedTitle}* dikarenakan mengirim Group Link Invitation di dalam grup tersebut.`));
        } else if (detectThis.includes('hai') || detectThis.includes('bot') || detectThis.includes('kyuz0') || detectThis.includes('p') || mentionedJidList.includes('6282250506816@c.us')) {
            if (message.body.startsWith(prefix)) return
            client.reply(from, 'Hai, ada apa?? Butuh bantuan ?\n\nKetik: *$help* untuk melihat daftar fitur yang saya miliki ^^', id)
        } else if (detectThis.includes('makasih') || detectThis.includes('thanks') || detectThis.includes('terima kasih') || detectThis.includes('thx') || detectThis.includes('maaciw')) {
            if (message.body.startsWith(prefix)) return
            client.reply(from, 'Sama-sama kak ^^\n\nJika masih butuh bantuan.. Silahkan ketik: *$help* untuk melihat daftar fitur yang saya miliki ^^', id)
        } else if (detectThis.includes('anjing') || detectThis.includes('kontol') || detectThis.includes('memek') || detectThis.includes('bangsat') || detectThis.includes('asu') || detectThis.includes('lonte')) {
            if (!isAntiToxic) return
            if (isGroupAdmins) return
            if (!isGroupMsg) return
            if (isOwner) return
            client.removeParticipant(from, sender.id).then(() => client.sendText(sender.id, `Anda telah di keluarkan dari *${formattedTitle}* dikarenakan berkata kasar di dalam grup tersebut.`));
        }

        // ! ext function
        function fancyTimeFormat(duration) {
            // Hours, minutes and seconds
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }

        function msToTimer(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + " : " + (seconds < 10 ? '0' : '') + seconds;
        }

        function saveNo(nomernya) {
            sql = "INSERT INTO limiter (nouser, limitnya) VALUES ('" + nomernya + "','25')"
            con.query(sql, async function (err, result) {
                if (err) throw err;
            });
        }

        function intToString(value) {
            var suffixes = ["", "K", "M", "B", "T"];
            var suffixNum = Math.floor(("" + value).length / 3);
            var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
            if (shortValue % 1 != 0) {
                shortValue = shortValue.toFixed(1);
            }
            return shortValue + suffixes[suffixNum];
        }

        async function dSchedule() {
            const date = new Date()
            const tahun = date.getFullYear()
            let bulan = date.getMonth()
            const tanggal = date.getDate()
            let hari = date.getDay()

            switch (hari) {
                case 0:
                    hari = 'Minggu'
                    break
                case 1:
                    hari = 'Senin'
                    break
                case 2:
                    hari = 'Selasa'
                    break
                case 3:
                    hari = 'Rabu'
                    break
                case 4:
                    hari = 'Kamis'
                    break
                case 5:
                    hari = "Jum'at"
                    break
                case 6:
                    hari = 'Sabtu'
                    break
            }
            switch (bulan) {
                case 0:
                    bulan = 'Januari'
                    break
                case 1:
                    bulan = 'Februari'
                    break
                case 2:
                    bulan = 'Maret'
                    break
                case 3:
                    bulan = 'April'
                    break
                case 4:
                    bulan = 'Mei'
                    break
                case 5:
                    bulan = 'Juni'
                    break
                case 6:
                    bulan = 'Juli'
                    break
                case 7:
                    bulan = 'Agustus'
                    break
                case 8:
                    bulan = 'September'
                    break
                case 9:
                    bulan = 'Oktober'
                    break
                case 10:
                    bulan = 'November'
                    break
                case 11:
                    bulan = 'Desember'
                    break
            }

            if (message.from === '6285899553614-1568599511@g.us') {
                if (hari === 'Senin') {
                    client.sendText(message.from, `*Hari ini: Senin, ${tanggal} ${bulan} ${tahun}*

\`\`\`08.00 - 09.40 Pemograman Berorientasi Objek (R-15)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`10.00 - 11.40 Interaksi Manusia dan Komputer (R-1)\n- Siti Qomariah, S.kom., M.Kom\`\`\`
`)
                } else if (hari === 'Selasa') {
                    client.sendText(message.from, `*Hari ini: Selasa, ${tanggal} ${bulan} ${tahun}*

\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi & Komputasi - Kel.3)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi Professional - Kel.4)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`10.00 - 11.40 MTK Infomatika 3 (R-2)\n- Hanifah Eka Wati, S.Pd., M.Pd\`\`\`

\`\`\`13.00 - 14.40 Teknologi Open Source (R-4/6)\n- Asep Nurhuda, S.Kom., M.Kom\`\`\`
`)
                } else if (hari === 'Rabu') {
                    client.sendText(message.from, `*Hari ini: Rabu, ${tanggal} ${bulan} ${tahun}*
                    
\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi & Komputasi - Kel.3)\n- Pitrasacha Adytia, ST., MT\`\`\`
                    
\`\`\`08.00 - 09.15 Pratikum PBO (Lab. Aplikasi Professional - Kel.4)\n- Pitrasacha Adytia, ST., MT\`\`\`

\`\`\`10.00 - 11.40 Sistem Basis Data 2 (R-4/6)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.00 - 14.40 Rekayasa Perangkat Lunak (R-1)\n- Eka Arriyanti, S.Pd., M.Kom\`\`\`
`)
                } else if (hari === 'Kamis') {
                    client.sendText(message.from, `*Hari ini: Kamis, ${tanggal} ${bulan} ${tahun}*

\`\`\`08.00 - 09.40 Arsitektur dan Organisasi Komputer (R-2)\n- Vilianty Rafida, S.T., M.Kom\`\`\`

\`\`\`10.00 - 11.40 Ilmu Sosial Budaya Dasar (R-1)\n- Wiwik Widiyatmi, SP., M.SI\`\`\`

\`\`\`12.15 - 14.45 Pratikum IMK (Lab. Sistem Informasi - Kel.3)\n- Siti Qomariah, S.kom., M.Kom\`\`\`

\`\`\`12.15 - 14.45 Pratikum IMK (Lab. Jaringan Komputer - Kel.4)\n- Siti Qomariah, S.kom., M.Kom\`\`\`
`)
                } else if (hari === 'Jum\'at') {
                    client.sendText(message.from, `*Hari ini: Jum\'at, ${tanggal} ${bulan} ${tahun}*

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Aplikasi & Komputasi - Kel.3)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Sistem Informasi - Kel.4)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`
`)
                } else if (hari === 'Sabtu') {
                    client.sendText(message.from, `*Hari ini: Sabtu, ${tanggal} ${bulan} ${tahun}*

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Aplikasi & Komputasi - Kel.3)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`

\`\`\`13.30 - 14.45 Pratikum SBD2 (Lab. Sistem Informasi - Kel.4)\n- Siti Lailiyah, S.Kom., M.Kom\`\`\`
`)
                } else {
                    client.sendText(message.from, `*Hari ini: Minggu, ${tanggal} ${bulan} ${tahun}*

Hari Minggu Libur Njir!!!!`)
                }
            }
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
