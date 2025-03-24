import axios from "axios";
import { BASE_URL } from "../config/BaseURL";
import { Books } from "../types/books";

export const editBook = async (data: Books, id: Books) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/edit/book/${id}`, data, {
      withCredentials: true,
    });
    console.log("Edit response:", response.data); // Debugging
    return { success: true, message: "Book Edited successfully" };
  } catch (error: any) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    throw new Error("Failed to delete book");
  }
};
