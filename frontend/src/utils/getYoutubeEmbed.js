export function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  // handles youtu.be/ID short links
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // handles youtube.com/watch?v=ID
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
}
