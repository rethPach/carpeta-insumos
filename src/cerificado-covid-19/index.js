//Html insumos
const CertificadoCovid19HandlerHtml = require('./handlers/cerificado-covid-19-handler-html'); 
let certificadoCovid19HandlerHtml = new CertificadoCovid19HandlerHtml();
certificadoCovid19HandlerHtml.documentTypeCreateCommand(
    "Certificado COVID-19", 
    1,
    "resource/cerificado-covid-19.html",
    "resource/cerificado-covid-19-document-type-create-command.json",
);
certificadoCovid19HandlerHtml.ingestCommand("19371552", 2, "resource/cerificado-covid-19-ingest-command.json");
certificadoCovid19HandlerHtml.rendererCommandTest(
    "resource/cerificado-covid-19.html",
    "resource/cerificado-covid-19-renderer-command.json"
);

//CSV Generator
const CertificadoCovid19HandlerCsv = require("./handlers/cerificado-covid-19-handler-csv");
let certificadoCovid19HandlerCsv = new CertificadoCovid19HandlerCsv();
certificadoCovid19HandlerCsv.generate(2, "resource/cerificado-covid-19.csv");
