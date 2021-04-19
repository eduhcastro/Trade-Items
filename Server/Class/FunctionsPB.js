const chalk = require('chalk');
class FunctionsPB {

    SessionReconnect(s ,u ,j2){
        var data = j2.find({sessionkey: s}).value()
        if(data != undefined && (data.reconnect == true)){
            if(data.participant == u){
                return 0 // OK
            }
            return 1 //  Intruso
        }
        return 2 // Tunel OK
    }

    TypeUser(u, s, j2) {
        var Items = new Array();
        var Dono = j2.find({
            sessionkey: s
        }).value().owner
        if (Dono == u) {
            Items['status'] = 0
            Items['dono'] = Dono
            return Items
        }
        Items['status'] = 1
        Items['dono'] = Dono
        return Items
    }

    GetItemsRecive(e, s, j4, j6, j2) {
        var Items = new Array();
        var FI = j4.find({
            id: parseInt(e["item"]),
            owneritem: e["user"]
        }).value()
        if (FI == undefined) {
            Items['status'] = 0
            return Items // Item Não Encontrando
        }
        var UserOwner = this.TypeUser(e["user"], s, j2).status == 0 ? true : false
        try {
            j6.push({
                session: s,
                weaponnid: FI.id,
                itemname: FI.itemname,
                itemcount: FI.itemcount,
                itemimg: FI.itemimg,
                owneritem: FI.owneritem,
                ownertrade: UserOwner,
                itemprice: FI.itemprice
            }).write()
            Items['status'] = 1
            Items['items'] = FI
            return Items
        } catch (e) {
            console.log(e)
            return 2
        }
    }

    SendAllItensToReconnect(s, j6){
        var ii = j6.value()
        var array = []
        ii.forEach(i => {
            if (i.session == s) {
                array.push(i)
            }
        });
        return array
    }



    RemoveItemsTrade(d, s, j6){
        var item = j6.find({session: s, owneritem: d["user"], weaponnid: parseInt(d["item"])}).value()
        if(item != undefined){
            j6.remove({session: s, owneritem: d["user"], weaponnid: parseInt(d["item"])}).write()
            return item.itemprice
      }
      return 1
    }

    CountItemTrade(e, s, j4){
        var array = []
        j4.value().forEach(i => {
            if (i.owneritem == e["user"] && i.session == s) {
                array.push(i.itemprice)
            }
        });
        return array
    }
    CountItemsCourrentTrade(s, j4){
        var item = j4.find({session: s}).value()
        if(item != undefined){
            return true
        }
        return false
    }

    IsReconnect(s, j2){
        var recoonnect = j2.find({sessionkey: s}).value().reconnect
        if(recoonnect == false){
            j2.find({sessionkey: s}).assign({reconnect: true}).write()
            return 0
        }else{
            j2.find({sessionkey: s}).assign({reconnect: false}).write()
            return 1
        }
    }

    GetUser(s, u, j2) {
        var usr1 = j2.find({
            sessionkey: s,
            owner: u
        }).value();
        var usr2 = j2.find({
            sessionkey: s,
            participant: u
        }).value();
        if (usr1 != undefined) {
            return chalk.redBright.bold('[EXIT] ') + chalk.whiteBright.bold('O Dono da trade saiu')
        }
        if (usr2 != undefined) {
            j2.find({
                sessionkey: s,
                participant: u
            }).assign({
                participant: null
            }).write()
            return chalk.redBright.bold('[EXIT] ') + chalk.whiteBright.bold('O Participante saiu da trade')
        }
    }

    Items(u ,j4) {
        var ii = j4.value()
        var array = []
        ii.forEach(i => {
            if (i.owneritem == u) {
                array.push(i)
            }
        });
        return array
    }


    UserOnline(s, m, j2, io) {
        if (m == 0) {
            var VerifySession = j2.find({
                sessionkey: s
            }).value();
            if (VerifySession.online == 2) {
                return chalk.yellowBright.bold('[ALERT] ') + chalk.whiteBright.bold('Já existem 2 pessoas Online')
            }
            var Sum = parseInt(VerifySession.online) + 1
            j2.find({
                sessionkey: s
            }).assign({
                online: Sum
            }).write()
            io.emit(`${s}stats`, Sum)
            return chalk.greenBright.bold('[OK] ') + chalk.whiteBright.bold('Somado, agora a Sessão (' + chalk.redBright.bold(s) + ') possui (' + chalk.redBright.bold(Sum) + ') usuario(s) online')
        }
        if (m == 1) {
            var VerifySession = j2.find({
                sessionkey: s
            }).value();
            if (VerifySession.online == 0) {
                return 'Não é possivel diminuir o que já é 0 * Sessao: (' + s + ')'
            }
            var Sum = parseInt(VerifySession.online) - 1
            j2.find({
                sessionkey: s
            }).assign({
                online: Sum
            }).write()
            io.emit(`${s}stats`, Sum)
            return chalk.redBright.bold('[EXIT] ') + chalk.whiteBright.bold('Subtraido, agora a Sessão (' + chalk.redBright.bold(s) + ') possui (' + chalk.redBright.bold(Sum) + ') usuario(s) online')
        }

    }

    ParticipanteVerifiy(user) {
        var Userx = user != null ? true : false
        return Userx
    }

    CheckMyMoney(u,j3){
        return j3.find({login: u}).value().money
    }

    UserReadCheck(s,j2){
        var check = j2.find({sessionkey: s}).value()
        if(check.ownerdone == true || check.participantdone == true){
            return 0
        }
        return 1
    }

    UserReadPart1(d1, s, j2, t){
       // if(j6.find({session: s, owneritem: d1["user"]}).value() == undefined){
       //     return 0 // NAO ACHOU ITEMS DESSE USUARIO NA TRADE 
       // }
      if(t == 0){
        if(d1["done"] == true){
            j2.find({sessionkey: s}).assign({ownerdone: true}).write()
            j2.find({sessionkey: s}).assign({participantdone: true}).write()
                 return 1
                         }else{
            j2.find({sessionkey: s}).assign({ownerdone: false}).write()
            j2.find({sessionkey: s}).assign({participantdone: false}).write()
              return 2
       }
    }else{
        if(j2.find({sessionkey: s, owner: d1["user"]}).value() != undefined){
            j2.find({sessionkey: s}).assign({ownerdone: d1["done"]}).write()
            return 3
        }
        if(j2.find({sessionkey: s, participant: d1["user"]}).value() != undefined){
            j2.find({sessionkey: s}).assign({participantdone: d1["done"]}).write()
            return 4
        }
    }
}




    VerifyTwoTrue(s, j2, j4, j6){
        var users = j2.find({sessionkey: s}).value()
        if(users.ownerdone == true && (users.participantdone == true)){
          var OwnerNick = users.owner
          var ParticipantNick = users.participant
          var OwnerItems = this.Items(OwnerNick, j6)
          var ParticipantItems = this.Items(ParticipantNick, j6)
          OwnerItems.forEach(items =>{
              j4.push({
               "id": items.weaponnid,
               "itemname": items.itemname,
               "itemcount": items.itemcount,
               "itemimg": items.itemimg,
               "owneritem": ParticipantNick,
               "itemprice": items.itemprice
              }).write()
           j4.remove({id: items.weaponnid, owneritem: OwnerNick}).write()
          })
          ParticipantItems.forEach(items =>{
           j4.push({
            "id": items.weaponnid,
            "itemname": items.itemname,
            "itemcount": items.itemcount,
            "itemimg": items.itemimg,
            "owneritem": OwnerNick,
            "itemprice": items.itemprice
           }).write()
           j4.remove({id: items.weaponnid, owneritem: ParticipantNick}).write()
       })
            return 0
        }
        return 1
    }

}
module.exports = FunctionsPB;