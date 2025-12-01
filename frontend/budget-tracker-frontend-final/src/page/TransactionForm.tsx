"use client";
import { TransaksiProps } from "@/interfaces";
import { CategoryOption, TransactionFormData } from "@/interfaces/ITransaction";
import { fetchAllCategories } from "@/services/Category";
import { useEffect, useState } from "react";
import convertNumRupiah from "@/utils/convertNumRupiah";
import formatRupiah from "@/utils/convertNumRupiah";

const TransactionForm: React.FC<TransaksiProps> = ({
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
    categoryId: "",
  });

  const [categories, setCatgories] = useState<CategoryOption[]>([]);

  const loadCategory = async () => {
    try {
      const res = await fetchAllCategories();
      setCatgories(res.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error({ message: err.message, type: "danger" });
      } else {
        console.error({ message: "Terjadi Kesalahan", type: "danger" });
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        categoryId: String(initialData.categoryId),
        amount: String(initialData.amount),
      });
    }
  }, []);

  useEffect(() => {
    loadCategory();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("HandleChange →", name, value);

    if (name === "amount") {
      const clean = value.replace(/\D/g, "");
      const formatted = convertNumRupiah(clean);
      setForm((prev) => ({ ...prev, amount: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedAmount = form.amount.replace(/\D/g, "");
    const payload: TransactionFormData = {
      ...form,
      amount: cleanedAmount,
      categoryId: parseInt(String(form.categoryId)),
    };
    console.log("SUBMIT FORM:", form);
    console.log("PAYLOAD:", payload);
    onSubmit(payload);
  };
  return (
    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="tipe" className="block mb-1 text-sm">
          Tipe
        </label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </div>

      <div>
        <label htmlFor="jumlah" className="block mb-1 text-sm">
          Jumlah
        </label>
        <input
          type="text"
          name="amount"
          value={formatRupiah(form.amount)}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Contoh: Rp. 10.000"
          required
        />
      </div>

      <div>
        <label htmlFor="tanggal" className="block mb-1 text-sm">
          Tanggal
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Contoh: Rp. 10.000"
          required
        />
      </div>

      <div>
        <label htmlFor="catatan" className="block mb-1 text-sm">
          Catatan
        </label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Masukkan Catatan..."
          required
        />
      </div>

      <div>
        <label htmlFor="catatan" className="block mb-1 text-sm">
          Kategori
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Simpan
      </button>
    </form>
  );
};
export default TransactionForm;
