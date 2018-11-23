import { wrapPubSub } from "apollo-logger";
import { PubSub } from "graphql-subscriptions";

import log from "../../common/log";
const { config } = global;

const pubsub = config.app.logging.apolloLogging
	? wrapPubSub(new PubSub(), { logger: log.debug.bind(log) })
	: new PubSub();

export default pubsub;
