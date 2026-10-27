package com.bank.repository;

import com.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, Integer> {

    // Get all transactions for a specific account
    List<Transaction> findByAccount_AccountId(Integer accountId);

    // Get last 10 transactions system-wide (for reports)
    List<Transaction> findTop10ByOrderByTransactionDateDesc();
}