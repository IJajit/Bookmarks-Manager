/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bookmark } from '../types';
import { Save, X, RotateCcw } from 'lucide-react';

interface BookmarkFormProps {
  folderId: string;
  bookmarkToEdit: Bookmark | null;
  onSave: (bookmarkData: Omit<Bookmark, 'id' | 'folderId'> & { id?: string }) => void;
  onCancel: () => void;
  nextDefaultCode: string;
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({
  folderId,
  bookmarkToEdit,
  onSave,
  onCancel,
  nextDefaultCode
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Initialise form fields based on whether we are editing or creating
  useEffect(() => {
    if (bookmarkToEdit) {
      setCode(bookmarkToEdit.code);
      setTitle(bookmarkToEdit.title);
      setUrl(bookmarkToEdit.url);
      setDescription(bookmarkToEdit.description);
      setDate(bookmarkToEdit.date);
      setTagsInput(bookmarkToEdit.tags ? bookmarkToEdit.tags.join(', ') : '');
    } else {
      setCode(nextDefaultCode);
      setTitle('');
      setUrl('');
      setDescription('');
      
      // Default to current date in beautiful retro format: "Jul 01, 2026"
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${monthNames[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
      setDate(formattedDate);
      setTagsInput('');
    }
  }, [bookmarkToEdit, nextDefaultCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert("Title and URL are required to catalog this record!");
      return;
    }

    // Format tags from comma-separated string
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Make sure URL has a scheme
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    onSave({
      id: bookmarkToEdit?.id,
      code: code.trim() || "00X",
      title: title.trim(),
      url: finalUrl,
      description: description.trim(),
      date: date.trim(),
      tags
    });
  };

  const handleReset = () => {
    if (window.confirm("Do you want to reset this form?")) {
      setCode(bookmarkToEdit ? bookmarkToEdit.code : nextDefaultCode);
      setTitle('');
      setUrl('');
      setDescription('');
      setTagsInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full bg-white text-[#1A1A1A] shadow-2xl rounded-3xl border border-black/5 p-8 font-sans overflow-hidden"
    >
      <div>
        {/* Header Title with Vintage Style */}
        <div className="flex justify-between items-center border-b border-black/5 pb-4 mb-6 select-none">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-black/80">
            {bookmarkToEdit ? "01 / Update Entry" : "01 / Catalog Entry"}
          </span>
          <span className="text-[10px] text-black/40 font-mono tracking-wider">
            ID: {bookmarkToEdit ? bookmarkToEdit.id : "NEW_DRAFT"}
          </span>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card Serial Code */}
          <div className="md:col-span-3">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Reference Code
            </label>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)}
              placeholder="e.g., 17B"
              className="w-full font-mono font-bold text-black bg-[#FBFAF9] border border-black/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Catalog Date */}
          <div className="md:col-span-4 md:col-start-9">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Catalog Date
            </label>
            <input 
              type="text" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              placeholder="e.g., May 18, 1966"
              className="w-full font-mono text-black bg-[#FBFAF9] border border-black/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Website Title */}
          <div className="md:col-span-12">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Resource / Website Name
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., The Varnell Papers Archive"
              className="w-full font-serif font-bold text-black bg-[#FBFAF9] border border-black/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Website URL */}
          <div className="md:col-span-12">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Direct Link URL
            </label>
            <input 
              type="text" 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              placeholder="e.g., https://archival-varnell.org"
              className="w-full font-mono text-black bg-[#FBFAF9] border border-black/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Description/Notes */}
          <div className="md:col-span-12">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Observations & Curatorial Notes
            </label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Add description and observations..."
              rows={4}
              className="w-full text-black bg-[#FBFAF9] border border-black/5 rounded-xl p-4 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all leading-relaxed"
            />
          </div>

          {/* Metadata Tags */}
          <div className="md:col-span-12">
            <label className="block font-mono text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1.5">
              Index Tags (comma separated)
            </label>
            <input 
              type="text" 
              value={tagsInput} 
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g., machine, archive, design"
              className="w-full font-mono text-black bg-[#FBFAF9] border border-black/5 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

        </div>

        {/* Actions Bar */}
        <div className="mt-8 flex flex-wrap justify-between items-center gap-4 border-t border-black/5 pt-5 select-none">
          <button 
            type="button" 
            onClick={handleReset}
            className="font-mono text-[10px] uppercase tracking-wider text-black/50 hover:text-black flex items-center gap-1.5 cursor-pointer transition-colors px-3 py-2 bg-[#FBFAF9] border border-black/5 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>

          <div className="flex gap-2.5">
            <button 
              type="button" 
              onClick={onCancel}
              className="font-mono text-[10px] uppercase tracking-wider text-black/50 hover:text-black flex items-center gap-1.5 cursor-pointer transition-colors px-4 py-2 bg-[#FBFAF9] border border-black/5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button 
              type="submit" 
              className="font-mono text-[10px] uppercase tracking-widest text-white bg-black hover:bg-black/90 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 px-5 py-2.5 rounded-full font-bold shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{bookmarkToEdit ? "Save Changes" : "Create Entry"}</span>
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};
