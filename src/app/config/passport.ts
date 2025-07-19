import  bcryptjs  from 'bcryptjs';
import passport from "passport";
import { Strategy as  GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async(email: string, password: string, done)=>{
        try {
             const isUserExist =await User.findOne({email})

     if(!isUserExist){
        return done(null, false, {message: "User does not exist"})
     }

     const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")

     if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
            }

     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

      if(!isPasswordMatched){
       return done(null, false, {message: "Password does not Matched"})
     }

     return done(null, isUserExist)
        } catch (error) {
            console.log(error);
            done(error)
            
        }
    })
)

passport.use(
    new GoogleStrategy ({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) =>{
        try {
            const email = profile.emails?.[0].value

            if(!email){
                return done(null, false, {mesasge: "No email found"})
            }

            let user = await User.findOne({email})

            if(!user){
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]
                })
            }
            return done(null, user)
        } catch (error) {
            console.log("Google Strategy error", error);
            return done(error)
            
        }
    })
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown | undefined) => void)=>{
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any)=>{
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})