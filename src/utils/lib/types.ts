export interface Viewer {
  id: string | null;
  username: string | null;
  token: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}
