import supabase from "../../models/supabase";
import { Request } from "express";
import { CustomResponse } from "../../types/json";
import { getFromCache, saveToCache } from "../../utils/cacheHelper";

export const editSingleBook = async (
  req: Request,
  res: CustomResponse
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const cacheKey = `book${id}`;
    const { data: findBook, error: findError } = await supabase
      .from("book-list")
      .select("*")
      .eq("id", id)
      .single();
    
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      res.json({ success: true, data: cachedData });
      return;
    }

    if (!findBook || findError) {
      res.status(404).json({ success: false, data: "Book not found" });
      return;
    }

    const { data: singleBook, error: singleError } = await supabase
      .from("book-list")
      .select("*")
      .eq("id", id)
      .single();

    await saveToCache(cacheKey, singleBook, 15);
    res.status(200).json({ success: true, data: singleBook });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, data: error });
    return;
  }
};
