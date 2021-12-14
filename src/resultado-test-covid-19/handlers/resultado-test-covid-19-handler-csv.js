const fetch = require('node-fetch');
const Parser = require('json2csv').Parser;
const fs = require('fs');
//const Ajv = require("ajv")

class ResultadoTestCovidHandlerCsv {

	constructor() { }

	async datasource() {
		return new Promise((resolve, reject) => {
			resolve([
				{
					nombre: "Tom",
					apellido: "Brady",
					nro_documento: "22542653",
					estudio: "Hisopado2",
					fecha_estudio: "31/12/21",
					tecnica: "PCR2",
					resultado: "POSITIVO2"
				}
			]);
		});
	}

	async generate(documentTypeId, url) {
		try {
			let datasource = await this.datasource();
			let datasourceMap = await this.datasourceMap(datasource, documentTypeId);
			if (datasourceMap.length == 0) {
				console.log("DatasourceEmptyException");
				return;
			}

			fs.writeFileSync(url, datasourceMap);
		}
		catch (e) {
			console.log("generate errror", e);
		}
	}

	async datasourceMap(datasource, documentTypeId) {
		let fields = ['baID', 'documentTypeId', 'contenido'];
		let opts = { fields };
		let parser = new Parser(opts);
		const csv = parser.parse(datasource
			.map(itemDatasource => {
				let content = this.makeContent(itemDatasource);
				return {
					baID: itemDatasource.nro_documento,
					documentTypeId: documentTypeId,
					contenido: JSON.stringify(content)
				}
			})
			.filter(x => x.baID != "_")
		);

		return fields.map(x => `"${x}"`).join(",") == csv ? "" : csv;
	}

	makeContent(itemDatasource) {
		let content = {
			nombre: itemDatasource.nombre,
			apellido: itemDatasource.apellido,
			nro_documento: itemDatasource.nro_documento,
			estudio: itemDatasource.estudio,
			fecha_estudio: itemDatasource.fecha_estudio,
			tecnica: itemDatasource.tecnica,
			resultado: itemDatasource.resultado
		}
		return content;
	}
}

module.exports = ResultadoTestCovidHandlerCsv;