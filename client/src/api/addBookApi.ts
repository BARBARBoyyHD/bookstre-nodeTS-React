import axios from "axios";
import { BASE_URL } from "../config/BaseURL";
import { Books } from "../types/books";

export const addBook = async (data: Books) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/post/book`, data, {
      withCredentials: true,
    });

    console.log("new book : ", res.data);

    return res.data;
  } catch (error) {
    console.error("Failed to add book:", error);
    throw new Error("Failed to fetch book list");
  }
};
