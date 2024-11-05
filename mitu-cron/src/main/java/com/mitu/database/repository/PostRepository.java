package com.mitu.database.repository;

import com.mitu.database.model.Post;
import org.springframework.data.repository.ListCrudRepository;

public interface PostRepository extends ListCrudRepository<Post, Long> {

}
