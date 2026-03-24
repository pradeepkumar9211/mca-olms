import { useState, useEffect } from "react";
// import Navbar from "../../components/common/Navbar";
import StudentLayout from "../../components/common/StudentLayout";

import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getPaymentHistory } from "../../api/paymentApi";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentHistory()
      .then((res) => setPayments(res.data.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50"><Loader /></div>;

  return (
    <StudentLayout>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h1>

          {payments.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No payment records found
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Course</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.payment_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{p.course_title}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">{formatPrice(p.amount)}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(p.payment_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

export default PaymentHistory;