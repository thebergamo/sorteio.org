// Carrega os arquivos .proto e deixa eles prontos
// para o uso

var ProtoBuf = require('protobufjs');
var fs = require('fs');
var path = require('path');
var folder = __dirname + '/../proto';
var protos = fs.readdirSync(folder).reduce(function(prev, cur){
    var name = cur.split('.proto')[0];
    name = name[0].toUpperCase() + name.substring(1);

    var builder = ProtoBuf.loadProtoFile(path.join(folder, cur));
    prev[name] = builder.build(name);
    return prev;
}, {});

module.exports = protos;
