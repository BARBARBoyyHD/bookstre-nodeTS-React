import axios from "axios";
import { BASE_URL } from "../config/BaseURL";

export const BookListApi = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/book/list`, {
      withCredentials: true,
    });

    const data = res.data;

    console.log("Books :", data);
    return data; // ✅ No need for res.json(), axios already parses it
  } catch (error) {
    throw new Error("Failed to fetch book list");
  }
};


