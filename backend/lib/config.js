var XConf = require('xconf');
var config = new XConf();

// Carregando o arquivo principal
config.file(__dirname + '/../config/default.json');

// Carregar o arquivo de configuração de modo teste
// se estivermos em teste
if(process.env.NODE_ENV === 'coverage' || config.get('mode') === 'coverage')
  config.file(__dirname + '/../config/coverage.json');

// Carregar o arquivo de configuração do modo de produção
// se estivermos em produção
if(process.env.NODE_ENV === 'production')
  config.file(__dirname + '/../config/production.json');

module.exports = config;
