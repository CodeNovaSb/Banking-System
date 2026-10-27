package com.bank.repository;

import com.bank.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {

    // Get all cards for a specific account
    List<Card> findByAccount_AccountId(Integer accountId);
}