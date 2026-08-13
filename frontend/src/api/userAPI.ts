import { apiClient } from "./client";

export const sendOTP = async (phone_number: string) => {
    const response = await apiClient.post("/api/otp/send", null, {
      phone_number: phone_number
    });
    return response;
  };

export const verifyOTP = async (phone_number: string, otp: string) => {
    const response = await apiClient.post("/api/otp/verify", null, {
      input_otp: otp,
      phone_number: phone_number
    });
    return response;
  };


export const addTask = async (title: string, description: string, budget: number, location: string) => {
    const response = await apiClient.post("/api/task/add", {
      title: title,
      description: description,
      budget: budget,
      location: location
    });
    return response;
  }

export const getUserProfile = async () => {
  const response = await apiClient.get("/api/user/profile");
  return response;
}

export const updateUserProfile = async (data: any) => {
  const response = await apiClient.put("/api/user/profile", data);
  return response;
}

export const getUserJobs = async () => {
  const response = await apiClient.get(`/api/user/jobs`);
  return response;
}

export const updateJobStatus = async (jobId: string, status: string, category: string) => {
  const response = await apiClient.patch(`/api/user/jobs/${jobId}/status`, { status, category });
  return response;
}

export const getUserBookmarks = async () => {
  const response = await apiClient.get(`/api/user/bookmarks`);
  return response;
}

export const addBookmark = async (jobId: string, state: boolean, entityType: string = "job") => {
  const response = await apiClient.post(`/api/user/bookmarks/add/${jobId}`, {
    state,
    entity_type: entityType,
    type: entityType,
  });
  return response;
}

export const removeBookmark = async (jobId: string, entityType: string = "job") => {
  const response = await apiClient.delete(`/api/user/bookmarks/remove/${jobId}`, { entity_type: entityType });
  return response;
}

export const getUserNotifications = async () => {
  const response = await apiClient.get(`/api/user/notifications`);
  return response;
}

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.post(`/api/user/notifications/read/${notificationId}`,{});
  return response;
}

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.post(`/api/user/notifications/read/all`,{});
  return response;
}

export const getAvailableJobs = async () => {
  const response = await apiClient.get(`/api/user/jobs/available`);
  return response;
}

export const getJobDetails = async (jobId: string) => {
  const response = await apiClient.get(`/api/user/jobs/${jobId}`);
  return response;
}

export const applyForJob = async (jobId: string) => {
  const response = await apiClient.post(`/api/user/jobs/${jobId}/apply`, {});
  return response;
}

export const cancelJobApplication = async (jobId: string) => {
  const response = await apiClient.delete(`/api/user/jobs/${jobId}/cancel`);
  return response;
}

export const getUserReviews = async () => {
  const response = await apiClient.get(`/api/user/reviews`);
  return response;
}

export const addReview = async (jobId: string, reviewData: any) => {
  const response = await apiClient.post(`/api/user/reviews/${jobId}`, reviewData);
  return response;
}

export const getAllAvailableServices = async () => {
  const response = await apiClient.get(`/api/user/services/available`);
  return response;
}

export const getServiceDetails = async (serviceId: string) => {
  const response = await apiClient.get(`/api/user/services/${serviceId}`);
  return response;
}

export const addService = async (serviceData: any) => {
  const response = await apiClient.post(`/api/user/services/add`, serviceData);
  return response;
}

export const addJob = async (jobData: any) => {
  const response = await apiClient.post(`/api/user/jobs/add`, jobData);
  return response;
}

export const getUserFields = async () => {
  const response = await apiClient.get(`/api/user/fields`);
  return response;
}

export const addUserField = async (fieldData: any) => {
  const response = await apiClient.post(`/api/user/fields`, fieldData);
  return response;
}

export const updateUserField = async (fieldId: string, fieldData: any) => {
  const response = await apiClient.put(`/api/user/fields/${fieldId}`, fieldData);
  return response;
}

export const getUserConversations = async (otherUserId?: string | number) => {
  const params = otherUserId ? { other_user_id: String(otherUserId) } : undefined;
  const response = await apiClient.get(`/api/user/conversations`, params);
  return response;
}

export const startConversation = async (otherUserId: number) => {
  const response = await apiClient.post(`/api/user/conversations`, { other_user_id: otherUserId });
  return response;
}

export const getConversationMessages = async (conversationId: string | number) => {
  const response = await apiClient.get(`/api/user/conversations/${conversationId}/messages`);
  return response;
}

export const sendConversationMessage = async (conversationId: string | number, text: string) => {
  const response = await apiClient.post(`/api/user/conversations/${conversationId}/messages`, { text });
  return response;
}

export const getUserAnalytics = async (period?: string) => {
  const params = period ? { period } : undefined;
  const response = await apiClient.get(`/api/user/analytics`, params);
  return response;
}

export const getAdminAnalytics = async (period?: string) => {
  const params = period ? { period } : undefined;
  const response = await apiClient.get(`/admin/analytics`, params);
  return response;
}
