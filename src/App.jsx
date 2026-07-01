import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import EmptyState from './components/EmptyState';
import MessageInput from './components/MessageInput';
import FileExplorer from './components/FileExplorer';
import DataPreviewer from './components/DataPreviewer';
import SettingsModal from './components/SettingsModal';
import ThinkingLoader from './components/ThinkingLoader';
import RightContextPanel from './components/RightContextPanel';
import CommandSearch from './components/CommandSearch';

const INITIAL_DEMO_CHATS = [
  {
    id: 'chat_cardio',
    title: 'Cardiovascular Disease Risk Prediction',
    messages: [
      {
        sender: 'user',
        text: "search dataset for topic ' real time cardiovascular Disease Risk Prediction system '"
      },
      {
        sender: 'bot',
        text: `## 🔍 Cardiovascular Disease Risk Prediction — Dataset Results

Here are the most relevant datasets from Kaggle & UCI ML Repository:

| # | Dataset | Source | Highlights |
|---|---------|--------|-----------|
| 1 | **Risk Factors for Cardiovascular Heart Disease** | Kaggle | Classic risk-factor features |
| 2 | **Cardiovascular Disease Risk Assessment Dataset** | Kaggle | Purpose-built for risk assessment modeling |
| 3 | **Heart Disease (UCI Repository)** | UCI ML Repo | Original benchmark dataset (14 clinical variables) |

\`\`\`python
import pandas as pd
df = pd.read_csv("./downloads/fedesoriano_heart-failure-prediction/heart.csv")
print(df.info())
\`\`\`

Would you like DatasetGPT to build a baseline XGBoost classification model script? 🚀`,
        actions: [
          '🔍 Searching Kaggle & UCI ML Repository for `real time cardiovascular Disease Risk Prediction system`...',
          '💡 No exact match for full phrase. Showing 6 most relatable dataset(s) for `cardiovascular disease risk`...'
        ],
        datasets: [
          {
            ref: 'thedevastator/exploring-risk-factors-for-cardiovascular-diseas',
            title: 'Risk Factors for Cardiovascular Heart Disease',
            owner: 'thedevastator',
            human_size: 'N/A',
            vote_count: 142,
            usability_rating: 1.0,
            url: 'https://www.kaggle.com/datasets/thedevastator/exploring-risk-factors-for-cardiovascular-diseas',
            tags: ['healthcare', 'health', 'heart conditions'],
            source: 'kaggle'
          },
          {
            ref: 'uci/45-heart-disease',
            title: 'Heart Disease (UCI ML Repository)',
            owner: 'UCI Machine Learning Repository',
            human_size: '12.4 KB',
            vote_count: 1240,
            usability_rating: 1.0,
            url: 'https://archive.ics.uci.edu/dataset/45/heart+disease',
            tags: ['healthcare', 'classification', 'uci-ml-repository'],
            source: 'uci'
          },
          {
            ref: 'fedesoriano/heart-failure-prediction',
            title: 'Heart Failure Prediction Dataset',
            owner: 'fedesoriano',
            human_size: '35.1 KB',
            vote_count: 512,
            usability_rating: 1.0,
            url: 'https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction',
            tags: ['healthcare', 'classification', 'heart conditions'],
            source: 'kaggle'
          }
        ],
        preview_data: {
          filename: 'heart.csv',
          file_path: '/home/manish/Documents/all projects/Kaggle dataset /downloads/fedesoriano_heart-failure-prediction/heart.csv',
          rows: 918,
          columns_count: 12
        }
      }
    ]
  },
  {
    id: 'chat_financial',
    title: 'Financial & Stock Market CSV Search',
    messages: [
      {
        sender: 'user',
        text: 'Find me financial & stock market datasets with CSV files'
      },
      {
        sender: 'bot',
        text: `## 📈 Financial & Stock Market Datasets

Here are top rated financial market datasets across Kaggle & UCI:

1. **S&P 500 Stock Data** — Daily price history for all S&P 500 companies.
2. **Bitcoin & Crypto Historical Data** — High frequency OHLCV price quotes.
3. **Bank Marketing (UCI Repository)** — Phone campaign response records.`,
        actions: ['🔍 Searching Kaggle & UCI ML Repository for `financial stock market`...'],
        datasets: [
          {
            ref: 'camnugent/sandp500',
            title: 'S&P 500 Stock Data',
            owner: 'camnugent',
            human_size: '18.4 MB',
            vote_count: 340,
            usability_rating: 1.0,
            url: 'https://www.kaggle.com/datasets/camnugent/sandp500',
            tags: ['finance', 'time-series', 'stocks'],
            source: 'kaggle'
          }
        ]
      }
    ]
  }
];

export default function App() {
  const [chats, setChats] = useState(INITIAL_DEMO_CHATS);
  const [activeChatId, setActiveChatId] = useState('chat_cardio');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingRef, setDownloadingRef] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [status, setStatus] = useState(null);
  const [refreshExplorerTrigger, setRefreshExplorerTrigger] = useState(0);

  // Model & Feature States
  const [selectedModel, setSelectedModel] = useState('ashnaai');
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const [isReasoningEnabled, setIsReasoningEnabled] = useState(false);

  const messagesEndRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  useEffect(() => {
    fetchStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, currentTab]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/settings/status');
      setStatus(res.data);
    } catch (e) {
      console.error('Error fetching settings status:', e);
    }
  };

  const handleSendMessage = async (text) => {
    setCurrentTab('chat');
    let currentChatId = activeChatId;
    let newChats = [...chats];

    if (!currentChatId || !newChats.find((c) => c.id === currentChatId)) {
      currentChatId = `chat_${Date.now()}`;
      const titleSnippet = text.length > 30 ? text.substring(0, 30) + '...' : text;
      const newChatObj = { id: currentChatId, title: titleSnippet, messages: [] };
      newChats = [newChatObj, ...newChats];
      setActiveChatId(currentChatId);
    }

    const userMsg = { sender: 'user', text };

    setChats(
      newChats.map((c) =>
        c.id === currentChatId ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );

    setIsLoading(true);

    try {
      const res = await axios.post('/api/chat', {
        message: text,
        history: messages.map((m) => ({ role: m.sender, text: m.text })),
        model: selectedModel,
        search_enabled: isSearchEnabled,
        reasoning_enabled: isReasoningEnabled
      });

      const botMsg = {
        sender: 'bot',
        text: res.data.reply,
        actions: res.data.actions,
        datasets: res.data.datasets,
        download_result: res.data.download_result,
        preview_data: res.data.preview_data
      };

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === currentChatId ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );

      if (res.data.download_result?.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setRefreshExplorerTrigger((prev) => prev + 1);
      }

      if (res.data.preview_data) {
        setSelectedPreview(res.data.preview_data);
      }
    } catch (e) {
      console.error(e);
      const errorBotMsg = {
        sender: 'bot',
        text: `⚠️ Error communicating with AI backend: ${e.response?.data?.detail || e.message}`
      };
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === currentChatId ? { ...c, messages: [...c.messages, errorBotMsg] } : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDataset = async (ref) => {
    setDownloadingRef(ref);
    const downloadPrompt = `Download and extract dataset ${ref}`;
    await handleSendMessage(downloadPrompt);
    setDownloadingRef(null);
  };

  const handleInspectFile = async (filePath) => {
    try {
      const res = await axios.post('/api/datasets/preview', { file_path: filePath });
      setSelectedPreview(res.data);
    } catch (e) {
      alert('Failed to preview dataset file: ' + (e.response?.data?.detail || e.message));
    }
  };

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const newChatObj = { id: newId, title: 'New Conversation', messages: [] };
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newId);
    setCurrentTab('chat');
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setCurrentTab('chat');
  };

  const handleDeleteChat = (id) => {
    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);
    if (activeChatId === id) {
      setActiveChatId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#080A12] text-[#F3F4F6] font-sans selection:bg-[#8B5CF6]/30 overflow-hidden">
      {/* Compact Top Navigation Bar */}
      <TopBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandSearch={() => setIsCommandSearchOpen(true)}
        currentTab={currentTab}
      />

      {/* Main Desktop Shell (3 Columns) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />

        {/* Center Main Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Main Area Content View */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {currentTab === 'dashboard' && (
              <EmptyState onSelectPrompt={handleSendMessage} />
            )}

            {currentTab === 'datasets' && (
              <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
                <FileExplorer
                  onSelectFile={handleInspectFile}
                  refreshTrigger={refreshExplorerTrigger}
                />
              </div>
            )}

            {(currentTab === 'chat' || currentTab === 'query' || currentTab === 'analysis') && (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 ? (
                  <EmptyState onSelectPrompt={handleSendMessage} />
                ) : (
                  messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      message={msg}
                      onDownloadDataset={handleDownloadDataset}
                      downloadingRef={downloadingRef}
                      onSelectPreview={setSelectedPreview}
                      onRegenerate={index === messages.length - 1 && msg.sender === 'bot' ? handleRegenerate : null}
                      onEditUserMsg={(text) => handleSendMessage(text)}
                    />
                  ))
                )}

                {isLoading && <ThinkingLoader />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Floating Message Input Command Center */}
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            isSearchEnabled={isSearchEnabled}
            onToggleSearch={() => setIsSearchEnabled(!isSearchEnabled)}
            isReasoningEnabled={isReasoningEnabled}
            onToggleReasoning={() => setIsReasoningEnabled(!isReasoningEnabled)}
          />
        </div>

        {/* Right Context Panel (Desktop / Large Screens) */}
        <RightContextPanel />
      </div>

      {/* Global Cmd+K Command Palette Modal */}
      <CommandSearch
        isOpen={isCommandSearchOpen}
        onClose={() => setIsCommandSearchOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      {/* Interactive Tabular Data Previewer Drawer Modal */}
      {selectedPreview && (
        <DataPreviewer
          profileData={selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSuccess={fetchStatus}
      />
    </div>
  );
}
