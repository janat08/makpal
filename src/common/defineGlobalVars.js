if (typeof window !== 'undefined') {
	window.global = window;
	global = window;
}
global.env = process.env;
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__SERVER__ = typeof window !== 'undefined' ? false : true;

const { env } = global;
const CERTIFICATE_DEVSERIAL = '00';
var prodConfigurationVars = {};
var devConfigurationVars = {
	__TEST__: false,
	__DEV__: process.env.NODE_ENV !== 'production',
	__SERVER__: typeof window !== 'undefined' ? false : true,
	host: undefined,
	port: env.PORT || 4000,
	__API_URL__: '/graphql',
	//config inside here will be available in the client browser app
	clientConfig: {
		//WARNING: dont put anything sensitive in here - it WILL be publicly visible in the client browser
		apiHost: 'http://localhost:5000'
	},

	enableServerSideRender: false,

	logIncomingHttpRequests: true,
	logOutgoingHttpRequests: true,
	db: {
		host: 'localhost',
		port: '8529',
		name: 'stubbed'
	},
	logging: {
		consoleLogLevel: 'debug',
		logFileLogLevel: 'info',
		logFilePath: './logs/server.log',
		maxLogFileSizeInMB: 5,
		maxLogFileCount: 5
	},

	//app
	app: {
		name: 'Makpal',
		logging: {
			level:
				['production'].indexOf(process.env.NODE_ENV) < 0 ? 'debug' : 'info',
			debugSQL: false,
			apolloLogging: false && ['production'].indexOf(process.env.NODE_ENV) < 0
		},
		// Check here for Windows and Mac OS X: https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
		// Use this protocol handler for Linux: https://github.com/sysgears/vscode-handler
		stackFragmentFormat: 'vscode://file/{0}:{1}:{2}'
	},

	//apollo
	engine: {
		apiKey: '', // Set your Engine API key here
		logging: {
			level: 'DEBUG' // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
		}
	},

	//USER
	user: {
		secret:
			process.env.NODE_ENV === 'test'
				? 'secret for tests'
				: process.env.AUTH_SECRET || 'SIMPLE PASS',
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
				enabled: true,
				clientID: process.env.FACEBOOK_CLIENTID || '742508426141483',
				clientSecret:
					process.env.FACEBOOK_CLIENTSECRET ||
					'448c4dced4a1b78f37f9b60dfd2becb3',
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
				clientID:
					process.env.GOOGLE_CLIENTID ||
					'807513269960-hj8assdlnrgch3e84q6325as1ldplktl.apps.googleusercontent.com',
				clientSecret:
					process.env.GOOGLE_CLIENTSECRET || '41XHI3zpDKDafwWndIWYWNeq',
				scope: [
					'https://www.googleapis.com/auth/userinfo.email',
					'https://www.googleapis.com/auth/userinfo.profile'
				]
			}
		}
	}
};

if (global.__DEV__) {
	global.config = Object.assign({}, devConfigurationVars);
} else {
	global.config = Object.assign(
		{},
		// process.env,
		devConfigurationVars,
		prodConfigurationVars
	);
}
