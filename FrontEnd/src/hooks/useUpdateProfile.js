import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useUpdateProfile = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ name, nickname, description }) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, nickname, description }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => toast.success("Profile saved!"),
    onError: () => toast.error("Failed to save profile. Please try again."),
  });
};
