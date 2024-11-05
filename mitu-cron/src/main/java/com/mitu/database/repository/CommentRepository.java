package com.mitu.database.repository;

import com.mitu.database.model.Comment;
import org.springframework.data.repository.ListCrudRepository;

public interface CommentRepository extends ListCrudRepository<Comment, Long> {
}
