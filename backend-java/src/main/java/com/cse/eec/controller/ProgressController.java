package com.cse.eec.controller;

import com.cse.eec.model.TopicProgress;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    private final Map<String, TopicProgress> store = new ConcurrentHashMap<>();

    @GetMapping
    public Collection<TopicProgress> listAll() {
        return store.values();
    }

    @PostMapping
    public TopicProgress upsert(@RequestBody TopicProgress progress) {
        store.put(progress.topicId(), progress);
        return progress;
    }
}
