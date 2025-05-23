import * as process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: 8081,
  },
  runtimeConfig: {
    public: {
      spacetimeEndpoint: process.env.SPACETIME_ENDPOINT || 'ws://127.0.0.1:3000',
    },
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
  modules: ['@nuxtjs/apollo', '@pinia/nuxt', '@nuxt/icon', '@nuxtjs/google-fonts', 'dayjs-nuxt'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:3333/graphql',
      },
    },
  },
  googleFonts: {
    families: {
      Lato: [300, 400, 700],
    },
    display: 'swap',
    download: true,
    preconnect: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            connections: ['@clockworklabs/spacetimedb-sdk', '@apollo/client'],
            playful: ['canvas-confetti'],
          },
        },
      },
    },
  },
})
