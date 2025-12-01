"use client";
import { StatCard } from "@/ui/StatCard";
import { FaArrowDown, FaArrowUp, FaPiggyBank, FaWallet } from "react-icons/fa";
import formatRupiah from "@/utils/formatRupiah";
import { useEffect, useState } from "react";
import { ChartPoint, SummaryData, Transaction } from "@/interfaces/IDashboard";
import {
  fetchMontlyChart,
  fetchMontlySummary,
  fetchTodayTransaction,
} from "@/services/Transaction";
import { profile as fetchProfile } from "@/services/Auth";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DasboardPage() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const [user, setUser] = useState<{ name?: string }>({});
  const dateNow = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fetchData = async () => {
    try {
      const [chart, summaryRes, recent, profileRes] = await Promise.all([
        fetchMontlyChart(),
        fetchMontlySummary(),
        fetchTodayTransaction(),
        fetchProfile(localStorage.getItem("token") || ""),
      ]);

      setChartData(chart.data);
      setSummary(summaryRes.data);
      setRecentTransactions(recent.data);
      setUser(profileRes.data || {});
    } catch (err) {
      if (err instanceof Error) {
        console.error({ message: err.message, type: "danger" });
      } else {
        console.error({ message: "Terjadi Kesalahan", type: "danger" });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(chartData);

  return (
    <div className="p-3 space-y-6">
      <div className="flex flex-col bg-gradient-to-r from-indigo-900 to bg-indigo-600 rounded-xl p-6 gap-8 text-white">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-3xl font-semibold">Wellcome Back, User!</h2>
            <p className="text-md mt-1 font-normal">
              Insights at a glance: empowering your financial journey.
            </p>
          </div>

          <div className="text-right text-md text-white">
            <p className="font-medium">{dateNow}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <StatCard
              title="Total Balance"
              value={formatRupiah(20000)}
              icon={<FaWallet size={24} />}
              change="This Month"
              color="text-gray-600"
            />
            <StatCard
              title="Total Savings"
              value={formatRupiah(200000)}
              icon={<FaPiggyBank size={24} />}
              change="For Recommendation"
              color="text-gray-600"
            />
            <StatCard
              title="Total Income"
              value={formatRupiah(200000)}
              icon={<FaArrowUp size={24} />}
              change="This Month"
              color="text-gray-600"
            />
            <StatCard
              title="Total Expense"
              value={formatRupiah(200000)}
              icon={<FaArrowDown size={24} />}
              change="This Month"
              color="text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* grafik pemasukan dan pengeluaran */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div className="bg-white p-6 pb-16 rounded-lg shadow lg:col-span-3 h-[61vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Money Flow</h3>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const day = new Date(date).getDate();
                  return String(day).padStart(2, "0");
                }}
              />

              <YAxis
                tickFormatter={(value) => `${value.toLocaleString("id-ID")}`}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString("id-ID")}`
                }
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return `Tanggal ${String(d.getDate()).padStart(1, "0")}`;
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4f46e5"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow overflow-auto h-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-bold">Recent Transaction</h3>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Tx</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, i: number) => (
                <tr key={i} className="border-t text-gray-600">
                  <td className="py-3 font-medium">
                    <div className="text-sm font-semibold">
                      {tx.category?.name || "-"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td
                    className={`text-sm font-bold ${
                      tx.type === "expense" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {formatRupiah(parseInt(tx.amount))}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-400">
                    No Recent Transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
