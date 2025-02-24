// backend/auth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

function setupAuth(app) {
  console.log("Auth module loaded");

  // Configure Passport for session handling
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Configure the GitHub strategy
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("GitHub profile:", profile);
      // Create a user object with only the fields you need
      const userData = {
        login: profile._json.login,           // GitHub username
        avatar_url: profile._json.avatar_url    // GitHub avatar URL
      };
      return done(null, userData);
    }
  ));

  // Define the route to initiate GitHub authentication
  app.get('/auth/github', (req, res, next) => {
    console.log("GET /auth/github route hit");
    next();
  }, passport.authenticate('github', { scope: ['user:email'] }));

  // Define the GitHub OAuth callback route
  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      // Save the authenticated user in the session
      req.session.user = req.user;
      // Redirect to the frontend after successful login
      res.redirect('http://localhost:3000');
    }
  );

  // Define a route to check authentication status
  app.get('/auth/status', (req, res) => {
    res.json({ user: req.session.user || null });
  });

  // Define the logout route (only one definition)
  app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('http://localhost:3000');
    });
  });
}

module.exports = setupAuth;