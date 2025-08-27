import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Lazyimage from './Lazyimage'
import { Link } from 'react-router-dom';

const TypeColors = {
    normal: { border: 'border-zinc-400', bg: 'bg-zinc-400', text: 'text-black' },
    fire: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-white' },
    water: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-white' },
    grass: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-white' },
    electric: { border: 'border-yellow-400', bg: 'bg-yellow-400', text: 'text-black' },
    ice: { border: 'border-cyan-300', bg: 'bg-cyan-300', text: 'text-black' },
    fighting: { border: 'border-orange-700', bg: 'bg-orange-700', text: 'text-white' },
    poison: { border: 'border-purple-600', bg: 'bg-purple-600', text: 'text-white' },
    ground: { border: 'border-yellow-600', bg: 'bg-yellow-600', text: 'text-white' },
    flying: { border: 'border-indigo-400', bg: 'bg-indigo-400', text: 'text-white' },
    psychic: { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-white' },
    bug: { border: 'border-lime-500', bg: 'bg-lime-500', text: 'text-black' },
    rock: { border: 'border-stone-500', bg: 'bg-stone-500', text: 'text-white' },
    ghost: { border: 'border-indigo-800', bg: 'bg-indigo-800', text: 'text-white' },
    dragon: { border: 'border-violet-700', bg: 'bg-violet-700', text: 'text-white' },
    dark: { border: 'border-stone-800', bg: 'bg-stone-800', text: 'text-white' },
    steel: { border: 'border-slate-500', bg: 'bg-slate-500', text: 'text-white' },
    fairy: { border: 'border-pink-300', bg: 'bg-pink-300', text: 'text-black' },
    default: { border: 'border-slate-400', bg: 'bg-slate-800', text: 'text-slate-300' }
};

const PokeCard = ({ url, name }) => {
    const [pokemon, setPokemon] = useState();  

    useEffect(() => {
      fetchPokeDetailData();
    }, [])

    async function fetchPokeDetailData() {
      try {
          const response = await axios.get(url)
          console.log(response.data)
          const pokemonData = formatPokemonData(response.data);
          setPokemon(pokemonData);
      } catch (error) {
        console.error(error);
      }
    }

    function formatPokemonData(params) {
      const {id, types, name} = params;
      const PokeData = {
        id,
        name,
        type: types[0].type.name
      }
      return PokeData;
    }

    const pokemonType = pokemon?.type || 'default';
    const { bg, border, text } = TypeColors[pokemonType] || TypeColors.default;

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`

    return (
      <>  
        {pokemon &&
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
       >
        <div
        className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
        >
          #{pokemon.id.toString().padStart(3,'00')}
        </div>
        <div className={`w-full f-6 flex items-center justify-center`}>
          <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
          >

              <Lazyimage 
                  url={img}
                  alt={name}
              />
             
          </div>
        </div>
        <div
            className={`${bg} text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1 text-center`}
        >
          {pokemon.name}
        </div>
       </Link>

        }
      </>
      
      )
}

export default PokeCard