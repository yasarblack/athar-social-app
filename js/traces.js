import { supabase } from "./supabase.js";


/*
  إنشاء أثر جديد
*/

export async function createTrace(
  userId,
  message
) {

  return await supabase
    .from("traces")
    .insert({

      user_id: userId,

      message: message

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
      "id, message, created_at"
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
    .select("id, message, created_at, user_id")
    .order("created_at", { ascending: false });

}