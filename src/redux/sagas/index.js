import watchingSongSagas from './songs';
import watchingUserSagas from './user';
import watchingArtistSagas from './artists';
import watchingCloudSagas from './clouds';

export default [ ...watchingSongSagas, ...watchingUserSagas, ...watchingArtistSagas, ...watchingCloudSagas ];
