const bonjour = require('bonjour')();
const io = require('socket.io-client');

let browser;

const main = async () => {
    browser = bonjour.find({ type: 'http' });
    browser.on('up', (service) => {
        if (service.name === 'DO:PLUGINS') {
            console.log('service up', service);
            const socket = io(`http://localhost:${service.port}`);
            socket.on('connect', (e) => {
                console.log('Connected', e);
            });
            socket.on('disconnect', (e) => {
                console.log('Disconnected', e);
            });
            socket.on('register', () => {
                socket.emit('register', {
                    name: 'Test Plugin',
                    description: 'A super cool test plugin!',
                    command: 'test'
                });
            });
            socket.on('command', command => {
                console.log(command);
            });
        }
    });
    browser.on('down', (service) => {
        if (service.name === 'DO:PLUGINS') {
            console.log('service down...', service);
        }
    });
    setInterval(() => {
        browser.update();
    }, 1000);
}

main().catch(err => console.error(err));

