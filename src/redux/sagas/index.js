import watchingSongSagas from './songs';
import watchingUserSagas from './user';
import watchingArtistSagas from './artists';

export default [ ...watchingSongSagas, ...watchingUserSagas, ...watchingArtistSagas ];
