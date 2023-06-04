(() => {
    const Utils = {
      settings: {
        backendBaseUrl: "https://pokeapi.co/api/v2",
      },
      getFormattedBackendUrl: ({ query, searchType }) => {
        return `${Utils.settings.backendBaseUrl}/${searchType}/${query}`;
      },
      getPokemon: ({ query, searchType = "pokemon" }) => {
        return Utils.fetch({
          url: Utils.getFormattedBackendUrl({ query, searchType }),
          searchType,
        });
      },
      getEvolution: async (url) => {
        try {
          const rawResponse = await fetch(url);  
          return rawResponse.json(); 
        } catch (error) {
          
        }
      },
      fetch: async ({ url, searchType }) => {
        try {
          const rawResponse = await fetch(url);
          if (rawResponse.status !== 200) {
            throw new Error(`${searchType} not found`);
          }
          return rawResponse.json();
        } catch (error) {
          throw error;
        }
      },
      getEvolutionChain: ({ species, is_baby, evolves_to }) => {
        let evoArray = [];
        evoArray.push({ name: species.name, is_baby: is_baby });
  
        while (evolves_to.length > 0) {
          evolves_to.forEach(({ species, is_baby }) => {
            evoArray.push({ name: species.name, is_baby: is_baby });
          });
          evolves_to = evolves_to[0].evolves_to
        }
        return evoArray;
    }
    };
    document.Utils = Utils;
  })();