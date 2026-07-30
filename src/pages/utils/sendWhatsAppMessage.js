import { apiGet } from "../../api/api";

export async function sendMessage(studentId) {

  if(!studentId){ showAlert(400, "Student not found!")}

  try {
    const resp = await apiGet(
      `/api/create_watsapp_message_api?student_id=${encodeURIComponent(studentId)}`
    );

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.message);
    }

    sendWhatsAppMessage(data.phone, data.watsapp_message);

  } catch (err) {
    console.error(err);
    showAlert?.("error", err.message);
  }
}


export function sendWhatsAppMessage(phone, message = "") {
  if (phone === null || phone === undefined) {
    throw new Error("📞 Invalid phone number format.");
  }

  let formattedPhone = String(phone).trim().replace(/\D/g, "");

  if (formattedPhone.startsWith("0")) {
    formattedPhone = formattedPhone.substring(1);
  }

  if (formattedPhone.length !== 10) {
    throw new Error("📞 Invalid phone number. It must be 10 digits.");
  }

  formattedPhone = `91${formattedPhone}`;

  const storageKey = "wa_global_limit";
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{"lastSent":0,"count":0,"date":""}');

  if (stored.date !== today) {
    stored.count = 0;
    stored.date = today;
  }

  const randomDelay = Math.floor(Math.random() * 5000) + 10000;

  if (now - stored.lastSent < randomDelay) {
    throw new Error(
      `⏱ Please wait ${Math.ceil((randomDelay - (now - stored.lastSent)) / 1000)} seconds before sending another message.`
    );
  }

  if (stored.count >= 200) {
    throw new Error("📵 Daily limit of 200 messages reached.");
  }

  const encodedMessage = encodeURIComponent(message || "");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
  }

  stored.lastSent = now;
  stored.count += 1;
  localStorage.setItem(storageKey, JSON.stringify(stored));
}


