import { supabase } from "./supabase.js";

import {
  signUp,
  signIn,
  signOut,
  getCurrentUser
} from "./auth.js";

import {
  getProfile,
  saveProfile,
  uploadAvatar
} from "./profile.js";

import {
  createTrace,
  getMyTraces,
  deleteTrace,
  getAllTraces,
  unlockTrace
} from "./traces.js";

import {
  likeTrace,
  unlikeTrace,
  getLikeCount,
  checkUserLike,
  addComment,
  deleteComment,
  getTraceComments
} from "./social.js";


let currentUser = null;
let isRegisterMode = true;
let countdownIntervals = new Map();


/* =========================
   العناصر
========================= */

const authScreen =
  document.getElementById("auth-screen");

const mainScreen =
  document.getElementById("main-screen");

const authTitle =
  document.getElementById("auth-title");

const displayNameInput =
  document.getElementById("display-name");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const authButton =
  document.getElementById("auth-button");

const switchAuth =
  document.getElementById("switch-auth");

const authMessage =
  document.getElementById("auth-message");

const userName =
  document.getElementById("user-name");

const profileName =
  document.getElementById("profile-name");

const profileEmail =
  document.getElementById("profile-email");

const profileAvatar =
  document.getElementById("profile-avatar");

const logoutButton =
  document.getElementById("logout-button");

const traceForm =
  document.getElementById("trace-form");

const traceMessage =
  document.getElementById("trace-message");

const saveTraceButton =
  document.getElementById("save-trace");

const cancelTraceButton =
  document.getElementById("cancel-trace");

const newTraceButton =
  document.getElementById("new-trace-button");

const newTraceButton2 =
  document.getElementById("new-trace-button-2");

const characterCount =
  document.getElementById("character-count");

const traceStatus =
  document.getElementById(
    "trace-message-status"
  );

const traceList =
  document.getElementById("trace-list");

const exploreList =
  document.getElementById("explore-list");

const traceCount =
  document.getElementById("trace-count");

const avatarInput =
  document.getElementById("avatar-input");

const profileStatus =
  document.getElementById("profile-status");

const enableTimeLock =
  document.getElementById("enable-time-lock");

const timeLockOptions =
  document.getElementById("time-lock-options");

const unlockDatetime =
  document.getElementById("unlock-datetime");

const countdownDisplay =
  document.getElementById("countdown-display");


/* =========================
   تشغيل التطبيق
========================= */

async function init() {

  const user =
    await getCurrentUser();

  if (user) {

    await showApp(user);

  } else {

    showAuth();

  }

}


init();


/* =========================
   المصادقة
========================= */

authButton.addEventListener(
  "click",
  async () => {

    authMessage.textContent =
      "جارٍ المعالجة...";

    authMessage.style.color =
      "#aaa";


    try {

      if (isRegisterMode) {

        const name =
          displayNameInput.value.trim();

        const email =
          emailInput.value.trim();

        const password =
          passwordInput.value;


        if (!name) {

          throw new Error(
            "اكتب اسمك أولًا"
          );

        }


        if (!email || !password) {

          throw new Error(
            "أدخل البريد وكلمة المرور"
          );

        }


        const {
          data,
          error
        } = await signUp(
          email,
          password,
          name
        );


        if (error) {

          throw error;

        }


        if (data.session) {

          await showApp(data.user);

        } else {

          authMessage.textContent =
            "تم إنشاء الحساب. تحقق من بريدك الإلكتروني إذا طُلب منك ذلك.";

          authMessage.style.color =
            "#9bd9a5";

        }


      } else {

        const email =
          emailInput.value.trim();

        const password =
          passwordInput.value;


        if (!email || !password) {

          throw new Error(
            "أدخل البريد وكلمة المرور"
          );

        }


        const {
          data,
          error
        } = await signIn(
          email,
          password
        );


        if (error) {

          throw error;

        }


        await showApp(data.user);

      }


    } catch (error) {

      console.error(error);

      authMessage.textContent =
        getErrorMessage(error);

      authMessage.style.color =
        "#ff7777";

    }

  }
);


/* =========================
   تبديل تسجيل / دخول
========================= */

switchAuth.addEventListener(
  "click",
  () => {

    isRegisterMode =
      !isRegisterMode;


    if (isRegisterMode) {

      authTitle.textContent =
        "إنشاء حساب";

      authButton.textContent =
        "إنشاء الحساب";

      switchAuth.textContent =
        "لدي حساب بالفعل";

      displayNameInput.style.display =
        "block";

    } else {

      authTitle.textContent =
        "تسجيل الدخول";

      authButton.textContent =
        "دخول";

      switchAuth.textContent =
        "إنشاء حساب جديد";

      displayNameInput.style.display =
        "none";

    }


    authMessage.textContent = "";

  }
);


/* =========================
   تسجيل الخروج
========================= */

logoutButton.addEventListener(
  "click",
  async () => {

    await signOut();

    currentUser = null;

    showAuth();

  }
);


/* =========================
   إظهار التطبيق
========================= */

async function showApp(user) {

  currentUser = user;

  authScreen.classList.add(
    "hidden"
  );

  mainScreen.classList.remove(
    "hidden"
  );


  const name =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "صديق";


  userName.textContent =
    name;


  profileName.textContent =
    name;


  profileEmail.textContent =
    user.email || "";


  profileAvatar.textContent =
    name.charAt(0);


  try {

    const {
      data,
      error
    } = await getProfile(
      user.id
    );


    if (!error && data) {

      if (data.display_name) {

        userName.textContent =
          data.display_name;

        profileName.textContent =
          data.display_name;

        profileAvatar.textContent =
          data.display_name
            .charAt(0);

      }


      if (data.avatar_url) {

        setAvatar(
          data.avatar_url
        );

      }

    }

  } catch (error) {

    console.error(
      "خطأ في الملف الشخصي:",
      error
    );

  }


  await loadTraces();

}


/* =========================
   إظهار شاشة الدخول
========================= */

function showAuth() {

  mainScreen.classList.add(
    "hidden"
  );

  authScreen.classList.remove(
    "hidden"
  );

  passwordInput.value = "";

}


/* =========================
   التنقل
========================= */

document
  .querySelectorAll(".nav-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const page =
          button.dataset.page;


        document
          .querySelectorAll(".nav-button")
          .forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        document
          .querySelectorAll(".page")
          .forEach(section => {

            section.classList.add(
              "hidden"
            );

          });


        document
          .getElementById(
            `page-${page}`
          )
          .classList.remove(
            "hidden"
          );


        if (page === "traces") {

          loadTraces();

        }

        if (page === "explore") {

          loadExplore();

        }

      }
    );

  });


/* =========================
   القفل الزمني
========================= */

enableTimeLock.addEventListener(
  "change",
  () => {

    if (enableTimeLock.checked) {

      timeLockOptions.classList.remove(
        "hidden"
      );

      const now = new Date();

      now.setHours(now.getHours() + 1);

      const isoString =
        now.toISOString()
          .slice(0, 16);

      unlockDatetime.value =
        isoString;

      updateCountdown();

    } else {

      timeLockOptions.classList.add(
        "hidden"
      );

      countdownDisplay.textContent = "";

    }

  }
);


unlockDatetime.addEventListener(
  "change",
  updateCountdown
);


function updateCountdown() {

  if (!unlockDatetime.value) return;

  const unlockTime =
    new Date(
      unlockDatetime.value
    );

  const now = new Date();

  const diff = unlockTime - now;


  if (diff <= 0) {

    countdownDisplay.textContent =
      "⏰ الوقت قد انتهى!";

    countdownDisplay.style.color =
      "#9bd9a5";

    return;

  }


  const days =
    Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours =
    Math.floor(
      (diff % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (diff % (1000 * 60 * 60)) /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (diff % (1000 * 60)) / 1000
    );


  countdownDisplay.textContent =
    `⏳ سيُفتح بعد: ${days}د ${hours}س ${minutes}د ${seconds}ث`;

  countdownDisplay.style.color =
    "#666673";

}


setInterval(() => {

  if (
    enableTimeLock.checked &&
    unlockDatetime.value
  ) {

    updateCountdown();

  }

}, 1000);


/* =========================
   إنشاء أثر
========================= */

function openTraceForm() {

  traceForm.classList.remove(
    "hidden"
  );

  traceMessage.focus();

  enableTimeLock.checked = false;

  timeLockOptions.classList.add(
    "hidden"
  );

  countdownDisplay.textContent = "";

}


newTraceButton.addEventListener(
  "click",
  openTraceForm
);


newTraceButton2.addEventListener(
  "click",
  openTraceForm
);


cancelTraceButton.addEventListener(
  "click",
  () => {

    traceForm.classList.add(
      "hidden"
    );

    traceMessage.value = "";

    updateCharacterCount();

    traceStatus.textContent = "";

    enableTimeLock.checked = false;

    timeLockOptions.classList.add(
      "hidden"
    );

  }
);


/* =========================
   عداد الأحرف
========================= */

traceMessage.addEventListener(
  "input",
  updateCharacterCount
);


function updateCharacterCount() {

  characterCount.textContent =
    `${traceMessage.value.length} / 5000`;

}


/* =========================
   حفظ الأثر
========================= */

saveTraceButton.addEventListener(
  "click",
  async () => {

    const message =
      traceMessage.value.trim();


    if (!message) {

      traceStatus.textContent =
        "اكتب أثرك أولًا.";

      traceStatus.style.color =
        "#ff7777";

      return;

    }


    if (!currentUser) {

      traceStatus.textContent =
        "يجب تسجيل الدخول أولًا.";

      return;

    }


    saveTraceButton.disabled =
      true;

    traceStatus.textContent =
      "جارٍ حفظ الأثر...";

    traceStatus.style.color =
      "#aaa";


    try {

      let unlockAt = null;


      if (
        enableTimeLock.checked &&
        unlockDatetime.value
      ) {

        unlockAt =
          new Date(
            unlockDatetime.value
          ).toISOString();

      }


      const {
        error
      } = await createTrace(
        currentUser.id,
        message,
        unlockAt
      );


      if (error) {

        throw error;

      }


      traceStatus.textContent =
        "تم حفظ أثرك بنجاح.";

      traceStatus.style.color =
        "#9bd9a5";


      traceMessage.value = "";

      updateCharacterCount();

      enableTimeLock.checked = false;

      timeLockOptions.classList.add(
        "hidden"
      );


      await loadTraces();


      setTimeout(() => {

        traceForm.classList.add(
          "hidden"
        );

        traceStatus.textContent = "";

      }, 900);


    } catch (error) {

      console.error(
        "خطأ في حفظ الأثر:",
        error
      );


      traceStatus.textContent =
        getErrorMessage(error);

      traceStatus.style.color =
        "#ff7777";

    }


    saveTraceButton.disabled =
      false;

  }
);


/* =========================
   تحميل الآثار
========================= */

async function loadTraces() {

  if (!currentUser) return;


  traceList.innerHTML =
    `<div class="empty-state">
      جارٍ تحميل آثارك...
    </div>`;


  try {

    const {
      data,
      error
    } = await getMyTraces(
      currentUser.id
    );


    if (error) {

      throw error;

    }


    const traces =
      data || [];


    traceCount.textContent =
      `${traces.length} أثر`;


    if (traces.length === 0) {

      traceList.innerHTML =
        `<div class="empty-state">
          لم تترك أثرًا بعد.
        </div>`;

      return;

    }


    traceList.innerHTML = "";


    traces.forEach(
      trace => {

        const article =
          document.createElement(
            "article"
          );


        article.className =
          "trace";


        const text =
  document.createElement(
    "div"
  );

text.className =
  "trace-text";


const isLocked =
  trace.is_locked &&
  trace.unlock_at &&
  new Date(trace.unlock_at) > new Date();


if (isLocked) {

  text.textContent =
    "🔒 هذا الأثر مقفول حتى يحين موعد فتحه.";

  text.style.color =
    "#666673";

} else {

  text.textContent =
    trace.message;

}


        const date =
          document.createElement(
            "div"
          );


        date.className =
          "trace-date";


        const dateText =
          formatDate(
            trace.created_at
          );

        const lockStatus =
  isLocked
    ? " 🔒 مقفول"
    : "";

        date.textContent =
          dateText + lockStatus;


        if (trace.is_locked && trace.unlock_at) {

          const unlockTime =
            new Date(
              trace.unlock_at
            );

          const now = new Date();

          const diff =
            unlockTime - now;


          if (diff > 0) {

            const hours =
              Math.floor(
                diff / (1000 * 60 * 60)
              );

            const minutes =
              Math.floor(
                (diff % (1000 * 60 * 60)) /
                (1000 * 60)
              );

            const countdownDiv =
              document.createElement(
                "div"
              );

            countdownDiv.className =
              "countdown-info";

            countdownDiv.textContent =
              `⏳ يُفتح بعد ${hours}س ${minutes}د`;

            countdownDiv.style.color =
              "#666673";

            countdownDiv.style.fontSize =
              "12px";

            countdownDiv.style.marginTop =
              "4px";

            date.appendChild(
              countdownDiv
            );

          }

        }


        const deleteButton =
          document.createElement(
            "button"
          );


        deleteButton.className =
          "secondary-button";


        deleteButton.textContent =
          "حذف الأثر";


        deleteButton.addEventListener(
          "click",
          () =>
            removeTrace(
              trace.id
            )
        );


        article.appendChild(
          text
        );

        article.appendChild(
          date
        );

        article.appendChild(
          deleteButton
        );


        traceList.appendChild(
          article
        );

      }
    );


  } catch (error) {

    console.error(error);

    traceList.innerHTML =
      `<div class="empty-state">
        تعذر تحميل الآثار.
      </div>`;

  }

}


/* =========================
   تحميل الاستكشاف
========================= */

async function loadExplore() {

  if (!currentUser || !exploreList) return;

  exploreList.innerHTML = `
    <div class="empty-state">
      <p>🌍 جارٍ تحميل الآثار...</p>
    </div>
  `;

  try {

    console.log("EXPLORE START");
    
    const {
      data: traces,
      error
    } = await getAllTraces();

    if (error) {
      throw error;
    }

    const visibleTraces = (traces || [])
  .filter(trace => trace.user_id)
  .filter(trace => {

    if (!trace.is_locked) {
      return true;
    }

    if (!trace.unlock_at) {
      return false;
    }

    return new Date(trace.unlock_at) <= new Date();

  })
  .filter(trace => {

    return trace.user_id !== currentUser.id;

  });

    if (visibleTraces.length === 0) {

      exploreList.innerHTML = `
        <div class="empty-state">
          <p>✨ لا توجد آثار من مستخدمين آخرين بعد.</p>
        </div>
      `;

      return;
    }

    
    const userIds = [
  ...new Set(
    visibleTraces
      .map(trace => trace.user_id)
      .filter(userId => userId)
  )
];

    const {
      data: profiles,
      error: profileError
    } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    if (profileError) {
      throw profileError;
    }

    const profileMap = new Map(
      (profiles || []).map(
        profile => [
          profile.id,
          profile
        ]
      )
    );

    exploreList.innerHTML = "";

    visibleTraces.forEach(trace => {

      const profile =
        profileMap.get(trace.user_id);

      const name =
        profile?.display_name ||
        "مستخدم الأثر";

      const article =
        document.createElement("article");

      article.className = "trace";

      const avatar =
        document.createElement("div");

      avatar.className = "avatar";

      avatar.style.width = "42px";
      avatar.style.height = "42px";
      avatar.style.fontSize = "16px";
      avatar.style.marginBottom = "10px";

      if (profile?.avatar_url) {

        const img =
          document.createElement("img");

        img.src = profile.avatar_url;
        img.alt = name;

        avatar.appendChild(img);

      } else {

        avatar.textContent =
          name.charAt(0).toUpperCase();

      }

      const author =
        document.createElement("div");

      author.className =
        "trace-author";

      author.textContent =
        `👤 ${name}`;

      const message =
        document.createElement("div");

      message.className =
        "trace-text";

      message.textContent =
        trace.message;

      const date =
        document.createElement("div");

      date.className =
        "trace-date";

      date.textContent =
        `📅 ${formatDate(trace.created_at)}`;

      article.appendChild(avatar);
      article.appendChild(author);
      article.appendChild(message);
      article.appendChild(date);

      exploreList.appendChild(article);

      setupSocialActions(
        article,
        trace
      );

    });

  } catch (error) {


console.error(
  "خطأ في تحميل الاستكشاف:",
  error
);

exploreList.innerHTML = `
  <div class="empty-state">
    <p>تعذر تحميل الآثار.</p>
    <p style="font-size:12px; direction:ltr;">
      ${error?.message || "خطأ غير معروف"}
    </p>
  </div>
`;
  }

}
/* =========================
   تفاعل الإعجاب والتعليقات
========================= */

async function setupSocialActions(
  article,
  trace
) {

  const socialBox =
    document.createElement("div");

  socialBox.className =
    "social-actions";

  /* ❤️ الإعجاب */

  const likeButton =
    document.createElement("button");

  likeButton.className =
    "social-button";

  likeButton.textContent =
    "❤️ إعجاب";


  const likeCount =
    document.createElement("span");

  likeCount.className =
    "like-count";


  async function refreshLike() {

    const {
      count,
      error
    } = await getLikeCount(
      trace.id
    );

    if (!error) {

      likeCount.textContent =
        ` ${count || 0}`;

    }

    const {
      data: userLike
    } = await checkUserLike(
      currentUser.id,
      trace.id
    );

    if (userLike) {

      likeButton.classList.add(
        "liked"
      );

      likeButton.textContent =
        "💖 إلغاء الإعجاب";

    } else {

      likeButton.classList.remove(
        "liked"
      );

      likeButton.textContent =
        "❤️ إعجاب";

    }

  }


  likeButton.addEventListener(
    "click",
    async () => {

      likeButton.disabled = true;

      try {

        const {
          data: existingLike
        } = await checkUserLike(
          currentUser.id,
          trace.id
        );


        if (existingLike) {

          await unlikeTrace(
            currentUser.id,
            trace.id
          );

        } else {

          await likeTrace(
            currentUser.id,
            trace.id
          );

        }


        await refreshLike();

      } catch (error) {

        console.error(
          "خطأ في الإعجاب:",
          error
        );

      }

      likeButton.disabled = false;

    }
  );

  socialBox.appendChild(
    likeCount
  );

  socialBox.appendChild(
  commentButton
);
  
  socialBox.appendChild(
    likeCount
  );
console.log("LIKE DONE - COMMENTS START");

  /* 💬 التعليقات */

  const commentButton =
    document.createElement("button");

  commentButton.className =
    "social-button";

  commentButton.textContent =
    "💬 التعليقات";


  const commentsBox =
    document.createElement("div");

  commentsBox.className =
    "comments-box";

  commentsBox.style.display =
    "none";


  const commentInput =
    document.createElement("input");

  commentInput.type =
    "text";

  commentInput.placeholder =
    "اكتب تعليقك...";

  commentInput.className =
    "comment-input";


  const commentSend =
    document.createElement("button");

  commentSend.className =
    "social-button";

  commentSend.textContent =
    "إرسال";


  const commentsList =
    document.createElement("div");

  commentsList.className =
    "comments-list";


  async function loadComments() {

    commentsList.innerHTML =
      "جارٍ تحميل التعليقات...";


    const {
      data,
      error
    } = await getTraceComments(
      trace.id
    );


    if (error) {

      commentsList.textContent =
        "تعذر تحميل التعليقات.";

      return;

    }


    commentsList.innerHTML = "";


    if (!data || data.length === 0) {

      commentsList.textContent =
        "لا توجد تعليقات بعد.";

      return;

    }


    data.forEach(
      comment => {

        const item =
          document.createElement("div");

        item.className =
          "comment";


        const name =
          comment.profiles?.display_name ||
          "مستخدم";


        item.textContent =
          `${name}: ${comment.message}`;


        commentsList.appendChild(
          item
        );

      }
    );

  }


  commentButton.addEventListener(
    "click",
    async () => {

      if (
        commentsBox.style.display ===
        "none"
      ) {

        commentsBox.style.display =
          "block";

        await loadComments();

      } else {

        commentsBox.style.display =
          "none";

      }

    }
  );


  commentSend.addEventListener(
    "click",
    async () => {

      const message =
        commentInput.value.trim();


      if (!message) return;


      commentSend.disabled =
        true;


      const {
        error
      } = await addComment(
        currentUser.id,
        trace.id,
        message
      );


      if (!error) {

        commentInput.value = "";

        await loadComments();

      } else {

        console.error(
          "خطأ في إضافة التعليق:",
          error
        );

      }


      commentSend.disabled =
        false;

    }
  );


  commentsBox.appendChild(
    commentInput
  );

  commentsBox.appendChild(
    commentSend
  );

  commentsBox.appendChild(
    commentsList
  );


  article.appendChild(
    socialBox
  );

  article.appendChild(
    commentsBox
  );


  await refreshLike();

}

/* =========================
   حذف أثر
========================= */

async function removeTrace(
  traceId
) {

  const confirmed =
    confirm(
      "هل تريد حذف هذا الأثر؟"
    );


  if (!confirmed) return;


  try {

    const {
      error
    } = await deleteTrace(
      currentUser.id,
      traceId
    );


    if (error) {

      throw error;

    }


    await loadTraces();


  } catch (error) {

    console.error(error);

    alert(
      getErrorMessage(error)
    );

  }

}


/* =========================
   الصورة الشخصية
========================= */

avatarInput.addEventListener(
  "change",
  async event => {

    const file =
      event.target.files?.[0];


    if (!file || !currentUser) {
      return;
    }


    if (!file.type.startsWith("image/")) {

      profileStatus.textContent =
        "اختر صورة فقط.";

      return;

    }


    profileStatus.textContent =
      "جارٍ رفع الصورة...";


    try {

      const {
        error
      } = await uploadAvatar(
        currentUser.id,
        file
      );


      if (error) {

        throw error;

      }


      /*
        نستخدم رابطًا ثابتًا مع
        كسر التخزين المؤقت.
      */

      const extension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();


      const {
        data
      } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(
          `${currentUser.id}/avatar.${extension}`
        );


      const avatarUrl =
        `${data.publicUrl}?t=${Date.now()}`;


      await saveProfile(
        currentUser.id,
        profileName.textContent,
        avatarUrl
      );


      setAvatar(
        avatarUrl
      );


      profileStatus.textContent =
        "تم تحديث الصورة.";

      profileStatus.style.color =
        "#9bd9a5";


    } catch (error) {

      console.error(error);

      profileStatus.textContent =
        getErrorMessage(error);

      profileStatus.style.color =
        "#ff7777";

    }

  }
);


/* =========================
   عرض الصورة
========================= */

function setAvatar(url) {

  profileAvatar.innerHTML = "";

  const image =
    document.createElement("img");

  image.src = url;

  image.alt = "الصورة الشخصية";

  profileAvatar.appendChild(
    image
  );

}


/* =========================
   التاريخ
========================= */

function formatDate(
  value
) {

  if (!value) return "";

  return new Date(
    value
  ).toLocaleString(
    "ar",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );

}


/* =========================
   رسائل الأخطاء
========================= */

function getErrorMessage(
  error
) {

  if (!error) {

    return "حدث خطأ غير معروف.";

  }


  const message =
    error.message || "";


  if (
    message.includes(
      "Invalid login credentials"
    )
  ) {

    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

  }


  if (
    message.includes(
      "User already registered"
    )
  ) {

    return "هذا البريد مسجل مسبقًا.";

  }


  if (
    message.includes(
      "Password should be at least"
    )
  ) {

    return "كلمة المرور قصيرة جدًا.";

  }


  if (
    message.includes(
      "Email not confirmed"
    )
  ) {

    return "يجب تأكيد البريد الإلكتروني أولًا.";

  }


  return message ||
    "حدث خطأ. حاول مرة أخرى.";

}


/* =========================
   مراقبة حالة الدخول
========================= */

supabase.auth.onAuthStateChange(
  async (
    event,
    session
  ) => {

    if (
      event ===
        "SIGNED_IN" &&
      session?.user
    ) {

      await showApp(
        session.user
      );

    }


    if (
      event ===
        "SIGNED_OUT"
    ) {

      currentUser = null;

      showAuth();

    }

  }
);
