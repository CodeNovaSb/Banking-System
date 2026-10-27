package com.bank.service;

import com.bank.entity.Payment;
import com.bank.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // GET ALL payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // GET payment by ID
    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }

    // GET payments by account ID
    public List<Payment> getPaymentsByAccountId(Integer accountId) {
        return paymentRepository.findByAccount_AccountId(accountId);
    }

    // CREATE payment
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}