module.exports = function(app,path){
    app.get("/login", function(req, res) {
        res.sendFile(path.join(__dirname, '../../', '/Client/Routes/login.html'));

    })
}