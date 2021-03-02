import { Response } from "express";
import temp from "temp";
import fs from "fs";
import { ConverterInterface } from "./ConverterInterface";

const { convertAll } = require('bpmn-to-image')

export default abstract class BPMNIOBase implements ConverterInterface {
    public abstract getSupportedMimetypes(): string[]

    protected abstract getExtension(): string

    public convert(content: string, filetype: string, res: Response) {
        const inputFile = temp.path({ suffix: '.' + this.getExtension() });
        const outputFile = temp.path({ suffix: '.' + filetype });

        fs.writeFileSync(inputFile, content);

        console.log({inputFile, outputFile})

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
        }).catch((err: Error) => {
            if (fs.existsSync(inputFile)) {
                fs.unlink(inputFile, () => { });
            }

            console.log('Could not convert file: ' + err.toString());

            res.status(500).json({
                message: err.toString(),
            });
        });
    }
}
