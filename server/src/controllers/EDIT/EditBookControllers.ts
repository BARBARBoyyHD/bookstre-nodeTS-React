import supabase from "../../models/supabase";
import { Request } from "express";
import { CustomResponse } from "../../types/json";
import type { Books } from "../../types/books";
import { clearCache } from "../../utils/cacheHelper";

export const editBook = async (
  req: Request,
  res: CustomResponse
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const { data: findId, error: findError } = await supabase
      .from("book-list")
      .select()
      .eq("id", id)
      .single();

    if (!findId || findError) {
      res.status(404).json({ success: false, data: "Book not found" });
      return;
    }

    const { title, author, price, release }: Books = req.body;

    const { data: editBook, error: editError } = await supabase
      .from("book-list")
      .update({
        title,
        author,
        price,
        release,
      })
      .eq("id", id)
      .select()
      .single();

    if (editError) {
      res.status(500).json({ success: false, data: editError.message });
      return;
    }
    
    await clearCache(`book${id}`);

    res.status(200).json({ success: true, data: editBook });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, data: error.message });
    return;
  }
};
