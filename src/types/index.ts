export interface Program {
  id: string;
  title: string;
  category: string;
  taglines: string[];
  images: string[];
  youtubeUrl: string;
  featured?: boolean;
  details: {
    description: string[];
    presenter: string;
    duration: string;
    format?: string;
  };
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ShowcaseItem {
  title: string[];
  category: string;
  image: string;
  href: string;
  badge?: string;
}
