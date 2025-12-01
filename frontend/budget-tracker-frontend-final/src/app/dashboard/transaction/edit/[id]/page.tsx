"use client";
import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import TransactionForm from "@/page/TransactionForm";
import {
  fetchTransactionById,
  updateTransaction,
} from "@/services/Transaction";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import Modal from "@/ui/Modal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const EditTransactionPage = () => {
  const router = useRouter();
  const { id } = useParams();

  console.log(id);
  if (!id || typeof id !== "string") {
    return <>invalid trasaction ID</>;
  }

  const [initialData, setInitialData] = useState<TransactionFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalProps | null>(null);

  const loadDataTransaction = async () => {
    try {
      const res = await fetchTransactionById(Number(id));
      const tx = res.data;
      setInitialData({
        type: tx.type,
        amount: tx.amount.toString(),
        date: tx.date.slice(0, 10),
        note: tx.note,
        categoryId: tx.category_id,
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({ message: error.message, type: "danger" });
      } else {
        setModal({ message: "Terjadi kesalahan", type: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataTransaction();
  }, [id]);

  const handleSubmit = async (form: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await updateTransaction(Number(id), {
        ...form,
      });
      setModal({
        message: "transaksi berhasil di update",
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({
          message: error.message,
          type: "danger",
        });
      } else {
        setModal({ message: "Terjadi kesalahan", type: "danger" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinnerScreen />;
  console.log({ initialData });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Transaksi</h1>
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

      {initialData && (
        <TransactionForm initialData={initialData} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default EditTransactionPage;
