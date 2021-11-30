const fs = require('fs');
const { Promise } = require('node-fetch');
const { Buffer } = require('buffer');

class CertificadoCovid19HandlerHtml {
	constructor() {}

	async documentTypeCreateCommand(name, documentTypeAreaId, templateUrl, documentTypeCreateCommandUrl) {

		try {
			let template = await this.readTemplate(templateUrl);
			let attrs = [];
			let schema = this.createSchema();
			let contentBase64 = Buffer.from(template).toString('base64');
			let request = {
				name: name,
				documentTypeAreaId: documentTypeAreaId,
				contentTemplate: template,
				contentBase64Template: contentBase64,
				attrs: attrs,
				schema: JSON.stringify(schema),
			}

			fs.writeFileSync(documentTypeCreateCommandUrl, JSON.stringify(request));
		}

		catch (e) {
			console.log("error", e);
		}
	}

	async readTemplate(url) {
		return new Promise((resolve, reject) => {
			fs.readFile(url, 'utf8', function (err, data) {
				if (err) reject(err);
				resolve(data);
			})
		});
	}

	createSchema() {
		let schemaTemplate = {
			type: "object",
			properties: {
				nombre: { "$ref": "#/definitions/nombreDef" },
				apellido: { "$ref": "#/definitions/apellidoDef" },
				nro_documento: { "$ref": "#/definitions/nroDocumentoDef" },
				vacunas: { "$ref": "#/definitions/vacunasDef" },
			},
			definitions: {
				nombreDef: {
					type: "string"
				},
				apellidoDef: {
					type: "string"
				},
				nroDocumentoDef: {
					type: "string"
				},
				vacunasDef: {
					type: "array",
					items: [{
						type: "object",
						properties: {
							dosis: {
								type: "string"
							},
							marca: {
								type: "string"
							},
							lugar: {
								type: "string"
							},
							fecha_aplicacion: {
								type: "string"
							}
						}
					}]
				},
			}
		}

		return schemaTemplate;
	}

	async rendererCommandTest(templateUrl, documentTypeCreateCommandUrl) {
		try {
			let template = await this.readTemplate(templateUrl);
			let schema = this.createSchema();
			let metaInfo = this.ingestCommandMetaData("22222222222222222");

			let request = {
				template: template,
				schema: JSON.stringify(schema),
				metaInfo: JSON.stringify(metaInfo)
			}

			fs.writeFileSync(documentTypeCreateCommandUrl, JSON.stringify(request));
		}

		catch(e) {
			console.log("error", e);
		}
	}

	ingestCommand(baid, documentTypeId, ingestCommandUrl) {
		let command = {
			baid: baid,
			documentTypeId: documentTypeId,
			documentTypeAttrValues: JSON.stringify(this.ingestCommandMetaData(baid))
		}

		fs.writeFileSync(ingestCommandUrl, JSON.stringify(command));
	}

	ingestCommandMetaData(baid) {
		return {
			nombre: "Zack",
			apellido: "Lavine",
			nro_documento: baid,
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
	}
}

module.exports = CertificadoCovid19HandlerHtml;