require("dotenv").config();
const teleBot = require("node-telegram-bot-api");

const TOKEN = process.env.API_BOT_TOKEN;
const BMKG_GEMPA = process.env.API_BMKG_GEMPA;
const BMKG_URL = process.env.BMKG_URL;

const options = {
  polling: true,
};
const bot = new teleBot(TOKEN, options);

const prefix = "/";
const start = new RegExp(`${prefix}start`);
const gempa = new RegExp(`${prefix}gempa`);

//! UNTUK SEMUA MESSAGE

// bot.on("message", (msg) => {
//   const id = msg.from.id;

//   bot.sendMessage(id, errMsg);
// });

//! UNTUK MESSAGE TERTENTU

//? /start
bot.onText(start, (txt) => {
  const id = txt.from.id;
  const namaUser = txt.from.first_name;
  bot.sendMessage(id, `Hallo ${namaUser} ada yang bisa dibantu?`);
});

//? /gempa
bot.onText(gempa, async (txt) => {
  const idBot = txt.from.id;

  const res = await fetch(BMKG_GEMPA);
  const {
    Infogempa: {
      gempa: {
        Tanggal,
        Jam,
        Coordinates,
        Lintang,
        Bujur,
        Magnitude,
        Kedalaman,
        Wilayah,
        Potensi,
        Dirasakan,
        Shakemap,
      },
    },
  } = await res.json();

  const resultText = `
----------INFO GEMPA----------

${Tanggal} | ${Jam}

----------------------------------------

• Kekuatan    : ${Magnitude} SR

• Kedalaman : ${Kedalaman}

----------------------------------------

• Wilayah    : ${Wilayah}

• Koordinat : ${Lintang} | ${Bujur}

----------------------------------------

• Dirasakan : ${Dirasakan}

• Potensi     : ${Potensi}

`;

  bot.sendPhoto(idBot, BMKG_URL + Shakemap, {
    caption: resultText,
  });
});
