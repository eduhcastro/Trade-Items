module.exports = function(io, chalk, Getting, ClassPB) {
    io.sockets.on('connect', function(socket) {
        var Stringg = socket.handshake.headers.referer
        try {
            var Sessao = Stringg.split("https://trade-castroms.herokuapp.com/trade?session=")
            var Splitado = Sessao[1].split("&user=")
            var SessaoCorreta = Splitado[0]
            var UsuarioCorreto = Splitado[1]
        } catch (e) {
            var Sessao = Stringg.split("https://trade-castroms.herokuapp.com/trade?user=")
            var Splitado = Sessao[1].split("&session=")
            var SessaoCorreta = Splitado[1]
            var UsuarioCorreto = Splitado[0]
        }
        var counter = 8
        if(ClassPB.SessionReconnect(SessaoCorreta, UsuarioCorreto, Getting.Session) == 0 && (ClassPB.TypeUser(UsuarioCorreto, SessaoCorreta, Getting.Session).status == 1)){

            io.emit(`${SessaoCorreta}recivereconnect`, {items: ClassPB.SendAllItensToReconnect(SessaoCorreta,Getting.Trade), user:UsuarioCorreto})
            //console.log('Foi uma tentativa de reconexao!')
            console.log(ClassPB.UserOnline(SessaoCorreta, 0, Getting.Session, io)) // SOMANDO
            
            socket.on(`${SessaoCorreta}myname`, function(data) {
                var UserDetails = ClassPB.TypeUser(data.my, SessaoCorreta, Getting.Session)
                io.emit(`${SessaoCorreta}useritems`, {
                    items: ClassPB.Items(data.my, Getting.Items),
                    type: UserDetails.status,
                    money: ClassPB.CheckMyMoney(data.my, Getting.Users),
                    user: data.my,
                    reconn: true
                })
                if (data.my != UserDetails.dono) {
                    io.emit(`owneritems${SessaoCorreta}${data.my}`, {
                        items: ClassPB.Items(UserDetails.dono, Getting.Items),
                        type: UserDetails.status,
                        reconn: true
                    })
                }
            });
            ClassPB.IsReconnect(SessaoCorreta, Getting.Session) // TORNANDO RECONEXAO FALSE
        }else{
        console.log(ClassPB.UserOnline(SessaoCorreta, 0, Getting.Session, io)) // SOMANDO USUARIO ONLINE NA SESSAO
        //console.log('Usuario = ' + socket.id + ' Conectado na Sessão = ' + SessaoCorreta + ' Nick = ' + UsuarioCorreto)

        socket.on(`${SessaoCorreta}myname`, function(data) {
            var UserDetails = ClassPB.TypeUser(data.my, SessaoCorreta, Getting.Session)
            io.emit(`${SessaoCorreta}useritems`, {
                items: ClassPB.Items(data.my, Getting.Items),
                type: UserDetails.status,
                money: ClassPB.CheckMyMoney(data.my, Getting.Users),
                user: data.my,
                reconn: false
            })
            if (data.my != UserDetails.dono) {
                io.emit(`owneritems${SessaoCorreta}${data.my}`, {
                    items: ClassPB.Items(UserDetails.dono, Getting.Items),
                    type: UserDetails.status,
                    reconn: false
                })
            }
        });
     }

        socket.on(`${SessaoCorreta}getweapons`, function(data) {
            if(ClassPB.UserReadCheck(SessaoCorreta, Getting.Session) == 0){
                var details = {user: data["user"], done: false}
                var datax = {user: data["user"]} // BUG, ELE TA SETANDO TRUE NOS DOIS USUARIOS, E NAO TA TRANSFORMANDO EM FALSE
                console.log(ClassPB.UserReadPart1(details, SessaoCorreta, Getting.Session, 0))
                io.emit(`${SessaoCorreta}userreadyresultremove`,{datax})
                console.log('REMOVEU COM O USUARIO PRONTO')
            }
           if(data.type == 0){
           var GetItems = ClassPB.GetItemsRecive(data, SessaoCorreta, Getting.Items, Getting.Trade, Getting.Session)
           if (GetItems.status == 1) {
           var countItemsTrade = ClassPB.CountItemTrade(data,SessaoCorreta,Getting.Trade)
           var CountItemsComplete = countItemsTrade.reduce(SumItems)
           function SumItems(i,y){
               return i + y
           }
               io.emit(`${SessaoCorreta}reciveitems`, {
                   user: data["user"],
                   Item: GetItems.items,
                   Count: data["count"],
                   Values: CountItemsComplete
               })
               console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.whiteBright.bold(`O Usuario (${data["user"]}) Adicionou o Item (${data["item"]})`))
           }
       }else{
           var subItemsTrade = ClassPB.CountItemTrade(data,SessaoCorreta,Getting.Trade)
           if(subItemsTrade.length > 1){
           var subItemsComplete = subItemsTrade.reduce(subItems)
           function subItems(i,y){
               return i + y
               }
            var ValueSub =  subItemsComplete - ClassPB.RemoveItemsTrade(data, SessaoCorreta, Getting.Trade)
            }else{ 
                var ValueSub = 0; 
                ClassPB.RemoveItemsTrade(data, SessaoCorreta, Getting.Trade)
            }
           // ClassPB.RemoveItemsTrade(data, SessaoCorreta, Getting.Trade) // REMOVENDO ITEM DA TRADE
           io.emit(`${SessaoCorreta}removeitems`, {
               user: data["user"],
               Item: data["item"],
               Count: data["count"],
               Values: ValueSub
           })
           console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.whiteBright.bold(`O Usuario (${data["user"]}) Removeu o Item (${data["item"]})`))
               }
        })


        socket.on(`${SessaoCorreta}userready`, function(data){
            ClassPB.UserReadPart1(data, SessaoCorreta, Getting.Session, 1)
            io.emit(`${SessaoCorreta}userreadyresult`,{data})
            if(ClassPB.VerifyTwoTrue(SessaoCorreta, Getting.Session, Getting.Items, Getting.Trade) == 0){
                io.emit(`${SessaoCorreta}tradesuccess`,{data})
                Getting.Trade.remove({session: SessaoCorreta}).write() // LIMPANDO ITEMS DA TRADE
                Getting.Session.find({sessionkey: SessaoCorreta}).assign({ownerdone: false, participantdone: false}).write() // TORNANDO PRONTO FALSE
                console.log('TROCA FEITA')
            }
        })
        
        socket.on('disconnect', function() {
            if(ClassPB.CountItemsCourrentTrade(SessaoCorreta, Getting.Trade) == true){
            ClassPB.IsReconnect(SessaoCorreta, Getting.Session) // TORNANDO RECONEXAO TRUE
            console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.redBright.bold('[EXIT] ')+ chalk.whiteBright.bold('Existia items na trade quando o usuario kitou '))
            //console.log('Usuario = ' + socket.id + ' Desconectado na Sessão = ' + SessaoCorreta + ' Nick = ' + UsuarioCorreto)
            //console.log(ClassPB.GetUser(SessaoCorreta, UsuarioCorreto, Getting.Session)) // RETIRA O USER DA TABELA, COLUNA!
            console.log(ClassPB.UserOnline(SessaoCorreta, 1, Getting.Session, io)) // SOMA E RETIRA USUARIO ONLINE
            function Conut() {
                if(Getting.Session.find({sessionkey: SessaoCorreta}).value().online == 2){
                    io.emit(SessaoCorreta + 'disconnectcountdown', {time: counter, user: UsuarioCorreto, status: true})
                    console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.greenBright.bold('[RECONEXAO] ')+ chalk.whiteBright.bold('Conexão restabelecida Sessao '+chalk.redBright.bold(SessaoCorreta)+' Retomada'))
                    clearInterval(CountParticipante)
                    return;
                }
                counter--;
                if (counter == 0) {
                    io.emit(SessaoCorreta + 'disconnectcountdown', {time: 0, user: UsuarioCorreto, status: false})
                    console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.redBright.bold('[RECONEXAO] ')+ chalk.whiteBright.bold('Tempo limite atingido, Sessao '+chalk.redBright.bold(SessaoCorreta)+' Resetada'))
                    //console.log(ClassPB.UserOnline(SessaoCorreta, 1, Getting.Session, io)) // SOMA E RETIRA USUARIO ONLINE
                    console.log(ClassPB.IsReconnect(SessaoCorreta, Getting.Session)) // TORNANDO RECONEXAO FALSE
                    console.log(ClassPB.GetUser(SessaoCorreta, UsuarioCorreto, Getting.Session))
                    Getting.Trade.remove({session: SessaoCorreta}).write() // REMOVENDO TODOS OS ITEMS DA SESSAO
                    clearInterval(CountParticipante)
                    return;
                } else {
                    io.emit(SessaoCorreta + 'disconnectcountdown', {time: counter, user: UsuarioCorreto, status: false})
                    console.log(chalk.yellowBright.bold('[AVISO] ') + chalk.whiteBright.bold('O Usuario '+chalk.redBright.bold(UsuarioCorreto)+' tem '+chalk.redBright.bold(counter)+'s Para se conectar na sessão ' + chalk.redBright.bold(SessaoCorreta)))
                }
            }
            
            CountParticipante = setInterval(Conut, 1000);

            io.emit(SessaoCorreta + 'disconnect', {
                user: ClassPB.TypeUser(UsuarioCorreto, SessaoCorreta, Getting.Session).status,
                level: 1
            })
        }else{
            console.log(chalk.yellowBright.bold('[INFORMACAO] ') + chalk.redBright.bold('[EXIT] ')+ chalk.whiteBright.bold('Não existia items na trade quando o usuario kitou'))
            //console.log('Usuario = ' + socket.id + ' Desconectado na Sessão = ' + SessaoCorreta + ' Nick = ' + UsuarioCorreto)
            console.log(ClassPB.GetUser(SessaoCorreta, UsuarioCorreto, Getting.Session)) // RETIRA O USER DA TABELA, COLUNA!
            console.log(ClassPB.UserOnline(SessaoCorreta, 1, Getting.Session, io)) // SOMA E RETIRA USUARIO ONLINE
            io.emit(SessaoCorreta + 'disconnect', {
                user: ClassPB.TypeUser(UsuarioCorreto, SessaoCorreta, Getting.Session).status,
                level: 0
            })
        }
        })
    })
}
