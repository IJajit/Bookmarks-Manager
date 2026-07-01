/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RETRO_COLORS } from '../data';
import { FolderPlus, X, Check } from 'lucide-react';

interface NewFolderFormProps {
  onSave: (title: string, color: string) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const NewFolderForm: React.FC<NewFolderFormProps> = ({
  onSave,
  onCancel,
  isDarkMode
}) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [selectedColor, setSelectedColor] = useState(RETRO_COLORS[0].hex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a folder title!");
      return;
    }
    onSave(title.trim(), selectedColor);
    setTitle('');
    setTags('');
  };

  return (
    <div className={`w-full border rounded-3xl p-8 shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: selectedColor }} />
      
      <div className={`flex justify-between items-center mb-6 select-none pb-3 border-b ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <h3 className={`text-xs font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <FolderPlus className={`w-4 h-4 opacity-80 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span>New Collection Tab</span>
        </h3>
        <button 
          type="button"
          onClick={onCancel}
          className={`${isDarkMode ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-black/50 hover:text-black hover:bg-black/10'} cursor-pointer transition-colors p-1 rounded-full`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
        {/* Folder Title */}
        <div>
          <label className={`block uppercase font-mono text-[9px] tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
            Collection Name:
          </label>
          <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={`w-full border rounded-xl py-3 px-4 text-sm uppercase tracking-wider font-medium focus:outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white' : 'bg-black/5 border-black/10 text-black focus:border-black focus:ring-1 focus:ring-black'}`}
            maxLength={26}
            required
          />
        </div>
        
        {/* Tags */}
        <div>
          <label className={`block uppercase font-mono text-[9px] tracking-[0.2em] mb-2 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
            Tags (comma separated):
          </label>
          <input 
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className={`w-full border rounded-xl py-3 px-4 text-sm uppercase tracking-wider font-medium focus:outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-white focus:ring-1 focus:ring-white' : 'bg-black/5 border-black/10 text-black focus:border-black focus:ring-1 focus:ring-black'}`}
          />
        </div>

        {/* Vintage Colors Grid */}
        <div>
          <label className={`block uppercase font-mono text-[9px] tracking-[0.2em] mb-3 ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
            Cover Accent Color:
          </label>
          <div className="grid grid-cols-6 gap-2">
            {RETRO_COLORS.slice(0, 6).map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setSelectedColor(color.hex)}
                className={`group relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-md border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {selectedColor === color.hex && (
                  <div className={`rounded-full p-1 border ${isDarkMode ? 'bg-black/50 border-white/80' : 'bg-white/50 border-black/80'}`}>
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  </div>
                )}
                {/* Tooltip */}
                <span className={`pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] px-2 py-0.5 rounded whitespace-nowrap z-20 font-mono uppercase tracking-wider ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex justify-end gap-3 pt-4 border-t select-none font-mono text-[10px] ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`uppercase tracking-wider cursor-pointer transition-colors px-4 py-2 border rounded-full ${isDarkMode ? 'text-white/50 hover:text-white border-white/10 hover:bg-white/5' : 'text-black/50 hover:text-black border-black/10 hover:bg-black/5'}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`uppercase tracking-widest cursor-pointer font-bold transition-all hover:scale-[1.02] px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md ${isDarkMode ? 'text-black bg-white hover:bg-white/95' : 'text-black bg-white hover:bg-neutral-100 border border-black/10'}`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Tab</span>
          </button>
        </div>
      </form>
    </div>
  );
};
