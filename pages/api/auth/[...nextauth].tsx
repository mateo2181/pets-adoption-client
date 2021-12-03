import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    // Providers.Email({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //   // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
    //   scope: 'read:user'
    // }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Credentials({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
        //   username: { label: 'Username', type: 'text', placeholder: 'Username' },
          email: { label: 'Email', type: 'email', placeholder: 'myemail@mail.com'},
          password: {  label: 'Password', type: 'password' }
        },
        async authorize(credentials, req) {
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
          const res = await fetch(`${process.env.API_ENDPOINT_SIGNIN}/signInWithCredentials`, {
              method: 'POST',
              body: JSON.stringify(credentials),
              headers: { 'Content-Type': 'application/json' }
            });
          const user = await res.json();
    
          // If no error and we have user data, return it
          if (res.status === 200 && user) {
            return user;
          }
          // Return null if user data could not be retrieved
          return null;
        }
      })
  ],
//   adapter: PrismaAdapter(prisma),
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
//   database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 1 day

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
        // console.log({'token in JWT': token});
        console.log({'user in JWT': user?.accessToken});
        // if (!account) {
        //     return token;
        // }
        // if (account.provider && !token[account.provider] ) {
        //   token[account.provider] = {};
        // }
  
        if (user) {
          token.accessToken = user?.accessToken;
        }
        // if (account.id_token ) {
        //     token.id_token = account.id_token;
        //   }
  
        // if (account.refreshToken ) {
        //   token.refreshToken = account.refreshToken;
        // }
  
        return token;
    },
    async session(session, token) {
        // Send properties to the client, like an access_token from a provider.
        session.token = token.accessToken;
        return session;
    },
    async signIn(user, account, profile) {
        if(account.type === 'credentials') {
            // console.log({'SIGNIN CALLBACK WITH CREDENTIALS':{user, account, profile}});
            // const userData = user.user; 
            // user = { ...user, accessToken: user.token };
            user.accessToken = user.token;
            return true;
        }
        console.log({'SIGNIN CALLBACK':{user, account, profile}});
        const data = {
            name: profile.name,
            email: profile.email,
            picture: profile.picture
        };
        const res = await fetch(`${process.env.API_ENDPOINT_SIGNIN}/signIn`, {method: 'POST', body: JSON.stringify(data)});
        const json = await res.json();
        user.accessToken = json.token;
        return true; 
    },
  },
  events: {},
  theme: 'light',
  debug: false,
});