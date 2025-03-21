import Navbar from "../components/Navbar";
import BookWelcome from "../components/bookUI/BookWelcome";
export default function HomePages() {
  return (
    <main className="w-full h-full absolute bg-blue-800">
      <Navbar />
      <BookWelcome />
    </main>
  );
}
