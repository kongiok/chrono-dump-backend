import { supabase } from "./database.js";

export const createUser = async ({ name, email, password, phone, role, init_vector }) => {
  const { data, error } = await supabase.from("users").insert([{ email, password, name, phone, role, init_vector }]).select();
  if (error) {
    throw error;
  }
  return data;
}

export const getUsers = async () => {
  const { data: users, error } = await supabase.from('users').select('id, name, email, is_active, init_vector');
  if (error) {
    throw error;
  }
  return users;
}

export const getUserByEmail = async (email) => {
  let { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, password, is_active, init_vector').eq('email', email).maybeSingle();
  if (error) {
    throw error;
  }
  return users;
}

export const getUserById = async (id) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, password, is_active, init_vector')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return users;
}

export const setUserActive = async (id) => {
  const { data, error } = supabase.from("users").update({ is_active: true }).eq("id", id);
  if (error) {
    throw error;
  }
  return data;
}

export const updateUser = async (id, { name, email, password, phone }) => {
  const { data, error } = await supabase.from("users").update({ name, email, password, phone }).eq("id", id).select();
  if (error) {
    throw error;
  }
  return data;
}

export const deleteUser = async (id) => {
  const { data, error } = await supabase.from("users").delete().eq("id", id).select();
  if (error) {
    throw error;
  }
  return data;
}
