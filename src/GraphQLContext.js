import { createContext, useContext } from 'react';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://evuhjs42xi.execute-api.eu-central-1.amazonaws.com/test/graphql');

const GraphQLContext = createContext(null);

const GraphQLProvider = (props) => (
    <GraphQLContext.Provider value={client}>
        {props.children}
    </GraphQLContext.Provider>
);

const useGraphQL = () => {
    const client = useContext(GraphQLContext);
    return client;
};

export { GraphQLProvider, useGraphQL };