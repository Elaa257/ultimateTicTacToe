export interface ResponseDTO {
  ok: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    nickname: string;
    role: string; // Ensure the role property is included
  };
}
