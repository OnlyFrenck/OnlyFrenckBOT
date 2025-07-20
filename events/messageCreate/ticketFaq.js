const Ticket = require("../models/Ticket"); // o il path corretto

const faq = [
  {
    keywords: ["quando arriva", "quando ricevo", "premio", "ricompensa"],
    response: "🎁 **Premi:** I premi vengono distribuiti entro 48 ore dal termine dell’evento."
  },
  {
    keywords: ["come mi iscrivo", "partecipare", "iscrizione"],
    response: "📝 **Iscrizione:** Per partecipare, visita il sito https://iscrizioni.onlyfrenck.com e compila il modulo."
  },
  {
    keywords: ["quando è il prossimo evento", "data evento"],
    response: "📅 **Prossimo evento:** Controlla il calendario aggiornato su https://fortnite.onlyfrenck.com/calendario-eventi"
  },
  {
    keywords: ["come funziona", "spiegazione", "regole"],
    response: "📘 **Regolamento:** Puoi leggere il regolamento completo su https://fortnite.onlyfrenck.com/regolamento-challenge"
  }
];

module.exports = {
  async execute(message) {
    // Ignora bot e DM
    if (message.author.bot || message.channel.type !== 0) return;

    // Controlla se è un canale ticket
    const isTicket = await Ticket.findOne({ channelId: message.channel.id });
    if (!isTicket) return;

    const content = message.content.toLowerCase();

    for (const { keywords, response } of faq) {
      if (keywords.some(k => content.includes(k))) {
        return message.channel.send(response);
      }
    }
  }
};
