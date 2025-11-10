const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://slotswapperbackend-imr5.onrender.com/api"
    : "http://localhost:5000/api";

export const API = {
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  },

  async signup(name, email, password) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getEvents() {
    return this.request("/events");
  },

  async createEvent(event) {
    return this.request("/events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },

  async updateEvent(eventId, updates) {
    return this.request(`/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(eventId) {
    return this.request(`/events/${eventId}`, {
      method: "DELETE",
    });
  },

  async getSwappableSlots() {
    return this.request("/swappable-slots");
  },

  async createSwapRequest(mySlotId, theirSlotId) {
    return this.request("/swap-request", {
      method: "POST",
      body: JSON.stringify({ mySlotId, theirSlotId }),
    });
  },

  async respondToSwap(requestId, accept) {
    return this.request(`/swap-response/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ accept }),
    });
  },

  async getIncomingRequests() {
    return this.request("/swap-requests/incoming");
  },

  async getOutgoingRequests() {
    return this.request("/swap-requests/outgoing");
  },
};
