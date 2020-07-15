package com.kaleidoscope314.boosterrockets.controllers;

import com.kaleidoscope314.boosterrockets.models.Question;
import com.kaleidoscope314.boosterrockets.models.User;
import com.kaleidoscope314.boosterrockets.models.data.QuestionRepository;
import com.kaleidoscope314.boosterrockets.models.data.UserRepository;
import com.kaleidoscope314.boosterrockets.security.services.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/question")
public class QuestionController {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserAuthService userAuthService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getQuestions(@RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        String userName = userAuthService.getUserName(headerAuth);
        Optional<User> userOptional = userRepository.findByName(userName);

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            User user = userOptional.get();
            Optional<Iterable<Question>> questionsOptional = questionRepository.findByUserId(user.getId());

            if(questionsOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(questionsOptional.get(), HttpStatus.OK);
            }
        }
    }

//    @GetMapping("/{projectId}")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> getQuestionById(@PathVariable("questionId") int projectId,
//                                            @RequestHeader HttpHeaders headers) {
//
//        String headerAuth = headers.getFirst("Authorization");
//        Optional<Project> projectOptional = projectRepository.findById(projectId);
//
//        // make sure the project exists
//        if (projectOptional.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // returns 404 if id does not exist in database
//        } else {
//            int userId = projectOptional.get().getUser().getId();
//            // checks to see if the project requested belongs to the user
//            if (userAuthService.doesUserMatch(userId, headerAuth)) {
//                return new ResponseEntity<>(projectOptional.get(), HttpStatus.OK);
//            }
//        }
//
//        // Returns 401 if user attempts to access another user's project
//        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//    }

    // Returns json in form { 'id': question.id }
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> postQuestion(@RequestBody Question question, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        String userName = userAuthService.getUserName(headerAuth);
        Optional<User> userOptional = userRepository.findByName(userName);

        if (userName != null && userOptional.isPresent()) {

            User user = userOptional.get();
            question.setUser(user);
            questionRepository.save(question);

            int id = question.getId();
            Map<String, String> map = Collections.singletonMap("id", Integer.toString(id));
            return new ResponseEntity<>(map, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateQuestionById(@RequestBody Question question, @PathVariable("questionId") int questionId,
                                               @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Question> questionOptional = questionRepository.findById(questionId);

        if (questionOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(questionOptional.get().getUser().getId(), headerAuth)
                && questionOptional.get().getId() == question.getId()) {

            question.setUser(questionOptional.get().getUser()); // make sure the updated entity is associated with user
            questionRepository.save(question);

            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

//    @DeleteMapping("/{questionId}")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<?> deleteQuestion(@PathVariable("questionId") int questionId,
//                                           @RequestHeader HttpHeaders headers) {
//
//        String headerAuth = headers.getFirst("Authorization");
//        Optional<Question> projectOptional = questionRepository.findById(questionId);
//
//        // Check and see if question exists
//        if (projectOptional.isEmpty()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        } else if (userAuthService.doesUserMatch(projectOptional.get().getUser().getId(), headerAuth)) {
//
//            // lastly delete the question
//            questionRepository.deleteById(questionId);
//
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Best practice response code I think
//        } else {
//            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//        }
//    }
}
