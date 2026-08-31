import { supabase } from "./supabase.js";

export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });

  if (error) {
    return { data: null, error };
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        display_name: displayName
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }
  }

  return { data, error: null };
}


export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}


export async function signOut() {
  return await supabase.auth.signOut();
}


export async function getCurrentUser() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
