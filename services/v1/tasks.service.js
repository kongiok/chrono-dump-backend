import { supabase } from '../../models/v1/database.js';

export const getTasksByUserID = async (userID) => {

  let { data: tasks, error } = await supabase
    .from('tasks')
    .select('*').eq('user_id', userID);
  if (error) {
    throw error;
  }
  return tasks;
}
