const express = require('express');
const Movie = require('../models/movie');
const axios = require('axios');

// Obtener todos los movies
const getAllMovies = async (req, res)=>{
    try {

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=db5ece2bd438372d8d0203dcc6ecc74a`
        
        const response2 = await fetch(url)
        const data2 = await response2.json()

        const results2 = data2.results;

        const movieData2 = results2.map(movie => {
            return {
                title: movie.title,
                poster_path: `https://image.tmdb.org/t/p/original`+movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date
            };
        });

        res.status(200).json(movieData2)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
};

const getFilterMovies = async (req, res)=>{
    try {
        const name = req.params.name;

        const search_url = `https://api.themoviedb.org/3/search/movie?api_key=db5ece2bd438372d8d0203dcc6ecc74a&query=${name}`
            
        const response = await fetch(search_url)
        const data = await response.json()

        const results = data.results;

        const movieData = results.map(movie => {
            return {
                title: movie.title,
                poster_path: `https://image.tmdb.org/t/p/original`+movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date
            };
        })

        res.status(200).json(movieData)
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
};

module.exports = {getAllMovies, getFilterMovies};