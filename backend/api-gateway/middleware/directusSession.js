const { fetch } = require("undici");

module.exports = async function directusSessionAuth(req, res, next) {
    const inCookie = req.headers.cookie || "";
    const cmap = Object.fromEntries(
        inCookie.split(';').map((c) => c.trim()).filter(Boolean).map((c) => {
            const i = c.indexOf('=');
            if (i === -1) return [c, ''];
            return [decodeURIComponent(c.slice(0, i)), decodeURIComponent(c.slice(i + 1))];
        })
    );
    const access = cmap['app_directus_access_token'] || cmap['directus_access_token'];
    const sess = cmap['app_directus_session'] || cmap['directus_session'];
    const refresh = cmap['app_directus_refresh_token'] || cmap['directus_refresh_token'];
    const cookie = [
        access ? `directus_access_token=${access}` : null,
        sess ? `directus_session=${sess}` : null,
        refresh ? `directus_refresh_token=${refresh}` : null,
    ].filter(Boolean).join('; ');
    if (!cookie) return res.status(401).json({ message: "Нет сессии" });

    const directusBase = process.env.DIRECTUS_URL || "http://localhost:8055";

    try {
        let r = await fetch(`${directusBase}/users/me`, { headers: { cookie } });

        if (!r.ok) {
            // Попробуем fallback на host.docker.internal (актуально в Docker)
            try {
                const fallback = `http://host.docker.internal:8055/users/me`;
                r = await fetch(fallback, { headers: { cookie } });
            } catch (_) {}
        }

        if (!r || !r.ok) return res.status(401).json({ message: "Сессия недействительна" });

        req.user = await r.json();
        next();
    } catch (e) {
        res.status(401).json({ message: "Проверка сессии не прошла" });
    }
};


