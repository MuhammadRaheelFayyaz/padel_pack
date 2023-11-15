import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';

const {
	VITE_GOOGLE_CLIENT_ID,
	VITE_GOOGLE_CLIENT_SECRET,
	VITE_FACEBOOK_APP_ID,
	VITE_FACEBOOK_APP_SECRET
} = import.meta.env;

// Facebook Strategy
passport.use(new FacebookStrategy({
	clientID: VITE_FACEBOOK_APP_ID,
	clientSecret: VITE_FACEBOOK_APP_SECRET,
	callbackURL: "/api/auth/login/facebook/callback"
},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

// Google Strategy
passport.use(new GoogleStrategy({
	clientID: VITE_GOOGLE_CLIENT_ID,
	clientSecret: VITE_GOOGLE_CLIENT_SECRET,
	callbackURL: "/api/auth/login/google/callback"
},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

export default passport;
