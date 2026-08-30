# 🌍 الأثر - Athar

تطبيق ويب لشبكة اجتماعية لترك الرسائل المستقبلية مع عداد زمني وقفل زمني.

## ✨ الميزات

- 📝 **اترك أثراً**: اكتب رسائل تريد أن تبقى للمستقبل
- 👥 **استكشف**: اطّلع على آثار المستخدمين الآخرين
- 🔒 **آمن**: نظام مصادقة آمن مع Supabase
- 📱 **مستجيب**: يعمل على جميع الأجهزة
- 🌙 **واجهة داكنة**: تصميم عصري وسهل على العينين
- 🇸🇦 **دعم اللغة العربية**: واجهة كاملة باللغة العربية

## 🛠️ المتطلبات

- متصفح حديث
- اتصال بالإنترنت
- حساب Supabase

## 🚀 البدء السريع

### 1. استنساخ المشروع

```bash
git clone https://github.com/yasarblack/athar-social-app.git
cd athar-social-app
```

### 2. إعداد قاعدة البيانات

قم بإنشاء جداول في Supabase:

```sql
-- جد��ل المستخدمين والملفات الشخصية
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الآثار
CREATE TABLE traces (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. تحديث بيانات Supabase

عدّل `js/config.js` بمفاتيح Supabase الخاصة بك:

```javascript
export const SUPABASE_URL = "your_supabase_url";
export const SUPABASE_KEY = "your_supabase_key";
```

### 4. تشغيل التطبيق

افتح `index.html` في المتصفح أو استخدم خادم محلي:

```bash
# إذا كان لديك Python
python -m http.server 8000

# أو Node.js
npx http-server
```

ثم افتح `http://localhost:8000` في المتصفح.

## 📁 هيكل المشروع

```
athar-social-app/
├── index.html          # الصفحة الرئيسية
├── css/
│   └── style.css       # الأنماط
├── js/
│   ├── app.js          # تطبيق رئيسي
│   ├── auth.js         # المصادقة
│   ├── profile.js      # الملف الشخصي
│   ├── traces.js       # إدارة الآثار
│   ├── config.js       # الإعدادات
│   └── supabase.js     # اتصال Supabase
└── README.md           # هذا الملف
```

## 🎨 الألوان والتصميم

- **الخلفية**: #08080c
- **السطح**: #121219
- **النص**: #f5f5f7
- **الحد**: #292933
- **الناجح**: #9bd9a5
- **الخطأ**: #ff7777

## 🔐 الأمان

- المصادقة عبر Supabase Auth
- كلمات مرور مشفرة
- رموز جلسات آمنة
- التحقق من الملكية قبل الحذف

## 🌐 المتصفحات المدعومة

- Chrome/Chromium
- Firefox
- Safari
- Edge

## 📝 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

## 👨‍💻 المساهمة

نرحب بالمساهمات! يرجى:

1. عمل Fork للمشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. حفظ التغييرات (`git commit -m 'Add amazing feature'`)
4. دفع إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📧 التواصل

للأسئلة والاقتراحات، يرجى فتح Issue في المستودع.

---

صُنع بـ ❤️ من قِبل yasarblack