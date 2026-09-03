import { supabase } from "./supabase.js";

const ADMIN_IDS = [
  "8c934b52-3105-442d-89d7-f0704682307a",
  "d1c94e38-c5f4-4a75-a713-1136ccf63a80"
];

export function isParallelNewsAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

export async function getParallelNews() {
  return await supabase
    .from("parallel_news")
    .select("id, title, content, created_at")
    .order("created_at", {
      ascending: false
    });
}

export async function createParallelNews(title, content) {
  return await supabase
    .from("parallel_news")
    .insert({
      title,
      content
    })
    .select("id, title, content, created_at")
    .single();
}

async function shareNews(news) {
  const text =
    `🪐 ${news.title}\n\n` +
    `${news.content}\n\n` +
    `🦋 من أخبار العالم الموازي`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `🪐 ${news.title}`,
        text
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("تم نسخ الخبر للمشاركة ✓");
    }
  } catch (error) {
    console.log(
      "تم إلغاء المشاركة:",
      error
    );
  }
}

export async function loadParallelNews(user) {
  const list =
    document.getElementById(
      "parallel-news-list"
    );

  const adminBox =
    document.getElementById(
      "parallel-news-admin"
    );

  if (!list) return;

  if (
    adminBox &&
    user &&
    isParallelNewsAdmin(user.id)
  ) {
    adminBox.classList.remove("hidden");
  }

  list.innerHTML = `
    <div class="empty-state">
      جارٍ استقبال أخبار العالم الموازي...
    </div>
  `;

  const {
    data,
    error
  } = await getParallelNews();

  if (error) {
    console.error(
      "خطأ في أخبار العالم الموازي:",
      error
    );

    list.innerHTML = `
      <div class="empty-state">
        تعذر استقبال الأخبار.
      </div>
    `;

    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = `
      <div class="parallel-news-empty">
        🪐 لا توجد أخبار من العالم الموازي اليوم.
        <br>
        <span>ربما لم يحدث شيء هناك بعد...</span>
      </div>
    `;

    return;
  }

  list.innerHTML = "";

  data.forEach(news => {
    const article =
      document.createElement("article");

    article.className =
      "parallel-news-card";

    const title =
      document.createElement("h3");

    title.className =
      "parallel-news-title";

    title.textContent =
      `🪐 ${news.title}`;

    const content =
      document.createElement("div");

    content.className =
      "parallel-news-content";

    content.textContent =
      news.content;

    const footer =
      document.createElement("div");

    footer.className =
      "parallel-news-footer";

    const date =
      document.createElement("span");

    date.className =
      "parallel-news-date";

    date.textContent =
      new Date(
        news.created_at
      ).toLocaleString(
        "ar",
        {
          dateStyle: "short",
          timeStyle: "short"
        }
      );

    const shareButton =
      document.createElement("button");

    shareButton.className =
      "secondary-button parallel-news-share";

    shareButton.textContent =
      "🦋 مشاركة";

    shareButton.addEventListener(
      "click",
      () => shareNews(news)
    );

    footer.appendChild(date);
    footer.appendChild(shareButton);

    article.appendChild(title);
    article.appendChild(content);
    article.appendChild(footer);

    list.appendChild(article);
  });
}

export function setupParallelNews(user) {
  const addButton =
    document.getElementById(
      "parallel-news-add-button"
    );

  const form =
    document.getElementById(
      "parallel-news-form"
    );

  const publishButton =
    document.getElementById(
      "parallel-news-publish-button"
    );

  if (
    !addButton ||
    !form ||
    !publishButton
  ) return;

  if (
    !user ||
    !isParallelNewsAdmin(user.id)
  ) {
    return;
  }

if (
  !addButton ||
  !form ||
  !publishButton
) return;

if (
  !user ||
  !isParallelNewsAdmin(user.id)
) {
  return;
}

if (publishButton.dataset.listenerAttached === "true") {
  return;
}

publishButton.dataset.listenerAttached = "true";

  addButton.addEventListener(
    "click",
    () => {
      form.classList.toggle("hidden");
    }
  );

  publishButton.addEventListener(
    "click",
    async () => {
      const titleInput =
        document.getElementById(
          "parallel-news-title"
        );

      const contentInput =
        document.getElementById(
          "parallel-news-content"
        );

      const status =
        document.getElementById(
          "parallel-news-status"
        );

      const title =
        titleInput?.value.trim();

      const content =
        contentInput?.value.trim();

      if (!title || !content) {
        status.textContent =
          "اكتب العنوان والخبر أولاً.";

        return;
      }

      publishButton.disabled = true;
      status.textContent =
        "جارٍ إرسال الخبر إلى العالم الموازي...";

      const {
        error
      } = await createParallelNews(
        title,
        content
      );

      if (error) {
        console.error(error);

        status.textContent =
          "تعذر نشر الخبر.";

        publishButton.disabled = false;
        return;
      }

      titleInput.value = "";
      contentInput.value = "";

      status.textContent =
        "وصل الخبر إلى العالم الموازي ✓";

      publishButton.disabled = false;

      form.classList.add("hidden");

      await loadParallelNews(user);
    }
  );
}
