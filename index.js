const express = require('express');
const server = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
let pizzas = require('./src/data/pizzas.json');

server.use(cors());
server.use(express.json()); // Middleware para parsear JSON no corpo da requisição

server.get('/pizzas', (req, res) => {
    return res.json(pizzas);
});

// Função para gerar um novo ID único
const generateId = () => {
    const ids = pizzas.map(pizza => parseInt(pizza.id));
    return (Math.max(...ids) + 1).toString();
};

// Endpoint POST para adicionar uma nova pizza
server.post('/pizzas', (req, res) => {
    const newPizza = req.body;

    // Validação dos dados
    if (!newPizza.title || !newPizza.ingredients || !newPizza.price || !newPizza.background) {
        return res.status(400).json({ message: 'Dados incompletos' });
    }

    // Verifica se a pizza já existe (por exemplo, com base no título)
    const existingPizza = pizzas.find(pizza => pizza.title === newPizza.title);
    if (existingPizza) {
        return res.status(400).json({ message: 'Pizza já existe' });
    }

    // Gera um novo ID único para a nova pizza
    newPizza.id = generateId();

    // Adiciona a nova pizza ao array
    pizzas.push(newPizza);

    // Salva as pizzas atualizadas no arquivo JSON
    fs.writeFileSync(path.join(__dirname, './src/data/pizzas.json'), JSON.stringify(pizzas, null, 2));

    return res.status(201).json(newPizza);
});

server.listen(3000, () => {
    console.log('servidor está funcionando');
});
