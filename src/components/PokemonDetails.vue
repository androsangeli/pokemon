<template>
<div v-if="pokemon">
    <h2 v-if="pokemon.types" class="mb-5 ml-0"><span class="text-bold">Types:</span> <span v-if="pokemon.types" v-for="type,index in pokemon.types">{{ type.type.name }}{{ index === (pokemon.types.length-1) ? '' : ', ' }}</span></h2>
    <hr class="mb-5"/>
    <h2 v-if="pokemon.abilities && pokemon.abilities.length" class="text-bold">Abilities:</h2>
    <v-data-table
        v-if="pokemon.abilities && pokemon.abilities.length"
        :headers="[{key:'__typename', title: 'Type'}, {key:'ability', title: 'Ability'}]"
        :items="pokemon.abilities"
        item-value="name"
        items-per-page="5"
        return-object
        class="mb-5 ml-0 border"
        >
        <template v-slot:item.ability="{ item }">
            <div>{{ item.ability.name }} ( <a :href="item.ability.url" target="_blank">{{ item.ability.url }}</a> )</div>
        </template>
    </v-data-table>
    <hr class="mb-5"/>
    <h2 v-if="pokemon.moves && pokemon.moves.length" class="text-bold">Moves:</h2>
    <v-data-table
        v-if="pokemon.moves && pokemon.moves.length"
        :headers="[{key:'__typename', title: 'Type'}, {key:'move', title: 'Move'}]"
        :items="pokemon.moves"
        item-value="name"
        items-per-page="5"
        return-object
        class="mb-5 ml-0 border"
        >
        <template v-slot:item.move="{ item }">
          <div>{{ item.move.name }} ( <a :href="item.move.url" target="_blank">{{ item.move.url }}</a> )</div>
        </template>
    </v-data-table>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { gql } from 'graphql-tag';
import apolloClient from '@/services/apollo';
export default {
    props:['name'],
    setup(props, { emit, slots }) {
        
        const pokemon = ref(null);
        const GET_POKEMON_DETAILS = gql`
        query GetPokemon($name: String!) {
          pokemon(name: $name) {
            id
            name
            height
            weight
            types {
              type {
                name
                url
              }
            }
            abilities {
              ability {
                name
                url
              }
            }
            moves {
              move {
                name
                url
              }
            }
          }
        }`;

        async function queryDetails() {
            try {
                const queryResult = await apolloClient.query({
                query:GET_POKEMON_DETAILS,
                variables: {
                    name: props.name,
                }
                });
                pokemon.value = queryResult?.data?.pokemon || [];
            } catch(error) {
                console.error(error);
            }
            }

        onMounted(async () => {
            await queryDetails()
        })
        return {
            pokemon
        }
    }
}
</script>
<style scoped>
.text-bold {
  font-weight: 700;
  font-size: 24px;
  position: relative;
}
</style>