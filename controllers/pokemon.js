const express = require('express');
const Address = require('../models/address');
const Pokemon = require('../models/pokemon');
const axios = require('axios');

const getAllPokemon = async (req, res)=>{
    try {
        let offset = 0;
        let limit = 50;
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
        const response = await fetch(url)
        const data = await response.json()

        const results = data.results;
        const pokemonData = await Promise.all(results.map(async (pokemon) => {
            const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const data2 = await response2.json();

            return {
                name: pokemon.name,
                url_image: data2.sprites.other.dream_world.front_default,
                base_experience: data2.base_experience,
                height: data2.height,
                abilities: data2.abilities
            };
        }));
        res.status(200).json(pokemonData)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
};

module.exports = {getAllPokemon};
