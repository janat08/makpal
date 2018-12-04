import minilog from 'minilog';
var { __DEV__, __SERVER__, config } = global;
minilog.enable();

const loggerName = typeof window !== 'undefined' ? 'frontend' : 'backend';
const log = minilog(loggerName);
log.suggest.defaultResult = false;
log.suggest.clear().allow(loggerName, config.app.logging.level);

if (__DEV__ && __SERVER__) {
	let console_log = global.console.log;
	global.console.log = function() {
		if (
			arguments.length == 1 &&
			typeof arguments[0] === 'string' &&
			arguments[0].match(/^\[(HMR|WDS)\]/)
		) {
			console_log('backend ' + arguments[0]);
		} else {
			console_log.apply(global.console, arguments);
		}
	};
}

export default log;
