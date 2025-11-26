import React, { useState, useEffect } from 'react';
import './Meeting.scss';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../lib/socket';
import useAuthStore from '../../stores/useAuthStore';
import { getMeeting, endMeeting as endMeetingAPI } from '../../api/meetings';

/**
 * Participant representation used in the meeting UI.
 *
 * @typedef {Object} Participant
 * @property {number} id - Unique participant identifier.
 * @property {string} name - Full display name.
 * @property {string} initial - Single-character initial shown in avatar.
 */

interface Participant {
  id: number;
  name: string;
  initial: string;
}

/**
 * Meeting page component.
 *
 * Renders a grid of participant video placeholders, an optional chat panel,
 * and meeting controls (microphone, camera, hang up, chat toggle).
 *
 * Local state:
 * - isChatOpen: whether the chat panel is visible.
 * - chatMessage: current text in the chat input.
 * - messages: list of chat messages shown in the chat panel.
 * - isMicOn / isCameraOn: booleans for mic/camera toggle UI.
 *
 * No props.
 *
 * @component
 * @returns {JSX.Element} The meeting UI.
 */

const Meeting: React.FC = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const user = useAuthStore((s) => s.user);
  
  const [meeting, setMeeting] = useState<any>(null);
  console.log('Meeting data:', meeting); // Para evitar warning de variable no usada
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Cargar datos de la reunión
  useEffect(() => {
    const loadMeeting = async () => {
      if (!meetingId) {
        navigate('/dashboard');
        return;
      }

      try {
        const data = await getMeeting(meetingId);
        setMeeting(data);
      } catch (err) {
        console.error('Error loading meeting:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId, navigate]);

  const participants: Participant[] = [
    { id: 1, name: 'Valentina Sanchez', initial: 'V' },
    { id: 2, name: 'Juliana Bolaños', initial: 'J' },
    { id: 3, name: 'Juan Moreno', initial: 'J' },
    { id: 4, name: 'Gabriela Guzman', initial: 'G' },
    { id: 5, name: 'Laura Salazar', initial: 'L' },
  ];

  useEffect(() => {
    if (!meetingId) return;
    
    // conectar y unirse a la sala al montar
    socket.connect();
    socket.emit('joinRoom', meetingId, { displayName: user?.displayName, userId: (user as any)?.uid });

    const formatSenderNameFromEmail = (email?: string) => {
      if (!email) return 'Anon';
      const local = email.split('@')[0];
      // separar por . _ - y capitalizar partes
      return local
        .split(/[\._\-]/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    };

    const onReceive = (msg: { sender: string; senderId?: string; message: string; time?: string }) => {
      const now = new Date();
      const time = msg.time ?? `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // identificar propio mensaje: preferir senderId, si no está, comparar con el user local
      const isOwn =
        (msg.senderId && msg.senderId === socket.id) ||
        (!msg.senderId && (msg.sender === user?.displayName || msg.sender === user?.email));

      let displaySender: string;
      if (isOwn) {
        displaySender = 'Tú';
      } else if (msg.sender && msg.sender.includes('@')) {
        displaySender = formatSenderNameFromEmail(msg.sender);
      } else {
        displaySender = msg.sender || 'Anon';
      }

      setMessages((s) => [...s, { sender: displaySender, text: msg.message, time }]);
    };

    socket.on('receiveMessage', onReceive);

    return () => {
      socket.emit('leaveRoom', meetingId);
      socket.off('receiveMessage', onReceive);
      socket.disconnect();
    };
  }, [meetingId, user]);

  const handleEndMeeting = async () => {
    if (!meetingId) return;
    
    try {
      await endMeetingAPI(meetingId);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error ending meeting:', err);
      navigate('/dashboard');
    }
  };
  
  // Para evitar warning, la función está lista para usar cuando se implemente
  console.log('End meeting function ready:', handleEndMeeting);

  /**
   * Handle sending a chat message.
   *
   * Appends a new message to the messages array with the current time and
   * clears the input. Prevents default form submission behavior.
   *
   * @param {React.FormEvent} e - Form submit event.
   * @returns {void}
   */

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatMessage.trim();
    if (!text) return;

    // usar nombre real del usuario si está disponible; incluir senderId para que el servidor
    // lo reenvíe y podamos identificar el autor y mostrar "Tú" solo en su cliente.
    const senderName = user?.displayName ?? user?.email ?? 'Anon';
    const senderId = socket.id; // se obtiene después de socket.connect()

    // emitir al servidor (sin agregar localmente para evitar duplicados)
    socket.emit('sendMessage', { roomId: meetingId, sender: senderName, senderId, message: text });

    // No hacer append local: esperar al evento 'receiveMessage' del servidor
    setChatMessage('');
  };

  if (loading) {
    return (
      <div className="meeting-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Cargando reunión...
      </div>
    );
  }

  return (
    <div className="meeting-container">
      {/* Mostrar ID de reunión */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(42, 48, 52, 0.95)',
        padding: '1rem 2rem',
        borderRadius: '12px',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ margin: 0, color: '#a8c4c5', textAlign: 'center' }}>
          ID de reunión: <strong style={{ color: '#3ec7cd' }}>{meetingId}</strong>
        </p>
      </div>

      <div className="meeting-content">
        <div className="participants-grid">
          {participants.map((participant) => (
            <div key={participant.id} className="participant-card">
              <div className="video-placeholder">
                <div className="avatar-large">
                  <span>{participant.initial}</span>
                </div>
              </div>
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <div className="participant-status">
                  <span className="status-indicator active"></span>
                  <span className="status-text">En línea</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isChatOpen && (
          <aside className="chat-panel">
            <div className="chat-header">
              <h3>Chat de la reunión</h3>
              <button className="close-chat" onClick={() => setIsChatOpen(false)}>
                ✕
              </button>
            </div>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="no-messages">No hay mensajes aún</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender === 'Tú' ? 'own-message' : 'other-message'}`}>
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="chat-input"
              />
              <button type="submit" className="send-button">
                Enviar
              </button>
            </form>
          </aside>
        )}
      </div>

      <footer className="meeting-controls">
        <div className="controls-group">
          <button
            className={`control-button ${!isMicOn ? 'disabled' : ''}`}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            <img src={isMicOn ? "/mic.svg" : "/mic-off.svg"} alt="Micrófono" className="control-icon" />
          </button>

          <button
            className={`control-button ${!isCameraOn ? 'disabled' : ''}`}
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            <img src={isCameraOn ? "/camera.svg" : "/videocam-off-outline.svg"} alt="Cámara" className="control-icon" />
          </button>

          <button className="control-button hang-up" onClick={() => navigate('/dashboard')}>
            <img src="/phone.svg" alt="Colgar" className="control-icon" />
          </button>

          <button className="control-button" onClick={() => setIsChatOpen(!isChatOpen)}>
            <img src="/chat.svg" alt="Chat" className="control-icon" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Meeting;