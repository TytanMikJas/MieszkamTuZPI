package com.mitu.database.repository;

import com.mitu.database.model.PostVote;
import com.mitu.database.model.PostVoteId;
import org.springframework.data.repository.ListCrudRepository;

public interface PostVoteRepository extends ListCrudRepository<PostVote, PostVoteId> {
}
