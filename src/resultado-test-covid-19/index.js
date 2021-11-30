//Html insumos
const ResultadoTestCovidHandlerHtml = require('./handlers/resultado-test-covid-19-handler-html'); 
let resultadoTestCovidHandlerHtml = new ResultadoTestCovidHandlerHtml();
resultadoTestCovidHandlerHtml.documentTypeCreateCommand(
    "Resultado de Test COVID-19", 
    1,
    "resource/resultado-test-covid-19.html",
    "resource/resultado-test-covid-19-document-type-create-command.json",
);
resultadoTestCovidHandlerHtml.ingestCommand("22542563", 4, "resource/resultado-test-covid-19-ingest-command.json");
resultadoTestCovidHandlerHtml.rendererCommandTest(
    "resource/resultado-test-covid-19.html",
    "resource/resultado-test-covid-19-renderer-command.json"
);

//CSV Generator
const ResultadoTestCovidHandlerCsv = require("./handlers/resultado-test-covid-19-handler-csv");
let resultadoTestCovidHandlerCsv = new ResultadoTestCovidHandlerCsv();
resultadoTestCovidHandlerCsv.generate(4, "resource/resultado-test-covid-19.csv");