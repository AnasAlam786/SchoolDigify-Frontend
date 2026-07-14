const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";
    
export async function apiGet(path) {
    return fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
    });
}

export async function apiPost(path, body) {
    return fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
    });
}