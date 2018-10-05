module.exports = {
  host: undefined,
  port: process.env.PORT||4000,

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
    port: 8529,
    name: "makpal",
  },
  logging:{
    consoleLogLevel:'debug',
    logFileLogLevel:'info',
    logFilePath:'./logs/server.log',
    maxLogFileSizeInMB:5,
    maxLogFileCount:5
  },
};
