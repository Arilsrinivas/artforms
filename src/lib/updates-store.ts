import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import i1 from "@/assets/inspiration-1.jpg";
import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";

export type ProjectType =
  | "Residential"
  | "Commercial"
  | "Interior"
  | "Renovation"
  | "Architecture"
  | "Construction"
  | "Civil Works"
  | "Landscape"
  | "Other";

export type ProjectStatus =
  | "Completed"
  | "In Progress"
  | "Starting Soon"
  | "Delivered"
  | "Behind the Scenes"
  | "Client Visit";

export interface MediaItem {
  id: string;
  type: "image" | "video" | "pdf" | "before-after";
  url: string;
  beforeUrl?: string;
  afterUrl?: string;
  title?: string;
  sizeBytes?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
  approved: boolean;
  pinned: boolean;
  hidden: boolean;
}

export interface Post {
  id: string;
  caption: string;
  location?: string;
  category: ProjectType;
  status: ProjectStatus;
  media: MediaItem[];
  pinned: boolean;
  scheduledDate?: string; // ISO string if scheduled
  isDraft: boolean;
  createdAt: string;
  likes: number;
  reactions: {
    heart: number;
    thumbsUp: number;
    clap: number;
    fire: number;
  };
  commentsEnabled: boolean;
  views: number;
  shares: number;
}

export interface AnalyticsSummary {
  totalPosts: number;
  viewsToday: number;
  viewsThisMonth: number;
  mostViewedPostId?: string;
  mostSharedPostId?: string;
  topCategories: { category: ProjectType; count: number }[];
  trafficData: { date: string; views: number }[];
  recentVisitors: { ip: string; time: string; location: string; duration: number }[];
}

const STORAGE_KEYS = {
  POSTS: "artforms_posts",
  COMMENTS: "artforms_comments",
  REACTIONS_TRACK: "artforms_user_reactions", // postId -> reactionType
  ANALYTICS: "artforms_analytics_log",
  VISITOR_ID: "artforms_visitor_id"
};

// Unique visitor tracking setup
const getOrCreateVisitorId = (): string => {
  if (typeof window === "undefined") return "server";
  let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!vid) {
    vid = "usr_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
  }
  return vid;
};

// Initial Seed Data matching premium assets
const initialPosts: Post[] = [
  {
    id: "post_1",
    caption: "Crafting warmth in every corner. Detailed look into our recently completed interior project at KR Puram, Hassan. Focused on bespoke teak wood cladding, warm ambient profile lighting, and custom joinery. #InteriorDesign #HomeDecor #Hassan #Artforms #CivilEngineering",
    location: "KR Puram, Hassan",
    category: "Interior",
    status: "Completed",
    media: [
      { id: "m1", type: "image", url: h1 },
      { id: "m2", type: "image", url: p1 },
      { id: "m3", type: "image", url: i3 }
    ],
    pinned: true,
    isDraft: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likes: 124,
    reactions: { heart: 84, thumbsUp: 20, clap: 12, fire: 8 },
    commentsEnabled: true,
    views: 450,
    shares: 18
  },
  {
    id: "post_2",
    caption: "Modern Architectural Facade. A dusk preview of a contemporary residential duplex project. Designed with high-performance glass balustrades and natural stone cladding. #Architecture #Construction #CivilWorks #ModernDesign",
    location: "Vidyanagar, Hassan",
    category: "Architecture",
    status: "Delivered",
    media: [
      { id: "m4", type: "image", url: h2 },
      { id: "m5", type: "image", url: i2 }
    ],
    pinned: false,
    isDraft: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    likes: 98,
    reactions: { heart: 52, thumbsUp: 30, clap: 10, fire: 6 },
    commentsEnabled: true,
    views: 312,
    shares: 11
  },
  {
    id: "post_3",
    caption: "Designing functional ergonomics. Custom modular kitchen built in premium grey laminates and warm ash textures. Designed for maximum storage and a clutter-free lifestyle. #ModularKitchen #InteriorDesign #Renovation",
    location: "Shanthi Nagar, Hassan",
    category: "Interior",
    status: "Completed",
    media: [
      { id: "m6", type: "image", url: h3 },
      { id: "m7", type: "image", url: p2 }
    ],
    pinned: false,
    isDraft: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    likes: 76,
    reactions: { heart: 40, thumbsUp: 22, clap: 8, fire: 6 },
    commentsEnabled: false,
    views: 220,
    shares: 5
  },
  {
    id: "post_4",
    caption: "Excited to share a sneak peek of our modular wardrobes & study setups currently under development at BM Road, Hassan. Quality checks in progress! #BehindTheScenes #Woodwork #BespokeDesign",
    location: "BM Road, Hassan",
    category: "Civil Works",
    status: "Behind the Scenes",
    media: [
      { id: "m8", type: "image", url: p4 },
      { id: "m9", type: "image", url: p5 }
    ],
    pinned: false,
    isDraft: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    reactions: { heart: 20, thumbsUp: 15, clap: 8, fire: 2 },
    commentsEnabled: true,
    views: 135,
    shares: 2
  }
];

const initialComments: Comment[] = [
  {
    id: "c1",
    postId: "post_1",
    author: "Naveen Gowda",
    content: "Absolutely amazing work! The teak paneling has changed the look of the living room completely.",
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    approved: true,
    pinned: true,
    hidden: false
  },
  {
    id: "c2",
    postId: "post_1",
    author: "Prerna M.",
    content: "Can you share details on the lighting fixtures used?",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    approved: true,
    pinned: false,
    hidden: false
  },
  {
    id: "c3",
    postId: "post_2",
    author: "Dr. Sandeep",
    content: "Stunning front elevation design. Is this project open for walkthroughs?",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    approved: true,
    pinned: false,
    hidden: false
  }
];

// Helper to get from localstorage with fallback
const getStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error("Error parsing storage key:", key, e);
    return fallback;
  }
};

const setStorageItem = <T>(key: string, val: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Storage quota exceeded or error writing key:", key, e);
    // If saving posts caused a quota error, sanitize large base64 strings
    if (key === STORAGE_KEYS.POSTS && Array.isArray(val)) {
      const sanitized = (val as any[]).map((post) => ({
        ...post,
        media: (post.media || []).map((m: any) => {
          // If media URL is a giant Base64 video/image (>250KB), replace with fallback URL
          if (m.url && m.url.startsWith("data:") && m.url.length > 250000) {
            return {
              ...m,
              url: m.type === "video" 
                ? "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-architecture-and-interior-41589-large.mp4"
                : m.url.substring(0, 150) // placeholder fallback
            };
          }
          return m;
        })
      }));
      try {
        localStorage.setItem(key, JSON.stringify(sanitized));
      } catch (err) {
        console.error("Failed to save sanitized posts", err);
      }
    }
  }
};

export const UpdatesStore = {
  // --- POSTS ---
  getPosts(includeUnpublished = false): Post[] {
    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const now = new Date();
    
    // Sort scheduled posts or drafts
    return posts
      .filter((p) => {
        if (includeUnpublished) return true;
        if (p.isDraft) return false;
        if (p.scheduledDate && new Date(p.scheduledDate) > now) return false;
        return true;
      })
      .sort((a, b) => {
        // Pinned posts always at the top, then newest first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },

  getPostById(id: string): Post | undefined {
    const posts = this.getPosts(true);
    return posts.find((p) => p.id === id);
  },

  createPost(postData: Omit<Post, "id" | "likes" | "reactions" | "views" | "shares" | "createdAt">): Post {
    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const newPost: Post = {
      ...postData,
      id: "post_" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      likes: 0,
      reactions: { heart: 0, thumbsUp: 0, clap: 0, fire: 0 },
      views: 0,
      shares: 0
    };
    posts.push(newPost);
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    this.logAnalyticsAction("create_post", newPost.id);
    return newPost;
  },

  updatePost(id: string, updatedData: Partial<Post>): Post {
    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Post not found");
    
    posts[idx] = { ...posts[idx], ...updatedData };
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    return posts[idx];
  },

  deletePost(id: string): void {
    let posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    posts = posts.filter((p) => p.id !== id);
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    
    // Also delete comments
    let comments = getStorageItem<Comment[]>(STORAGE_KEYS.COMMENTS, initialComments);
    comments = comments.filter((c) => c.postId !== id);
    setStorageItem(STORAGE_KEYS.COMMENTS, comments);
  },

  archivePost(id: string): void {
    // We treat archiving as converting to a draft
    this.updatePost(id, { isDraft: true });
  },

  // --- COMMENTS ---
  getComments(postId?: string, includeUnapproved = false): Comment[] {
    const comments = getStorageItem<Comment[]>(STORAGE_KEYS.COMMENTS, initialComments);
    return comments
      .filter((c) => {
        if (postId && c.postId !== postId) return false;
        if (!includeUnapproved && !c.approved) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  },

  addComment(postId: string, author: string, content: string): Comment {
    const comments = getStorageItem<Comment[]>(STORAGE_KEYS.COMMENTS, initialComments);
    const requiresApproval = true; // Auto-moderate comments

    const newComment: Comment = {
      id: "c_" + Math.random().toString(36).substr(2, 9),
      postId,
      author: author || "Anonymous Visitor",
      content,
      timestamp: new Date().toISOString(),
      approved: !requiresApproval, // False by default, needs admin approval
      pinned: false,
      hidden: false
    };

    comments.push(newComment);
    setStorageItem(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  },

  moderateComment(id: string, action: "approve" | "delete" | "hide" | "pin"): void {
    const comments = getStorageItem<Comment[]>(STORAGE_KEYS.COMMENTS, initialComments);
    const idx = comments.findIndex((c) => c.id === id);
    if (idx === -1) return;

    if (action === "approve") {
      comments[idx].approved = true;
      comments[idx].hidden = false;
    } else if (action === "delete") {
      comments.splice(idx, 1);
    } else if (action === "hide") {
      comments[idx].hidden = true;
    } else if (action === "pin") {
      comments[idx].pinned = !comments[idx].pinned;
    }

    setStorageItem(STORAGE_KEYS.COMMENTS, comments);
  },

  // --- REACTIONS ---
  reactToPost(postId: string, type: "heart" | "thumbsUp" | "clap" | "fire"): boolean {
    const userReactions = getStorageItem<Record<string, string>>(STORAGE_KEYS.REACTIONS_TRACK, {});
    const visitorId = getOrCreateVisitorId();
    const trackKey = `${visitorId}_${postId}`;

    if (userReactions[trackKey]) {
      // User already reacted to this post
      return false;
    }

    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return false;

    // Increment count
    posts[idx].likes += 1;
    if (!posts[idx].reactions) {
      posts[idx].reactions = { heart: 0, thumbsUp: 0, clap: 0, fire: 0 };
    }
    posts[idx].reactions[type] += 1;

    userReactions[trackKey] = type;
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    setStorageItem(STORAGE_KEYS.REACTIONS_TRACK, userReactions);
    
    this.logAnalyticsAction("react", postId);
    return true;
  },

  getUserReaction(postId: string): string | null {
    const userReactions = getStorageItem<Record<string, string>>(STORAGE_KEYS.REACTIONS_TRACK, {});
    const visitorId = getOrCreateVisitorId();
    const trackKey = `${visitorId}_${postId}`;
    return userReactions[trackKey] || null;
  },

  // --- ENGAGEMENT TRACKING / ANALYTICS ---
  incrementViews(postId: string): void {
    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return;

    posts[idx].views += 1;
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    this.logAnalyticsAction("view", postId);
  },

  incrementShares(postId: string): void {
    const posts = getStorageItem<Post[]>(STORAGE_KEYS.POSTS, initialPosts);
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) return;

    posts[idx].shares += 1;
    setStorageItem(STORAGE_KEYS.POSTS, posts);
    this.logAnalyticsAction("share", postId);
  },

  logAnalyticsAction(action: "view" | "react" | "share" | "create_post", postId: string): void {
    const logs = getStorageItem<any[]>(STORAGE_KEYS.ANALYTICS, []);
    logs.push({
      action,
      postId,
      visitorId: getOrCreateVisitorId(),
      timestamp: new Date().toISOString()
    });
    setStorageItem(STORAGE_KEYS.ANALYTICS, logs);
  },

  getAnalytics(): AnalyticsSummary {
    const posts = this.getPosts(true);
    const logs = getStorageItem<any[]>(STORAGE_KEYS.ANALYTICS, []);
    
    // Total posts count
    const totalPosts = posts.filter(p => !p.isDraft).length;

    // Group views
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const viewLogs = logs.filter((l) => l.action === "view");
    const viewsToday = viewLogs.filter((l) => l.timestamp.startsWith(todayStr)).length;
    const viewsThisMonth = viewLogs.filter((l) => {
      const d = new Date(l.timestamp);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Top categories count
    const catMap: Record<string, number> = {};
    posts.filter(p => !p.isDraft).forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    const topCategories = Object.entries(catMap)
      .map(([category, count]) => ({ category: category as ProjectType, count }))
      .sort((a, b) => b.count - a.count);

    // Most viewed & most shared post
    let mostViewed: Post | undefined;
    let mostShared: Post | undefined;
    posts.forEach((p) => {
      if (!mostViewed || p.views > mostViewed.views) mostViewed = p;
      if (!mostShared || p.shares > mostShared.shares) mostShared = p;
    });

    // Simulated traffic data (last 7 days)
    const trafficData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = viewLogs.filter((l) => l.timestamp.startsWith(dateStr)).length;
      trafficData.push({
        date: d.toLocaleDateString("en-US", { weekday: "short" }),
        views: count + Math.floor(Math.random() * 20) + 5 // Pad with some base values for visualization
      });
    }

    // Simulated recent visitors
    const locations = ["Hassan, KA", "Bangalore, KA", "Mysore, KA", "Mangalore, KA", "Chikmagalur, KA"];
    const recentVisitors = [];
    for (let i = 0; i < 5; i++) {
      const randomTime = new Date(Date.now() - i * 15 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
      recentVisitors.push({
        ip: `192.168.10.${100 + i + Math.floor(Math.random() * 10)}`,
        time: randomTime,
        location: locations[i % locations.length],
        duration: Math.floor(Math.random() * 180) + 15 // seconds
      });
    }

    return {
      totalPosts,
      viewsToday: viewsToday || Math.floor(Math.random() * 5) + 3,
      viewsThisMonth: viewsThisMonth || Math.floor(Math.random() * 40) + 45,
      mostViewedPostId: mostViewed?.id,
      mostSharedPostId: mostShared?.id,
      topCategories,
      trafficData,
      recentVisitors
    };
  },

  // --- MOCK UPLOAD VALIDATION ---
  validateUpload(file: File): { valid: boolean; error?: string } {
    const maxSizeBytes = 150 * 1024 * 1024; // 150 MB limit
    if (file.size > maxSizeBytes) {
      return { valid: false, error: "File exceeds 150 MB upload limit." };
    }

    const type = file.type || "";
    const name = file.name.toLowerCase();
    const isImage = type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(name);
    const isVideo = type.startsWith("video/") || /\.(mp4|mov|webm|mkv|avi|3gp|m4v|wmv|flv)$/i.test(name);
    const isPdf = type === "application/pdf" || name.endsWith(".pdf");

    if (!isImage && !isVideo && !isPdf) {
      return { valid: false, error: "Unsupported file type. Upload images, videos, or PDFs." };
    }

    return { valid: true };
  },

  // --- MOCK INTEGRATION CHANNELS ---
  triggerAutoPostingChannels(post: Post) {
    console.log("Mock triggers initiated for post:", post.id);
    return {
      instagram: "Success (simulated queue)",
      facebook: "Success (simulated queue)",
      whatsapp: "Sent to Channel (simulated)",
      linkedin: "Success (simulated queue)"
    };
  }
};
