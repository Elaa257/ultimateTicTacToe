export interface ResponseDTO {
  response: {
    ok: boolean;
    message: string;
  };
  user: {
    id: number;
    email: string;
    nickname: string;
    role: string; // Ensure the role property is included
  };
}
