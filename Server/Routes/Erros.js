module.exports = function(app,path){
    app.get("/ownerout", function(req, res) {
        res.sendFile(path.join(__dirname, '../../', '/Client/Routes/exitowner.html'));

    })
}