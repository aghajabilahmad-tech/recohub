import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatPage from '@/pages/ChatPage';
import DashboardPage from '@/pages/DashboardPage';
import ExplorePage from '@/pages/ExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import { type ChatMessage } from '@/data/mockData';
import { supabase, type SavedRecommendation, type User } from '@/lib/supabase';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedItems, setSavedItems] = useState<SavedRecommendation[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const loadSaved = useCallback(async () => {
    const { data } = await supabase
      .from('saved_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSavedItems(data as SavedRecommendation[]);
  }, []);

  const loadUser = useCallback(async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (data) setUser(data as User);
  }, []);

  useEffect(() => {
    loadSaved();
    loadUser();
  }, [loadSaved, loadUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route
            path="/"
            element={
              <ChatPage
                messages={messages}
                setMessages={setMessages}
                onSaved={loadSaved}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <ChatPage
                messages={messages}
                setMessages={setMessages}
                onSaved={loadSaved}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<DashboardPage savedItems={savedItems} setSavedItems={setSavedItems} />}
          />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
