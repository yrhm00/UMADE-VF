package com.umade.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping("/presign")
    public Map<String, String> getPresignedUrl(
            @RequestParam String type,
            @RequestParam String contentType) {
        String url = storageService.generatePresignedUrl(type, contentType);
        return Map.of("url", url);
    }
}
