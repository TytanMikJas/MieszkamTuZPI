package com.mitu.database.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Embeddable
@EqualsAndHashCode
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostVoteId implements Serializable {
    private Long userId;
    @ManyToOne
    @JoinColumn(name = "postId")
    private Post post;
}