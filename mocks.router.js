const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const faker = require('faker');
const User = require('../models/User'); 
const Pet = require('../models/Pet');

// Genera usuarios y mascotas
const generateData = async (numUsers, numPets) => {
    const users = [];
    const pets = [];

    // Generar usuarios
    for (let i = 0; i < numUsers; i++) {
        const passwordHash = bcrypt.hashSync('coder123', 10);
        const user = new User({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: passwordHash,
            role: faker.random.arrayElement(['user', 'admin']),
            pets: []
        });
        users.push(user);
    }

    // Generar mascotas
    for (let i = 0; i < numPets; i++) {
        const pet = new Pet({
            name: faker.animal.cat(),
            type: faker.random.arrayElement(['dog', 'cat', 'bird']),
            owner: null 
        });
        pets.push(pet);
    }

    // Insertar en la base de datos
    await User.insertMany(users);
    await Pet.insertMany(pets);
};

router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body;
    if (!users || !pets) {
        return res.status(400).send('Los parámetros "users" y "pets" son requeridos');
    }

    try {
        await generateData(users, pets);
        res.status(201).send('Datos generados exitosamente');
    } catch (error) {
        res.status(500).send('Error al generar datos');
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error al obtener usuarios');
    }
});

router.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        res.status(500).send('Error al obtener mascotas');
    }
});

module.exports = router;

