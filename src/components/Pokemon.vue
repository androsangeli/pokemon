<script>
import { ref, onMounted, reactive } from 'vue';
import { gql } from 'graphql-tag';
import apolloClient from '@/services/apollo'
import PokemonDetails from '@/components/PokemonDetails.vue';
export default {
  components: {
    PokemonDetails
  },
    setup(props, { emit }) {
        const pokemons = ref([]);
        const pokemonsFavourites = ref([]);
        const pokemonsNonFavourites = ref([]);
        const selectedPokemon = ref(null);
        const selectedPokemons = ref(null);
        const selectedFavouritePokemons = ref(null);
        const selectedNonFavouritePokemons = ref(null);
        const dialog = ref(false);

        async function openModal (item) {
          selectedPokemon.value = item;
          dialog.value = true;
        }
        function onRowClick(e, { item }) {
          const currentRowReactive = item.value
        }
        const addFavourites = (item) => {
          item.isFavourite = true;
          pokemonsFavourites.value.push(item)
          const addFavouritesToPokemons = reactive(
          pokemonsNonFavourites.value.filter((record) => {
              return record.isFavourite === false;
          }));
          pokemonsNonFavourites.value = addFavouritesToPokemons;
        };
        const deleteFavourites = (item) => {
          item.isFavourite = false;
          pokemonsNonFavourites.value.push(item)
          const deleteFavouritesToPokemons = reactive(
          pokemonsFavourites.value.filter((record) => {
              return record.isFavourite === true;
          }));
          pokemonsFavourites.value = deleteFavouritesToPokemons;
        };
        const addSelectedToFavourites = () => {
          selectedNonFavouritePokemons.value.forEach((item, index) => {  
            item.isFavourite = true;  
            selectedNonFavouritePokemons.value[index].isFavourite = true;
            pokemonsFavourites.value.push(item)
            pokemonsNonFavourites.value = pokemonsNonFavourites.value.reduce((acc, element) => {
                if (element.name !== item.name) {
                    acc.push(element);
                }
                return acc;
            }, []);
          });
          selectedNonFavouritePokemons.value = [];
        };
        const deleteSelectedFromFavourites = () => {
          selectedFavouritePokemons.value.forEach((item, index) => {  
            item.isFavourite = false;  
            selectedFavouritePokemons.value[index].isFavourite = false;
            pokemonsNonFavourites.value.push(item)
            pokemonsFavourites.value = pokemonsFavourites.value.reduce((acc, element) => {
                if (element.name !== item.name) {
                    acc.push(element);
                }
                return acc;
            }, []);
          });
          selectedFavouritePokemons.value = [];
        };

        const GET_POKEMONS = gql`
        query getPokemons {
            pokemons(limit: 200) {
            results {
                name,
                url
            }
            }
        }`;
        async function query() {
          try {
              const queryResult = await apolloClient.query({
              query:GET_POKEMONS
              });

              pokemons.value = queryResult?.data?.pokemons?.results || [];
              const includeFavourtivesToPokemons = reactive(
                      pokemons.value.map(item => {
                  return {
                      ...item,
                      isFavourite: false
                  };
                  })
              );

              pokemons.value = includeFavourtivesToPokemons;
              pokemonsNonFavourites.value = includeFavourtivesToPokemons;


          } catch(error) {
              console.error(error);
          }
        }

        const pokemon = ref(null);
        const searchNonFavourites = ref(null);
        const searchFavourites = ref(null);
        const headers = ref([
          { key: 'view', title: '', sortable: false },
          { key: 'name', title: 'Name' },
          { key: 'url', title: 'url' },
          { key: 'isFavourite', title: 'Favourite', sortable: false }
        ]);

        const selectPokemon = (pokemon) => {
            selectedPokemon.value = pokemon
            emit('select-pokemon', pokemon);
        };

        onMounted(async () => {
            await query()
        })

        return {
          dialog,
          openModal,
          onRowClick,
          searchNonFavourites,
          searchFavourites,
          headers,
          pokemon,
          pokemons,
          selectedPokemon,
          selectedPokemons,
          selectedFavouritePokemons,
          selectedNonFavouritePokemons,
          selectPokemon,
          addFavourites,
          deleteFavourites,
          addSelectedToFavourites,
          deleteSelectedFromFavourites,
          pokemonsFavourites,
          pokemonsNonFavourites
        }
    }
}
</script>

<template>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card>
        <v-card-title>
          <h1 class="headline"><span class="mdi md-36" :class="selectedPokemon.isFavourite ? 'mdi-octagram' : 'mdi-octagram-outline'"></span> {{ selectedPokemon.name }}</h1>
          <p>URL: {{ selectedPokemon.url }}</p>
        </v-card-title>
        <v-card-text>
          <pokemon-details v-if="dialog && selectedPokemon" :key="selectedPokemon.url" :name="selectedPokemon.name"></pokemon-details>
        </v-card-text>
        <v-card-actions>
          <v-btn class="btn-close-modal" @click="dialog = false" bg-color="primary" size="lg" elevated>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card
      v-if="pokemons && pokemonsNonFavourites.length"
      flat
      class="pokemon-datatable"
    >
    <v-row align="start">
      <v-col>
        <v-card-title><span class="mdi mdi-octagram-outline"></span> Non Favourites </v-card-title>
        </v-col>
    </v-row>
    <v-row>
      <v-col class="px-10">
        <v-text-field
            v-model="searchNonFavourites"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
    <v-col>
      <v-data-table
        v-model="selectedNonFavouritePokemons"
        :sort-by="[{ key: 'name', order:'asc'}]"
        :headers="headers"
        :items="pokemonsNonFavourites"
        :search="searchNonFavourites"
        item-value="name"
        items-per-page="5"
        return-object
        show-select
        @click:row="onRowClick"
        >
        <template v-slot:item.view="{ item }">
          <v-btn @click="openModal(item)" color="primary" elevated><i class="mdi mdi-eye"></i>&nbsp;View</v-btn>
        </template>
        <template v-slot:item.isFavourite="{ item }">
          <span>
            <v-btn class="btn-favourites" flat @click="!item.isFavourite ? addFavourites(item) : deleteFavourites(item)">
              <v-checkbox v-model="item.isFavourite" readonly></v-checkbox>
              <v-tooltip activator="parent" location="top">Add {{ item.name }}</v-tooltip>
            </v-btn>
          </span>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <v-row>     
    <v-col>
      <v-btn v-if="selectedNonFavouritePokemons && selectedNonFavouritePokemons.length" @click="addSelectedToFavourites" color="success" class="mb-5 ml-5">Add to Favourites</v-btn>
    </v-col>
  </v-row>
  </v-card>
  <v-card
    v-if="pokemons && pokemonsFavourites.length"
    flat
    class="pokemon-datatable mt-10"
    >
    <v-row align="start">
      <v-col>
        <v-card-title><span class="mdi mdi-octagram md-36" color="warning"></span> Favourites </v-card-title>
        </v-col>
    </v-row>
    <v-row>
      <v-col class="px-10">
        <v-text-field
            v-model="searchFavourites"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-model="selectedFavouritePokemons"
          :sort-by="[{ key: 'name', order:'asc'}]"
          :headers="headers"
          :items="pokemonsFavourites"
          :search="searchFavourites"
          item-value="name"
          items-per-page="5"
          return-object
          show-select
          @click:row="onRowClick"
          >
          <template v-slot:item.view="{ item }">
            <v-btn @click="openModal(item)" color="primary" elevated><i class="mdi mdi-eye"></i>&nbsp;View</v-btn>
          </template>
          <template v-slot:item.isFavourite="{ item }">
            <!-- <v-checkbox v-model="item.isFavourite" readonly></v-checkbox> -->
            <span>
              <v-btn flat class="btn-favourites" @click="!item.isFavourite ? addFavourites(item) : deleteFavourites(item)">
                <v-checkbox v-model="item.isFavourite" readonly></v-checkbox>
                <v-tooltip activator="parent" location="top">Remove {{ item.name }}</v-tooltip>
              </v-btn>
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="selectedFavouritePokemons && selectedFavouritePokemons.length" @click="deleteSelectedFromFavourites" color="warning" class="mb-5 ml-5">Remove from Favourites</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
.pokemon-datatable {
    border: 1px solid #375daa !important;
}
.btn-favourites {
  padding-bottom: 6px !important;
  margin-bottom: 16px !important;
  background: none !important;
  &:hover {
    background: none !important;
  }
}
.mdi-octagram {
  color: orange !important;
}
.mdi-octagram-outline {
  color: blue !important;
}
</style>
