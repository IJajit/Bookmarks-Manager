/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Folder, Bookmark } from './types';

export const DEFAULT_FOLDERS: Folder[] = [
  { id: "f1", title: "Lexical Interruptions", color: "#8B1E4F" }, // Burgundy
  { id: "f2", title: "Concord Variants", color: "#C83E2D" }, // Red-orange
  { id: "f3", title: "Ink Displacement", color: "#4CA1CD" }, // Sky blue
  { id: "f4", title: "Referent Ghosts", color: "#593A80" }, // Purple
  { id: "f5", title: "Unanchored Statements", color: "#298F87" }, // Teal
  { id: "f6", title: "Varnell Collection", color: "#137834" }, // Green
  { id: "f7", title: "Peripheral Entry", color: "#1A7BB0" }, // Blue-cyan
  { id: "f8", title: "Subject Drift", color: "#702A6B" }, // Plum
  { id: "f9", title: "Duplicated Silence", color: "#C4271A" }, // Rich red
  { id: "f10", title: "Margin Events 1", color: "#8B5A2B" }, // Gold-brown
  { id: "f11", title: "Margin Events 2", color: "#7D7F1E" }, // Olive green
  { id: "f12", title: "Reverse Index", color: "#1A3B8B" }, // Deep blue
  { id: "f13", title: "Obscured Provenance", color: "#4B539B" }, // Slate-purple
  { id: "f14", title: "Undated Persuasions", color: "#DCA01C" }, // Mustard gold
  { id: "f15", title: "No Verified", color: "#0F4BD3" } // Electric blue
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: "b1",
    folderId: "f1",
    code: "01A",
    title: "The Semantic Void",
    url: "https://semanticvoid.org",
    description: "Intermittent failures in conversational drift. Syntactic markers lost during reference compilation. Archived for linguistic audits.",
    date: "Oct 12, 1961",
    tags: ["void", "linguistic"]
  },
  {
    id: "b2",
    folderId: "f2",
    code: "04F",
    title: "Concordance Concord",
    url: "https://concordance.org",
    description: "Alternative phrasings found in regional translations. Variances recorded in subsequent editions. Discrepancies are minor but persistent.",
    date: "Jan 18, 1968",
    tags: ["concordance", "grammar"]
  },
  {
    id: "b3",
    folderId: "f3",
    code: "09B",
    title: "The Lithography Log",
    url: "https://lithography-logs.net",
    description: "Analysis of physical ink bleed on standard cardstock. Bleed rate exceeds expected tolerances under humid storage conditions.",
    date: "Aug 04, 1972",
    tags: ["ink", "physical"]
  },
  {
    id: "b4",
    folderId: "f4",
    code: "12X",
    title: "Ghost Records Index",
    url: "https://ghostrecords.io",
    description: "References pointing to non-existent volumes. Believed to be clerical artifacts of the 1954 audit, though some claim they represent lost papers.",
    date: "Nov 23, 1958",
    tags: ["missing", "ghost"]
  },
  {
    id: "b5",
    folderId: "f5",
    code: "15A",
    title: "Axioms Without Grounding",
    url: "https://axioms.net",
    description: "Statements declared as true without underlying proofs or secondary citations. Marked for removal in the upcoming revision cycle.",
    date: "Feb 09, 1960",
    tags: ["axiom", "unproven"]
  },
  {
    id: "b6",
    folderId: "f6",
    code: "17B",
    title: "The Varnell Papers Archive",
    url: "https://archival-varnell.org",
    description: "Filed without origin. Referenced frequently, yet seldom cited in full. Contains notes on early machine intelligence and automated indexing.",
    date: "May 18, 1966",
    tags: ["varnell", "machine"]
  },
  {
    id: "b7",
    folderId: "f7",
    code: "22D",
    title: "Margin Logs",
    url: "https://marginlogs.com",
    description: "Entries recorded in the absolute edge of the primary ledgers. Partially illegible due to water damage sustained in the 1971 basement flood.",
    date: "Jun 30, 1969",
    tags: ["margin", "illegible"]
  },
  {
    id: "b8",
    folderId: "f8",
    code: "16A",
    title: "Drifting Subjects Catalog",
    url: "https://subject-drift.org",
    description: "Provenance unclear. Part of unidentified collection. Further record unavailable. Cross-referenced with the Varnell collection.",
    date: "Dec 11, 1956",
    tags: ["drift", "provenance"]
  },
  {
    id: "b9",
    folderId: "f9",
    code: "27E",
    title: "The Lacuna Project",
    url: "https://lacunaproject.org",
    description: "Repeated blank spaces in the core transcription reels. Pattern suggests intentional omission of sensitive communications.",
    date: "Sep 05, 1974",
    tags: ["lacuna", "omitted"]
  },
  {
    id: "b10",
    folderId: "f10",
    code: "31C",
    title: "Page Fringe Incidents",
    url: "https://pagefringe.org",
    description: "Unusual annotations made by secondary catalogers. Mostly consists of drawings of watch mechanisms and repeating geometric figures.",
    date: "Mar 14, 1963",
    tags: ["fringe", "clerical"]
  },
  {
    id: "b11",
    folderId: "f11",
    code: "32C",
    title: "Fringe Events Appendix",
    url: "https://fringeappendix.net",
    description: "Follow-up to the 1963 page fringe incidents. Focuses on temporal anomalies in catalog dates and mysterious signatures.",
    date: "Jul 19, 1965",
    tags: ["appendix", "anomaly"]
  },
  {
    id: "b12",
    folderId: "f12",
    code: "16C",
    title: "Reverse Indexing Project",
    url: "https://reverse-index.net",
    description: "Contact unknown. Connection to other records not confirmed. Processing ongoing. Hand-annotated maps found inside the folder sleeves.",
    date: "Dec 13, 1970",
    tags: ["indexing", "maps"]
  },
  {
    id: "b13",
    folderId: "f13",
    code: "40B",
    title: "The Lost Registers",
    url: "https://lostregisters.org",
    description: "Acquired from a private collection in Hamburg. Origin labels scraped off prior to transit. Contains shipping invoices of unknown machinery.",
    date: "Apr 22, 1959",
    tags: ["registers", "hamburg"]
  },
  {
    id: "b14",
    folderId: "f14",
    code: "44X",
    title: "Anomalous Treatises",
    url: "https://anomaloustreatises.net",
    description: "Pamphlets detailing arguments on retrocausality. No printing house listed. Estimated era: late 1940s. Hand-bound with copper wire.",
    date: "Oct 31, 1948",
    tags: ["treatises", "retrocausal"]
  },
  {
    id: "b15",
    folderId: "f15",
    code: "18C",
    title: "Unverified Records Registry",
    url: "https://unverified.io",
    description: "Believed to be part of a larger set. No other parts located. Referent unknown. Source pending. Security clearance level 3 required.",
    date: "May 18, 1964",
    tags: ["unverified", "classified"]
  }
];

export const RETRO_COLORS = [
  { name: "Burgundy", hex: "#8B1E4F" },
  { name: "Red-Orange", hex: "#C83E2D" },
  { name: "Sky Blue", hex: "#4CA1CD" },
  { name: "Slate Purple", hex: "#593A80" },
  { name: "Teal", hex: "#298F87" },
  { name: "Forest Green", hex: "#137834" },
  { name: "Blue-Cyan", hex: "#1A7BB0" },
  { name: "Ochre Brown", hex: "#8B5A2B" },
  { name: "Plum", hex: "#702A6B" },
  { name: "Rich Red", hex: "#C4271A" },
  { name: "Olive", hex: "#7D7F1E" },
  { name: "Deep Blue", hex: "#1A3B8B" },
  { name: "Slate Purple", hex: "#4B539B" },
  { name: "Gold", hex: "#DCA01C" },
  { name: "Electric Blue", hex: "#0F4BD3" },
  { name: "Dusty Rose", hex: "#A35C6D" },
  { name: "Sage Green", hex: "#587B60" },
  { name: "Rust", hex: "#AA4E28" }
];
