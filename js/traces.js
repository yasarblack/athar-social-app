import { supabase } from "./supabase.js";


/*
  إنشاء أثر جديد مع وقت مستقبلي اختياري
*/

export async function createTrace(
  userId,
  message,
  unlockAt = null
) {

  return await supabase
    .from("traces")
    .insert({

      user_id: userId,

      message: message,

      unlock_at: unlockAt,

      is_locked: unlockAt ? true : false

    });

}


/*
  جلب آثار المستخدم الحالي
*/

export async function getMyTraces(
  userId
) {

  return await supabase
    .from("traces")

    .select(
      "id, message, created_at, unlock_at, is_locked"
    )

    .eq(
      "user_id",
      userId
    )

    .order(
      "created_at",
      {
        ascending: false
      }
    );

}


/*
  حذف أثر
*/

export async function deleteTrace(
  userId,
  traceId
) {

  return await supabase
    .from("traces")

    .delete()

    .eq(
      "id",
      traceId
    )

    .eq(
      "user_id",
      userId
    );

}


/*
  جلب جميع الآثار من المستخدمين
*/

export async function getAllTraces() {

  return await supabase
    .from("traces")
    .select("id, message, created_at, unlock_at, is_locked, user_id")
    .order("created_at", { ascending: false });

}


/*
  فتح الأثر المقفول
*/

export async function unlockTrace(
  traceId
) {

  return await supabase
    .from("traces")
    .update({
      is_locked: false
    })
    .eq("id", traceId);

}