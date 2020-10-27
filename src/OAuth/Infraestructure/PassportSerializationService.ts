import { SerializationService } from '../Domain/SerializationService';
const passport = require('passport');

export class PassportSerializationService implements SerializationService {
  public serializeUser(): object {
    return passport.serializeUser(function(user, done) {
      /*
          From the user take just the id (to minimize the cookie size) and just pass the id of the user
          to the done callback
          PS: You dont have to do it like this its just usually done like this
          */
      done(null, user);
    });
  }
  public deserializeUser(): object {
    return passport.deserializeUser(function(user, done) {
      /*
          Instead of user this function usually recives the id
          then you use the id to select the user from the db and pass the user obj to the done callback
          PS: You can later access this data in any routes in: req.user
          */
      done(null, user);
    });
  }
}
