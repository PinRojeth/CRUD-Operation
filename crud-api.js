const express = require("express");
// const bodyParser = require('body-parser')
const app = express();

const data = require('./users.json')

const fs = require('fs'); 
const { json } = require("body-parser");

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Welcome to NodeJS CRUD Operation</h1>')
})

app.get('/listUsers', (req, res) => {
    res.send(data);
})

app.get('/listUsers/:id', (req, res) => {
    let result = data.data[req.params.id];
    res.send({'User': result});
})

app.post('/listUsers', (req, res) => {
    let create = req.body;

    let rawData = fs.readFileSync('./users.json');
    let jsonData = JSON.parse(rawData);

    jsonData.data.push(create);
    
    const createdJsonData = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync("./users.json", createdJsonData);

    res.json({message: `Data added successfully`});
})

app.put('/listUsers/:id', (req, res) => {
    let { name, Age, Gender } = req.body;
    let id = req.params.id;

    const rawData = fs.readFileSync("./users.json");
    const jsonData = JSON.parse(rawData);   

    const dataIndex = jsonData.data.findIndex((data) => data.id == id);
    if (dataIndex === -1) {
        res.status(404).json({error: `Data with ID ${id} not found`});
    }

    jsonData.data[dataIndex] = {name, Age, Gender, id};

    const updatedJsonData = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync("./users.json", updatedJsonData);

    res.json({message : `Data updated successfully`});
});

app.delete('/listUsers/:id', (req, res) => {
    let userId = parseInt(req.params.id);

    const filteredData = data.data.filter(data => data.id != userId);

    if (filteredData.length < data.data.length) {
        data.data = filteredData;
        res.json({message : `User with ID ${userId} deleted successfully`});
    } else {
        res.status(404).send({error: `User with ID ${userId} is not founded`})
    }
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));