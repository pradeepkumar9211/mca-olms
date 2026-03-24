import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StudentLayout from "../../components/common/StudentLayout";

import Loader from "../../components/common/Loader";
import ProgressBar from "../../components/common/ProgressBar";
import VideoPlayer from "../../components/player/VideoPlayer";
import PDFViewer from "../../components/player/PDFViewer";
import { getEnrolledModules } from "../../api/enrollmentApi";
import { updateProgress, getProgress } from "../../api/progressApi";

function LearnCourse() {
  const { id: course_id } = useParams();

  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, progRes] = await Promise.all([
          getEnrolledModules(course_id),
          getProgress(course_id),
        ]);
        const mods = modRes.data.data || [];
        const prog = progRes.data.data;
        setModules(mods);
        setProgress(prog);
        // auto select first unwatched module
        const firstUnwatched = prog?.modules?.find((m) => !m.is_watched);
        const firstMod = firstUnwatched
          ? mods.find((m) => m.content_id === firstUnwatched.content_id)
          : mods[0];
        setActiveModule(firstMod || mods[0]);
      } catch {
        toast.error("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [course_id]);

  const isWatched = (content_id) => {
    return progress?.modules?.find((m) => m.content_id === content_id)?.is_watched;
  };

  const handleMarkWatched = async () => {
    if (!activeModule) return;
    setMarking(true);
    try {
      const res = await updateProgress({
        course_id,
        content_id: activeModule.content_id,
      });
      // refresh progress
      const progRes = await getProgress(course_id);
      setProgress(progRes.data.data);
      toast.success("Marked as watched!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Loader /></div>;

  return (
    <StudentLayout>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* progress bar at top */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Course Progress</p>
              <p className="text-sm text-gray-500">
                {progress?.watched_modules || 0} / {progress?.total_modules || 0} modules completed
              </p>
            </div>
            <ProgressBar percent={progress?.progress_percent || 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* left sidebar -- module list */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">Course Modules</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {modules.map((mod, idx) => (
                    <button
                      key={mod.content_id}
                      onClick={() => setActiveModule(mod)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeModule?.content_id === mod.content_id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* watched indicator */}
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-medium ${isWatched(mod.content_id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                          }`}>
                          {isWatched(mod.content_id) ? "✓" : idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 font-medium leading-tight">{mod.title}</p>
                          <p className="text-xs text-gray-400 mt-1 capitalize">
                            {mod.content_type === "video" ? "🎬 Video" : "📄 PDF"}
                            {mod.duration && ` • ${mod.duration}`}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* right side -- content viewer */}
            <div className="lg:col-span-2">
              {activeModule ? (
                <div className="space-y-4">
                  {/* module title */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-800">{activeModule.title}</h2>
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {activeModule.content_type === "video" ? "🎬 Video lesson" : "📄 PDF document"}
                        </p>
                      </div>
                      {isWatched(activeModule.content_id) ? (
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                          ✓ Completed
                        </span>
                      ) : (
                        <button
                          onClick={handleMarkWatched}
                          disabled={marking}
                          className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          {marking ? "Saving..." : "Mark as watched"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* video or pdf viewer */}
                  {activeModule.content_type === "video" ? (
                    <VideoPlayer url={activeModule.video_url} />
                  ) : (
                    <PDFViewer url={activeModule.file_url} />
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64 text-gray-400">
                  Select a module to start learning
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>

  );
}

export default LearnCourse;