function PDFViewer({ url }) {
    if (!url) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl text-gray-500">
                No PDF URL provided
            </div>
        );
    }

    // use Google Docs viewer for better rendering
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <div className="w-full rounded-xl overflow-hidden border border-gray-200">
            <iframe
                src={viewerUrl}
                width="100%"
                height="600"
                className="w-full"
            />
        </div>
    );
}

export default PDFViewer;