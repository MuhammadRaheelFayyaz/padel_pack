export async function GET({ params }) {
	const { provider } = params;

	const authUrl = generateAuthUrl(provider);

	return new Response(null, { status: 302, headers: { location: authUrl } });
}

function generateAuthUrl(provider) {
	const redirectUri = `${import.meta.env.VITE_BASE_URL}/api/auth/login/${provider}/callback`;

	// Facebook
	if (provider === 'facebook') {
		const clientId = import.meta.env.VITE_FACEBOOK_APP_ID;
		const scope = 'public_profile,email';
		
		return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
	}

	// Google
	if (provider === 'google') {
		const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
		const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
		
		return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
	}
}
