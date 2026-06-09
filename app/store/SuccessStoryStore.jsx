import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

const getAuthHeader = () => {
  const { accessToken } = useAuthStore.getState();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const useSuccessStoryStore = create(
  persist(
    (set, get) => ({
      myStories: [],
      approvedStories: [],
      storiesLoading: false,
      submitLoading: false,

      submitStory: async (storyData) => {
        set({ submitLoading: true });

        try {
          const response = await fetch(`${SERVER_API}/success-stories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify(storyData),
          });

          const data = await response.json();

          if (data.status === "success") {
            set((state) => ({
              myStories: [data.data.successStory, ...state.myStories],
              submitLoading: false,
            }));

            return {
              success: true,
              message: data.message,
              data: data.data.successStory,
            };
          } else {
            set({ submitLoading: false });
            return {
              success: false,
              message: data.message || "Failed to submit story",
            };
          }
        } catch (error) {
          console.error("Submit story error:", error);
          set({ submitLoading: false });
          return {
            success: false,
            message: "An error occurred while submitting your story",
          };
        }
      },

      getMyStories: async () => {
        set({ storiesLoading: true });

        try {
          const response = await fetch(
            `${SERVER_API}/success-stories/my-stories`,
            {
              headers: getAuthHeader(),
            }
          );

          const data = await response.json();

          if (data.status === "success") {
            set({
              myStories: data.data.stories,
              storiesLoading: false,
            });

            return { success: true, data: data.data.stories };
          } else {
            set({ storiesLoading: false });
            return {
              success: false,
              message: data.message || "Failed to fetch stories",
            };
          }
        } catch (error) {
          console.error("Get my stories error:", error);
          set({ storiesLoading: false });
          return {
            success: false,
            message: "An error occurred while fetching your stories",
          };
        }
      },

      getApprovedStories: async (limit = 10) => {
        set({ storiesLoading: true });

        try {
          const response = await fetch(
            `${SERVER_API}/success-stories/approved?limit=${limit}`
          );

          const data = await response.json();

          if (data.status === "success") {
            set({
              approvedStories: data.data.stories,
              storiesLoading: false,
            });

            return { success: true, data: data.data.stories };
          } else {
            set({ storiesLoading: false });
            return {
              success: false,
              message: data.message || "Failed to fetch success stories",
            };
          }
        } catch (error) {
          console.error("Get approved stories error:", error);
          set({ storiesLoading: false });
          return {
            success: false,
            message: "An error occurred while fetching success stories",
          };
        }
      },

      clearSuccessStories: () => {
        set({
          myStories: [],
          approvedStories: [],
          storiesLoading: false,
          submitLoading: false,
        });
      },
    }),
    {
      name: "success-story-storage",
      partialize: (state) => ({
        myStories: state.myStories,
        approvedStories: state.approvedStories,
      }),
    }
  )
);

export { useSuccessStoryStore };
