import _ from 'lodash';

import { openProfile } from 'shoutem.auth';

import { loadUser } from '../redux/actions';

export function openProfileForLegacyUser(dispatch) {
  return (legacyUser) => dispatch(loadUser(`legacyUser:${legacyUser.legacyId}`))
  .then((user) => {
    const fetchedUser = user.payload.data;
    const unpackedUser = {
      id: fetchedUser.id,
      ...fetchedUser.attributes,
    };

    return dispatch(openProfile(unpackedUser));
  });
}

export function adaptSocialUserForProfileScreen(user) {
  const id = _.get(user, 'id', -1);

  return {
    id: _.toString(id),
    legacyId: parseInt(id, 10),
    profile: {
      firstName: _.get(user, 'first_name', ''),
      lastName: _.get(user, 'last_name', ''),
      nickname: _.get(user, 'screen_name', ''),
      image: _.get(user, 'profile_image_url', ''),
    },
    username: _.get(user, 'email', ''),
  };
}
