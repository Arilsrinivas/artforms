import afMarkWhite from "@/assets/logo/af-mark-white.png";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  UpdatesStore,
  Post,
  Comment,
  ProjectType,
  ProjectStatus,
  MediaItem,
  AnalyticsSummary
} from "@/lib/updates-store";
import { MediaStorage } from "@/lib/media-storage";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SafeVideoPlayer } from "@/components/site/SafeVideoPlayer";
import { SafeImage } from "@/components/site/SafeImage";
import {
  Plus,
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  Upload,
  Calendar,
  Eye,
  Share2,
  Trash2,
  Archive,
  Pin,
  MapPin,
  Heart,
  ExternalLink,
  Lock,
  LogOut,
  Folder,
  Sliders,
  Check,
  CheckCircle,
  FileDown,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/admin/business-updates")({
  head: () => ({
    meta: [
      { title: "Business Updates Dashboard | Artforms Civil and Interiors Admin" },
    ],
  }),
  component: AdminBusinessUpdatesPage,
});

function AdminBusinessUpdatesPage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "comments" | "analytics">("create");

  // Post form state
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ProjectType>("Residential");
  const [status, setStatus] = useState<ProjectStatus>("Completed");
  const [mediaList, setMediaList] = useState<Omit<MediaItem, "id">[]>([]);
  const [pinned, setPinned] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  
  // Custom Media Upload Inputs
  const [uploadType, setUploadType] = useState<"image" | "video" | "pdf" | "before-after">("image");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");

  // Upload Progress & Feedback State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileSize, setUploadFileSize] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Sub-lists and analytics
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Edit Mode state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Autocomplete hashtags suggestions
  const suggestedTags = ["#InteriorDesign", "#HomeDecor", "#Construction", "#Architecture", "#ArtForms", "#CivilEngineering", "#Hassan"];

  // Authentication check
  useEffect(() => {
    const auth = localStorage.getItem("artforms_admin_auth");
    if (auth !== "true") {
      toast.error("Access Denied", {
        description: "Please authenticate as an administrator to access this panel."
      });
      navigate({ to: "/admin/login" });
    } else {
      setAuthorized(true);
      reloadAllData();
    }
  }, [navigate]);

  const reloadAllData = () => {
    setPosts(UpdatesStore.getPosts(true));
    setComments(UpdatesStore.getComments(undefined, true));
    setAnalytics(UpdatesStore.getAnalytics());
  };

  const handleLogout = () => {
    localStorage.removeItem("artforms_admin_auth");
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Convert files helper for simulated & persistent uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "normal" | "before" | "after") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);

    // Multi-image upload for carousels
    if (field === "normal" && uploadType === "image") {
      setIsUploading(true);
      setUploadProgress(10);
      const loadedMedia: Omit<MediaItem, "id">[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadFileName(file.name);
        setUploadFileSize(formatBytes(file.size));
        
        const validation = UpdatesStore.validateUpload(file, "image");
        if (!validation.valid) {
          setUploadError(validation.error || `File ${file.name} is invalid.`);
          toast.error(validation.error || `File ${file.name} is invalid.`);
          continue;
        }

        setUploadProgress(Math.round(((i + 0.5) / files.length) * 100));

        // Save image to persistent storage
        const mediaId = "img_" + Date.now() + "_" + i + "_" + Math.random().toString(36).substr(2, 6);
        await MediaStorage.saveMediaBlob(mediaId, file, file.type);

        loadedMedia.push({
          type: "image",
          url: "indexeddb://" + mediaId,
          title: file.name
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setIsUploading(false);
      if (loadedMedia.length > 0) {
        setMediaList((prev) => [...prev, ...loadedMedia]);
        toast.success(`Successfully uploaded and attached ${loadedMedia.length} image(s).`);
      }
    } else {
      // Single file upload for video, pdf, before-after
      const file = files[0];
      setUploadFileName(file.name);
      setUploadFileSize(formatBytes(file.size));

      const validation = UpdatesStore.validateUpload(file, uploadType);
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid file upload");
        toast.error(validation.error || "Invalid file upload");
        return;
      }

      setIsUploading(true);
      setUploadProgress(20);

      // Simulate chunked upload progress
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 25 : prev));
      }, 100);

      try {
        if (field === "normal" && uploadType === "video") {
          const mediaId = "vid_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
          await MediaStorage.saveMediaBlob(mediaId, file, file.type);
          
          clearInterval(progressTimer);
          setUploadProgress(100);

          setMediaList((prev) => [
            ...prev,
            {
              type: "video",
              url: "indexeddb://" + mediaId,
              title: file.name
            }
          ]);
          setUploadedUrl("");
          setIsUploading(false);
          toast.success(`Video "${file.name}" (${formatBytes(file.size)}) uploaded successfully!`);
          return;
        }

        if (field === "normal" && uploadType === "pdf") {
          const mediaId = "pdf_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
          await MediaStorage.saveMediaBlob(mediaId, file, file.type);
          
          clearInterval(progressTimer);
          setUploadProgress(100);

          setMediaList((prev) => [
            ...prev,
            {
              type: "pdf",
              url: "indexeddb://" + mediaId,
              title: file.name || "Project Brochure (PDF)"
            }
          ]);
          setUploadedUrl("");
          setIsUploading(false);
          toast.success(`PDF brochure "${file.name}" uploaded successfully!`);
          return;
        }

        if (field === "before") {
          const mediaId = "before_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
          await MediaStorage.saveMediaBlob(mediaId, file, file.type);
          setBeforeUrl("indexeddb://" + mediaId);
          clearInterval(progressTimer);
          setUploadProgress(100);
          setIsUploading(false);
          toast.success(`Before image "${file.name}" uploaded.`);
          return;
        }

        if (field === "after") {
          const mediaId = "after_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
          await MediaStorage.saveMediaBlob(mediaId, file, file.type);
          setAfterUrl("indexeddb://" + mediaId);
          clearInterval(progressTimer);
          setUploadProgress(100);
          setIsUploading(false);
          toast.success(`After image "${file.name}" uploaded.`);
          return;
        }
      } catch (err: any) {
        clearInterval(progressTimer);
        setIsUploading(false);
        setUploadError(err?.message || "Failed to store media file.");
        toast.error("Upload failed: " + (err?.message || "Error saving file."));
      }
    }
  };

  const addMediaToPost = () => {
    if (uploadType === "before-after") {
      if (!beforeUrl || !afterUrl) {
        toast.error("Both Before and After images are required.");
        return;
      }
      setMediaList((prev) => [
        ...prev,
        { type: "before-after", url: "", beforeUrl, afterUrl, title: "Before vs After Comparison" }
      ]);
      setBeforeUrl("");
      setAfterUrl("");
      toast.success("Before vs After comparison added to draft.");
    } else {
      if (!uploadedUrl.trim()) {
        toast.error("Please select a file to upload or enter a media web URL first.");
        return;
      }
      setMediaList((prev) => [
        ...prev,
        { 
          type: uploadType, 
          url: uploadedUrl.trim(), 
          title: uploadType === "pdf" ? "Project Brochure" : uploadType === "video" ? "Video Stream" : "Media Asset" 
        }
      ]);
      setUploadedUrl("");
      toast.success("Web asset added to post draft.");
    }
  };

  const handleCreatePost = (isDraft: boolean) => {
    if (!caption.trim()) {
      toast.error("Post caption is required.");
      return;
    }

    if (mediaList.length === 0) {
      toast.error("At least one media asset (image, video, PDF) must be added.");
      return;
    }

    // Build media items with random IDs
    const finalMedia: MediaItem[] = mediaList.map((m, idx) => ({
      ...m,
      id: `media_${Date.now()}_${idx}`
    }));

    if (editingPostId) {
      // Handle Edit Update
      UpdatesStore.updatePost(editingPostId, {
        caption,
        location,
        category,
        status,
        media: finalMedia,
        pinned,
        commentsEnabled,
        scheduledDate: scheduledDate || undefined,
        isDraft
      });
      toast.success("Post updated successfully!");
      setEditingPostId(null);
    } else {
      // Handle Create New
      UpdatesStore.createPost({
        caption,
        location: location || undefined,
        category,
        status,
        media: finalMedia,
        pinned,
        commentsEnabled,
        scheduledDate: scheduledDate || undefined,
        isDraft
      });
      toast.success(isDraft ? "Draft saved successfully." : "Post published successfully!");
    }

    // Clear state
    setCaption("");
    setLocation("");
    setCategory("Residential");
    setStatus("Completed");
    setMediaList([]);
    setPinned(false);
    setCommentsEnabled(true);
    setScheduledDate("");
    
    reloadAllData();
  };

  const startEdit = (post: Post) => {
    setEditingPostId(post.id);
    setCaption(post.caption);
    setLocation(post.location || "");
    setCategory(post.category);
    setStatus(post.status);
    setMediaList(post.media);
    setPinned(post.pinned);
    setCommentsEnabled(post.commentsEnabled);
    setScheduledDate(post.scheduledDate || "");
    setActiveTab("create");
    toast.info("Post loaded into Creator for editing.");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-10 w-10 text-clay mx-auto animate-pulse mb-4" />
          <h2 className="text-lg font-medium">Verifying Administrative Session...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased flex flex-col justify-between">
      <Nav />

      {/* Admin Panel Header */}
      <section className="bg-ink text-canvas pt-32 pb-12 md:pt-36 md:pb-16 border-b border-canvas/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/50">
              <img src={afMarkWhite} alt="AF" className="h-4 w-auto object-contain opacity-70" />
              <span>Artforms Civil and Interiors · Admin Dashboard</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-light tracking-tight text-canvas md:text-5xl">
              Business <em className="italic text-clay">Updates Manager.</em>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="self-start rounded-full border border-canvas/20 px-5 py-2.5 text-xs uppercase tracking-wider text-canvas hover:bg-clay hover:border-clay hover:text-canvas flex items-center gap-2 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </section>

      {/* Tab Selectors Navigation */}
      <div className="border-b border-ink/10 bg-canvas">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex overflow-x-auto gap-8 text-[12px] uppercase tracking-[0.2em] font-semibold text-ink/65">
          <button
            onClick={() => setActiveTab("create")}
            className={`py-5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "create" ? "border-clay text-ink" : "border-transparent hover:text-ink"
            }`}
          >
            <Plus className="h-4.5 w-4.5" /> {editingPostId ? "Edit Post" : "Create Post"}
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "manage" ? "border-clay text-ink" : "border-transparent hover:text-ink"
            }`}
          >
            <Sliders className="h-4.5 w-4.5" /> Manage Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "comments" ? "border-clay text-ink" : "border-transparent hover:text-ink"
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5" /> Comments ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-5 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "analytics" ? "border-clay text-ink" : "border-transparent hover:text-ink"
            }`}
          >
            <BarChart2 className="h-4.5 w-4.5" /> Analytics summary
          </button>
        </div>
      </div>

      {/* Content Body Grid */}
      <main className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 flex-1 w-full">
        
        {/* TAB 1: CREATE POST */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column Form */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink">
                {editingPostId ? "Modify Existing Post" : "Create Instagram-Style Post"}
              </h2>

              <div className="space-y-4">
                {/* Caption Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Post Caption</label>
                  <textarea
                    rows={6}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Provide a description. Support hashtags, line breaks, emojis..."
                    className="w-full rounded-xl border border-ink/15 bg-canvas p-4 text-sm text-ink focus:border-clay focus:outline-none"
                    maxLength={3000}
                  />
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>Suggested tags: click to append</span>
                    <span>{caption.length} / 3000 characters</span>
                  </div>
                  
                  {/* Suggest hashtags buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setCaption((prev) => prev + (prev ? " " : "") + tag)}
                        className="rounded-full bg-sand/35 text-ink/75 px-3 py-1 text-[10px] uppercase hover:bg-clay hover:text-canvas transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location & Metadata fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Project Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Hassan, Bangalore, Mysore"
                      className="w-full rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category Type</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProjectType)}
                      className="w-full rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none cursor-pointer"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Interior">Interior</option>
                      <option value="Renovation">Renovation</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Construction">Construction</option>
                      <option value="Civil Works">Civil Works</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Project Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                      className="w-full rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none cursor-pointer"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Starting Soon">Starting Soon</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Behind the Scenes">Behind the Scenes</option>
                      <option value="Client Visit">Client Visit</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Schedule Publish (Optional)</label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Checkboxes settings */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="rounded border-ink/20 text-clay focus:ring-clay h-4 w-4 cursor-pointer"
                    />
                    <span>Pin to Top of Feed</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={commentsEnabled}
                      onChange={(e) => setCommentsEnabled(e.target.checked)}
                      className="rounded border-ink/20 text-clay focus:ring-clay h-4 w-4 cursor-pointer"
                    />
                    <span>Enable Customer Comments</span>
                  </label>
                </div>

                {/* Submissions Action triggers */}
                <div className="flex gap-4 pt-6 border-t border-ink/10 mt-6">
                  {editingPostId && (
                    <button
                      onClick={() => {
                        setEditingPostId(null);
                        setCaption("");
                        setLocation("");
                        setMediaList([]);
                        setPinned(false);
                        setScheduledDate("");
                        toast.info("Exited Edit Mode.");
                      }}
                      className="rounded-full border border-ink/25 px-6 py-3.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-canvas transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleCreatePost(true)}
                    className="flex-1 rounded-full border border-ink/30 px-6 py-3.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-canvas transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleCreatePost(false)}
                    className="flex-1 rounded-full bg-clay px-6 py-3.5 text-xs uppercase tracking-wider text-canvas hover:bg-ink transition-colors font-bold"
                  >
                    {scheduledDate ? "Schedule Post" : editingPostId ? "Save Post" : "Publish Post"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Uploader & Previews */}
            <div className="lg:col-span-5 space-y-6 bg-sand/15 border border-ink/5 p-6 rounded-2xl">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-ink">Upload Media Assets</h3>
              
              {/* Media type selector */}
              <div className="grid grid-cols-4 gap-2">
                {(["image", "video", "pdf", "before-after"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setUploadType(t);
                      setUploadedUrl("");
                    }}
                    className={`rounded py-2 text-[10px] uppercase tracking-wider border font-medium ${
                      uploadType === t
                        ? "bg-ink border-ink text-canvas"
                        : "bg-canvas border-ink/15 text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {t === "before-after" ? "B vs A" : t}
                  </button>
                ))}
              </div>

              {/* Drag/Drop Box Upload Simulator */}
              <div className="border-2 border-dashed border-ink/15 rounded-xl p-8 text-center bg-canvas hover:border-clay transition-colors relative cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "normal")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept={
                    uploadType === "video"
                      ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      : uploadType === "pdf"
                      ? "application/pdf,.pdf"
                      : "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  }
                  style={{ display: uploadType === "before-after" ? "none" : "block" }}
                  multiple={uploadType === "image"}
                />
                
                {uploadType === "before-after" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative border border-dashed rounded p-3 text-center hover:border-clay">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "before")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      />
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Before Photo</span>
                      {beforeUrl && <CheckCircle className="h-4 w-4 text-moss mx-auto mt-2" />}
                    </div>
                    <div className="relative border border-dashed rounded p-3 text-center hover:border-clay">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "after")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      />
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">After Photo</span>
                      {afterUrl && <CheckCircle className="h-4 w-4 text-moss mx-auto mt-2" />}
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <span className="text-xs text-ink/75 font-medium block">
                      {uploadType === "video" ? "Choose or drop Video file" : uploadType === "pdf" ? "Choose or drop PDF Brochure" : "Choose or drop Images"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      {uploadType === "video" 
                        ? "Max size: 100 MB. Formats: MP4, WebM, MOV" 
                        : uploadType === "pdf" 
                        ? "Max size: 50 MB. Format: PDF" 
                        : "Max size: 25 MB per image. Formats: JPG, PNG, WebP"}
                    </span>
                  </>
                )}
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className="bg-canvas border border-ink/10 rounded-xl p-4 space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-ink truncate max-w-[200px]">
                      Uploading {uploadFileName} {uploadFileSize ? `(${uploadFileSize})` : ""}...
                    </span>
                    <span className="font-bold text-clay">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-sand/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-clay transition-all duration-300 rounded-full" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {uploadProgress < 100 ? "Processing and storing media chunk..." : "Upload finalized successfully!"}
                  </p>
                </div>
              )}

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[11px] leading-relaxed">
                    <strong className="block font-semibold mb-0.5">Upload Validation Failed</strong>
                    {uploadError}
                  </div>
                </div>
              )}

              {/* URL Fallback link input */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Or provide asset web URL {uploadType === "video" ? "(Direct MP4, YouTube, Vimeo)" : ""}
                </span>
                <input
                  type="text"
                  placeholder={
                    uploadType === "video" 
                      ? "https://assets.example.com/video.mp4 or YouTube link" 
                      : "https://images.unsplash.com/..."
                  }
                  value={uploadedUrl}
                  onChange={(e) => setUploadedUrl(e.target.value)}
                  className="w-full rounded border border-ink/15 bg-canvas px-3 py-2 text-xs text-ink focus:border-clay focus:outline-none"
                  disabled={uploadType === "before-after"}
                />
              </div>

              {/* Add Media button */}
              <button
                onClick={addMediaToPost}
                disabled={isUploading}
                className="w-full rounded bg-ink py-2.5 text-xs uppercase tracking-wider text-canvas hover:bg-clay transition-colors disabled:opacity-50"
              >
                Add Asset to Post Draft
              </button>

              {/* Media preview block */}
              {mediaList.length > 0 && (
                <div className="pt-4 border-t border-ink/10 space-y-3">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-ink/70">Current Attachments ({mediaList.length})</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {mediaList.map((media, idx) => (
                      <div key={idx} className="relative aspect-square border rounded overflow-hidden bg-black/5 group">
                        {media.type === "image" && (
                          <SafeImage src={media.url} className="h-full w-full object-cover" />
                        )}
                        {media.type === "video" && (
                          <SafeVideoPlayer src={media.url} className="h-full w-full object-cover" />
                        )}
                        {media.type === "pdf" && (
                          <div className="h-full w-full flex items-center justify-center bg-sand/20 text-[10px] font-semibold text-ink/80">PDF</div>
                        )}
                        {media.type === "before-after" && (
                          <div className="h-full w-full flex items-center justify-center bg-clay/10 text-[10px] font-semibold text-clay">B vs A</div>
                        )}
                        <button
                          onClick={async () => {
                            if (media.url && media.url.startsWith("indexeddb://")) {
                              const mId = media.url.replace("indexeddb://", "");
                              await MediaStorage.deleteMediaBlob(mId);
                            }
                            setMediaList((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Attachment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: MANAGE POSTS */}
        {activeTab === "manage" && (
          <div className="space-y-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink">Manage Published, Scheduled & Drafts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="border border-ink/10 rounded-xl overflow-hidden bg-canvas flex flex-col justify-between shadow-sm">
                  <div>
                    {/* Media preview */}
                    <div className="aspect-[16/10] w-full bg-sand/30 overflow-hidden relative">
                      {post.media && post.media.length > 0 && post.media[0].type === "image" && (
                        <SafeImage src={post.media[0].url} className="h-full w-full object-cover" />
                      )}
                      {post.media && post.media.length > 0 && post.media[0].type === "before-after" && (
                        <SafeImage src={post.media[0].beforeUrl} className="h-full w-full object-cover" />
                      )}
                      {post.media && post.media.length > 0 && post.media[0].type === "video" && (
                        <SafeVideoPlayer src={post.media[0].url} />
                      )}
                      {post.media && post.media.length > 0 && post.media[0].type === "pdf" && (
                        <div className="h-full w-full flex items-center justify-center bg-sand/15 text-xs">PDF Document</div>
                      )}

                      {/* Status pill overlay */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {post.isDraft && (
                          <span className="bg-sand/80 text-ink text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow">
                            Draft
                          </span>
                        )}
                        {post.scheduledDate && new Date(post.scheduledDate) > new Date() && (
                          <span className="bg-clay text-canvas text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" /> Scheduled
                          </span>
                        )}
                        {post.pinned && (
                          <span className="bg-moss text-canvas text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <Pin className="h-2.5 w-2.5" /> Pinned
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                        <span>{post.category}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-ink/80 leading-relaxed line-clamp-3">
                        {post.caption}
                      </p>
                      {post.location && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3" /> {post.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="px-5 py-4 bg-sand/10 border-t border-ink/5 flex justify-between items-center">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Eye className="h-3.5 w-3.5" /> {post.views}</span>
                      <span className="flex items-center gap-0.5"><Heart className="h-3.5 w-3.5" /> {post.likes}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="p-2 rounded hover:bg-ink/5 text-ink transition-colors"
                        title="Edit post"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          UpdatesStore.archivePost(post.id);
                          toast.success("Post archived as a draft.");
                          reloadAllData();
                        }}
                        className="p-2 rounded hover:bg-ink/5 text-muted-foreground hover:text-ink transition-colors"
                        title="Archive post"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to permanently delete this post?")) {
                            UpdatesStore.deletePost(post.id);
                            toast.success("Post deleted permanently.");
                            reloadAllData();
                          }
                        }}
                        className="p-2 rounded hover:bg-destructive/10 text-destructive hover:bg-destructive hover:text-canvas transition-all"
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMMENT MODERATION */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink">Customer Comments Moderation</h2>
            
            <div className="border border-ink/10 rounded-2xl overflow-hidden bg-canvas shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sand/15 border-b border-ink/10 uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Author</th>
                    <th className="p-4 font-semibold">Post ID</th>
                    <th className="p-4 font-semibold">Comment</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground italic">No comments have been posted yet.</td>
                    </tr>
                  ) : (
                    comments.map((c) => (
                      <tr key={c.id} className="border-b border-ink/5 hover:bg-sand/5">
                        <td className="p-4 font-medium text-ink">{c.author}</td>
                        <td className="p-4 font-mono text-[10px] text-muted-foreground">{c.postId}</td>
                        <td className="p-4 max-w-sm">
                          <p className="text-ink leading-relaxed">{c.content}</p>
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            {new Date(c.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          {c.approved ? (
                            <span className="inline-flex items-center gap-1 rounded bg-moss/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-moss font-semibold">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-clay/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-clay font-semibold">
                              Pending
                            </span>
                          )}
                          {c.pinned && (
                            <span className="ml-1 inline-flex items-center gap-1 rounded bg-ink/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ink font-semibold">
                              Pinned
                            </span>
                          )}
                          {c.hidden && (
                            <span className="ml-1 inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-destructive font-semibold">
                              Hidden
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {!c.approved && (
                            <button
                              onClick={() => {
                                UpdatesStore.moderateComment(c.id, "approve");
                                toast.success("Comment approved!");
                                reloadAllData();
                              }}
                              className="rounded bg-moss px-3 py-1 text-[9px] uppercase tracking-wider text-canvas hover:opacity-90 font-medium"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              UpdatesStore.moderateComment(c.id, "pin");
                              toast.success("Comment pin state toggled.");
                              reloadAllData();
                            }}
                            className="rounded border border-ink/20 px-2.5 py-1 text-[9px] uppercase tracking-wider text-ink hover:bg-ink hover:text-canvas font-medium"
                          >
                            Pin
                          </button>
                          <button
                            onClick={() => {
                              UpdatesStore.moderateComment(c.id, "hide");
                              toast.success("Comment hidden.");
                              reloadAllData();
                            }}
                            className="rounded border border-ink/20 px-2.5 py-1 text-[9px] uppercase tracking-wider text-muted-foreground hover:bg-ink hover:text-canvas font-medium"
                          >
                            Hide
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete comment permanently?")) {
                                UpdatesStore.moderateComment(c.id, "delete");
                                toast.success("Comment deleted.");
                                reloadAllData();
                              }
                            }}
                            className="rounded border border-destructive/30 px-2.5 py-1 text-[9px] uppercase tracking-wider text-destructive hover:bg-destructive hover:text-canvas font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS SUMMARY */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink">Updates Feed Analytics Overview</h2>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="border border-ink/10 p-6 rounded-xl bg-canvas text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">Total Posts</span>
                <span className="font-[family-name:var(--font-display)] text-4xl text-ink font-light">{analytics.totalPosts}</span>
              </div>
              <div className="border border-ink/10 p-6 rounded-xl bg-canvas text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">Views Today</span>
                <span className="font-[family-name:var(--font-display)] text-4xl text-clay font-light">{analytics.viewsToday}</span>
              </div>
              <div className="border border-ink/10 p-6 rounded-xl bg-canvas text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">Views This Month</span>
                <span className="font-[family-name:var(--font-display)] text-4xl text-ink font-light">{analytics.viewsThisMonth}</span>
              </div>
              <div className="border border-ink/10 p-6 rounded-xl bg-canvas text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">Most Viewed ID</span>
                <span className="font-mono text-xs text-ink block truncate">{analytics.mostViewedPostId || "N/A"}</span>
              </div>
              <div className="border border-ink/10 p-6 rounded-xl bg-canvas text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">Most Shared ID</span>
                <span className="font-mono text-xs text-clay block truncate">{analytics.mostSharedPostId || "N/A"}</span>
              </div>
            </div>

            {/* Charts & Graph displays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic Trend Chart */}
              <div className="border border-ink/10 p-6 rounded-2xl bg-canvas shadow-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-6">Views Trend (Last 7 Days)</h3>
                <div className="h-56 flex items-end gap-6 border-b border-ink/10 pb-2">
                  {analytics.trafficData.map((d, index) => {
                    const maxVal = Math.max(...analytics.trafficData.map((td) => td.views));
                    const percentage = maxVal ? (d.views / maxVal) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          className="w-full bg-clay/20 border border-clay/35 rounded-t hover:bg-clay/50 transition-colors relative group"
                          style={{ height: `${percentage}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-ink text-canvas text-[10px] rounded px-1.5 py-0.5 hidden group-hover:block mb-1">
                            {d.views}
                          </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Categories chart */}
              <div className="border border-ink/10 p-6 rounded-2xl bg-canvas shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-6">Top Categories Share</h3>
                  <div className="space-y-4">
                    {analytics.topCategories.map((c, index) => {
                      const total = posts.filter(p => !p.isDraft).length;
                      const pct = total ? Math.round((c.count / total) * 100) : 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs text-ink/80">
                            <span>{c.category}</span>
                            <span>{c.count} posts ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-sand/35 rounded-full overflow-hidden">
                            <div className="h-full bg-clay rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground italic border-t border-ink/5 pt-4 mt-6">
                  Engagement metrics update dynamically based on live client clicks, reactions, shares, and viewing times.
                </div>
              </div>
            </div>

            {/* Simulated Live Visitor log */}
            <div className="border border-ink/10 rounded-2xl overflow-hidden bg-canvas shadow-sm">
              <div className="bg-sand/15 p-4 border-b border-ink/10 flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Simulated Recent Visitors Logs</h3>
                <span className="h-2 w-2 rounded-full bg-moss animate-ping" />
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-ink/10 uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Visitor IP</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Entry Time</th>
                    <th className="p-4 font-semibold text-right">Avg Session Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentVisitors.map((v, index) => (
                    <tr key={index} className="border-b border-ink/5 hover:bg-sand/5">
                      <td className="p-4 font-mono text-muted-foreground">{v.ip}</td>
                      <td className="p-4 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-clay" /> {v.location}</td>
                      <td className="p-4">{v.time}</td>
                      <td className="p-4 text-right font-medium">{v.duration}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
