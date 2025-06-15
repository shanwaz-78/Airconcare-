import { login, register, getCurrentUser } from "@/lib/api";
import { User } from "@/lib/types";

export const loginUser = async (email: string, password: string) => {
  const data = {
    email,
    password,
  };
  const user = await login(data);
  return user;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const data = {
    name,
    email,
    password,
  };
  const response = await register(data);
  return response.data.user;
};

export const getUser = async () => {
  const response = await getCurrentUser();
  return response.data;
};

export async function auth(): Promise<{ user: User } | null> {
  try {
    return await getUser();
  } catch (error) {
    console.error("auth() failed:", error);
    return null;
  }
}
