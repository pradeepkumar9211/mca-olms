import { useState, useEffect } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllPaymentsAdmin } from "../../api/adminApi";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // total revenue from successful payments
  const totalRevenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  useEffect(() => {
    getAllPaymentsAdmin()
      .then((res) => setPayments(res.data.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "student_name", label: "Student" },
    { key: "course_title", label: "Course" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-medium text-blue-600">{formatPrice(row.amount)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "payment_date",
      label: "Date",
      render: (row) => formatDate(row.payment_date),
    },
  ];

  if (loading) return <AdminLayout><Loader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
            <p className="text-gray-500 text-sm mt-1">{payments.length} total transactions</p>
          </div>
          {/* total revenue summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-right">
            <p className="text-xs text-green-600 font-medium">Total revenue</p>
            <p className="text-xl font-bold text-green-700">{formatPrice(totalRevenue)}</p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={payments}
          emptyMessage="No payment records found"
        />
      </div>
    </AdminLayout>
  );
}

export default ManagePayments;
// ```

// ---

// // All 5 admin pages done! ✅

// // **Full frontend is now complete! 🎉** Here's everything that's been built:
// // ```
// ✅ Setup — axios, AuthContext, App.jsx, ProtectedRoute
// ✅ All API service files + utils
// ✅ All reusable components
// ✅ StudentLayout, InstructorLayout, AdminLayout
// ✅ 3 auth pages
// ✅ 2 public pages(Home + CourseDetail)
// ✅ 6 student pages
// ✅ 7 instructor pages
// ✅ 5 admin pages
//   ```

// **Before testing, make sure:**
// - All student pages use `StudentLayout` instead of `Navbar`
// - All instructor pages use `InstructorLayout`
// - All admin pages use `AdminLayout`

// **Test order:**
// ```
// 1. Signup as student → login → browse → enroll → learn → review
// 2. Signup as instructor → login → create course → add modules → publish
// 3. Login as admin → verify instructor → approve course → view dashboard