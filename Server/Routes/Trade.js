module.exports = function(app, path, io, chalk, Getting, ClassPB) {
    app.get("/trade", function(req, res) {
        var sessionkey = req.query.session
        var VerifySession = Getting.Session.find({
            sessionkey: sessionkey
        }).value();
        /////////////////// VERIFICANDO SESSAO /////////////////////////
        var user = req.query.user;
        var UsuarioLogin = Getting.Users.find({
            login: user
        }).value()
        if (UsuarioLogin != null && VerifySession != undefined) {
            /////////////////// VERIFICANDO SESSAO /////////////////////

            var Dono = Getting.Session.find({
                sessionkey: sessionkey
            }).value().owner
            var Participante = Getting.Session.find({
                sessionkey: sessionkey
            }).value().participant
            var Participantes = Getting.Session.find({
                sessionkey: sessionkey
            }).value().online

            if (ClassPB.ParticipanteVerifiy(Participante) == false && (user != Dono)) {

                if (Participantes == 0) {
                    res.sendFile(path.join(__dirname, '../../', '/Client/Routes/owneraus.html'));
                } else {
                    console.log(chalk.greenBright.bold('[JOINED] ') + chalk.whiteBright.bold('Um usuario da trade entrou no link'))
                    res.sendFile(path.join(__dirname, '../../', '/Client/Routes/trade.html'));
                    io.emit('useritems' + sessionkey + '', ClassPB.Items(user, Getting.Items))
                    Getting.Session.find({
                        sessionkey: sessionkey
                    }).assign({
                        participant: user
                    }).write()
                }
            } else if (user == Dono) {
                console.log(chalk.greenBright.bold('[JOINED] ') + chalk.whiteBright.bold('O Dono da trade entrou no link'))
                res.sendFile(path.join(__dirname, '../../', '/Client/Routes/trade.html'));
            } else if (user == Participante) {
                console.log(chalk.greenBright.bold('[JOINED] ') + chalk.whiteBright.bold('O Usuario está tentando se reconectar'))
                res.sendFile(path.join(__dirname, '../../', '/Client/Routes/trade.html'));
            } else {
                console.log(chalk.redBright.bold('[KICK] ') + chalk.whiteBright.bold('Um usuario já está na trade, quem sabe na proxima?..'))
                res.sendFile(path.join(__dirname, '../../', '/Client/Routes/Execdeu.html'));
            }
        }
    })
}