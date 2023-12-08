const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalPokemon = document.getElementById('modalPokemon')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="pokemon ${pokemon.type}" id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </button>
    `
}

function mountModal(type, pokemonInfo, abilitiesConcat, genderRate, eggGroup){
    const percentRateFemale = (genderRate/8)*100;
    const percentRateMale = 100 - percentRateFemale;
    return `<div class="modal-body ${type}" style="padding: 0;">
    <div style=" color: whitesmoke; height: 275px; display: flex; justify-content: space-between; ">
        <div style="padding: 20px 25px;">
            <h3 style="text-transform: capitalize;">${pokemonInfo.name}</h3>
            <span style="padding: .25rem .5rem;margin: .25rem 0;font-size: 0.9rem;border-radius: 1rem;filter: brightness(1.1);text-align: center;">tipos</span>
        </div>
        <div style="margin: 35px;font-size: 21px;font-weight: bolder;">
            <span>#${pokemonInfo.id}</span>
        </div>
    </div>
    <div style=" border-top-left-radius: 30px; border-top-right-radius: 30px; background-color: white; padding-top: 55px;padding-bottom: 10px;padding-left: 30px;">
        <div style=" display: flex;align-items: center;justify-content: center;">
            <img style="margin-left:40px ; position: absolute; top: 75px;width: 215px;" src="${pokemonInfo.sprites.other.dream_world.front_default}" alt="">
        </div>
        <h3>About</h3>
        <div style="display: flex;">
            <div style="width: 42%;">
                <p>Height</p>
                <p>Weight</p>
                <p>Abilities</p>
            </div>
            <div>
                <p>${pokemonInfo.height*10}cm</p>
                <p>${pokemonInfo.weight/10}kg</p>
                <p>${abilitiesConcat}</p>
            </div>
           
        </div>
        <h3>Breeding</h3>
        <div style="display: flex;">
            <div style="width: 42%;">
                <p>Gender</p>
                <p>Eggg Groups</p>
               
            </div>
            <div>
                <p>Female ${percentRateFemale}% Male ${percentRateMale}% </p>
                <p>${eggGroup}</p>
            </div>
        </div>
       
    </div>
</div>`;
}

function concatList(list){

    return stringConcat;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml       
    }).then(() => {
        document.querySelectorAll('button').forEach(function(botao) {
            botao.addEventListener('click', function() {
                if(this.id !== 'loadMoreButton'){
                    var idDoBotaoClicado = this.id;
                    pokeApi.getSpecificPokemon(idDoBotaoClicado).then( (pokemonInfo) => {
                       pokeApi.getSpeciesInfo(idDoBotaoClicado).then( (speciesInfo) => {
                        const genderRate = speciesInfo.gender_rate;           
                        const eggGroup = speciesInfo.egg_groups.map(objeto => objeto.name).join(', ');            
                        const abilities = pokemonInfo.abilities.map(objeto => objeto.ability.name).join(', ');
                        const type = pokemonInfo.types[0].type.name;
                        let modalContent = mountModal(type, pokemonInfo, abilities, genderRate, eggGroup);
                        modalPokemon.innerHTML = modalContent;
                        
                       } )
                    } ) 
                }
                
            });
          });
    })
}



loadPokemonItens(offset, limit)


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


