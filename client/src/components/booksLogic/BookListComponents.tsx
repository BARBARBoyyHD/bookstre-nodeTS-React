import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BookListApi } from "../../api/BookListApi";
import { addBook } from "../../api/addBookApi";
import { deleteBook } from "../../api/DeleteBookApi"; // Import delete function
import { Books as books } from "../../types/books";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import Modal from "../modal/AddBooksForm"; // Import modal component
import EditModal from "../modal/EditBooksForm";

export default function BookListComponents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch book list
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: BookListApi,
    staleTime: 0, // Forces refetch every time
    cacheTime: 60*5, // Prevents caching old data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds
    onSuccess: (data) => console.log("Updated Books:", data), // Debugging
  });

  // Mutation to add a book
  const addBookMutation = useMutation({
    mutationFn: addBook,
    onMutate: async (newBook) => {
      await queryClient.cancelQueries(["books"]);
      const previousBooks = queryClient.getQueryData(["books"]);

      queryClient.setQueryData(["books"], (old: any) => [
        ...(old || []),
        newBook,
      ]);

      return { previousBooks };
    },
    onError: (err, newBook, context) => {
      queryClient.setQueryData(["books"], context?.previousBooks);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });

  // Mutation to delete a book
  // Mutation to delete a book
  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onMutate: async (bookId) => {
      await queryClient.cancelQueries(["books"]);
      const previousBooks = queryClient.getQueryData(["books"]);

      // Optimistically update cache
      queryClient.setQueryData(["books"], (old: any) =>
        old ? old.filter((book: books) => book.id !== bookId) : []
      );

      return { previousBooks };
    },
    onError: (err, bookId, context) => {
      queryClient.setQueryData(["books"], context?.previousBooks);
    },
    onSuccess: () => {
      console.log("Book successfully deleted, invalidating query...");
      queryClient.invalidateQueries(["books"], { refetchInactive: true });
    },
  });

  if (isLoading)
    return <p className="text-center text-white text-xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 text-xl">Error loading books</p>
    );

  // Handle new book submission
  const handleAddBook = (newBook: {
    title: string;
    author: string;
    price: string;
    release: string;
  }) => {
    addBookMutation.mutate(newBook);
    console.log("New Book Added:", newBook);
  };

  // Handle delete book
  const handleDeleteBook = (bookId: number) => {
    deleteBookMutation.mutate(bookId, {
      onMutate: async () => {
        await queryClient.cancelQueries(["books"]);
        const previousBooks = queryClient.getQueryData(["books"]);

        queryClient.setQueryData(["books"], (old: any) =>
          old ? old.filter((book: books) => book.id !== bookId) : []
        );

        return { previousBooks };
      },
      onError: (err, bookId, context) => {
        queryClient.setQueryData(["books"], context?.previousBooks);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["books"]);
      },
    });
  };
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">
          Welcome to Our BookStore
        </h1>
        <p className="text-gray-400 mt-2">
          Discover amazing books curated just for you!
        </p>
      </div>

      {/* Add New Book Button */}
      <div className="flex justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Book
        </button>
      </div>

      {/* Book Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-6">
        {books.length > 0 ? (
          books.map((book: books) => (
            <div
              key={book.id}
              className="relative bg-white rounded-xl shadow-lg hover:shadow-xl p-5 transition-all duration-300"
            >
              {/* Edit & Delete Icons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <MdModeEditOutline
                  size={22}
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditBook(book)}
                />
                <MdDelete
                  size={22}
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteBook(book.id)}
                />
              </div>

              <h1 className="text-lg font-bold text-gray-900 text-center">
                {book.title}
              </h1>
              <p className="text-gray-500 text-sm text-center mt-1">
                by {book.author}
              </p>

              <div className="mt-4">
                <h2 className="text-gray-800 font-semibold">
                  Price:{" "}
                  <span className="text-green-600 font-bold">
                    ${book.price}
                  </span>
                </h2>
                <p className="text-gray-400 text-xs">
                  Release Date: {book.release}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-white text-center col-span-full">
            No Books Available
          </h1>
        )}
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBook}
      />
       {isEditModalOpen && selectedBook && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(updatedBook) => updateBook({ id: selectedBook.id, ...updatedBook })}
          book={selectedBook}
        />
      )}
    </section>
  );
}
