package com.kaleidoscope314.boosterrockets.controllers;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class FlashcardController {

    @GetMapping(value = "/api/flashcard", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    byte[] getAllFlashcards() throws IOException {
        return Files.readAllBytes(Paths.get("src/main/resources/all-flashcards.json"));
    }

}
