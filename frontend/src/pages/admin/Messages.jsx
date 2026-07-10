import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [replyEmpty, setReplyEmpty] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  // ================= FETCH CONVERSATIONS =================
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/conversations"
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Conversation fetch error:", err);
    }
  };

  // ================= FETCH MESSAGES =================
  const fetchMessages = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/messages/${email}`
      );
      setMessages(res.data);
      setSelectedEmail(email);
    } catch (err) {
      console.error("Message fetch error:", err);
    }
  };

  // ================= SEND REPLY =================
  const sendReply = async () => {
    if (!reply.trim()) {
      setReplyEmpty(true);
      setTimeout(() => setReplyEmpty(false), 2000);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/reply",
        {
          email: selectedEmail,
          message: reply,
        }
      );

      setReply("");
      fetchMessages(selectedEmail);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  // ================= UNSELECT USER =================
  const unselectUser = () => {
    setSelectedEmail(null);
    setMessages([]);
    setReply("");
  };

  document.title = "Admin | Messages"

  // AdminNavBar handles navigation; remove per-page left button styles

  return (
    <div className="admin-page messages-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      {!selectedEmail && <h4 className="gradient">Contact - Messages</h4>}
      {!selectedEmail && (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Email ID</th>
                <th>Last message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                conversations.length === 0
                  ? (
                    <tr>
                      <td colSpan={3}>No Messages found</td>
                    </tr>
                  )
                  : (
                    conversations.map((c, index) => {
                      const email = c.email;
                      const last_message = c.last_message;
                      return <tr key={index}>
                        <td>{email}</td>
                        <td>{`${new Date(last_message).toLocaleDateString()} - ${new Date(last_message).toLocaleTimeString()}`}</td>
                        <td>
                          <button onClick={() => fetchMessages(email)}>
                            Open Chat
                          </button>
                        </td>
                      </tr>
                    })
                  )
              }
            </tbody>
          </table>
        </div>
      )}
      {/* ================= SHOW CHAT ONLY IF USER SELECTED ================= */}
      {selectedEmail && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h5>Chat with {selectedEmail}</h5>
            <button onClick={unselectUser}>Unselect User</button>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg) => (
              <div key={msg.id}
                className={`message ${msg.sender === "user" ? "user" : "admin"}`}
              >
                <div className="message-wrapper">
                  <p>{msg.message}</p>
                  <h6>
                    {new Date(msg.created_at).toLocaleString()}
                  </h6>
                </div>
              </div>
            ))}
          </div>
          <div className="custom-form horizontal" style={{
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px"
          }}>
            <div className="input-field">
              <textarea
              type="text"
              placeholder={replyEmpty ? "Message cannot be empty" : "Type your reply..."}
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                if (replyEmpty) setReplyEmpty(false);
              }}
            />
            </div>
            <button onClick={sendReply}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
