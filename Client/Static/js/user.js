var socket = io("http://localhost:3000");

const TradeApi = {
    SessaoTrade: `${getParameterByName('session')}stats`,
    Disconectado: `${getParameterByName('session')}disconnect`,
    DisconectadoCountDown: `${getParameterByName('session')}disconnectcountdown`,
    UserItems: `${getParameterByName('session')}useritems`,
    OwnerItems: `owneritems${getParameterByName('session')}${getParameterByName('user')}`,
    MyName: `${getParameterByName('session')}myname`,
    GetWeapons: `${getParameterByName('session')}getweapons`,
    ReciveItems: `${getParameterByName('session')}reciveitems`,
    RemoveItems: `${getParameterByName('session')}removeitems`,
    ReciveReconnect: `${getParameterByName('session')}recivereconnect`,
    UserIsReady: `${getParameterByName('session')}userready`,
    UserIsReadyStatus: `${getParameterByName('session')}userreadyresult`,
    UserIsReadyRemove: `${getParameterByName('session')}userreadyresultremove`,
    TradeSuccess: `${getParameterByName('session')}tradesuccess`,

}

var ItemsUser = {};

ItemsUser.renderPrize = function(id, nome, count, img, dono, price) {
    var tpl = "";
    tpl += `<div data-v-13d367a4="${id}" data-weaponiden= "${id}"class="item chifre" style="background-image: url('/imgs/items/${img}');">`;
    tpl += '	<span data-v-13d367a4=""  data-timeowner="' + count + '" class="tl">' + count + ' DAYS</span>';
    tpl += `<span data-v-13d367a4="" data-priceowner="${price}" class="p">${formatter.format(price)}</span>`;
    tpl += '<span data-v-13d367a4="" data-nameowner="' + nome + '" class="ex">' + nome + '</span>';
    tpl += '</div>';
    if (dono != getParameterByName('user')) {
        $(".panel-block.items.is-paddingless.xyz").append(tpl);
    } else {
        $(".panel-block.items.owner").append(tpl);
    }
};

ItemsUser.renderPrizeMe = function(id, nome, count, img, dono, price) {
    var tpl = "";
    tpl += `<div data-v-13d367a4="${id}" data-weaponiden= "${id}"class="item chifre" style="background-image: url('/imgs/items/${img}');">`;
    tpl += '	<span data-v-13d367a4=""  data-timeowner="' + count + '" class="tl">' + count + ' DAYS</span>';
    tpl += `<span data-v-13d367a4="" data-priceowner="${price}" class="p">${formatter.format(price)}</span>`;
    tpl += '<span data-v-13d367a4="" data-nameowner="' + nome + '" class="ex">' + nome + '</span>';
    tpl += '</div>';
    $(".panel-block.items.is-paddingless.youoffer").append(tpl);
};


ItemsUser.renderPrizeRe = function(id, nome, count, img, dono, price) {
    var tpl = "";
    tpl += `<div data-v-13d367a4="${id}" data-weaponiden= "${id}"class="item chifre" style="background-image: url('/imgs/items/${img}');">`;
    tpl += '	<span data-v-13d367a4=""  data-timeowner="' + count + '" class="tl">' + count + ' DAYS</span>';
    tpl += `<span data-v-13d367a4="" data-priceowner="${price}" class="p">${formatter.format(price)}</span>`;
    tpl += '<span data-v-13d367a4="" data-nameowner="' + nome + '" class="ex">' + nome + '</span>';
    tpl += '</div>';
    if (dono != getParameterByName('user')) {
        $(".panel-block.items.is-paddingless.xyz").append(tpl);
    } else {
        $(".panel-block.items.owner").append(tpl);
    }
};

ItemsUser.rank = function(items) {
    items.forEach(function(item) {
        ItemsUser.renderPrize(
            item.id,
            item.itemname,
            item.itemcount,
            item.itemimg,
            item.owneritem,
            item.itemprice
        );
    })
};

ItemsUser.rankr = function(items) {
    items.forEach(function(item) {
        ItemsUser.renderPrizeRe(
            item.id,
            item.itemname,
            item.itemcount,
            item.itemimg,
            item.owneritem,
            item.itemprice
        );
    })
};

ItemsUser.rankrme = function(items) {
    items.forEach(function(item) {
        ItemsUser.renderPrizeMe(
            item.weaponnid,
            item.itemname,
            item.itemcount,
            item.itemimg,
            item.owneritem,
            item.itemprice
        );
    })
};

$(document).ready(function() {

    $("#AlertFinishTrade").on('click', '.button-box', function(e) {
        $("#AlertFinishTrade").css("display", "none")
        $("#AlertFinishTrade").empty()
    })

    $('#menuuser').on('click', function(e) {
        if ($(".navbar-dropdown.is-right").css("display") == "none") {
            $(".navbar-dropdown.is-right").css("display", "block")
        } else {
            $(".navbar-dropdown.is-right").css("display", "none")
        }
    })

    $('.button.mb-2.is-medium.is-success.is-fullwidth').on('click', function(e) {
        if ($(".panel-block.items.is-paddingless.youoffer").children().length > 0) {
            if ($(e.currentTarget).children("span.pronto").text() == 'Pronto') {
                socket.emit(TradeApi.UserIsReady, {
                    user: getParameterByName('user'),
                    done: true
                })
                //$('.lockpreguicas').text('USERNAME Pronto!')
                $(e.currentTarget).children("span.pronto").text('Sair')
                $('#LockedUser').css("display", "block")
                $('.button.mb-2.is-medium.is-success.is-fullwidth').css("background-color", "#bb2c3c")
            } else {
                socket.emit(TradeApi.UserIsReady, {
                    user: getParameterByName('user'),
                    done: false
                })
                $(e.currentTarget).children("span.pronto").text('Pronto')
                $('#LockedUser').css("display", "none")
                $('.button.mb-2.is-medium.is-success.is-fullwidth').css("background-color", "#48c774")
            }
        } else {
            $("#AlertFinishTrade").append('<div class="finishtradealert"></div><div id="container"><div id="error-box"><div class="erro-boximg"><img src="/imgs/gifs/Alert2.gif"></div><div class="messagex"><h1 class="alert">Epa! Veja só:</h1><p class="textalert">Você só pode ficar Pronto somente após adicionar um item</p></div><button class="button-box"><h1 class="red">Entendi</h1></button></div> </div>')
            $("#AlertFinishTrade").css("display", "block")
            var ErrorAlert = new Audio('/sound/AlertError.mp3');
            ErrorAlert.play();
        }
    })

    $('#SortItens').on('change', function() {
        var sortByValue = this.value;
        $('.panel-block.items.owner div').animate({
            opacity: "0.0"
        });
        setTimeout(function() {
            if (sortByValue == '0') {
                $('.panel-block.items.owner div').sort(function(a, b) {
                    return $(b).children("span.p").attr("data-priceowner") - $(a).children("span.p").attr("data-priceowner");
                }).appendTo('.panel-block.items.owner')
                $('.panel-block.items.owner div').animate({
                    opacity: "1.0"
                });
            }
            if (sortByValue == '1') {
                $('.panel-block.items.owner div').sort(function(a, b) {
                    return $(a).children("span.p").attr("data-priceowner") - $(b).children("span.p").attr("data-priceowner");
                }).appendTo('.panel-block.items.owner')
                $('.panel-block.items.owner div').animate({
                    opacity: "1.0"
                });
            }
            if (sortByValue == '2') {
                $('.panel-block.items.owner div').sort(function(a, b) {
                    return $(b).children("span.tl").attr("data-timeowner") - $(a).children("span.tl").attr("data-timeowner")
                }).appendTo('.panel-block.items.owner')
                $('.panel-block.items.owner div').animate({
                    opacity: "1.0"
                });
            }
            if (sortByValue == '3') {
                $('.panel-block.items.owner div').sort(function(a, b) {
                    return $(a).children("span.tl").attr("data-timeowner") - $(b).children("span.tl").attr("data-timeowner");
                }).appendTo('.panel-block.items.owner')
                $('.panel-block.items.owner div').animate({
                    opacity: "1.0"
                });
            }
        }, 450);
    });

    $("#SearchOwner").on("keyup", function() {
        var search = $(this).val().toUpperCase()
        $(".panel-block.items.owner div").each(function() {
            var nameweapon = $(this).children("span.ex").attr("data-nameowner")
            if (nameweapon.search(new RegExp(search, "i")) < 0) {
                $(this).fadeOut();
            } else {
                $(this).show();
            }
        });
    });

    $('.panel-block.items.owner').on('click', '.item.chifre', function(e) {
        if (countonline > 1) {

            var QI = $("#youroferitemmoney1").text()
            var item = parseInt(QI) + 1
            socket.emit(TradeApi.GetWeapons, {
                user: getParameterByName('user'),
                item: $(e.currentTarget).attr("data-weaponiden"),
                count: item,
                type: 0
            });
            $(e.currentTarget).appendTo(".panel-block.items.is-paddingless.youoffer");
            var valueitems = parseInt($(e.currentTarget).children("span.p").attr("data-priceowner")) + parseInt($("#youroferitemmoney2").text())
            $("#youroferitemmoney1").text(item)
            $("#youroferitemmoney2").text(valueitems)
        }
    });
    $('.panel-block.items.is-paddingless.youoffer').on('click', '.item.chifre', function(e) {
        var QI = $("#youroferitemmoney1").text()
        var item = parseInt(QI) - 1
        socket.emit(TradeApi.GetWeapons, {
            user: getParameterByName('user'),
            item: $(e.currentTarget).attr("data-weaponiden"),
            count: item,
            type: 1
        })
        $(e.currentTarget).appendTo(".panel-block.items.owner");
        var valueitems = parseInt($("#youroferitemmoney2").text()) - parseInt($(e.currentTarget).children("span.p").attr("data-priceowner"))
        $("#youroferitemmoney1").text(item)
        $("#youroferitemmoney2").text(valueitems)
    });



});

function UserLocked(data, l) {
    if (l == 0) {
        if (getParameterByName('user') != data.data.user) {
            if (data.data.done == true) {
                $('#LockedUser2').css("display", "block")
                $('#usernamelock2').text(`${data.data.user} Pronto!`)
                return;
            } else {
                $('#LockedUser2').css("display", "none")
                return;
            }
        }
    }
    if (l == 1) {
        console.log(data)
        if (getParameterByName('user') != data.datax.user) {
            $('.pronto').text('Pronto')
            $('#LockedUser').css("display", "none")
            $('.button.mb-2.is-medium.is-success.is-fullwidth').css("background-color", "#48c774")
            $("#AlertFinishTrade").append('<div class="finishtradealert"></div><div id="container"><div id="error-box"><div class="erro-boximg"><img src="/imgs/gifs/Alert2.gif"></div><div class="messagex"><h1 class="alert">Ops! Teve um ajuste!</h1><p class="textalert">O Participante adicionou ou retirou um item, confirme novamente se você está pronto</p></div><button class="button-box"><h1 class="red">Entendi</h1></button></div> </div>')
            $("#AlertFinishTrade").css("display", "block")
            var ErrorAlert = new Audio('/sound/AlertError.mp3');
            ErrorAlert.play();
        } else {
            $('#LockedUser2').css("display", "none")
        }
    }
}


function ReciveItemsNow(data) {
    if (data.user != getParameterByName('user')) {

        $('*[data-weaponiden="' + data.Item.id + '"]').appendTo(".panel-block.items.is-paddingless.frineditems")
        $("#CountItemMoneyFriend").text(`${data.Count} items - $${data.Values}.00`)

    }
}

function ReconnectItemsTrade(data) {
    function MoneyAll(data) {
        var array = []
        data.items.forEach(i => {
            array.push(i.itemprice)
        });
        return array
    }
    var numbers = MoneyAll(data);

    function myFunc(total, num) {
        return total - num;
    }
    $("#youroferitemmoney1").text(data.items.length)
    $("#youroferitemmoney2").text(numbers.reduce(myFunc))
    setTimeout(function() {
        data.items.forEach(i => {
            $('*[data-weaponiden="' + i.weaponnid + '"]').remove()
        })
        ItemsUser.rankrme(data.items);
    }, 200);
}

function RemoveItemsNow(data) {
    if (data.user != getParameterByName('user')) {
        $('*[data-weaponiden="' + data.Item + '"]').appendTo(".panel-block.items.is-paddingless.xyz")
        $("#CountItemMoneyFriend").text(`${data.Count} items - $${data.Values}.00`)
    }
}

function MoneyUser(m, u) {
    if (u == getParameterByName('user')) {
        $("#mymoneyis").text(`$${formatter.format(m)}`)
    }
}

function div(vvv) {
    if (vvv == 1) {
        $(".button.mb-2.is-medium.is-success.is-fullwidth").prop('disabled', true)
        $("#cagado").css("display", "block")
    }
    if (vvv == 2) {
        $(".button.mb-2.is-medium.is-success.is-fullwidth").prop('disabled', false)
    }
}

function UserReconnect(c) {
    $('#timeawait').html(c.time);
    if (c.time == 0) {
        $(".panel-block.items.is-paddingless.xyz").empty();
        $(".panel-block.items.is-paddingless.frineditems").empty();
        $('#cagado').find('span').remove()
        $('#cagado').find('img').remove()
        $('#cagado').append('<span class="awaituser" id="AwaitUser"> Aguardando um participante...</span>')
        $('#cagado').append('<img src="https://d18xl8ggo6ud4h.cloudfront.net/wp-content/uploads/2019/04/loading.fef1f20.gif" class="gifawaituser" id="AwaitUserImg">')
        console.log('Tempo limite atingido, sessão resetada')
    }
}

function StatusUser(type, user) {
    StopIntervall(CountParticipante)
    if (type == 2) {
        if (user.level == 1) {
            if (user.user == 1) {
                console.log('Participante saiu inesperadamente')
                $('#cagado').find('span').remove()
                $('#cagado').find('img').remove()
                $('#cagado').append('<span class="outparticipante" id="AwaitUser">O Participante saiu!</span><span class="outparticipantetexto" id="AwaitUser">Aguardando resposta do usuario <p id="timeawait" style="margin-left: 101%;margin-top: -10%;"> 7</p></span>')
                $('#cagado').append(' <img src="/imgs/gifs/Alert.gif" class="gifalertuser" id="AwaitUserImg">')
            }
            if (user.user == 0) {
                console.log('O Dono saiu inesperadamente')
                $('#cagado').find('span').remove()
                $('#cagado').find('img').remove()
                $('#cagado').append('<span class="outparticipante" id="AwaitUser">O Dono da Trade saiu!</span><span class="outparticipantetexto" id="AwaitUser">Aguardando resposta do usuario <p id="timeawait" style="margin-left: 101%;margin-top: -10%;"></p> </span>')
                $('#cagado').append(' <img src="/imgs/gifs/Alert.gif" class="gifalertuser" id="AwaitUserImg">')
                const teste = (function() {
                    function Countdown(time) {
                        this.minutes = time.minutes;
                        this.seconds = time.seconds;
                        this.centiseconds = time.centiseconds;
                        this.timer = null;
                    }
                    Countdown.prototype.start = function() {
                        var self = this;
                        this.timer = setInterval(function() {
                            update();
                            decrement();
                        }, 10);

                        function decrement() {
                            self.centiseconds--;
                            if (self.centiseconds < 0) {
                                self.centiseconds = 99;
                                self.seconds--;
                                if (self.seconds < 0) {
                                    self.seconds = 59;
                                    self.minutes--;
                                    if (self.minutes < 0) {
                                        clearInterval(self.timer);

                                    }
                                }
                            }
                        }

                        function update() {
                            $('#timeawait').html('(' + pad(self.seconds) + ':' + pad(self.centiseconds) + ')');

                            function pad(number) {
                                if (number < 10) {
                                    return '0' + number;
                                } else {
                                    return number;
                                }
                            }
                        };
                    };
                    return new Countdown({
                        minutes: 0,
                        seconds: 7,
                        centiseconds: 0
                    }).start();
                }).call();

            }
        } else {
            if (user.user == 1) {
                console.log('Participante saiu normalmente')
                $(".panel-block.items.is-paddingless.xyz").empty();
                $('#cagado').find('span').remove()
                $('#cagado').find('img').remove()
                $('#cagado').append('<span class="awaituser" id="AwaitUser"> Aguardando um participante...</span>')
                $('#cagado').append('<img src="https://d18xl8ggo6ud4h.cloudfront.net/wp-content/uploads/2019/04/loading.fef1f20.gif" class="gifawaituser" id="AwaitUserImg">')
            }
            if (user.user == 0) {
                console.log('O Dono saiu normalmente')
                window.location.href = "/ownerout"
            }
        }
    }


    if (type == 1) {
        console.log('Participante Entrou')
        $('#cagado').find('span').remove()
        $('#cagado').find('img').remove()
        $('#cagado').append('  <span style="margin-top: 38%;position: absolute;margin-left: 30%;font-size: 20px;">O Usuario #' + user.items[0].owneritem + ' entrou</span><span id="timeawait" style="margin-top: 42%;position: absolute;margin-left: 42%;font-size: 15px;">Iniciando em 3</span>')
        $('#cagado').append('  <img src="/imgs/gifs/Done.gif" style="position: absolute;margin-top: 41%;margin-left: 38%;width: 150px;">')
        var counter = 3

        function Conut() {
            counter--;
            if (counter == 0) {
                $('#timeawait').html('Iniciando em ' + counter + '');
                StopIntervall(CountParticipante)
                $("#cagado").css("display", "none")
                return;
            } else {
                $('#timeawait').html('Iniciando em  ' + counter + '');
            }
        }
        var CountParticipante = setInterval(Conut, 800);
    }
}


function SucessTrade(date) {
    $(".panel-block.items.is-paddingless.xyz").empty();
    $(".panel-block.items.is-paddingless.frineditems").empty();
    $('.pronto').text('Pronto')
    $('#LockedUser').css("display", "none")
    $('#LockedUser2').css("display", "none")
    $('.button.mb-2.is-medium.is-success.is-fullwidth').css("background-color", "#48c774")
    $("#AlertFinishTrade").append('<div class="finishtradealert"></div><div id="container"><div id="success-box"><div class="dot"></div><div class="dot two"></div><div class="face"><div class="eye"></div><div class="eye right"></div><div class="mouth happy"></div></div><div class="shadow scale"></div><div class="messagex"><h1 class="alert">Success!</h1><p class="textalert">Troca Realizada!.</p></div><button class="button-box"><h1 class="green">continue</h1></button></div></div>')
    $("#AlertFinishTrade").css("display", "block")
}

var countonline = 0
socket.on('connect', function() {
    socket.on(TradeApi.SessaoTrade, function(stats) {
        div(stats)
        countonline = stats
        console.log(stats)
    });
    socket.emit(TradeApi.MyName, {
        my: getParameterByName('user')
    });
    socket.on(TradeApi.OwnerItems, function(items) {
        if (items.reconn == true && (items.user != getParameterByName('user'))) {
            ItemsUser.rankr(items.items);
        }
        if (items.reconn == false) {
            ItemsUser.rank(items.items);
        }
        console.log({
            F: 'Tela1',
            items: items
        })
    })
    socket.on(TradeApi.UserItems, function(items) {
        if (countonline == 2) {
            StatusUser(1, items)
        }
        console.log({
            F: 'Tela2',
            items: items,
            ci: countonline
        })
        if (items.reconn == true && (items.user == getParameterByName('user'))) {
            ItemsUser.rankr(items.items);
        }
        if (items.reconn == false) {
            ItemsUser.rank(items.items);
        }
        MoneyUser(items.money, items.user)

    })
    socket.on(TradeApi.Disconectado, function(dados) {
        StatusUser(2, dados)
        console.log(dados)
    })

    socket.on(TradeApi.DisconectadoCountDown, function(dados) {
        console.log(dados)
        UserReconnect(dados)
    })

    socket.on(TradeApi.ReciveItems, function(items) {
        ReciveItemsNow(items)
        console.log({
            Metodo: 'Recebido',
            ItemsR: items
        })
    })

    socket.on(TradeApi.RemoveItems, function(items) {
        RemoveItemsNow(items)
        console.log({
            Metodo: 'Removido',
            ItemsRE: items
        })
    })

    socket.on(TradeApi.ReciveReconnect, function(items) {
        if (items.user == getParameterByName('user')) {
            ReconnectItemsTrade(items)
        }
    })

    socket.on(TradeApi.UserIsReadyStatus, function(items) {
        UserLocked(items, 0)
        console.log({
            block: items
        })
    })

    socket.on(TradeApi.UserIsReadyRemove, function(data) {
        UserLocked(data, 1)
        console.log(data)
    })
    socket.on(TradeApi.TradeSuccess, function(date) {
        SucessTrade(date)
    })
});