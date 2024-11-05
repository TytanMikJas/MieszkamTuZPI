package com.mitu.database.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Comment {
    @Id
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "id")
    private Post post;

    @MapsId
    @OneToOne
    @JoinColumn(name = "parentNodeId")
    private Post parentPost;

    @Enumerated(EnumType.STRING)
    private CommentStatus status;
}
