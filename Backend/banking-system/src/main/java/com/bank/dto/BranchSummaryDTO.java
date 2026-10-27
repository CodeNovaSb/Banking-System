package com.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BranchSummaryDTO {
    private String branchName;
    private String city;
    private Long totalAccounts;
    private BigDecimal totalBalance;
}