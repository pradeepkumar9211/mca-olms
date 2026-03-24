import StatusBadge from "../common/StatusBadge";

function ModuleItem({ module, onDelete, onEdit }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-mono w-6 text-center flex-shrink-0">
                    {module.content_order}
                </span>
                <div>
                    <p className="text-sm font-medium text-gray-800">{module.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={module.content_type === "video" ? "published" : "pending"} />
                        <span className="text-xs text-gray-400">
                            {module.content_type === "video" ? "Video" : "PDF Document"}
                        </span>
                        {module.duration && (
                            <span className="text-xs text-gray-400">• {module.duration}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* edit + delete buttons */}
            <div className="flex gap-2 flex-shrink-0">
                <button
                    onClick={() => onEdit(module)}
                    className="text-blue-400 hover:text-blue-600 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(module.content_id)}
                    className="text-red-400 hover:text-red-600 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ModuleItem;