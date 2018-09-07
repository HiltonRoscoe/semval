import OclEngine from "@stekoe/ocl.js";
export class OclEngineFactory {
    public static getOclEngine() {
        const oclEngine = new OclEngine();
        oclEngine.setTypeDeterminer((obj: any) => {
            // get ocl context name from JSON schema @type
            if (obj) {
                // remove the VRI. prefix. This will need to be handled better.
                let ctx = obj["@type"] != undefined ? obj["@type"].split(".")[1] : undefined;
                return ctx;
            }
        });
        return oclEngine;
    }
}