package com.bank.service;

import com.bank.entity.Employee;
import com.bank.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // GET ALL employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // GET employee by ID
    public Optional<Employee> getEmployeeById(Integer id) {
        return employeeRepository.findById(id);
    }

    // GET employees by branch ID
    public List<Employee> getEmployeesByBranchId(Integer branchId) {
        return employeeRepository.findByBranch_BranchId(branchId);
    }

    // CREATE employee
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }
}