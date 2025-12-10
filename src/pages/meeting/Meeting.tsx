import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Meeting.scss';
import { useNavigate, useParams } from 'react-router-dom';
import socket, { chatSocket } from '../../lib/socket';
import useAuthStore from '../../stores/useAuthStore';
import { getMeeting, endMeeting as endMeetingAPI } from '../../api/meetings';
import Peer from 'peerjs';


const API_HOST = (import.meta.env.VITE_API_HOST as string) || 'http://localhost:4000';
const PEER_HOST = new URL(API_HOST).hostname;
const PEER_SECURE = API_HOST.startsWith('https://');
const PEER_PORT = PEER_SECURE ? 443 : (new URL(API_HOST).port ? Number(new URL(API_HOST).port) : 80);

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

interface Participant {
  id: number;
  name: string;
  initial: string;
}

interface ParticipantWithMedia extends Participant {
  socketId?: string;
  userId?: string;
  peerId?: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

const Meeting: React.FC = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const user = useAuthStore((s) => s.user);

  const [meeting, setMeeting] = useState<any>(null);
  console.log('Meeting data:', meeting);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const remoteStreamsRef = useRef<Record<string, MediaStream>>({});

  const [, forceRemoteRender] = useState(0);

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

  const [participants, setParticipants] = useState<ParticipantWithMedia[]>([]);

  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<any | null>(null);
  const remoteAudioEls = useRef<Record<string, HTMLAudioElement>>({});
  const remoteVideoEls = useRef<Record<string, HTMLVideoElement>>({});

  useEffect(() => {
    if (!meetingId) return;

    const emitJoinIfReady = () => {
      const peerIdNow = (window as any).__PEER_ID__ || null;
      const userIdNow = (user as any)?.uid || (user as any)?.id || user?.email || 'anonymous';
      if (socket.connected && peerIdNow) {
        console.log('Emitiendo join-meeting (ready)', { meetingId, userId: userIdNow, peerId: peerIdNow });
        socket.emit('join-meeting', { meetingId, userId: userIdNow, peerId: peerIdNow });
      }
    };

    const attachRemoteStream = (peerId: string, stream: MediaStream) => {
      remoteStreamsRef.current[peerId] = stream;
      forceRemoteRender(x => x + 1);
      console.log('attachRemoteStream', peerId, stream);
    };

    // Inicialización ÚNICA de PeerJS
    const initPeer = (attempt = 0) => {
      try {
        if (peerRef.current) return;
        console.log('Inicializando PeerJS (attempt)', attempt);
        
        peerRef.current = new Peer({
          host: PEER_HOST,
          port: PEER_PORT,
          path: '/peerjs',
          secure: PEER_SECURE,
          config: rtcConfig,
          debug: 2
        } as any);

        peerRef.current.on('open', (peerId: string) => {
          (window as any).__PEER_ID__ = peerId;
          console.log('Peer open id', peerId);
          (window as any).__PEER_REF__ = peerRef.current;
          (window as any).__REMOTE_AUDIO_ELES__ = remoteAudioEls;
          (window as any).__LOCAL_STREAM_REF__ = localStreamRef;
          emitJoinIfReady();
        });

        peerRef.current.on('error', (err: any) => {
          console.error('PeerJS error', err);
          try { peerRef.current?.destroy?.(); } catch { }
          peerRef.current = null;
          
          if (attempt < 5) {
            setTimeout(() => initPeer(attempt + 1), 1000 * (attempt + 1));
            return;
          }
          
          try {
            console.warn('PeerJS fallback: creating default Peer() (cloud) after repeated failures');
            const fallback = new Peer();
            fallback.on('open', (id: string) => {
              (window as any).__PEER_ID__ = id;
              peerRef.current = fallback;
              console.log('Fallback Peer open id', id);
              emitJoinIfReady();
            });
            fallback.on('error', (e: any) => console.error('Fallback Peer error', e));
            fallback.on('call', (call: any) => {
              try { call.answer(localStreamRef.current || undefined); } catch { try { call.answer(); } catch { } }
              call.on('stream', (remoteStream: MediaStream) => attachRemoteStream(call.peer, remoteStream));
            });
          } catch (fallbackErr) {
            console.error('Fallback Peer creation failed', fallbackErr);
          }
        });

        peerRef.current.on('call', (call: any) => {
          console.log('Peer incoming call from', call.peer);
          try { call.answer(localStreamRef.current || undefined); } catch (e) { try { call.answer(); } catch { } }
          call.on('stream', (remoteStream: MediaStream) => attachRemoteStream(call.peer, remoteStream));
        });
      } catch (err) {
        console.error('initPeer failed', err);
        peerRef.current = null;
        if (attempt < 5) setTimeout(() => initPeer(attempt + 1), 1000 * (attempt + 1));
      }
    };

    initPeer();

    const onConnect = () => {
      console.log('Socket connected', socket.id);
      emitJoinIfReady();
    };

    socket.connect();
    socket.once('connect', onConnect);
    socket.on('connect_error', (err: any) => console.error('Socket connect_error', err));

    const onExistingPeers = (peersList: Array<any>) => {
      setParticipants(prev => {
        const copy = [...prev];
        peersList.forEach(p => {
          const idx = copy.findIndex(x => x.userId === p.userId || x.peerId === p.peerId || x.socketId === p.socketId);
          if (idx >= 0) {
            copy[idx] = {
              ...copy[idx],
              socketId: p.socketId,
              userId: p.userId,
              peerId: p.peerId,
              audioEnabled: p.mediaEnabled?.audio ?? true,
              videoEnabled: p.mediaEnabled?.video ?? true
            };
          } else {
            copy.push({
              id: Date.now() + Math.floor(Math.random() * 1000),
              name: p.userId || 'Invitado',
              initial: (p.userId ? String(p.userId).charAt(0).toUpperCase() : 'U'),
              socketId: p.socketId,
              userId: p.userId,
              peerId: p.peerId,
              audioEnabled: p.mediaEnabled?.audio ?? true,
              videoEnabled: p.mediaEnabled?.video ?? true
            });
          }
        });
        return copy;
      });

      if (localStreamRef.current && peerRef.current) {
        peersList.forEach((p) => {
          if (p.peerId && p.peerId !== (window as any).__PEER_ID__) {
            try {
              const call = peerRef.current.call(p.peerId, localStreamRef.current);
              call.on('stream', (remoteStream: MediaStream) => attachRemoteStream(p.peerId, remoteStream));
            } catch (err) {
              console.warn('call error to existing peer', p.peerId, err);
            }
          }
        });
      }
    };

    const onUserJoined = (data: any) => {
      setParticipants(prev => {
        const exists = prev.some(p => p.socketId === data.socketId || p.userId === data.userId || p.peerId === data.peerId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: Date.now(),
            name: data.userId || 'Invitado',
            initial: (data.userId ? String(data.userId).charAt(0).toUpperCase() : 'U'),
            socketId: data.socketId,
            userId: data.userId,
            peerId: data.peerId,
            audioEnabled: true,
            videoEnabled: true
          }
        ];
      });

      if (localStreamRef.current && data.peerId && peerRef.current && data.peerId !== (window as any).__PEER_ID__) {
        try {
          const call = peerRef.current.call(data.peerId, localStreamRef.current);
          call.on('stream', (remoteStream: MediaStream) => attachRemoteStream(data.peerId, remoteStream));
        } catch (err) {
          console.warn('call error to new peer', data.peerId, err);
        }
      }
    };

    const onPeerAudioToggle = (payload: { socketId: string; userId?: string; audioEnabled: boolean }) => {
      setParticipants(prev => prev.map(p => (p.socketId === payload.socketId || p.userId === payload.userId) ? { ...p, audioEnabled: payload.audioEnabled } : p));
    };

    const onPeerVideoToggle = (payload: { socketId: string; userId?: string; videoEnabled: boolean }) => {
      setParticipants(prev => prev.map(p => (p.socketId === payload.socketId || p.userId === payload.userId) ? { ...p, videoEnabled: payload.videoEnabled } : p));
    };

    const onUserLeft = (payload: { socketId: string; userId?: string; peerId?: string }) => {
      setParticipants(prev => prev.filter(p => p.socketId !== payload.socketId));
      delete remoteStreamsRef.current[payload.peerId || payload.socketId || ''];
      forceRemoteRender(x => x + 1);
    };

    const onReceive = (msg: { sender: string; senderId?: string; message: string; time?: string }) => {
      const now = new Date();
      const time = msg.time ?? `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const isOwn =
        (msg.senderId && msg.senderId === socket.id) ||
        (!msg.senderId && (msg.sender === user?.displayName || msg.sender === user?.email));
      let displaySender: string;
      if (isOwn) displaySender = 'Tú';
      else if (msg.sender && msg.sender.includes('@')) {
        const local = msg.sender.split('@')[0];
        displaySender = local.split(/[\._\-]/).map((p: any) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      } else displaySender = msg.sender || 'Anon';
      setMessages((s) => [...s, { sender: displaySender, text: msg.message, time }]);
      setTimeout(() => { if (chatMessagesRef.current) chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight; }, 50);
    };

    socket.on('existing-peers', onExistingPeers);
    socket.on('user-joined', onUserJoined);
    socket.on('peer-audio-toggle', onPeerAudioToggle);
    socket.on('peer-video-toggle', onPeerVideoToggle);
    socket.on('user-left', onUserLeft);
    socket.on('receiveMessage', onReceive);

    chatSocket.connect();
    const chatOnConnect = () => {
      console.log('Chat socket connected, joining room', meetingId, 'socketId=', chatSocket.id);
      chatSocket.emit('joinRoom', meetingId);
    };
    chatSocket.once('connect', chatOnConnect);
    chatSocket.on('connect_error', (err: any) => console.error('Chat socket connect_error', err));
    chatSocket.on('receiveMessage', onReceive);

    return () => {
      try { socket.emit('leaveRoom', meetingId); } catch { }
      socket.off('existing-peers', onExistingPeers);
      socket.off('user-joined', onUserJoined);
      socket.off('peer-audio-toggle', onPeerAudioToggle);
      socket.off('peer-video-toggle', onPeerVideoToggle);
      socket.off('user-left', onUserLeft);
      socket.off('receiveMessage', onReceive);
      try { chatSocket.emit('leaveRoom', meetingId); } catch { }
      chatSocket.off('receiveMessage', onReceive);
      chatSocket.off('connect', chatOnConnect);
      chatSocket.off('connect_error');
      socket.off('connect', onConnect);
      socket.off('connect_error');
      socket.disconnect();
      chatSocket.disconnect();
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

  console.log('End meeting function ready:', handleEndMeeting);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatMessage.trim();
    if (!text) return;

    const senderName = user?.displayName ?? user?.email ?? 'Anon';
    const senderId = socket.id;

    chatSocket.emit('sendMessage', { roomId: meetingId, sender: senderName, senderId, message: text });
    setChatMessage('');
  };

  const toggleMic = useCallback(() => {
    const enabling = !isMicOn;
    (async () => {
      if (enabling) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const combinedStream = new MediaStream();
          audioStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

          if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => combinedStream.addTrack(track));
          }

          localStreamRef.current = combinedStream;
          if (isCameraOn) {
            setLocalVideoStream(combinedStream);
          }
          setIsMicOn(true);

          const peersToCall = participants.filter(p => p.peerId && p.peerId !== (window as any).__PEER_ID__);
          peersToCall.forEach(p => {
            try {
              const call = peerRef.current.call(p.peerId, combinedStream);
              call.on('stream', (remoteStream: MediaStream) => {
                remoteStreamsRef.current[p.peerId!] = remoteStream;
                forceRemoteRender(x => x + 1);
              });
            } catch (err) {
              console.warn('call error', p.peerId, err);
            }
          });
        } catch (err) {
          console.warn('Microphone access denied or error:', err);
          setIsMicOn(false);
          return;
        }
      } else {
        localStreamRef.current?.getAudioTracks().forEach(t => t.enabled = false);
        setIsMicOn(false);
      }
      try { socket.emit('toggle-audio', { enabled: enabling }); } catch (err) { console.warn('socket not connected', err); }
    })();
  }, [isMicOn, isCameraOn, participants]);

  const toggleCamera = useCallback(() => {
    const enabling = !isCameraOn;
    (async () => {
      if (enabling) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const combinedStream = new MediaStream();

          if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => combinedStream.addTrack(track));
          }

          videoStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

          localStreamRef.current = combinedStream;
          setLocalVideoStream(combinedStream);
          setIsCameraOn(true);

          const peersToCall = participants.filter(p => p.peerId && p.peerId !== (window as any).__PEER_ID__);
          peersToCall.forEach(p => {
            try {
              const call = peerRef.current.call(p.peerId, combinedStream);
              call.on('stream', (remoteStream: MediaStream) => {
                console.log('Received stream back from', p.peerId);
                remoteStreamsRef.current[p.peerId!] = remoteStream;
                forceRemoteRender(x => x + 1);
              });
            } catch (err) {
              console.warn('call error for video', p.peerId, err);
            }
          });
        } catch (err) {
          console.warn('Camera access denied or error:', err);
          setIsCameraOn(false);
          setLocalVideoStream(null);
          return;
        }
      } else {
        localStreamRef.current?.getVideoTracks().forEach(t => {
          t.stop();
          localStreamRef.current?.removeTrack(t);
        });
        setIsCameraOn(false);
        setLocalVideoStream(null);
      }
      try { socket.emit('toggle-video', { enabled: enabling }); } catch (err) { console.warn('socket not connected', err); }
    })();
  }, [isCameraOn, participants]);

  useEffect(() => {
    return () => {
      try { peerRef.current?.destroy?.(); } catch { }
      Object.values(remoteAudioEls.current).forEach(a => { try { a.pause(); a.srcObject = null; a.remove(); } catch { } });
      Object.values(remoteVideoEls.current).forEach(v => { try { v.pause(); v.srcObject = null; v.remove(); } catch { } });
      remoteStreamsRef.current = {};
      setLocalVideoStream(null);
      remoteAudioEls.current = {};
      remoteVideoEls.current = {};
      try { localStreamRef.current?.getTracks().forEach(t => t.stop()); } catch { }
      localStreamRef.current = null;
    };
  }, []);

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
      {/* Barra superior con ID de reunión */}
      <div
        className="meeting-header-bar"
        role="status"
        aria-label={`ID de reunión: ${meetingId}`}
      >
        <p>
          ID de reunión: <strong>{meetingId}</strong>
        </p>
      </div>

      <div className="meeting-content">
        <div className="participants-grid" role="region" aria-label="Participantes">
          {/* Participante local (tú) */}
          <div
            className="participant-card local-participant"
            tabIndex={0}
            aria-label={`Tú (${user?.displayName || user?.email || 'Usuario'}). ${isMicOn ? 'Micrófono activado' : 'Silenciado'}.`}
          >
            <div className="video-wrapper">
              {localVideoStream ? (
                <video
                  className="video-feed"
                  ref={(el) => {
                    if (el && localVideoStream && el.srcObject !== localVideoStream) {
                      el.srcObject = localVideoStream;
                      el.muted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="avatar-large" aria-hidden="true">
                  <span>
                    {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="participant-info">
              <span className="participant-name">Tú ({user?.displayName || user?.email || 'Usuario'})</span>
              <div className="participant-status">
                <span className={`status-indicator ${isMicOn ? 'active' : 'muted'}`} aria-hidden="true"></span>
                <span className="status-text">{isMicOn ? 'Micrófono activo' : 'Silenciado'}</span>
              </div>
            </div>
          </div>

          {/* Otros participantes */}
          {participants.map((participant) => {
            const stream = participant.peerId
              ? remoteStreamsRef.current[participant.peerId]
              : undefined;

            return (
              <div
                key={participant.id}
                className="participant-card"
                tabIndex={0}
                aria-label={`${participant.name}. Estado: ${participant.audioEnabled ? 'mic activado' : 'silenciado'}.`}
              >
                <div className="video-wrapper">
                  {stream ? (
                    <video
                      className="video-feed"
                      ref={(el) => {
                        if (el && stream && el.srcObject !== stream) {
                          el.srcObject = stream;
                          el.play().catch(() => { });
                        }
                      }}
                      autoPlay
                      playsInline
                      muted={false}
                    />
                  ) : (
                    <div className="avatar-large" aria-hidden="true">
                      <span>{participant.initial}</span>
                    </div>
                  )}
                </div>

                <div className="participant-info">
                  <span className="participant-name">{participant.name}</span>
                  <div className="participant-status">
                    <span className={`status-indicator ${participant.audioEnabled ? 'active' : 'muted'}`} aria-hidden="true"></span>
                    <span className="status-text">{participant.audioEnabled ? 'En línea' : 'Silenciado'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isChatOpen && (
          <aside className="chat-panel" role="region" aria-label="Chat de la reunión">
            <div className="chat-header">
              <h3 id="chat-title">Chat de la reunión</h3>
              <button
                className="close-chat"
                onClick={() => setIsChatOpen(false)}
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
            <div
              className="chat-messages"
              ref={chatMessagesRef}
              role="log"
              aria-live="polite"
              aria-atomic="false"
              aria-labelledby="chat-title"
            >
              {messages.length === 0 ? (
                <div className="no-messages">No hay mensajes aún</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.sender === 'Tú' ? 'own-message' : 'other-message'}`}
                    role="article"
                    aria-label={`${msg.sender}: ${msg.text}`}
                    tabIndex={-1}
                  >
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time" aria-hidden="true">{msg.time}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage} aria-label="Formulario de envío de mensaje">
              <input
                id="chat-input"
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="chat-input"
                aria-label="Mensaje de chat"
              />
              <button type="submit" className="send-button" aria-label="Enviar mensaje">
                Enviar
              </button>
            </form>
          </aside>
        )}
      </div>

      <footer className="meeting-controls" role="contentinfo" aria-label="Controles de la reunión">
        <div className="controls-group">
          <button
            className={`control-button ${!isMicOn ? 'disabled' : ''}`}
            onClick={toggleMic}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMic(); } }}
            aria-pressed={isMicOn}
            aria-label={isMicOn ? 'Desactivar micrófono' : 'Activar micrófono'}
          >
            <img src={isMicOn ? "/mic.svg" : "/mic-off.svg"} alt="Micrófono" className="control-icon" />
          </button>

          <button
            className={`control-button ${!isCameraOn ? 'disabled' : ''}`}
            onClick={toggleCamera}
            aria-pressed={isCameraOn}
            aria-label={isCameraOn ? 'Desactivar cámara' : 'Activar cámara'}
          >
            <img src={isCameraOn ? "/camera.svg" : "/videocam-off-outline.svg"} alt="Cámara" className="control-icon" />
          </button>

          <button className="control-button hang-up" onClick={() => navigate('/dashboard')} aria-label="Colgar y salir de la reunión">
            <img src="/phone.svg" alt="Colgar" className="control-icon" />
          </button>

          <button className="control-button" onClick={() => setIsChatOpen(!isChatOpen)} aria-expanded={isChatOpen} aria-controls="chat-input" aria-label={isChatOpen ? 'Cerrar chat' : 'Abrir chat'}>
            <img src="/chat.svg" alt="Chat" className="control-icon" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Meeting;