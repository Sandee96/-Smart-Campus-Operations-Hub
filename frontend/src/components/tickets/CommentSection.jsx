import { useEffect, useState } from "react";
import { addComment, getComments } from "../../api/ticketApi";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const res = await getComments(ticketId);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleAddComment = async () => {
    if (!body.trim()) return;

    try {
      await addComment(ticketId, { body });
      setBody("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-sm text-gray-800">{comment.authorName}</p>
            <p className="text-gray-600 mt-1">{comment.body}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 text-white px-4 rounded-xl"
        >
          Add
        </button>
      </div>
    </div>
  );
}