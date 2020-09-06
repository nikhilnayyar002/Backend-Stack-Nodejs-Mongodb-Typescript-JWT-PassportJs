import passport from 'passport';
import localStrategy from 'passport-local';
import { UserModal, User } from '../modal/user';

/**
 * Set up local strategy for passport to be used later for Authentication of user
 */
passport.use(
    new localStrategy.Strategy({ usernameField: 'email' },
        (username, password, done:any) => {
            UserModal.findOne({ email: username },
                (err, user:User) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { status:false, message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { status:false, message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);