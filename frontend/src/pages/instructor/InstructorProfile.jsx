import { useState } from "react";
import toast from "react-hot-toast";
import InstructorLayout from "../../components/common/InstructorLayout";
import { useAuth } from "../../context/AuthContext";
import { updateInstructorProfile } from "../../api/dashboardApi";
import { changePassword } from "../../api/authApi";

function InstructorProfile() {
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [form, setForm] = useState({
    bio: user?.bio || "",
    skills: user?.skills || "",
  });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateInstructorProfile(form);
      login({ ...user, ...form }, token);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      toast.success("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <InstructorLayout>
      <div className="p-8 max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

        {/* profile info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile info</h2>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell students about yourself..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="e.g. React, Node.js, Python"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* change password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <input
                type="password"
                value={pwForm.oldPassword}
                onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="Min 8 characters"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {pwLoading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </InstructorLayout>
  );
}

export default InstructorProfile;