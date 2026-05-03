"use server";

export async function getCoordinates(address: string) {
  try {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    if (!KAKAO_REST_API_KEY) {
      throw new Error("KAKAO_REST_API_KEY is not defined");
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const doc = data.documents[0];
      return {
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
      };
    }

    return null; // Coordinates not found
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
