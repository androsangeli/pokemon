import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
  })


  const httpLink = createHttpLink({
    uri: 'https://graphql-pokeapi.graphcdn.app/',
  })
  
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
    }
  })
  
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
