import { getYoutubeEmbedUrl } from "../../utils/getYoutubeEmbed";

function VideoPlayer({ url }) {
    const embedUrl = getYoutubeEmbedUrl(url);

    if (!embedUrl) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl text-gray-500">
                Invalid video URL
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl overflow-hidden bg-black">
            <iframe
                src={embedUrl}
                width="100%"
                height="450"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full"
            />
        </div>
    );
}

export default VideoPlayer;