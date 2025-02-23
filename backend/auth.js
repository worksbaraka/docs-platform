console.log("Auth module loaded");

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

function setupAuth(app) {
  // Configure Passport session management
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Configure GitHub Strategy
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,        // Set these in your environment variables
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // You can perform database operations here if needed
      return done(null, profile);
    }
  ));

  // Define GitHub auth routes
  app.get('/auth/github', (req, res, next) => {
    console.log("Auth route /auth/github accessed");
    next();
  }, passport.authenticate('github', { scope: ['user:email'] }));

  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect to frontend
      res.redirect('http://localhost:3000');
    }
  );

  // A route to check authentication status
  app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });
}

module.exports = setupAuth;