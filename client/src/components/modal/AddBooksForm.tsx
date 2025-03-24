import { IoClose } from "react-icons/io5";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; author: string; price: string; release: string }) => void;
}

export default function Modal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [formData, setFormData] = useState({ title: "", author: "", price: "", release: "" });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", author: "", price: "", release: "" }); // Reset form
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Book</h2>
          <IoClose
            size={24}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={onClose}
          />
        </div>

        {/* Form Inside Modal */}
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Book Title"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.release}
            onChange={(e) => setFormData({ ...formData, release: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}
