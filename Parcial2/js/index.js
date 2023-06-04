((Utils) => {
    const App = {
        HTMLElements: {
            pokemonFinderForm: document.querySelector('#pokemon-finder-form'),
            pokemonFinderSearchType: document.querySelector("#pokemon-finder-search-type"),
            pokemonFinderInput: document.querySelector("#pokemon-finder-query"),
            pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
            limpiar: document.querySelector('#limpiar'),
        },
        
        init: () => {
            App.HTMLElements.pokemonFinderForm.addEventListener(
                "submit",
                App.handlers.pokemonFinderFormOnSubmit
              );

              const limpiar = App.HTMLElements.limpiar;
              limpiar.addEventListener("click", App.handlers.cleanForm);
            },

        templates: {
            render: ({ searchType, response }) => {
                const renderMap = {
                  ability: App.templates.abilityCard,
                  pokemon: App.templates.pokemonCard,
                };
                return renderMap[searchType]
                  ? renderMap[searchType](response)
                  : App.templates.errorCard();
              },
              errorCard:  () => `<h1>There was an error</h1>`,
           pokemonCard: ({ id, name, weight, height,abilities, sprites, types,chain_evolves }) => {

            const evoList = chain_evolves.map(
              ({name, is_baby}) =>
              `<li class="li-icons">${name} ${is_baby?'<img class="list-icon" src="./img/baby.svg" height="15px">':""}</li>`
              )
    
            const typeList = types.map(
              ({type}) => 
              
              `<span class="${type.name}">${type.name}</span>`
            )
            const abilitiesList = abilities.map(
              ({ability}) => 
              
              `<li class="">${ability.name}</li>`
            )
            return `<div class="form-buscar"> <div class="card-header" style="background-image: url(${sprites.other.home.front_default})"></div><div class="card-body"><h2 class="name">${name}</h2><div class="sprites"><img id="first-sprite" src="${sprites.front_default}" alt="front-sprite"><img id="second-sprite" src="${sprites.back_default}" alt="back-sprite"></div> </div><div class="card-footer"><div class="stats"><div class="stat"><span class="label">Height</span><span class="value">${height}</span></div><div class="stat"><span class="label">Weight</span><span class="value">${weight}</span></div><div class="stat"><span class="label">ID#</span><span class="value">${id}</span></div></div><div class="stats"><div class="stat"><span class="label">Type</span>${typeList.join("")}</div><div class="stat"><span class="label">Abilities</span><ul>${abilitiesList.join("")}</ul></div><div class="stat"><span class="label">Evolution chain</span><ul>${evoList.join("")}<ul></div></div></div></div> </div>`;
          },

          abilityCard: ({ id, name, pokemon }) => {
            const pokemonList = pokemon.map(
              ({ pokemon, is_hidden }) =>
                `<li><a>${pokemon.name}${
                  is_hidden ? `<img class="list-icon" src="./img/eye.svg" height="15px">` : ""
                }</a></li>`
            );
            return ` <div class="form-buscar"><div class="form-buscar"><h1>${name} (${id})</h1><ul>${pokemonList.join("")}</ul></div></div>`;
          },
          ocultar(id) {
            const elemento = document.querySelector(id);
            if (elemento) {
              elemento.style.visibility = "hidden";
            }
          },

        limpiar() {
            const tarjeta = App.HTMLElements.pokemonFinderOutput;
            tarjeta.innerHTML = "";
            this.ocultar('#pokemon-finder-response');
            this.ocultar('#limpiar');
            App.HTMLElements.texto.value="";
          }
        },

         handlers: {
          pokemonFinderFormOnSubmit: async (e) => {
            e.preventDefault();
            
            const queryForm = App.HTMLElements.pokemonFinderInput.value;
            const searchType = App.HTMLElements.pokemonFinderSearchType.value;
            
            let query = queryForm.toLowerCase();
            
            try {
              const response = await Utils.getPokemon({
                query,
                searchType,
              });
              if(searchType === "pokemon"){
              const evolution = await Utils.getEvolution(response.species.url);
              const evoChain = await Utils.getEvolution(evolution.evolution_chain.url);
              const evoManda = evoChain.chain;
              const { species } = response;
              if (species) {
                response['chain_evolves'] = await Utils.getEvolutionChain(evoManda)
              };
            }
            
    
            const renderedTemplate = App.templates.render({
                searchType,
                response
              });
              App.HTMLElements.pokemonFinderOutput.innerHTML = renderedTemplate;
            } catch (error) {
              App.HTMLElements.pokemonFinderOutput.innerHTML = `<h1>${error}</h1>`;
            }
        },

            cleanForm(event) {
                event.preventDefault();
                App.methods.limpiar();
            }
    },
  };
  App.init();

})(document.Utils);