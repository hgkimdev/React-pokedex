import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';

const DetailPage = () => {

  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;


  useEffect(() => {
    fetchPokeData();
  }, [])
  

    async function fetchPokeData() {
      const url = `${baseUrl}${pokemonId}`
      try {
        const { data:pokemonData } = await axios.get(url);   
          
        if(pokemonData) {
          const {name, id, types, weight, height, stats, abilities} = pokemonData; 
          const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

          const DamageRelations= await Promise.all(
            types.map(async (i) => {
              const type = await axios.get(i.type.url);
              return type.data.damage_relations
            })
          )


          const formattedPokemonData = {
             id: id,
             name: name,
             types: types.map(type => type.type.name),
             weight: weight / 10,
             height: height / 10,
             previous: nextAndPreviousPokemon.previous,
             next: nextAndPreviousPokemon.next,
             abilities: formatPokemonAbilites(abilities),
             stats: formatPokemonStats(stats),
             DamageRelations

          }

          setPokemon(formattedPokemonData);
          setIsLoading(false);
        }


      } catch (error) {
        console.error(error);
      }
    }

    const formatPokemonStats = ([
      statHP,
      statATK,
      statDEF,
      statSATK,
      statSDEF,
      starSPD
    ]) => [
      {name: 'Hit Point', baseStat: statHP.base_stat},
      {name: 'Atteck', baseStat: statATK.base_stat},
      {name: 'Defense', baseStat: statDEF.base_stat},
      {name: 'Special Atteck', baseStat: statSATK.base_stat},
      {name: 'Special Defense', baseStat: statSDEF.base_stat},
      {name: 'Speed', baseStat: starSPD.base_stat}
    ]

    const formatPokemonAbilites = (abilities) => {
      return abilities.filter((_,index) => index <= 1)
                      .map((obj) => obj.ability.name.replaceAll('-',' '))
    }

    async function getNextAndPreviousPokemon(id) {
      const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;

      const { data: pokemonData } = await axios.get(urlPokemon);
      console.log('****', pokemonData);
    
      const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
      const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous)); 

      console.log('previousResponse', previousResponse)
      
      return {
        next: nextResponse?.data?.results?.[0]?.name,
        previous: previousResponse?.data?.results?.[0]?.name

      }
    } 

    if(isLoading) {
      return ( 
      <div className= {
        `absolute h-auto w-auto top-1/3 translate-x-1/2 left-1/2 z-50`
      }>
          <Loading className='w-12 h-12 z-50 animate-spin text-slate-900' />
      </div>
      )
    }

    if(!isLoading && !pokemon) {
      return (
        <div>...NOT FOUND</div>
      )
    }

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    const TYPE_COLORS = {
      normal: 'bg-gray-400',
      fighting: 'bg-red-600',
      flying: 'bg-blue-400',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      rock: 'bg-yellow-800',
      bug: 'bg-green-400',
      ghost: 'bg-purple-600',
      steel: 'bg-gray-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-400',
      psychic: 'bg-pink-500',
      ice: 'bg-blue-300',
      dragon: 'bg-purple-700',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-300',
};

const TYPE_TEXT_COLORS = {
  normal: 'text-gray-400',
  fighting: 'text-red-600',
  // ... 나머지 타입들
};

// 사용
const bg = TYPE_COLORS[pokemon.types[0]] || 'bg-gray-400';
const text = TYPE_TEXT_COLORS[pokemon.types[0]] || 'text-gray-400';
    

    

  return (
    <article className='flex items-center gap-1 flex-col w-full'>
      <div
        className={
          `${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`
        }
      >

        {pokemon.previous && (
          <Link
          className='absolute top-[40%] -translate-y-1/2 z-50 left-1'
            to={`/pokemon/${pokemon.previous}`}
            >
            <LessThan className='w-5 h-8 p-1' />
          </Link>
        )}

        {pokemon.next && (
          <Link
            className='absolute top-[40%] -translate-y-1/2 z-50 right-1'
            to={`/pokemon/${pokemon.next}`}
            >
              <GreaterThan className='w-5 h-8 p-1' />
            </Link>
        )}

        <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
          <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
            <div className='flex items-center gap-1 '>
              <Link to="/">
                <ArrowLeft className='w-6 h-8 text-zinc-200 '/>
              </Link>
              <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                {pokemon.name}
              </h1>
            </div>
            <div className='text-zinc-200 font-bold text-md '>
              #{pokemon.id.toString().padStart(3, '00')}
            </div>
          </div>

        <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
          <img
            src={img}
            width="100%"
            height="auto"
            loading="lazy"
            alt={pokemon.name}
            className={`object-contain h-full`}
          />
        </div>

        </section>

        <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>

        <div className='flex items-center justify-center gap-4'>
          {} 
          {pokemon.types.map((type) => (
            <Type key={type} type={type} />
          ))}
        </div>

        
        <div className='flex w-full items-center justify-between max-w-[400px] text-center'>
          <div className='w-full '>
             <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
             <div className='text-sm flex mt-1 gep-2 justify-center text-zinc-200'>
              <Balance />
             {pokemon.weight}kg
              </div>
          </div>
          <div className='w-full'>
             <h4 className='text-[0.5rem] text-zinc-100'>Height</h4>
             <div className='text-sm flex mt-1 gep-2 justify-center text-zinc-200'>
              <Vector />
             {pokemon.height}m
              </div>
          </div>
          <div className='w-full'>
             <h4 className='text-[0.5rem] text-zinc-100 capitalize'>Ability</h4>  
             {pokemon.abilities.map((ability) =>(
                <div className="text" key= {ability}>{ability}</div>
             ))}
              </div>
          </div>


          <h2 className={`text-base font-semibold ${text}`}>
             기본 능력치
          </h2>
          <div className='w-full'>
                Stat
          </div>


          {pokemon.DamageRelations && (
            <div className='w-10/12'>
              <h2 className={`text-base text-center font-semibold ${text}`}>
                데미지 관계
              </h2>
              데미지
            </div>
          )}


        </section>

      </div>

    </article>
  )
}

export default DetailPage