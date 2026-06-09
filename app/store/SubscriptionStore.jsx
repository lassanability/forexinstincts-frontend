import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { useAuthStore } from "./AuthStore";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useSubscriptionStore = create((set, get) => ({
  currentSubscription: null,
  subscriptionLoading: false,
  paymentLoading: false,
  verifyingPayment: false,
  allSubscriptions: [],
  allSubscriptionsLoading: false,

  tiers: {
    starter: {
      id: "starter",
      name: "Starter Glow",
      price: 0, 
      currency: "KSh",
      description: "Perfect for beginning your conversation journey",
      features: [
        "Email support (24h response)",
        "Access to 1 basic template per day"
      ],
      limits: {
        templatesPerDay: 1,
        totalTemplates: 15,
        bookmarks: false,
        previousAccess: false,
        coaching: false,
        responseTime: "24 hours"
      },
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
    },
    pro: {
      id: "pro",
      name: "Radiant Pro",
      price: null, 
      currency: "KSh",
      description: "Elevate your communication with confidence",
      features: [
        "Community support",
        "20+ Premium templates",
        "Bookmark your favorites",
        "Access previous templates",
        "Everything in Starter Glow",
        "Advanced flirting techniques",
        "Relationship building methods",
        "Priority support (12h response)",
        "Teaching strategies to make it on tinder and the likes",
      ],
      limits: {
        templatesPerDay: "unlimited",
        totalTemplates: 50,
        bookmarks: true,
        previousAccess: true,
        coaching: false,
        responseTime: "12 hours"
      },
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)"
    },
    elite: {
      id: "elite",
      name: "Queen Elite",
      price: null, 
      currency: "KSh",
      description: "Complete mastery with personal coaching",
      features: [
        "Unlimited Expert templates",
        "All categories unlocked",
        "Monthly content updates",
        "Direct Telegram support",
        "Custom template requests",
        "Lifetime content updates",
        "Everything on Radiant Pro",
        "Priority feature requests",
        "1-on-1 coaching session (60min)",
        "Access to hidden dating site that your success is higher than average",

      ],
      limits: {
        templatesPerDay: "unlimited",
        totalTemplates: "unlimited",
        bookmarks: true,
        previousAccess: true,
        coaching: true,
        responseTime: "2 hours"
      },
      color: "#fbbf24",
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
    }
  },
  pricingLoaded: false,
  pricingFetching: false,

  getSubscription: async () => {
    try {
      set({ subscriptionLoading: true });
      const { getAuthHeader } = useAuthStore.getState();
      
      const response = await fetch(`${SERVER_API}/subscriptions/me`, {
        headers: getAuthHeader(),
      });

      const data = await response.json();
      if (data.status === "success") {
        set({
          currentSubscription: data.data.subscription,
          subscriptionLoading: false,
        });

        useAuthStore.getState().updateUser({
          currentTier: data.data.currentTier
        });
        
        return { success: true, data: data.data };
      }
      set({ subscriptionLoading: false });
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Get subscription error:", error);
      set({ subscriptionLoading: false });
      return { success: false, message: "Failed to fetch subscription" };
    }
  },

  initializePayment: async (tier) => {
    try {
      set({ paymentLoading: true });
      const { getAuthHeader } = useAuthStore.getState();
      
      const response = await fetch(`${SERVER_API}/subscriptions/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();
      if (data.status === "success") {
        set({ paymentLoading: false });
        return {
          success: true,
          data: data.data
        };
      }
      set({ paymentLoading: false });
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Initialize payment error:", error);
      set({ paymentLoading: false });
      return { success: false, message: "Failed to initialize payment" };
    }
  },

  verifyPayment: async (reference) => {
    try {
      set({ verifyingPayment: true });
      const { getAuthHeader } = useAuthStore.getState();
      
      const response = await fetch(`${SERVER_API}/subscriptions/verify/${reference}`, {
        headers: getAuthHeader(),
      });

      const data = await response.json();
      if (data.status === "success") {
        set({ 
          verifyingPayment: false,
          currentSubscription: data.data.subscription,
        });

        useAuthStore.getState().updateUser({
          currentTier: data.data.tier
        });
        
        return { 
          success: true, 
          data: data.data,
          message: "Payment verified successfully! Welcome to your new tier!" 
        };
      }
      set({ verifyingPayment: false });
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Verify payment error:", error);
      set({ verifyingPayment: false });
      return { success: false, message: "Failed to verify payment" };
    }
  },

  getTierInfo: (tier) => {
    const { tiers } = get();
    return tiers[tier] || tiers.starter;
  },

  getAllTiers: () => {
    const { tiers } = get();
    return Object.values(tiers);
  },

  canAccessTier: (requiredTier) => {
    const { currentTier } = useAuthStore.getState();
    const tierHierarchy = { starter: 0, pro: 1, elite: 2 };
    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
  },

  getTierLevel: (tier) => {
    const tierHierarchy = { starter: 0, pro: 1, elite: 2 };
    return tierHierarchy[tier] || 0;
  },

  fetchPricing: async () => {
    try {
      const response = await fetch(`${SERVER_API}/subscriptions/pricing`, {
        cache: 'no-store', // Ensure fresh data on every request
        next: { revalidate: 0 }
      });

      if (!response.ok) {
        set({ pricingError: `HTTP ${response.status}` });
        return { success: false, message: `HTTP ${response.status}` };
      }

      const data = await response.json();

      if (data.status === "success") {
        const { pricing } = data.data;

        set((state) => ({
          tiers: {
            ...state.tiers,
            pro: { ...state.tiers.pro, price: pricing.pro.price },
            elite: { ...state.tiers.elite, price: pricing.elite.price }
          },
          pricingLoaded: true,
          pricingError: null
        }));

        return { success: true, data: pricing };
      }

      set({ pricingError: data.message });
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Fetch pricing error:", error);
      set({ pricingError: error.message });
      return { success: false, message: "Failed to fetch pricing" };
    }
  },

  initializePricing: async (retries = 3) => {
    const { pricingLoaded } = get();

    if (pricingLoaded) {
      return { success: true };
    }

    for (let i = 0; i < retries; i++) {
      const result = await get().fetchPricing();

      if (result.success) {
        return result;
      }

      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return { success: false, message: "Failed to load pricing after retries" };
  },

  getAllSubscriptions: async () => {
    try {
      set({ allSubscriptionsLoading: true });
      const { getAuthHeader } = useAuthStore.getState();
      
      const response = await fetch(`${SERVER_API}/subscriptions-admin/all`, {
        headers: getAuthHeader(),
      });

      const data = await response.json();
      if (data.status === "success") {
        set({
          allSubscriptions: data.data.subscriptions,
          allSubscriptionsLoading: false,
        });
        return { success: true, data: data.data.subscriptions };
      }
      set({ allSubscriptionsLoading: false });
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Get all subscriptions error:", error);
      set({ allSubscriptionsLoading: false });
      return { success: false, message: "Failed to fetch subscriptions" };
    }
  },

  grantSubscription: async (userId, tier, duration) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      
      const response = await fetch(`${SERVER_API}/subscriptions-admin/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ userId, tier, duration }),
      });

      const data = await response.json();
      if (data.status === "success") {
        get().getAllSubscriptions();
        return { success: true, message: "Subscription granted successfully" };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Grant subscription error:", error);
      return { success: false, message: "Failed to grant subscription" };
    }
  },
}));