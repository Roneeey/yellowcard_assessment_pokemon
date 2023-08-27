import prompt from 'prompt';
import {getEvolutionInfo, getPokemonImage, getPokemonInfo} from "./utils/http/index.js";
import select from 'cli-select';
import chalk from 'chalk'
import terminalImage from 'terminal-image';

const main = async () => {
    // user inputs pokemon name
    prompt.start();

    // Input field for pokemon name. Destructure result to store input as abilitiesAttribute string. This value is used to reference the pokemon API call.
    prompt.get(['pokemon'], async (err, result) => {
        try {
            const {pokemon} = result

            // If abilitiesAttribute user does not enter text into input
            if (!pokemon) {
                return console.log('Please enter abilitiesAttribute pokemon name')
            }
            // Fetch data function and case sensitivity method. Use await for http request.
            const pokemonInfo = await getPokemonInfo(pokemon.toLowerCase())


            //Assigning desired information on Pokemon to variables through destructuring the info from response.
            const {name, id, types, abilities, species, sprites, moves} = pokemonInfo

            // Assigning pokemon information to variables with the map method to convert arrays of objects into an array of strings
            const movesAttribute = moves.map(move => move.move.name) // extracting names of moves
            const typesAttribute = types.map(type => type.type.name) // extracting names of types
            const abilitiesAttribute = abilities.map(ability => ability.ability.name) // extracting names of abilities

            // Creating array of sprite attribute keys and removing unwanted properties by filter method removing unwanted matches
            // This is used to create the menu list in appear in the console.
            const spriteAttribute = Object.keys(sprites).filter(sprite => sprite !== 'other' && sprite !== 'versions')

            // Use of CLI Select package for selection of sprite functionality. Use await to allow user to choose sprite.
            const selected = await select({
                values: spriteAttribute,
                valueRenderer: (value, selected) => {
                    if (selected) {
                        return chalk.underline(value);

                    }

                    return value;

                },
            })

            // Call function to call image using Terminal Image package.
            const buffer = await getPokemonImage(sprites[selected.value])

            // Display image properties
            const image = await terminalImage.buffer(buffer, {width: 50, height: 50})

            // Call function to display pokemon evolutions
            const evolution = await getEvolutionInfo(species.url)
            // Variables if pokemon has no evolution attribute
            let firstEvolution = 'none'
            let secondEvolution = 'none'

            // Function to display pokemon evolution in order
            const chain = await getEvolutionInfo(evolution.evolution_chain.url)
            if (chain) {
                const first = chain.chain.evolves_to[0]
                if (first) {
                    firstEvolution = first.species.name
                    const second = first.evolves_to[0]
                    if (second) {
                        secondEvolution = second.species.name
                    }

                }
            }

            // Display all specified information about queried pokemon in console
            console.log(image)
            console.log(chalk.bold(chalk.blue('Name:')), chalk.green(name));
            console.log(chalk.bold(chalk.blue('ID:')), chalk.green(id))
            console.log(chalk.bold(chalk.blue('Abilities:')), chalk.green(abilitiesAttribute))
            console.log(chalk.bold(chalk.blue('Moves:')), chalk.green(movesAttribute))
            console.log(chalk.bold(chalk.blue('Types:')), chalk.green(typesAttribute))
            console.log(chalk.bold(chalk.blue('First Evolution:')), chalk.green(firstEvolution))
            console.log(chalk.bold(chalk.blue('Second Evolution:')), chalk.green(secondEvolution))
        } catch (e) {
            console.error(e)
        }
    })
}

main()