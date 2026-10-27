package com.bank.service;

import com.bank.entity.Card;
import com.bank.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    // GET ALL cards
    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    // GET card by ID
    public Optional<Card> getCardById(Integer id) {
        return cardRepository.findById(id);
    }

    // GET cards by account ID
    public List<Card> getCardsByAccountId(Integer accountId) {
        return cardRepository.findByAccount_AccountId(accountId);
    }

    // CREATE card
    public Card createCard(Card card) {
        return cardRepository.save(card);
    }
}