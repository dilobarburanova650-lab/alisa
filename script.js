// ========================================
// ALISA
// O‘ZBEKCHA OVOZLI YORDAMCHI
// ========================================


// ========================================
// ELEMENTLAR
// ========================================

const $ = (selector) => {
  return document.querySelector(selector);
};

const $$ = (selector) => {
  return document.querySelectorAll(selector);
};


const micBtn = $("#micBtn");

const stopBtn = $("#stopBtn");

const textInput = $("#textInput");

const sendBtn = $("#sendBtn");

const messages = $("#messages");

const statusTitle = $("#statusTitle");

const statusSub = $("#statusSub");

const orbStatus = $("#orbStatus");

const meterFill = $("#meterFill");

const commandCount = $("#commandCount");


// ========================================
// OVOZ TANISH
// ========================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition = null;

let listening = false;

let speaking = false;

let count = 0;


// ========================================
// BROWSER TEKSHIRUVI
// ========================================

if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();


  recognition.lang =
    "uz-UZ";


  recognition.continuous =
    false;


  recognition.interimResults =
    true;


  recognition.maxAlternatives =
    2;


  // ======================================
  // OVOZLI QABUL BOSHLANDI
  // ======================================

  recognition.onstart = () => {

    setListening(true);

  };


  // ======================================
  // NATIJA
  // ======================================

  recognition.onresult = (event) => {

    let finalText = "";

    let temporaryText = "";


    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      const text =
        event.results[i][0].transcript;


      if (
        event.results[i].isFinal
      ) {

        finalText += text;

      } else {

        temporaryText += text;

      }

    }


    if (temporaryText) {

      statusSub.textContent =
        "Eshitdim: " +
        temporaryText;

    }


    if (finalText.trim()) {

      process(
        finalText.trim()
      );

    }

  };


  // ======================================
  // XATO
  // ======================================

  recognition.onerror = (event) => {

    console.log(
      "Ovoz xatosi:",
      event.error
    );


    setListening(false);


    statusSub.textContent =
      "Tayyor";

  };


  // ======================================
  // TUGADI
  // ======================================

  recognition.onend = () => {

    setListening(false);

  };

} else {

  micBtn.disabled = true;


  micBtn.querySelector(
    ".listen-text"
  ).textContent =
    "Chrome kerak";


  statusSub.textContent =
    "Ovozli boshqaruv uchun Chrome kerak";

}


// ========================================
// TINGLASH HOLATI
// ========================================

function setListening(value) {

  listening = value;


  document.body.classList.toggle(
    "listening",
    value
  );


  micBtn.classList.toggle(
    "listening",
    value
  );


  const listenText =
    micBtn.querySelector(
      ".listen-text"
    );


  if (value) {

    listenText.textContent =
      "Eshitmoqda...";


    orbStatus.textContent =
      "TINGLAYAPMAN";


    statusTitle.textContent =
      "Eshitmoqda";


    statusSub.textContent =
      "Gapiring...";


    meterFill.style.width =
      "95%";

  } else {

    listenText.textContent =
      "Gapirish";


    orbStatus.textContent =
      "TAYYOR";


    statusTitle.textContent =
      "Tayyor";


    statusSub.textContent =
      "Buyruq kutyapman";


    meterFill.style.width =
      "70%";

  }

}


// ========================================
// MICROFON
// ========================================

micBtn.addEventListener(
  "click",
  () => {

    if (!recognition) {
      return;
    }


    if (listening) {

      recognition.stop();

      return;

    }


    speechSynthesis.cancel();


    try {

      recognition.start();

    } catch (error) {

      console.log(error);

    }

  }
);


// ========================================
// TO‘XTATISH
// ========================================

stopBtn.addEventListener(
  "click",
  () => {

    if (
      recognition &&
      listening
    ) {

      recognition.stop();

    }


    speechSynthesis.cancel();


    speaking = false;


    setListening(false);


    statusTitle.textContent =
      "Tayyor";


    statusSub.textContent =
      "To‘xtatildi";

  }
);


// ========================================
// THEME
// ========================================

$("#themeBtn").addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light"
    );

  }
);


// ========================================
// SUHBATNI TOZALASH
// ========================================

$("#clearBtn").addEventListener(
  "click",
  () => {

    messages.innerHTML = "";


    addMessage(
      "ai",
      "Suhbat tozalandi. Yangi buyruqqa tayyorman. ✨"
    );

  }
);


// ========================================
// MATN YUBORISH
// ========================================

sendBtn.addEventListener(
  "click",
  () => {

    sendTyped();

  }
);


textInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter"
    ) {

      sendTyped();

    }

  }
);


// ========================================
// MATN BUYRUG‘I
// ========================================

function sendTyped() {

  const value =
    textInput.value.trim();


  if (!value) {
    return;
  }


  textInput.value = "";


  process(value);

}


// ========================================
// SPACE = MICROFON
// ========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.code === "Space" &&
      document.activeElement !== textInput
    ) {

      event.preventDefault();


      if (!listening) {

        micBtn.click();

      }

    }

  }
);


// ========================================
// TEZKOR TUGMALAR
// ========================================

$$(".quick-grid button")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        process(
          button.dataset.command
        );

      }
    );

  });


// ========================================
// CHATGA XABAR QO‘SHISH
// ========================================

function addMessage(
  type,
  text
) {

  const article =
    document.createElement(
      "article"
    );


  article.className =
    "message " + type;


  const avatar =
    document.createElement(
      "div"
    );


  avatar.className =
    "avatar";


  avatar.textContent =
    type === "ai"
      ? "A"
      : "S";


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    "bubble";


  const small =
    document.createElement(
      "small"
    );


  small.textContent =
    type === "ai"
      ? "ALISA"
      : "SIZ";


  const p =
    document.createElement(
      "p"
    );


  p.textContent =
    text;


  bubble.append(
    small,
    p
  );


  article.append(
    avatar,
    bubble
  );


  messages.append(
    article
  );


  messages.scrollTop =
    messages.scrollHeight;

}


// ========================================
// ASOSIY BUYRUQ TIZIMI
// ========================================

function process(command) {

  count++;


  commandCount.textContent =
    count;


  addMessage(
    "user",
    command
  );


  statusTitle.textContent =
    "Bajarilmoqda";


  statusSub.textContent =
    "Buyruq qayta ishlanmoqda...";


  meterFill.style.width =
    "100%";


  const text =
    command
      .toLowerCase()
      .replace(
        /[ʻ’‘`]/g,
        "'"
      );


  let answer = "";

  let action = null;


  // ======================================
  // SALOM
  // ======================================

  if (
    /salom|assalomu|hayrli/
      .test(text)
  ) {

    answer =
      "Salom! 😊 Men tayyorman. Nima qilamiz?";

  }


  // ======================================
  // ISM
  // ======================================

  else if (
    /isming|isming nima|kim san|kim siz/
      .test(text)
  ) {

    answer =
      "Men Alisa — o‘zbekcha ovozli yordamchingizman.";

  }


  // ======================================
  // VAQT
  // ======================================

  else if (
    /soat|vaqt/
      .test(text)
  ) {

    const date =
      new Date();


    const hours =
      String(
        date.getHours()
      ).padStart(
        2,
        "0"
      );


    const minutes =
      String(
        date.getMinutes()
      ).padStart(
        2,
        "0"
      );


    answer =
      `Hozir soat ${hours}:${minutes}.`;

  }


  // ======================================
  // SANA
  // ======================================

  else if (
    /bugun|sana|qaysi kun|kun nima/
      .test(text)
  ) {

    const date =
      new Date();


    const days = [

      "yakshanba",

      "dushanba",

      "seshanba",

      "chorshanba",

      "payshanba",

      "juma",

      "shanba"

    ];


    const months = [

      "yanvar",

      "fevral",

      "mart",

      "aprel",

      "may",

      "iyun",

      "iyul",

      "avgust",

      "sentabr",

      "oktabr",

      "noyabr",

      "dekabr"

    ];


    answer =
      `Bugun ${
        days[date.getDay()]
      }, ${
        date.getDate()
      }-${
        months[date.getMonth()]
      }.`;

  }


  // ======================================
  // GOOGLE
  // ======================================

  else if (
    /google|gugl/
      .test(text)
  ) {

    answer =
      "Google'ni ochyapman.";


    action =
      () => {

        window.open(
          "https://www.google.com",
          "_blank"
        );

      };

  }


  // ======================================
  // YOUTUBE
  // ======================================

  else if (
    /youtube|yutub/
      .test(text)
  ) {

    answer =
      "YouTube'ni ochyapman.";


    action =
      () => {

        window.open(
          "https://www.youtube.com",
          "_blank"
        );

      };

  }


  // ======================================
  // MUSIQA
  // ======================================

  else if (
    /musiqa|qo'shiq|qo‘shiq/
      .test(text)
  ) {

    answer =
      "Musiqa sahifasini ochyapman.";


    action =
      () => {

        window.open(
          "https://music.youtube.com",
          "_blank"
        );

      };

  }


  // ======================================
  // KALKULYATOR
  // ======================================

  else if (
    /kalkulyator|hisoblagich/
      .test(text)
  ) {

    answer =
      "Kalkulyatorni ochyapman.";


    action =
      () => {

        window.open(
          "https://www.google.com/search?q=calculator",
          "_blank"
        );

      };

  }


  // ======================================
  // TEZKOR REJIM
  // ======================================

  else if (
    /tezroq|tez qil|shoshil/
      .test(text)
  ) {

    answer =
      "Bo‘ldi. Tezkor rejim yoqildi. ⚡";

  }


  // ======================================
  // RAHMAT
  // ======================================

  else if (
    /rahmat|raxmat/
      .test(text)
  ) {

    answer =
      "Arzimaydi! 😊 Yana buyruq bering.";

  }


  // ======================================
  // XAYR
  // ======================================

  else if (
    /xayr/
      .test(text)
  ) {

    answer =
      "Xayr! Kuningiz yaxshi o‘tsin. 👋";

  }


  // ======================================
  // TUSHUNILMAGAN BUYRUQ
  // ======================================

  else {

    answer =
      `“${command}” deganingizni eshitdim. Bu buyruq uchun yangi funksiya qo‘shishimiz mumkin.`;

  }


  // ======================================
  // JAVOBNI CHATGA YOZISH
  // ======================================

  addMessage(
    "ai",
    answer
  );


  // ======================================
  // OVOZLI JAVOB
  // ======================================

  speak(answer);


  // ======================================
  // AMALNI BAJARISH
  // ======================================

  if (action) {

    setTimeout(
      action,
      450
    );

  }


  // ======================================
  // STATUSNI QAYTARISH
  // ======================================

  setTimeout(
    () => {

      statusTitle.textContent =
        "Tayyor";


      statusSub.textContent =
        "Buyruq kutyapman";


      meterFill.style.width =
        "70%";

    },
    900
  );

}


// ========================================
// ALISA OVOZI
// ========================================

function speak(text) {

  speechSynthesis.cancel();


  speaking = true;


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  // O‘ZBEK TILI
  utterance.lang =
    "uz-UZ";


  // MULoyim OVOZ
  utterance.rate =
    0.9;


  utterance.pitch =
    1.05;


  utterance.volume =
    0.86;


  // ======================================
  // OVOZNI TANLASH
  // ======================================

  const voices =
    speechSynthesis.getVoices();


  let voice =
    voices.find(
      (item) =>
        /^uz/i.test(
          item.lang
        )
    );


  if (!voice) {

    voice =
      voices.find(
        (item) =>
          /^tr/i.test(
            item.lang
          )
      );

  }


  if (!voice) {

    voice =
      voices.find(
        (item) =>
          /^ru/i.test(
            item.lang
          )
      );

  }


  if (voice) {

    utterance.voice =
      voice;

  }


  // ======================================
  // OVOZ BOSHLANDI
  // ======================================

  utterance.onstart =
    () => {

      speaking = true;


      statusTitle.textContent =
        "Alisa gapiryapti";


      statusSub.textContent =
        "Javob bermoqda...";


      orbStatus.textContent =
        "GAPIRYAPMAN";

    };


  // ======================================
  // OVOZ TUGADI
  // ======================================

  utterance.onend =
    () => {

      speaking = false;


      statusTitle.textContent =
        "Tayyor";


      statusSub.textContent =
        "Buyruq kutyapman";


      orbStatus.textContent =
        "TAYYOR";

    };


  // ======================================
  // OVOZ XATOSI
  // ======================================

  utterance.onerror =
    () => {

      speaking = false;


      statusTitle.textContent =
        "Tayyor";


      statusSub.textContent =
        "Buyruq kutyapman";

    };


  speechSynthesis.speak(
    utterance
  );

}


// ========================================
// OVOZLAR YUKLANGANDA
// ========================================

speechSynthesis.onvoiceschanged =
  () => {

    speechSynthesis.getVoices();

  };