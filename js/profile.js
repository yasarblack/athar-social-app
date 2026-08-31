import { supabase } from "./supabase.js";


export async function getProfile(userId) {
  return await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at")
    .eq("id", userId)
    .maybeSingle();
}


export async function saveProfile(
  userId,
  displayName,
  avatarUrl = null
) {
  const profile = {
    id: userId,
    display_name: displayName
  };

  if (avatarUrl !== null) {
    profile.avatar_url = avatarUrl;
  }

  return await supabase
    .from("profiles")
    .upsert(profile);
}


export async function uploadAvatar(userId, file) {
  const extension =
    file.name.split(".").pop().toLowerCase();

  const path =
    `${userId}/avatar.${extension}`;

  const { error } = await supabase
    .storage
    .from("avatars")
    .upload(path, file, {
      upsert: true,
      contentType: file.type
    });

  return { error };
}
