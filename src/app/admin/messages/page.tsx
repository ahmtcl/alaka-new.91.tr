"use client";

import { useEffect, useState } from "react";
import { getContactForms, markContactFormAsRead, deleteContactForm, type FirestoreContactForm } from "@/lib/firestore";

export default function MessagesPage() {
  const [messages, setMessages] = useState<FirestoreContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<FirestoreContactForm | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getContactForms();
      setMessages(data);
    } catch (error) {
      console.error("Mesajlar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markContactFormAsRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      console.error("Okundu olarak işaretlenemedi:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    
    try {
      await deleteContactForm(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Mesaj silinemedi:", error);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light mb-2 text-white">İletişim Mesajları</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400">
              {unreadCount} okunmamış mesaj
            </p>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Henüz mesaj yok</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-md ${
                !message.read ? "border-l-4 border-blue-500" : ""
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (!message.read && message.id) {
                  handleMarkAsRead(message.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{message.name}</h3>
                    {!message.read && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        YENİ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                  {message.message && (
                    <p className="text-gray-700 line-clamp-2">{message.message}</p>
                  )}
                  {message.attachmentName && (
                    <p className="text-sm text-blue-600 mt-2">
                      📎 {message.attachmentName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {message.createdAt ? new Date((message.createdAt as any).seconds * 1000).toLocaleString('tr-TR') : 'Tarih yok'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (message.id) handleDelete(message.id);
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full message */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedMessage.name}</h2>
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {selectedMessage.message && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Mesaj
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            )}

            {selectedMessage.attachmentUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Ek Dosya
                </h3>
                <a
                  href={selectedMessage.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  📎 {selectedMessage.attachmentName}
                </a>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Gönderilme: {selectedMessage.createdAt ? new Date((selectedMessage.createdAt as any).seconds * 1000).toLocaleString('tr-TR') : 'Tarih yok'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                KVKK Onayı: {selectedMessage.kvkkConsent ? '✓ Verildi' : '✗ Verilmedi'}
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Yanıtla
              </a>
              <button
                onClick={() => {
                  if (selectedMessage.id) {
                    handleDelete(selectedMessage.id);
                    setSelectedMessage(null);
                  }
                }}
                className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
