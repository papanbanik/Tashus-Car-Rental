export type ResendEmailValues = {
  email: string | undefined;
  userId: string | undefined;
};
export interface ResendEmailResponse {
  message: string;
  data: {
    token: string;
    email: string;
    userId: string;
    verified?: boolean;
  };
}
