const Bundler = require('parcel-bundler');
const nodemon = require('nodemon');
const path = require('path');


const file = path.join(__dirname, '../src/server/index.ts');

const options = {
	outDir: path.join(__dirname, '../dist/server'),
	watch: true,
	target: 'node',
	detailedReport: false
};

const bundler = new Bundler(file, options);

let hasSetAutoServe = false;

// when parcel first buildend, use nodemon to re-run server when parcel rebuild
bundler.on('buildEnd', () => {
	if (!hasSetAutoServe) {
		hasSetAutoServe = true;
		nodemon({
			script: path.join(__dirname, '../dist/server/index.js'),
		});
	}
});

bundler.bundle();