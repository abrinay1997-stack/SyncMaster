
export interface ManualSubsection {
  title: string;
  content: string[];
}

export interface ManualSection {
  id: string;
  title: string;
  icon?: string;
  content: string[];
  subsections?: ManualSubsection[];
}

export interface ManualPart {
  id: string;
  title: string;
  sections: ManualSection[];
}

export interface SearchResult {
  partTitle: string;
  section: ManualSection;
  matchType: 'title' | 'content';
}
