const lightThemePages = [
	'/privacybeleid',
	'/gebruiksvoorwaarden',
	'/bestellen',
	'/bestellen/bedankt',
	'/login',
    '/wachtwoord-reset'
];

// Checks what page needs to be light or dark
export function getTheme(pathname) {
	if (pathname && (lightThemePages.includes(pathname) || pathname.startsWith('/account'))) {
		return 'light';
	}

	return 'dark';
}
