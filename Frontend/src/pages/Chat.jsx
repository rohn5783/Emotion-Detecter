import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { getChatBootstrap, getDirectMessages } from "../services/chat.api";
import { useAuth } from "../auth/Hooks/useAuth";

const ROOM_NAME = "global";

function formatTime(value) {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function Chat() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);
  const [dmMessages, setDmMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDm, setLoadingDm] = useState(false);
  const [error, setError] = useState("");
  const [roomText, setRoomText] = useState("");
  const [dmText, setDmText] = useState("");

  const socketRef = useRef(null);
  const selectedUserIdRef = useRef("");
  const roomScrollRef = useRef(null);
  const dmScrollRef = useRef(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const socketUrl = import.meta.env.VITE_SOCKET_URL || apiBaseUrl;

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((entry) => entry._id === selectedUserId) || null,
    [users, selectedUserId]
  );

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setLoading(true);
      setError("");

      try {
        const data = await getChatBootstrap();
        if (!mounted) return;
        setUsers(data.users || []);
        setRoomMessages(data.roomMessages || []);
        if (data.users?.[0]?._id) {
          setSelectedUserId((current) => current || data.users[0]._id);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Unable to load chat.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    let mounted = true;

    async function loadDmHistory() {
      setLoadingDm(true);
      try {
        const data = await getDirectMessages(selectedUserId);
        if (mounted) setDmMessages(data.messages || []);
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message || "Unable to load direct messages."
          );
        }
      } finally {
        if (mounted) setLoadingDm(false);
      }
    }

    loadDmHistory();

    return () => {
      mounted = false;
    };
  }, [selectedUserId]);

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("chat:joinRoom", { room: ROOM_NAME });

    socket.on("connect_error", () => {
      setError("Realtime chat is unavailable right now.");
    });

    socket.on("chat:roomMessage", (message) => {
      setRoomMessages((current) => [...current, message]);
    });

    socket.on("chat:dmMessage", (message) => {
      const otherUserId =
        message.from?._id === user?._id
          ? String(message.to)
          : String(message.from?._id);

      if (otherUserId === selectedUserIdRef.current) {
        setDmMessages((current) => [...current, message]);
      }
    });

    socket.on("presence:update", ({ userId, online }) => {
      setOnlineUsers((current) => ({ ...current, [userId]: online }));
    });

    return () => {
      socket.emit("chat:leaveRoom", { room: ROOM_NAME });
      socket.disconnect();
    };
  }, [socketUrl, user?._id]);

  useEffect(() => {
    if (roomScrollRef.current) {
      roomScrollRef.current.scrollTop = roomScrollRef.current.scrollHeight;
    }
  }, [roomMessages]);

  useEffect(() => {
    if (dmScrollRef.current) {
      dmScrollRef.current.scrollTop = dmScrollRef.current.scrollHeight;
    }
  }, [dmMessages]);

  function sendRoomMessage() {
    const text = roomText.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit("chat:sendRoom", { room: ROOM_NAME, text });
    setRoomText("");
  }

  function sendDirectMessage() {
    const text = dmText.trim();
    if (!text || !socketRef.current || !selectedUserId) return;

    socketRef.current.emit("chat:sendDM", {
      toUserId: selectedUserId,
      text,
    });
    setDmText("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={{ fontWeight: 900, letterSpacing: 0.6 }}>Moodify</div>
        <div style={styles.navLinks}>
          <Link style={styles.link} to="/dashboard">
            Dashboard
          </Link>
          <Link style={styles.link} to="/mood">
            Mood
          </Link>
          <Link style={styles.link} to="/journal">
            Journal
          </Link>
          <Link style={styles.link} to="/sleep">
            Sleep
          </Link>
        </div>
      </div>

      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Chat</div>
          <h1 style={styles.title}>Talk in the community or message directly</h1>
          <p style={styles.subtitle}>
            Use the global room for shared conversation, or switch to direct
            messages for one-to-one check-ins with other Moodify users.
          </p>
        </div>
        <div style={styles.heroMini}>
          <div style={styles.heroMiniLabel}>Active users</div>
          <div style={styles.heroMiniValue}>{users.length}</div>
        </div>
      </div>

      {!!error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div style={styles.panelTitle}>Direct messages</div>
          <div style={styles.userList}>
            {users.length ? (
              users.map((entry) => {
                const isActive = entry._id === selectedUserId;
                const isOnline = !!onlineUsers[entry._id];

                return (
                  <button
                    key={entry._id}
                    type="button"
                    style={{
                      ...styles.userItem,
                      ...(isActive ? styles.userItemActive : null),
                    }}
                    onClick={() => setSelectedUserId(entry._id)}
                  >
                    <div>
                      <div style={styles.userName}>{entry.username}</div>
                      <div style={styles.userEmail}>{entry.email}</div>
                    </div>
                    <span
                      style={{
                        ...styles.presenceDot,
                        background: isOnline ? "#34d399" : "#64748b",
                      }}
                    />
                  </button>
                );
              })
            ) : (
              <div style={styles.muted}>
                {loading ? "Loading users..." : "No other users found yet."}
              </div>
            )}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>Global mood room</div>
              <div style={styles.panelHint}>
                Jump into the shared conversation.
              </div>
            </div>
          </div>

          <div ref={roomScrollRef} style={styles.messageList}>
            {roomMessages.length ? (
              roomMessages.map((message) => (
                <div key={message._id} style={styles.messageCard}>
                  <div style={styles.messageMeta}>
                    <span>{message.from?.username || "Unknown"}</span>
                    <span>{formatTime(message.createdAt)}</span>
                  </div>
                  <div style={styles.messageText}>{message.text}</div>
                </div>
              ))
            ) : (
              <div style={styles.muted}>
                {loading ? "Loading room..." : "No room messages yet."}
              </div>
            )}
          </div>

          <div style={styles.composeRow}>
            <input
              value={roomText}
              onChange={(event) => setRoomText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendRoomMessage();
              }}
              placeholder="Share something with the room..."
              style={styles.composeInput}
            />
            <button type="button" style={styles.sendBtn} onClick={sendRoomMessage}>
              Send
            </button>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>
                {selectedUser
                  ? `Chat with ${selectedUser.username}`
                  : "Select a user"}
              </div>
              <div style={styles.panelHint}>
                {selectedUser
                  ? "Direct messages stay between both users."
                  : "Choose someone from the left."}
              </div>
            </div>
          </div>

          <div ref={dmScrollRef} style={styles.messageList}>
            {selectedUser ? (
              loadingDm ? (
                <div style={styles.muted}>Loading conversation...</div>
              ) : dmMessages.length ? (
                dmMessages.map((message) => {
                  const mine = message.from?._id === user?._id;

                  return (
                    <div
                      key={message._id}
                      style={{
                        ...styles.dmBubble,
                        alignSelf: mine ? "flex-end" : "flex-start",
                        background: mine
                          ? "rgba(59,130,246,0.22)"
                          : "rgba(15,23,42,0.85)",
                        borderColor: mine
                          ? "rgba(96,165,250,0.34)"
                          : "rgba(148,163,184,0.12)",
                      }}
                    >
                      <div style={styles.messageMeta}>
                        <span>
                          {mine ? "You" : message.from?.username || selectedUser.username}
                        </span>
                        <span>{formatTime(message.createdAt)}</span>
                      </div>
                      <div style={styles.messageText}>{message.text}</div>
                    </div>
                  );
                })
              ) : (
                <div style={styles.muted}>
                  No messages here yet. Start the conversation.
                </div>
              )
            ) : (
              <div style={styles.muted}>
                Select a user to load direct messages.
              </div>
            )}
          </div>

          <div style={styles.composeRow}>
            <input
              value={dmText}
              onChange={(event) => setDmText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendDirectMessage();
              }}
              placeholder={
                selectedUser
                  ? `Message ${selectedUser.username}...`
                  : "Select a user first"
              }
              style={styles.composeInput}
              disabled={!selectedUser}
            />
            <button
              type="button"
              style={styles.sendBtn}
              onClick={sendDirectMessage}
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "26px 18px 60px",
    background:
      "radial-gradient(circle at 12% 14%, rgba(34,197,94,0.16), transparent 30%), radial-gradient(circle at 85% 15%, rgba(249,115,22,0.16), transparent 28%), radial-gradient(circle at 55% 92%, rgba(59,130,246,0.12), transparent 24%), #06111e",
    color: "#e2e8f0",
  },
  nav: {
    maxWidth: 1300,
    margin: "0 auto 18px",
    padding: "12px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    borderRadius: 18,
    background: "rgba(8,15,30,0.7)",
    border: "1px solid rgba(148,163,184,0.16)",
    backdropFilter: "blur(18px)",
  },
  navLinks: { display: "flex", gap: 10, flexWrap: "wrap" },
  link: {
    color: "#dbeafe",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.1)",
    border: "1px solid rgba(96,165,250,0.22)",
  },
  hero: {
    maxWidth: 1300,
    margin: "0 auto 18px",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(220px, 0.7fr)",
    gap: 16,
    borderRadius: 28,
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(249,115,22,0.12))",
    border: "1px solid rgba(148,163,184,0.14)",
  },
  eyebrow: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    margin: "10px 0 8px",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 900,
  },
  subtitle: { margin: 0, color: "#bfd2f3", lineHeight: 1.7, maxWidth: 700 },
  heroMini: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(8,15,30,0.68)",
    border: "1px solid rgba(148,163,184,0.14)",
    alignSelf: "center",
  },
  heroMiniLabel: {
    color: "#fdba74",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroMiniValue: { marginTop: 8, fontSize: 32, fontWeight: 900 },
  errorBanner: {
    maxWidth: 1300,
    margin: "0 auto 18px",
    padding: 12,
    borderRadius: 14,
    color: "#fecaca",
    background: "rgba(127,29,29,0.36)",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  layout: {
    maxWidth: 1300,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
  },
  sidebar: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(8,15,30,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
    display: "grid",
    gap: 12,
    alignContent: "start",
  },
  panel: {
    minHeight: 620,
    padding: 18,
    borderRadius: 24,
    background: "rgba(8,15,30,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gap: 14,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  panelTitle: { fontWeight: 900, fontSize: 20 },
  panelHint: { marginTop: 4, color: "#94a3b8", fontSize: 14 },
  userList: { display: "grid", gap: 10 },
  userItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    padding: 12,
    borderRadius: 16,
    cursor: "pointer",
    textAlign: "left",
    color: "#e2e8f0",
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  userItemActive: {
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(249,115,22,0.12))",
    border: "1px solid rgba(74,222,128,0.26)",
  },
  userName: { fontWeight: 800 },
  userEmail: { marginTop: 4, fontSize: 12, color: "#94a3b8" },
  presenceDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  messageList: {
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingRight: 4,
  },
  messageCard: {
    padding: 14,
    borderRadius: 18,
    background: "rgba(2,6,23,0.46)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  dmBubble: {
    maxWidth: "88%",
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.12)",
    display: "grid",
    gap: 8,
  },
  messageMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
  },
  messageText: {
    color: "#e2e8f0",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  composeRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 10 },
  composeInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.56)",
    color: "#e2e8f0",
    outline: "none",
  },
  sendBtn: {
    padding: "12px 16px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "#06111e",
    background: "linear-gradient(135deg, #4ade80, #fb923c)",
  },
  muted: { color: "#94a3b8" },
};
