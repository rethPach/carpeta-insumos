const fetch = require('node-fetch');
const Parser = require('json2csv').Parser;
const fs = require('fs');
//const Ajv = require("ajv")

class CertificadoCovid19HandlerCsv {

	constructor() { }

	async datasource() {
		return new Promise((resolve, reject) => {
			resolve([
				{
					nombre: "Jamal",
					apellido: "Crawford",
					nro_documento: "99.999.999",
					vacunas: [
						{ 
							dosis: "1", 
							marca: "ASTRAZENECA", 
							lugar: "Usina del Arte, CABA",
							fecha_aplicacion: "17/03/21" 
						},
						{ 
							dosis: "2", 
							marca: "ASTRAZENECA", 
							lugar: "CVS Pharmacy, Miami, EE.UU. - Este dato fue declarado por la persona",
							fecha_aplicacion: "13/06/21" 
						}
					]
				}
			]);
		});
	}

	async generate(documentTypeId, url) {
		try {
			let datasource = await this.datasource();
			let documentTypeResponse = await this.documentType(documentTypeId);
			let documentType = documentTypeResponse.data;
			if (!documentType) {
				return;
			};

			let datasourceMap = await this.datasourceMap(datasource, documentType);
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

	async datasourceMap(datasource, documentType) {
		let fields = ['baID', 'documentTypeId', 'contenido'];
		let opts = { fields };
		let parser = new Parser(opts);
		const csv = parser.parse(datasource
			.map(itemDatasource => {
				let content = this.makeContent(itemDatasource);
				return {
					baID: itemDatasource.nro_documento,
					documentTypeId: documentType.id,
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
			vacunas: itemDatasource.vacunas.map(vacuna=>{
				return { 
					dosis: vacuna.dosis,
					marca: vacuna.marca,
					lugar: vacuna.lugar,
					fecha_aplicacion: vacuna.fecha_aplicacion
				}
			})
		}
		return content;
	}

	async documentType(id) {
		return fetch("http://localhost:9090/api/document-type/find/" + id).then(response => response.json());
	}


	datasourceErr(error) {
		console.log("Datasource error...", error);
	}
}

module.exports = CertificadoCovid19HandlerCsv;