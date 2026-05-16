import { ShipmentData } from "@/store/trackingSlice";

export async function fetchTrackingInfo(trackingNumber: string, token?: string): Promise<ShipmentData> {
  const baseUrl = process.env.NEXT_PUBLIC_TRACKING_API_URL;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${baseUrl}/track/${trackingNumber}`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch tracking info: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch tracking info");
  }

  return result.data;
}