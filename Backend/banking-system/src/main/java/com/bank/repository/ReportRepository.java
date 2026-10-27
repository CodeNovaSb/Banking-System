package com.bank.repository;

import com.bank.dto.BranchSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.bank.entity.Branch;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Branch, Integer> {

    // Count total customers
    @Query("SELECT COUNT(c) FROM Customer c")
    Long countTotalCustomers();

    // Count total accounts
    @Query("SELECT COUNT(a) FROM Account a")
    Long countTotalAccounts();

    // Count total branches
    @Query("SELECT COUNT(b) FROM Branch b")
    Long countTotalBranches();

    // Count total employees
    @Query("SELECT COUNT(e) FROM Employee e")
    Long countTotalEmployees();

    // Branch wise summary
    @Query("""
        SELECT new com.bank.dto.BranchSummaryDTO(
            b.branchName,
            b.city,
            COUNT(a),
            COALESCE(SUM(a.balance), 0)
        )
        FROM Branch b
        LEFT JOIN Account a ON a.branch.branchId = b.branchId
        GROUP BY b.branchName, b.city
    """)
    List<BranchSummaryDTO> getBranchSummary();
}