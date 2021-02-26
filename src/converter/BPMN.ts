import { Response } from "express";
import temp from "temp";
import fs from "fs";
import { ConverterInterface } from "./ConverterInterface";

const { convertAll } = require('bpmn-to-image')

export default class BPMN implements ConverterInterface {
    getSupportedMimetypes() {
        return ['application/x-bpmn', 'application/text+xml'];
    }

    convert(content: string, filetype: string, res: Response) {
        const inputFile = temp.path({ suffix: '.xml' });
        const outputFile = temp.path({ suffix: '.' + filetype });

        fs.writeFileSync(inputFile, content);

        convertAll([{
            input: inputFile,
            outputs: [outputFile]
        }], {
            footer: false,
            title: false,
        }).then(() => {
            console.log('Preview successfully created');

            res.sendFile(outputFile, () => {
                fs.unlink(inputFile, err => err && console.warn(err));
                fs.unlink(outputFile, err => err && console.warn(err));
            });
        }).catch(() => {
            fs.unlink(inputFile, () => { });

            console.log('XML could not be parsed');

            res.status(400).json({
                message: 'XML could not be parsed',
            });
        });
    }
}