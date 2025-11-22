import React, { useState } from 'react';
import './Meeting.scss';
import { useNavigate } from 'react-router-dom';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const participants: Participant[] = [
    { id: 1, name: 'Valentina Sanchez', initial: 'V' },
    { id: 2, name: 'Juliana Bolaños', initial: 'J' },
    { id: 3, name: 'Juan Moreno', initial: 'J' },
    { id: 4, name: 'Gabriela Guzman', initial: 'G' },
    { id: 5, name: 'Laura Salazar', initial: 'L' },
  ];

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
    if (chatMessage.trim()) {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setMessages([...messages, { sender: 'Tú', text: chatMessage, time }]);
      setChatMessage('');
    }
  };

  return (
    <div className="meeting-container">
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
                  <div key={idx} className="message">
                    <div className="message-header">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <div className="message-text">{msg.text}</div>
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
            <span className="control-icon">{isMicOn ? '🎤' : '🔇'}</span>
            <span className="control-label">{isMicOn ? 'Microfono' : 'Microfono'}</span>
          </button>

          <button
            className={`control-button ${!isCameraOn ? 'disabled' : ''}`}
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            <span className="control-icon">{isCameraOn ? '📹' : '📷'}</span>
            <span className="control-label">{isCameraOn ? 'Cámara' : 'Cámara'}</span>
          </button>

          <button className="control-button hang-up" onClick={() => navigate('/dashboard')}>
            <span className="control-icon">📞</span>
            <span className="control-label">Colgar</span>
          </button>

          <button className="control-button" onClick={() => setIsChatOpen(!isChatOpen)}>
            <span className="control-icon">💬</span>
            <span className="control-label">Chat</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Meeting;