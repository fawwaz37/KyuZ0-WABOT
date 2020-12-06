const { prefix } = require('../config.json')

function help() {
  return `
*===========================================*
                                  *!!! IMPORTANT !!!*
*______________________________________________________*

*[+]* BOT AKAN MEMBLOKIR NOMOR YANG MENCOBA 
     MENGHUBUNGI BOT VIA CALL!\n
*[+]* BOT INI ON 24JAM, GUNAKAN DENGAN BIJAK!\n
*[+]* JIKA BOT TIDAK ADA RESPON, ULANGI COMMAND 
     SETELAH 5 DETIK!
*______________________________________________________*
                                              *[ DONASI ]*
    Dana/Ovo/Gopay: 082255304881
    Saweria: https://saweria.co/msadam
    Tsel: 082255304881
*===========================================*  
ᛃ KYZ0 LIST MENU ᛃ
  ᛜ *${prefix}menu1* (MAIN MENU)
  ᛜ *${prefix}menu2* (STICKER MENU)
  ᛜ *${prefix}menu3* (DOWNLOADER MENU)
  ᛜ *${prefix}menu4* (ANIME MENU)
  ᛜ *${prefix}menu5* (SEARCH MENU)
  ᛜ *${prefix}menu6* (NFF MENU)
  ᛜ *${prefix}menu7* (OTHER MENU)

*KZO Official Forum:*
https://chat.whatsapp.com/BKAzv7JUjPW0Vo2ua6vgzw
`
}
exports.help = help()

function mainMenu() {
  return `
ᛃ KZ0 MAIN MENU ᛃ
  ᛜ *${prefix}preminfo*
  ᛜ *${prefix}adminmenu*
  ᛜ *${prefix}nsfwmenu*
  ᛜ *${prefix}jualbeli*
  ᛜ *${prefix}myinfo*
  ᛜ *${prefix}donasi*
  ᛜ *${prefix}about*
  ᛜ *${prefix}snk*
  ᛜ *${prefix}bug* _penjelasanBug_
`
}
exports.mainMenu = mainMenu()

function stickerMenu() {
  return `
ᛃ KZ0 STICKER MARKER ᛃ
  ᛜ *${prefix}sticker* 
  ᛜ *${prefix}stickergif* 
  ᛜ *${prefix}stickernobg*
`
}
exports.stickerMenu = stickerMenu()

function otherMenu() {
  return `
ᛃ KZ0 OTHER ᛃ
  ᛜ *${prefix}listblock*
  ᛜ *${prefix}ownergroup*
  ᛜ *${prefix}adminlist*
  ᛜ *${prefix}infogempa*
  ᛜ *${prefix}cekresi* _kurir_ _nomor_
  ᛜ *${prefix}translate* _kodeBahasa_
  ᛜ *${prefix}cuaca* _wilayah_
`
}
exports.otherMenu = otherMenu()

function nffMenu() {
  return `
ᛃ KZ0 NEED FOR FUN ᛃ
  ᛜ *${prefix}simi*
  ᛜ *${prefix}artinama* _namamu_
  ᛜ *${prefix}ptl*
  ᛜ *${prefix}rtt*
  ᛜ *${prefix}tebakgambar*
  ᛜ *${prefix}hilih* _text_
  ᛜ *${prefix}alay* _text_
  ᛜ *${prefix}meme* _textAtas_|_textBawah_
  ᛜ *${prefix}quotes*
  ᛜ *${prefix}quotes2*
  ᛜ *${prefix}quotes3*
  ᛜ *${prefix}faktaunik*
  ᛜ *${prefix}ramal* _nama1_ & _nama2_
  ᛜ *${prefix}pantunpucek*
  ᛜ *${prefix}quotesmarker* _|text|author|theme_
  ᛜ *${prefix}tts* _kodeBahasa_ _text_
`
}
exports.nffMenu = nffMenu()

function downloaderMenu() {
  return `
ᛃ KZ0 DOWNLOADER ᛃ
  ᛜ *${prefix}ig* _link_
  ᛜ *${prefix}igstalk* _@username_
  ᛜ *${prefix}tiktok* _link_
  ᛜ *${prefix}tkstalk* _@username_
  ᛜ *${prefix}ytmp4* _link_
  ᛜ *${prefix}ytmp3* _link_
  ᛜ *${prefix}ytplay* _title_
  ᛜ *${prefix}fb* _link_
`
}
exports.downloaderMenu = downloaderMenu()

function searchMenu() {
  return `
ᛃ KZ0 SEARCH ENGINE ᛃ
  ᛜ *${prefix}google* _query_
  ᛜ *${prefix}gpict* _query_
  ᛜ *${prefix}unsplash* _query_
  ᛜ *${prefix}wallhaven* _query_
  ᛜ *${prefix}wallpaper* _query_
  ᛜ *${prefix}pinterest* _textTheme_ atau _link_
  ᛜ *${prefix}brainly* _pertanyaan_  _.jumlah_
  ᛜ *${prefix}ytseacrh* _title_
  ᛜ *${prefix}spotify* _title_
  ᛜ *${prefix}wiki* _query_
  ᛜ *${prefix}lirik* _judulLagu_
  ᛜ *${prefix}chord* _judulLagu_
`
}
exports.searchMenu = searchMenu()

function animeMenu() {
  return `
ᛃ KZ0 ANIME ZONE ᛃ
  ᛜ *${prefix}dvanime*
  ᛜ *${prefix}anime* _query_
  ᛜ *${prefix}animeme*
  ᛜ *${prefix}hugnime*
  ᛜ *${prefix}loli*
  ᛜ *${prefix}wait*
  ᛜ *${prefix}kusonime* _title_
  ᛜ *${prefix}komiku* _title_
  ᛜ *${prefix}randomwibu*
  ᛜ *${prefix}randomanime*
  ᛜ *${prefix}quotesnime*
`
}
exports.animeMenu = animeMenu()

function nsfwMenu() {
  return `
ᛃ KZ0 NFSW/PRIVATE ᛃ
  ᛜ *${prefix}pornhub* _query_
  ᛜ *${prefix}xnxx* _link_
  ᛜ *${prefix}nekopoi* _link_
  ᛜ *${prefix}cersex*
  ᛜ *${prefix}cersex2*
  ᛜ *${prefix}yuri*
  ᛜ *${prefix}nekonime*
  ᛜ *${prefix}nekohunter*
  ᛜ *${prefix}nekohunter2*
  ᛜ *${prefix}hentaihunter*
  ᛜ *${prefix}randomtrapnime*
`
}
exports.nsfwMenu = nsfwMenu()

function adminMenu() {
  return `
ᛃ KZ0 ADMIN GROUP MENU ᛃ
  ᛜ *${prefix}simichat* enable/disable
  ᛜ *${prefix}antitoxic* enable/disable
  ᛜ *${prefix}antilink* enable/disable
  ᛜ *${prefix}welcome* enable/disable
  ᛜ *${prefix}nsfw* enable/disable
  ᛜ *${prefix}add* 08xxxxxxxxxx
  ᛜ *${prefix}kick* @nama
  ᛜ *${prefix}delete*
  ᛜ *${prefix}promote* @nama
  ᛜ *${prefix}demote* @nama
  ᛜ *${prefix}leave*`
}
exports.adminMenu = adminMenu()
function VIPInfo() {
  return `
*[ ᛃ VIP USER INFORMATION ᛃ ]*

Fiture:
  [>] Dapat mengakses semua fitur tanpa batasan.
  [>] Mendapatkan support dari developer.
  [>] Bisa menggunakan fitur SimiSimi chat.
  [>] Bisa mengguanakan fitur NSFW secara Private Chat.
  [>] Dll

[+]========================================[+]

Harga:  [+] 10K/minggu
            [+] 20K/bulan

Beli VIP: https://wa.me/+6282255304881
`
}
exports.VIPInfo = VIPInfo()
function ownerMenu() {
  return `
ᛃ OWNER COMMAND ᛃ
  ᛜ *${prefix}broadcast* _text_
  ᛜ *${prefix}ban* _nomer_
  ᛜ *${prefix}unban* _nomer_
  ᛜ *${prefix}send* _nomerTarget_ _|isiPesan_
  ᛜ *${prefix}leaveall*
  ᛜ *${prefix}join* _link_
  ᛜ *${prefix}clearall*
  ᛜ *${prefix}getss*
  ᛜ *${prefix}botstat*`
}
exports.ownerMenu = ownerMenu()
function mySeller() {
  return `
*[>] Virtual Account*

  (+) Viu
  (+) Netflix
  (+) GDrive Unlimited
  (+) YouTube Premium
  (+) Spotify Premium


*[>] Game Credits*

  (+) PUBG Mobile
  (+) MLBB Diamons
  (+) MLBB Gift Skin & Item
  (+) Free Fire Diamons

Contact:
https://wa.me/+6282255304881?text=Mau+beli+dong`
}
exports.mySeller = mySeller()

function info() {
  return `Hai, perkenalkan saya *KyuZ0* sebuah robot chat autorespon yang di buat menggunakan *NodeJS* dengan berbagai fitur menarik.
Saya di ciptakan oleh seseorang programmer kelahiran *Negara Indonesia* yang bernama *Muhammad Sadam* dengan mengembangkan source code yang sudah ada dari *MhankBarBar* dengan tujuan bisa bermanfaat untuk pengguna *WhatsApp*.

*Follow Me:*

Instagram: www.instagram.com/muhmmd.sadam/
Facebook: www.facebook.com/muhammadsadam729/
Twitter: www.twitter.com/muhmmd_sadam/

Default Source Code :
https://github.com/mhankbarbar/whatsapp-bot`
}
exports.info = info()
function snk() {
  return `Syarat dan Ketentuan Bot *KZ0 WaBot*
1. Teks dan nama pengguna WhatsApp anda akan kami simpan di dalam server selama bot aktif
2. Data anda akan di hapus ketika bot Offline
3. Kami tidak menyimpan gambar, video, file, audio, dan dokumen yang anda kirim
4. Kami tidak akan pernah meminta anda untuk memberikan informasi pribadi
5. Jika menemukan Bug/Error silahkan langsung lapor ke Owner bot
6. Apapun yang anda perintah pada bot ini, KAMI TIDAK AKAN BERTANGGUNG JAWAB!

Thanks !`
}
exports.snk = snk()
function donate() {
  return `Hai, terimakasih telah menggunakan bot ini, untuk mendukung bot ini kamu dapat membantu dengan berdonasi melalui link berikut:

  Dana/Ovo/Gopay: 082255304881
  Saweria: https://saweria.co/msadam
  Tsel: 082255304881

Donasi akan digunakan untuk pengembangan dan pengoperasian bot ini.
Terimakasih!`
}
exports.donate = donate()