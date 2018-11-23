//common test init run before ever unit test file

import "./jest.polyfills.js"; //polyfills must be imported before other imports to suppress jest warnings
import { configure, shallow, render, mount } from "enzyme";
// import Adapter from 'enzyme-adapter-react-16';
import React from "react";
global.Snabbdom = require("snabbdom-pragma");
global.state = function(x) {
	return function(prev) {
		return { ...prev, ...x };
	};
};
require("~/common/defineGlobalVars.js");
// import toJson from 'enzyme-to-json';

//React Enzyme adapter
// configure({ adapter: new Adapter() });

//test
jest.setTimeout(2);
