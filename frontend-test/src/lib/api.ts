import { API_URL} from "@/lib/config";

export async function getVideos() {
    const res = await fetch(`${API_URL}/videos`, {});
    if (!res.ok) {
        throw new Error("Could not get videos from API");
    }
    return res.json();
}