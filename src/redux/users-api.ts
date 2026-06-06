import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://vorbbaihghgoftjisfih.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  "sb_publishable_aIQR8N88bpYgQYXdX39ySg_kAXHTUnw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUpNewUser(
  name: string,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return true;
}

export async function verifyMagicLink(token_hash: string, type = "email") {
  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) throw error;
  return getCurrentUser();
}

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session?.user ?? null;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}
