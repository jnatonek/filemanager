var express = require("express");
var app = express();
const PORT = 3000;
var formidable = require('formidable');
var path = require("path");
var hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

let tab_of_files = [];
let rozszenia = ["css", "doc", "docx", "gif", "html", "jpg", "js", "mp3", "mp4", "pdf", "php", "png", "rar", "txt", "zip"];

app.get("/", function (req, res) {
    res.render('index01.hbs');
})
app.get("/uplaud", function (req, res) {
    res.render('index01.hbs');
})

app.get("/filemanager", function (req, res) {
    data = {
        data: tab_of_files,
    };
    res.render('filemanager.hbs', data);
})

app.get("/info", function (req, res) {
    res.render('info.hbs');
})

app.post("/uplaud", function (req, res) {
    let form = formidable({});

    form.uploadDir = __dirname + '/static/upload/';
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        if(!files.filesupload.length)
        {
            //console.log("single file")  
            let id = 1;
            if(tab_of_files.length > 0)
            {
                id  = tab_of_files[tab_of_files.length - 1].id + 1;
            }
            let file = files.filesupload;
            let result = "";
            if(rozszenia.indexOf(file.name.split(".")[1]) > 0)
            {
                result= file.name.split(".")[1];
            }
            else
            {
                result = "any";
            }
            let f ={ 
                id: id,
                file_type: result,
                name: file.name,
                path: file.path,
                size: file.size,
                type: file.type,
                savedata: file.lastModifiedDate,
            } 
            tab_of_files.push(f);
        }
        else
        {
            //console.log("multi files")   
            files.filesupload.forEach(file => {
                let id = 1;
                if(tab_of_files.length > 0)
                {
                    id  = tab_of_files[tab_of_files.length - 1].id + 1;
                }
                let result = "";
                if(rozszenia.indexOf(file.name.split(".")[1]) > 0)
                {
                    result= file.name.split(".")[1];
                }
                else
                {
                    result = "any";
                }
                let f ={ 
                    id: id,
                    file_type: result,
                    name: file.name,
                    path: file.path,
                    size: file.size,
                    type: file.type,
                    savedata: file.lastModifiedDate,
                } 
                tab_of_files.push(f);
            });
        }
        //res.send(files);
    });

    res.render('index01.hbs');
})

app.post("/info", function (req, res) {
    let data
    for(let i = 0; i < tab_of_files.length; i++)
    {
        if(req.body.id == tab_of_files[i].id)
        {
            data = tab_of_files[i];
            res.render('info.hbs', data);
        }
    }
})

app.post("/download", function (req, res) {
    for(let i = 0; i < tab_of_files.length; i++)
    {
        if(req.body.id == tab_of_files[i].id)
        {
            res.download(tab_of_files[i].path)
        }
    }
})

app.post("/filemanager", function (req, res) {
    if(req.body.typ == "delete")
    {
        for(let i = 0; i < tab_of_files.length; i++)
        {
            if(req.body.id == tab_of_files[i].id)
            {
                tab_of_files.splice(i, 1);
            }
        }
    }
    if(req.body.typ == "delet_all")
    {
        tab_of_files = [];
    }
    data = {
        data: tab_of_files,
    };
    res.render('filemanager.hbs', data);
})

app.use(express.static('static'));

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT );
})