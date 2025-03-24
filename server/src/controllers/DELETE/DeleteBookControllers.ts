import supabase from "../../models/supabase";
import { Request } from "express";
import { CustomResponse } from "../../types/json";
import { clearCache } from "../../utils/cacheHelper";

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
    const { data: findBook } = await supabase
      .from("book-list")
      .select("id") // Select only "id" for efficiency
      .eq("id", id)
      .single();

    if (!findBook) {
      res.status(404).json({ success: false, data: "Book not found" });
      return;
    }

    // Delete the book
    const { error: deleteError } = await supabase
      .from("book-list")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete Error:", deleteError);
      res.status(500).json({ success: false, data: "Failed to delete book" });
      return;
    }

    // Clear cache
    await clearCache(`book${id}`);
    await clearCache("books");

    res.status(200).json({ success: true, data: `Book ID ${id} deleted` });
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ success: false, data: "Internal Server Error" });
  }
};
