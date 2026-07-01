/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Bookmark {
  id: string;
  folderId: string;
  code: string; // e.g., "17B"
  title: string;
  url: string;
  description: string;
  date: string; // e.g., "May 18, 1966"
  tags?: string[];
}

export interface Folder {
  id: string;
  title: string;
  color: string; // hex color for folder theme
}
