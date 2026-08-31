import { supabase } from "./supabase.js";


/* =========================
   الإعجاب
========================= */

export async function likeTrace(
  userId,
  traceId
) {

  return await supabase
    .from("trace_likes")
    .insert({
      user_id: userId,
      trace_id: traceId
    });

}


/* =========================
   إزالة الإعجاب
========================= */

export async function unlikeTrace(
  userId,
  traceId
) {

  return await supabase
    .from("trace_likes")
    .delete()
    .eq("user_id", userId)
    .eq("trace_id", traceId);

}


/* =========================
   عدد الإعجابات
========================= */

export async function getLikeCount(
  traceId
) {

  return await supabase
    .from("trace_likes")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("trace_id", traceId);

}


/* =========================
   هل المستخدم أعجب بالأثر؟
========================= */

export async function checkUserLike(
  userId,
  traceId
) {

  return await supabase
    .from("trace_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("trace_id", traceId)
    .maybeSingle();

}


/* =========================
   إضافة تعليق
========================= */

export async function addComment(
  userId,
  traceId,
  message
) {

  return await supabase
    .from("trace_comments")
    .insert({
      user_id: userId,
      trace_id: traceId,
      message: message
    });

}


/* =========================
   حذف تعليق
========================= */

export async function deleteComment(
  commentId,
  userId
) {

  return await supabase
    .from("trace_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

}


/* =========================
   جلب التعليقات
========================= */

export async function getTraceComments(
  traceId
) {

  return await supabase
    .from("trace_comments")
    .select(`
      id,
      user_id,
      message,
      created_at,
      profiles(
        display_name,
        avatar_url
      )
    `)
    .eq("trace_id", traceId)
    .order("created_at", {
      ascending: true
    });

}


/* =========================
   إحصائيات المستخدم
========================= */

export async function getUserStats(
  userId
) {

  const {
    data: traces
  } = await supabase
    .from("traces")
    .select("id")
    .eq("user_id", userId);


  const traceIds =
    (traces || []).map(
      trace => trace.id
    );


  if (traceIds.length === 0) {

    return {
      totalTraces: 0,
      totalLikes: 0,
      totalComments: 0
    };

  }


  const {
    count: likesCount
  } = await supabase
    .from("trace_likes")
    .select("*", {
      count: "exact",
      head: true
    })
    .in("trace_id", traceIds);


  const {
    count: commentsCount
  } = await supabase
    .from("trace_comments")
    .select("*", {
      count: "exact",
      head: true
    })
    .in("trace_id", traceIds);


  return {
    totalTraces: traces?.length || 0,
    totalLikes: likesCount || 0,
    totalComments: commentsCount || 0
  };

}
