import { Payment, PaymentStats, AppSettings } from '../types';

function getBotConfig(settings?: AppSettings | null) {
  let token = settings?.telegram_bot_token || (import.meta as any).env.VITE_TELEGRAM_BOT_TOKEN?.trim();
  let chatId = settings?.telegram_channel_id || (import.meta as any).env.VITE_TELEGRAM_CHAT_ID?.trim();

  if (chatId && chatId.length >= 10 && !chatId.startsWith('-')) {
    chatId = '-' + chatId;
  }
  return { token, chatId };
}

function escapeHtml(text: string | number): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendPaymentNotification(payment: Payment, settings?: AppSettings | null, courseName?: string): Promise<{ success: boolean; error?: string }> {
  const { token: BOT_TOKEN, chatId: CHAT_ID } = getBotConfig(settings);

  if (!BOT_TOKEN) {
    const msg = 'টেলিগ্রাম বট টোকেন সেট করা নেই।';
    return { success: false, error: msg };
  }

  const date = new Date(payment.created_at).toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const message = `🔔 <b>নতুন পেমেন্ট জমা হয়েছে!</b>

💰 <b>পরিমাণ:</b> ৳${escapeHtml(payment.amount)}
📱 <b>নম্বর:</b> ${escapeHtml(payment.phone_number)}
💳 <b>মাধ্যম:</b> ${escapeHtml(payment.method)}
🎓 <b>কোর্স:</b> ${escapeHtml(courseName || 'নেই')}
📝 <b>মেসেজ:</b> ${escapeHtml(payment.message || 'নেই')}
⏰ <b>সময়:</b> ${escapeHtml(date)}

#Payment #Tracker #${escapeHtml(payment.method)} ${courseName ? '#' + escapeHtml(courseName.replace(/\s+/g, '_')) : ''}`;

  return sendToTelegram(BOT_TOKEN, CHAT_ID, message);
}

export async function sendSummaryNotification(stats: PaymentStats, settings?: AppSettings | null): Promise<{ success: boolean; error?: string }> {
  const { token: BOT_TOKEN, chatId: CHAT_ID } = getBotConfig(settings);

  if (!BOT_TOKEN) {
    return { success: false, error: 'টেলিগ্রাম বট টোকেন সেট করা নেই।' };
  }

  const date = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const message = `📊 <b>পেমেন্ট সামারি রিপোর্ট</b> 📊

📅 <b>তারিখ:</b> ${escapeHtml(date)}
👥 <b>মোট শিক্ষার্থী:</b> ${escapeHtml(stats.count)} জন
💰 <b>মোট পেমেন্ট:</b> ৳${escapeHtml(stats.totalAmount.toFixed(2))}

💳 <b>মাধ্যম ভিত্তিক পেমেন্ট:</b>
💖 বিকাশ (Bkash): ৳${escapeHtml(stats.byMethod.Bkash.toFixed(2))}
🧡 নগদ (Nagad): ৳${escapeHtml(stats.byMethod.Nagad.toFixed(2))}
💜 রকেট (Rocket): ৳${escapeHtml(stats.byMethod.Rocket.toFixed(2))}
🏦 ব্যাংক (Bank): ৳${escapeHtml(stats.byMethod.Bank.toFixed(2))}
🌐 অন্যান্য: ৳${escapeHtml(stats.byMethod.Other.toFixed(2))}

#Summary #Report #SOT_Payment`;

  return sendToTelegram(BOT_TOKEN, CHAT_ID, message);
}

async function sendToTelegram(token: string, chatId: string, text: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      console.error('Telegram API Error:', data);
      return { success: false, error: data.description || 'টেলিগ্রাম এপিআই এরর' };
    }
  } catch (error: any) {
    console.error('Failed to send Telegram notification:', error);
    return { success: false, error: error.message || 'নেটওয়ার্ক সমস্যা' };
  }
}
