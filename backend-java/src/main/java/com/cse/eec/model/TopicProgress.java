package com.cse.eec.model;

public record TopicProgress(
    String topicId,
    String topicTitleEn,
    boolean mastered,
    int quizScore,
    String languagePreference
) {}
