import { PostType } from '@prisma/client';

export async function deleteCacheKeyOnDemand(
  cacheKeys: string[],
  redisCache: any,
): Promise<void> {
  for (const key of cacheKeys) {
    await redisCache.del(key);
  }
}

export function generatePostCacheKeys(
  postId: number,
  slug: string,
  postType: PostType,
): string[] {
  return [
    `/api/${postType}/slug/${slug}`.toLocaleLowerCase(),
    `/api/${postType}/one/${postId}`.toLocaleLowerCase(),
  ];
}
