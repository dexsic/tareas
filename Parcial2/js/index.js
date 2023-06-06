(() => {
  const App = {
    HTMLElements: {
      pokemonForm: document.querySelector("#pokemon-form"),
      pokemonTipo: document.querySelector("#pokemon-tipo"),
      pokemonBuscar: document.querySelector("#pokemon-buscar"),
      pokemonCarta: document.querySelector("#pokemon-carta"),
      limpiar: document.querySelector("#limpiar"),
    },

    utils: Utils,
    templates: {
      render: ({ searchType, response }) => {
        const renderMap = {
          ability: App.templates.ability,
          pokemon: App.templates.pokemon,
        };
        return renderMap[searchType]
          ? renderMap[searchType](response)
          : App.templates.error();
      },

      error: () => `<h1>Error</h1>`,
      pokemon: ({
        id,
        name,
        weight,
        height,
        abilities,
        sprites,
        chain_evolves,
      }) => {
        const evoList = chain_evolves.map(
          ({ name, is_baby }) =>
            `<li class="li-icons">${name} ${
              is_baby
                ? '<img class="list-icon" src="./img/baby.svg" height="5px">'
                : ""
            }</li>`
        );
        const abilitiesList = abilities.map(
          ({ ability }) => `<li class="">${ability.name}</li>`
        );
        return `<div class="form-buscar"> 
                  <div class="card-header" style="background-image: url(${
                    sprites.other.home.front_default
                  })"></div>
                <div class="card-body"> 
                  <h2 class="name">${name} (${id})</h2> 
                    <h3>Sprites</h3>
                      <div class="sprites"><img src="${
                        sprites.front_default
                      }" alt="front-sprite">
                        <img src="${sprites.back_default}" alt="sprite">
                      </div> 
                </div>
                <div class="card-footer">
                  <div class="stats">
                    <div class="stat">
                      <h3>Weight / Height</h3>
                      <p>${weight} / ${height}</p>
                    </div>
                  </div>
                <div class="stat"><h3>Abilities</h3><ul>${abilitiesList.join(
                  ""
                )}</ul>
                </div>
            <div class="stat"><h3>Evolution chain</h3><ul>${evoList.join(
              ""
            )}<ul>
            </div>
          </div>
        </div>
    </div>`;
      },

      ability: ({ id, name, pokemon }) => {
        const pokemonList = pokemon.map(
          ({ pokemon, is_hidden }) =>
            `<li><a>${pokemon.name}${
              is_hidden
                ? `<img class="list-icon" src="./img/eye.svg" height="15px">`
                : ""
            }</a></li>`
        );
        return ` <div class="form-buscar"><div class="form-buscar"><h1>${name} (${id})</h1><ul>${pokemonList.join(
          ""
        )}</ul></div></div>`;
      },
    },

    handlers: {
      pokemonFinderFormOnSubmit: async (e) => {
        e.preventDefault();

        const queryForm = App.HTMLElements.pokemonBuscar.value;
        const searchType = App.HTMLElements.pokemonTipo.value;
        App.HTMLElements.limpiar.style.visibility = "visible";

        let query = queryForm.toLowerCase();

        try {
          const response = await Utils.getPokemon({
            query,
            searchType,
          });
          if (searchType === "pokemon") {
            const evolution = await Utils.getEvolution(response.species.url);
            const evoChain = await Utils.getEvolution(
              evolution.evolution_chain.url
            );
            const evoManda = evoChain.chain;
            const { species } = response;
            if (species) {
              response["chain_evolves"] = await Utils.getEvolutionChain(
                evoManda
              );
            }
          }

          const renderedTemplate = App.templates.render({
            searchType,
            response,
          });
          App.HTMLElements.pokemonCarta.innerHTML = renderedTemplate;
        } catch (error) {
          App.HTMLElements.pokemonCarta.innerHTML = `<h1>${error}</h1>`;
        }
      },

      limpiar(e) {
        e.preventDefault();
        App.HTMLElements.pokemonForm.reset();
        App.HTMLElements.pokemonCarta.innerHTML = "";
        App.HTMLElements.limpiar.style.visibility = "hidden";
      },
    },

    init() {
      App.HTMLElements.pokemonForm.addEventListener(
        "submit",
        App.handlers.pokemonFinderFormOnSubmit
      );

      App.HTMLElements.limpiar.addEventListener("click", App.handlers.limpiar);
    },
  };
  App.init();
})();
