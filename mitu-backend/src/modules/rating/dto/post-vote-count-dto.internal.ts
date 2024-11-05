/**
 * Data transfer object for post vote count
 * @export
 * @class PostVoteCountInternalDto
 * @param {number} postId
 * @param {number} upvoteCount
 * @param {number} downvoteCount
 */
export default class PostVoteCountInternalDto {
  postId: number;
  upvoteCount: number;
  downvoteCount: number;
}
