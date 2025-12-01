"use client";
import { useEffect, useState } from "react";

import { profile as fetchProfile } from "@/services/Auth";
import { SummaryItem } from "@/interfaces/ISummary";
import { LLMRespone } from "@/interfaces/ILLM";
import { ModalProps } from "@/interfaces/IModal";
import {
  FetchMontlySummary,
  GenerateMonthlySummary,
} from "@/services/MonthlySummary";
import { FaRobot, FaSync } from "react-icons/fa";
import Modal from "@/ui/Modal";
const summary = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [response, setResponse] = useState<LLMRespone | null>(null);
  const [alReadyGenerate, setAlReadyGenerate] = useState<Boolean>(false);
  const [ErrorModal, setErrorModal] = useState<ModalProps | null>(null);

  const checkTodaySummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const profileRes = await fetchProfile(token || "");
      const userId = profileRes.data.id;

      const res = await FetchMontlySummary();
      const today = new Date().toISOString().slice(0, 10);

      const found = res.data.find(
        (item: SummaryItem) =>
          item.user_id === userId && item.created_at?.slice(0, 10) === today
      );
      console.log(found);
      if (found) {
        setAlReadyGenerate(true);
        setResponse({
          summary: found.ai_summary,
          recomendation: found.ai_recomendation
            .split("\n")
            .filter(
              (line: string, index: number, arr: string[]) =>
                index < arr.length - 1
            ),
          trend_analysis: found.ai_recomendation.split("\n").slice(-1)[0],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorModal({ message: error.message, type: "danger" });
      } else {
        setErrorModal({ message: "Terjadi Kesalahan", type: "danger" });
      }
    }
  };

  useEffect(() => {
    checkTodaySummary();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await GenerateMonthlySummary();
      if (result.success && result.data) {
        setResponse({
          summary: result.data.summary,
          recomendation: result.data.recommendations,
          trend_analysis: result.data.trend_analysis,
        });
        setAlReadyGenerate(true);
      } else {
        throw new Error(result.message || "Gagal menghasilkan Ringkasan");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorModal({ message: error.message, type: "danger" });
      } else {
        setErrorModal({ message: "Terjadi Kesalahan", type: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Financial Summary</h2>
        <button
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span className="inline-block">
            {loading ? <FaSync className="animate-spin" /> : <FaRobot />}
          </span>
          {loading ? "Menganalisis..." : "Generate Summary"}
        </button>
      </div>
      {response && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">
              📄 Ringkasan
            </h3>
            <p className="text-gray-700">{response.summary}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              💡 Rekomendasi
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {response.recomendation.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-2 text-yellow-600">
              📈 Analisis Tren
            </h3>
            <p className="text-gray-700">{response.trend_analysis}</p>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Kamu bisa meminta ringkasan baru di esok hari.
          </p>
          <p className="text-xs text-gray-400">
            Powered by AI - MetaL Llama 3.3 8B Instruct
          </p>
        </div>
      )}
      {!response && !loading && !alReadyGenerate && (
        <div className="text-gray-500 text-sm">
          Klik Tombil <b>&quot;Generate Summary&quot;</b> untuk mendapatkan
          analisis otomatis
        </div>
      )}

      {ErrorModal && (
        <Modal
          type="danger"
          message={ErrorModal.message}
          onOk={() => setErrorModal(null)}
        />
      )}
    </div>
  );
};

export default summary;
