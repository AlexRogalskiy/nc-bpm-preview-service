import BPMN from "./BPMN";
import { ConverterInterface } from "./ConverterInterface";


class ConverterManager {
    private converters: {[mimetype: string]: ConverterInterface} = {};

    public register(converter: ConverterInterface) {
        converter.getSupportedMimetypes().forEach(mimetype => this.converters[mimetype] = converter);
    }

    public getForMimetype(mimetype?: string) {
        return mimetype ? this.converters[mimetype] : undefined;
    }

    public getAllSupportedMimetypes() {
        return Object.keys(this.converters);
    }
}

const converterManager = new ConverterManager();

converterManager.register(new BPMN());

export default converterManager;