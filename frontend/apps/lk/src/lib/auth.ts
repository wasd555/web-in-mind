export async function getUser() {
    const res = await fetch('http://localhost:8055/auth/me', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        // next: { revalidate: 0 } — если используешь app router с SSR
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
}