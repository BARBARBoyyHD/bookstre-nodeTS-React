import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { editBook } from "../../api/EditBookApi";

const EditModal = ({ isOpen, onClose, book }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    release: "",
  });

  useEffect(() => {
    console.log("Book received in EditModal:", book); // ✅ Debugging
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        price: book.price ? String(book.price) : "", // Ensure price is a string
        release: book.release || "",
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editBookMutation = useMutation(
    (updatedBook) => editBook(updatedBook, book?.id), // ✅ Check book?.id
    {
      onMutate: async (updatedBook) => {
        await queryClient.cancelQueries(["books"]);
        const previousBooks = queryClient.getQueryData(["books"]);
        queryClient.setQueryData(["books"], (oldBooks) =>
          oldBooks
            ? oldBooks.map((b) =>
                b.id === book?.id ? { ...b, ...updatedBook } : b
              )
            : []
        );
        return { previousBooks };
      },
      onError: (err, _, context) => {
        if (context?.previousBooks) {
          queryClient.setQueryData(["books"], context.previousBooks);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(["books"]);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    editBookMutation.mutate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg w-1/3">
        <h2 className="text-lg font-bold">Edit Book</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="title"
            className="border p-2"
            readOnly={false}
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            className="border p-2 w-full min-w-0 bg-white"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2"
          />
          <input
            type="date"
            name="release"
            value={formData.release}
            onChange={handleChange}
            className="border p-2"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={editBookMutation.isLoading}
            >
              {editBookMutation.isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
