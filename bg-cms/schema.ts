import type { Lists } from '.keystone/types'
import { list } from '@keystone-6/core'

import { allowAll } from '@keystone-6/core/access'

import {
  checkbox,
  password,
  relationship,
  text,
  timestamp,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import { isAdmin } from './auth'

export const lists = {
  User: list({
    access: isAdmin,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      isAdmin: checkbox(),
    },
  }),

  Post: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      titleGerman: text({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      contentGerman: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      tags: relationship({
        ref: 'Tag.posts',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  Tag: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
      projects: relationship({ ref: 'Project.tags', many: true }),
    },
  }),

  Project: list({
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      titleGerman: text({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      startedAt: timestamp({
        db: { isNullable: true },
      }),
      finishedAt: timestamp({
        db: { isNullable: true },
      }),
      shortDescription: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      shortDescriptionGerman: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      contentGerman: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      tags: relationship({
        ref: 'Tag.projects',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),
} satisfies Lists
