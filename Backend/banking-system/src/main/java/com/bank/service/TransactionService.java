package com.bank.service;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    // GET ALL transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // GET transaction by ID
    public Optional<Transaction> getTransactionById(Integer id) {
        return transactionRepository.findById(id);
    }

    // GET transactions by account ID
    public List<Transaction> getTransactionsByAccountId(Integer accountId) {
        return transactionRepository.findByAccount_AccountId(accountId);
    }

    // CREATE transaction (with balance update logic)
    public Transaction createTransaction(Transaction transaction) {

        // Step 1 — Find the account
        Integer accountId = transaction.getAccount().getAccountId();
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found with id: "
                                + accountId));

        // Step 2 — Get the amount
        BigDecimal amount = transaction.getAmount();
        String type = transaction.getTransactionType();

        // Step 3 — Update balance based on transaction type
        if (type.equalsIgnoreCase("Credit")) {
            // Add amount to balance
            account.setBalance(account.getBalance().add(amount));

        } else if (type.equalsIgnoreCase("Debit")) {
            // Check if sufficient balance exists
            if (account.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
             }
            // Deduct amount from balance
            account.setBalance(account.getBalance().subtract(amount));

        } else if (type.equalsIgnoreCase("Transfer")) {
            // Check if sufficient balance exists
            if (account.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            // Deduct amount from balance
            account.setBalance(account.getBalance().subtract(amount));

        } else {
            throw new RuntimeException(
                    "Invalid transaction type. Use Credit, Debit or Transfer");
        }

        // Step 4 — Save updated balance back to account
        accountRepository.save(account);

        // Step 5 — Set transaction date to now and save transaction
        transaction.setTransactionDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    // GET last 10 transactions (for reports)
    public List<Transaction> getRecentTransactions() {
        return transactionRepository
                .findTop10ByOrderByTransactionDateDesc();
    }
}