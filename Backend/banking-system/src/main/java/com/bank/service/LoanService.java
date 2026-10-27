package com.bank.service;

import com.bank.entity.Loan;
import com.bank.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    // GET ALL loans
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    // GET loan by ID
    public Optional<Loan> getLoanById(Integer id) {
        return loanRepository.findById(id);
    }

    // GET loans by customer ID
    public List<Loan> getLoansByCustomerId(Integer customerId) {
        return loanRepository.findByCustomer_CustomerId(customerId);
    }

    // CREATE loan
    public Loan createLoan(Loan loan) {
        return loanRepository.save(loan);
    }
}