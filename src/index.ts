const packageInfo = require('../package.json');
import bodyParser from 'body-parser';
import express from 'express';
import parser from 'fast-xml-parser';
import temp from 'temp';
import converterManager from './converter';

const app = express();

const port = process.env.PORT || 8076;
const hostname = process.env.HOSTNAME || '127.0.0.1';

const MIMETYPE_MAPPER: {[mimetype: string]: string} = {
    'image/png': 'png',
    'application/pdf': 'pdf',
    'image/svg+xml': 'svg',
    '*/*': 'svg',
};

temp.track();

app.use(bodyParser.text({
    type: converterManager.getAllSupportedMimetypes(),
}));

app.get('/status', (req, res) => {
    res.json({
        version: packageInfo.version,
        status: 'ok',
    });
});

app.post('/preview', (req, res) => {
    const converter = converterManager.getForMimetype(req.headers['content-type']);

    if (!converter) {
        res.sendStatus(400);
        return;
    }

    const accept = req.headers['accept'] || '*/*';
    const filetype = MIMETYPE_MAPPER[accept];

    if (!filetype) {
        res.sendStatus(406);
        return;
    }

    console.log(`Request to create a ${filetype} file`);

    // we don't want to store non-xml and pass it into puppeteer
    if (parser.validate(req.body) !== true) {
        console.log('XML is not valid');

        res.sendStatus(400);
        return;
    }

    converter.convert(req.body, filetype, res);
});

app.listen(parseInt(port.toString(), 10), hostname, () => {
    console.log(`BPMN generator listening at http://${hostname}:${port}`)
});
