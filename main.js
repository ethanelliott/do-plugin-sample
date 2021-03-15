const bonjour = require('bonjour')();
const getPort = require('get-port');
const express = require('express');

const main = async () => {
    const PORT = await getPort();
    const service = bonjour.publish({ 
        name: 'Test Plugin', 
        type: 'http', 
        port: PORT,
        txt: {
            do: 'plugin', // must have this to be identified 
            name: 'Test Plugin',
            description: 'A cool test plugin!',
            command: 'test',
            handler: '/handler' // callback path to post command to
        }
    });

    process.on('SIGINT', () => {
        service.stop(() => {
            process.exit()
        });
    });

    const app = express();
    app.use(express.json());

    app.post('/handler', function (req, res) {
        // do the things in here
        const {command} = req.body;
        console.log('Handle:', command);
        res.json({test: true});
    })
    
    app.listen(PORT, () => {
        console.log('Listening on', PORT);
    })
}

main().catch(err => console.error(err));

