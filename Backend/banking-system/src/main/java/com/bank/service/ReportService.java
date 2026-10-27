package com.bank.service;

import com.bank.dto.BranchSummaryDTO;
import com.bank.entity.Transaction;
import com.bank.repository.ReportRepository;
import com.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Overall system summary
    public Map<String, Object> getSystemSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCustomers",
                reportRepository.countTotalCustomers());
        summary.put("totalAccounts",
                reportRepository.countTotalAccounts());
        summary.put("totalBranches",
                reportRepository.countTotalBranches());
        summary.put("totalEmployees",
                reportRepository.countTotalEmployees());
        return summary;
    }

    // Branch wise summary
    public List<BranchSummaryDTO> getBranchSummary() {
        return reportRepository.getBranchSummary();
    }

    // Recent 10 transactions
    public List<Transaction> getRecentTransactions() {
        return transactionRepository
                .findTop10ByOrderByTransactionDateDesc();
    }
}