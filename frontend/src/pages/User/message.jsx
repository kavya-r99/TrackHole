import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./message.css";

function Message() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyEmpty, setReplyEmpty] = useState(false);
  const [error, setError] = useState("");
  const messageContainerRef = useRef(null);

  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("name") || "User";

  const fetchMessages = async () => {
    if (!email) {
      setError("Email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/messages/${encodeURIComponent(email)}`
      );
      setMessages(res.data || []);
      setError("");
    } catch (err) {
      console.error("Message fetch error:", err);
      setError("Unable to load conversation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) {
      setReplyEmpty(true);
      setTimeout(() => setReplyEmpty(false), 2000);
      return;
    }

    setSending(true);
    try {
      await axios.post("http://localhost:5000/api/auth/contact", {
        name,
        email,
        message: text.trim()
      });
      setText("");
      await fetchMessages();
    } catch (err) {
      console.error("Message send error:", err);
      setError("Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  document.title = `${name} | Message`;

  return (
    <div className="page message-page">
      <h2>Geo Tagging Pothole on Roads Within City</h2>
      <h4 className="gradient">Message Admin</h4>

      <div className="user-chatbox">
        <div className="user-chatbox-header">
          <h5>Conversation with Admin</h5>
        </div>

        <div className="user-chatbox-messages" ref={messageContainerRef}>
          {loading && <p className="empty-state">Loading messages...</p>}
          {!loading && error && <p className="empty-state error">{error}</p>}
          {!loading && !error && messages.length === 0 && (
            <p className="empty-state">No messages yet. Start the conversation.</p>
          )}
          {!loading && !error && messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "admin" ? "admin" : "user"}`}
            >
              <div className="message-wrapper">
                <p>{msg.message}</p>
                <h6>{new Date(msg.created_at).toLocaleString()}</h6>
              </div>
            </div>
          ))}
        </div>

        <div className="custom-form horizontal user-message-input">
          <div className="input-field">
            <textarea
              placeholder={replyEmpty ? "Message cannot be empty" : "Type your message..."}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (replyEmpty) setReplyEmpty(false);
              }}
              disabled={sending}
            />
          </div>
          <button type="button" onClick={sendMessage} disabled={sending || !email}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
