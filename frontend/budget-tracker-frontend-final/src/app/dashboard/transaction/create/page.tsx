"use client";
import { useRouter } from "next/navigation";
import { ModalProps } from "@/interfaces/IModal";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import Modal from "@/ui/Modal";
import { useState } from "react";
import TransactionForm from "@/page/TransactionForm";
import { TransactionFormData } from "@/interfaces/ITransaction";
import { createTransaction } from "@/services/Transaction";

export default function () {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalProps | null>(null);

  const handleSubmit = async (form: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await createTransaction({
        ...form,
        category_id: form.categoryId,
      });
      setModal({
        type: "success",
        message: "transaksi berhasil di tambahkan",
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({ message: error.message, type: "danger" });
      } else {
        setModal({ message: "Terjadi Kesalahan", type: "danger" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buat Transaksi Baru</h1>
      {isSubmitting && <LoadingSpinnerScreen />}
      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onOk={() => {
            setModal(null);
            if (modal.type === "success") {
              router.push("/dashboard/transaction");
            }
          }}
        />
      )}

      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
}
