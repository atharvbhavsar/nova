const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Raam_Resume_Email_Test.pdf'));

doc.fontSize(25).text('Raam Resume', 100, 100);
doc.moveDown();
doc.fontSize(12).text('Name: Raam');
doc.text('Email: aryangupta25813@gmail.com');
doc.moveDown();
doc.text('Here is my Blockchain Credential for Verification:');
doc.moveDown();
doc.fontSize(10).text('Credential ID: 80571639392973264744067549985550927479315518476553747411298233012711113490626');

doc.end();
console.log('PDF generated successfully as Raam_Resume_Email_Test.pdf');
