'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { db, ContactMessage } from 'shared';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[];
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus === 'read') return;
    try {
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8">Loading messages...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Contact Messages</h1>
      
      {messages.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No messages found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className={msg.status === 'unread' ? 'bg-blue-50/30' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      msg.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{msg.firstName} {msg.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={msg.message}>
                      {msg.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {msg.status === 'unread' && (
                      <button 
                        onClick={() => markAsRead(msg.id!, msg.status)}
                        className="text-brand-accent hover:text-brand-dark font-bold"
                      >
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
