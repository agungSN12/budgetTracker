"use client";
import { ModalProps } from "@/interfaces/IModal";
import { profile as FetchProfile } from "@/services/Auth";
import { updateUser } from "@/services/User";
import Modal from "@/ui/Modal";
import { useEffect, useState } from "react";

const profilePage = () => {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    number: "",
  });
  const [isSubmitting, setIssubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalProps | null>(null);

  const LoadProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await FetchProfile(token);
      const rawNumber = res.data.number || "";
      const cleanNumber = rawNumber.startsWith("+62")
        ? rawNumber.replace("+62", "")
        : rawNumber;

      setForm({
        ...res.data,
        number: cleanNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({ message: error.message, type: "danger" });
      } else {
        setModal({ message: "Terjadi Kesalahan", type: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LoadProfile();
  }, []);
  console.log(form.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue =
      value === "number" ? value.replace(/[^0-9]/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssubmitting(true);

    try {
      const updated = await updateUser(form.id, {
        name: form.name,
        email: form.email,
        number: `+62${form.number}`,
      });

      setForm({
        ...updated.data,
        number: updated.data.number.replace("+62", ""),
      });
      setModal({ message: "Profil Berhasil Diperbaharui", type: "success" });
    } catch (error) {
      if (error instanceof Error) {
        setModal({ message: error.message, type: "danger" });
      } else {
        setModal({ message: "Terjadi Kesalahan", type: "danger" });
      }
    } finally {
      setIssubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profil Pengguna</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Nama
          </label>
          <input
            value={form.name}
            onChange={handleChange}
            type="text"
            name="name"
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            value={form.email}
            onChange={handleChange}
            type="email"
            name="email"
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="number"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Nomor Telepon
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
              +62
            </div>
            <input
              onChange={handleChange}
              value={form.number}
              type="text"
              name="number"
              className="w-full border rounded px-4 py-2 pl-12"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "menyimpan..." : "Simpan perubahan"}
        </button>
      </form>
      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onOk={() => setModal(null)}
        />
      )}
    </div>
  );
};
export default profilePage;
