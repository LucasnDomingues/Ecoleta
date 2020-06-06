const express = require("express");
const server = express();

const db = require('./database/db');

server.use(express.static("public"));

//habilita o uso do req.body
server.use(express.urlencoded({extended: true}));

const nunjucks = require("nunjucks");
nunjucks.configure("src/views",{
    express: server,
    noCache: true
})

server.get('/', (req,res) => {
    return res.render("index.html",{
        
    });
});

server.get('/create-point', (req,res) => {
    return res.render("create-point.html");
});

server.post('/save-point', (req,res) =>{
    const params = req.body;
    const query = `
        INSERT INTO places (
            image,name,address,address2,state,city,items
        ) VALUES ( ?,?,?,?,?,?,?);
        `;
    const values = [
        params.image,
        params.name,
        params.address,
        params.address2,
        params.state,
        params.city,
        params.items
    ];
    function afterInsertData(err){
        if(err){
            console.log(err);
            return res.send("Erro no cadastro");
        }
        return res.render("create-point.html", {saved: true});
    }

    db.run(query,values,afterInsertData);
});

server.get('/search-results', (req,res) => {

    const search = req.query.search;

    if(search == ""){
        return res.render("search-results.html", {total: 0});
    }else{
        db.all(` SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err,rows){
            if(err){
                return console.log(err);
            }
            return res.render("search-results.html", { places: rows, total: rows.length});
        });
    }
});

server.listen(3000);