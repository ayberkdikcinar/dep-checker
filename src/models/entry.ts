export interface Entry extends DataModel {
  repo: string;
  platform: string;
  owner: string;
  emails: string[];
}

export interface DataModel {
  id: string;
  createdAt: Date;
}
