import { supabase } from "./supabase.js";


/*
  إنشاء أثر جديد
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
      is_locked: unlockAt
        ? new Date(unlockAt) > new Date()
        : false
    });
}


/*
  جلب آثار المستخدم الحالي
*/
export async function getMyTraces(userId) {

  const { data, error } = await supabase
    .from("traces")
    .select(
      "id, message, created_at, unlock_at, is_locked"
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    return { data: null, error };
  }


  /*
    فتح الآثار التي انتهى وقتها
  */
  const now = new Date();

  const expiredIds = (data || [])
    .filter(trace =>
      trace.is_locked &&
      trace.unlock_at &&
      new Date(trace.unlock_at) <= now
    )
    .map(trace => trace.id);


  if (expiredIds.length > 0) {

    const { error: updateError } = await supabase
      .from("traces")
      .update({
        is_locked: false
      })
      .in("id", expiredIds)
      .eq("user_id", userId);

    if (!updateError) {

      data.forEach(trace => {

        if (expiredIds.includes(trace.id)) {
          trace.is_locked = false;
        }

      });

    }

  }


  return {
    data,
    error: null
  };
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
    .eq("id", traceId)
    .eq("user_id", userId);
}


/*
  جلب الآثار المفتوحة للاستكشاف
*/
export async function getAllTraces() {

  const { data, error } = await supabase
    .from("traces")
    .select(
      "id, message, created_at, unlock_at, is_locked, user_id"
    )
    .order("created_at", {
      ascending: false
    });

  if (error) {
    return {
      data: null,
      error
    };
  }

  const now = new Date();

  const visibleTraces = (data || []).filter(trace => {

    if (!trace.is_locked) {
      return true;
    }

    if (!trace.unlock_at) {
      return false;
    }

    return new Date(trace.unlock_at) <= now;

  });

  return {
    data: visibleTraces,
    error: null
  };
}


/*
  فتح أثر مقفول
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
