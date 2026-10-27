package com.bank.repository;

import com.bank.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Get all payments for a specific account
    List<Payment> findByAccount_AccountId(Integer accountId);
}