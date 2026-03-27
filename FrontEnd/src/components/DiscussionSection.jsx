import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { ThumbsUp, ThumbsDown, Reply, Trash2, Send, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { getCommentsForProblem, addComment, deleteComment, toggleLikeComment } from "../lib/api/comments";
import toast from "react-hot-toast";

// --- Utility ---
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ username, src, size = 36 }) {
  const initials = username ? username.charAt(0).toUpperCase() : "?";
  const colors = [
    "#4f46e5", "#7c3aed", "#db2777", "#059669",
    "#d97706", "#dc2626", "#2563eb", "#0891b2"
  ];
  const color = colors[username ? username.charCodeAt(0) % colors.length : 0];

  return src ? (
    <img
      src={src}
      alt={username}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {initials}
    </div>
  );
}

// --- Reusable Comment Input ---
function CommentInput({
  user,
  onSubmit,
  onCancel,
  placeholder = "Add a comment...",
  buttonText = "Comment",
  autoFocus = false,
  initialValue = "",
  parentId = null
}) {
  const [content, setContent] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setIsPosting(true);
    try {
      await onSubmit(trimmed, parentId);
      setContent("");
      setIsFocused(false);
      if (onCancel) onCancel();
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex gap-3 items-start w-full">
      <Avatar
        username={user?.fullName || user?.username || "?"}
        src={user?.imageUrl}
        size={32}
      />
      <div className="flex-1">
        <textarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          rows={isFocused ? 2 : 1}
          className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none border-b border-[#3e3e42] focus:border-[#2cbb5d] outline-none transition-all duration-200 pt-1 pb-2.5"
          style={{ lineHeight: "1.4" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handlePost();
            }
          }}
        />
        {isFocused && (
          <div className="flex justify-end gap-2 mt-1.5 animate-in fade-in duration-200">
            <button
              onClick={() => {
                setIsFocused(false);
                setContent("");
                if (onCancel) onCancel();
              }}
              className="px-4 py-1.5 text-xs text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={isPosting || !content.trim()}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-[#2cbb5d] hover:bg-[#27a352] disabled:bg-[#3e3e42] disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              {isPosting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </span>
              ) : buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Single Comment Item ---
function CommentItem({ comment, replies, userId, currentUser, problemId, onDelete, onAddReply, onToggleLike }) {
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const replyList = replies.filter((r) => r.parentId === comment._id);
  const isOwner = comment.userId === userId;
  const isLiked = comment.likes?.includes(userId);
  const isDisliked = comment.dislikes?.includes(userId);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(comment._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 group animate-in fade-in duration-300">
      <Avatar username={comment.username} src={comment.userAvatar} size={36} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[13px] font-semibold text-gray-200">{comment.username}</span>
          <span className="text-[11px] text-gray-500">{timeAgo(comment.createdAt)}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onToggleLike(comment._id)}
            className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer hover:text-white ${isLiked ? "text-[#2cbb5d]" : "text-gray-500"}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{comment.likes?.length || 0}</span>
          </button>

          <button
            className={`flex items-center gap-1 text-xs transition-colors cursor-pointer hover:text-white ${isDisliked ? "text-red-400" : "text-gray-500"}`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-colors cursor-pointer font-semibold"
          >
            Reply
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Inline Reply Input */}
        {isReplying && (
          <div className="mt-2.5 mb-1.5 animate-in slide-in-from-top-2 duration-300">
            <div className="border-t border-[#1e1e24] mb-3 w-full" />
            <CommentInput
              user={currentUser}
              placeholder="Add a reply..."
              buttonText="Reply"
              autoFocus={true}
              parentId={comment._id}
              onSubmit={onAddReply}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}

        {/* Replies toggle */}
        {replyList.length > 0 && (
          <div className="mt-1">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-[13px] font-bold text-[#3ea6ff] hover:bg-[#263850] px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {replyList.length} {replyList.length === 1 ? "reply" : "replies"}
            </button>

            {showReplies && (
              <div className="mt-3 space-y-4 pl-1">
                {replyList.map((reply) => (
                  <ReplyItem
                    key={reply._id}
                    reply={reply}
                    userId={userId}
                    currentUser={currentUser}
                    onDelete={onDelete}
                    onToggleLike={onToggleLike}
                    onAddReply={onAddReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Reply Item (simpler, no nested replies) ---
function ReplyItem({ reply, userId, currentUser, onDelete, onToggleLike, onAddReply }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const isOwner = reply.userId === userId;
  const isLiked = reply.likes?.includes(userId);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(reply._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2.5 group animate-in fade-in duration-200 w-full">
      <Avatar username={reply.username} src={reply.userAvatar} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[12px] font-semibold text-gray-200">{reply.username}</span>
          <span className="text-[11px] text-gray-500">{timeAgo(reply.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{reply.content}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <button
            onClick={() => onToggleLike(reply._id)}
            className={`flex items-center gap-1.5 text-xs cursor-pointer transition-colors hover:text-white ${isLiked ? "text-[#2cbb5d]" : "text-gray-500"}`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{reply.likes?.length || 0}</span>
          </button>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-colors cursor-pointer font-semibold"
          >
            Reply
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Inline Reply Input for nested reply */}
        {isReplying && (
          <div className="mt-2 mb-1 animate-in slide-in-from-top-2 duration-300">
            <div className="border-t border-[#1e1e24] mb-2.5 w-full" />
            <CommentInput
              user={currentUser}
              placeholder={`Reply to @${reply.username}...`}
              buttonText="Reply"
              autoFocus={true}
              initialValue={`@${reply.username} `}
              parentId={reply.parentId} // Keep everything in same thread
              onSubmit={onAddReply}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Discussion Section ---
function DiscussionSection({ problemId, problemTitle }) {
  const { userId } = useAuth();
  const { user } = useUser();

  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    if (!problemId) return;
    setIsLoading(true);
    try {
      const data = await getCommentsForProblem(problemId);
      if (data.success) {
        setComments(data.comments || []);
        setReplies(data.replies || []);
      }
    } catch (err) {
      toast.error("Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [problemId]);

  const handlePost = async (content, parentId = null) => {
    if (!userId) {
      toast.error("Please sign in to comment.");
      throw new Error("Unauthorized");
    }
    try {
      const payload = {
        content,
        parentId,
        username: user?.fullName || user?.username || "Anonymous",
        userAvatar: user?.imageUrl || "",
      };
      const data = await addComment(problemId, payload);
      if (data.success) {
        if (parentId) {
          setReplies((prev) => [...prev, data.comment]);
        } else {
          setComments((prev) => [data.comment, ...prev]);
        }
      }
    } catch (err) {
      toast.error("Failed to post comment.");
      throw err;
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const data = await deleteComment(commentId);
      if (data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setReplies((prev) => prev.filter((r) => r._id !== commentId && r.parentId !== commentId));
        toast.success("Comment deleted.");
      }
    } catch (err) {
      toast.error("Failed to delete comment.");
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!userId) {
      toast.error("Please sign in to like a comment.");
      return;
    }
    try {
      const data = await toggleLikeComment(commentId);
      if (data.success) {
        const update = (list) =>
          list.map((c) =>
            c._id === commentId ? { ...c, likes: data.likes, dislikes: data.dislikes } : c
          );
        setComments(update);
        setReplies(update);
      }
    } catch (err) {
      // Silent fail for likes
    }
  };

  const totalCount = comments.length + replies.length;

  return (
    <div className="flex flex-col h-full bg-[#1b1b1f] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1e1e24] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <MessageSquare className="w-5 h-5 text-[#2cbb5d]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Discussion</h1>
              <p className="text-[13px] text-gray-400 font-medium">
                {isLoading ? "Loading community insights..." : `Connect with others and share approach • ${totalCount} comments`}
              </p>
            </div>
          </div>
          {problemTitle && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-semibold bg-[#28282c] text-gray-400 px-2.5 py-1 rounded border border-[#3e3e42]/50">
                {problemTitle}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Comment Input */}
      <div className="px-6 py-4 border-b border-[#1e1e24] shrink-0">
        <CommentInput
          user={user}
          onSubmit={handlePost}
          placeholder="Add a comment..."
          buttonText="Comment"
        />
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#3e3e42] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-t-[#2cbb5d] border-[#2cbb5d]/20 rounded-full animate-spin" />
            <span className="text-sm">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <MessageSquare className="w-10 h-10 opacity-20" />
            <div className="text-center">
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs mt-1 opacity-60">Be the first to start the discussion!</p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={replies}
              userId={userId}
              currentUser={user}
              problemId={problemId}
              onDelete={handleDelete}
              onAddReply={handlePost}
              onToggleLike={handleToggleLike}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DiscussionSection;
