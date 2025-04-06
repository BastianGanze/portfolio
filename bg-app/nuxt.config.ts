import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 8081,
  },
  app: {
    head: {
      title: 'Bastian Ganze',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bastian Ganze\'s personal portfolio website' },
        { name: 'author', content: 'Bastian Ganze' },
        { name: 'keywords', content: 'Bastian Ganze, portfolio, web developer, game designer' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/apollo'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/graphql',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
