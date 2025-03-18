import { Request } from "express";
import { CustomResponse } from "../../types/json"; // Adjust path as needed
import supabase from "../../models/supabase";
import type { Books } from "../../types/books";
import moment from "moment";

export const post = async (
  req: Request,
  res: CustomResponse
): Promise<void> => {
  try {
    const { title, author, price, release }: Books = req.body;

    // Validate request body
    if (!title || !author || !price || !release) {
      res
        .json({ success: false, data: "All fields are required." })
        .status(400);
      return;
    }

    const { data, error } = await supabase
      .from("book-list")
      .insert([{ title, author, price, release }])
      .select("*")
      .single();
    if (error) throw error;

    res.json({ success: true, data: data }).status(201);
    return;
  } catch (error: any) {
    res.json({ success: false, data: error.message }).status(500);
  }
};
