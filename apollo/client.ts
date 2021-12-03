import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/client';
import { getToken } from 'next-auth/jwt';
import { onError } from '@apollo/client/link/error';
import Router from 'next/router';
const secret = process.env.SECRET;

let apolloClient;

const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
    //   console.error(graphQLErrors);
      graphQLErrors.forEach(({ message, extensions, locations, path }) => {
      
        if(extensions.code == 'UNAUTHENTICATED') {
            const { response } = operation.getContext();
            // console.log({response});
            if(!(typeof window === 'undefined')) {
                Router.replace('/');
            }
            // document.location = operation.headers.get('Location');
        }
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Code: ${extensions.code}`);
      });
    }
    // if (networkError) {
    //   console.warn(networkError);
    // }
    // forward(operation);
});

const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_ENDPOINT
});

const authLink = setContext(async (request, { headers }) => {
    // const token = await getToken({, secret});
    const res = await fetch('http://localhost:3000/api/jwt');
    const token = await res.json();
    console.log({'AUTH LINK': token});
    return {
        headers: {
            ...headers,
            authorization: token ? token.accessToken : '' 
        }
    };
});

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            PetType: {
                keyFields: ['id']
            }
        }
    })
});

export function createApolloClient(token: string) {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      link: from([
            errorLink,
            setContext(async (request, { headers }) => ({headers: {...headers, authorization: token} })),
            httpLink
      ]),
      cache: new InMemoryCache()
    });
}

export default client;