const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let rawbooks = fs.readFileSync('books.json'); //utilizamos o readFileSync para ler o arquivo de forma sincronizada dependo que o arquivo tenha sido lido pra executar outras tarefas
let books = JSON.parse(rawbooks); // o arquivo json vem como string, então precisamos converte-lo para json novamente 

app.get('/',(request,response) =>{
    response.send("Hello world!");
});

app.get('/book', (request,response) =>{
    response.json(books)
});

app.post('/book', (request, response) =>{
    const book = request.body;
    if(Array.isArray(book)){
        for (item of book){
            books.push(item)
        }
    }
    else{
        books.push(book)
    }

    let jsonList = JSON.stringify(books)

    fs.writeFile('books.json', jsonList, 'utf8', ()=>{})
    response.send("Livro cadastrado com sucesso!")
})


app.get('/book/:isbn', (request,response) =>{
    const {isbn} = request.params; // ou isbn = req.params.isbn;

    for(book of books){
        if(book.isbn === isbn){
            response.json(book)
            return;
        }
        else{
            response.status(404).send('livro não encontrado!')
        }
    }
});

app.listen(3000);