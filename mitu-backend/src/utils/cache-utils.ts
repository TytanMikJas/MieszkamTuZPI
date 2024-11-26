import { PostType } from '@prisma/client';

export async function deleteCacheKeyOnDemand(
  cacheKeys: string[],
  redisCache: any,
): Promise<void> {
  for (const key of cacheKeys) {
    const k = await redisCache.get(key);
    if (k) {
      await redisCache.del(key);
    } else {
      await redisCache.reset();
    }
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
    `/api/${postType}`.toLocaleLowerCase(),
  ];
}
