package com.bank.controller;

import com.bank.dto.BranchSummaryDTO;
import com.bank.entity.Transaction;
import com.bank.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Overall system summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSystemSummary() {
        return ResponseEntity.ok(reportService.getSystemSummary());
    }

    // Branch wise summary
    @GetMapping("/branch-summary")
    public ResponseEntity<List<BranchSummaryDTO>> getBranchSummary() {
        return ResponseEntity.ok(reportService.getBranchSummary());
    }

    // Recent 10 transactions
    @GetMapping("/transactions/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions() {
        return ResponseEntity.ok(
                reportService.getRecentTransactions());
    }
}