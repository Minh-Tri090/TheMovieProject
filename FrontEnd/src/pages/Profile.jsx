import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";

export default function Profile() {
  const { user } = useAuth();

  if (!user)
    return (
      <div className="container p-10 text-white">Vui lòng đăng nhập...</div>
    );

  return (
    <main className="container site-main">
      <div className="surface p-8 rounded-2xl max-w-2xl mx-auto mt-10 border border-slate-800">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-sky-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-sky-500/20">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-slate-400">Thành viên từ 2026</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <FiMail className="text-sky-400 text-xl" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">
                Email
              </p>
              <p className="text-white">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <FiShield className="text-sky-400 text-xl" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">
                Quyền hạn
              </p>
              <p className="text-white capitalize">
                {user.role || "Người dùng"}
              </p>
            </div>
          </div>

          <button className="mt-4 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg transition-all">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </main>
  );
}
