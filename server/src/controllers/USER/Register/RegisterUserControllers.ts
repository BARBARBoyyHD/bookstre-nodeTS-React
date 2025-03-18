import { Request, Response } from "express";
import supabase from "../../../models/supabase";
import moment from "moment";
import type { Users } from "../../../types/users";

export const register = async (profile: Users) => {
  try {
    const created_at = moment().format("LL");
    const {
      sub,
      name,
      given_name,
      family_name,
      picture,
      email,
      email_verified,
    } = profile;

    let { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", sub)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError; // Ignore "not found" error

    if (existingUser) {
      console.log("User already registered:", existingUser);
      return existingUser; // Return existing user
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        user_id: sub,
        name: name,
        given_name: given_name,
        family_name: family_name,
        picture: picture,
        email: email,
        email_verified: email_verified,
        created_at: created_at,
      })
      .select("*")
      .single();
    if (error) throw error;

    console.log("Register Success:", data);
    return data; // Return newly registered user
  } catch (error: any) {
    console.error("Register Error:", error.message);
    return null; // Return null in case of failure
  }
};
