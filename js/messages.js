import { supabase } from "./supabase.js";

export async function getMyConversations(userId) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      sender_id,
      receiver_id,
      message,
      created_at
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const conversations = new Map();

  for (const message of data || []) {
    const otherUserId =
      message.sender_id === userId
        ? message.receiver_id
        : message.sender_id;

    if (!conversations.has(otherUserId)) {
      conversations.set(otherUserId, {
        user_id: otherUserId,
        name: "مستخدم الأثر",
        last_message: message.message,
        created_at: message.created_at
      });
    }
  }

  return {
    data: [...conversations.values()],
    error: null
  };
}

export async function sendMessage(senderId, receiverId, message) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message
    })
    .select()
    .single();

  return { data, error };
}
