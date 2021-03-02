import BPMN from "./BPMN";
import { ConverterInterface } from "./ConverterInterface";
import DMN from "./DMN";


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
converterManager.register(new DMN());

export default converterManager;