package com.mitu.database.model;


import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostVote {
    @EmbeddedId
    private PostVoteId id;
    private Date createdAt;
    private Date updatedAt;
    @Enumerated(EnumType.STRING)
    private PostVoteType type;


}
