package com.org.mes.io.Mes.io.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private String sender;
    private String receiver;
    private String content;
}
