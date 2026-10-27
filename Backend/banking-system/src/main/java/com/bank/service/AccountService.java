package com.bank.service;

import com.bank.entity.Account;
import com.bank.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // GET ALL accounts
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // GET account by ID
    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    // GET accounts by customer ID
    public List<Account> getAccountsByCustomerId(Integer customerId) {
        return accountRepository.findByCustomer_CustomerId(customerId);
    }

    // CREATE new account
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    // UPDATE existing account
    public Account updateAccount(Integer id, Account updatedAccount) {
        Optional<Account> existing = accountRepository.findById(id);

        if (existing.isPresent()) {
            Account account = existing.get();
            account.setAccountType(updatedAccount.getAccountType());
            account.setBalance(updatedAccount.getBalance());
            account.setCustomer(updatedAccount.getCustomer());
            account.setBranch(updatedAccount.getBranch());
            account.setCreatedDate(updatedAccount.getCreatedDate());
            return accountRepository.save(account);
        } else {
            return null;
        }
    }

    // DELETE account
    public boolean deleteAccount(Integer id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}