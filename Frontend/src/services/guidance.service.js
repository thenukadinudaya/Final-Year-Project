const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const guidanceService = {
  analyzeProfile: async (text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Guidance Service Error:", error);
      throw error;
    }
  },

  analyzeUserProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/generate-guidance`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("User Guidance Service Error:", error);
      throw error;
    }
  }
};
