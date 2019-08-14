const hummus = require('hummus');
const memoryStreams = require('memory-streams');

/**
 * Concatenate two PDFs in Buffers
 * @param {Buffer} firstBuffer 
 * @param {Buffer} secondBuffer 
 * @returns {Buffer} - a Buffer containing the concactenated PDFs
 */
const combinePDFBuffers = (buffers) => {
    var outStream = new memoryStreams.WritableStream();

    try {
        var firstPDFStream = new hummus.PDFRStreamForBuffer(buffers.shift());
        // var secondPDFStream = new hummus.PDFRStreamForBuffer(secondBuffer);

        var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
        // pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
        
        buffers.forEach(element => {
            var PDFStream = new hummus.PDFRStreamForBuffer(element);
            pdfWriter.appendPDFPagesFromPDF(PDFStream);
        });
        pdfWriter.end();
        var newBuffer = outStream.toBuffer();
        outStream.end();

        return newBuffer;
    }
    catch(e){
        outStream.end();
        throw new Error('Error during PDF combination: ' + e.message);
    }
};

module.exports = combinePDFBuffers