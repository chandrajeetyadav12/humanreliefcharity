import pdfMake from "pdfmake/build/pdfmake";

export const loadHindiFont = async () => {

    const response = await fetch(
        "/fonts/NotoSansDevanagari-Regular.ttf"
    );

    const fontArrayBuffer =
        await response.arrayBuffer();

    let binary = "";

    const bytes = new Uint8Array(fontArrayBuffer);

    const length = bytes.byteLength;

    for (let i = 0; i < length; i++) {

        binary += String.fromCharCode(bytes[i]);
    }

    const base64Font = btoa(binary);

    pdfMake.vfs = {

        ...pdfMake.vfs,

        "NotoSansDevanagari-Regular.ttf":
            base64Font,
    };

    pdfMake.fonts = {

        NotoSansDevanagari: {

            normal:
                "NotoSansDevanagari-Regular.ttf",

            bold:
                "NotoSansDevanagari-Regular.ttf",

            italics:
                "NotoSansDevanagari-Regular.ttf",

            bolditalics:
                "NotoSansDevanagari-Regular.ttf",
        },
    };
};