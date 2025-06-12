import { login, register } from "@/lib/api";
import { User } from "@/lib/types";
import { cookies } from "next/headers";

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
  password: string,
  role: "client" | "admin"
): Promise<User> => {
  const data = {
    name,
    email,
    password,
    role,
  };
  const response = await register(data);
  return response.data.user;
};

export const getUser = async (): Promise<User> => {
  const response = await getUser();
  return response.data.user;
};

export async function auth(): Promise<{ user: User } | null> {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error("auth() failed:", error);
    return null;
  }
}
