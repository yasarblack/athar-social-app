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

export async function getLikeCount(
traceId
) {

return await supabase
.from("trace_likes")
.select("id", {
count: "exact",
head: true
})
.eq("trace_id", traceId);

}

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
التعليقات
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
})
.select()
.single();

}

export async function deleteComment(
userId,
commentId
) {

return await supabase
.from("trace_comments")
.delete()
.eq("id", commentId)
.eq("user_id", userId);

}

export async function getTraceComments(
traceId
) {

return await supabase
.from("trace_comments")
.select("id, user_id, trace_id, message, created_at")
.eq("trace_id", traceId)
.order("created_at", {
ascending: true
});

}
