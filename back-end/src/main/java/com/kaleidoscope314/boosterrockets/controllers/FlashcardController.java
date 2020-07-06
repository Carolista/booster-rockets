package com.kaleidoscope314.boosterrockets.controllers;

import com.kaleidoscope314.boosterrockets.models.Flashcard;
import com.kaleidoscope314.boosterrockets.models.data.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/flashcards")@Controller
public class FlashcardController {

    @Autowired
    FlashcardRepository flashcardRepository;

    @GetMapping
    public ResponseEntity<?> getFlashcards(@RequestHeader HttpHeaders headers) {
        List flashcards = (List<Flashcard>) flashcardRepository.findAll();
        if(flashcards.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(flashcards, HttpStatus.OK);
        }
    }

}
