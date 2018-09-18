import config from 'config';
import Database from 'arangojs'
var prod = process.env.NODE_ENV == "production"

if (!prod) { 
var configs = config.db
// var db = new Database({ url: configs.host + ":" + configs.port })  
var db = new Database('http://127.0.0.1:8529');
db.useDatabase(configs.name) 
db.useBasicAuth(["root"]) 
global.db = db


// var collection = db.collection('firstCollection');
// collection.create().then( () => console.log('Collection created'), err => console.error('Failed to create collection:', err) );

    // Based on the GraphQL-js Star Wars test fixtures available at
    // https://github.com/graphql/graphql-js/blob/v0.4.14/src/__tests__/starWarsData.js
    // https://github.com/graphql/graphql-js/blob/v0.4.14/src/__tests__/starWarsSchema.js
    async function start() {
        const episodes = db.collection('episodes')
        if (!await episodes.exists()) {
            await episodes.create()
            [
                { _key: 'NewHope', title: 'A New Hope', description: 'Released in 1977.' },
                { _key: 'Empire', title: 'The Empire Strikes Back', description: 'Released in 1980.' },
                { _key: 'Jedi', title: 'Return of the Jedi', description: 'Released in 1983.' },
                { _key: 'Awakens', title: 'The Force Awakens', description: 'Released in 2015.' }
            ].forEach(async function (episode) {
                await episodes.save(episode, true)
            });
        }

        // episodes.save({ _key: 'NewHope', title: 'A New Hope', description: 'Released in 1977.' })

        const characters = db.collection('characters')
        if (!await characters.exists()) {
            await characters.create()
            //  characters.ensureSkiplist('$type');
            [
                { _key: '1000', $type: 'human', name: 'Luke Skywalker', homePlanet: 'Tatooine' },
                { _key: '1001', $type: 'human', name: 'Darth Vader', homePlanet: 'Tatooine' },
                { _key: '1002', $type: 'human', name: 'Han Solo' },
                { _key: '1003', $type: 'human', name: 'Leia Organa', homePlanet: 'Alderaan' },
                { _key: '1004', $type: 'human', name: 'Wilhuff Tarkin' },
                { _key: '1005', $type: 'human', name: 'Finn' },
                { _key: '1006', $type: 'human', name: 'Rey', homePlanet: 'Jakku' },
                { _key: '1007', $type: 'human', name: 'Kylo Ren' },
                { _key: '2000', $type: 'droid', name: 'C-3PO', primaryFunction: 'Protocol' },
                { _key: '2001', $type: 'droid', name: 'R2-D2', primaryFunction: 'Astromech' },
                { _key: '2002', $type: 'droid', name: 'BB-8', primaryFunction: 'Astromech' }
            ].forEach(async function (character) {
                await characters.save(character);
            });
        }

        const friends = db.edgeCollection('friends')
        if (!await friends.exists()) {
            await friends.create() 
            [
                ['1000', '1002'], ['1000', '1003'], ['1000', '2000'], ['1000', '2001'],
                ['1001', '1004'], ['1001', '1007'],
                ['1002', '1003'], ['1002', '1005'], ['1002', '1006'], ['1002', '2000'], ['1002', '2001'], ['1002', '2002'],
                ['1003', '1005'], ['1003', '1006'], ['1003', '2000'], ['1003', '2001'],
                ['1005', '1006'], ['1005', '2002'],
                ['1006', '2002'],
                ['2000', '2001'],
                ['2001', '2002']
            ].forEach(async function (pair) {
                await friends.save(
                    characters + '/' + pair[0],
                    characters + '/' + pair[1],
                    {}
                );
            });
        }

        const appearsIn = db.edgeCollection('appearsIn')
        if (!await appearsIn.exists()) {
            await appearsIn.create()
            [
                ['1000', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['1001', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['1002', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['1003', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['1004', ['NewHope']],
                ['1005', ['Awakens']],
                ['1006', ['Awakens']],
                ['1007', ['Awakens']],
                ['2000', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['2001', ['NewHope', 'Empire', 'Jedi', 'Awakens']],
                ['2002', ['Awakens']]
            ].forEach(async function (relation) {
                relation[1].forEach(async function (episode) {
                    await appearsIn.save(
                        characters + '/' + relation[0],
                        episodes + '/' + episode,
                        {}
                    );
                });
            });
        } 
    }
    start()
}