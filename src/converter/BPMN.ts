import BPMNIOBase from "./BPMNIOBase";

export default class BPMN extends BPMNIOBase {
    public getSupportedMimetypes() {
        return ['application/x-bpmn', 'application/text+xml'];
    }

    protected getExtension() {
        return 'bpmn';
    }
}
