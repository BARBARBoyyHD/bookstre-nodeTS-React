import supabase from "../../../models/supabase";
import type { Users } from "../../../types/users";
export const Login = async (profile: Users) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", profile.sub)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return null;
    }
    console.log("Login Success : ", data);
    return data
  } catch (error:any) {
    console.error("Login Error:", error.message);
    return null; // Return null in case of failure
  }
};
