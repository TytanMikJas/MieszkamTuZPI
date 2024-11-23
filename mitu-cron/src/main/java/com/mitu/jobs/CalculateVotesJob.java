package com.mitu.jobs;

import com.mitu.database.model.Comment;
import com.mitu.database.model.Post;
import com.mitu.database.model.PostVote;
import com.mitu.database.model.PostVoteType;
import com.mitu.database.repository.CommentRepository;
import com.mitu.database.repository.PostRepository;
import com.mitu.database.repository.PostVoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@EnableScheduling
public class CalculateVotesJob {
    private final PostRepository postRepository;
    private final PostVoteRepository postVoteRepository;

    private static final int ONE_DAY = 1000 * 60 * 60 * 24;
    private static final int TEN_SECONDS = 1000 * 10;
    private final CommentRepository commentRepository;

    @SuppressWarnings("ResultOfMethodCallIgnored")
    @Scheduled(fixedDelay = CalculateVotesJob.ONE_DAY)
    @Transactional
    public void syncPostVotes(){
        log.info("Starting sync post votes job");
        List<PostVote> postVotes = postVoteRepository.findAll();
        List<Post> posts = postVotes.stream().map(pv -> pv.getId().getPost()).distinct().toList();
        posts = posts.stream().map(post -> {
            Long upvotesCount = postVotes.stream()
                            .filter(pv -> pv.getId().getPost() == post)
                                    .filter(pv -> pv.getType() == PostVoteType.UPVOTE)
                                            .count();
            Long downvotesCount = postVotes.stream()
                    .filter(pv -> pv.getId().getPost() == post)
                    .filter(pv -> pv.getType() == PostVoteType.DOWNVOTE)
                    .count();
            post.setUpvoteCount(upvotesCount);
            post.setDownvoteCount(downvotesCount);
            return post;
        }).toList();
        postRepository.saveAll(posts);
    }

    @Transactional
    @Scheduled(fixedDelay = ONE_DAY)
    public void syncPostCommentCounts(){
        log.info("Starting sync post comment counts job");
        List<Comment> comments = commentRepository.findAll();
        List<Post> posts = comments.stream().map(Comment::getPost).distinct().toList();

        posts.forEach(post -> {
            Long commentCounts = comments.stream()
                    .filter(c -> c.getPost() == post)
                    .count();
            post.setCommentCount(commentCounts);
        });
        commentRepository.saveAll(comments);
    }
}
