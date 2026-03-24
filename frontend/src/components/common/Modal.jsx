function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            {/* modal box */}
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;