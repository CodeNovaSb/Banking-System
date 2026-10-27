package com.bank.controller;

import com.bank.entity.Card;
import com.bank.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {

    @Autowired
    private CardService cardService;

    // GET all cards
    @GetMapping
    public ResponseEntity<List<Card>> getAllCards() {
        return ResponseEntity.ok(cardService.getAllCards());
    }

    // GET card by ID
    @GetMapping("/{id}")
    public ResponseEntity<Card> getCardById(
            @PathVariable Integer id) {
        Optional<Card> card = cardService.getCardById(id);
        if (card.isPresent()) {
            return ResponseEntity.ok(card.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET cards by account ID
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Card>> getCardsByAccount(
            @PathVariable Integer accountId) {
        List<Card> cards =
                cardService.getCardsByAccountId(accountId);
        return ResponseEntity.ok(cards);
    }

    // CREATE card
    @PostMapping
    public ResponseEntity<?> createCard(
            @RequestBody Card card) {
        try {
            Card created = cardService.createCard(card);
            return ResponseEntity
                    .status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating card: " + e.getMessage());
        }
    }
}