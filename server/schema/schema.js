import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';

//  Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//  Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
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
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return Project.findById(args.id);
      },
    },

    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return Client.findById(args.id);
      },
    },
  },
});

// Mutations

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add A new Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },

    // Delete a Client
    deleteClient: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },

    // Update a Client
    updateClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Client.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
              phone: args.phone,
            },
          },
          { new: true }
        );
      },
    },

    // Add A new Project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              Pending: { value: 'Not Started' },
              Progress: { value: 'In Progress' },
              Completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },

    // Delete a Project
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },

    // Update a Project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              Pending: { value: 'Not Started' },
              Progress: { value: 'In Progress' },
              Completed: { value: 'Completed' },
            },
          }),
        },
        resolve(parent, args) {
          return Project.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
                description: args.description,
                status: args.status,
              },
            },
            { new: true }
          );
        },
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation });
