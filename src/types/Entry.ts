export interface EntryPayload {
  platform: string;
  repo: string;
  owner: string;
  emails: string[];
}

export interface Entry {
  id: string;
  platform: string;
  repo: string;
  owner: string;
  emails: string[];
  createdAt: Date;
}
