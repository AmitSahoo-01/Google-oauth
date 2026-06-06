import { config } from 'dotenv';
import express from 'express';
config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();

app.get('/', (req, res) => {
    res.send('chal raha hai bhai ');
});

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},(_,__,profile,done)=>{
    return done(null,profile);
}));

//  This line is used to redirect the user to the Google authentication page when they access the /auth/google route. The scope option specifies that we want to access the user's profile and email information.
app.get("/auth/google",
    passport.authenticate("google",{scope:["profile","email"]})
)


// This line is used to handle the callback from Google after the user has authenticated. The passport.authenticate middleware is used again to process the authentication response from Google. If the authentication is successful, the user information will be available in req.user, and we send a success message as a response. If authentication fails, the user will be redirected to the root route ("/").
app.get("/auth/google/callback",passport.authenticate("google",{
    session: false,
    failureRedirect:"/"
}),
(req,res)=>{
    console.log(req.user);
    res.send("google authnticate successful");
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});