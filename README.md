



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://lh3.googleusercontent.com/proxy/T4YAgrwXXav2D1hwX1pXLtF0Ir2gekBmYe7BYcDafT4IIWr7doJ_PB8jkZT_eVJ7zBaeeEIz11wEAg0t-p6kmNj8r6Ufs7g0BP-01JrhinEDg8YsEJmlMZBHXMMs5INAAg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Trade Items</h3>

  <p align="center">
    An item exchange system using LowDB and Socket.io
    <br />
</p>




<!-- ABOUT THE PROJECT -->
## How to use :rocket:

The System does not exist login, you can access the trade using 2 parameters
  ```sh
  http://yourdomain.com/trade?session=yKgyjt3jp6WT5ZQvUGWSvJmnCMu8c9r2&user=skillerm22
  ```

### Details

1. session: It would be the session url, you can see/add the sessions in (Session-PB.json) file
2. user: user that will be used in the session, you can see/add users in the (Users-PB.json) file

Alert: Change the url to the url the system will run on. File (Socket.js)🎮
   ```JS
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
        }...
   ```


## Test 🎮

You can test the system online.  

User 1: https://trade-castroms.herokuapp.com/trade?session=yKgyjt3jp6WT5ZQvUGWSvJmnCMu8c9r2&user=eduhcastro19

User 2: https://trade-castroms.herokuapp.com/trade?session=yKgyjt3jp6WT5ZQvUGWSvJmnCMu8c9r2&user=skillerm22



<!-- CONTRIBUTING -->
## Contributing
This project is free, and any contribution is welcome.  
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Eduardo Castro - [Facebook](https://www.facebook.com/eduhcm)
CastroMS#8830 - [Discord]

