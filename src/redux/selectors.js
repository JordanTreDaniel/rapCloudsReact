import { createSelector } from 'reselect';

export const getUser = state => state.userInfo.user;
export const getSongs = state => {
    const { songs } = state.songs;
    return songs
}
export const getAccessToken = createSelector(
    getUser,
    user => user.accessToken
)

