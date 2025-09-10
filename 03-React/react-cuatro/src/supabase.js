import { createClient } from '@supabase/supabase-js';

// El código lee las claves desde Vercel, no las tiene escritas aquí
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);



export const createItem = async (table, data) => {
  try {
    const { data: newData, error } = await supabase
      .from(table)
      .insert([data])
      .select();

    if (error) throw error;
    return { success: true, data: newData[0] };
  } catch (error) {
    console.log(`Error creando en ${table}:`, error);
    return { success: false, error: error.message };
  }
};

export const readItems = async (table) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id');

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.log(`Error leyendo ${table}:`, error);
    return { success: false, error: error.message, data: [] };
  }
};

export const updateItem = async (table, id, data) => {
  try {
    const { error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log(`Error actualizando ${table}:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteItem = async (table, id) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error)
 {
    console.log(`Error eliminando de ${table}:`, error);
    return { success: false, error: error.message };
  }
};