import axios from "axios";
import { BASE_URL } from "../config/BaseURL";

export const deleteBook = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/delete/book/${id}`, {
      withCredentials: true,
    });
    console.log("Delete response:", response.data); // Debugging
    return { success: true, message: "Book deleted successfully" };
  } catch (error: any) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    throw new Error("Failed to delete book");
  }
};
