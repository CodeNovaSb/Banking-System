package com.bank.repository;

import com.bank.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    // Find all employees working at a specific branch
    List<Employee> findByBranch_BranchId(Integer branchId);
}