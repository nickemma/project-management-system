import { clients, projects } from '../sampleData.js';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
} from 'graphql';

//  Client Type
const ClientType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return clients.find((client) => client.id === args.id);
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery });
