export const createTask = async (task) => {
  return await supabase.from("tasks").insert([task]).select();
}

export const getTasksByUserID = async (user_id) => {
  const { data, error } = await supabase.from("tasks").select().eq("user_id", user_id);
  if (error) {
    throw error;
  }
  return data;
}

export const getTaskByID = async (id, user_id) => {
  const { data, error } = await supabase.from("tasks").select().eq("id", id).eq("user_id", user_id);
  if (error) {
    throw error;
  }
  return data;
}
