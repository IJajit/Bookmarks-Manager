/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder as FolderIcon, 
  FolderOpen, 
  Plus, 
  Search, 
  FolderPlus, 
  List, 
  Grid, 
  Edit3, 
  Trash2, 
  Archive, 
  X, 
  Sparkles, 
  Clock, 
  Database, 
  Tag, 
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

import { Folder, Bookmark } from './types';
import { DEFAULT_FOLDERS, DEFAULT_BOOKMARKS } from './data';
import { BookmarkCard } from './components/BookmarkCard';
import { BookmarkForm } from './components/BookmarkForm';
import { NewFolderForm } from './components/NewFolderForm';
import { LoginPage } from './components/LoginPage';

export default function App() {
  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('is_logged_in') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('is_logged_in', 'true');
    console.log(`Logged in as ${email}`);
  };

  // --- STATE PERSISTENCE ---
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('archival_folders');
    return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('archival_bookmarks');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
  });

  const [activeFolderId, setActiveFolderId] = useState<string>(() => {
    const saved = localStorage.getItem('archival_active_folder_id');
    return saved || 'f6'; // Default to Varnell Collection (f6)
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Folder editing
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderTitle, setEditingFolderTitle] = useState('');

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('is_logged_in');
    setIsLoggedIn(false);
  };

  // Filtering & View Modes
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'ledger'>(() => {
    const saved = localStorage.getItem('archival_view_mode');
    return (saved as 'card' | 'ledger') || 'card';
  });

  // Time stamp state
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // --- SAVE TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('archival_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('archival_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('archival_active_folder_id', activeFolderId);
    // Reset tag filter when switching folders
    setSelectedTag(null);
    setIsAddingBookmark(false);
    setEditingBookmark(null);
  }, [activeFolderId]);

  useEffect(() => {
    localStorage.setItem('archival_view_mode', viewMode);
  }, [viewMode]);

  // Live retro clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DERIVED DATA ---
  const activeFolder = useMemo(() => {
    return folders.find(f => f.id === activeFolderId) || null;
  }, [folders, activeFolderId]);

  const handleFolderClick = (id: string) => {
    setActiveFolderId(prev => prev === id ? null : id);
  };

  // Helper to get custom layout rows matching the video's default stacking
  const folderRows = useMemo(() => {
    const defaultMapping: Record<string, number> = {
      "f1": 0, "f2": 0, "f3": 0, "f4": 0,
      "f5": 1, "f6": 1, "f7": 1, "f8": 1,
      "f9": 2, "f10": 2, "f11": 2,
      "f12": 3,
      "f13": 4, "f14": 4, "f15": 4
    };
    
    const rows: Folder[][] = [[], [], [], [], []];
    
    folders.forEach(folder => {
      const targetRow = defaultMapping[folder.id];
      if (targetRow !== undefined) {
        rows[targetRow].push(folder);
      } else {
        // Dynamic custom rows for added folders (max 4 per row)
        let lastRowIdx = rows.length - 1;
        if (rows[lastRowIdx].length >= 4) {
          rows.push([folder]);
        } else {
          rows[lastRowIdx].push(folder);
        }
      }
    });
    
    return rows.filter(row => row.length > 0);
  }, [folders]);

  // Find row containing the active folder
  const activeRowIdx = useMemo(() => {
    return folderRows.findIndex(row => row.some(f => f.id === activeFolderId));
  }, [folderRows, activeFolderId]);

  // Get active folder's bookmarks
  const activeFolderBookmarks = useMemo(() => {
    return bookmarks.filter(b => b.folderId === activeFolderId);
  }, [bookmarks, activeFolderId]);

  // Get all unique tags for the active folder's bookmarks
  const activeFolderTags = useMemo(() => {
    const tags = new Set<string>();
    activeFolderBookmarks.forEach(b => {
      if (b.tags) {
        b.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [activeFolderBookmarks]);

  // Filter bookmarks by search and tag
  const filteredBookmarks = useMemo(() => {
    return activeFolderBookmarks.filter(b => {
      // Filter by tag if selected
      if (selectedTag && (!b.tags || !b.tags.includes(selectedTag))) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const inTitle = b.title.toLowerCase().includes(query);
        const inDesc = b.description.toLowerCase().includes(query);
        const inCode = b.code.toLowerCase().includes(query);
        const inUrl = b.url.toLowerCase().includes(query);
        return inTitle || inDesc || inCode || inUrl;
      }
      return true;
    });
  }, [activeFolderBookmarks, selectedTag, searchQuery]);

  // Search matches in other folders (cross-reference)
  const crossReferenceMatches = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const otherBookmarks = bookmarks.filter(b => b.folderId !== activeFolderId);
    
    const matches = otherBookmarks.filter(b => {
      return (
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.code.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query)
      );
    });

    // Group matches by folder
    const matchesByFolder: Record<string, { folder: Folder, count: number, items: Bookmark[] }> = {};
    matches.forEach(b => {
      if (!matchesByFolder[b.folderId]) {
        const folder = folders.find(f => f.id === b.folderId);
        if (folder) {
          matchesByFolder[b.folderId] = { folder, count: 0, items: [] };
        }
      }
      if (matchesByFolder[b.folderId]) {
        matchesByFolder[b.folderId].count++;
        matchesByFolder[b.folderId].items.push(b);
      }
    });

    return Object.values(matchesByFolder);
  }, [bookmarks, folders, activeFolderId, searchQuery]);

  // Generate next default code for new bookmark card (e.g., "18D")
  const nextDefaultCode = useMemo(() => {
    if (activeFolderBookmarks.length === 0) {
      const idx = folders.findIndex(f => f.id === activeFolderId) + 1;
      return `${String(idx).padStart(2, '0')}A`;
    }
    // Get last code and increment the letter
    const lastBookmark = activeFolderBookmarks[activeFolderBookmarks.length - 1];
    const match = lastBookmark.code.match(/^(\d+)([A-Z])$/);
    if (match) {
      const num = match[1];
      const char = match[2];
      const nextChar = String.fromCharCode(char.charCodeAt(0) + 1);
      // Ensure we don't go past 'Z'
      return nextChar <= 'Z' ? `${num}${nextChar}` : `${num}A+`;
    }
    return "01A";
  }, [activeFolderBookmarks, folders, activeFolderId]);

  // --- ACTIONS ---
  
  // Folder Management
  const handleCreateFolder = (title: string, color: string) => {
    const newId = `folder_${Date.now()}`;
    const newFolder: Folder = {
      id: newId,
      title: title,
      color: color
    };
    setFolders(prev => [...prev, newFolder]);
    setActiveFolderId(newId);
    setIsAddingFolder(false);
  };

  const handleStartEditFolder = () => {
    setEditingFolderId(activeFolderId);
    setEditingFolderTitle(activeFolder.title);
  };

  const handleSaveFolderTitle = () => {
    if (!editingFolderTitle.trim()) return;
    setFolders(prev => prev.map(f => f.id === activeFolderId ? { ...f, title: editingFolderTitle.trim() } : f));
    setEditingFolderId(null);
  };

  const handleDeleteFolder = () => {
    console.log("Delete folder clicked", activeFolderId);
    const isDefault = DEFAULT_FOLDERS.some(f => f.id === activeFolderId);
    const confirmMessage = isDefault 
      ? "Warning: You are incinerating a DEFAULT catalog folder. All stored link cards within it will be lost forever. Proceed?"
      : "Are you sure you want to incinerate this custom folder envelope and all of its record cards?";
    
    if (window.confirm(confirmMessage)) {
      // Find a backup folder to set as active
      const remainingFolders = folders.filter(f => f.id !== activeFolderId);
      if (remainingFolders.length === 0) {
        alert("The cabinet requires at least one folder envelope to remain open!");
        return;
      }
      
      // Delete bookmarks in this folder
      const newBookmarks = bookmarks.filter(b => b.folderId !== activeFolderId);
      setBookmarks(newBookmarks);
      setFolders(remainingFolders);
      
      localStorage.setItem('archival_folders', JSON.stringify(remainingFolders));
      localStorage.setItem('archival_bookmarks', JSON.stringify(newBookmarks));
      
      setActiveFolderId(remainingFolders[0].id);
    }
  };

  // Bookmark Management
  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'folderId'> & { id?: string }) => {
    if (bookmarkData.id) {
      // Edit
      setBookmarks(prev => prev.map(b => b.id === bookmarkData.id ? { 
        ...b, 
        code: bookmarkData.code,
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
        date: bookmarkData.date,
        tags: bookmarkData.tags
      } : b));
      setEditingBookmark(null);
    } else {
      // Create new
      const newBookmark: Bookmark = {
        id: `bookmark_${Date.now()}`,
        folderId: activeFolderId,
        code: bookmarkData.code,
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
        date: bookmarkData.date,
        tags: bookmarkData.tags
      };
      setBookmarks(prev => [...prev, newBookmark]);
      setIsAddingBookmark(false);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleJumpToCardInFolder = (fId: string, cardId: string) => {
    setActiveFolderId(fId);
    setSearchQuery('');
    setTimeout(() => {
      const element = document.getElementById(`card-${cardId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary vintage golden visual pulse highlight
        element.classList.add('ring-4', 'ring-amber-500/80', 'scale-[1.01]');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-amber-500/80', 'scale-[1.01]');
        }, 2000);
      }
    }, 450); // wait for folder change slide-down animation to complete
  };

  // Format mechanical date stamp (e.g. "01 JUL 2026 01:27:30 LOCAL")
  const formattedMechanicalStamp = useMemo(() => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = String(currentTime.getDate()).padStart(2, '0');
    const month = monthNames[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const mins = String(currentTime.getMinutes()).padStart(2, '0');
    const secs = String(currentTime.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${year} • ${hours}:${mins}:${secs} LOCAL`;
  }, [currentTime]);

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F0F0F] text-[#E0E0E0]' : 'bg-[#FDFCFB] text-[#1A1A1A]'} px-4 py-8 sm:px-8 md:py-16 flex flex-col justify-start items-center selection:bg-white selection:text-black font-sans w-full`}>
          
          {/* Editorial Page Header & Title Bar */}
          <header className={`w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between py-6 border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'} mb-10 select-none gap-4`}>
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 ${isDarkMode ? 'bg-white' : 'bg-black'} rounded-full flex items-center justify-center`}>
                <div className={`w-3 h-3 ${isDarkMode ? 'bg-black' : 'bg-white'} rotate-45`}></div>
              </div>
              <span className={`text-xl font-bold tracking-tight uppercase font-sans ${isDarkMode ? 'text-white' : 'text-black'}`}>Folio.System</span>
            </div>
            <div className={`flex items-center space-x-6 text-xs font-mono tracking-widest uppercase ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
              <span>{formattedMechanicalStamp}</span>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`cursor-pointer ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button onClick={handleLogout} className={`cursor-pointer ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Profile</button>
            </div>
          </header>

          {/* Main Container Wrapper */}
          <div className="w-full max-w-5xl flex flex-col gap-8 relative">

        {/* --- GLOBAL SEARCH BAR & CONTROL CENTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Minimalist modern search input */}
          <div className="md:col-span-9 relative">
            <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reference index..."
              className={`w-full border rounded-full py-3 pl-11 pr-5 text-xs font-mono tracking-wider placeholder-opacity-50 uppercase focus:outline-none transition-all ${isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white placeholder-white/35 focus:border-white focus:ring-1 focus:ring-white' : 'bg-white border-black/10 text-black placeholder-black/35 focus:border-black focus:ring-1 focus:ring-black'}`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 right-4 flex items-center cursor-pointer transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* New Folder & Cabinet Actions */}
          <div className="md:col-span-3 flex gap-2 select-none justify-start">
            <button 
              onClick={() => setIsAddingFolder(prev => !prev)}
              className={`w-1/2 flex items-center justify-center gap-2 font-mono text-xs font-bold tracking-widest py-3 rounded-full shadow-sm cursor-pointer uppercase transition-all active:scale-95 border ${isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white hover:bg-neutral-800' : 'bg-white border-black/10 text-black hover:bg-neutral-200'}`}
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable New Folder Drawer Form */}
        <AnimatePresence>
          {isAddingFolder && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: -12 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: -12 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <NewFolderForm 
                onSave={handleCreateFolder} 
                onCancel={() => setIsAddingFolder(false)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEARCH CROSS-REFERENCE RESULTS (Matches in other folders) */}
        <AnimatePresence>
          {searchQuery && crossReferenceMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#FBFAF9] border border-black/10 rounded-2xl p-6 flex flex-col gap-3 shadow-sm"
            >
              <span className="font-mono text-[10px] uppercase font-bold text-black/60 flex items-center gap-1.5 tracking-widest select-none">
                <Archive className="w-3.5 h-3.5 text-black" />
                Cross-Reference Discoveries in Other Folders:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {crossReferenceMatches.map(({ folder, count, items }) => (
                  <div key={folder.id} className="flex items-center gap-1.5 bg-white border border-black/5 rounded-xl px-3 py-2 text-xs font-mono shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: folder.color }} />
                    <span className="text-black font-semibold uppercase">{folder.title}</span>
                    <span className="text-black/40 font-bold ml-1">({count} card{count > 1 ? 's' : ''})</span>
                    <div className="flex gap-1.5 ml-2 border-l border-black/10 pl-2">
                      {items.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => handleJumpToCardInFolder(folder.id, item.id)}
                          className="bg-black/5 hover:bg-black hover:text-white border border-black/5 px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer uppercase transition-all"
                          title={`Click to open folder and catalog card ${item.code}`}
                        >
                          {item.code}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 2. THE TACTILE LAYERED STACK ENGINE (Editorial Redesign) --- */}
        <div className="flex flex-col gap-0 select-none relative z-10 w-full">
          
          {/* A. UPPER TAB GRID ROWS (Beautifully styled architectural folder tabs) */}
          <div className="flex flex-col gap-1.5 pb-2">
            {folderRows.slice(0, activeRowIdx + 1).map((row, rIdx) => (
              <div 
                key={`upper-row-${rIdx}`} 
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-black/5 pb-1.5"
              >
                {row.map((folder) => {
                  const isActive = folder.id === activeFolderId;
                  
                  return (
                    <div
                      key={folder.id}
                      onClick={() => handleFolderClick(folder.id)}
                      className={`
                        relative rounded-t-2xl text-center font-mono py-2.5 px-3 cursor-pointer overflow-hidden select-none transition-all duration-300 border-t border-x
                        ${isActive 
                          ? 'bg-[#1A1A1A] border-white/10 text-white font-bold shadow-sm z-30' 
                          : 'hover:bg-neutral-800 text-white/70 border-transparent'
                        }
                      `}
                      style={{ 
                        transform: isActive ? 'translateY(1px)' : 'none',
                        zIndex: isActive ? 10 : 1,
                        backgroundColor: isActive ? '#1A1A1A' : folder.color,
                        opacity: isActive ? 1 : 0.8
                      }}
                    >
                      {/* Active / Inactive Top Color Indicator */}
                      <div 
                        className={`absolute top-0 left-0 right-0 ${isActive ? 'h-1.5' : 'h-1'}`} 
                        style={{ backgroundColor: isActive ? folder.color : 'rgba(255,255,255,0.2)' }} 
                      />
                      
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        {isActive ? (
                          <FolderOpen className="w-3.5 h-3.5 text-white shrink-0" />
                        ) : (
                          <FolderIcon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {folder.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* B. ACTIVE FOLDER SHEET BODY */}
          {activeFolder && (
            <div 
              className="w-full rounded-b-3xl rounded-t-3xl shadow-xl overflow-hidden transition-all duration-500 relative flex flex-col border"
              style={{ 
                minHeight: '28rem', 
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF', 
                borderColor: activeFolder.color 
              }}
            >
              {/* Elegant active cover accent bar */}
              <div className="h-2 w-full" style={{ backgroundColor: activeFolder.color }} />

            {/* --- ACTIVE FOLDER TOOLBAR / META CONTROLS --- */}
            <div className={`p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'} relative z-20 font-sans select-none ${isDarkMode ? 'text-white' : 'text-black'}`}>
              
              {/* Folder Header Labels & Edit Slot */}
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-3">
                  {editingFolderId === activeFolderId ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={editingFolderTitle}
                        onChange={e => setEditingFolderTitle(e.target.value)}
                        className={`border px-3 py-1 rounded-lg focus:outline-none uppercase text-sm font-serif font-bold max-w-[220px] ${isDarkMode ? 'bg-white text-[#1A1A1A] border-black/20' : 'bg-white text-[#1A1A1A] border-black/20'}`}
                        maxLength={26}
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveFolderTitle}
                        className={`font-mono font-bold px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider cursor-pointer ${isDarkMode ? 'bg-black text-white' : 'bg-black text-white'}`}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingFolderId(null)}
                        className={`px-2 py-1 rounded-lg text-[9px] cursor-pointer ${isDarkMode ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-black'}`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <h2 className={`text-3xl font-serif italic font-normal tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {activeFolder.title}
                      </h2>
                      <button 
                        onClick={handleStartEditFolder}
                        className={`p-1 cursor-pointer rounded-full transition-all ${isDarkMode ? 'text-white/30 hover:text-white/80 hover:bg-white/5' : 'text-black/30 hover:text-black/80 hover:bg-black/5'}`}
                        title="Rename folder envelope"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className={`text-[10px] uppercase tracking-[0.2em] font-mono mt-1 ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                  Stored Links: {activeFolderBookmarks.length} Elements — Last Updated: {activeFolderBookmarks.length > 0 ? activeFolderBookmarks[activeFolderBookmarks.length - 1].date : 'Oct 24'}
                </p>
              </div>

              {/* Toolbar Operations Belt */}
              <div className="flex flex-wrap items-center gap-3 select-none">
                
                {/* View switcher (Minimal round buttons) */}
                <div className={`flex items-center gap-1 border rounded-full p-1 shadow-xs ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-black/5'}`}>
                  <button 
                    onClick={() => setViewMode('card')}
                    className={`p-1.5 rounded-full cursor-pointer transition-all ${viewMode === 'card' ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')}`}
                    title="Classic Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('ledger')}
                    className={`p-1.5 rounded-full cursor-pointer transition-all ${viewMode === 'ledger' ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70')}`}
                    title="Compact Index Ledger View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tag Filter Dropdown if we have tags */}
                {activeFolderTags.length > 0 && (
                  <div className="relative group">
                    <button className="bg-white hover:bg-neutral-50 text-black border border-black/10 px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer uppercase text-[9px] font-mono font-bold tracking-widest">
                      <Tag className="w-3 h-3 text-black/40" />
                      <span>{selectedTag ? `#${selectedTag}` : "Filter Tags"}</span>
                      <ChevronDown className="w-3 h-3 text-black/30" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white border border-black/10 rounded-2xl shadow-xl py-2 hidden group-hover:block hover:block min-w-[150px] z-30">
                      <button 
                        onClick={() => setSelectedTag(null)}
                        className={`w-full text-left font-mono text-[9px] uppercase tracking-wider px-4 py-1.5 hover:bg-neutral-50 cursor-pointer ${selectedTag === null ? 'text-black font-bold bg-neutral-50' : 'text-black/60'}`}
                      >
                        [ All Records ]
                      </button>
                      {activeFolderTags.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`w-full text-left font-mono text-[9px] uppercase tracking-wider px-4 py-1.5 hover:bg-neutral-50 cursor-pointer ${selectedTag === tag ? 'text-black font-bold bg-neutral-50' : 'text-black/60'}`}
                        >
                          # {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new bookmark record to active folder */}
                <button 
                  onClick={() => {
                    setIsAddingBookmark(prev => !prev);
                    setEditingBookmark(null);
                  }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white hover:bg-neutral-700' : 'bg-white border-black/10 text-black hover:bg-neutral-100'}`}
                  title="Add New Bookmark Entry"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Delete folder envelope */}
                {folders.length > 1 && (
                  <button 
                    onClick={() => {
                      handleDeleteFolder();
                    }}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${isDarkMode ? 'bg-neutral-800 border-white/10 text-white hover:bg-neutral-700' : 'bg-white border-black/10 text-black hover:bg-neutral-100'}`}
                    title="Delete collection tab"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* --- FOLDER CONTENT INSIDE BODY (BOOKMARK LIST OR FORMS) --- */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col gap-6 relative z-10 overflow-y-auto max-h-[40rem] custom-scrollbar">
              
              {/* Expandable Bookmark Creation / Edit Form Card */}
              <AnimatePresence>
                {(isAddingBookmark || editingBookmark) && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="w-full mb-4"
                  >
                    <BookmarkForm 
                      folderId={activeFolderId}
                      bookmarkToEdit={editingBookmark}
                      nextDefaultCode={nextDefaultCode}
                      onSave={handleSaveBookmark}
                      onCancel={() => {
                        setIsAddingBookmark(false);
                        setEditingBookmark(null);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CARD CONTAINER CONTENT */}
              {filteredBookmarks.length === 0 ? (
                // EMPTY STATE CARD
                <div className="w-full bg-[#FBFAF9] rounded-3xl border border-black/5 p-16 text-center text-[#1A1A1A] select-none">
                  <HelpCircle className="w-12 h-12 text-black/20 mx-auto mb-4" />
                  <p className="text-xl font-serif italic text-black mb-2">
                    Collection Index Vacant
                  </p>
                  <p className="text-xs text-black/50 leading-relaxed max-w-sm mx-auto">
                    There are no reference cards matching your criteria inside the {activeFolder.title} folder tab. Click the '+' button above to catalog a new bookmark record.
                  </p>
                </div>
              ) : viewMode === 'card' ? (
                // 1. EDITORIAL CARD GRID
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard 
                      key={bookmark.id}
                      bookmark={bookmark}
                      onEdit={(b) => {
                        setEditingBookmark(b);
                        setIsAddingBookmark(false);
                        // Scroll to form smoothly
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      onDelete={handleDeleteBookmark}
                      highlightText={searchQuery}
                      folderColor={activeFolder.color}
                    />
                  ))}
                </div>
              ) : (
                // 2. LEDGER LIST VIEW (COMPACT TABULAR MONOSPACE SPREADSHEET)
                <div className="w-full bg-[#FBFAF9] text-[#1A1A1A] border border-black/5 shadow-md rounded-2xl p-6 overflow-x-auto font-mono text-xs">
                  <table className="w-full text-left border-collapse min-w-[650px] leading-6">
                    <thead>
                      <tr className="border-b border-black/10 text-black/40 uppercase tracking-widest text-[9px] select-none font-bold">
                        <th className="py-3 px-3 w-16">CODE</th>
                        <th className="py-3 px-3 w-44">CATALOG TITLE</th>
                        <th className="py-3 px-3">OBSERVATIONS & URL LINK</th>
                        <th className="py-3 px-3 w-32 text-right">DATE</th>
                        <th className="py-3 px-3 w-28 text-center">CONTROLS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredBookmarks.map((b) => (
                        <tr key={b.id} className="hover:bg-black/[0.02] transition-colors py-2 group">
                          {/* Code */}
                          <td className="py-3 px-3 font-bold text-black align-top select-none text-[11px]">
                            {b.code}
                          </td>
                          
                          {/* Title */}
                          <td className="py-3 px-3 font-semibold font-serif text-black text-sm align-top truncate max-w-[160px]">
                            <a href={b.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                              {b.title}
                              <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                            </a>
                          </td>

                          {/* URL + Notes */}
                          <td className="py-3 px-3 align-top">
                            <p className="text-black/75 leading-relaxed font-sans text-xs mb-1">
                              {b.description}
                            </p>
                            <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-black/50 hover:text-black hover:underline inline-flex items-center gap-1 break-all font-mono">
                              {b.url}
                            </a>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-3 text-right text-black/40 align-top select-none italic text-[11px]">
                            {b.date}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 align-top select-none text-center">
                            <div className="flex justify-center items-center gap-1.5 text-[10px]">
                              <button 
                                onClick={() => setEditingBookmark(b)}
                                className="text-black hover:bg-black hover:text-white border border-black/10 p-1.5 rounded-full cursor-pointer transition-colors"
                                title="Edit Record"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm("Delete this ledger entry?")) {
                                    handleDeleteBookmark(b.id);
                                  }
                                }}
                                className="text-red-600 hover:bg-red-500 hover:text-white border border-red-200 p-1.5 rounded-full cursor-pointer transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

          {/* C. LOWER TAB GRID ROWS (Includes all rows AFTER the active folder's row) */}
          <div className="flex flex-col gap-3 pt-4">
            {folderRows.slice(activeRowIdx + 1).map((row, rIdx) => {
              // Row index in the overall list needs offset
              const overallRowIdx = activeRowIdx + 1 + rIdx;
              return (
                <div 
                  key={`lower-row-${overallRowIdx}`} 
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/[0.02] pt-1.5"
                >
                  {row.map((folder) => {
                    const isActive = folder.id === activeFolderId;
                    return (
                      <div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.id)}
                        className={`
                          relative rounded-t-2xl text-center font-mono py-2.5 px-3 cursor-pointer overflow-hidden select-none transition-all duration-300 border-t border-x
                          ${isActive 
                            ? 'bg-[#1A1A1A] border-white/10 text-white font-bold shadow-sm z-30' 
                            : 'hover:bg-neutral-800 text-white border-transparent'
                          }
                        `}
                        style={{ 
                          backgroundColor: isActive ? '#1A1A1A' : folder.color,
                          opacity: isActive ? 1 : 0.8
                        }}
                      >
                        {/* Folder tab design accent */}
                        <div className={`absolute top-0 left-0 right-0 ${isActive ? 'h-1.5' : 'h-1'}`} style={{ backgroundColor: isActive ? folder.color : 'rgba(255,255,255,0.2)' }} />
                        
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          {isActive ? (
                            <FolderOpen className="w-3.5 h-3.5 text-white shrink-0" />
                          ) : (
                            <FolderIcon className="w-3.5 h-3.5 text-white/60 shrink-0" />
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {folder.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>

        {/* --- 3. SYSTEM STATS & COMPLIANT BRANDING --- */}
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[9px] uppercase tracking-wider select-none border-t pt-4 leading-4 mt-2 ${isDarkMode ? 'text-gray-500 border-white/[0.04]' : 'text-gray-400 border-black/[0.04]'}`}>
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1">
              <Database className={`w-3.5 h-3.5 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              TOTAL ENVELOPES: <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{folders.length}</strong>
            </span>
            <span className={isDarkMode ? 'text-gray-700' : 'text-gray-300'}>|</span>
            <span>
              TOTAL LINK CARDS: <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{bookmarks.length}</strong>
            </span>
            <span className={isDarkMode ? 'text-gray-700' : 'text-gray-300'}>|</span>
            <span>
              PERSISTENCE ENGINE: <strong className="text-amber-500/80">LOCAL_STORAGE</strong>
            </span>
          </div>

          <div className="text-center sm:text-right flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>ARCHIVE STATUS: <strong className="text-emerald-500 font-bold">● ONLINE_LEDGER</strong></span>
          </div>
        </div>

      </div>
    </div>
      )}
    </>
  );
}
