//put all app configuration here with a sensible default and then override per machine/environment/etc in other config files
//more docs on how config files work = https://github.com/lorenwest/node-config/wiki/Configuration-Files
//note: temporary local config (for local debugging/development) can be put into config/local.js (it's git ignored)

//USER
const CERTIFICATE_DEVSERIAL = '00';

module.exports = {
  host: undefined,
  port: 3000,

  //config inside here will be available in the client browser app
  clientConfig:{
    //WARNING: dont put anything sensitive in here - it WILL be publicly visible in the client browser
    apiHost: 'http://localhost:5000',
  },

  enableServerSideRender:false,

  logIncomingHttpRequests:true,
  logOutgoingHttpRequests:true,
  db:{
    host: "localhost",
    port: "8529",
    name: "stubbed",
  },
  logging:{
    consoleLogLevel:'debug',
    logFileLogLevel:'info',
    logFilePath:'./logs/server.log',
    maxLogFileSizeInMB:5,
    maxLogFileCount:5
  },

  //USER
  user: {
    secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET,
    auth: {
      access: {
        session: {
          enabled: true
        },
        jwt: {
          enabled: true,
          tokenExpiresIn: '1m',
          refreshTokenExpiresIn: '7d'
        }
      },
      password: {
        confirm: false,
        sendConfirmationEmail: false,
        sendAddNewUserEmail: false,
        enabled: true
      },
      certificate: {
        devSerial: CERTIFICATE_DEVSERIAL,
        enabled: false
      },
      facebook: {
        enabled: false,
        clientID: process.env.FACEBOOK_CLIENTID ||123,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET||123,
        scope: ['email'],
        profileFields: ['id', 'emails', 'displayName']
      },
      github: {
        enabled: false,
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_CLIENTSECRET,
        scope: ['user:email']
      },
      linkedin: {
        enabled: false,
        clientID: process.env.LINKEDIN_CLIENTID,
        clientSecret: process.env.LINKEDIN_CLIENTSECRET,
        scope: ['r_emailaddress', 'r_basicprofile']
      },
      google: {
        enabled: true,
        clientID: process.env.GOOGLE_CLIENTID || "807513269960-hj8assdlnrgch3e84q6325as1ldplktl.apps.googleusercontent.com",
        clientSecret: process.env.GOOGLE_CLIENTSECRET || "41XHI3zpDKDafwWndIWYWNeq",
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
      }
    }
  }
  
};
