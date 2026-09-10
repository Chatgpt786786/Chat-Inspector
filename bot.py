import os
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = os.getenv("8885543055:AAHtjjtlkSEoVZ2M_J3k1pDHA50wQqkL0vY")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "✅ Chat-Inspector Bot Online!\n\n"
        "Server connection successfully working."
    )


async def ping(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🟢 PONG — Server is running!")


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🤖 Chat-Inspector\n"
        "Status: ONLINE\n"
        "Server: Railway"
    )


def main():
    if not TOKEN:
        raise RuntimeError("BOT_TOKEN is missing")

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ping", ping))
    app.add_handler(CommandHandler("status", status))

    print("Bot started...")
    app.run_polling()


if __name__ == "__main__":
    main()
