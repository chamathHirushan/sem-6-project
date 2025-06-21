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
  return response.data;
}

export const updateUserProfile = async (data: any) => {
  const response = await apiClient.put("/api/user/profile", data);
  return response.data;
}

export const getUserJobs = async () => {
  const response = await apiClient.get(`/api/user/jobs`);
  return response.data;
}

export const getUserBookmarks = async () => {
  const response = await apiClient.get(`/api/user/bookmarks`);
  return response.data;
}

export const addBookmark = async (jobId: string, state: boolean) => {
  const response = await apiClient.post(`/api/user/bookmarks/add/${jobId}`,{"state": state});
  return response.data;
}

export const removeBookmark = async (jobId: string) => {
  const response = await apiClient.delete(`/api/user/bookmarks/remove/${jobId}`);
  return response.data;
}

export const getUserNotifications = async () => { //socket?
  const response = await apiClient.get(`/api/user/notifications`);
  return response.data;
}

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.post(`/api/user/notifications/read/${notificationId}`,{});
  return response.data;
}

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.post(`/api/user/notifications/read/all`,{});
  return response.data;
}

export const getAvailableJobs = async () => {
  const response = await apiClient.get(`/api/user/jobs/available`);
  return response.data;
}

export const getJobDetails = async (jobId: string) => {
  const response = await apiClient.get(`/api/user/jobs/${jobId}`);
  return response.data;
}

export const applyForJob = async (jobId: string) => {
  const response = await apiClient.post(`/api/user/jobs/${jobId}/apply`, {});
  return response.data;
}

export const cancelJobApplication = async (jobId: string) => {
  const response = await apiClient.delete(`/api/user/jobs/${jobId}/cancel`);
  return response.data;
}

export const getUserReviews = async () => {
  const response = await apiClient.get(`/api/user/reviews`);
  return response.data;
}

export const addReview = async (jobId: string, reviewData: any) => {
  const response = await apiClient.post(`/api/user/reviews/${jobId}`, reviewData);
  return response.data;
}

export const getAllAvailableServices = async () => {
  const response = await apiClient.get(`/api/user/services/available`);
  return response.data;
}

export const getServiceDetails = async (serviceId: string) => {
  const response = await apiClient.get(`/api/user/services/${serviceId}`);
  return response.data;
}

export const addService = async (serviceData: any) => {
  const response = await apiClient.post(`/api/user/services/add`, serviceData);
  return response.data;
}

export const addJob = async (jobData: any) => {
  const response = await apiClient.post(`/api/user/jobs/add`, jobData);
  return response.data;
}
