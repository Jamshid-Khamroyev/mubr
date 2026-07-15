require("dotenv").config()

const express = require("express")
const { TelegramBot } = require('node-telegram-bot-api');
const { default: mongoose } = require("mongoose")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
const cron = require("node-cron")
const rateLimit = require("express-rate-limit");
const dns = require("dns")
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const User = require("./models/user-model")
const Site = require("./models/site-model")
const complaintsModel = require("./models/complaint-model")

const userRouter = require("./routers/user-router")
const siteRouter = require("./routers/site-router")
const teamRouter = require("./routers/team-router")
const bookRouter = require("./routers/offer-book-router")
const complaintRouter = require("./routers/complaint-router")
const publicTestRouter = require("./routers/public-test-router")
const testRouter = require("./routers/test-router")
const factRouter = require("./routers/fact-router")
const eduCenterRouter = require("./routers/edu-center-router")
const newsRouter = require("./routers/news-router")
const albumRouter = require("./routers/album-router")
const notifRouter = require("./routers/notif-router")

// Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    ok: false,
    message: "Xatolik yuzaga keldi! Iltimos birozdan so'ng urinib ko'ring!",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const app = express()

// Midleweres
app.use("/api", limiter);
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
  origin: ["https://manager-mubr.onrender.com", "https://mubr.onrender.com", "https://admin-mubr.onrender.com"],
  credentials: true
}));

cron.schedule('0 0 * * *', async () => {
  try {
    // Shikoyatlar
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const result1 = await complaintsModel.deleteMany({createdAt: { $lte: oneWeekAgo }});

    // Userlar
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const result = await User.deleteMany({ lastLogin: { $lt: twoMonthsAgo } });

    // Maktablar
    const now = new Date();
    const expiredSites = await Site.find({
      time: { $lt: now },
      block: false 
    });
    if (expiredSites.length > 0) {
      for (const site of expiredSites) {
        site.block = true;
        await site.save();
      }
    }
  } catch (err) {
    console.error('[CRON XATOLIK]', err.message);
  }
});

cron.schedule('0 0 1 9 *', async () => {
  try {
      await User.updateMany(
          { userClassNumber: { $lt: 11 } },
          { $inc: { userClassNumber: 1 } }
      );
      await User.deleteMany({ userClassNumber: { $gt: 11 } });
  } catch (err) {
      console.error('Cron jobda xatolik:', err);
  }
})

// Routers
app.use("/api/site", siteRouter)
app.use("/api/user", userRouter)
app.use("/api/team", teamRouter)
app.use("/api/notif", notifRouter)
app.use("/api/book", bookRouter)
app.use("/api/complaint", complaintRouter)
app.use("/api/public/test", publicTestRouter)
app.use("/api/test", testRouter)
app.use("/api/fact", factRouter)
app.use("/api/edu-center", eduCenterRouter)
app.use("/api/news", newsRouter)
app.use("/api/album", albumRouter)

// Static files
app.use("/api/edu-center", express.static(path.join(__dirname, "local-centers-images")))
app.use("/api/new-images", express.static(path.join(__dirname, "news-images")))
app.use("/api/team-images", express.static(path.join(__dirname, "team-images")))

bot.on('message', async msg => {
	const chatId = msg.chat.id;
	const text = msg.text;

	if (text === '/start') {
		await bot.sendMessage(
			chatId,
			`Assalomu Aleykum! Hurmatli ${msg.from.first_name}. Sizni MUBR loyihasining rasmiy telegramm botida ko'rib turganimdan xursandman! Siz bu bot orqali Quiz Arena loyihasidan bemalol foydalanishingiz mumkin!`,
			{
				reply_markup: {
					keyboard: [
						[
							{
								text: "Kirish!",
								web_app: {
									url: 'https://uzun-quiz-arena.onrender.com',
								},
							},
						],
					],
				},
			}
		);
	}
})

const startApp = async () => {
    try {
        app.listen(process.env.PORT, () => console.log(`Server running is http://localhost:${process.env.PORT}`))
    } catch (error) {
        return console.log(error.message);
    }
}

startApp()