const fs = require('fs');
const { Promise } = require('node-fetch');
const { Buffer } = require('buffer');

class ResultadoTestCovidHandlerHtml {
	constructor() { }


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
				estudio: { "$ref": "#/definitions/estudioDef" },
				fecha_estudio: { "$ref": "#/definitions/fechaEstudioDef" },
				tecnica: { "$ref": "#/definitions/tecnicaDef" },
				resultado: { "$ref": "#/definitions/resultadoDef" },
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
				estudioDef: {
					type: "string"
				},
				fechaEstudioDef: {
					type: "string"
				},
				tecnicaDef: {
					type: "string"
				},
				resultadoDef: {
					type: "string"
				},
			}
		}

		return schemaTemplate;
	}

	async rendererCommandTest(templateUrl, documentTypeCreateCommandUrl) {
		try {
			let template = await this.readTemplate(templateUrl);
			let schema = this.createSchema();
			let metaInfo = this.ingestCommandMetaData("333333333333333");

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
			nombre: "Tom",
			apellido: "Brady",
			nro_documento: baid,
			estudio: "Hisopado",
			fecha_estudio: "31/12/21",
			tecnica: "PCR",
			resultado: "POSITIVO"
		}
	}
}

module.exports = ResultadoTestCovidHandlerHtml;