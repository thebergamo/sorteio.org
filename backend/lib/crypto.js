var fs = require('fs');
var ursa = require('ursa');
var toPEM = require('ssh-key-to-pem');

var key = {
    public : toPEM(fs.readFileSync(__dirname + '/../key/id_rsa.pub', 'utf8')),
    private : fs.readFileSync(__dirname + '/../key/id_rsa', 'utf8')
};

exports.encrypt = function(payload, type){
    var engine = ursa.createPublicKey(key.public);

    return engine.encrypt(new Buffer(payload),
    type);
};

exports.decrypt = function(payload, type){
    var engine = ursa.createPrivateKey(key.private);

    return engine.decrypt(new Buffer(payload),
    type);
};
