package com.mitu.database.repository;

import com.mitu.database.model.Comment;
import com.mitu.MainRunner;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

@DataJpaTest
@ContextConfiguration(classes = MainRunner.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class CommentRepositoryTest {
    @Autowired
    private CommentRepository commentRepository;

    @Nested
    class FindAll {
        @Test
        public void shouldReturnNonEmptyList() {
            List<Comment> res = commentRepository.findAll();

            assertFalse(res.isEmpty());
        }
    }
}
