# BPM Preview Service

This project provides a server to convert different BPM XML files (e.g. BPMN)
to images.

## Installation
First you need to clone this repository to an arbitrary location

    $ git clone --depth=1 https://github.com/Loydl/nc-bpm-preview-service

Make sure that you have installed [Node] (>= 12) and [Yarn] before building this
app with:

    $ yarn install && yarn build

(If you have [make] installed, you call also use `make` to execute the command
above.)

If you like to directly start the server you can do so by executing:

    $ yarn start

In production you probably want to use a process manager to keep the process
running in the background. You can use one of the recommended [process managers
for express apps][pm], or if you are on a Debian based system just execute
`make install` which will install this application to `/opt` and add it as a service.

## Configuration
You can change the bind address (hostname) and port by setting the environment
variables `HOSTNAME` and `PORT`. The default values are `127.0.0.1:8076`.

    $ PORT=3210 HOSTNAME=0.0.0.0 yarn start

## Usage
This app provides two REST endpoints.

### GET /status
This endpoint will always respond with `{ version: CURRENT_VERSION, status: 'ok' }`.

### POST /preview
This is the main endpoint to convert XML to images. It expects the xml as UTF-8
encoded payload in the body part with a correct MIME type as content type. The
client can choose between png, pdf and svg previews by setting the corresponding
MIME type as Accept header. The default return type is svg.

    $ curl -X POST -d @example/valid.bpmn -H "Accept: application/pdf" -H "Content-Type: application/x-bpmn" http://127.0.0.1:8076/preview

If the server is not able to generate a preview or the headers are invalid, it
will respond with the appropriate HTTP status code.

## Troubleshooting
If you have issues connected to puppeteer and the used headless browser, check
out their [troubleshooting
guide](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md).
One of the main issues on Debian based server systems are missing dependencies
which you can install by executing the following:

    $ apt install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0

[Node]: https://nodejs.org/en/
[Yarn]: https://yarnpkg.com
[make]: https://www.gnu.org/software/make/manual/make.html
[pm]: https://expressjs.com/en/advanced/pm.html
