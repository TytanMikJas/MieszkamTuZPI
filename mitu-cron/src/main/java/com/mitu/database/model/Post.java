package com.mitu.database.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Entity
@Table(name = "Post")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    private Long id;
    private String content;
    @CreatedDate
    private Date createdAt;
    private Long createdById;
    private Long upvoteCount;
    private Long downvoteCount;
    private Long commentCount;
    private String thumbnail;
}
