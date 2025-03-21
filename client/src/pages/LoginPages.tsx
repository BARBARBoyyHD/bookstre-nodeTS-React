import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginUI/LoginForm";
export default function LoginPages() {
  return (
    <main className="w-full h-full absolute bg-blue-800">
      <Navbar />
      <LoginForm/>
    </main>
  );
}
