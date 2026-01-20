import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import ChatBubble from '../components/ChatBubble';
import FormInput from '../components/FormInput';
import { addMessage, markMessageAsRead } from '../redux/slices/dataSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import { sendMessage } from '../utils/mockApi';
import { formatDateTime } from '../utils/helpers';
import { FiSend } from 'react-icons/fi';

/**
 * Message Thread Page - View and compose messages
 */
const MessageThread = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.data);
  const [composing, setComposing] = useState(false);

  // Get thread messages
  const threadMessages = messages.filter(
    (m) => m.from === threadId || m.to?.includes(threadId) || m.from === user?.id || m.to?.includes(user?.id)
  );

  const validationSchema = yup.object({
    body: yup.string().required('Message cannot be empty').min(1),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setComposing(true);

    try {
      const newMessage = {
        from: user?.id,
        to: [threadId],
        subject: 'RE: Message',
        body: data.body,
        folder: 'sent',
        read: true,
        sentAt: new Date().toISOString(),
      };

      // Optimistic update
      dispatch(addMessage(newMessage));
      dispatch(
        addNotification({
          id: `NOTIF${Date.now()}`,
          title: 'Message Sent',
          message: 'Your message has been sent successfully',
          read: false,
        })
      );

      toast.success('Message sent!');
      reset();

      // Simulate reply after 3-8 seconds (30% chance)
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const replyMessage = {
            id: `MSG${Date.now()}`,
            from: threadId,
            to: [user?.id],
            subject: 'RE: Message',
            body: 'Thanks for your message. I will get back to you shortly.',
            folder: 'inbox',
            read: false,
            sentAt: new Date().toISOString(),
          };
          dispatch(addMessage(replyMessage));
          dispatch(
            addNotification({
              id: `NOTIF${Date.now()}`,
              title: 'New Message',
              message: 'You have received a new message',
              read: false,
            })
          );
          toast.info('New message received!');
        }, 3000 + Math.random() * 5000);
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setComposing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-800">Message Thread</h1>
        <p className="text-gray-600 mt-2">Conversation with {threadId}</p>
      </motion.div>

      {/* Messages */}
      <Card className="h-96 overflow-y-auto bg-beige-50">
        <div className="space-y-4">
          {threadMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.from === user?.id ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChatBubble
                message={msg.body}
                isOwn={msg.from === user?.id}
                timestamp={formatDateTime(msg.sentAt)}
              />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Composer */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              {...register('body')}
              placeholder="Type your message..."
              className="input-base w-full h-24 resize-none"
            />
            {errors.body && (
              <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={composing}
            className="flex items-center gap-2 px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50 transition"
          >
            <FiSend size={18} />
            {composing ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </Card>
    </div>
  );
};

export default MessageThread;
