const ADMIN_TOKEN_KEY = "admin_auth_token";

export function getStoredAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function verifyStoredAdminToken(token: string) {
    const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.ok;
}
