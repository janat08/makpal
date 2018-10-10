import { SchemaLink } from 'apollo-link-schema';
import modules from '../../../index.ts';
import { isApiExternal, apiUrl } from '../../../../net';
import createApolloClient from '../../../../../common/createApolloClient';
import CURRENT_USER_QUERY from '../../../../../client/modules/user/graphql/CurrentUserQuery.graphql';

/*
import gql from 'graphql-tag';  

var CURRENT_USER_QUERY = gql`
fragment UserProfileInfo on UserProfile {
  firstName
  lastName
  fullName
}

fragment UserInfo on User {
  id
  username
  role
  isActive
  email
  profile {
    ...UserProfileInfo
  }
  auth {
    certificate {
      serial
    }
    facebook {
      fbId
      displayName
    }
    google {
      googleId
      displayName
    }
    github {
      ghId
      displayName
    }
    linkedin {
      lnId
      displayName
    }
  }
}

query currentUser {
  currentUser {
    ...UserInfo
  }
}
`
*/

export default async function getCurrentUser(req, res) {
  /*
  const schema = require('../../../../api/schema').default;
  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });
  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined
  });

  return await client.query({ query: CURRENT_USER_QUERY }); 
  */
 return 1;
}
