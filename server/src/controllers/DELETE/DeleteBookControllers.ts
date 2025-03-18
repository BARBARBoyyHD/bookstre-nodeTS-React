import supabase from "../../models/supabase";
import { Request } from "express";
import { CustomResponse } from "../../types/json";

export const deleteBook = async (
  req: Request,
  res: CustomResponse
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, data: "Invalid book ID" });
      return;
    }

    // Check if the book exists
    const { data: findBook, error: findError } = await supabase
      .from("book-list")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !findBook) {
      res.status(404).json({ success: false, data: "Book not found" });
      return;
    }

    // Delete the book
    const { data: deleteBook, error: deleteError } = await supabase
      .from("book-list")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (deleteError) {
      res.status(500).json({ success: false, data: deleteError.message });
      return;
    }

    res.status(200).json({ success: true, data: deleteBook });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, data: error.message });
    return;
  }
};
