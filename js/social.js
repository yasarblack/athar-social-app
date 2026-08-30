import { supabase } from "./supabase.js";


/*
  إضافة إعجاب بأثر
*/

export async function likeTrace(
  userId,
  traceId
) {

  return await supabase
    .from("trace_likes")
    .insert({

      user_id: userId,

      trace_id: traceId

    })
    .on('*', payload => {

      console.log('تم الإعجاب:', payload)

    });

}


/*
  إزالة الإعجاب
*/

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


/*
  الحصول على عدد الإعجابات
*/

export async function getLikeCount(
  traceId
) {

  return await supabase
    .from("trace_likes")
    .select("*", { count: "exact" })
    .eq("trace_id", traceId);

}


/*
  التحقق من إعجاب المستخدم
*/

export async function checkUserLike(
  userId,
  traceId
) {

  return await supabase
    .from("trace_likes")
    .select("*")
    .eq("user_id", userId)
    .eq("trace_id", traceId)
    .maybeSingle();

}


/*
  إضافة تعليق على أثر
*/

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


/*
  حذف تعليق
*/

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


/*
  جلب تعليقات الأثر
*/

export async function getTraceComments(
  traceId
) {

  return await supabase
    .from("trace_comments")
    .select(
      "id, user_id, message, created_at, profiles(display_name, avatar_url)"
    )
    .eq("trace_id", traceId)
    .order("created_at", { ascending: true });

}


/*
  الحصول على إحصائيات المستخدم
*/

export async function getUserStats(
  userId
) {

  const { data: traces } = await supabase
    .from("traces")
    .select("*")
    .eq("user_id", userId);

  const { data: likes } = await supabase
    .from("trace_likes")
    .select("*", { count: "exact" })
    .in("trace_id", (traces || []).map(t => t.id));

  const { data: comments } = await supabase
    .from("trace_comments")
    .select("*", { count: "exact" })
    .in("trace_id", (traces || []).map(t => t.id));

  return {
    totalTraces: traces?.length || 0,
    totalLikes: likes?.length || 0,
    totalComments: comments?.length || 0
  };

}