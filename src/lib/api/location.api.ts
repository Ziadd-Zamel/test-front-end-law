export interface LocationData {
  ip: string;
  country: string;
  city: string;
  latitude: string;
  longitude: string;
  plusCode: string;
}
export async function fetchLocationData() {
  try {
    let bigData = null;
    let ipApi = null;
    let ipInfo = null;

    // Try BigDataCloud first
    try {
      const bigDataResponse = await fetch(
        "https://api.bigdatacloud.net/data/reverse-geocode-client"
      );
      bigData = await bigDataResponse.json();
    } catch (error) {
      console.warn("BigDataCloud failed, trying ipinfo.io:", error);

      // Fallback to ipinfo.io if BigDataCloud fails
      try {
        const ipInfoResponse = await fetch("https://ipinfo.io/json");
        ipInfo = await ipInfoResponse.json();
      } catch (ipInfoError) {
        console.error("ipinfo.io also failed:", ipInfoError);
      }
    }

    // Always fetch ip-api.com
    try {
      const ipApiResponse = await fetch("http://ip-api.com/json");
      ipApi = await ipApiResponse.json();
    } catch (error) {
      console.warn("ip-api.com failed:", error);
    }

    // Build result with fallback priority
    const result = {
      ip: ipApi?.query || ipInfo?.ip || "",
      country: bigData?.countryName || ipApi?.country || ipInfo?.country || "",
      city: bigData?.city || ipApi?.city || ipInfo?.city || "",
      latitude: "",
      longitude: "",
      plusCode: bigData?.plusCode || "",
    };

    // Handle latitude/longitude
    if (bigData?.latitude && bigData?.longitude) {
      result.latitude = bigData.latitude.toString();
      result.longitude = bigData.longitude.toString();
    } else if (ipApi?.lat && ipApi?.lon) {
      result.latitude = ipApi.lat.toString();
      result.longitude = ipApi.lon.toString();
    } else if (ipInfo?.loc) {
      const [lat, lon] = ipInfo.loc.split(",");
      result.latitude = lat;
      result.longitude = lon;
    }

    return result;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
}
