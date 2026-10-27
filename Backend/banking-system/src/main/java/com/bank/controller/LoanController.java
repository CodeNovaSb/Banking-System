package com.bank.controller;

import com.bank.entity.Loan;
import com.bank.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // GET all loans
    @GetMapping
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    // GET loan by ID
    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(
            @PathVariable Integer id) {
        Optional<Loan> loan = loanService.getLoanById(id);
        if (loan.isPresent()) {
            return ResponseEntity.ok(loan.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET loans by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Loan>> getLoansByCustomer(
            @PathVariable Integer customerId) {
        List<Loan> loans =
                loanService.getLoansByCustomerId(customerId);
        return ResponseEntity.ok(loans);
    }

    // CREATE loan
    @PostMapping
    public ResponseEntity<?> createLoan(@RequestBody Loan loan) {
        try {
            Loan created = loanService.createLoan(loan);
            return ResponseEntity
                    .status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error creating loan: " + e.getMessage());
        }
    }
}