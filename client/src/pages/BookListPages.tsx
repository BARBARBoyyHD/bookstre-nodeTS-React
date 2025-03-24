import BookListComponents from "../components/booksLogic/BookListComponents";
import Navbar from "../components/Navbar";

export default function BookListPages() {
  return (
    <main className="w-full min-h-screen absolute bg-blue-800">
      <Navbar />
      <BookListComponents/>
    </main>
  );
}
