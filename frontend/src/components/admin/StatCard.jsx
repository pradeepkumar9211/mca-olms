function StatCard({ label, value, icon, color = "blue" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`text-2xl p-3 rounded-xl ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-bold text-2xl">{value ?? 0}</p>
            </div>
        </div>
    );
}

export default StatCard;