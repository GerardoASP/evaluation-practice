const express = require('express');
const Address = require('../models/address');
const Pokemon = require('../models/pokemon');
const axios = require('axios');

// Obtener todos los pokemon
const getAllPokemon = async (req, res)=>{
    try {
        let offset = 0;
        let limit = 50;
        let filter = "me";
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
        const response = await fetch(url)
        const data = await response.json()

        const results = data.results;

        if(condition){
            let filteredResults = results.filter(pokemon => pokemon.name.includes(filter));
            const pokemonData = await Promise.all(filteredResults.map(async (pokemon) => {
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
        }else{
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
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
};

// Obtener un pokemon
const getPokemon = async (req, res)=>{
    const name = req.params.name;
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`
        const response = await fetch(url)
        const data = await response.json()

        const pokemonData = {
            name: data.name,
            url_image: data.sprites.other.dream_world.front_default,
            base_experience: data.base_experience,
            height: data.height,
            abilities: data.abilities
        };

        res.status(200).json(pokemonData)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
};

// Obtener Pokemon por condición
const getPokemonCondition = async (req, res)=>{
    try {
        let offset = 0;
        let limit = 50;
        let condition = "saur"
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
        const response = await fetch(url)
        const data = await response.json()

        const results = data.results;

        const filteredResults = results.filter(pokemon => pokemon.name.includes(condition));

        const pokemonData = await Promise.all(filteredResults.map(async (pokemon) => {
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

module.exports = {getAllPokemon, getPokemon};