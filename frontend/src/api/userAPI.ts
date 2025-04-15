import { apiClient } from "./client";


export const getUser = async () => {
    const response = await apiClient.get("/auth");
    return response;
}

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
