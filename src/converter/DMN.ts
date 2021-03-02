import BPMNIOBase from "./BPMNIOBase";

export default class DMN extends BPMNIOBase {
    public getSupportedMimetypes() {
        return ['application/x-dmn', 'application/text+xml'];
    }

    protected getExtension() {
        return 'dmn';
    }
}
