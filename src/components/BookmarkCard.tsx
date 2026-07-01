/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark } from '../types';
import { ExternalLink, Edit2, Trash2, Calendar, Tag, Globe, Check } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (b: Bookmark) => void;
  onDelete: (id: string) => void;
  highlightText: string;
  folderColor?: string;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onEdit,
  onDelete,
  highlightText,
  folderColor
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight matching text
  const renderHighlighted = (text: string) => {
    if (!highlightText) return text;
    const parts = text.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlightText.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-black px-0.5 rounded font-bold">{part}</mark> 
        : part
    );
  };

  // Get initial letter of the bookmark title
  const initialLetter = bookmark.title ? bookmark.title.charAt(0).toUpperCase() : '?';

  return (
    <div 
      id={`card-${bookmark.id}`}
      className="group p-6 border border-black/5 rounded-3xl bg-[#FBFAF9] text-[#1A1A1A] transition-all duration-300 flex flex-col justify-between min-h-[250px]"
      style={{
        '--hover-bg': folderColor || '#000000',
      } as React.CSSProperties}
      className={`group p-6 border border-black/5 rounded-3xl bg-[#FBFAF9] text-[#1A1A1A] hover:bg-[var(--hover-bg)] hover:text-white hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[250px]`}
    >
      <div>
        {/* Top Emblem Row */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 bg-white text-[#1A1A1A] rounded-2xl shadow-sm flex items-center justify-center text-xl font-serif font-bold group-hover:scale-105 transition-transform duration-300">
            {initialLetter}
          </div>
          <div className="flex flex-col items-end gap-1 font-mono text-[9px] uppercase tracking-wider text-black/50 group-hover:text-white/60">
            <span className="font-bold text-black group-hover:text-white">{bookmark.code}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 opacity-60" />
              {bookmark.date}
            </span>
          </div>
        </div>

        {/* Catalog Title */}
        <h3 className="text-xl font-bold font-serif mb-2 leading-tight tracking-tight group-hover:text-white transition-colors">
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 decoration-1 inline-flex items-center gap-1.5"
          >
            {renderHighlighted(bookmark.title)}
            <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-white transition-all stroke-[2]" />
          </a>
        </h3>

        {/* Website Stamp URL */}
        <div className="text-[11px] font-mono opacity-50 hover:opacity-100 truncate mb-4 max-w-full">
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            <Globe className="w-3 h-3 opacity-70" />
            <span className="underline decoration-dotted">{bookmark.url}</span>
          </a>
        </div>

        {/* Archival Description */}
        <p className="text-xs opacity-75 line-clamp-3 mb-5 leading-relaxed font-sans font-light">
          {renderHighlighted(bookmark.description)}
        </p>
      </div>

      <div>
        {/* Metadata Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-5">
            {bookmark.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="font-mono text-[9px] uppercase tracking-widest text-black/40 group-hover:text-white/50 bg-black/[0.03] group-hover:bg-white/10 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Custom Actions (Elegantly tucked away at bottom) */}
        <div className="flex justify-between items-center pt-3 border-t border-black/5 group-hover:border-white/10 text-[10px] font-mono select-none">
          <button 
            onClick={handleCopyLink}
            className="text-black/50 group-hover:text-white/70 hover:!text-white transition-colors flex items-center gap-1 cursor-pointer font-medium uppercase tracking-wider"
          >
            {copied ? (
              <span className="text-emerald-600 group-hover:text-emerald-200 font-bold">[ COPIED ]</span>
            ) : (
              <span>[ Copy Link ]</span>
            )}
          </button>

          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(bookmark)}
              className="text-black/50 group-hover:text-white/70 hover:!text-white transition-colors flex items-center gap-1 cursor-pointer font-medium uppercase tracking-wider"
              title="Edit Bookmark Data"
            >
              <Edit2 className="w-3 h-3 opacity-60" />
              <span>Edit</span>
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to remove this catalog entry?")) {
                  onDelete(bookmark.id);
                }
              }}
              className="text-red-700/60 group-hover:text-red-200/80 hover:!text-red-200 transition-colors flex items-center gap-1 cursor-pointer font-medium uppercase tracking-wider"
              title="Delete Bookmark Entry"
            >
              <Trash2 className="w-3 h-3 opacity-60" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
