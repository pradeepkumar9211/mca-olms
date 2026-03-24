function StatusBadge({ status }) {
    const styles = {
        success: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700",
        published: "bg-blue-100 text-blue-700",
        unpublished: "bg-gray-100 text-gray-600",
        verified: "bg-green-100 text-green-700",
        unverified: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default StatusBadge;