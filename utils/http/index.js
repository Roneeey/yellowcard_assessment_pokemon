import got from 'got';

// Define the base URL for the PokeAPI
const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';


// Make the API request based off user specified pokemon name and return only the body of the JSON file.
export const getPokemonInfo = async (pokemonName) => {
    try {
        const response = await got(`${baseUrl}${pokemonName}`);
        return JSON.parse(response.body);
    } catch (e) {
        throw e;
    }

};

// Function to call the pokemon image using the Terminal Image package
export const getPokemonImage = async (url) => {
    try {
        return await got(url).buffer();
    } catch (e) {
        throw e;
    }
}

// Function to call the evolution data and return the body of the JSON file.
export const getEvolutionInfo = async (url) => {
    try {
        const response = await got(url);
        return JSON.parse(response.body)
    } catch (e) {
        throw e;
    }
}