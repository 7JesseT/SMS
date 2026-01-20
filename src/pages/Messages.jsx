import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import { FiMail, FiMessageSquare, FiPlus, FiTrash2 } from 'react-icons/fi';
import { updateMessages, addMessage } from '../redux/slices/dataSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Messages Page - Inbox, sent, and drafts management
 */
const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [composing, setComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' });

  const folders = ['inbox', 'sent', 'drafts'];

  const folderMessages = messages.filter((m) => m.folder === activeFolder);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      toast.error('All fields are required');
      return;
    }

    const message = {
      id: `MSG${Date.now()}`,
      from: user?.id,
      to: [newMessage.to],
      subject: newMessage.subject,
      body: newMessage.body,
      folder: 'sent',
      read: true,
      sentAt: new Date().toISOString(),
    };

    dispatch(addMessage(message));
    toast.success('Message sent!');
    setNewMessage({ to: '', subject: '', body: '' });
    setComposing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setComposing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition"
        >
          <FiPlus size={20} />
          Compose
        </motion.button>
      </motion.div>

      {/* Compose Modal */}
      {composing && (
        <Card title="Compose Message" className="bg-gold-50 border-gold-300">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <input
              type="text"
              placeholder="Recipient ID"
              value={newMessage.to}
              onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
              className="input-base w-full"
            />
            <input
              type="text"
              placeholder="Subject"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              className="input-base w-full"
            />
            <textarea
              placeholder="Message body"
              value={newMessage.body}
              onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
              className="input-base w-full h-32 resize-none"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition"
              >
                Send
              </motion.button>
              <button
                type="button"
                onClick={() => setComposing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Folder Tabs */}
      <div className="flex gap-2 border-b border-beige-200">
        {folders.map((folder) => (
          <motion.button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`px-4 py-3 font-medium transition capitalize ${
              activeFolder === folder
                ? 'border-b-2 border-gold-500 text-gold-700'
                : 'text-gray-600 hover:text-gold-600'
            }`}
          >
            {folder}
            <span className="ml-2 text-xs px-2 py-1 bg-beige-200 rounded-full">
              {messages.filter((m) => m.folder === folder).length}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {folderMessages.length === 0 ? (
          <Card className="text-center py-12">
            <FiFolderOpen size={48} className="mx-auto text-gold-300 mb-4" />
            <p className="text-gray-600">No messages in {activeFolder}</p>
          </Card>
        ) : (
          folderMessages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/messages/${msg.from}`)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  msg.read
                    ? 'bg-white border-beige-200 hover:border-gold-500'
                    : 'bg-gold-100/30 border-gold-300 hover:border-gold-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 truncate">{msg.subject}</p>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{msg.body}</p>
                    <p className="text-xs text-gray-500 mt-2">From: {msg.from}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
