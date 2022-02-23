const fs = require('fs');
const path = require('path');
const Parser = require('json2csv').Parser;
const archiver = require('archiver');


generateInsumo("resource/binaries/insumo.csv", "4234234232", "20");

function generateInsumo(url, baid, documentId) {
	let filenames = fs.readdirSync(path.join(__dirname, "resource/binaries"));
	let csv = createCsv(baid, documentId, filenames);
	fs.writeFileSync(url, csv);
	zipDirectory("resource/binaries", "resource/insumo.zip");
}

function createCsv(baid, documentId, files) {
	let fields = ['baID', 'documentTypeId', 'contenido', 'filename'];
	let opts = { fields };
	let parser = new Parser(opts);

	let datasource = files.filter(removeInsumo).map((filename, index)=>{
		let filenameTest = [0,1,2].indexOf(index)>-1 ? files[0] : filename;
		filenameTest = index == 4 ? "pedro" : filename;
		return {
			baID: baid,
			documentTypeId: documentId,
			contenido: createContentPlaceholder(index),
			filename: filenameTest
		};
	});

	return parser.parse(datasource);
}

function removeInsumo(filename) {
	return filename.toLowerCase().indexOf(".csv")==-1;
}

function createContentPlaceholder(index) {
	return {
		attr_a: "attr_a" + index,
		attr_b: "attr_b" + index,
		attr_c: "attr_c" + index,
		attr_d: "attr_d" + index
	}
}

function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}