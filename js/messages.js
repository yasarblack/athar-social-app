import { supabase } from "./supabase.js";


/* =========================
   الحصول على المحادثات
========================= */

export async function getMyConversations(
  userId
) {

  const {
    data,
    error
  } = await supabase
    .from("messages")
    .select(`
      id,
      sender_id,
      receiver_id,
      message,
      created_at
    `)
    .or(
      `sender_id.eq.${userId},receiver_id.eq.${userId}`
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );


  if (error) {

    return {
      data: null,
      error
    };

  }


  const conversations =
    new Map();


  for (const message of data || []) {

    const otherUserId =
      message.sender_id === userId
        ? message.receiver_id
        : message.sender_id;


    if (
      !conversations.has(
        otherUserId
      )
    ) {

      conversations.set(
        otherUserId,
        {
          user_id: otherUserId,
          name: "مستخدم الأثر",
          last_message:
            message.message,
          created_at:
            message.created_at
        }
      );

    }

  }


  const userIds =
    [...conversations.keys()];


  if (userIds.length > 0) {

    const {
      data: profiles,
      error: profileError
    } = await supabase
      .from("profiles")
      .select(
        "id, display_name, avatar_url"
      )
      .in(
        "id",
        userIds
      );


    if (profileError) {

      return {
        data: null,
        error: profileError
      };

    }


    const profileMap =
      new Map(
        (profiles || []).map(
          profile => [
            profile.id,
            profile
          ]
        )
      );


    for (
      const conversation
      of conversations.values()
    ) {

      const profile =
        profileMap.get(
          conversation.user_id
        );


      if (
        profile?.display_name
      ) {

        conversation.name =
          profile.display_name;

      }

      conversation.avatar_url =
        profile?.avatar_url || null;

    }

  }


  return {
    data: [
      ...conversations.values()
    ],
    error: null
  };

}
