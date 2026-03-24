function ProgressBar({ percent = 0 }) {
    return (
        <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{percent || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percent || 0}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;